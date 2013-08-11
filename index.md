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

<footer class="content-footer">
	<p>You&#39;ve reached the end. Would you like to go back to the <a href="#top">top</a>?</p>
	<p>Haven&#39;t read enough about DNA? Try <a href="http://dna.co.nz">dna.co.nz</a>.</p>
	<p>We&#39;re hiring <a href="http://dna.co.nz/careers/">front end developers</a>. Come work with us.</p>
</footer>