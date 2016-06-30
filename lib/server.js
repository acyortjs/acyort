
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var colors = require('colors');
var chokidar = require('chokidar');
var ws = require('ws').Server;

var config = require('../lib/config');

module.exports = function(port) {

    var server = http.createServer(function(request, response) {

        var uri = url.parse(request.url).pathname;
        var filename = path.join(process.cwd(), uri);

        fs.exists(filename, function(exists) {

            if (!exists) { 
                response.writeHead(404, {'Content-Type': 'text/plain'})
                response.write('404 Not Found')
                response.end()
                return
            }

            if (fs.statSync(filename).isDirectory()) {
                filename += 'index.html'
            }

            if (!fs.existsSync(filename)) {
                response.writeHead(404, {'Content-Type': 'text/plain'})
                response.write('404 Not Found')
                response.end()
                return
            }

            fs.readFile(filename, 'binary', function(err, file) {
                    
                if (err) {        
                    response.writeHead(500, {'Content-Type': 'text/plain'})
                    response.write(err)
                    response.end()
                    return
                }

                response.writeHead(200, {'Content-Type': mime.lookup(filename)})
                response.write(file, 'binary')
                response.write('<script>var ws=new WebSocket("ws://127.0.0.1:'+ port +'");ws.onmessage=function(e){location.reload()}</script>')
                response.end()

            })

        })

    }).listen(port)

    var wsServer = new ws({server: server});

    var watcher = chokidar.watch(process.cwd() +'/themes/'+ config.theme, {
        ignored: /[\/\\]\./,
        persistent: true
    })

    wsServer.on('connection', function(ws) {

        watcher.on('all', function(e, path) {
            ws.send(JSON.stringify({'event': e, 'path': path}), function() { /* error */ })
        })

    })


    console.log('server running at'.blue +'\n=> http://127.0.0.1:' + port + '/\nCTRL + C to shutdown')

}
