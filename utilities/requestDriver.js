const rp = require('request-promise-native');
const logger = require('./logger');
const MemoryCookieStore = require('tough-cookie').MemoryCookieStore;

let store = new MemoryCookieStore();
class Request {

    static async get(host, path = '', query, headers = null, timeout = 60000, json = true, strictSSL = true) {
        try {
            // logger.debug(`request.get, uri is ${host + path}, query is ${JSON.stringify(query)}, headers is ${JSON.stringify(headers)}`);
            let resp = await rp({ method: 'GET', uri: `${host}${path}`, qs: query, json, headers, strictSSL, timeout: timeout || 60000, gzip: true, jar: store });
            return resp;
        } catch (error) {
            logger.error(`Error in request.get, uri is ${host + path}, query is ${JSON.stringify(query)}, headers is ${JSON.stringify(headers)}, error is ${error.toString()}`);
            throw (error);
        }
    }

    static async post(host, path = '', query, body, headers = null, timeout = 60000, json = true, strictSSL = true) {
        try {
            // logger.debug(`request.post, uri is ${host + path}, query is ${JSON.stringify(query)}, body is ${JSON.stringify(body)}, headers is ${JSON.stringify(headers)}`);
            let resp = await rp({ method: 'POST', uri: `${host}${path}`, qs: query, body, json, headers, strictSSL, timeout: timeout || 60000, jar: store });
            return resp;
        } catch (error) {
            logger.error(`Error in request.post, uri is ${host + path}, query is ${JSON.stringify(query)}, body is ${JSON.stringify(body)}, headers is ${JSON.stringify(headers)}, error is ${error.toString()}`);
            throw (error);
        }
    }

    static async delete(host, path = '', query, headers = null, timeout = 60000, json = true, strictSSL = true) {
        try {
            logger.debug(`request.delete, uri is ${host + path}, query is ${JSON.stringify(query)}, headers is ${JSON.stringify(headers)}`);
            let resp = await rp({ method: 'DELETE', uri: `${host}${path}`, qs: query, json, headers, strictSSL, timeout: timeout || 60000, jar: store });
            return resp;
        } catch (error) {
            logger.error(`Error in request.delete, uri is ${host + path}, query is ${JSON.stringify(query)}, headers is ${JSON.stringify(headers)}, error is ${error.toString()}`);
            throw (error);
        }
    }

    static async put(host, path = '', query, body, headers = null, timeout = 60000, json = true, strictSSL = true) {
        try {
            logger.debug(`request.put, uri is ${host + path}, query is ${JSON.stringify(query)}, body is ${JSON.stringify(body)}, headers is ${JSON.stringify(headers)}`);
            let resp = await rp({ method: 'PUT', uri: `${host}${path}`, qs: query, body, json, headers, strictSSL, timeout: timeout || 60000, jar: store });
            return resp;
        } catch (error) {
            logger.error(`Error in request.put, uri is ${host + path}, query is ${JSON.stringify(query)}, body is ${JSON.stringify(body)}, headers is ${JSON.stringify(headers)}`);
            throw (error);
        }
    }

    static async uploadFile(host, path = '', query, formData, headers = null, timeout = 60000, json = true, strictSSL = true) {
        try {
            logger.debug(`request.uploadFile, uri is ${host + path}, query is ${JSON.stringify(query)}, headers is ${JSON.stringify(headers)}`);
            headers = headers || {};
            headers['content-type'] = 'multipart/form-data';
            let resp = await rp({
                method: 'POST', uri: `${host}${path}`, qs: query, json, headers, strictSSL, timeout: timeout || 60000, jar: store,
                formData
            });
            return resp;

        } catch (error) {
            logger.error(`Error in request.uploadFile, uri is ${host + path}, query is ${JSON.stringify(query)}, headers is ${JSON.stringify(headers)}, error is ${error.toString()}`);
            throw (error);
        }
    }

    static async downloadFile(host, path, query, headers = null, timeout = 60000, json = true, strictSSL = true) {
        try {
            logger.debug(`request.downloadFile, uri is ${host + path}, query is ${JSON.stringify(query)}, headers is ${JSON.stringify(headers)}`);
            let resp = await rp({ method: 'GET', uri: `${host}${path}`, qs: query, headers, strictSSL, timeout: timeout || 60000, jar: store, encoding: null });
            return resp;
        } catch (error) {
            logger.error(`Error in request.downloadFile, uri is ${host + path}, query is ${JSON.stringify(query)}, headers is ${JSON.stringify(headers)}, error is ${error.toString()}`);
            throw (error);
        }
    }

    static async options(host, path, headers, timeout = 60000, json = true, strictSSL = true) {
        try {
            let resp = await rp({ method: 'OPTIONS', uri: `${host}${path}`, json, headers, strictSSL, timeout: timeout || 60000, jar: store });
            return resp;
        } catch (error) {
            logger.error(`Error in request.options, uri is ${host + path}, headers is ${JSON.stringify(headers)}`);
            throw (error);
        }
    }
}

module.exports = Request;