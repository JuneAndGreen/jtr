var fs = require('fs');
var path = require('path');
var nei = require('./lib/nei');
var _ = require('./lib/util');

var cwd = process.cwd();

module.exports = function(config) {
  var options = config;

  if(options.fromNei) {
    // nei项目的接入
    config = options.config;

    if(!config || typeof config === 'string') {
      // 如果没有配置项，直接找当前目录下的config
      try {
        config = require(path.join(cwd, config || './nei.json'));
      } catch(e) {
        console.error('缺少相关配置文件，请确保 当前目录下有nei.json文件 或者 用-c指定配置文件路径');
        process.exit(1);
      }

      config.viewRoot = path.join(cwd, config.viewRoot);
      config.webRoot = path.join(cwd, config.webRoot);
      config.mockTpl = path.join(cwd, config.mockTpl);
      config.mockApi = path.join(cwd, config.mockApi);
    }

    nei.setting({
      api: config.neiApi || '',
      view: config.viewRoot,
      mockTpl: config.mockTpl || '',
      mockApi: config.mockApi || '',
      viewExt: config.viewExt || '.ftl'
    });
    config.routes = nei.getRoutes(config.routes);

    options = {
      port: config.port,
      rules: config.routes,
      dir: config.webRoot,
      views: config.viewRoot,
      launch: config.launch,
      engine: _.isObject(config.engine) ? config.engine : {},
      nei: true
    };
  }
  require('./lib/main')(options);
};
