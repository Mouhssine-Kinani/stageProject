import { Router } from 'express';
import {Insertprovider, showProviders, deleteProvider, editProvider, showEditProviderPage} from '../../controllers/providers/providers.controller.js'
import upload from '../../middleware/upload.middleware.js'

const providerRoute = Router()

providerRoute.post('/providers/create', upload.single('logo'), Insertprovider);
// providerRoute.post('/providers/create', upload.single('logo'), (req, res) =>{
//     console.log(req.file);
//     if (!req.file) {
//       return res.status(400).json({ error: 'File upload failed' });
//     }
//     res.json({ message: 'Upload successful', file: req.file });
// });

providerRoute.get('/providers', showProviders)
 
providerRoute.delete('/providers/delete/:id', deleteProvider)

providerRoute.get('/providers/edit/:id', showEditProviderPage)

providerRoute.put('/providers/edit/:id', editProvider)
// providerRoute.put('/providers/edit/:id', (req, res)=>{
//     console.log(req.params.id)
//     console.log(req.body.name)
// })


export default providerRoute