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
        res.status(201).json({ success: true, message: 'Product added successfully', data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const showProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const products = await Product.find().skip(skip).limit(limit);
        if (!products) {
            return res.status(404).json({ success: false, message: 'Products not found', data: null });
        }
        res.status(200).json({ success: true, message: 'Products retrieved successfully', data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const productExist = await Product.findById(req.params.id);
        if (!productExist) {
            return res.status(404).json({ success: false, message: 'Product not found', data: null });
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Product deleted successfully', data: productExist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const showEditProductPage = async (req, res, next) => {
    try {
        const productExist = await Product.findById(req.params.id);
        if (!productExist) {
            return res.status(404).json({ success: false, message: 'Product not found', data: null });
        }
        return res.status(200).json({ success: true, message: 'Product retrieved successfully', data: productExist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const editProduct = async (req, res, next) => {
    try {
        const productExist = await Product.findById(req.params.id);
        if (!productExist) {
            return res.status(404).json({ success: false, message: 'Product not found', data: null });
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
        res.status(200).json({ success: true, message: 'Product updated successfully', data: newUpdatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const countProducts = async (req, res, next) => {
    try {
        const totalProducts = await Product.countDocuments();
        const today = new Date();
        const plus31Days = new Date();
        plus31Days.setDate(today.getDate() + 31);

        const activeProducts = await Product.countDocuments({
            date_fin: { $gt: plus31Days }
        });

        const expiringSoonProducts = await Product.countDocuments({
            date_fin: { $lte: plus31Days, $gt: today }
        });

        const expiredProducts = await Product.countDocuments({
            date_fin: { $lte: today }
        });

        res.status(200).json({
            totalProducts,
            activeProducts,
            expiringSoonProducts,
            expiredProducts
        });
    } catch (error) {
        next(error);
    }
};
