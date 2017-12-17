module.exports = `
<!doctype html>
<html>
<head>
{% include 'partials/head.html' %}
<title>{% block title %}{% endblock %}</title>
</head>

<body>

{% include 'partials/header.html' %}

{% block content %}{% endblock %}

{% include 'partials/fooetr.html' %}

{% block script %}{% endblock %}

<h1 id="special">special</h1>
</body>
</html>
`
