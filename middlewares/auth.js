const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error;
}

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRETKEY);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid userid';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('invalid request!')
        });
    }
};