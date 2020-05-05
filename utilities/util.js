var logger = require('./logger');
var fs = require('fs');
const crypto = require('crypto');
const moment = require('moment-timezone');
const URLSafeBase64 = require('urlsafe-base64');

module.exports = {
    deleteFile: function (filename, callback) {
        logger.debug('Remove file:', filename);
        fs.unlink(filename, function (err) {
            if (err) {
                logger.error('Fail to remove temp image file:', filename);
            }
            callback(err);
        });
    },

    // this function is used to tell Array.sort() to sort numericallyß
    sortNumber: function (a, b) {
        return a - b;
    },

    sortDate: function (a, b) {
        return new Date(a) - new Date(b);
    },

    addTime,

    getWeekDayList: function () {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    },

    pad2TwoDigits,

    addUniqueElementToArray(array, element) {
        if (-1 == array.indexOf(element)) {
            array.push(element);
        }
    },

    calculateWeekNum: function (date) {
        let d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        let dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        let weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return '' + d.getFullYear() + (weekNum < 10 ? '0' + weekNum : weekNum);
    },

    weekNumToMonday(weekNum) {
        return new Date(moment(weekNum, 'YYYYWW').format());
    },

    weekNumToSunday(weekNum){
        return new Date(moment(weekNum, 'YYYYWW').add(6, 'days').format());
        
    },

    getMonday: function (date) {
        let d = new Date(date);
        let day = d.getDay();
        let diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    },

    delay: function (n) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, n);
        });
    },

    getLocaltime: function (ts, timezone) {
        return new Date(moment(ts).tz(timezone).toISOString(true).replace(/(-|\+)\d{2}:\d{2}/, 'Z'));
    },
    
    getLocalDate: function (ts, timezone) {
        return new Date(moment(ts).tz(timezone).format('YYYY-MM-DD'));
    },

    getUTCtime: function (ts, timezone) {
        return new Date(moment.tz(moment(ts).toISOString().replace('Z', ''), timezone).toISOString(true));
    },

    getTimeList (startTime, endTime, timeSlot, unit) {
        let d = startTime;
        let timeList = [];

        while (d < endTime) {
            timeList.push(d);
            d = addTime(d, timeSlot, unit);
        }
        return timeList;
    },

    getTotalMintues(date) {
        return date.getHours() * 60 + date.getMinutes();
    },

    getDateFromMinute (date, min) {
        let hour = pad2TwoDigits(Math.floor(min / 60));
        let minute = pad2TwoDigits(min % 60);
        let datePart = date.toISOString().split('T')[0];
        return new Date(datePart+'T'+hour+':'+minute+':00');
    },

    deleteUndefinedField: function (obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] === undefined) {
                    delete obj[key];
                }
            }
        }
        return obj;
    },
    deleteEmptyField: function (obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] === undefined || obj[key] === null) {
                    delete obj[key];
                }
            }
        }
        return obj;
    },
    deleteEmptyStringField: function (obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] === '') {
                    delete obj[key];
                }
            }
        }
        return obj;
    },
    // get element in srcArr, not in destArr
    getNotExistElement(srcArr, destArr, key) {
        const destMap = {};
        destArr.map(x => {
            destMap[key ? x[key]: x] = {};
        });
        const nonExist = [];
        for (let i = 0; i < srcArr.length; i++) {
            const el = srcArr[i];
            if (!destMap[key ? el[key]: el]) {
                nonExist.push(el);
            }
        }
        return nonExist;
    },
    getSameElement,
    getSameElementBetweenLists(lists, key) {
        let rest = [];
        return lists.reduce((a, b) => {
            return getSameElement(a, b, key);
        });
    },
    getUniqueValueBetweenLists(lists) {
        let all = {};
        lists.map(list => {
            list.map(x => {
                all[x] = x;
            });
        });
        return Object.keys(all);
    },
    deleteSameElement(srcArr, destArr, key) {
        const destMap = {};
        destArr.map(x => {
            destMap[key ? x[key]: x] = {};
        });
        const insame = [];
        for (let i = 0; i < srcArr.length; i++) {
            const el = srcArr[i];
            if (!destMap[key ? el[key]: el]) {
                insame.push(el);
            }
        }
        return insame;
    },
    listToMap(arr, key, lastFirst = true) {
        if (!(arr instanceof Array) || arr.length === 0) {
            return {};
        }
        const cache = {};
        arr.map(x => {
            if (!x[key]) {
                return;
            }
            if (lastFirst) {
                cache[x[key]] = x;
            } else if (!cache[x[key]]) {
                cache[x[key]] = x;
            }
        });
        return cache;
    },
    aesEncode(key, str) {
        key = getPasswordKey(key);
        if (!key) {
            return false;
        }
        const cipher = crypto.createCipheriv('aes-128-ecb', key, '');
        cipher.setAutoPadding(true);
        let ciphered = cipher.update(str, 'utf8', 'base64');
        ciphered += cipher.final('base64');
        return URLSafeBase64.encode(ciphered);
    },
    aesDecode(key, str) {
        key = getPasswordKey(key);
        if (!key) {
            return false;
        }
        const decipher = crypto.createDecipheriv('aes-128-ecb', key, '');
        decipher.setAutoPadding(true);
        let decrypted = decipher.update(URLSafeBase64.decode(str).toString('base64'), 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};

function getSameElement(srcArr, destArr, key) {
    const destMap = {};
    destArr.map(x => {
        destMap[key ? x[key]: x] = {};
    });
    const same = [];
    for (let i = 0; i < srcArr.length; i++) {
        const el = srcArr[i];
        if (destMap[key ? el[key]: el]) {
            same.push(el);
        }
    }
    return same;
}

function addTime (date, num, unit) {
    //date is a date object
    //num is number of units
    //unit is the time unit, like [sec, min, hour, day]

    var converter = 0;
    // convert 1 unit to milliseconds
    switch (unit.toLowerCase()) {
    case 'sec':
        converter = 1000;
        break;
    case 'min':
        converter = 60 * 1000;
        break;
    case 'hour':
        converter = 60 * 60 * 1000;
        break;
    case 'day':
        converter = 24 * 60 * 60 * 1000;
        break;
    }

    return new Date(date.getTime() + num * converter);
}

function pad2TwoDigits (number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

function getPasswordKey(key) {
    let buf = Buffer.from(key, 'ascii');
    if (buf.length < 16) {
        let len = 16 - buf.length;
        const arr = [];
        while (len-- > 0) {
            arr.push(0);
        }
        buf = Buffer.concat([buf, Buffer.from(arr)], 16);
    } else if (buf.length > 16) {
        return false;
    }
    return buf;
}
