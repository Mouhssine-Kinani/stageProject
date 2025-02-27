import { Router } from 'express';
import { createClient, getAllClients, deleteClient, updateClient, getClientById, showEditClientPage } from '../../controllers/clients/clients.controller.js';
import upload from '../../middleware/upload.middleware.js';

const clientRoute = Router();

clientRoute.post('/clients/create', upload.single('logo'), createClient);

clientRoute.get('/clients', getAllClients);

clientRoute.get('/clients/:id', getClientById);

clientRoute.delete('/clients/delete/:id', deleteClient);

clientRoute.get('/clients/edit/:id', showEditClientPage);

clientRoute.put('/clients/edit/:id', updateClient);

export default clientRoute;
