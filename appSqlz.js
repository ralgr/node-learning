const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// Handlebars
// const expressHbs = require('express-handlebars');

// >> SQLZ << 
const catchAllCtrlr = require('./controllers/catchAll');
const sequelize = require('./util/database');
// Required here to be related before syncing.
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


// 'app' Initialize a new object where express.js will store and manage various things BTS.
// 'app' is also a valid request handler, as such it is possible to register it as a request handler.
const app = express();

// Since Hbs is not built-in like Pug and Ejs, registering it as an engine is required.
// app.engine('hbs', expressHbs({layoutsDir: 'views/layouts', defaultLayout: 'main', extname: 'hbs'}))

// Setting a global configuration value on the express app that can be read using 'app.get'. 
// The code below will make use of reserved key names: 'views', 'view engine';
// 'view engine' is used to set the templating enging to be used for dynamic content. 
// Note that Pug is a built in engine, thus requiring minimal set-up.
// Calling res.render for responses will make use of the set templating engine.
app.set('view engine', 'ejs');

// Let express know where to find the 'views'.
// Finds views in a folder called views. The below code is used when the default is not ideal.
app.set('views', 'views')


// Exported to use the routes on the route folder.
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// 'use' method defined by the express framework.
// Allows the addition of a new middleware function.
// Can accept an array of request handlers or just one. There are more but are yet undiscussed.
// The request handlers will be executed for every request as said before.
// The example below is a simple introduction to the method.
// 'next' is a function that allows the passage of the request to continue.
// 'get' and 'post' methods used to check if the middleware should activate based on the method used.
// 'get' and 'post' requires the exact match of the route unlike 'use' where it only follows code order.

// Parser required to read the request body. Install 'body-parser'.
// Should be placed before any route managers to parse it before it continues through.
app.use(bodyParser.urlencoded({extended: false}));

// Serve files statically(not handled by the router or other middleware).
app.use(express.static(path.join(__dirname, 'public')));

// >> SQLZ MW <<
app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        // Creating a new field to the req object.
        // Careful on overwriting existing ones.
        req.user = user; // The full suite user; not just an object
        next();
    })
    .catch(err => {
        console.log(err);
    })
});

// Using the routes in the admin file.
// adminRoutes is a valid middleware.
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(catchAllCtrlr.catchAll);

// Relate models before sync here.
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'}) // User creating a product.
User.hasMany(Product); // User can have many products.
User.hasOne(Cart);
Cart.belongsTo(User);  
Cart.belongsToMany(Product, { through: CartItem }); // through points where conns. will be stored.
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });
User.hasMany(Order);

// Sync method looks at the models defined and then creates a table and relations for them.
// Only use force when in development to overwrite table with current settings.
sequelize.sync()
.then(result => {
    User.findByPk(1)
    .then(user => {
        if (!user) {
            return User.create({ name: 'User1', email: 'test@test.com' })
        }
        
        return user;
    })
    .then(user => { 
        Cart.findAll({ where: { userId: user.id } })
        .then(cart => {                       
            console.log('Checking for already created cart');
            if (cart.length < 1) {
                console.log('Initialized cart create');
                return user.createCart(); 
            }
            
            console.log('Cart data found');
            return user
        })
        .catch(err => console.log(err))
    })
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
})
.catch(err => console.log(err))
