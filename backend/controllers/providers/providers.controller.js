import mongoose  from "mongoose";
import Provider  from '../../models/Providers/provider.model.js';

export const Insertprovider = async (req, res, next)=>{
    const mongoSession = await mongoose.startSession();

    try {
        const newProvider = new Provider(req.body);
        // 
        await newProvider.save({ session: mongoSession });
        // await mongoSession.commitTransaction();
        res.status(201).send(newProvider);
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