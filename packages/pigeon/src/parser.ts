import { AcyOrt } from 'acyort'
import { Config } from '@acyort/pigeon'
import getContent from './content'
import getArchives from './archives'

export default (acyort: AcyOrt) => {
  const config = acyort.config as Config
  const { perpage = 10 } = config
}
