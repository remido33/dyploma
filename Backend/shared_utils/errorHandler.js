
const errorHandler = (error, req, res, next) => {
    const status = error?.error?.status;
    console.log(req.route.path, error);
    return res.status(status || 500).json(error || 'Internal server error');
};

module.exports = errorHandler;