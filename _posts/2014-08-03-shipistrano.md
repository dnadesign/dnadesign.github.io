---
layout: post
tags : [deployment]
title: "Deployments and Shipistrano"
introduction: "Introducting Shipistrano, our collection of Capistrano helpers to make publishing projects as simple as lego."
author: "wilr"
---

Having a robust deployment system for a web application is the difference between sparking eternal fear or righteous joy
in your project team when it comes to deploy Tuesdays. In a time not so long ago (and still for quite a few people) we 
used to deploy sites manually, by hand over File Transfer Protocol (FTP). Maintenance pages would get added to the 
server, we'd watch files sync slowly over our internet connection then quickly QA and test the site before removing
the maintenance page and handing it over to the client till next week.

So much has changed since then (and so much hasn't), but luckily we know and have better ways of doing some of these 
things. One, is we now script our basic FTP deployments using [Beam](https://github.com/heyday/beam). An awesome little 
command line tool for deploying websites to servers. 

This is a step up over the manual process by automating our deployment tasks and forcing our deployment steps to be 
defined in configuration files and therefore applied automatically - less you run the risk of your intern not reading 
your detailed `README` notes.

Tools like Beam, Git-FTP and the whole host of hosting solutions are great, and if you're still doing FTP deployments
definitely invest in a scripted solution. But by a certain point those tools become less effective. In our case, for our 
bigger clients deploying a site can involve much more ceremony. In these cases we use 
[Capistrano](http://capistranorb.com/) a widely used remote server automation and deployment tool written in 
Ruby. Not only is it more fully featured (built in rollback, history, asset management) than Git based deployment 
systems but it gives us a better framework for writing deploy work flows and on the plus site it's used by
several other platforms we use such as the [Common Web Platform](https://www.cwp.govt.nz/).

We've deployed Capistrano for dozens of our clients but we've found each site is never exactly the same. Different 
platforms, different services, different folder layouts all make for one slightly queezy Devop team.

To strive to make our Capistrano setups consistent (or at least somewhat unified) between projects we've been working on 
[Shipistrano](https://github.com/dnadesign/shipistrano). A shared collection of Capistrano helpers for shipping code 
with the idea of making reusable helpers that we can plug in and configure depending on the particular application. 

For instance, if we're deploying a Wordpress site we'd include `wordpress` helper and that'll add to Capistrano all the 
configuration we need for managing any instance that has Wordpress. If we ever needed to run a task on our Wordpress 
sites we could update Shipstrano once and roll out the new version to any project with that helper.  All configuration 
for the particular site is kept in the top level `Capfile` while all the recipes and helpers are in the shared 
Shipstrano repository.

Going back to the Wordpress example, the project developer would add Shipstrano..

	cd ~/Sites/project
	git submodule add git@github.com:dnadesign/shipistrano.git cap
	git submodule sync
	git submodule init

Then create a Capfile in the root of the project loading the helpers they want along with declaring the normal 
Capistrano configuration (note we still use v2, upgrading to v3 would make this much nicer).

	
	require 'rubygems'
	require 'railsless-deploy'

	set :app,               "somewebsite.co.nz"
	set :repository,        'git@git.dna.co.nz:somewebsite.git'
	set :user,              ''
	set :group,             ''
	set :ip,                '123.456.789.000'
	set :deploy_to,         "/srv/somewebsite.co.nz"
	set :scm,               'git'
	set :scm_username,      'git'

	role :web,  "#{ip}"

	load 'cap/lib/shipistrano'

	# Specific stuff for Wordpress
	load 'cap/lib/wordpress'

The flexibility of the helper approach is great and you can do some useful things all within the cap file simply by
loading and executing functions from the helpers as you need. Capistrano handles the core work such as backups, rsyncing
the code, managing dependencies like Composer, NPM modules and Ruby gems, then we've got our own helpers for managing 
assets, database engines, htaccess rules and managing framework specific information (like rebuilding databases, 
clearing caches), anything we feel we should automate.

The capfile provides a documented and standard way of interacting with our servers. Take example our `mysql` helper. 
This adds common support for syncing your local development and remote environments. By loading the helper

	load 'cap/lib/mysql'

You'll get a bunch of functions like `mysql:upload` and `mysql:download` for syncing your databases without worrying 
about how or where. The configuration information is stored in your Capfile, so adding helpers can be reused between 
sites.

Developers can see a list of all the tasks setup for a project by running `cap -vT` which lists the task and a 
description.

On top of that you can use Capistrano namespaces directly into add in multiple environments (say a client preview) or 
add our production workflow helper for having a `production` release on top of your staging site. An example capfile for
that might look like.

	require 'rubygems'
	
	def setup()
		set :repository,        'git@git.dna.co.nz:somewebsite.git'
		set :mysql_database,    'somewebsite'
		set :mysql_user,        'somewebsite'
		set :mysql_ask_for_pass, true
		set :user,              'somewebsite'
		set :group,             'psaserv'

		load 'cap/lib/shipistrano'
		load 'cap/lib/shipistrano/helpers/production'
		load 'cap/lib/shipistrano/helpers/mysql'

		role :web,  "#{ip}"
		role :app,  "#{ip}"
		role :db,   "#{ip}", :primary => true
	end

	task :production do
		set :app,               "somewebsite.co.nz"
		set :ip,                '123.45.67.890'
		set :deploy_to, 		"/var/www/vhosts/#{app}/httpdocs/"

		setup()
	end

	task :staging do
		set :app,               "staging.somewebsite.co.nz"
		set :ip,                '123.45.67.891'
		set :deploy_to, 		"/var/www/vhosts/#{app}/httpdocs/"

		setup()

		load 'cap/lib/shipistrano/helpers/htaccess'

		set :auth_user,			'secure'
		set :auth_pass,			'protected'
		set :auth_folder,		"#{deploy_to}/current"

		after('deploy:update', 'htaccess:auth:protect')
	end

Now we have two tasks production and staging with different configuration. You'll also note the staging site has a 
extra helper for adding HTTP Basic Auth preventing unknown outsiders from accessing the site. Because we've now got 
namespaces setup our cap commands can target specific instances.

	cap production mysql:upload // upload to production database
	cap staging deploy // deploy to staging

As with everything, Shipistrano is a work in progress and opinionated to how we do things. We'll roll it out on more
projects and hope to have a robust set of helpers that we can rely on being best practice, tested and useful for our 
development team so less time spend worrying over the risks of deployment and more time building.

