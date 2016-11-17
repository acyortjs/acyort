# AcyOrt

A Node.js blog tool powered by GitHub. Write you blog on `GitHub issue`

## Feature

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

### create new blog

```bash
$ acyort create blog
$ cd blog
```

### config your blog

modify `config.yml`

### build your blog

```bash
$ acyort build
```

all generated html files are saved in the `'public_dir'` you define in `config.yml`. 

you can publish them to wherever you like.

### local test

```bash
$ acyort server
```

local server width liveReload: `http://127.0.0.1:2222`

## Development

### config

```bash
$ vim assets/config.yml
```

### local build

```bash
$ npm run build
```

### test server

```bash
$ npm run server
```

### clear build files

```bash
$ npm run clear
```

## License

MIT