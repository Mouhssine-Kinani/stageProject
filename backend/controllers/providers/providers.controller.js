import mongoose  from "mongoose";
import Provider  from '../../models/Providers/provider.model.js';

export const Insertprovider = async (req, res, next)=>{
    
    // if (!req.file) {
    //     return res.status(400).json({ success: false, error: 'No file uploaded or file type not supported' });
    // }
    
    const mongoSession = await mongoose.startSession();
    
    try {
        const newProvider = new Provider({
            name: req.body.name,
            category : req.body.category,
            website : req.body.website,
        });
        if(req.file){
            newProvider.logo = req.file.path
        }
        
        await newProvider.save({ session: mongoSession });
        // await mongoSession.commitTransaction();
        res.status(201).send({message: 'emp added successfully'});
    } catch (error) {
        // await mongoSession.abortTransaction();
        next(error);
    }
    // console.log('Request Method:', req.method);
    // console.log('Request URL:', req.url);
    // console.log('Request Headers:', req.headers);
    // console.log('Request Body:', req.body);
    // res.status(201).send('Good JOb');

    // const session = provider.insertOne({})
}


export const showProviders = async (req, res, next)=>{
    try{
        const providers = await Provider.find()
        res.status(200).json(providers)
    }catch(err){
        next(err)
    }
}

export const deleteProvider = async(req, res, next) =>{
    try{
        const providerExist = await Provider.findById(req.params.id)
        if(!providerExist){
            return res.status(404).json({ message: 'Provider not found' })
        }
        Provider.findByIdAndDelete(req.params.id).then(res.status(200).json({ message: 'Provider deleted successfully' }))
    }catch(err){
        next(err)
    }
}

export const showEditProviderPage = async(req, res, next) =>{
    try {
        // returns the provider
        const providerExist = await Provider.findById(req.params.id);
        if (!providerExist) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        return res.status(200).json(providerExist);
    }catch(err){
        next(err)
    } 
}


export const editProvider = async(req, res, next) =>{
    const providerExist = await Provider.findById(req.params.id)
    if(!providerExist){
        return res.status(404).json({ message: 'Provider not found' })
    }
    const updatedProvider = {
        name: req.body.name,
        category : req.body.category,
        website : req.body.website,
        logo : req.body.logo
    }
    console.log(req.body.name)
    return res.status(200).json({
        success: true, 
        message: 'Provider is updated', 
        data: updatedProvider
    })

    Provider.findByIdAndUpdate(req.params.id, updatedProvider, {new: true}).then((newUpdatedProvider) => res.status(200).json({
        success: true, 
        message: 'Provider is updated', 
        data: newUpdatedProvider
    }))
}