var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');

var path2fmpp = path.join(__dirname, './libs/bin/fmpp' + (process.platform === 'win32' ? '.bat' : ''));

module.exports = function(options) {
  options = options || {};

  return function(filename, data, callback) {
    var sourceRoot = data.settings.views;
    // 清理data中的无用字段
    delete data.settings;
    delete data._locals;
    delete data.cache;
    
    var data = JSON.stringify(data);
    var tmpDir = __dirname + '/./tmp/';
    var dirname = tmpDir;
    var rdname = randomname();
    var tmpHtml = path.join(dirname, rdname + '.html');
    var tmpTdd = path.join(dirname, rdname + '.tdd');
    var tmpConfig = path.join(dirname, rdname + '.fmpp');

    fs.writeFileSync(tmpTdd, data, 'utf8');

    var config = [
      'sourceRoot:' + sourceRoot,
      'outputFile:' + tmpHtml,
      'sourceEncoding:UTF-8',
      'outputEncoding:UTF-8',
      'data:tdd(' + tmpTdd + ')'
    ];
    fs.writeFileSync(tmpConfig, config.join('\n\r'), 'utf8');

    // 执行命令
    var args = [filename, '-C', tmpConfig];
    var fmpp = spawn(path2fmpp, args, {});

    var errorMsg = '';
    fmpp.stdout.on('data', function (data) {
      errorMsg += data.toString();
    });

    fmpp.on('close', function(code) {
      if(~errorMsg.indexOf('>>> ABORTED! <<<') || code !== 0) {
        var isError = true;
        callback(errorMsg || 'uncatched freemarker parse Error occurs in ' + filename);
      }

      // 删除缓存配置文件
      fs.unlink(tmpConfig, function() {});
      // 删除缓存数据文件
      fs.unlink(tmpTdd, function() {});
      // 删除缓存html文件并返回
      fs.exists(tmpHtml, function(flag) {
        if(isError) return fs.unlink(tmpHtml, function() {});

        fs.readFile(tmpHtml, 'utf8', function(err, content) {
          callback(err, content);
          fs.unlink(tmpHtml, function() {});
        });
      });
    });

  }
}

function randomname(){
  return 'tmp' + (+new Date);
}
