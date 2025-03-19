import express from "express";
import errorMiddleWare from "./middleware/error.middleware.js";
import providerRoute from "./routes/providers/providers.routes.js";
import productRoute from "./routes/products/products.routes.js";
import clientRoute from "./routes/clients/clients.routes.js";
import connectDB from "./config/db.js";
import userRouter from "./routes/Users/user.routes.js";
import { PORT, FRONT_END_URL } from "./config/env.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/Auth/auth.routes.js";
import cors from "cors";

const app = express();

app.use(cookieParser()); // Middleware to parse cookies

// Configure CORS to allow requests from multiple origins with credentials
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow requests from any origin
      return callback(null, true);
    },
    credentials: true, // Allow cookies
  })
);

app.use("/uploads", express.static("uploads"));

// Parse JSON bodies in requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes for authentication and users
app.use("/auth", authRouter);
app.use("/users", userRouter);

// Other routes
app.use("/", providerRoute);
app.use("/", productRoute);
app.use("/", clientRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Middleware for error handling (should be last)
app.use(errorMiddleWare);

// Route pour les utilisateurs
app.use("/users", userRouter);
// auth
app.use("/auth", authRouter);

// let backend dynamically assigns a port
const serverPORT = process.env.PORT || 5000;
// Démarrer le serveur
app.listen(serverPORT, async () => {
  try {
    await connectDB();
    console.log(`Server running at ${PORT}`);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
});

export default app;
