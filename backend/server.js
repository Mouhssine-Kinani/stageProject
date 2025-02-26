import userRouter from "./routes/Users/user.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import express from "express";
import { PORT } from "./config/env.js";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

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

// Route pour les utilisateurs
app.use("/app/users", userRouter);

// Middleware pour les erreurs
app.use(errorMiddleware);
// Démarrer le serveur
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;


