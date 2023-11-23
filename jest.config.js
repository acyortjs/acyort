const transform = {
  '^.+\\.ts?$': 'ts-jest',
}

module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  projects: [
    {
      displayName: 'i18n',
      roots: ['<rootDir>/packages/i18n'],
      // https://github.com/jestjs/jest/issues/11411
      transform,
    },
    {
      displayName: 'markdown',
      roots: ['<rootDir>/packages/markdown'],
      transform,
    },
  ],
}
