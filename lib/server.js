
var static = require('node-static');
var http = require('http');
var colors = require('colors');

var file = new static.Server(process.cwd(), {
    cache: 3600,
    gzip: true
})

module.exports = function() {

    http.createServer(function (request, response) {
        request.addListener('end', function () {
            file.serve(request, response)
        }).resume()
    }).listen(2222)

    console.log('Info: '.green +'running at: http://127.0.0.1:2222')

}
