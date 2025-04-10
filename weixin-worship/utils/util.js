/**
 * 格式化时间
 * @param {Date} date 时间对象
 * @param {String} format 格式化模式
 * @return {String} 格式化后的字符串
 */
const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  format = format.replace(/YYYY/g, year);
  format = format.replace(/MM/g, padStart(month, 2, '0'));
  format = format.replace(/DD/g, padStart(day, 2, '0'));
  format = format.replace(/HH/g, padStart(hour, 2, '0'));
  format = format.replace(/mm/g, padStart(minute, 2, '0'));
  format = format.replace(/ss/g, padStart(second, 2, '0'));

  return format;
};

/**
 * 字符串补全
 * @param {Number|String} str 原始字符串
 * @param {Number} length 目标长度
 * @param {String} padChar 填充字符
 * @return {String} 补全后的字符串
 */
const padStart = (str, length, padChar) => {
  str = String(str);
  if (str.length >= length) return str;
  
  const fill = Array(length - str.length + 1).join(padChar);
  return fill + str;
};

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {Number} delay 延迟时间（毫秒）
 * @return {Function} 节流后的函数
 */
const throttle = (fn, delay) => {
  let last = 0;
  return function() {
    const now = Date.now();
    if (now - last >= delay) {
      fn.apply(this, arguments);
      last = now;
    }
  };
};

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {Number} delay 延迟时间（毫秒）
 * @return {Function} 防抖后的函数
 */
const debounce = (fn, delay) => {
  let timer = null;
  return function() {
    const context = this;
    const args = arguments;
    
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};

/**
 * 简易的日期对象与农历日期之间的转换
 * 注：这只是一个示例，实际应用中应使用专业农历库如lunar-javascript
 * @param {Date} date 公历日期
 * @return {String} 农历日期字符串
 */
const toLunarDate = (date) => {
  // 实际应用中需要引入专业农历转换库
  // 这里只是简单示例返回格式
  return '农历 XX月XX日';
};

module.exports = {
  formatTime,
  padStart,
  throttle,
  debounce,
  toLunarDate
};
