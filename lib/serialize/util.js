
// util function

module.exports = {

    // 2016-01-21 --> 21 Jan, 2016
    timeFormat: function(time) {
        var t = (new Date(time)).toString().substr(4, 11).split(' '),
            _t = time.split('T')[0].split('-'); 
        return [ 
            t[0] +' '+ t[1], _t[0], _t[1], _t[2]
        ]
    },

    // array unique
    unique: function(array) {
        array = array.filter(function (item, index, inputArray) {
            return inputArray.indexOf(item) == index;
        })
        return array
    }

}

