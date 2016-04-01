
// get post thumb
// the issue first image
// return [image url, match string]

module.exports = function(post) {

    var reg = /(!\[.*?\]\()(.+?)(\))/;

    reg = post.match(reg);

    if (!reg) {
        return []
    }

    return [reg[2].split('"')[0].trim(), reg[0]]

}
