var jtr = require('../index');
var u = require('./util');

var routes = {
  "GET /api/account/authority/get":u.p(15278,"get/api/account/authority/get"),
  "GET /api/account/info/get":u.p(15277,"get/api/account/info/get"),
  "GET /api/blog/list":u.p(15273,"get/api/blog/list"),
  "GET /api/tag/list":u.p(15276,"get/api/tag/list"),
  "GET /":u.r(0,[{"i":10947,"p":"index"}]),
  "GET /blog/":u.r(0,[{"i":10947,"p":"index"}]),
  "GET /blog/list/":u.r(0,[{"i":10947,"p":"index"}]),
  "GET /blog/tag/":u.r(0,[{"i":10947,"p":"index"}]),
  "GET /setting/":u.r(0,[{"i":10947,"p":"index"}]),
  "GET /setting/account/":u.r(0,[{"i":10947,"p":"index"}]),
  "GET /setting/permission/":u.r(0,[{"i":10947,"p":"index"}])
};

jtr({
  port: 8001,
  dir: path.join(__dirname, './demo/webapp/'),
  views: './WEB-INF/views/',
  rules: routes,
  launch: true
});
