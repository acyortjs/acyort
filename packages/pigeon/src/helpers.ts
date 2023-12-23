import { TimeLike } from 'fs'
import moment from 'moment'
import momentTz from 'moment-timezone'
import { Config } from '@acyort/pigeon'

export const getTimer = (config: Config) => {
  const {
    language = 'en',
    timezone = moment.tz.guess(),
  } = config

  return (time: TimeLike, format: string) => momentTz(moment(time)
    .locale(language), timezone)
    .format(format)
}
