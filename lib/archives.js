
// archives

module.exports = function(posts) {

    var data = [];

    data[0] = {
        year: posts[0].time.YYYY,
        posts: []
    };

    var index = 0;

    posts.forEach(function(post, i) {
        if (i != 0 && post.time.YYYY != posts[i - 1].time.YYYY) {
            index ++;
            data[index] = {
                year: post.time.YYYY,
                posts: []
            }
        }
        data[index].posts.push(post)
    })

    return {
        posts: data
    }

}

