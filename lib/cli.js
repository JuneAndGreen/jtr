var program = require('commander');
var path = require('path');
var fs = require('fs');
var jtr = require('./main');
var _ = require('./util');
var nei = require('./nei');

var cwd = process.cwd();

program
  .version(require('../package.json').version)

  .option('-p, --port <port>', '代理服务器端口，默认为8000', parseInt)
  .option('-c, --config [path]', '配置文件路径，默认取当前路径下的jtr.js')
  .option('-r, --rules <glob>', '模拟接口的路由表')
  .option('-d, --dir [path]', '代理服务器的根目录，默认是process.cwd()')
  .option('--views <path>', '视图目录，默认是./views')
  .option('--nei', '启动nei服务，取当前路径下的nei.json作为配置文件')
  .option('--no-launch', '是否要停止自动打开浏览器')

  .parse(process.argv)

  .once('done', function(createFile) {
    // 获取参数
    var options;
    if(program.nei) {
      var neiConfig = program.neiConfig;
      options = {
        port: neiConfig.port || program.port,
        rules: neiConfig.routes || program.rules,
        dir: neiConfig.webRoot || program.dir,
        views: neiConfig.viewRoot || program.views,
        launch: neiConfig.launch || program.launch,
        engine: program.engine,
        config: program.config,
        nei: program.nei
      };
    } else {
      options = {
        port: program.port,
        rules: program.rules,
        dir: program.dir,
        views: program.views,
        launch: program.launch,
        engine: program.engine,
        config: program.config
      };
    }

    // 启动代理服务器
    jtr(options);
  });

// 默认配置文件是当前目录的jtr.js文件
var defaultFile = path.join(cwd, 'jtr.js');
if(program.config === undefined && fs.existsSync(defaultFile) || program.config === true) {
  program.config = defaultFile;
}

// 默认nei配置文件是当前目录下的nei.json
var defaultNeiFile = path.join(cwd, 'nei.json');
if(program.nei && program.config === undefined && fs.existsSync(defaultNeiFile) || program.config === true) {
  program.config = defaultNeiFile;
}

// 配置文件读取
if(program.config) {
  program.config = path.resolve(cwd, program.config);

  if(fs.existsSync(program.config)) {
    // 配置文件存在
    try{
      var configOptions = require(program.config);
      if(program.nei) {
        program.neiConfig = configOptions;
      } else {
        _.extend(program, configOptions);
      }
    }catch(e){
      // 配置文件读取失败
      console.error('读取文件' + program.config + '失败');
      console.error(e.message);
      process.exit(1);
    }

    // 针对nei项目做特殊处理
    if(program.nei) {
      var routes = program.neiConfig.routes;
      if(!routes) {
        console.error('当前启动的nei项目缺少路由字段');
        process.exit(1);
      }

      nei.setting({
        api: program.neiConfig.neiApi,
        view: program.neiConfig.viewRoot,
        mockTpl: path.join(cwd, program.neiConfig.mockTpl),
        mockApi: path.join(cwd, program.neiConfig.mockApi),
        viewExt: program.neiConfig.viewExt
      });

      var retRoutes = {};
      for(var i in routes) {
        if(routes.hasOwnProperty(i)) {
          var item = routes[i];
          if(!item.hasOwnProperty('index')) {
            // 接口
            retRoutes[i] = nei.p(item.id, path.join(item.method, item.path));
          } else {
            // 同步路由
            var list = [];
            item.list.forEach(function(it) {
              list.push({i: it.id, p: it.path});
            });
            retRoutes[i] = nei.r(item.index, list);
          }
        }
      }
    }
    program.neiConfig.routes = retRoutes;

    // 切换到配置文件的工作目录
    process.chdir(path.dirname(program.config));
    program.emit('done');
  } else {
    // 配置文件不存在
    console.error(program.config + '文件不存在');
    console.log('jtr将结束服务');
    process.exit(0);
  }
} else {
  program.emit('done');
}
