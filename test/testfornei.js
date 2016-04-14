var path = require('path');

var jtr = require('../index');
var options = require('./nei.json');

options.viewRoot = path.join(__dirname, options.viewRoot);
options.webRoot = path.join(__dirname, options.webRoot);
options.mockTpl = path.join(__dirname, options.mockTpl);
options.mockApi = path.join(__dirname, options.mockApi);

jtr({
  fromNei: true,
  config: options
});
