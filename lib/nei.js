// root config
var ROOT = {
    API: '',
    VIEW: '',
    MOCKTPL: '',
    MOCKAPI: ''
};
var VIEW_EXT = '';
// get data from nei
var get = function(type,id,callback){
    if (!ROOT.API){
        callback(null);
        return;
    }
    var uri = require('util').format(
            ROOT.API,type,id
        ),
        https = /^https:\/\//i.test(uri);
    require(https?'https':'http').get(
        uri,function(res){
            var ret = [];
            res.on('data',function(chunk){
                ret.push(chunk.toString());
            });
            res.on('end',function(){
                var json = null;
                try{
                    json = JSON.parse(ret.join(''));
                }catch(ex){
                    // ignore
                }
                callback((json||{}).result);
            });
        }
    ).on(
        'error',function(error){
            callback(null);
        }
    );
};
// load data from local cache or nei server
var load = function(type,id,path,callback){
    var filter = null;
    try{
        var file = path+'.js';
        filter = require(file);
        delete require.cache[
            require.resolve(file)
        ];
    }catch(ex){
        // ignore
    }
    // filter is json object
    if (!!filter&&(typeof filter)!=='function'){
        callback(filter);
        return;
    }
    get(type,id,function(json){
        if (json==null){
            try{
                var file = path+'.json';
                json = require(file);
                delete require.cache[
                    require.resolve(file)
                ];
            }catch(ex){
                // ignore
            }
        }
        if (!!filter){
            json = filter(json);
        }
        callback(json);
    });
};
// setting
exports.setting = function(obj) {
  ROOT.API = obj.api;
  ROOT.VIEW = obj.view;
  ROOT.MOCKTPL = obj.mockTpl;
  ROOT.MOCKAPI = obj.mockApi;
  VIEW_EXT = obj.viewExt;
};
// api proxy
exports.p = function(id,path){
    return function(req,res,next){
        load(3,id,ROOT.MOCKAPI+path,function(json){
            res.send(json);
        });
    };
};
// page proxy
exports.r = function(index,list){
    return function(req,res,next){
        var conf = list[index];
        load(1,conf.i,ROOT.MOCKTPL+conf.p,function(json){
            res.render(conf.p+VIEW_EXT,json);
        });
    };
};