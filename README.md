# AcyOrt

A Node.js blog tool powered by GitHub.

You can write you blog on `GitHub issue` and publish it on `Your Own Domain` use `GitHub page`

### Demo

http://acyort.am0200.com/

Site content from here: https://github.com/LoeiFy/AcyOrt/issues

### Usage

#### # Add Post content

1 . Add Posts

Select one your `Repo` and add content on `issue` 

Example: https://github.com/LoeiFy/AcyOrt/issues

2 . Add Page

Set one issue `title` after `[page name]`

Example: https://github.com/LoeiFy/AcyOrt/issues/3

3 . Add post summary

Just add `<!-- more -->` tag after summary

Example: https://github.com/LoeiFy/AcyOrt/issues/2

4 . Add tags

Just add issue `Labels`

#### # Build Website

0 . Fork and Switch to branch `gh-pages`

1 . Delete files(Optional)

```
./archives
./page
./pages
./posts
./tags
./index.html
./rss.xml
```

2 . Install modules
  
```bash
$ npm i
```

3 . Modify `config.js`

```js
// config
module.exports = {
    url:        'http://acyort.am0200.com',                     // Site Url
    title:      'AcyOrt',                                       // Blog Title
    about:      'A Node.js blog tool powered by GitHub.',       // Blog Info    
    user:       'LoeiFy',                                       // Your GitHub UserName
    repo:       'AcyOrt',                                       // Your GitHub issue Repo    
    rss:        '/rss.xml',                                     // RSS Link
    perpage:    5,                                              // Posts Per Page
    token:      ''+'',                                          // GitHub Access Token(Optional)
    authors:    [],                                             // Post Authors(filter author)
    menu: [                                                     // Menu
        {name: 'home', url: '/'},
        {name: 'about', url: '/page/about/'},
        {name: 'archives', url: '/archives/'}
    ]
}
```

4 . Modify `CNAME`, add your domain

5 . Build website

```bash
$ npm run build
```

6 . `git add` and `git push` to publish your posts

### Feature

#### # Post

  path: `./posts/yyyy/mm/...`

#### # Archives: 

  path: `./archives/`
  
#### # Rss:
 
  path: `./rss.xml`
  
#### # Page: 

  path: `./page/.../`

#### # Tags 

  path: `./tags/.../`

#### # Menu

  define `config.js`

### License

MIT