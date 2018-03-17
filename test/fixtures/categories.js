module.exports = `
{% extends 'layout.html' %}

{% block title %}
Categories | {{ config.title }}
{% endblock %}

{% block content %}
<div class="center clouds">
  <p class="head-tag">more</p>

  <div>
    {% for category in page %}
    <p>
      <a href="{{ _url(category.url) }}">{{ category.name }}</a>
      <span>({{ category.posts.length }})</span>
    </p>
    {% endfor %}
  </div>
</div>
{% endblock %}
`
