<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="google" content="notranslate" />

<link rel="icon" href="{{ data.config.root }}/images/icon.png" />
<link rel="stylesheet" href="{{ data.config.root }}/css/style.css" />
<title> {{ page.title }} | {{ data.config.title }} </title>

</head>
<body>

<div class="header">
    <div class="center">
        <h1><a href="{{ data.config.root }}/">{{ data.config.title }}</a></h1>
        <p>{{ data.config.subtitle }}</p>
    </div>
    <div class="menu">

    {% for menu in data.config.menu %}
        <a href="{{ menu.url }}">{{ menu.name }}</a>
    {% endfor %}

    </div>
</div>

<div id="post" class="center">

    <h1>{{ page.title }}</h1>

    <div class="content">{% autoescape false %}{{ page.body }}{% endautoescape %}</div>

</div>

<div class="footer">
    <div class="center">
    &copy; {{ helper.time(Date.now(), 'YYYY') }} {{ data.config.title }} . <a target="_blank" href="https://github.com/AcyOrt/acyort">AcyOrt</a> . <a target="_blank" href="{{ data.config.rss }}">RSS</a>
    </div>
</div>

</body>
</html>
