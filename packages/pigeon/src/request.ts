import { join } from 'path'
import { existsSync, writeFileSync } from 'fs'
import axios from 'axios'
import { AcyOrt } from 'acyort'
import { Config, GithubIssus } from '@acyort/pigeon'

export default async (acyort: AcyOrt) => {
  const { logger, cwd } = acyort
  const config = acyort.config as Config
  const { repository } = config
  const cacheFilePath = join(cwd, 'issues.json')
  const { TOKEN } = process.env
  const requestHeaders: Record<string, string> = { 'User-Agent': 'acyort-pigeon' }

  if (TOKEN) {
    requestHeaders.Authorization = `token ${TOKEN}`
  }

  if (existsSync(cacheFilePath)) {
    return require(cacheFilePath) as GithubIssus[]
  }

  let result: GithubIssus[] = []

  const requestConfig = (page: number) => ({
    url: `/repos/${repository}/issues`,
    baseURL: 'https://api.github.com',
    headers: requestHeaders,
    params: {
      per_page: 20,
      page,
    },
  })

  return new Promise<GithubIssus[]>((resolve) => {
    const load = async (page: number) => {
      logger.info(`Getting issues data from github...${page}`)

      const { data, headers } = await axios(requestConfig(page))

      result = result.concat(data)

      if (headers?.link?.includes('rel="next"')) {
        load(page + 1)
      } else {
        writeFileSync(cacheFilePath, JSON.stringify(result))
        resolve(result)
      }
    }
    load(1)
  })
}
