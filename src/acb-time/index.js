/**
 * 时间模块提供与时间相关的功能
 */

import asyncHttp from "../acb-http";

// 枚举时间源，定义了可用的时间服务器源
const TimeSource = {
    TAOBAO: "taobao", // 淘宝服务器时间源
    JD: "jd", // 京东服务器时间源，假设存在
};

/**
 * 将时间戳转换为字符串，时间格式为 HH:mm:ss.SSS
 * @param {number} timestamp - 时间戳
 * @returns {string} 格式化后的时间字符串
 */
const formatTimestampToString = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

/**
 * 根据时间源创建获取服务器时间的函数
 * @param {string} source - 时间源标识
 * @returns {Function} 获取服务器时间的函数
 */
const createTimeSourceFetcher = (source) => {
    switch (source) {
        case TimeSource.TAOBAO: // 如果时间源是淘宝
            return async () => {
                // 发起HTTP GET请求到淘宝时间API
                const response = await asyncHttp.get(
                    "https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp"
                );
                if (response.statusCode !== 200) {
                    // 检查响应状态码是否为200
                    throw new Error(
                        `状态码错误, ${response.statusCode} ${response.statusMessage}`
                    );
                }
                // 从响应体中解析时间戳
                const responseBody = response.body.json();
                const timestamp = parseInt(responseBody.data.t);
                console.log(`淘宝时间[${formatTimestampToString(timestamp)}]`); // 打印淘宝时间
                return timestamp; // 返回时间戳
            };
        case TimeSource.JD: // 如果时间源是京东
            return async () => {
                // 发起HTTP GET请求到京东时间API
                const response = await asyncHttp.get("https://your.jd.server/time"); // 假设这是京东的时间API
                if (response.statusCode !== 200) {
                    // 检查响应状态码是否为200
                    throw new Error(
                        `状态码错误, ${response.statusCode} ${response.statusMessage}`
                    );
                }
                // 从响应体中直接读取时间戳
                const timestamp = parseInt(response.body.timestamp);
                console.log(`京东时间[${formatTimestampToString(timestamp)}]`); // 打印京东时间
                return timestamp; // 返回时间戳
            };
        default: // 如果时间源不匹配任何已知源
            throw new Error("未知的时间源"); // 抛出错误
    }
};

/**
 * 异步等待目标时间到达
 * @param {Date} targetTime - 目标时间
 * @param {string} [timeSource=TimeSource.TAOBAO] - 时间源，默认为淘宝
 * @returns {Promise<void>} 解析当目标时间到达时
 */
const waitForTime = async (targetTime, timeSource = TimeSource.TAOBAO) => {
    // 根据时间源创建获取时间的函数
    const fetchTimestampFn = createTimeSourceFetcher(timeSource);

    return new Promise((resolve) => {
        let timerId = null; // 初始化定时器ID

        const checkTime = async () => {
            // 获取服务器时间
            const serverTimestamp = await fetchTimestampFn();
            // 获取目标时间的时间戳
            const targetTimestamp = targetTime.getTime();
            // 计算目标时间与服务器时间的差值
            const timeDifference = targetTimestamp - serverTimestamp;

            if (timeDifference <= 0) {
                // 如果目标时间已到达或过去
                clearTimeout(timerId); // 清除定时器
                resolve(); // 解析Promise
            } else {
                // 如果目标时间还未到达
                // 动态调整下一次检查的时间间隔
                const nextCheckInterval = Math.min(
                    1000,
                    Math.max(50, timeDifference / 10)
                );
                timerId = setTimeout(checkTime, nextCheckInterval); // 设置定时器进行下一次检查
            }
        };

        // 设置初始定时器
        timerId = setTimeout(checkTime, 1000);
    });
};

export default { TimeSource, waitForTime, formatTimestampToString };
