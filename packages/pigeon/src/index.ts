import { AcyOrt } from 'acyort'
import request from './request'

export default (acyort: AcyOrt) => {
  acyort.cli.register('command', {
    name: 'pigeon',
    description: 'static website plugin',
    async action() {
      const issues = await request(this)
      console.log(issues.length, issues[0])
    },
  })
}
