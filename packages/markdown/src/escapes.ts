import { ObjectString } from './type'

const map = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
} as ObjectString

const reverse = {} as ObjectString

Object.keys(map).forEach((key) => {
  reverse[map[key]] = key
})

export const escapes = (t: string) => t.replace(/[&<>"'`=/]/g, (n) => map[n])

export const unescapes = (t: string) => {
  let next = t

  Object.keys(reverse).forEach((key) => {
    const regex = new RegExp(key, 'g')
    next = next.replace(regex, reverse[key])
  })

  return next
}
