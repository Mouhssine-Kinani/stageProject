import express from "express";
import errorMiddleWare from "./middleware/error.middleware.js";
import providerRoute from "./routes/providers/providers.routes.js";
import productRoute from "./routes/products/products.routes.js";
import clientRoute from "./routes/clients/clients.routes.js";
import connectDB from "./config/db.js";
import userRouter from "./routes/Users/user.routes.js";
import { PORT, FRONT_END_URL, COOKIE_DOMAIN } from "./config/env.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/Auth/auth.routes.js";
import cors from "cors";
import { checkExpirations } from "./services/expirationChecker.js";

const app = express();

app.use(cookieParser()); // Middleware to parse cookies

// Configure CORS to allow requests from multiple origins with credentials
app.use(
  cors({
    origin: function (origin, callback) {
      // Whitelist of allowed origins
      const allowedOrigins = [
        FRONT_END_URL,
        // Ajoutez d'autres origines autorisées au besoin
        // Exemple: "https://app.example.com", "https://admin.example.com"
      ];

      // Pour le développement local
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`Origin ${origin} not allowed by CORS`);
        // En production, n'autorisez que les origines dans la liste blanche
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "x-auth-token",
    ],
    exposedHeaders: ["set-cookie"],
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

// Schedule expiration checks to run daily at midday (12:00 PM)
const scheduleExpirationChecks = () => {
  const now = new Date();
  const noon = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    12,
    0,
    0 // 12:00 PM
  );

  // If it's already past noon, schedule for tomorrow at noon
  if (now > noon) {
    noon.setDate(noon.getDate() + 1);
  }

  const timeToNoon = noon - now;

  // First run at next noon
  setTimeout(() => {
    checkExpirations();
    // Then run every 24 hours
    setInterval(checkExpirations, 24 * 60 * 60 * 1000);
  }, timeToNoon);
};

// checkExpirations();
// let backend dynamically assigns a port
const serverPORT = process.env.PORT || 5000;
// Démarrer le serveur
app.listen(serverPORT, async () => {
  try {
    await connectDB();
    console.log(`Server running at ${PORT}`);
    // Start the expiration checker scheduler
    scheduleExpirationChecks();
    console.log("Expiration checker scheduled to run daily at noon");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
});

export default app;
