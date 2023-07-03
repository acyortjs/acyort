module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      diagnostics: false,
      useESM: true,
    },
  },
  collectCoverage: true,
  projects: [
    {
      displayName: 'i18n',
      roots: ['<rootDir>/packages/i18n'],
    },
  ],
}
