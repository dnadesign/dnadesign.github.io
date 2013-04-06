---
layout: page
title: Welcome
---

<div class="wrapper">
<ul class="posts">
  {% for post in site.posts %}
    <li>
    	<div class="post post-{{ post.class }}">
	    	<div class="post-intro">
	    		<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
			</div>
	    	<div class="meta">
	    		<p class="date">{{ post.date | date_to_string }}</p>
	    		<p class="author">{{ post.author }}</p>
	    	</div>
	    </div>
    </li>
  {% endfor %}
</ul>
</div>