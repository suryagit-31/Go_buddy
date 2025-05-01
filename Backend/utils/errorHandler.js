function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log error in backend console
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : {}, // show stack trace only in dev
  });
}

export default errorHandler;
