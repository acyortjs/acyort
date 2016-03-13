
// issues data serialize

var hl = require('highlight.js');
var config = require('./config.js');

module.exports = function(data) {

    // 2016-01-21 --> 21 Jan, 2016
    function timeFormat(time) {
        var t = (new Date(time)).toString().substr(4, 11).split(' '),
            _t = time.split('T')[0].split('-'); 
        return [ 
            t[0] +' '+ t[1] +', '+ t[2], _t[0], _t[1], _t[2]
        ]
    }

    // array unique
    function unique(array) {
        array = array.filter(function (item, index, inputArray) {
            return inputArray.indexOf(item) == index;
        })
        return array
    }

    var _data = [], categories = [], tags = [];

    data.forEach(function(e, i) {

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
        var r = /\<!-- tags:(.*)--\>/;
        r = e.body.match(r);
        if (r) {
            _data[i].tags = r[1].trim().split(',');
            tags = tags.concat(_data[i].tags);
        }

        _data[i].id = e.id;
        _data[i].title = e.title;
        _data[i].author = {
            name: e.user.login,
            avatar: e.user.avatar_url,
            url: e.user.html_url
        };

        var t = timeFormat(e.created_at);

        // time
        _data[i].post_time = t[0];
        _data[i].post_year = t[1];
        _data[i].post_month = t[2];
        _data[i].post_day = t[3];

        _data[i].path = '/'+ t[1] +'/'+ t[2] +'/'+ e.id +'.html';

        // content
        _data[i].summary = e.body.indexOf('<!-- more -->') > -1 ? e.body.split('<!-- more -->')[0] : ''; 
        _data[i].body = e.body;

    })

    return {
        posts: _data,
        tags: tags,
        categories: categories ? categories : [].push(config.default_category)
    }

}
