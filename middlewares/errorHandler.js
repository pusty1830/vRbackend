const HTTP = require("../utils/httpStatusCodes");
const MSG = require("../utils/messages");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || HTTP.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || MSG.ERROR.INTERNAL_SERVER_ERROR,
  });
};

module.exports = errorHandler;
