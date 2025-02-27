import Provider from '../../models/Providers/provider.model.js';

export const Insertprovider = async (req, res, next) => {
    try {
        const newProvider = new Provider({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            region: req.body.region,
            renewal_status: req.body.renewal_status,
            products: req.body.products
        });

        if (req.file) {
            newProvider.logo = req.file.path;
        }

        await newProvider.save();
        res.status(201).json({ success: true, message: 'Provider added successfully', data: newProvider });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const showProviders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const providers = await Provider.find().skip(skip).limit(limit);
        if (!providers) {
            return res.status(404).json({ success: false, message: 'Providers not found', data: null });
        }
        res.status(200).json({ success: true, message: 'Providers retrieved successfully', data: providers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const deleteProvider = async (req, res, next) => {
    try {
        const providerExist = await Provider.findById(req.params.id);
        if (!providerExist) {
            return res.status(404).json({ success: false, message: 'Provider not found', data: null });
        }
        await Provider.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Provider deleted successfully', data: providerExist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const showEditProviderPage = async (req, res, next) => {
    try {
        const providerExist = await Provider.findById(req.params.id);
        if (!providerExist) {
            return res.status(404).json({ success: false, message: 'Provider not found', data: null });
        }
        return res.status(200).json({ success: true, message: 'Provider retrieved successfully', data: providerExist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};

export const editProvider = async (req, res, next) => {
    try {
        const providerExist = await Provider.findById(req.params.id);
        if (!providerExist) {
            return res.status(404).json({ success: false, message: 'Provider not found', data: null });
        }

        const updatedProvider = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            region: req.body.region,
            renewal_status: req.body.renewal_status,
            products: req.body.products
        };

        if (req.file) {
            updatedProvider.logo = req.file.path;
        }

        const newUpdatedProvider = await Provider.findByIdAndUpdate(req.params.id, updatedProvider, { new: true });
        res.status(200).json({ success: true, message: 'Provider updated successfully', data: newUpdatedProvider });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, data: null });
    }
};