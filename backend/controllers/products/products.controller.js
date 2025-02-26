import mongoose from "mongoose";
import Product from '../../models/Products/product.model.js';

export const insertProduct = async (req, res, next) => {
    try {
        const newProduct = new Product({
            productName: req.body.productName,
            category: req.body.category,
            billing_cycle: req.body.billing_cycle,
            price: req.body.price,
            type: req.body.type,
            productAddedDate: req.body.productAddedDate,
            productDeployed: req.body.productDeployed,
            date_fin: req.body.date_fin,
            website: req.body.website,
            provider: req.body.provider
        });

        await newProduct.save();
        res.status(201).send({ message: 'Product added successfully', data: newProduct });
    } catch (error) {
        next(error);
    }
};

export const showProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        if (!products) {
            return res.status(404).json({ message: 'Products not found' });
        }
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const productExist = await Product.findById(req.params.id);
        if (!productExist) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const showEditProductPage = async (req, res, next) => {
    try {
        const productExist = await Product.findById(req.params.id);
        if (!productExist) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(productExist);
    } catch (error) {
        next(error);
    }
};

export const editProduct = async (req, res, next) => {
    try {
        const productExist = await Product.findById(req.params.id);
        if (!productExist) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = {
            productName: req.body.productName,
            category: req.body.category,
            billing_cycle: req.body.billing_cycle,
            price: req.body.price,
            type: req.body.type,
            productAddedDate: req.body.productAddedDate,
            productDeployed: req.body.productDeployed,
            date_fin: req.body.date_fin,
            website: req.body.website,
            provider: req.body.provider
        };

        const newUpdatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
        res.status(200).json({
            success: true,
            message: 'Product is updated',
            data: newUpdatedProduct
        });
    } catch (error) {
        next(error);
    }
};