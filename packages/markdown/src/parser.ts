import { Renderer } from 'marked'
import Code from './code'
import latex from './latex'
import listitem from './list'
import getHeading from './heading'
import { RenderOptions, HeadingIDFormatter } from './type'

export default class extends Code {
  private getHeadingId?: HeadingIDFormatter

  constructor(config: RenderOptions) {
    super(config.lineNumbers)
    this.getHeadingId = config.getHeadingId
  }

  markedRender(options: RenderOptions) {
    const {
      lineNumbers,
      getHeadingId = this.getHeadingId,
    } = options

    return {
      listitem,
      paragraph: latex,
      code: (block, lang) => this.codeRender(block, lang, lineNumbers),
      heading: getHeading(getHeadingId),
    } as Partial<Renderer>
  }
}
