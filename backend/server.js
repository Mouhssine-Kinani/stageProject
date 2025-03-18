import express from 'express';
import errorMiddleWare from './middleware/error.middleware.js';
import providerRoute from './routes/providers/providers.routes.js';
import productRoute from './routes/Products/products.routes.js';
import clientRoute from './routes/clients/clients.routes.js';
import connectDB from './config/db.js';
import userRouter from "./routes/Users/user.routes.js";
import { PORT, FRONT_END_URL } from "./config/env.js";
import cookieParser from "cookie-parser";
import authRouter from './routes/Auth/auth.routes.js';
import cors from 'cors';

const app = express();

app.use(cookieParser()); // Middleware to parse cookies

// Configure CORS to allow requests from your frontend and include credentials
app.use(cors({
  origin: FRONT_END_URL, // Replace with your frontend URL
  credentials: true,  // Allow cookies
}));

// Parse JSON bodies in requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes for authentication and users
app.use('/auth', authRouter);
app.use("/users", userRouter);

// Other routes
app.use('/', providerRoute);
app.use('/', productRoute);
app.use('/', clientRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Middleware for error handling (should be last)
app.use(errorMiddleWare);

// Start the server
app.listen(PORT, async () => {
    try {
      await connectDB();
      console.log(`Server running at http://localhost:${PORT}`);
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err.message);
      process.exit(1);
    }
});

export default app;
