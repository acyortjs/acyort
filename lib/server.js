
var static = require('node-static'),
    fs = require('fs-extra'),
    http = require('http');

var file = new static.Server(process.cwd() +'/public', {
    cache: 3600,
    gzip: true
})

http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response)
    }).resume()
}).listen(2222)

console.log('Running at: http://127.0.0.1:2222')
