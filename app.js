const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const catchAllCtrlr = require('./controllers/catchAll');
const User = require('./models/users');

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

// app.use((req, res, next) => {
//     User.findById('5dd01a14161ec85f9487b452')
//     .then(user => {                
//         // Creating a new field to the req object.
//         // Careful on overwriting existing ones.
//         req.user = new User(user.name, user.email, user.cart); // The full suite user; not just an object
//         req.userId = user._id;

//         next();
//     })
//     .catch(err => {
//         console.log(err);
//     })
// });

// Using the routes in the admin file.
// adminRoutes is a valid middleware.
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(catchAllCtrlr.catchAll);

mongoose.connect(
    'mongodb+srv://ralgr:Uks26mfnCm9iLpcw@cluster0-hxxdm.mongodb.net/shop?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}
)
.then(() => {
    app.listen(3000);
})
.catch(err => console.log(err));