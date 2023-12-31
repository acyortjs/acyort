declare module '@acyort/pigeon' {
  import { Config as C } from 'acyort'
  import { PagingData } from '@acyort/paginator'

  interface Config extends C {
    template: string,
    repository: string,
    title?: string,
    description?: string,
    menu?: Record<string, string>,
    public?: string,
    favicon?: string,
    timezone?: string,
    language?: string,
    perpage?: number,
    archives_perpage?: number,
  }

  interface Category {
    title: string,
    description?: string,
    posts: number[],
    pages: PagingData[],
    url: string,
  }

  interface Tag {
    title: string,
    description?: string,
    posts: number[],
    pages: PagingData[],
    url: string,
  }

  interface Post {
    id: number,
    title: string,
    createdAt: string,
    updatedAt: string,
    path: string,
    except: string,
    content: string,
    tags: {
      title: string,
      description?: string,
    }[],
    category?: {
      title: string,
      description?: string,
    },
    prev?: Omit<Post, 'content'>,
    next?: Omit<Post, 'content'>,
  }

  interface Page {
    id: number,
    title: string,
    createdAt: string,
    updatedAt: string,
    content: string,
    path: string,
  }

  interface GithubIssus {
    url: string,
    repository_url: string,
    html_url: string,
    id: number,
    node_id: string,
    number: number,
    title: string,
    user: {
      login: string,
      id: number,
      node_id: string,
      avatar_url: string,
      url: string,
      html_url: string,
    },
    labels: {
      id: number,
      node_id: string,
      url: string,
      name: string,
      color: string,
      default: boolean,
      description?: string,
    }[],
    state: 'open' | 'close',
    locked: boolean,
    milestone?: {
      html_url: string,
      id: number,
      node_id: string,
      number: number,
      title: string,
      description: string,
      open_issues: number,
      closed_issues: number,
      state: 'open' | 'close',
      created_at: string,
      updated_at: string,
    },
    comments: number,
    created_at: string,
    updated_at: string,
    body: string,
  }
}
