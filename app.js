
var https = require('https'),
    http = require('http'),
    marked = require('marked'),
    fs = require('fs'),
    hl = require('highlight.js'),
    mustache = require('mustache');

var config = require('./config.js');

var _data = [], page = 1, get_issues;

function opt(page) {
    return {
        //host: '127.0.0.1',
        //path: '/AcyOrt/temp/'+ page +'.json',
        host: 'api.github.com',
        path: '/repos/'+ config.user +'/'+ config.repo +'/issues?page='+ page +'&per_page=10'+ (config.token ? '&access_token='+ config.token : ''),
        method: 'GET',
        headers: {'user-agent': 'node.js'}
    }
}

// time format
function timeFormat(time) {
    time = (new Date(time)).toString().substr(4, 11).split(' ');
    return time[0] +' '+ time[1] +', '+ time[2]
}

// folder
if (!fs.existsSync('./posts')) {
    fs.mkdirSync('./posts')
}
if (!fs.existsSync('./pages')) {
    fs.mkdirSync('./pages')
}

;(get_issues = function() {

    console.log('Get 10 Posts ['+ page +']...')

    https.get(opt(page), function(res) {
    //http.get(opt(page), function(res) {

        res.setEncoding('utf-8')

        if (res.statusCode != 200) {
            console.log('error'+ res.statusCode)
            process.exit()
        }

        var _s = '';

        res.on('data', function(chunk) {
            _s += chunk
        })

        res.on('end', function() {
            console.log('Get 10 Posts ['+ page +']...Done')

            _s = JSON.parse(_s);

            if (_s.length > 0) {
                _data = _data.concat(_s);

                page ++;
                setTimeout(function() { get_issues() }, 1000)
            } else {
                // Authors Filter
                var data = [];
                if (config.authors.length > 0) {

                    for (var i = 0; i < _data.length; i ++) {
                        var user = _data[i].user.login;

                        for (var j = 0; j < config.authors.length; j ++) {
                            if (user == config.authors[j]) {
                                data.push(_data[i])
                                continue
                            }
                        }
                    }

                } else {
                    data = _data
                }

                build_html(data)
            }
        })

    }).on('error', function(e) {
        console.log(e)
    })

}).call()

function build_html(data) {

    console.log('Building Html...')

    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        highlight: function (code) {
            return hl.highlightAuto(code).value
        }
    })

    var template_index = fs.readFileSync('./templates/index.html', 'utf8'),
        template_post = fs.readFileSync('./templates/post.html', 'utf8');

    // generate posts
    for (var i = 0; i < data.length; i ++) {

        // index/page summary
        data[i].index_body = data[i].body.indexOf('<!-- more -->') > -1 ? data[i].body.split('<!-- more -->')[0] : '';

        (function(i) {

            // remove summary separator
            data[i].body = data[i].body.replace('<!-- more -->', '');
            // markdown parse
            data[i].body = marked(data[i].body);
            // post page title
            data[i].full_title = data[i].title +' - '+ config.title;
            // post update time
            data[i].updated_at = timeFormat(data[i].updated_at.split('T')[0]);
            // site info
            data[i].page_title = config.title;
            data[i].about = config.about;
            data[i].year = new Date().getFullYear();

            // time folder
            var time = data[i].created_at.split('T')[0].split('-');
            if (!fs.existsSync('./posts/'+ time[0])) {
                fs.mkdirSync('./posts/'+ time[0])
            }
            if (!fs.existsSync('./posts/'+ time[0] +'/'+ time[1])) {
                fs.mkdirSync('./posts/'+ time[0] +'/'+ time[1])
            }

            fs.writeFile('./posts/'+ time[0] +'/'+ time[1] +'/'+ data[i].id +'.html', mustache.render(template_post, data[i]), 'utf8', function(err) {
                if (err) {
                    console.log(err)
                }
                console.log('Success build ./posts/'+ time[0] +'/'+ time[1] +'/'+ data[i].id +'.html')
            })

        })(i)
    }

    // generate pages
    if (data.length > config.perpage) {

        var k = 1, paging = Math.ceil(data.length / config.perpage);

        for (var j = 0; j < data.length; j += config.perpage) {

            (function(j, k) {

                var index = {};
                index.posts = data.slice(j, j + config.perpage);
                index.title = config.title;
                index.year = new Date().getFullYear();
                index.about = config.about;

                // post url / time
                for (var n = 0; n < index.posts.length; n ++) {
                    index.posts[n].post_url = function() {
                        var t = this.created_at.split('T')[0].split('-');
                        return '/posts/'+ t[0] +'/'+ t[1] +'/'+ this.id +'.html'
                    }
                    index.posts[n].post_time = function() {
                        return timeFormat(this.updated_at.split('T')[0])
                    }
                }

                // pagination
                index.next = '<a rel="next" href="/pages/'+ (k + 1) +'/">Older Posts →</a>';
                index.prev = '<a rel="prev" href="/pages/'+ (k - 1) +'/">← Newer Posts</a>';
                if (k == 1) {
                    index.prev = ''
                }
                if (k == 2) {
                    index.prev = '<a href="/">← Newer Posts</a>'
                }
                if (k == paging) {
                    index.next = ''
                }

                // pages
                if (k > 1) {
                    if (!fs.existsSync('./pages/'+ k)) {
                        fs.mkdirSync('./pages/'+ k)
                    }

                    fs.writeFile('./pages/'+ k +'/index.html', mustache.render(template_index, index), 'utf8', function(err) {
                        if (err) {
                            console.log(err)
                        }
                        console.log('Success build ./pages/'+ k +'/index.html')
                    })
                }

                // index page
                if (k == 1) {
                    fs.writeFile('./index.html', mustache.render(template_index, index), 'utf8', function(err) {
                        if (err) {
                            console.log(err)
                        }
                        console.log('Success build ./index.html')
                    })
                }

            })(j, k)

            k ++;
        }

    } else {

        var index = {};
        index.posts = data;
        index.title = config.title;
        index.year = new Date().getFullYear();
        index.about = config.about;

        for (var n = 0; n < index.posts.length; n ++) {
            index.posts[n].post_url = function() {
                var t = this.created_at.split('T')[0].split('-');
                return '/posts/'+ t[0] +'/'+ t[1] +'/'+ this.id +'.html'
            }
            index.posts[n].post_time = function() {
                return timeFormat(this.updated_at.split('T')[0])
            }
        }

        index.prev = '';
        index.next = '';

        fs.writeFile('./index.html', mustache.render(template_index, index), 'utf8', function(err) {
            if (err) {
                console.log(err)
            }
            console.log('Success build ./index.html')
        })

    }

}
