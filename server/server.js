// 'use strict';
const cors = require('cors');
const express = require('express');
const { sequelize, User, Post, Product, ShoppingCart, ShoppingCartDetail } = require('./models')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const env = process.env
const os = require('os');
const { comparePassword } = require('./src/encript');
const { error } = require('console');
const { Json } = require('sequelize/lib/utils');
const PORT = 8080;
const HOST = '0.0.0.0';

let users_autenticated = {}


const modify_users_autenticated = async (key, value) => {
  users_autenticated[key] = value;
}

// App
const app = express();


const check_keys = (obj, keys) => {
  const obj_keys = Object.keys(obj);
  obj_keys.map((key) => {
    if (!keys.has(key)) {
      throw { name: "InvalidAttributes", message: "there are invalid attribute: " + key };
    }
  });
}

const clear_cookies = (res) => {
  res.clearCookie("access_token");
  res.cookie('access_token', "", cookies_opt)
  res.clearCookie("refresh_token");
  res.cookie('refresh_token', "", cookies_opt)
  return res;
}


// const TryCatchWrapper = (target, propertyKey, descriptor) => {
//   const fn = descriptor.value;
//   descriptor.value = (...args) => {
//     try {
//       fn.apply(this, args);
//     } catch (error) {
//       throw (error);
//     }
//   };
//   return descriptor;
// };


// const TryCatchWrapperAs = (target, propertyKey, descriptor) => {
//   const fn = descriptor.value;
//   descriptor.value = async (...args) => {
//     try {
//       await fn.apply(this, args);
//     } catch (error) {
//       throw (error);
//     }
//   };
//   return descriptor;
// };


// const get_actual_user = async (req, res) => {
//   try {
//     const token = verify_token_from_req

//   }
//   catch (error) {
//     throw (error)
//   }

//   isAuth(req, res)

// }
// const get_actual_user = async (req) => {
//   try {
//     const token = verify_token_from_req(req);
//     const user_info = jwt.verify(token, env.TOKEN_SECRET);
//     const user = await User.findOne({ where: { uuid:user_info.uuid } })
//   }
//   catch (error) {
//     throw (error)
//   }
//   isAuth(req, res)

// }


const get_access_token_from_req = (req) => {
  const token = req.cookies.access_token;
  if (!token)
    throw {
      "name": "NoAccessTokenError",
      "message": "There is no access token"
    };
  return token;
}


// Add headers before the routes are defined
app.use(cors({
  credentials: true,
  origin: env.FRONT_HOST
}));

app.use(express.json());
app.use(cookieParser());

const cookies_opt = {
  secure: process.env.NODE_ENV !== "development",
  httpOnly: true,
  sameSite: process.env.NODE_ENV !== "development" ? 'none' : 'strict'
}


///create token
const create_token = async (obj) => {
  const expire = !isNaN(obj.expire) ? obj.expire : parseInt(env.DEFAULT_EXPIRE_TOKEN);
  obj.expire = expire;
  obj.type = obj.type ?? "access";
  try {
    const token = jwt.sign({
      ...obj.data
    }, env.TOKEN_SECRET, { expiresIn: obj.expire });
    return token;
  }
  catch (error) {
    console.log(error, obj);
    throw error;
  }

}


//handle token refresh
const handleRefreshToken = async (req, res) => {
  const refresh_token = req.cookies.refresh_token;
  try {
    const data = jwt.verify(refresh_token, env.TOKEN_SECRET);
    const new_access_token = await create_token({
      data: { uuid: data.uuid, name: data.name },
    })
    res.cookie('access_token', new_access_token, cookies_opt);
    res.json();
  }
  catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      res.status(401);
      err = {
        "name": "InvalidRefreshToken",
        "message": "invalid refresh token"
      }
      res = clear_cookies(res);
    }
    else
      res.status(403);
    res.json(err);
  }
  return req, res;
}


//middleware for check if is auth
async function isAuth(req, res, next) {
  const inject_creds_to_req = (data, req, res, next) => {
    req.creds = data;//inject creds to request
    return next();
  }
  try {
    const token = get_access_token_from_req(req);
    const data = jwt.verify(token, env.TOKEN_SECRET);
    if (!(users_autenticated[data.uuid] === req.cookies.refresh_token)) {
      throw {
        "name": "UserHasAnotherSession",
        "message": "The user is logged in in another session"
      }

    }

    const user = await User.findOne({
      where: { uuid: data.uuid }
    })

    if (!user) {
      throw {
        "name": "UserExpired",
        "message": "Invalid User"
      }
    }
    return inject_creds_to_req(data, req, res, next);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      res.status(401);
      err = {
        "name": "InvalidAccessToken",
        "message": "Invalid access token"
      }
    }
    else
      res.status(403)
    res.json(err)
    return res;
  }
}


//find user
app.get('/check_connection', async (req, res) => {
  // console.log("checking conection")
  res.sendStatus(200);
});


//check if is auth the user
app.post('/check', isAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { uuid: req.creds.uuid }
    })
    res.json({ uuid: user.uuid, name: user.name, role: user.role })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Something whent wrong' })
  }
  return res
})


//refresh auth token
app.post('/refresh', async (req, res) => {
  req, res = handleRefreshToken(req, res)
  return res;
});


