import { marked } from 'marked'
import Parser from './parser'
import { RenderOptions } from './type'

export default class extends Parser {
  render(content: string, option: RenderOptions) {
    const renderer = Object.assign(new marked.Renderer(), this.markedRender(option))
    marked.setOptions({ renderer })
    return marked(content)
  }
}
