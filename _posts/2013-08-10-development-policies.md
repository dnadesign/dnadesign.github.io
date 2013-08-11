---
layout: post
tags : [css, responsive,]
title: "How to do it the DNA way"
author: "John Milmine"
---
At DNA we're well known for producing well crafted and tailored design solutions and our development team has always done the same with the code they've produced. However as HTML and CSS is notoriously subjective, settling on a specific way of doing things has been hard. We have worked on an approach to CSS before (OOCSS) however that effort was largely undermined by responsive. 

In the last two years the projects we've been working on have been getting larger and larger and mostly responsive, which has put pressure on being able to quickly scale a team and produce consistent results. 

The other part of this challenge is contractors, with any agency works flexes and shrinks so contractors are a fact of life. However we do not want to introduce inconsistencies in how DNA produces work. We also want to be able to quickly communicate to contractors what and how we want things done in order to reduce code review and rework time and also improve efficiencies of working on larger front-end team.

Now we've turned to a combination of BEM and atomic design. We believe this will enable developers to work together easily and produce consistent, professional, maintainable results for clients.

### Setup folder structure

* build

	* components

		* component_1 

			* css

					* component_1.xsmall.less
					* component_1.small.less
					* etc
			* js

					* vendor
					* component_1.js
		* component_2

			* css

					* component_2.xsmall.less
					* component_2.small.less 
					* etc
			* js

					* vendor
					* component_2.js
	* elements
			
		* element_1

			* element_1.xsmall.less
			* element_1.small.less
			* etc
		* element_2

			* element_2.xsmall.less
			* element_2.small.less
			* etc

	* global

		* css

			* helpers
			* vendor
		* js

			* vendor
			
* css

	* build
	* dist
* js

	* dist

### Step 2

Work through art circling components. Components can exist within components. For example header and nav_main may be separate components even though nav_main only occurs in header. 

The goal of components is easily identifiable and manageable code. Management of a component is directly correlated to number of lines per breakpoint, e.g 1000 lines is too much, 500 is pushing it.

### Step 3

Build components. Rules as follows.

1) Each component name must be unique and descriptive.

2) New folder for each component

3) New file for each breakpoint and resolution

* component_1.xsmall.less
* component_1.xsmall.retina.less
* component_1.small.less
* component_1.small.retina.less
* etc

4) Pages or page types are not components. 

Do not put classes on the body element or similar in order to style a page. This approach should only be used in rare circumstances.

5) Class names should contain only underscores, no hyphens or camelCase.

Just convention, however underscores also makes the class easier to select, as one click selects the whole class, rather than a word at a time.

6) Each class within a component must start with the component name and an underscore.

For example .sidebar .sidebar_title NOT .sidebar .title

Although the latter seems better as it's simpler, and you can namespace your css to encapsulate bleed, it still bleeds.

If two components have .title, and one of them is nested in another then the outer component's styling for .title will bleed into the inner component's .title.

Therefore all classnames inside a component must be prefixed by the component's name, e.g. .sidebar_title NOT .title 

7) Use multiple classes not single class patterns

	<a class="btn btn__secondary"></a>
is better than

	<a class="btn_secondary"></a>

While in the latter the HTML is simpler, it reduces flexibility. We want lots of modifiers in a component to create a range of scenarios. The original example assumes there's only one type of modifier. Once this is not the case the single class pattern breaks.

	<a class="btn btn__secondary btn__large"></a> 
is better than

	<a href="btn_secondary_large"></a>

8) Component or component part modifiers should be highlighted by double underscores. Whereas component parts should be denoted with single underscores.

	<a class="btn btn__secondary btn__large">
		<span class="btn_arrow">&nbsp;</span>
	</a>

9) Don't style other components within another component.

When a component is nested inside another it's tempting to style that component based on context, e.g. .products .btn

This makes code very hard to comprehend, as one component is dependant on another component folder to style it correctly.

In this situation create a new modifier for the component in the original component folder.

For example .btn.btn__products

10) Browser hacks should be class based rather than hack based and should be with original code.

Separate browser stylesheets make code hard to debug as developers need to piece together what is happening. Therefore the following example is what should happen.

	h2 {
		color: blue
	}
	.ie7 h2 {
		color: red
	}

The downside to this approach hits home with responsive. As .ie7 h2 can't be overridden in the next stylesheet without using the same specificity.

	h2,
	.ie7 h2 {
		color: green
	}

The work-around for this will be adding a class on the HTML element called "all". This means the following will override the initial styles.

	.all h2 {
		color: green;
	}

11) Use Mixins sparingly. 

Mixins add overall bloat, consider carefully when you use them. In most cases it's better to just create a component.

12) Use nesting sparingly.

If using a pre-processor don't nest more the 3 times if possible. This simplifies resulting css rules and makes specificity easier.

13) Style guidelines

* { on same line as selector
* space between rule and brace (.asd { NOT .asd{)
* Properties on new line, even if it's a single property.
* Properties in alphabetical order. This helps reduce the chance of double declaring a property and helps readability.
* space between property and value colon ("display: none" NOT "display:none")
* 1 line between rules



