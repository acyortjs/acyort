
// issues data serialize

var hl = require('highlight.js');
var marked = require('marked');
var config = require('./config.js');
var util = require('./util.js');

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

module.exports = function(data) {

    // authors filter
    var authors_data = [];
    if (config.authors.length > 0) {
        data.forEach(function(e, i) {
            config.authors.forEach(function(author) {
                if (author == e.user.login) {
                    authors_data.push(e)
                    return
                }
            })
        })
    } else {
        authors_data = data
    }

    var _data = [], categories = [], tags = [], pages = [];

    authors_data.forEach(function(e, i) {

        _data[i] = {};

        // categories
        _data[i].categories = [];
        if (e.labels.length) {
            e.labels.forEach(function(label) {
                _data[i].categories.push(label.name) 

                // all categories
                categories.push(label.name)
            })
        } else {
            _data[i].categories.push(config.default_category)
        }

        // tags
        _data[i].tags = [];
        var re = /\<!-- tags:(.*)--\>/;
        re = e.body.match(re);
        if (re) {
            e.body = e.body.replace(re[0], '');
            re = re[1].trim().split(',');
            var _re = [];
            re.forEach(function(r, i) {
                _re[i] = r.trim()
            })
            _data[i].tags = _re;
            tags = tags.concat(_re);
        }

        _data[i].id = e.id;
        _data[i].post_title = e.title;
        _data[i].author = {
            name: e.user.login,
            avatar: e.user.avatar_url,
            url: e.user.html_url
        };

        var t = util.timeFormat(e.created_at);

        // time
        _data[i].updated_time = e.updated_at;
        _data[i].post_time = t[0];
        _data[i].post_year = t[1];
        _data[i].post_month = t[2];
        _data[i].post_day = t[3];

        _data[i].path = '/'+ t[1] +'/'+ t[2] +'/'+ e.id +'.html';

        // content
        _data[i].summary = e.body.indexOf('<!-- more -->') > -1 ? e.body.split('<!-- more -->')[0] : ''; 
        _data[i].body = marked(e.body.replace('<!-- more -->', ''));

    })

    // pages
    _data.forEach(function(e, i) {
        var t = e.post_title;
        if (t.indexOf('[') > -1 && t.indexOf(']') > -1) {
            t = t.substr(1, t.indexOf(']') - 1);
            e.path = '/'+ t +'/index.html';
            e.post_title = e.post_title.split(']')[1];

            // separate
            pages = pages.concat(_data.splice(i, 1))
        }
    })

    return {
        posts: _data,
        pages: pages,
        tags: util.unique(tags),
        categories: categories ? util.unique(categories) : [].push(config.default_category)
    }

}
