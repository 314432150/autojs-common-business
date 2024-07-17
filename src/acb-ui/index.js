/**
 * 基础UI模块提供与用户界面交互相关的功能
 */

/**
 * 生成控件边界内的随机坐标
 * 此函数根据传入的控件边界生成一个随机坐标点，
 * 该点位于控件的可交互区域内，可用于模拟用户点击行为。
 *
 * @param {Object} bounds - 控件的边界属性，应包含 left, top, width, height 属性
 * @returns {Object} 包含 x 和 y 坐标的对象，表示控件边界内的一个随机点
 */
const getRandomPointInBounds = (bounds) => {
    const width = bounds.width();
    const height = bounds.height();
    const left = bounds.left;
    const top = bounds.top;

    // 计算并返回控件内的随机坐标
    return {
        x: Math.floor(left + Math.random() * width),
        y: Math.floor(top + Math.random() * height),
    };
};

/**
 * 定义一个通用的点击函数，加入随机偏移以避免检测
 * @param {UiObject} widget - 要点击的控件对象
 * @returns {boolean} - 表示点击是否成功
 */
const humanizeClick = (widget) => {
    // 尝试直接调用 click 方法
    if (widget.click()) {
        return true;
    }

    // 获取控件的边界
    const bounds = widget.bounds();

    // 生成控件内的随机坐标
    const point = getRandomPointInBounds(bounds);

    // 使用坐标点击
    click(point.x, point.y);
    return true;
};

/**
 * 模拟自然滑动操作，使用gesture函数创建平滑但不规则的路径
 * @param {number} startX - 滑动的起始X坐标
 * @param {number} startY - 滑动的起始Y坐标
 * @param {number} endX - 滑动的结束X坐标
 * @param {number} endY - 滑动的结束Y坐标
 * @param {number} duration - 滑动的持续时间（毫秒）
 */
const humanizeSwipe = (startX, startY, endX, endY, duration) => {
    // 创建贝塞尔曲线控制点
    const controlX1 = startX + (endX - startX) / 3;
    const controlY1 = startY + (endY - startY) / 3;
    const controlX2 = endX - (endX - startX) / 3;
    const controlY2 = endY - (endY - startY) / 3;

    // 计算贝塞尔曲线上的点，加入随机偏移
    const points = [[startX, startY]];
    for (let t = 0.1; t <= 0.9; t += 0.1) {
        let x =
            Math.pow(1 - t, 3) * startX +
            3 * Math.pow(1 - t, 2) * t * controlX1 +
            3 * (1 - t) * Math.pow(t, 2) * controlX2 +
            Math.pow(t, 3) * endX;
        let y =
            Math.pow(1 - t, 3) * startY +
            3 * Math.pow(1 - t, 2) * t * controlY1 +
            3 * (1 - t) * Math.pow(t, 2) * controlY2 +
            Math.pow(t, 3) * endY;

        // 添加随机偏移
        let offsetX = Math.random() * 10 - 5; // 随机数范围 -5 到 5
        let offsetY = Math.random() * 10 - 5; // 随机数范围 -5 到 5

        points.push([x + offsetX, y + offsetY]);
    }
    points.push([endX, endY]);

    // 使用apply方法和gesture函数模拟滑动
    gesture.apply(null, [duration].concat(points));
};

/**
 * 异步查找指定元素并返回Promise，支持超时控制
 * @param {Function} queryFunc - 要查找的元素函数
 * @param {number} [delay=50] - 查找元素之间的延迟时间（毫秒）
 * @param {number} [timeout=-1] - 超时时间（毫秒），-1表示无超时限制
 * @returns {Promise<UiObject|null>} - 查找到的元素对象，或在超时时返回null
 */
const queryElement = (queryFunc, delay = 50, timeout = -1) => {
    return new Promise((resolve, reject) => {
        let startTime = Date.now(); // 记录开始时间
        let timer;

        const checkElement = function () {
            const element = queryFunc.findOnce();
            if (element !== null) {
                resolve(element);
            } else if (timeout !== -1 && Date.now() - startTime > timeout) {
                clearTimeout(timer);
                reject(new Error("查找超时"));
            } else {
                timer = setTimeout(checkElement, delay);
            }
        };

        checkElement();
    });
};

export default {
    humanizeClick,
    humanizeSwipe,
    queryElement,
};
