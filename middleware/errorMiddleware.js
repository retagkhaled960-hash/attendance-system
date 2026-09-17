const errorhandler = (err, req, res, next) => {
        // Express starts every response with 200. Do not report unhandled errors as success.
        const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

        res.status(statusCode).json({
            success: false,
            message: err.message || 'Internal Server Error',
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        });
    };
    
module.exports = errorhandler;


