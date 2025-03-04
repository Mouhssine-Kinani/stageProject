import express from 'express'
import errorMiddleWare from './middleware/error.middleware.js'
import providerRoute from './routes/providers/providers.routes.js'
import productRoute from './routes/Products/products.routes.js'
import clientRoute from './routes/clients/clients.routes.js'
import connectDB from './config/db.js'
import userRouter from "./routes/Users/user.routes.js";
import { PORT } from "./config/env.js";
import cookieParser from "cookie-parser";
import authRouter from './routes/Auth/auth.routes.js'

const app = express();

// Middleware pour analyser le corps de la requête en JSON
app.use(express.json()); // parse json bodies in requests
app.use(express.urlencoded({ extended: false })); // parse urlencoded bodies in requests
app.use(errorMiddleWare)
// parse cookies in requests
app.use(cookieParser());

// Route de test - Changed from app.use to app.get
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/', providerRoute)
app.use('/', productRoute)
app.use('/', clientRoute)

// Route pour les utilisateurs
app.use("/users", userRouter);
// auth
app.use('/auth', authRouter)


// Démarrer le serveur
app.listen(PORT, async () => {
    try {
      await connectDB()
      console.log(`Server running at http://localhost:${PORT}`);
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err.message);
      process.exit(1)
    }
  });

export default app;


