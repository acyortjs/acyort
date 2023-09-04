# AcyOrt

A Node.js static website framework.

## Install

```bash
$ npm i acyort -g
```

## Documentation

To check out the docs, visit https://acyort.js.org

## Development

### Install

```bash
$ pnpm i
```

### Packages

- @acyort/i18n
- @acyort/markdown

add

```bash
$ pnpm i -D devDependency --filter package-name
$ pnpm i -S dependency --filter package-name

# global
$ pnpm i -wD devDependency
$ pnpm i -ws dependency
```

remove

```bash
$ pnpm un dependency/devDependency

# global
$ pnpm un dependency/devDependency -w
```

### Lint

```bash
$ pnpm run lint
```

### Test

config: `jest.config.js`, `projects`

```bash
$ pnpm run test
```

### Script

```bash
$ cd packages/name && pnpm run script

# or
$ pnpm -C packages/name run script
```
