import { HeadingIDFormatter } from './type'

const regex = /[^<]*(<a href="([^"]+)">([^<]+)<\/a>)/

export default (getHeadingId?: HeadingIDFormatter) => (text: string, level: number) => {
  const marched = text.match(regex)
  const id = getHeadingId?.(text) || text

  if (!marched) {
    return `<h${level}>
  <a href="#${id}" id="${id}"></a>${text}
</h${level}>`
  }

  return `<h${level}>
  <a href="${marched[2]}" id="${marched[2].split('#')[1]}"></a>${marched[3]}
</h${level}>`
}
