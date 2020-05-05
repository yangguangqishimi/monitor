const logger = require('./logger');
const sleep = require('./util').delay;

/**
 * 
 * @param {Function} func 
 * @param {string|Object} taskInfo task infomation, help to trace errors
 * @param {Number} retryTimes retry times
 * @param {Number} interval retry interval time
 * @param {Number} delay delay before run
 */
async function runWithRetry(func, taskInfo, retryTimes = 0, interval = 5000, delay = 0) {
    let n = 0;
    let err = null;
    await sleep(delay);
    while (n <= retryTimes) {
        try {
            const res = await func();
            return res;
        } catch (error) {
            logger.error(`Error in retry, retry ${n}, taskInfo is ${JSON.stringify(taskInfo)}, error is ${error.toString()}`);
            n++;
            err = error;
            if (n <= retryTimes) {
                await sleep(interval);
            }
        }
    }
    throw err instanceof Error ? err : new Error(err);
    // return err instanceof Error ? err : new Error(err);
}

module.exports = runWithRetry;