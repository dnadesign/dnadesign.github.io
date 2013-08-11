---
layout: post
tags : [grunt, javascript, css, responsive]
title: "Managing component oriented CSS with Grunt"
author: "John Milmine"
---

Now that responsive is on the scene, how do you manage a large amount of css across breakpoints?

We were working on wellington.govt.nz and initially we set out with a stylesheet per breakpoint. This approach worked fine for the first few sprints. However once the main developer left and the CSS file was beginning to get larger, it quickly became evident this approach was not serving us.

So utility styles don't work. Code reuse becomes a pain. They might look the same at this breakpoint but what about the next? We could create breakpoint utility classes: small-grid1, medium-grid1. That gets ridiculous fast. We want to be able to quickly find and change a component across breakpoints, without needing to check if we've screwed up anything else in the project or testing would become diabolical.

So what's the answer? Component CSS. It's still object orientated, just in a different way. We need css classes that can react across breakpoints.

Component CSS means you don't re-use styles. You make CSS that corresponds directly to HTML. They're coupled. While coupled is a dirty word, we don't see any other option.

A component at one breakpoint might look like:

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

When you start debugging a component or tweaking a component between breakpoints, you end up opening multiple files (we had one for each breakpoint) and scrolling around trying to find the place in that file which dealt with the component we were working on. Not only did we need CSS classes that were independent, we needed a file structure that imitated this.

So we created stylesheets for each component, at each breakpoint.

* a-z/a-z.base.less
* a-z/a-z.small.less
* a-z/a-z.medium.less
* a-z/a-z.large.less
* a-z/a-z.xlarge.less
* banner/banner.base.less
* banner/banner.small.less
* banner/banner.medium.less
* banner/banner.large.less
* banner/banner.xlarge.less
* etc

This approach meant we could easily work on a component between breakpoints. We were still opening multiple files, but the files were substantially shorter, most under 100 lines. It became easy to compare and see what was changing between breakpoints. 

For ease of use the example above shows a file for every breakpoint, whereas we didn't create files for breakpoints with no changes.

Having separate stylesheets for each component at each breakpoint is not ideal in production. On the project we were working on the browser could end up downloading almost 100 stylesheets.

## Step in grunt.

