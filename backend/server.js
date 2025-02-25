
const express = require('express');

const app = express();
const PORT = 8002; // or whatever port you're using now

// Middleware pour analyser le corps de la requête en JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route de test - Changed from app.use to app.get
app.get("/", (req, res) => {
    res.send("Hello World");
});


// app.use("/api/users", );

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;