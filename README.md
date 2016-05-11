# AcyOrt

A Node.js blog tool powered by GitHub.

You can write you blog on `GitHub issue` and publish it on `Your Own Domain` use `GitHub page`

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

Site content from here: https://github.com/AcyOrt/acyort.github.io/issues

## Install

```bash
$ sudo npm install acyort -g
```

## Create new blog

```bash
$ acyort create blog
$ cd blog
```

## Config your blog

modify `config.yml`

## Build your blog

```bash
$ acyort build
```

all generated html files are saved in the `'public_dir'` you define in `config.yml`. You can publish them to wherever you like.

## Local test server

```bash
$ acyort server
```

now access `http://127.0.0.1:2222` to test your blog

## License

MIT