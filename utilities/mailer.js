
const nodemailer = require('nodemailer');
const config = require('config');
const logger = require('./logger');

const settings = config.get('mailer.settings');
const option = config.get('mailer.option');

const transporter = nodemailer.createTransport(settings);

class Mailer {
    constructor(to, replyTo, subject, text, attachments, html) {
        this.from = option.from;
        this.to = to;
        this.replyTo = replyTo || option.replyTo;
        this.subject = subject;
        this.text = text || '';
        this.html = html || '';
        this.attachments = attachments;
        return this;
    }
    async sendMail() {
        try {
            const res = await transporter.sendMail(this);
            logger.debug(`Message ${res.messageId} send: ${res.response}`);
            return res;
        } catch (error) {
            logger.error('Mailer.sendMail failed: ' + JSON.stringify(error));
            throw error instanceof Error ? error : new Error(error);
        }
    }

    static async sendTextMail(subject, text, to) {
        try {
            const res = await transporter.sendMail({
                from: option.from,
                to: to,
                subject,
                text
            });
            logger.debug(`Message ${res.messageId} send: ${res.response}`);
        } catch (error) {
            logger.error('Mailer.sendMail failed: ' + JSON.stringify(error));
        }
    }
}

// send mail with defined transport object
module.exports = Mailer;

