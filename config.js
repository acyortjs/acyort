
// config

module.exports = {

    url:        'http://acyort.am0200.com',                     // Site Url
    title:      'AcyOrt',                                       // Blog Title
    about:      'A Node.js blog tool powered by GitHub.',       // Blog Info    
    user:       'LoeiFy',                                       // Blog content repo userName
    repo:       'AcyOrt',                                       // Blog content repo name    
    rss:        'rss.xml',                                      // RSS Link
    perpage:    7,                                              // Posts Per Page
    token:      ''+'',                                          // GitHub Access Token(Optional)
    authors:    [],                                             // Post Authors
    duoshuo:    '',                                             // Duoshuo shortname
    disqus:     '',                                             // Disqus shortname
    siterepo:   '',                                             // Blog publish repo
    menu: [                                                     // Menu
        {name: 'home', url: '/'},
        {name: 'about', url: '/about/'},
        {name: 'archives', url: '/archives/'}
    ]

}
