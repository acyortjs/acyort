
// time format
// 2016-01-21 --> 21 Jan, 2016

module.exports = function(time) {
    time = (new Date(time)).toString().substr(4, 11).split(' ');
    return time[0] +' '+ time[1] +', '+ time[2]
}
