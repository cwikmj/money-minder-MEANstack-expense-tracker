const jwt = require('jsonwebtoken');
const { encrypt, decrypt } = require('./hash')
const userModel = require('../models/user')

const authenticate = async (req, res, next) => {
    try {
        const tokenEncrypted = req.headers.authorization.replace('Bearer ', '').trim();
        const user = await userModel.findOne({
            'tokens.0.token': tokenEncrypted,
            'tokens.0.expiresAt': { $gte: new Date() }
        });

        if (user !== null && user.tokens.length > 0) {
            next();
        } else {
            return res.status(401).json('UNAUTHORIZED');
        }
    } catch (error) {
        res.status(401).json('UNAUTHORIZED');
    }
};

const getUserIdFromToken = (token = '') => {
    try {
        const decoded = jwt.verify(decrypt(token), process.env.JWT_SECRET);
        return decoded.id
    } catch (error) {
        res.status(400).json({ message: 'BAD TOKEN' });
    }
}

const generateAndReturnToken = (userId) => {
    return token = encrypt(jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' }));
}

module.exports = { authenticate, generateAndReturnToken, getUserIdFromToken };
