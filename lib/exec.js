
module.exports = function(command, success) {

    var child = require('child_process').exec(command);

    child.stdout.on('data', function(data) {
        console.log(data)
    })

    child.stderr.on('data', function(data) {
        console.error(data)
    })

    child.on('exit', function(code) {
        if (success) {
            console.log(success)
        }
    })

}
