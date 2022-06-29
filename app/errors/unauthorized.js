const {StatusCodes} = require('http-status-codes')
const CustomAPIError = require('./custom-api')

class Unauthorized extends Error{
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = Unauthorized;