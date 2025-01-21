const setHeader = (req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    // res.setHeader('Content-Type', 'application/json');
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, POST, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    next();
};

export default setHeader;
