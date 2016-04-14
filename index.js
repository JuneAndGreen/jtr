var nei = require('./lib/nei');
var _ = require('./lib/util');

module.exports = function(config) {
  var options = config;

  if(options.fromNei) {
    // nei项目的接入
    config = options.config;

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
    console.log(options.views);
  }
  require('./lib/main')(options);
};
