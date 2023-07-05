const transform = {
  '^.+\\.ts?$': 'ts-jest',
}

module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'node',
  collectCoverage: true,
  projects: [
    {
      displayName: 'i18n',
      roots: ['<rootDir>/packages/i18n'],
      // https://github.com/jestjs/jest/issues/11411
      transform,
    },
  ],
}
