const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();

//Set EJS as render engine
app.set('view engine', 'ejs');
app.set('views', 'Views');

///My imports
const adminRoutes = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');
const errorController = require('./Controllers/error');

//MY Models
const Product = require('./Models/product');
const User = require('./Models/user');
const Cart = require('./Models/cart');
const CartItem = require('./Models/cart-item');
const Order = require('./Models/order');
const OrderItem = require('./Models/order-item');

//Associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});

//Middleware to find user by ID
app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(err => {
        console.log(err);
    }); 
});


//Routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

//Database Work and starting the program
const sequelize = require('./Helpers/database');
sequelize.sync({force:true}).then(()=> {
    return User.findByPk(1);
}).then(user => {
    if (!user) {
        return User.create({ name: 'First User', email: 'test@shop.com' });
    }
    return user;
}).then(user => {
    //App Listening port
    return user.createCart();
    
}).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});