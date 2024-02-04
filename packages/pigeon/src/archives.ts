import paginator from '@acyort/paginator'
import { Config, Post } from '@acyort/pigeon'
import { getTimer } from './helpers'

export default (posts: Post[], config: Config) => {
  const perpage = config.archives_perpage === undefined ? 30 : config.archives_perpage
  const timer = getTimer(config)
  const pages = paginator({ baseUrl: '/archives/', perpage, data: posts })

  pages.forEach((page) => {
    const currentPosts = page.data as Post[]
    const result: (Post | string)[] = []

    let year: string

    currentPosts.forEach((post) => {
      const current = timer(post.createdAt, 'YYYY')
      if (year !== current) {
        year = current
        result.push(current)
      }
      result.push(post)
    })

    // eslint-disable-next-line no-param-reassign
    page.data = result
  })

  return pages
}
