# AcyOrt

A Node.js blog tool powered by GitHub. Write you blog on `GitHub issue`

## Features

- Post 
- Comments
- Archives
- Rss
- Page 
- Category
- Theme
- Tag 
- Menu
- Thumbnail
- TOC
- i18n

## Demo

http://acyortjs.github.io/

content from:
 
https://github.com/acyortjs/acyortjs.github.io/issues

## Install

```bash
$ sudo npm install acyort -g
```

## Usage

### create

```bash
$ acyort init blog
```

or 

```bash
$ acyort init
```

### configure

modify `config.yml`

### build

```bash
$ acyort build
```

### publish

all generated html files are saved in the `'public_dir'` you define in `config.yml`. 

you can publish them to wherever you like.

### local test server

```bash
$ acyort server
```

or

```bash
$ acyort server [port]
```

local server: `http://127.0.0.1:2222`

> width liveReload
          
set `dev: true` in `config.yml`

### clean

clean the generated files

```bash
acyort clean
```

## Development

### build

```bash
$ npm run build
```

### local test server width LiveReload

```bash
$ npm start
```

### clean the generated files

```bash
$ npm run clean
```

## License

MIT

## Relate

![AcyOrt](https://cloud.githubusercontent.com/assets/2193211/23100112/ef8f3da2-f6b2-11e6-8843-108fc87f37f1.jpg)
