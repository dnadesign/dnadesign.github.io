---
layout: post
tags : [svg]
title: "Exporting SVG from Illustrator for Developers"
introduction: "Making designers happy."
author: "wilr"
---

One of the biggest changes in my role as a front end developer in the last few years has been the destruction of the 
concept of designing a 960px static site, laying it out pixel by pixel from a Photoshop file. 

Nowadays in a world surrounded by mobile devices things are getting smaller. Though at the same time, we're going the 
other way,  adoption of wide screens is wider spread. Higher resolutions and better monitor are now cheaper and more 
available. Long gone is the traditional normal distribution.

For the majority of our sites, Scalable Vector Graphics *(SVG)* has become the default format for icons and UI interface 
elements. They scale up, down, round. As a developer they are a life saver. A single image can be 32x32 on mobile. 64x64
on a high resolution, 96x96 when the users on a desktop. All from a single image file. I can color it, animate it, tweak
it, anything I want without touching static assets.

Here are some tips I've found in Illustrator to make preparing SVGs easier.

1. **Fit SVG to artboard** Ensure that your exported asset does not have whitespace around the outside. This will cause 
	it to not be positioned correctly. CS5+ has a great feature to make this easy. Under **Object** > **Artboards** select 
	**Fit to Artwork Bounds**. This will output a tight fit and is great to pick up any random artifacts that may have 
	may have made it into your image

1. Don't use **Multiply** as an overlay option. Very common with designers, investigate any shadows and overlays to make sure
they use a simple color and opacity.

1. When it comes to the SVG save dialog, make sure you save the image with **More Options** dialog box open. These 
options are critical to exporting. 

1. Save as **SVG 1.1**. That is the only W3C Specification worth using.

1. Always untick **Preserve Illustrator Capabilities**. This option will output large SVGs which you do not want to use. 
Optionally store an editable version alongside the other export but I've found that even with that option disabled, most
simple UI elements continue to be editable.

1. I never use **Subsetting** (i.e I leave it as none). Unless you want your text un-editable. Leave it as none. Then 
styling of text can be done via CSS.

1. **Don't use style Element option**. Under *CSS Properties* ensure you select **Presentation Attributes** or 
**Style Attributes**. Using the style element option will generate a CSS style element at the root of the SVG file. When 
including multiple SVGs on the page you'll find styles leak between your images. Fixing this by hand is a laborious 
process best avoided.

1. Ensure **Responsive** option is ticked. This allows the image to be scaled on demand. In our case we use CSS `width`,
`height` and `background-size` options to size images correctly.

1. SVG's are not supported by IE8, several Android 2 devices and generally older devices. I still recommend using 
fallbacks at this stage depending on importance of the feature.

Adobe have published a thorough guide to exporting SVG's on its' blog which is well worth the read. <a href="http://www.adobe.com/inspire/2013/09/exporting-svg-illustrator.html">Exporting SVG for the web with Adobe Illustrator CC</a>.
