var multer = require('multer');
var config = require('config');
var path = require('path');
const shelljs = require('shelljs');
const fs = require('fs');
const logger = require('./logger');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        let imgLoc = null;
        if (file.fieldname === 'file' || file.fieldname === 'image')
            imgLoc = config.get('profilePic.location'); // profile photo
        else if (file.fieldname === 'certDocFiles') {
            imgLoc = config.get('certificateDoc.location'); // Certificate doc 
        } else if (file.fieldname === 'bodyAnalysisReport') {
            imgLoc = config.get('bodyAnalysisReport.location'); // Certificate doc 
        }
        const dir = path.join(__dirname.replace('utilities', ''), imgLoc);
        if (!fs.existsSync(dir)) {
            shelljs.mkdir('-p', dir);
            shelljs.chmod(777, dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        const randomStr = Math.round(Math.random()*10000);
        logger.debug('multer, fieldname=', file.fieldname);
        var fileExtension = file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, datetimestamp + '_' + randomStr + '.' + fileExtension);
    }
});

var uploadPhoto = multer({ //multer settings
    storage: storage
}).fields([{ name: 'file', maxCount: 1 }, { name: 'certDocFiles' }]);
//.single('file');      // 'file' is the key which holds the file object in post req, using ngFileUpload

function uploader(fields) {
    return multer({ storage }).fields(fields);
}

exports.uploadPhoto = uploadPhoto;
exports.uploader = uploader;
