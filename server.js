const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require("./models/productModel.js");
const port = 8000;

// middleware to send json
app.use(express.json());

// middleware to send forms
app.use(express.urlencoded({ extended: false }));

// homepage
app.get('/', (req, res) => {
    res.send(`Hello! Go to http://localhost:${port}/products to use the api`)
});

// get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get any specific product by id as parameter
app.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// push a new product
app.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message })
    }
});

// update a product
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if (!product) {
            return res.status(404).json({ message: `cannot find product with ID ${id}` });
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// delete a product
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: `cannot find product with ID ${id}` });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// connecting mongodb with nodejs
mongoose.connect('mongodb+srv://admin:admin123@cluster0.endbyu0.mongodb.net/practiceAPI?retryWrites=true&w=majority').then(() => {
    try {
        console.log("ConnecteD to MDB");
        app.listen(port, () => {
            console.log(`nodepr listening on port ${port}`)
        })
    } catch (err) {
        console.log(err);
    }
})