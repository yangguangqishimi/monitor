const logger = require('./logger');
const runWithRetry = require('./retry');

class PromisePool {
    constructor(limitNum = 2) {
        this.limitNum = limitNum;
        this.busy = false;
        this.funcList = [];
    }
    add(func, ...args) {
        if (this.busy) return false;
        // if (this.funcList.length >= MAX_NUM) return false;
        if (typeof func !== 'function') {
            return false;
        }
        this.funcList.push({ func: func, args });
        return true;
    }

    count() {
        return this.funcList.length;
    }

    async run(limitNum = this.limitNum, retryOption) {
        if (this.busy) return false;
        this.busy = true;

        try {
            const result = await PromisePool.parallelRun(this.funcList, limitNum, retryOption);
            this.funcList = [];
            this.busy = false;
            return result;
        } catch (error) {
            this.funcList = [];
            this.busy = false;
            throw error;
        }
    }

    static async parallelRun(funcList, limitNum = 2, retryOption) {
        let start = 0;
        let resultList = [];
        if (!(funcList instanceof Array)) {
            throw new Error('funcList is not an Array, funcList is ' + JSON.stringify(funcList));
        }
        const wrongList = funcList.filter(item => { return !(item.func instanceof Function); });
        if (wrongList.length > 0) {
            throw new Error('Wrong params, funcList is ' + JSON.stringify(funcList));
        }
        // const funcNum = funcList.length;
        // while (start < funcNum) {
        resultList = await Promise.all(parallelify(funcList, limitNum, start, retryOption));
        //     resultList = resultList.concat(result);
        //     start = start + limitNum * 20;
        // }
        const errorList = resultList.filter(x => x.error);
        return { resultList, errorList };
    }

    static apply(func, ...args) {
        return { func, args };
    }

    startAll(limitNum = this.limitNum, retryOption) {
        return this.run(limitNum, retryOption);
    }

    toString() {
        return JSON.stringify(this.funcList);
    }
}

module.exports = PromisePool;

function parallelify(funcList, limitNum, start, retryOption = { retryTimes: 0, interval: 0, delay: 0 }) {
    let inFlight = new Set();
    return funcList.map(async (item, i) => {

        while (inFlight.size >= limitNum) {
            try {
                await Promise.race(inFlight);
            } catch (error) {
                //
            }
        }

        logger.debug(`the ${start + i}st task start to run`);
        const promise = runWithRetry(item.func.bind(null, ...item.args), '', retryOption.retryTimes || 0, retryOption.interval || 0);
        try {
            inFlight.add(promise);
            const res = await promise;
            inFlight.delete(promise);
            // logger.debug(`the ${start + i}st task finished.${inFlight.size}`);
            // const usage = process.memoryUsage().heapUsed / 1024 / 1024;
            // if (usage > 500) {
            //     logger.warn(`Memory usage is high(${usage}M), you may need to optimize your code or reduce the number of concurrent`);
            // } else {
            //     logger.debug(`memory uage: ${usage}M`);
            // }

            return { error: null, value: res };
        } catch (error) {
            inFlight.delete(promise);
            logger.debug(`Error in ${start + i}st task, args is ${JSON.stringify(item.args)}, error is ${error}`);
            return { error, value: null };
        }
    });
}
