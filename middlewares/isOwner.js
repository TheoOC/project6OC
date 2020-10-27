const jwt = require('jsonwebtoken');
const Sauce = require('../models/Sauce');

const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error;
}

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,process.env.SECRETKEY); 
        const userId = decodedToken.userId;
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const sauceOwner = sauce.userId;
                if ( userId !== sauceOwner) {
                    throw 'user is not owner of the sauce';
                }
                else {
                    next();
                }
            })
            .catch(error => res.status(400).json({ error }))
    } catch {
        res.status(401).json({
            error: new Error('invalid request!')
        });
    }
};