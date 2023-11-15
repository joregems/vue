// 'use strict';
const cors = require('cors');
const express = require('express');
const { sequelize, User, Post } = require('./models')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const env = process.env
const os = require('os');
const { hashPassword, comparePassword } = require('./src/encript')
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
// Add headers before the routes are defined
app.use(cors({
  credentials: true,
  origin: 'http://192.168.0.91:5173'

}));

app.use(express.json());
app.use(cookieParser());
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });
// app.get('/about', (req, res) => {
//   res.send('chesss!!!');
// });

const create_token = async (obj) => {
  obj.expire = obj.expire ?? 30
  obj.type = obj.type ?? "access"
  const token = jwt.sign({
    ...obj.data
  }, env.TOKEN_SECRET, { expiresIn: obj.expire })
  return token
}

const handleRefreshToken = async (req, res) => {
  const token = req.cookies.refresh_token;
  try {
    const data = jwt.verify(token, env.TOKEN_SECRET);
    const access_token = await create_token({
      data: { uuid: data.uuid, name: data.name },
      // expire:30
    })
    res.cookie('access_token', access_token);
    res.json()
  }
  catch (err){
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError)
      res.status(401)
    else
    res.status(403)
  res.json(err)
  }
  return req, res
}

async function isAuth(req, res, next) {
  const all_correct = (data, req, res, next) => {
    req.creds = data;
    return next();
  }
  const token = req.cookies.access_token;
  try {
    if (!token)
      throw "there is no access token";
    const data = jwt.verify(token, env.TOKEN_SECRET);
    return all_correct(data, req, res, next);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError)
      res.status(401)
    else
    res.status(403)
  res.json(err)
    return res;
  }
}

app.post('/users', async (req, res) => {
  const { name, password, email, role } = req.body;
  try {
    const hash = await hashPassword(password);
    const user = await User.create({ name, password: hash, email, role });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.errors);
  }
  return res
});
app.post('/posts', async (req, res) => {
  const { body, userUuid } = req.body;
  try {
    const user = await User.findOne({ where: { uuid: userUuid } });
    const post = await Post.create({ body, userId: user.id });
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.errors);
  }
  return res
});
app.post('/refresh', async (req, res) => {
  req, res = handleRefreshToken(req, res)
  return res;
});
app.post('/login', async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ where: { email } })
    const valid_password = await comparePassword(password, user.password);
    if (!valid_password)
      throw { errors: "user or password don't match" };

    const data = {
        name: user.name,
        uuid: user.uuid
      }
    const access_token = await create_token({
      data: {
        name: user.name,
        uuid: user.uuid
      }
    })
    const refresh_token = await create_token({
      data: {
        name: user.name,
        uuid: user.uuid
      },
      type: "refresh",
      expire: 24 * 60 * 60
    })
    res.cookie('access_token', access_token, {
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true
    });
    res.cookie('refresh_token', refresh_token, {
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true
    });
    res.json(user)
  } catch (err) {
    console.log(err);
    res.status(500).json(err.errors)
  }
  return res;
});

app.get('/posts', async (req, res) => {
  try {
    // const posts = await Post.findAll({include: [User]});
    const posts = await Post.findAll({ include: ['user'] });
    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json(err.errors)
  }
  return res
});

app.get('/users', isAuth, async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Something whent wrong' })
  }
  return res
})

app.get('/check', isAuth, async (req, res) => {
  try {
    res.json(req.creds)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Something whent wrong' })
  }
  return res
})

app.get('/users/:uuid', async (req, res) => {
  const uuid = req.params.uuid
  try {
    const user = await User.findOne({
      where: { uuid }
    })
    if (!user)
      throw "something went wrong"

    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
  return res
});

// Valid

function sum(a, b) {
  return a + b;
}
module.exports.sum = sum;

// if (require.main === module) {
//   main();
// }

app.listen(PORT, HOST, async () => {
  console.log(`Running on http://${HOST}:${PORT}`);
  console.log(os.uptime())
  // await sequelize.sync({force: true});
  await sequelize.authenticate()
  console.log("Database Connected")
});