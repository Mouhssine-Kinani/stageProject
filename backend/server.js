import express from 'express'
import errorMiddleWare from './middleware/error.middleware.js'
import providerRoute from './routes/providers/providers.routes.js'
import connectDB from './config/db.js'
import userRouter from "./routes/Users/user.routes.js";
import { PORT } from "./config/env.js";
import cookieParser from "cookie-parser";

const app = express();

// Middleware pour analyser le corps de la requête en JSON
app.use(express.json()); // parse json bodies in requests
app.use(express.urlencoded({ extended: false })); // parse urlencoded bodies in requests
// parse cookies in requests
app.use(cookieParser());

// Route de test - Changed from app.use to app.get
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/', providerRoute)

// Route pour les utilisateurs
app.use("/app/users", userRouter);

app.use(errorMiddleWare)

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
