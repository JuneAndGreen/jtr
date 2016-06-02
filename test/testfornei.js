var path = require('path');
var jtr = require('../index');

// 传配置文件启动
// jtr({
//   fromNei: true,
//   config: require('./jtr.js')
// });

// 传配置文件路径启动
jtr({
  fromNei: true,
  config: path.join(__dirname, './jtr.js')
});
