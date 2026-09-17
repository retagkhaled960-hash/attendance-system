const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const [scheme, token] = (authHeader || '').split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.' });
    }       
};


const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {   
            return res.status(403).json(
                { message: 'Access denied. You do not have permission to access' });
        }
        next();
    };  
};


module.exports = {
     verifyToken,
     checkRole
    }; 

