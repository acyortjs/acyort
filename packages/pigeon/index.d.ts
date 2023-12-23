declare module '@acyort/pigeon' {
  import { Config as C } from 'acyort'
  import { TimeLike } from 'fs'

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

  interface Post {
    id: string,
    title: string,
    date: TimeLike,
    path: string,
    except: string,
    content: string,
    tags: string[],
    category: string,
  }
}
