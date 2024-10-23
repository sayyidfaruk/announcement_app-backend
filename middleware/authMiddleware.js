const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) return res.status(401).json({ message: 'Access denied' });

    const token = authHeader.split(' ')[1]; 
    console.log(`token: ${token}`);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Token expired' });
        } else {
            res.status(400).json({ message: 'Invalid token' });
        }
    }
};

exports.verifyRole = (roles) => {
    return (req, res, next) => {
        const { role } = req.user;

        if (!roles.includes(role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }

        next();
    };
};