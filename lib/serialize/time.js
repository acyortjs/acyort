// time format
// month M MM MMM MMMM 1 01 Jan January
// day D Do DD 1 1st 01
// week ddd dddd Sun Sunday
// year YYYY 1970 

var moment = require('moment');

module.exports = function(time) {

    time = moment(time).format('M,MM,MMM,MMMM,D,Do,DD,ddd,dddd,YYYY').split(',');
    
    return {
        M:      time[0],
        MM:     time[1],
        MMM:    time[2],
        MMMM:   time[3],
        D:      time[4],
        Do:     time[5],
        DD:     time[6],
        ddd:    time[7],
        dddd:   time[8],
        YYYY:   time[9]
    }

}
