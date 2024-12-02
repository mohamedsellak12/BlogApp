
const jwt=require("jsonwebtoken");
const blacklist=new Set()
exports.authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Access token missing or invalid' });
    }

    try {
        const decoded = jwt.verify(token, 'jwt_secret'); 
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

exports.isTokenBlacklisted=(req, res ,next) => {
    const token = req.headers.authorization?.split('')[1];

    if(blacklist.has(token)){
        
        return res.status(403).json({message: 'Token is blacklisted'});
    }
    next();
}

