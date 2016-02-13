
var express = require('express');

var server = express();

server.use(express.static('./')).listen(2222)

console.log('Running at: http://127.0.0.1:2222')