//login user
app.post('/login', async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ where: { email } })
    const valid_password = await comparePassword(password, user.password);
    if (!valid_password)
      throw { errors: "user or password don't match" };

    const get_user_data_token = (user) => {
      return {
        name: user.name,
        uuid: user.uuid,
        role: user.role,
      }

    }
    const access_token = await create_token({
      data: get_user_data_token(user)
    })
    const refresh_token = await create_token({
      data: get_user_data_token(user),
      type: "refresh",
      expire: parseInt(env.DEFAULT_EXPIRE_REFRESH_TOKEN)
    })
    modify_users_autenticated(user.uuid, refresh_token);
    // console.log(users_autenticated, "usuarios autenticados");
    res.cookie('access_token', access_token, cookies_opt);
    res.cookie('refresh_token', refresh_token, cookies_opt);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.errors)
  }
  return res;
});


//logout user
app.get('/logout', isAuth, async (req, res) => {
  res = clear_cookies(res);
  res.end();
});


///////////////////////crud user//////////////////////
//create user
app.post('/users', async (req, res) => {
  const { name, password, email, role } = req.body;
  try {
    const user = await User.create({ name, password, email, role: "user" });
    await ShoppingCart.create({ name: "Shopping cart", description: "this is shopping cart", userId: user.id });

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.errors);
  }
  return res;
});


// read user
app.get('/users', isAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      include: ['posts', {
        model: ShoppingCart,
        as: "shoppingCart",
        include: ['products']
      }],
      //raw: true // <--- HERE
    })
    res.json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Something whent wrong' })
  }
  return res
})


//update user
app.put('/users/:uuid', isAuth, async (req, res) => {
  const uuid = req.params.uuid;
  const user_to_replace = req.body;
  try {
    const user = await User.findOne({
      where: { uuid }
    })
    if (!user)
      throw "something went wrong"
    await user.update({ ...user_to_replace })
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
  return res
});


//delete user
app.delete('/users/:uuid', isAuth, async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const user = await User.findOne({
      where: { uuid }
    })
    if (!user)
      throw "something went wrong"

    await user.destroy();
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
  return res
});


//find user
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
  return res;
});


app.get('/posts', async (req, res) => {
  try {
    // const posts = await Post.findAll({include: [User]});
    // const posts = await Post.findAll({
    //   include: ['user'],
    //   //raw: true // <--- HERE

    // });
    const users = await User.findAll({
      include: ['posts'],
      //raw: true // <--- HERE
    })
    res.json(users)
    // res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json(err.errors)
  }
  return res
});


//create product
app.post('/products', isAuth, async (req, res) => {
  const keys = new Set(["name", "description", "sku", "categoryId", "price"])
  try {
    check_keys(req.body, keys);
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
  return res;
});


// read products
app.get('/products', isAuth, async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Something whent wrong' })
  }
  return res
})


// create shopping cart
// app.post('/shoppingcarts', isAuth, async (req, res) => {
//   const keys = new Set(["name", "description"])
//   try {
//     console.log(req.creds.uuid, "creds injected")
//     const user = await User.findOne({
//       where: { uuid: req.creds.uuid }
//     });
//     console.log("this is user", user);
//     check_keys(req.body, keys);
//     const shopping_cart = await ShoppingCart.create({ ...req.body, userId: user.id });
//     res.json(shopping_cart);
//   } catch (err) {
//     res.status(500).json(err);
//   }
//   return res;
// });


// read products from shopping cart
app.get('/shoppingcart', isAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { uuid: req.creds.uuid },
    });

    const shopping_cart = await ShoppingCart.findOne({
      where: { userId: user.id },
      include: ['products']
    });
    let new_shopping_cart_products = []
    shopping_cart.products.map((product)=>{
      const product_to_add = product.toJSON();
      product_to_add.cantidad = product.ShoppingCartDetail.cantidad
      delete product_to_add.ShoppingCartDetail
      new_shopping_cart_products.push(product_to_add)      
    })
    res.json(new_shopping_cart_products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something whent wrong' });
  }
  return res;
})

//delete product from shopping cart
app.delete('/shoppingcart/:productUuid', isAuth, async (req, res) => {
  const uuid = req.params.productUuid;
  try {
    const user = await User.findOne({
      where: { uuid: req.creds.uuid },
    });
    const shopping_cart = await ShoppingCart.findOne({
      where: { userId: user.id },
    });
    const product = await Product.findOne({
      where: { uuid: uuid },
    });
    const shopping_cart_detail = await ShoppingCartDetail.findOne({
      where: { ProductId:product.id, ShoppingCartId:shopping_cart.id }
    })

    await shopping_cart_detail.destroy();
    res.json()
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
  return res
});


//create product to shopping cart
app.post('/shoppingcartsdetails', isAuth, async (req, res) => {
  const keys = new Set(["productUuid", "cantidad"]);
  try {
    check_keys(req.body, keys);
    const user = await User.findOne({
      where: { uuid: req.creds.uuid },
    });

    const shopping_cart = await ShoppingCart.findOne({
      where: { userId: user.id },
    });
    const product = await Product.findOne({
      where: { uuid: req.body.productUuid },
    });
    const shopping_cart_detail = await ShoppingCartDetail.create({ "ShoppingCartId": shopping_cart.id, "ProductId": product.id, cantidad: req.body.cantidad });
    res.json(shopping_cart_detail);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
  return res;
});


// Valid
function sum(a, b) {
  return a + b;
}
module.exports.sum = sum;

// if (require.main === module) {
//   main();
// }


//deploying server
app.listen(PORT, HOST, async () => {
  console.log(`Running on http://${HOST}:${PORT}`);
  console.log(os.uptime());
  await sequelize.sync({force: true});
  await sequelize.authenticate();
  console.log("Database Connected");
});