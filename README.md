# AcyOrt

A Node.js blog tool powered by GitHub

### Usage

#### first

- fork and add new branch `gh-pages`
- modify `config.js`

```js
// Define
var config = {
    // Blog Name
    title:      '',

    // Blog Info    
    about:      '',                  

    // GitHub UserName
    user:       '',

    // GitHub Repo    
    repo:       '',           

    // Per Page Posts
    perpage:    10,                  

    // GitHub Access Token
    token:      ''+'',              

    // Post Authors
    authors:    []                 
}
```

- modify `CNAME`
- get your `access_token` here: https://github.com/settings/tokens
- make sure the `access_token` only `public_repo` access
- the `access_token` should be split like `'aae23aearta'+'asashda6as7dsa7d'`
- `access_token` may not be required, you can leave it empty

#### next

```bash
$ npm run build
```

then `git push` your files

### License

MIT