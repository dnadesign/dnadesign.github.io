---
layout: page
title: Welcome
---

<ul class="posts">
  {% for post in site.posts %}
    <li>
    	<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
		  {% unless post.tags == empty %}
		    <ul class="tag_box inline">
		      {% assign tags_list = post.tags %}
		  	  {% for tag in tags_list %}
		    	<li><a href="tags.html#{{ tag }}-ref">{{ tag }}</a></li>
		    {% endfor %}
		    </ul>
		  {% endunless %} 
    	<p class="date">{{ post.date | date_to_string }}</p>
    </li>
  {% endfor %}
</ul>

