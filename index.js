
const config = require('config');
const moment = require('moment');
const CronJob = require('cron').CronJob;
const Util = require('./utilities/util');
const logger = require('./utilities/logger');
const arp = require('./utilities/requestDriver');

const pushConfig = config.get('pushConfig');

async function checkServiceStatus() {
    const serviceList = config.get('serviceList');
    for (let i = 0; i < serviceList.length; i++) {
        const el = serviceList[i];
        try {
            logger.debug('Start to check ' + el.name);
            const res = await arp.get(el.url);
            logger.debug(`${el.name} is ok`);
        } catch (error) {
            if (error.statusCode === 400 || error.statusCode === 401) {
                logger.debug(`${el.name} is ok: statusCode is ${error.statusCode}, body is ${JSON.stringify(error.response.body)}`);
            } else {
                await sendNotice(el.name + '访问异常', `statusCode is ${error.statusCode}, error is ${error.message}, temp${Math.random()}`, el.topic);
            }
        }
    }
    logger.debug('finished service status check');
}

async function sendNotice(title, content, topic) {
    try {
        const res = await arp.post(pushConfig.url, '', {}, {
            token: pushConfig.token,
            title,
            content,
            topic
        });
        logger.debug(`Send notification successful, title is ${title}, content is ${content}`);
    } catch (error) {
        logger.error(`Error in send notification, title is ${title}, content is ${content}`);
    }
}

new CronJob('00 */5 * * * *', async () => {
    await checkServiceStatus();
}, () => {
    logger.debug('monitor job stoped at' + new Date().toISOString());
}, true, 'Asia/Shanghai');

new CronJob('0 0 8-23 * * *', async () => {
    await sendNotice('整点报时', '监控正常运行' + Math.random());
}, () => {
    logger.debug('checkin job stoped at' + new Date().toISOString());
}, true, 'Asia/Shanghai');

// checkServiceStatus();