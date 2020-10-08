const Product = require('../Models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products',
            path: '/products'
        });
        }).catch(err => {
            console.log(err);
    });
};

exports.getProductDetails = (req, res, next) => {
    const productID = req.params.productID;
    Product.findByPk(productID).then(product => {
        res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' });
    }).catch(err => {
        console.log(err);
    });
};

exports.postCart = (req, res, next) => {
    const prodID = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart().then(cart => {
        fetchedCart = cart;
        return cart.getProducts({where:{id:prodID}})
    }).then(products => {
        let product;
        if (products.length > 0) {
            product = products[0];
        }
        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(prodID)
    }).then(product => {
        return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    }).then(() => {
        res.redirect('/cart')
    }).catch(err => {
        console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
        }).catch(err => {
            console.log(err);
    });
}
exports.getCart = (req, res, next) => {
    req.user.getCart().then(cart => {
        return cart.getProducts().then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
            
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
        
    });
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include:['products']}).then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Orders',
            orders:orders
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postCartDelete = (req, res, next) => {
    const prodID = req.body.productID;
    req.user.getCart().then(cart => {
        return cart.getProducts({ where: { id: prodID } });
    }).then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    }).then(() => {
        res.redirect('/cart')
    }).catch(err => {
        console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart().then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    }).then(products => {
        return req.user.createOrder().then(order => {
            order.addProducts(products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            }));
        }).catch(err => {
            console.log(err);
        });
    }).then(() => {
        return fetchedCart.setProducts(null);  
    }).then(() => {
        res.redirect('/orders');
    }).catch(err => {
        console.log(err);
    });
};

