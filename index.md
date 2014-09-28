---
layout: page
title: Welcome
---

<ul class="posts">
	{% for post in site.posts %}
		<li class="post">
			<article>
				<div class="post-title">
					<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
				</div>

				<div class="post-text">
					<div class="post-intro">
						<p>{{ post.introduction }}</p>
					</div>
				</div>

				<footer class="post-footer">
					<p class="date">{{ post.post_action }} by <a href="http://twitter.com/{{post.author}}/">@{{ post.author }}</a> on {{ post.date | date: "%d.%m.%Y" }}</p>
				</footer>
			</article>
		</li>
	{% endfor %}
</ul>

