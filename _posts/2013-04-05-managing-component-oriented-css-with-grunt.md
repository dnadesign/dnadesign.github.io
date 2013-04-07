---
layout: post
tags : [grunt, javascript, css]
title: "Managing component oriented CSS with Grunt"
---

There’s so much talk about new CSS libraries, grids, frameworks etc. It’s not helping. In fact it’s sending us down a dead end street. They’re great for prototypes, not for prime time, none of them allow for the inherent flexibility of responsive. I was an absolute convert to using utility styles, ever since seeing a Nicole Sullivan talk I’ve loved the idea of OOCSS. I spent two years working on my own set of utility styles which project by project got better and better, faster and faster. I’ve thrown that work away. It’s doesn’t work for responsive.

While I used to have a .grid_4 class, when I’m using responsive I have no idea whether that item will still be 4 columns wide at a different breakpoint. Or f_left (float:left), will it be floated at a large screen or a small screen? Assuming both isn’t going to work. The only reason this approach may be working for you currently, is that designers have yet to really push how different each breakpoint can be.

So what's the answer. Component CSS. It's still object orientated, just in a different way.

You don't re-use styles. You make CSS that corresponds directly to HTML, they're coupled. While coupled is a dirty word, we don't see any other option.

As above we need css classes that can react across breakpoints. So utility doesn't work.

We end up with something like:
	/*============================================================
		A-Z.

		Alphabetical list of items.
	=========================================================== */
	.a-z-quick-links-holder {
		display: none
	}

	.a-z-list {
		position: relative;
		padding-left: 25%;
	}

	.a-z-list li {
		min-height: 6em;
		padding-bottom: 2.2em;
	}

	.a-z-list ul {
		padding: 0 0 5em;
	}

	.a-z-letter {
		border-top: 1px solid #ffcc00; /*p*/
		display: block;
		font-family: 'Helvetica Condensed Light', 'Helvetica Neue', Arial, sans-serif;
		font-size: 3.5em;
		line-height: 1.1428em;
		margin-top: .1714em;
		margin-left: -25%;
		padding: .3428em 0;
		position: absolute;
		width: 16.6666%;
	}

	.a-z-list li li {
		font-family: 'Helvetica Condensed Regular', 'Helvetica Neue', Arial, sans-serif;
		font-size: 2em;
		line-height: 1.5em;
		min-height: 0;
		padding-bottom: 0;
	}

	.a-z-list li li a {
		color: #333;
	}

Now this gets tricky to manage. Rather than styling pages you're styling components of pages… across breakpoints.

So we managed the complexity of this by creating stylesheets for each component and at breakpoint.

A-like so:
* a-z.base.less
* a-z.small.less
* a-z.medium.less
* a-z.large.less
* a-z.xlarge.less
* etc

This makes development easy and production hard. In the project we were working on (wellington.govt.nz) the browser would end up downloading almost 100 stylesheets.

Step in grunt.

Grunt is a node module(?) which handles tasks. Tasks like concatenation, compiling less, uglify and even watch…

Step 1

We made grunt watch every *.less file in our template folder. And if it changed we:
1. Compiled and minified every *.base.less file into base.css
1. Compiled and minified every *.small.less into small.css
1. etc

We now had stylesheets for each breakpoint, base, small, medium, large and xlarge.

However less doesn't handle media queries so good and we didn't want multiple media queries in each file.

Step 2:

We put all our media queries in separate files and only concatenated them onto the file once the initial compiling and minifying was done.

However we didn't want to serve seven stylesheets, one for each break point.

Step 3

We concatenated the media queries around the compiling CSS together into one production css file.

This means we can use the seven breakpoint css sheets in dev, so we can easily see what's going on and then use the one production css file in production.

It means we can easily debug components like menus without scrolling through the other 500 lines of CSS that has nothing to do with what we're working on.

Our grunt file looks something like this:


