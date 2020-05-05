
//let busy = false;
//let funcList = [];
//const MAX_NUM = 100;

class PromisePool {
    constructor(limitNum = 1) {
        this.limitNum = limitNum;
        this.busy = false;
        this.funcList = [];
    }
    add(func, ...args) {
        if (this.busy) return false;
        // if (funcList.length >= MAX_NUM) return false;
        if (typeof func !== 'function') {
            return false;
        }
        this.funcList.push({ func, args });
        return true;
    }

    async run(limitNum = this.limitNum) {
        if (this.busy) return false;
        this.busy = true;
        let inFlight = new Set();      //why Set not list?
        const result = await Promise.all(this.funcList.map(async (item, i) => {
            while (inFlight.size >= limitNum) {
                await Promise.race(inFlight);
            }
            const promise = item.func.apply(null, item.args);

            inFlight.add(promise);

            const res = await promise;
            inFlight.delete(promise);
            // console.log(`the ${i}st task finished, result is ${res}`);
            return res;
        }));
        this.funcList = [];
        this.busy = false;
        return result;
    }

    static async parallelRun(funcList, limit = 2) {
        let inFlight = new Set();
        return Promise.all(funcList.map(async (func, i) => {

            while (inFlight.size >= limit) {
                await Promise.race(inFlight);
            }

            const promise = func();
            inFlight.add(promise);

            const res = await promise;
            // console.log(`the ${i}st task finished, result is ${res}`);
            inFlight.delete(promise);
            return res;
        }));
    }

    static apply(func, ...args) {
        return () => {
            return func.apply(null, args);
        };
    }

    startAll(limitNum) {
        return this.run(limitNum);
    }

}

module.exports = PromisePool;
