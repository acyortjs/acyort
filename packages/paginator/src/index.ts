import { join } from 'path'
import { Params, PageCtx, PagingData } from './type'

function getPath(args: PageCtx) {
  const { current, prefix, baseUrl } = args
  if (current === 1) {
    return baseUrl
  }
  return join(baseUrl, prefix, current.toString(), '/')
}

function getPrev(args: PageCtx) {
  const { current, prefix, baseUrl } = args

  if (current === 1) {
    return ''
  }
  if (current === 2) {
    return join(baseUrl, '/')
  }
  return join(baseUrl, prefix, (current - 1).toString(), '/')
}

function getNext(args: PageCtx) {
  const { current, prefix, baseUrl } = args
  return join(baseUrl, prefix, (current + 1).toString(), '/')
}

export default (args: Params): PagingData[] => {
  const {
    baseUrl,
    perpage,
    data,
    prefix = 'page',
  } = args

  if (perpage === 0 || data.length <= perpage) {
    return [{
      baseUrl,
      prev: '',
      next: '',
      data,
      fullPath: getPath({ baseUrl, current: 1, prefix }),
      current: 1,
      total: data.length,
      totalPage: 1,
    }]
  }

  const result: PagingData[] = []
  const totalPage = Math.ceil(data.length / perpage)

  let page = 1

  for (let i = 0; i < data.length; i += perpage) {
    result.push({
      baseUrl,
      prev: getPrev({ baseUrl, current: page, prefix }),
      next: getNext({ baseUrl, current: page, prefix }),
      data: data.slice(i, i + perpage),
      fullPath: getPath({ baseUrl, current: page, prefix }),
      current: page,
      total: data.length,
      totalPage,
    })

    if (page === totalPage) {
      result[page - 1].next = ''
    }

    page += 1
  }

  return result
}
