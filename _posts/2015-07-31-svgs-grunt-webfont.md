---
layout: post
tags : [svg, webfonts]
title: "Using SVG webfonts for icons"
introduction: "Making icons easy to create, resize and animate"
author: "pitchandtone"
---
Icons have always been a pain to deal with, in the past we've dealt with jpgs, gif, pngs. 
Then we moved onto sprites which were great from a performance perspective, but very hard to manage, 
keep up to date and position. Then responsive came along and made it even harder to manage...

The new techonlogy tha has really helped in terms of performance and scalability is SVGs. 
Will written previsouly about how to get SVGs working for your site, so have a read of that. 

The real power from SVGs, as I see it, is then to turn them into a webfont. This has a big advantage for a couple of reasons.
Firstly, it's a single download of all the icons. Secondly, while we retain the scalability of the icons, we now also have the 
ability to change the colour of the icon using just CSS. This means we can change the colour on hover or page application 
very easily, without having to serve multiple images or add another colour variation to our sprite or svg files.

In order to do this we've been using https://github.com/sapegin/grunt-webfont, which works well with our grunt workflow.
Eseentially you create a folder of svg icons, point the script at the folder and it will generate the font and the CSS needed 
in order to use each icons (character) that you have created.

The difficulty comes when the font rendering process doesn't give you quite what you expected, so I thought I'd offer some tips
on how to get consistently what you want.

## Generate a test HTML
The module above automatically builds a test HTML page, which initially I didn't think was useful. However, it's great to 
browser test against to make sure that icons are being rendered correctly. I've found that Firefox and IE are more forgiving 
than Chrome or Safari so make sure you test them. Some issues might be that the icons doesn't turn up, or turns up in a 
very weird alignment.

## Make the SVG as simple as possble
I don't mean the design of it, I mean the structure. Go into Illustrator, have a look at the layers and remove any groups, 
clipping masks etc, until you just have paths, shapes and lines.

## Copy to a new file
If the webfont still isn't browser testing well, I've found that copying the paths, lines etc to a new file and then fitting
the artboard to the SVG means that there's as little cruft as possible and the webfont is more likely to be generated and
give you a predictable result.

I've found that these couple of steps has really helped me get a good consistent result.

The above process will only work with single colour svgs, not multiple colours. So keep those files elsewhere.
