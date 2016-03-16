
// archives

module.exports = function(data) {

    var _data = [];

    _data.push({
        year: data[0].post_year,
        data: []
    })

    var index = 0;

    data.forEach(function(e, i) {
        if (i != 0 && e.post_year != data[i - 1].post_year) {
            index ++;
            _data[index] = {
                year: e.post_year,
                data: []
            }
        }
        _data[index].data.push(e)
    })

    return _data

}

