/**
 * 时间模块提供与时间相关的功能
 */

const acbTime = {};

/**
 * 获取淘宝服务器当前时间戳
 * @returns {number} - 返回淘宝服务器的时间戳
 */
function fetchTaobaoServerTimestamp() {
    try {
        const TAOBAO_SERVER_TIME_API =
            "https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp";

        const res = http.get(TAOBAO_SERVER_TIME_API);
        if (res.statusCode !== 200) {
            throw new Error(
                "状态码错误," + res.statusCode + " " + res.statusMessage
            );
        }
        const taobaoJson = res.body.json();
        const timestamp = parseInt(taobaoJson.data.t);
        console.log("淘宝时间[", formatTimestampToString(timestamp), "]");
        return timestamp;
    } catch (error) {
        console.error("获取淘宝服务器时间失败:", error);
        throw error;
    }
}

/**
 * 将时间戳转换为字符串，时间格式为 HH:mm:ss.SSS
 * @param {number} timestamp - 时间戳
 * @returns {string} - 格式化后的时间字符串
 */
function formatTimestampToString(timestamp) {
    const timestampDate = new Date(timestamp);
    const hour = timestampDate.getHours();
    const minute = timestampDate.getMinutes();
    const second = timestampDate.getSeconds();
    const millisecond = timestampDate.getMilliseconds();

    // 格式化时间单位，如果它们是单个数字，则前面加上0
    const formattedHour = ("0" + hour).slice(-2);
    const formattedMinute = ("0" + minute).slice(-2);
    const formattedSecond = ("0" + second).slice(-2);
    const formattedMillisecond = ("000" + millisecond).slice(-3);

    return (
        formattedHour +
        ":" +
        formattedMinute +
        ":" +
        formattedSecond +
        "." +
        formattedMillisecond
    );
}

/**
 * 异步等待目标时间到达
 * @param {Date} targetTime - 目标时间
 * @returns {Promise<void>} - 解析当目标时间到达时
 */
acbTime.waitForTime = function (targetTime) {
    // 定义检查时间的动态延迟范围
    const minCheckInterval = 50; // 最小检查间隔（毫秒）
    const maxCheckInterval = 1000; // 最大检查间隔（毫秒）
    const initialCheckInterval = 1000; // 初始检查间隔（毫秒）

    return new Promise((resolve) => {
        let timerId = null;

        const checkTime = () => {
            // 计算目标时间与淘宝时间的差值
            const taobaoTimestamp = fetchTaobaoServerTimestamp();
            const targetTimestamp = targetTime.getTime();
            const timeDifference = targetTimestamp - taobaoTimestamp;

            if (timeDifference <= 0) {
                // 如果当前时间等于或超过目标时间，清除计时器并解析Promise
                clearTimeout(timerId);
                resolve();
            } else {
                // 如果当前时间早于目标时间，根据剩余时间动态调整检查频率
                const nextCheckInterval = Math.min(
                    maxCheckInterval,
                    Math.max(minCheckInterval, timeDifference / 10)
                );
                timerId = setTimeout(checkTime, nextCheckInterval);
            }
        };

        // 启动首次检查
        timerId = setTimeout(checkTime, initialCheckInterval);
    });
};

module.exports = acbTime;
