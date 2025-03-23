import jwt from "jsonwebtoken";
import User from "../models/Users/user.model.js";

// Middleware to check if the user is logged in
export const verifyToken = async (req, res, next) => {
  try {
    console.log("[Auth] Verifying token");

    // Get the token from Authorization headers
    let token = null;

    // Check if the token is in the Authorization header
    if (req.headers.authorization) {
      // If the token is in the format "Bearer <token>"
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
      // If the token is sent directly without prefix
      else {
        token = req.headers.authorization;
      }
    }
    // Check other possible locations (compatibility)
    if (!token) {
      token = req.cookies.token || req.headers["x-auth-token"];
    }

    if (!token) {
      console.log("[Auth] No token found");
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    try {
      // Decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("[Auth] Token decoded successfully");

      // Find the user either by id (new structure) or by userId (old structure)
      const userId = decoded.id || decoded.userId;
      if (!userId) {
        console.log("[Auth] User ID not found in token");
        return res.status(401).json({
          success: false,
          message: "Invalid token - User ID missing",
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        console.log("[Auth] User not found after token decoding");
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Assign the user to the request
      req.user = user;
      console.log("[Auth] Token verified successfully");
      next();
    } catch (error) {
      console.error("[Auth] Token verification error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error("[Auth] Error in authentication middleware:", error.message);
    const err = new Error("Server error in authentication");
    err.statusCode = 500;
    next(err);
  }
};

export const verifyRole = (roles) => {
  return (req, res, next) => {
    try {
      console.log(
        `[Auth] Role verification. Required roles: ${roles.join(", ")}`
      );

      if (!req.user) {
        console.log("[Auth] User not authenticated for role verification");
        return res.status(401).json({
          success: false,
          message: "Authentication required before role verification",
        });
      }

      // Access the role name from the nested structure
      const userRole = req.user.role?.roleName;
      console.log(`[Auth] User role: ${userRole}`);

      if (!userRole || !roles.includes(userRole)) {
        console.log(`[Auth] Access denied. Insufficient permissions`);
        return res.status(403).json({
          success: false,
          message: "Access forbidden. Insufficient permissions.",
        });
      }

      console.log("[Auth] Role verification successful");
      next();
    } catch (error) {
      console.error("[Auth] Error while verifying permissions:", error.message);
      const err = new Error("Error while checking permissions");
      err.statusCode = 500;
      next(err);
    }
  };
};

// Alias for verifyToken for better semantics
export const protect = verifyToken;
