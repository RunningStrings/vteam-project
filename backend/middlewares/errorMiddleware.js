const errorMiddleware = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.status || 500).json({
        "errors": [
            {
                "status": error.status,
                "detail": error.message
            }
        ]
    });
  };

export default errorMiddleware;
