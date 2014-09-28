---
layout: post
tags : [silverstripe]
title: "Resolving SilverStripe Error 'Hmm - depth calc wrong'"
introduction: "Hint: You're wrong."
author: "wilr"
---

While developing with SilverStripe 3 you may run into an error which looks 
something like:

```
Fatal error: Hmm - depth calc wrong, hit negatives, see: app/code/MyClass.php in ConfigStaticManifest.php on line 240
```

While this error may seem confusing, resolving it usually is as straightforward
as resolving a normal syntax error in the mentioned file.

> Note the error may only show itself when you're doing a database rebuild or a 
> flush operation since it originates from SilverStripe trying to parse every
> class.

To start tracking down the syntax error look at the file mentioned in the error
message. In our error message from above, that file is `app/code/MyClass.php`.

You can then use the PHP CLI binary to syntax check that particular file and 
track down the syntax error in question

```
php -l app/code/MyClass.php

PHP Parse error:  syntax error, unexpected 'return' (T_RETURN), expecting function (T_FUNCTION) in app/code/MyClass.php on line 459

Parse error: syntax error, unexpected 'return' (T_RETURN), expecting function (T_FUNCTION) in app/code/MyClass.php on line 459
```

This is not the most user friendly error message from SilverStripe and likely
a common issue if the number of cursing we've done here is any indication (and
the IRC / Github discussions [1] [2] raised for it).

As [ErrorControlChain](api.silverstripe.org/3.1/class-ErrorControlChain.html) is 
still new this is a temporary issue that will be resolved for the next major 
release.

[1] [https://github.com/silverstripe/silverstripe-framework/pull/2470](https://github.com/silverstripe/silverstripe-framework/pull/2470)

[2] [http://logs.simon.geek.nz/index.php?date=2013-10-18](http://logs.simon.geek.nz/index.php?date=2013-10-18)

