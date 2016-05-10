
// paginator via Hexo

module.exports = function(url, current, total) {

    var show_all = false;
    var endSize = 1;
    var midSize = 2;
    var space = '&hellip;';

    var front = '';
    var back = '';

    var link = function(i) {
        return i == 1 ? url : url + i +'/'
    }

    var pageNum = function(i) {
        return '<a href="' + link(i) + '">' + i + '</a>';
    }

    if (show_all) {

        for (var i = 1; i <= total; i ++) {
            if (i == current) {
                front += '<span class="current">'+ i +'</span>'
            } else {
                front += pageNum(i)
            }
        }

    } else {

        if (endSize) {

            var endmax = current <= endSize ? current - 1 : endSize;
            for (var i = 1; i <= endmax; i ++) {
                front += pageNum(i)
            }

            var endmin = total - current <= endSize ? current + 1 : total - endSize + 1;
            for (var i = total; i >= endmin; i --) {
                back = pageNum(i) + back
            }

            if (space) {
                var space_html = '<span class="space">'+ space +'</span>';
                if (current - endSize - midSize > 1) {
                    front += space_html
                }
                if (total - endSize - midSize > current) {
                    back = space_html + back
                }
            }

        }

        if (midSize) {

            var midmin = current - midSize <= endSize ? current - midSize + endSize : current - midSize;
            if (midmin > 1) {
                for (var i = midmin; i <= current - 1; i ++) {
                    front += pageNum(i)
                }
            }

            var midmax = current + midSize + endSize > total ? current + midSize - endSize : current + midSize;
            if (midmax < total) {
                for (var i = midmax; i >= current + 1; i --) {
                    back = pageNum(i) + back
                }
            }

        }

        front += '<span class="current">' + current + '</span>';

    }

    return front + back

}
