/**
 *  此文件定义了acb模块，整合并封装了时间处理、用户界面、验证和工具功能
 */

// 导入acb模块的相关组件
const acbTime = require("./acb-time/index.js");
const acbUi = require("./acb-ui/index.js");
const acbVerification = require("./acb-verification/index.js");
const acbUtils = require("./acb-utils/index.js");

// 初始化acb对象，用于整合各个模块的功能
const acb = {};

// 将导入的模块赋值给acb对象的相应属性，提供统一的访问接口
acb.time = acbTime;
acb.ui = acbUi;
acb.verification = acbVerification;
acb.utils = acbUtils;

// 导出acb对象，供其他模块使用
module.exports = acb;