const HTTP = require("../utils/httpStatusCodes");

const notFound = (req, res, next) => {
  res.status(HTTP.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = notFound;