[Grunt](http://gruntjs.com) is a node module(?) which handles tasks. Tasks like concatenation, compiling less or sass, minify, uglify and even watch…

### Step 1

The watch command in grunt is very useful. You tell grunt which files to watch, and what to do when they change.

We made grunt watch every \*.less file in our template folder. If any of the files changed, Grunt would:
1. Compile and minify every \*.base.less file into base.css
1. Compile and minify every \*.small.less into small.css
1. etc

We now had stylesheets for each breakpoint, base, small, medium, large and xlarge.

In the grunt config file this looked something like:

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
* build/base.min.css
* build/base.retina.min.css
* build/small.min.css
* build/small.retina.min.css
* etc

However there were 3 problems.
* We didn't want to have to update multiple places if a breakpoint changed
* We didn't want multiple media queries in each compiled file
* Less doesn't handle media queries so well

### Step 2:

We put all our media queries in separate files and only concatenated them onto the compiled file once the initial compiling and minifying was done.

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
* dist/base.min.css
* dist/base.retina.min.css
* dist/small.min.css
* dist/small.retina.min.css
* etc

This time with one media query at the top, rather than sprinkled throughout.

Now we have:
* A 'build' folder, with the compiled CSS into a file for each breakpoint, *without* media queries. 
* A 'dist' folder, with the compiled CSS into a file for each breakpoint, *with* media queries. 

However in production we didn't want to serve the browser multiple stylesheets. 

### Step 3

We concatenated the CSS files in the 'dist' folder together into one production css file.

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

This approach doesn't have to with less, standard CSS or Sass would work just as well.

Now we can work on a single component and as soon as the file is saved, the less is compiled, the breakpoint CSS file is updated and single production CSS is updated.

Our final grunt file looks something like:

	module.exports = function(grunt) {
		grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			meta: {
				banner: '/*! DNA Designed Communications Limited | Copyright 2012 */'
			},
			less: {
				development: {
					options: {
						paths: ['less'],
						compress: true
					},
					files: {
						'css/build/base.min.css': [
							'less/reset.less',
							'less/base.less',
							'less/utility.less',
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
						'css/build/medium.min.css': [
							'less/components/**/*.medium.less'
						],
						'css/build/medium.retina.min.css': [
							'less/components/**/*.medium.retina.less'
						],
						'css/build/large.min.css': [
							'less/components/**/*.large.less'
						],
						'css/build/large.retina.min.css': [
							'less/components/**/*.large.retina.less'
						],
						'css/build/xlarge.min.css': [
							'less/components/**/*.xlarge.less'
						],
						'css/build/xlarge.retina.min.css': [
							'less/components/**/*.xlarge.retina.less'
						],
						'css/build/xxlarge.min.css': [
							'less/components/**/*.xxlarge.less'
						],
						'css/build/xxlarge.retina.min.css': [
							'less/components/**/*.xxlarge.retina.less'
						],
						'css/dist/print.css': [
							'less/print.less'
						],
						'prototypes/css/style.css': [
							'prototypes/less/*.less'
						]
					}
				},
			},
			concat: {
				base: {
					src: [
						'<banner>',
						'css/helpers/fonts.css',
						'css/build/base.min.css'
					],
					dest: 'css/dist/base.min.css'
				},
				base_retina: {
					src: [
						'<banner>',
						'css/helpers/queries.base.retina.css',
						'css/build/base.retina.min.css',
						'css/helpers/queries.close.css'
					],
					dest: 'css/dist/base.retina.min.css'
				},
				small: {
					src: [
						'<banner>',
						'css/helpers/queries.small.css',
						'css/build/small.min.css',
						'css/helpers/queries.close.css'
					],
					dest: 'css/dist/small.min.css',
					seperator: '\n'
				},
				small_retina: {
					src: [
						'<banner>',
						'css/helpers/queries.small.retina.css',
						'css/build/small.retina.min.css',
						'css/helpers/queries.close.css'
					],
					dest: 'css/dist/small.retina.min.css'
				},
				medium: {
					src: [
						'<banner>',
						'css/helpers/queries.medium.css',
						'css/build/medium.min.css',
						'css/helpers/queries.close.css'
					],
					dest: 'css/dist/medium.min.css',
					seperator: '\n'
				},
				medium_retina: {
					src: [
						'<banner>',
						'css/helpers/queries.medium.retina.css',
						'css/build/medium.retina.min.css',
						'css/helpers/queries.close.css'
					],
					dest: 'css/dist/medium.retina.min.css'
				},
				large: {
					src: [
						'<banner>',
						'css/helpers/queries.large.css',
						'css/build/large.min.css',
						'css/helpers/queries.close.css'
					],
					dest: 'css/dist/large.min.css',
					seperator: '\n'
				},
				large_retina: {
					src: [
						'<banner>',
						'css/helpers/queries.large.retina.css',
						'css/build/large.retina.min.css',
						'css/helpers/queries.close.css'
					],
					dest: 'css/dist/large.retina.min.css'
				},
				xlarge: {
					src: [
						'<banner>',
						'css/helpers/queries.xlarge.css',
						'css/build/xlarge.min.css',
						'css/helpers/queries.close.css'
					],
					dest: 'css/dist/xlarge.min.css',
					seperator: '\n'
				},
				xlarge_retina: {
					src: [
						'<banner>',
						'css/helpers/queries.xlarge.retina.css',
						'css/build/xlarge.retina.min.css',
						'css/helpers/queries.close.css'
					],
					dest: 'css/dist/xlarge.retina.min.css'
				},
				xxlarge: {
					src: [
						'<banner>',
						'css/helpers/queries.xxlarge.css',
						'css/build/xxlarge.min.css',
						'css/helpers/queries.close.css'
					],
					dest: 'css/dist/xxlarge.min.css',
					seperator: '\n'
				},
				xxlarge_retina: {
					src: [
						'<banner>',
						'css/helpers/queries.xxlarge.retina.css',
						'css/build/xxlarge.retina.min.css',
						'css/helpers/queries.close.css'
					],
					dest: 'css/dist/xxlarge.retina.min.css'
				},
				production: {
					src: [
						'<banner>',
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
				}
			},
			watch: {
				files: ['less/*.less', 'less/components/**/*.less', 'css/helpers/*.css'],
				tasks: ['less', 'concat']
			}
		});	

		grunt.loadNpmTasks('grunt-css');
		grunt.loadNpmTasks('grunt-contrib-less');
		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-contrib-watch');

		grunt.registerTask('default', ['less', 'concat', 'watch']);
	};

Any questions?