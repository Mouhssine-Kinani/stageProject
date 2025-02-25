import express from 'express'
import errorMiddleWare from './middleware/error.middleware.js'
import providerRoute from './routes/providers/providers.routes.js'
import connectDB from './config/db.js'

const app = express();
const PORT = 5500;

// Middleware pour analyser le corps de la requête en JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route de test - Changed from app.use to app.get
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/', providerRoute)

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