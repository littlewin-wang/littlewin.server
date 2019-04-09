/**
 * @file 通用模块转换器
 * @description 用于兼容各种 Commomjs 包在 TS 下的不兼容问题
 * @author littlewin<littlewin.wang@gmail.com>
 */

import * as path from 'path';
export const packageJson = require(path.join(__dirname, '..', '..') + '/package.json');

export default {
  packageJson,
};
