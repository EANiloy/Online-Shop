const Product = require('../Models/product');
const Cart = require('../Models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    });
};

exports.getProductDetails = (req, res, next) => {
    const productID = req.params.productID;
    Product.findByID(productID, product => {
        res.render('shop/product-detail', { product:product,pageTitle:product.title,path:'/products' })
    });
};

exports.postCart = (req, res, next) => {
    const prodID = req.body.productId;
    Product.findByID(prodID, (product) => {
        Cart.addProduct(prodID, product.price);
    });
    res.redirect('/cart');
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData:product,qty:cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            }); 
        });
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
        
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Orders'
        
    });
};

exports.postCartDelete = (req, res, next) => {
    const prodID = req.body.productID;
    Product.findByID(prodID, product => {
        Cart.deleteProduct(prodID, product.price);
        res.redirect('/cart');
    });
};