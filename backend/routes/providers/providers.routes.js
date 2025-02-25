import { Router } from 'express';
import {Insertprovider, showProviders} from '../../controllers/providers/providers.controller.js'

const providerRoute = Router()

providerRoute.post('/providers/create', Insertprovider)

providerRoute.get('/providers', showProviders)


export default providerRoute