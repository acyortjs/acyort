# Changelog

## 3.4.0

- feat: hooks
- refactor: reget template path when set config template

## 3.3.2

- chore: update dependencies
- refactor: url helper default set lower case

## 3.3.1

- chore: acyort.js.org
- feat(renderer): register duplicate detection
- feat(CLI): register duplicate detection

## 3.3.0

- chore: update dependencies
- refactor: use `signale` for logger
- refactor: error log to throw error
- refactor: util method
- refactor: move API `process` to `workflow`
- feat: helper `get` API, remove `language` API
- feat: config `set` and `get` API

## 3.2.1

- feat: can set default url empty
- fix: log plugin error message

## 3.2.0

- fix: store same key

## 3.1.0 ~ 3.1.1

- feature: module use will initialize plugins
- refactor: remove scripts option, all use plugins option
- test: add plugin test
- fix: cli logger error

## 3.0.12 ~ 3.0.13

- feature: store width namespace
- refactor: cli action can access `process` method only

## 3.0.11

- feature: npm template support #53
- chore: npm test silent mode

## 3.0.7 ~ 3.0.10

- feature:
  * cli action can access store
  * cli action bind AcyOrt context
- fix:
  * helpers bind page context error
  * store set data error

## 3.0.6

- version: default version ^3
- feature
  * store reset method
  * flow process will reset store

## 3.0.3

- fix: cli function
- feature: restrict cli action access AcyOrt functions

## 3.0.2

- initial release
