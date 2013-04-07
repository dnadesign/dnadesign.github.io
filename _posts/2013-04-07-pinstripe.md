---
layout: post
tags : [javascript, plugin, lists, menus, columns]
title: "Pinstripe - a Javascript plugin"
author: "John Milmine"
---

Have you ever had to create a vertical multi-column menu? 

It's one of those things that I've seen in the art a hundred times, and I always forget how difficult they actually are to create.

I say vertical, because horizontal is easy.

If the order is:<br>
1 2<br>
3 4<br>
5 6

Then use float:left, set a width and you're away.

However if the order is:<br>
1 4<br>
2 5<br>
3 6

Then life becomes difficult.

There are some suggestions around the web to use the first example and just change the order of the list so that the item you want in position 2 from the second example you actually put in position 4, etc etc. Surely life is easier than this.

Turns out it is easy.

What you need to do is:
1. Set each li's width as a column width
2. Decide where to break the list
3. Negative margin the item directly after this position the height of the proceeding items
4. Set the left margin of the item and the proceeding ones, to a column width.

Easy right?

Well no. It's not. Not if it's content managed or responsive.

It it's content managed, then the height could change with an item wrapping onto multiple lines.

If it's responsive, then the height could change with an item wrapping onto multiple lines. Or you change the amount of columns you want to display between breakpoints.

So when I came to build http://wellington.govt.nz/services/community-and-culture/community-directory/community-groups I had both (the list under the search box).

The answer is javascript. Javascript that 
1. Figures out the number of columns based on their width. 
2. Decides where to break based on the number of items and the number of columns
3. Updates the negative margin when either the height or number of columns changes.

This means you can keep all of your logic in your HTML/CSS. You set your media queries, number of columns in your CSS. You set the content in your HTML or CMS. You tell the following plugin to watch that list and you're away.



