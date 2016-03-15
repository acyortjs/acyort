
// archives

module.exports = function(data) {

    var _data = [];

    data.forEach(function(e, i) {
        var s = {
            post_year: e.post_year,
            post_class: 'year'
        }
        
        if (i != 0 && e.post_year != data[i - 1].post_year) {
            _data[_data.length] = s
        }
        _data[_data.length] = e
    })

    _data.unshift({
        post_year: data[0].post_year,
        post_class: 'year'
    })

    return _data

}

