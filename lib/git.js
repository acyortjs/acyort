
var exec = require('child_process').exec,
    fs = require('fs'),
    config = require('../config.js');
    
var cmdStr = 'git clone '+ config.siterepo +' public';

if (process.argv[2] == 'deploy') {

    cmdStr = 'cd public && git add . && git commit -am "update '+ new Date().toISOString() +'" && git push';

    if (config.siterepo) {
        exec(cmdStr, function (err, stdout, stderr) {
            if (err) {
                return console.error(stderr)
            }
        })
    } 

} else {

    if (config.siterepo) {
        exec(cmdStr, function (err, stdout, stderr) {
            if (err) {
                return console.error(stderr)
            }
        })
    } else {
        fs.mkdir('./public', function (err) {
            if (err) {
                return console.error(err)
            }
        })
    }

}
