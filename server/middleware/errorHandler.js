export default function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500
  const isProduction = process.env.NODE_ENV === 'production'

  if (!isProduction) {
    console.error(error)
  }

  res.status(statusCode).json({
    success: false,
    message: error.isOperational ? error.message : 'An unexpected server error occurred.',
    ...(isProduction ? {} : { stack: error.stack }),
  })
}
