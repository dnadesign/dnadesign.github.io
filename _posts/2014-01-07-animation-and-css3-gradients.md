---
layout: post
tags : [css]
title: "Animation and CSS3 gradients"
author: "wilr"
---

In a recent project for [TrustPower](http://www.trustpower.co.nz/) we had a play at ways to both incorporate each of the 
clients' brand colours into the primary application header.

One experiment that ended up working quite well is slowly animating between several CSS3 gradients layers made up of 
their brand colors, giving a feel of a motion like flow. For an example, see below or on the 
[TrustPower](http://www.trustpower.co.nz/) website.

<div class="demo_container">
	<div class="gradient gradient_1" aria-role="presentation"><!--  --></div>
	<div class="gradient gradient_2" aria-role="presentation"><!--  --></div>
	<div class="gradient gradient_3" aria-role="presentation"><!--  --></div>
	<div class="gradient gradient_4" aria-role="presentation"><!--  --></div>
	<div class="gradient gradient_5" aria-role="presentation"><!--  --></div>
	<div class="gradient gradient_6" aria-role="presentation"><!--  --></div>
	<div class="gradient gradient_7" aria-role="presentation"><!--  --></div>
</div>

This effect has been created using several of the new features in CSS3 &#8212; 
[Keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes), 
[Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)
and [Animation](https://developer.mozilla.org/en-US/docs/Web/CSS/animation) and runs without the use of javascript.

Apart earlier versions of IE, browser support is adequate with all current release browsers 
([1](http://caniuse.com/#feat=css-gradients)) and an easy fall back of the solid color. Our only other concern was CPU 
usage for the animations but in our testing across desktop and mobile devices it appears to not take too much of a toll 
probably due to being GPU hardware accelerated.

## How'd we do it

The basic premise of the effect is all the gradients are stacked up on top of each other in the DOM and the CSS code
uses varying levels of opacity specified inside key frames to 'fade' the gradients between each other. The smooth 
animation is completed by a transition of the opacity of each layer.

Our final implementation was written in [LESS](http://www.lesscss.org/) and we use [Elements](http://lesselements.com/) 
to consolidate cross-browser prefixes into single, concise declarations which looks something like below. 

{% gist 8817090 %}

Markup wise, we include each of the gradients as a DOM node. These nodes are going to be controlled through opacity
and specific timed keyframe values to fade the opacity of each layer. As layers at the top of the stack decrease 
opacity, the colors from gradients below for a phase, and so on through a smooth motion animation cycle of 50 seconds. 
At any one point in the 50 second animate only two of the layers in the DOM will have an opacity that is greater than 
zero.

## Finishing up

Using the HTML5 Boilerplate, the HTML element has a helper class `.lte9` for IE9 and below browsers. Looking for that 
class we can disable all gradients apart from the first one using a simple selector to fall back to a static image.

The other helper the css provides is the `no-animation` class. When modifying the header DOM elements we could the 
animation could be jerky. By applying the `no-animation` class to the container we can pause the animation on demand by 
adding the class to the parent. This uses 
[animation-play-state](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-play-state) to pause the running 
animation smoothly.