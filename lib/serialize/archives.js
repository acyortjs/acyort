function Archives(posts) {
    const archives = []
    let index = 0

    const getYear = time => time.split('T')[0].split('-')[0]

    posts.forEach((post, i) => {
        const year = getYear(post.created)

        if (i === 0) {
            archives[0] = { year, posts: [] }
        }

        if (i !== 0 && year !== getYear(posts[i - 1].created)) {
            index += 1
            archives[index] = { year, posts: [] }
        }

        archives[index].posts.push(post.id)
    })

    return archives
}

module.exports = Archives
