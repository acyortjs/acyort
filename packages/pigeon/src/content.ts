import { GithubIssus, Page, Post } from '@acyort/pigeon'
import Markdown from '@acyort/markdown'

const md = new Markdown({ lineNumbers: true })

const getExcept = (issue: string) => {
  const regex = /<!--\s*more\s*-->/
  if (!regex.test(issue)) {
    return ''
  }
  const splited = issue.split(regex)
  return splited[0]
}

export default (issues: GithubIssus[], users?: string) => {
  const regex = /^\[(.+?)]/
  const posts: Post[] = []
  const pages: Page[] = []
  const postsUsers = users?.split(',')

  issues.forEach((issue) => {
    const {
      title,
      id,
      updated_at,
      created_at,
      body,
      state,
      milestone,
      labels,
      user,
    } = issue

    if (postsUsers && !postsUsers.includes(user.login)) {
      return
    }

    if (state === 'close') {
      return
    }

    // "title": "[about]Beginning Again"
    if (regex.test(title)) {
      const [,t] = title.split(regex)
      pages.push({
        title: t,
        id,
        createdAt: created_at,
        updatedAt: updated_at,
        content: md.render(body),
        path: `/${t.toLowerCase()}/index.html`,
      })
    } else {
      posts.push({
        id,
        title,
        createdAt: created_at,
        updatedAt: updated_at,
        path: `/posts/${id}.html`,
        except: md.render(getExcept(body)),
        content: md.render(body),
        category: milestone ? {
          title: milestone.title,
          description: milestone.description || undefined,
        } : undefined,
        tags: labels.map((l) => ({
          title: l.name,
          description: l.description || undefined,
        })),
      })
    }
  })

  return { pages, posts }
}
