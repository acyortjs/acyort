
// get data from issues via github API

var config = require('./config');
var rp = require('request-promise');

var API = 'https://api.github.com/repos/'+ config.issue_repo +'/issues';

// local develop mode
// set config.dev = true
config.dev = false;
config.dev_url = 'http://www/acyort/test/';


module.exports = function(callback) {

    var page = 1;
    var issues = [];
    var fetch;

    var options = function(page) {
        var req = {
            uri: config.dev ? config.dev_url + page +'.json' : API,
            headers: {
                'User-Agent': 'AcyOrt'
            },
            qs: {
                page: page,
                per_page: 20
            },
            json: true
        }

        if (config.token) {
            req.qs.access_token = config.token.split(' ').join('')
        }

        return req
    }

    ;(fetch = function() {

        var req = options(page)

        console.log('fetching data from '+ req.uri +' ['+ page +']...')

        rp(req)
            .then(function(data) {

                console.log('fetching data from '+ req.uri +' ['+ page +']...done')

                if (!data.length) {
                    return callback(issues)
                }

                issues = issues.concat(data);

                page ++;

                setTimeout(function() { fetch() }, 1000)

            })
            .catch(function(err) {
                console.error('error '+ err.statusCode)
            })

    })()

}
