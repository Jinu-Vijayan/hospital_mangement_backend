const { ErrorHandler, catchAsync } = require("./ErrorHandler");
const { passport } = require("./Auth");
const { Authorization } = require("./Authorization");

module.exports = {
    ErrorHandler,
    catchAsync,
    passport,
    Authorization
}