/* eslint-disable linebreak-style */
var config = require('config');
var logLoc = config.get('log.location');

var winston = require('winston');
winston.emitErrs = true;

//var datetime = new Date();
var datetime = new Date().toISOString().replace(/-|:|\..+/g, '').replace('T', '_');
var fileName = logLoc + datetime + '.log';

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name:'logFile',
            level: 'debug',
            filename: fileName,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            // maxFiles: 5,
            colorize: false
        }),

        new winston.transports.Console({
            name:'console',
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: false,
            timestamp: true
        })
    ],
    exitOnError: false
});

let turnOff = config.get('log.turnOff');
logger.transports['logFile'].silent = turnOff;  //true means no file log, false means log

logger.info('Logger initialized!');

module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.debug(message);
    }
};