import { AcyOrt } from 'acyort'
import { Config } from '@acyort/pigeon'
import request from './request'
import getContent from './content'
import getData from './data'
import render from './render'
import copy from './copy'

export default (acyort: AcyOrt) => {
  acyort.cli.register('command', {
    name: 'pigeon',
    description: 'static website plugin',
    async action() {
      const issues = await request(this)
      const content = getContent(issues)
      const data = getData(content, this.config as Config)
      render(data, this)
      copy(this)
    },
  })
}

export const template = 'pavane'
