/**
 * 验证模块提供与验证码识别和处理相关的功能
 */

import acbUi from "../acb-ui";

/**
 * 异步实现滑动验证的模拟操作。
 *
 * @param {UiSelector} sliderBlockSelector - 滑动块元素的选择器
 * @param {UiSelector} sliderBackgroundSelector - 滑动背景元素的选择器
 */
const humanizedVerifySlider = async (
    sliderBlockSelector,
    sliderBackgroundSelector
) => {
    // 获取滑动块和滑动背景元素
    const sliderBlock = await acbUi.queryElement(sliderBlockSelector);
    const sliderBackground = await acbUi.queryElement(sliderBackgroundSelector);

    // 计算滑动块与背景图的边界信息
    const blockBounds = sliderBlock.bounds();
    const backgroundBounds = sliderBackground.bounds();

    // 在滑动块内生成随机起点
    const startPoint = getRandomPointInBounds(blockBounds);
    const startX = startPoint.x;
    const startY = startPoint.y;

    // 定义滑动的终点在目标背景图的右边缘
    let endX = backgroundBounds.right;
    let endY = backgroundBounds.centerY();

    // 引入随机偏移以增加滑动的真实感
    const randomXOffset = Math.random() * 50 - 25;
    const randomYOffset = Math.random() * 50 - 25;

    // 更新实际滑动的终点位置
    endX += randomXOffset;
    endY += randomYOffset;

    // 执行带有随机性的滑动操作
    humanizeSwipe(startX, startY, endX, endY, 1000);

    // 日志记录：滑动验证码操作完成
    console.log("滑动验证码完成");
};

export default {
    humanizedVerifySlider,
};
