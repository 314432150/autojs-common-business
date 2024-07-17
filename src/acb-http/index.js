/**
 * 异步HTTP客户端模块
 * 本模块封装了HTTP请求方法，以支持使用Promises进行异步操作。
 * 所有这些接口都可以在异步函数上下文中使用await关键字。
 *
 * 功能包括：
 * - GET请求
 * - POST请求
 * - POST请求发送JSON数据
 * - POST请求发送multipart/form-data形式的数据（适用于文件上传）
 * - 自定义HTTP请求
 */

/**
 * 发送一个GET请求到指定的URL，并返回Promise。
 * @param {string} url - 请求的URL地址。
 * @param {Object} [options={}] - 请求选项。
 * @param {Function} [callback] - 可选的回调函数。
 * @returns {Promise} 解析为Response对象或在发生错误时被拒绝。
 */
const get = (url, options = {}, callback) =>
    new Promise((resolve, reject) => {
        http.get(url, options, (res) => {
            if (callback) callback(res);
            resolve(res);
        }).on("error", reject);
    });

/**
 * 发送一个POST请求到指定的URL，并返回Promise。
 * @param {string} url - 请求的URL地址。
 * @param {Object|string} data - POST数据。
 * @param {Object} [options={}] - 请求选项。
 * @param {Function} [callback] - 可选的回调函数。
 * @returns {Promise} 解析为Response对象或在发生错误时被拒绝。
 */
const post = (url, data, options = {}, callback) =>
    new Promise((resolve, reject) => {
        http.post(url, data, options, (res) => {
            if (callback) callback(res);
            resolve(res);
        }).on("error", reject);
    });

/**
 * 发送一个带有JSON数据的POST请求到指定的URL，并返回Promise。
 * @param {string} url - 请求的URL地址。
 * @param {Object} data - POST数据，必须是对象。
 * @param {Object} [options={}] - 请求选项。
 * @param {Function} [callback] - 可选的回调函数。
 * @returns {Promise} 解析为Response对象或在发生错误时被拒绝。
 */
const postJson = (url, data, options = {}, callback) =>
    new Promise((resolve, reject) => {
        http.postJson(url, data, options, (res) => {
            if (callback) callback(res);
            resolve(res);
        }).on("error", reject);
    });

/**
 * 发送一个multipart/form-data类型的POST请求到指定的URL，并返回Promise。
 * @param {string} url - 请求的URL地址。
 * @param {Object} files - POST数据，用于文件上传。
 * @param {Object} [options={}] - 请求选项。
 * @param {Function} [callback] - 可选的回调函数。
 * @returns {Promise} 解析为Response对象或在发生错误时被拒绝。
 */
const postMultipart = (url, files, options = {}, callback) =>
    new Promise((resolve, reject) => {
        http.postMultipart(url, files, options, (res) => {
            if (callback) callback(res);
            resolve(res);
        }).on("error", reject);
    });

/**
 * 发送一个自定义HTTP请求到指定的URL，并返回Promise。
 * @param {string} url - 请求的URL地址。
 * @param {Object} options - 请求选项，包括method, headers, body等。
 * @param {Function} [callback] - 可选的回调函数。
 * @returns {Promise} 解析为Response对象或在发生错误时被拒绝。
 */
const request = (url, options = {}, callback) =>
    new Promise((resolve, reject) => {
        // 创建请求
        const req = http.request(url, options, (res) => {
            if (callback) callback(res);
            resolve(res);
        });

        // 处理请求错误
        req.on("error", reject);

        // 如果有body，则写入body
        if (options.body) {
            req.write(options.body);
        }

        // 结束请求
        req.end();
    });

// 添加到默认导出的对象中
export default {
    get,
    post,
    postJson,
    postMultipart,
    request,
};
