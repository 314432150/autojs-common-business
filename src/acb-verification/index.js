/**
 * 验证模块提供与验证码识别和处理相关的功能
 */

const acbVerification = {};

/**
 * 模拟滑动验证码
 * @param {UiObject} sliderBlock - 滑动块的UI对象
 * @param {UiObject} sliderBackground - 背景图的UI对象
 */
function humanizeSliderVerification(sliderBlock, sliderBackground) {
    // 获取滑动块和背景图的边界
    const blockBounds = sliderBlock.bounds();
    const backgroundBounds = sliderBackground.bounds();

    // 获取滑动块内的随机起点
    const startPoint = getRandomPointInBounds(blockBounds);
    const startX = startPoint.x;
    const startY = startPoint.y;

    // 滑动终点为目标背景图的右边缘
    let endX = backgroundBounds.right;
    let endY = backgroundBounds.centerY(); // 保持垂直位置不变

    // 添加随机性，使滑动看起来更自然
    const randomXOffset = Math.random() * 50 - 25; // 随机偏移量，-25 到 25
    const randomYOffset = Math.random() * 50 - 25;

    // 实际滑动的结束位置
    endX += randomXOffset;
    endY += randomYOffset;

    // 执行滑动操作
    humanizeSwipe(startX, startY, endX, endY, 1000);
    console.log("滑动验证码完成");
}

/**
 * 检查是否存在滑动验证
 */
acbVerification.checkForSliderVerification = function () {
    // 定义检查间隔和超时时间
    const interval = 100;
    const timeout = 10000;

    // 定义一个定时器，每隔一段时间检查一次滑动验证
    const startTime = new Date().getTime(); // 开始检查时间
    let timerId = setInterval(() => {
        // 检查滑动验证元素是否存在
        const sliderBlock = text("滑块").findOnce();
        const sliderBackground = text("滑动背景").findOnce();

        if (sliderBlock && sliderBackground) {
            // 如果找到滑动验证元素，清除定时器并处理滑动验证
            clearInterval(timerId);
            humanizeSliderVerification(sliderBlock, sliderBackground);
        } else if (new Date().getTime() - startTime > timeout) {
            // 如果超过超时时间仍未找到滑动验证元素，清除定时器
            clearInterval(timerId);
            console.log("未找到滑动验证元素，检查超时");
        }
    }, interval);
};
module.exports = acbVerification;
