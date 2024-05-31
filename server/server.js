// 'use strict';
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const express = require('express');
const { sequelize, User, Post, Product, ShoppingCart, ShoppingCartDetail } = require('./models')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const env = process.env
const os = require('os');
const { comparePassword } = require('./utils/encript');
const multer = require('multer')
const path = require('path');
const PORT = 8080;
const HOST = '0.0.0.0';

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name
  }
  toJSON() {
    return { name: this.name, message: this.message }
  }
}
class CustomJsonWebTokenError extends jwt.JsonWebTokenError {
  constructor(message) {
    super(message);
    this.name = this.constructor.name
  }
};
class CustomTokenExpiredError extends jwt.TokenExpiredError {
  constructor(message) {
    super(message);
    this.name = this.constructor.name
  }
};
class InvalidAccessToken extends CustomJsonWebTokenError { };
class InvalidRefreshToken extends CustomJsonWebTokenError { };
class AccessTokenNoSet extends CustomJsonWebTokenError { };
class RefreshTokenNotSet extends CustomJsonWebTokenError { };

class ExpiredAccessToken extends CustomTokenExpiredError { };
class ExpiredRefreshToken extends CustomTokenExpiredError { };

class InvalidAtributesError extends CustomError { };
class NotAllowedType extends CustomError { };
class NotAdminError extends CustomError { };
class UserDoesNotExist extends CustomError { };
class UserExpired extends CustomError { };
class UserHasAnotherSession extends CustomError { };
class InvalidUserOrPassword extends CustomError { };
class CouldNotCheckCredentials extends CustomError { };
class AdminRequired extends CustomError { };


// App
const app = express();

// Add headers before the routes are defined
app.use(cors({
  credentials: true,
  origin: env.FRONT_HOST
}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', env.FRONT_HOST)
  next();
});

app.use(express.json());
app.use(cookieParser());
const public_root = 'public';
app.use(express.static(public_root));


const storage = (dest = "") => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(public_root, dest));
    },
    filename: (req, file, cb) => {
      const allowed_types = ['image/png', 'image/jpeg', 'application/pdf'];
      if (allowed_types.includes(file.mimetype)) {
        const name = Date.now() + "-" + uuidv4() + path.extname(file.originalname)
        req.injected = {}
        req.injected['filename'] = path.join(dest, name)
        cb(null, name);
      }
      else {
        cb(new NotAllowedType('This file type is not allowed'));
      }

    }
  })
}

const custom_upload = (field_name, mode, dest) => {
  const upload = multer({ storage: storage(dest) });
  return upload[mode](field_name);
};
let users_autenticated = {}


const modify_users_autenticated = async (key, value) => {
  users_autenticated[key] = value;
}

//compares the fields that should be present in the front form, against
//the valid keys
const check_fields_front = (fields_from_form, valid_keys) => {
  const obj_keys = Object.keys(fields_from_form);
  obj_keys.map((key) => {
    if (!valid_keys.has(key)) {
      throw new InvalidAtributesError("there are invalid attribute: " + key);
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


const verify_access_token_and_get_data = (req) => {
  const access_token = get_access_token_from_header(req)
  try {
    return jwt.verify(access_token, env.TOKEN_SECRET);
  }
  catch (error) {
    console.log(error, "verify_access_token_and_get_data")
    if (error instanceof jwt.TokenExpiredError) {
      throw new ExpiredAccessToken("The access token is expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new InvalidAccessToken("The access token is invalid");
    }
    else {
      throw error;
    }
  }

}

const get_access_token_from_header = (req) => {
  const c_e = new AccessTokenNoSet("There is no access token")
  if (Object.is(req.headers["authorization"], undefined)) {
    console.log("get_access_token_from_header", req.headers["authorization"])
    throw c_e;
  }
  try {
    if (!String(req.headers["authorization"]).toLocaleLowerCase().includes("bearer")) {
      throw c_e;
    }
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      throw c_e;
    }
    return token;
  }
  catch (error) {
    console.log(error)
    throw error;
  }

}

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
      data: { uuid: data.uuid, name: data.name, role: data.role },
    })
    res.json(new_access_token);
  }
  catch (err) {
    res = clear_cookies(res);
    console.log("handleRefreshToken", err)
    res.status(401);
    if (err instanceof jwt.TokenExpiredError) {
      err = new ExpiredRefreshToken("Expired refresh token");
    }
    else if (err instanceof jwt.JsonWebTokenError) {
      err = new InvalidRefreshToken("Invalid refresh token");
    }
    else {
      res.status(403)
      err = {
        "name": "handleRefreshToken problem",
        "message": "problem in handleRefreshToken"
      }
    }
    res.json(err);
  }
  return req, res;
}

//if the user is auth, injects the credentials to req.creds
async function isAuth(req, res, next) {
  const inject_creds_to_req = (data, req, res, next) => {
    req.creds = data;//inject creds to request
    return next();
  }
  try {
    const refresh_token = req.cookies.refresh_token
    const data = verify_access_token_and_get_data(req);
    const user = await User.findOne({
      where: { uuid: data.uuid }
    });
    if (!user) {
      throw new UserExpired("Invalid User")
    }
    else if (Object.is(refresh_token, undefined)) { ///////////########pendiente de revision
      throw new RefreshTokenNotSet("The refresh token is not set");
    }
    else if (!(users_autenticated[user.uuid] === refresh_token)) {
      throw new UserHasAnotherSession("The user is logged in in another session");
    }

    return inject_creds_to_req(data, req, res, next);
  } catch (err) {
    res.status(401)

    res.json(err)
    return res;
  }
}


//check connection
app.get('/check_connection', async (req, res) => {
  res.sendStatus(200);
});


