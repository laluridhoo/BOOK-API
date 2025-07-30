const errorResponse = (res, statusCode, message, errorCode = "GENERAL_ERROR", details = null) => {
  const errorObj = {
    success: false,
    message,
    error: {
      code: errorCode,
      details: details || message,
    },
  };

  return res.status(statusCode).json(errorObj);
};

module.exports = errorResponse;
