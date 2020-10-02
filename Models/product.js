const fs = require('fs');
const path = require('path');
const Cart = require('./cart');
const dir = path.join(path.dirname(process.mainModule.filename),
    'Data',
    'products.json');
    
const helperFileHandler=(callBack) => {
    fs.readFile(dir, (err, fileContent) => {
        if (err) {
           return callBack([]);
        }
        return callBack(JSON.parse(fileContent));
    });
}

module.exports = class Product{
    constructor(id,title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description=description ;
        this.price = price;
    }

    save() {
        helperFileHandler(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(dir, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            }
            else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(dir, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static deleteByID(id) {
        helperFileHandler(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(dir, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id,product.price);
                }
            })
        });
    }

    static fetchAll(callBack) {
        helperFileHandler(callBack);
    }

    static findByID(id, cb) {
        helperFileHandler(products => {
            const product = products.find(prod => prod.id === id);
            cb(product);
        });
    }
}