# AcyOrt

A Node.js blog tool powered by GitHub. Write you blog on `GitHub issue`

## Features

- Muti-authors support
- Write the blog on github issue
- Simple themes development(width livereload)
- Quick install and simple config
- Json output support
- Ci auto deploy support

## Demo

http://acyort.am0200.com/

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

### config

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

### test

local test server width LiveReload

```bash
$ npm start
```

### clean

clean the generated files

```bash
$ npm run clean
```

## Todo

- unit test
- plugins support
- the website

## License

MIT

## Relate

![acyort](https://cloud.githubusercontent.com/assets/2193211/23157548/b3ebe872-f856-11e6-9859-d173c7905dcb.jpg)

