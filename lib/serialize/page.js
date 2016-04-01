
// page posts
// return [page, posts]

module.exports = function(posts) {

    var page = [];

    posts.forEach(function(post, i) {
        var title = post.post_title;

        if (title.indexOf('[') > -1 && title.indexOf(']') > -1) {
            title = title.substr(1, title.indexOf(']') - 1);
            post.path = '/'+ title +'/index.html';
            post.post_title = post.post_title.split(']')[1];

            page = page.concat(posts.splice(i, 1))
        }

        return [page, posts]
    })

}
