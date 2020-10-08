const Product = require('../Models/product');
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }).then(() => {
        res.redirect('/admin/products');
    }).catch(err=> {
        console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const productID = req.params.productID;
    req.user.getProducts({where:{id:productID}})
    //Product.findByPk(productID)
        .then(products => {
        if (!products[0]) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: products[0]
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
    const prodID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    Product.findByPk(prodID).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        return product.save();
    }).then(() => {
        res.redirect('/admin/products')
    }).catch(err => {
        console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodID = req.body.productID;
    Product.destroy({ where: { id: prodID } }).then(result => {
    res.redirect('/admin/products');
    console.log("Product Destroyed")    
    }).catch(err => {
        console.log(err);
    });
}
exports.getProducts = (req, res, next) => {
    req.user.getProducts().then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    }).catch(err => {
        console.log(err);
    });
};