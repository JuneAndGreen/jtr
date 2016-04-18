#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var cli = path.join(path.dirname(fs.realpathSync(__filename)), '..', 'lib',"cli");

require(cli);
