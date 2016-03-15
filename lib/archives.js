
// archives

module.exports = function(data) {

    var _data = [];

    data.forEach(function(e, i) {
        var s = {
            p_year: e.post_year,
            p_class: 'year'
        }
        
        if (i != 0 && e.post_year != data[i - 1].post_year) {
            _data[_data.length] = s
        }
        _data[_data.length] = e
    })

    _data.unshift({
        p_year: data[0].post_year,
        p_class: 'year'
    })

    data = {};
    data.posts = _data;

    return data

}

