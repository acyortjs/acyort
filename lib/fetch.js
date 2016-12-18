const config = require('./config')()
const { fetch, log } = require('./util')

function Fetch() {
    let issues = []
    let page = 1

    const { user, repository } = config

    const options = () => {
        let data = { page, per_page: 10 }

        if (config.token) {
            data = Object.assign({ access_token: config.token }, data)
        }

        return data
    }

    return new Promise((resolve, reject) => {
        const load = () => {
            log.info(`Getting data from GitHub (${user}/${repository}) ... ${page}`)

            fetch(user, repository, options())
                .then((res) => {
                    const { data, headers: { link } } = res
                    issues = issues.concat(data)

                    if (!link || link.indexOf('rel="next"') === -1) {
                        resolve(issues)
                    } else {
                        page += 1
                        setTimeout(load, 1000)
                    }
                })
                .catch(err => reject(err))
        }

        if (!user || !repository) {
            reject('Missing repository infomation')
        } else {
            load()
        }
    })
}

module.exports = Fetch
