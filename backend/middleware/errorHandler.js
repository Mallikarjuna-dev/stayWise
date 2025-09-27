const errorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};

module.exports = { errorHandler };
