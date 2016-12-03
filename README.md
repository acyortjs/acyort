# AcyOrt

A Node.js blog tool powered by GitHub. Write you blog on `GitHub issue`

## Support feature

- Post 
- Comments
- Archives
- Rss
- Page 
- Category
- Theme
- Tag 
- Menu
- Post Thumbnail

## Demo

http://acyort.github.io/

content from:
 
https://github.com/AcyOrt/acyort.github.io/issues

## Install

```bash
$ sudo npm install acyort -g
```

## Usage

### create

```bash
$ acyort create blog
```

or 

```bash
$ acyort create
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

local server: `http://127.0.0.1:2222`

> width liveReload

set `dev: true` in `config.yml`

## Development

### configure

```bash
$ vim assets/config.yml
```

### build

```bash
$ npm run build
```

### local test server

```bash
$ npm run start
```

### clear generated files

```bash
$ npm run clear
```

## License

MIT
