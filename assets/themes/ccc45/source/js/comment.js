if (c.name.length > 0) {
    document.getElementById('comment').classList.remove('hide')
}

var duoshuoQuery = {short_name: c.name};

document.getElementById('comment').addEventListener('click', function() {

    this.style.display = 'none';

    var identifier = this.getAttribute('data-id'),
        title = document.title,
        url = location.href.split('?')[0];

    document.getElementById('duoshuo_thread').setAttribute('data-title', title)
    document.getElementById('duoshuo_thread').setAttribute('data-url', url)

    var disqus_config = function () {
        this.page.url = url;
        this.page.identifier = identifier;
    };

    var sc = document.createElement('script'); 
    sc.async = true;
    sc.src = (location.protocol == 'https:' ? 'https:' : 'http:') + c.url;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(sc);

    if (c.url.indexOf('disqus') > -1) {
        document.getElementById('disqus_thread').classList.remove('hide')
    }

    if (c.url.indexOf('duoshuo') > -1) {
        document.getElementById('duoshuo_thread').classList.remove('hide')
    }

}, false)