//check if the user is auth
app.post('/check', isAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { uuid: req.creds.uuid }
    })
    res.json({ uuid: user.uuid, name: user.name, role: user.role })
  } catch (err) {
    console.log(err)
    res.status(500).json(new CouldNotCheckCredentials('the user is not logged'))
  }
  return res
})

//uploadTest
app.post('/uploadtest', isAuth, custom_upload("image", "single", "products"), async (req, res) => {
  try {
    res.status(200).json(req['injected']['filename'])
  }
  catch (error) {
    res.status(500).json({ name: error.name, message: error.message })
  }
  return res;
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
      throw new InvalidUserOrPassword("user or password don't match");

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


const admin_required = new AdminRequired("User must be an admin for use this function")
///////!!!!!!!!!!!!!!!!!!!!!! throw error if not admin or all conditions are not fullilled
const check_admin_and_conditions = (req, conditions) => {//#######revisar
  if (!(req.creds.role === 'admin') && !conditions.every(x => x)) {
    throw admin_required;
  }
}
///////////////////////crud user//////////////////////


//create user
app.post('/users', async (req, res) => {/////#pendiente de implementar roles permisos
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
    if (req.creds.role === "admin") {
      const users = await User.findAll({
        // include: ['posts', {
        //   model: ShoppingCart,
        //   as: "shoppingCart",
        //   include: ['products']
        // }],
        //raw: true // <--- HERE
      })
      res.json(users);
    }
    else {
      const user = await User.findOne({ where: { uuid: req.creds.uuid } })
      res.json([user])
    }
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Something whent wrong' })
  }
  return res
})


//update user
app.put('/users/:uuid', isAuth, async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const user_to_replace = req.body;
    check_admin_and_conditions(req, [req.creds.uuid === uuid]);
    const user = await User.findOne({
      where: { uuid }
    })
    if (!user)
      throw new UserDoesNotExist("The user doesn't exist");
    await user.update({ ...user_to_replace })
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
  return res
});


const find_user_plus_callback = async (req, res, callback_user) => {
  try {
    const uuid = req.params.uuid;
    check_admin_and_conditions(req, [req.creds.uuid === uuid]);
    const user = await User.findOne({
      where: { uuid }
    })
    if (!user)
      throw new UserDoesNotExist("The user doesn't exist");
    callback_user(user);
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
  return res
}

//delete user
app.delete('/users/:uuid', isAuth, async (req, res) => {
  return find_user_plus_callback(req, res, async (user) => { await user.destroy() });
});


//find user
app.get('/users/:uuid', isAuth, async (req, res) => {
  return find_user_plus_callback(req, res, () => { });
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
    console.log(err);
    res.status(500).json(err.errors)
  }
  return res
});


//create product
app.post('/products', isAuth, custom_upload("coverImage", "single", "products"), async (req, res) => {
  // const role = req.creds.role;
  const role = "admin";

  if (role === "admin") {
    const keys = new Set(["name", "description", "sku", "categoryId", "price", "coverImage"])
    try {
      check_fields_front(req.body, keys);
      product_fields = !req?.injected?.filename ? req.body : { ...req.body, coverImage: req.injected.filename };
      const product = await Product.create(product_fields);
      res.json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  else {
    const err = new NotAdminError("For this feature, you must be admin, your role is" + role)
    res.status(401).json(err);
  }
  return res;
});


// read products
app.get('/products', isAuth, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something whent wrong' });
  }
  return res;
})


// read products from shopping cart
app.get('/shoppingcart', isAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { uuid: req.creds.uuid },
    });

    const shopping_cart = await ShoppingCart.findOne({
      where: { userId: user.id },
      include: ['products'],
      order: [['products', 'id', 'DESC']]
    });
    let new_shopping_cart_products = []
    shopping_cart.products.map((product) => {
      const product_to_add = product.toJSON();
      product_to_add.quantity = product.ShoppingCartDetail.quantity
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
      where: { ProductId: product.id, ShoppingCartId: shopping_cart.id }
    })
    await shopping_cart_detail.destroy();
    res.json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err })
  }
  return res;
});


//create product to shopping cart
app.post('/shoppingcart/product', isAuth, async (req, res) => {
  const keys = new Set(["productUuid", "quantity"]);
  try {
    check_fields_front(req.body, keys);
    const user = await User.findOne({
      where: { uuid: req.creds.uuid },
    });

    const shopping_cart = await ShoppingCart.findOne({
      where: { userId: user.id },
    });
    const product = await Product.findOne({
      where: { uuid: req.body.productUuid },
    });
    const shopping_cart_detail = await ShoppingCartDetail.create({ "ShoppingCartId": shopping_cart.id, "ProductId": product.id, quantity: req.body.quantity });
    res.json(shopping_cart_detail);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
  return res;
});

app.put('/shoppingcart/product/change_quantity', isAuth, async (req, res) => {
  const keys = new Set(["uuid", "quantity"]);
  try {
    check_fields_front(req.body, keys);
    const user = await User.findOne({
      where: { uuid: req.creds.uuid },
    });
    const shopping_cart = await ShoppingCart.findOne({
      where: { userId: user.id },
    });
    const product = await Product.findOne({
      where: { uuid: req.body.uuid },
    });
    const shopping_cart_detail = await ShoppingCartDetail.findOne({where:{ ProductId: product.id, ShoppingCartId: shopping_cart.id }});
    await shopping_cart_detail.update({ ...shopping_cart_detail, quantity: req.body.quantity })

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

//deploying server
app.listen(PORT, HOST, async () => {
  console.log(`Running on http://${HOST}:${PORT}`);
  console.log(os.uptime());
  // await sequelize.sync({force: true});
  await sequelize.authenticate();
  console.log("Database Connected");
});