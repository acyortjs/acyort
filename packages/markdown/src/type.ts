export type ObjectString = Record<string, string>

export type HeadingIDFormatter = (id: string) => string

export interface RenderOptions {
  lineNumbers?: boolean,
  getHeadingId?: HeadingIDFormatter,
}
