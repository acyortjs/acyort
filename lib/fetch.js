const config = require('./config')()
const { fetch, log } = require('./util')

module.exports = function fetch() {
    let issues = []
    let page = 1
    let per_page = 10

    const { user, repository } = config

    const options = () => {
        let data = { page, per_page }

        if (config.token) {
            data = Object.assign({ access_token: config.token }, data)
        }

        return data
    }

    return new Promise((resolve, reject) => {
        const load = () => {
            log.info(`Getting data from GitHub (${user}/${repository}) ... ${page}`)

            fetch(user, repository, options())
                .then(res => {
                    const { data, headers: { link } } = res
                    issues = issues.concat(data)

                    if (link.indexOf('rel="next"') == -1) {
                        return resolve(issues)
                    }

                    page = page + 1
                    setTimeout(load, 1000)
                })
                .catch(err => reject(err))
        }

        load()
    })
}
