const CustomError = require('../errors');
const { isTokenValid } = require('../utils/jwt');

const authenticateUser = async (req, res, next) => {
    try {
        let token;
        // check header
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            throw new CustomError.UnauthenticatedError('Authentication Invalid');
        }

        const payload = isTokenValid({token});


        //attach the user and his permissions to the req object
        req.user = {
            email : payload.email,
            role: payload.role,
            name: payload.name,
            id: payload.userId,
            
        };

        next()
    } catch (error) {
      next(error)        
    }
};

module.exports = { authenticateUser};