var winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({filename: 'errors.log'})
	]
});



logger.errorHandler = function(err, req, res, next) {
	var self = this;

	res.status = 500;
	self.info(err);
	console.log(err);
}

module.exports = logger;