---
layout: post
tags : [grunt, javascript, css, responsive]
title: "Managing component oriented CSS with Grunt"
---

There’s so much talk about new CSS libraries, grids, frameworks etc. It’s not helping. In fact it’s sending us down a dead end street. They’re great for prototypes, not for prime time, none of them allow for the inherent flexibility of responsive. 

I was an absolute convert to using utility styles, ever since seeing a Nicole Sullivan talk I’ve loved the idea of OOCSS. I spent two years working on my own set of utility styles which project by project got better and better, faster and faster. I’ve thrown that work away. 

It doesn’t work for responsive.

While I used to have a .grid_4 class, when I’m using responsive I have no idea whether that item will still be 4 columns wide at a different breakpoint. Or f_left (float:left), will it be floated at a large screen or a small screen? Assuming both isn’t going to work. The only reason this approach may be working for you currently, is that designers have yet to really push how different each breakpoint can be.

So utility doesn't work. Code reuse becomes a pain. They might look the same at this breakpoint but what about the next? We could create breakpoint utility classes: small-grid1, medium-grid1. That gets ridiculous fast. We want to be able to quickly tweak a component across breakpoints, without needing to check if we've screwed up anything else in the project or testing would become diabolical.

So what's the answer? Component CSS. It's still object orientated, just in a different way. We need css classes that can react across breakpoints. 

You don't re-use styles. You make CSS that corresponds directly to HTML. They're coupled. While coupled is a dirty word, we don't see any other option.

A component at one breakpoint ended up looking something like:

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

As you can see we end up with some component prefixed class names to make sure we don't clobber any other CSS.

We ended up with 26 components, each using code in multiple breakpoints.

Now this gets tricky to manage. Rather than styling pages you're styling components of pages… across breakpoints.

When you start debugging a component or tweaking a component within between breakpoints you're opening multiple files (we had one for each breakpoint) and scrolling around trying to find the place in that file which dealt with the component we were working on.

So we managed the complexity of this by creating stylesheets for each component and at breakpoint.

A-like so:
* a-z.base.less
* a-z.small.less
* a-z.medium.less
* a-z.large.less
* a-z.xlarge.less
* banner.base.less
* banner.small.less
* banner.medium.less
* banner.large.less
* banner.xlarge.less
* etc

This approach meant we could easily work on a component between breakpoints. We were still opening multiple files, however the files were substantially shorter, most under 100 lines. All of the css is in one place. The next file up is only going to have the changes to this file. The files become easy to compare to see what is being changed between breakpoints. 

For easy of use the example above shows a file for every breakpoint, whereas we didn't create files for breakpoints with no changes.

Having separate stylesheets for each component at each breakpoint is not ideal in production. In the project we were working on (wellington.govt.nz) the browser could end up downloading almost 100 stylesheets.

## Step in grunt.

Grunt is a node module(?) which handles tasks. Tasks like concatenation, compiling less, uglify and even watch…

### Step 1

We made grunt watch every \*.less file in our template folder. If any of the files changed, Grunt would:
1. Compiled and minify every \*.base.less file into base.css
1. Compiled and minify every \*.small.less into small.css
1. etc

We now had stylesheets for each breakpoint, base, small, medium, large and xlarge.

In the grunt config file this looks something like:

	less: {
		development: {
			options: {
				paths: ['less'],
				compress: true
			},
			files: {
				'css/build/base.min.css': [
					'less/components/**/*.base.less'
				],
				'css/build/base.retina.min.css': [
					'less/components/**/*.base.retina.less'
				],
				'css/build/small.min.css': [
					'less/components/**/*.small.less'
				],
				'css/build/small.retina.min.css': [
					'less/components/**/*.small.retina.less'
				],
				etc, etc
			}
		},
	},
	watch: {
		files: ['less/*.less'],
		tasks: ['less']
	}

This process creates:
* base.min.css
* small.min.css
* etc

However we didn't want multiple media queries in each file and less doesn't handle media queries so well.

### Step 2:

We put all our media queries in separate files and only concatenated them onto the file once the initial compiling and minifying was done.

In the grunt config file this looked something like:

	concat: {
		base: {
			src: [
				'css/build/base.min.css'
			],
			dest: 'css/dist/base.min.css'
		},
		base_retina: {
			src: [
				'css/helpers/queries.base.retina.css',
				'css/build/base.retina.min.css',
				'css/helpers/queries.close.css'
			],
			dest: 'css/dist/base.retina.min.css'
		},
		small: {
			src: [
				'css/helpers/queries.small.css',
				'css/build/small.min.css',
				'css/helpers/queries.close.css'
			],
			dest: 'css/dist/small.min.css',
			seperator: '\n'
		},
		small_retina: {
			src: [
				'css/helpers/queries.small.retina.css',
				'css/build/small.retina.min.css',
				'css/helpers/queries.close.css'
			],
			dest: 'css/dist/small.retina.min.css'
		},
	etc
	watch: {
		files: ['less/*.less'],
		tasks: ['less', 'concat']
	}

This process creates:
* base.min.css
* small.min.css
* etc

This time with one media query at the top, rather than sprinkled throughout.

However we didn't want to serve multiple stylesheets, one for each break point.

### Step 3

We concatenated the media queries around the compiling CSS together into one production css file.

We add this to our grunt file inside the concat task:

	production: {
		src: [
			'css/dist/base.min.css',
			'css/dist/base.retina.min.css',
			'css/dist/small.min.css',
			'css/dist/small.retina.min.css',
			'css/dist/medium.min.css',
			'css/dist/medium.retina.min.css',
			'css/dist/large.min.css',
			'css/dist/large.retina.min.css',
			'css/dist/xlarge.min.css',
			'css/dist/xlarge.retina.min.css',
			'css/dist/xxlarge.min.css',
			'css/dist/xxlarge.retina.min.css',
			'css/dist/print.css'
		],
		dest: 'css/dist/production.min.css',
		seperator: '\n'
	},

This means we can use the breakpoint css sheets in development, so we can easily see what's going on. We can then use one production css file in production.

It means we can easily debug components like menus without scrolling through the other 500 lines of CSS that has nothing to do with what we're working on.

