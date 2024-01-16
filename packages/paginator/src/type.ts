export interface Params {
  baseUrl: string,
  /** if 0, return all in one page */
  perpage: number,
  data: any[],
  /** default "page", example: /page/1/, /page/2/ */
  prefix?: string,
}

export type PageCtx = { current: number } & Pick<Required<Params>, 'baseUrl' | 'prefix'>

export interface PagingData {
  baseUrl: Params['baseUrl'],
  prev: string,
  next: string,
  data: Params['data'],
  fullPath: string,
  current: PageCtx['current'],
  totalPage: number,
  total: number,
}
