const errorResponse = require("../utils/errorResponse");

module.exports = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const validationErrors = {};
    Object.keys(err.errors).forEach((key) => {
      validationErrors[key] = err.errors[key].message;
    });

    return errorResponse(res, 400, "Validation failed", "VALIDATION_ERROR", validationErrors);
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, 400, `${field} already exists`, "DUPLICATE_KEY", `${field} must be unique`);
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === "CastError") {
    return errorResponse(res, 400, "Invalid ID format", "INVALID_ID", "The provided ID is not valid");
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, 401, "Invalid token", "INVALID_TOKEN", "The provided token is not valid");
  }

  // Handle JWT expiration errors
  if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "Token expired", "TOKEN_EXPIRED", "The provided token has expired");
  }

  // Default server error
  errorResponse(res, 500, "Internal Server Error", "SERVER_ERROR", process.env.NODE_ENV === "development" ? err.message : "Something went wrong");
};
