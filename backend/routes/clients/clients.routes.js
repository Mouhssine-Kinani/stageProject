import { Router } from 'express';
import { createClient, getAllClients, deleteClient, updateClient, getClientById, showEditClientPage, getClientsCount, deleteProductFromClient } from '../../controllers/clients/clients.controller.js';
import upload from '../../middleware/upload.middleware.js';

const clientRoute = Router();

clientRoute.post('/clients/create', upload.single('logo'), createClient);

clientRoute.get('/clients', getAllClients);
clientRoute.get('/clients/count', getClientsCount);

clientRoute.get('/clients/:id', getClientById);

clientRoute.delete('/clients/delete/:id', deleteClient);

clientRoute.get('/clients/edit/:id', showEditClientPage);

clientRoute.put('/clients/edit/:id', updateClient);

// Ajout de la route pour supprimer un produit d'un client
clientRoute.delete('/clients/:clientId/product/:productId', deleteProductFromClient);




export default clientRoute;
