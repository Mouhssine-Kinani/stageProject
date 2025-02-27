import { Router } from 'express';
import {Insertprovider, showProviders, deleteProvider, editProvider, showEditProviderPage} from '../../controllers/providers/providers.controller.js'
import upload from '../../middleware/upload.middleware.js'

const providerRoute = Router()


providerRoute.post('/providers/create', upload.single('logo'), Insertprovider);

providerRoute.get('/providers', showProviders)

providerRoute.delete('/providers/delete/:id', deleteProvider)

providerRoute.get('/providers/edit/:id', showEditProviderPage)

providerRoute.put('/providers/edit/:id', editProvider)


export default providerRoute