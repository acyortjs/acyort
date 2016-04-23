
// archives

module.exports = function(posts) {

    var lists = [];

    var index = 0;

    function year(time) {
        return time.split('T')[0].split('-')[0];
    }

    posts.forEach(function(post, i) {

        if (i == 0) {

            lists[0] = {
                year: year(post.created),
                posts: []
            }

        }

        if (i != 0 && year(post.created) != year(posts[i - 1].created)) {

            index ++;

            lists[index] = {
                year: year(post.created),
                posts: []
            }

        }

        lists[index].posts.push(post.id)

    })

    lists = lists.map(function(list) {
        return {
            year: list.year,
            posts: list.posts,
            number: list.posts.length
        }
    })

    return {
        lists: lists
    }

}

