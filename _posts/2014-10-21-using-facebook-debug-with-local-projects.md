---
layout: post
tags : [development, facebook]
title: "Using facebook debug with local projects"
author: "jeremyolliver"
---

Recently we've been working on a project that includes facebook integration. Facebook have handily provided a debugging tool to aid in this at https://developers.facebook.com/tools/debug/ though it can slow down debugging if you have to deploy to a public staging server before testing your changes, instead of the usual web development process with live reload on a local developer workstation. Here's how to make that work with your local instance of a project.

Our developer machines at DNA are setup via [our own sprout-wrap recipes](https://github.com/dnadesign/sprout-wrap), which is a collection of chef cookbooks that installs and configures the needed software on each machine. This setup provides for us, among other things: dnamasq mapping `*.dev` to localhost, and apache configured to serve projects from `~/Sites/my_project` from `http://my_project.dev` on the local workstation.

Since workstations don't have an exposed IP address there's two main ways to make a service externally accessible: either by changing your firewall/router to port forward a specific port to your local IP address - though there are a variety of reasons that can make this difficult. Either inability to change those settings at a large organisation, firewall restrictions on non-standard ports or having a dynamic local IP address through DHCP and more. The easier to set up option that we went with, is to use an externally available service and a local proxy such as `proxylocal`.

Proxylocal consists of a publicly available, free service on proxylocal.com, and a [ruby gem](http://rubygems.org/gems/proxylocal) which sets up a unique subdomain on the service, and maps traffic to a local port on your machine. So running `gem install proxylocal` and then `proxylocal 3000` will create a subdomain e.g. `http://0h7d.t.proxylocal.com/` which maps to your local machine!

The final step in the puzzle, was since our local apache instance uses hostnames to detect which site to load, all listening on the same port - we had to add an extra config to get the site we want to debug listening on it's own port. For us, the apache config needed to add for that is:

    Listen 3000
    <VirtualHost *:3000>
        ServerName dev
        ServerAlias my_project.dev
        VirtualDocumentRoot "/Users/jeremy.olliver/Sites/my_project"

        php_admin_value auto_prepend_file /Users/jeremy.olliver/Sites/tools/php.prepend.php
        php_admin_value auto_append_file /Users/jeremy.olliver/Sites/tools/php.append.php
    </Virtualhost>

Which is essentially the same VirtualHost config as we usually run, modified to listen on port 3000, and hardcoded to the project's directory. So after that, restart apache, and enter the URL specified by proxylocal (e.g. `http://0h7d.t.proxylocal.com/`) into Facebook's debug tool, and away you go.

Happy Hacking
