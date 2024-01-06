import {
  Page,
  Post,
  Config,
  Category,
  Tag,
} from '@acyort/pigeon'
import paginator from '@acyort/paginator'
import getArchives from './archives'

const getTemplateData = (data: { pages: Page[], posts: Post[] }, config: Config) => {
  const { perpage = 10 } = config
  const categories: Category[] = []
  const tags: Tag[] = []

  data.posts.forEach((post, i) => {
    if (i > 0) {
      const { content, ...rest } = data.posts[i - 1]
      // eslint-disable-next-line no-param-reassign
      post.prev = rest
    }

    if (i < data.posts.length - 1) {
      const { content, ...rest } = data.posts[i + 1]
      // eslint-disable-next-line no-param-reassign
      post.next = rest
    }

    const { category, tags: postTags, id } = post
    const categoryTitle = category?.title || 'uncategorized'

    const existCategory = categories.find((c) => c.title === categoryTitle)
    if (existCategory) {
      existCategory.posts.push(id)
    } else {
      categories.push({
        title: categoryTitle,
        posts: [id],
        pages: [],
        description: category?.description,
        url: `/categories/${categoryTitle.toLowerCase()}/`,
      })
    }

    postTags.forEach((item) => {
      const existTag = tags.find((t) => t.title === item.title)
      if (existTag) {
        existTag.posts.push(id)
      } else {
        tags.push({
          title: item.title,
          description: item.description,
          posts: [id],
          pages: [],
          url: `/tags/${item.title.toLowerCase()}/`,
        })
      }
    })
  })

  return {
    archives: getArchives(data.posts, config),
    posts: data.posts,
    pages: data.pages,
    home: paginator({ baseUrl: '/', perpage, data: data.posts }),
    categories: categories.map((item) => ({
      ...item,
      pages: paginator({ baseUrl: item.url, perpage, data: item.posts }),
    })),
    tags: tags.map((item) => ({
      ...item,
      pages: paginator({ baseUrl: item.url, perpage, data: item.posts }),
    })),
  }
}

export type TemplateData = ReturnType<typeof getTemplateData>

export default getTemplateData
