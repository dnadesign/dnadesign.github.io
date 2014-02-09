(function($) {
	// single page jekyll blog. Clicking an article should open it on the single
	// page.
	$(".post-title a, .post-intro").click(function(e) {
		// need to resolve evaling javascript first
		return; 

		e.preventDefault();

		var post = $(this).parents('.post'),
			intro = post.find('.post-intro'),
			title = post.find('.post-title'),
			text = post.find('.post-text'),
			link = title.find('a').attr('href'),
			spinner = $("<p></p>").addClass('post-spinner'),
			i = 0;
			spin = ["|", "/", "-", "\\"];

		text.css('height', intro.height());
		text.prepend(spinner);


		setInterval(function() {
			i = i == spin.length - 1 ? 0 : ++i;

		spinner.text(spin[i]);
	}, 200);

		spinner.fadeIn();

		// remove the link on the title
		title.find('h2').html(title.find('a').html());

		intro.fadeOut(function() {
			intro.remove();

			// fetch the article content from the link.
			$.get(link, function(data) {
				// remove spinner
				var body = $(data).find('.post-content');
				body.hide();

				// add the body to the text
				text.prepend(body);

				text.animate({
					height: body.height()
				}, function() {
					spinner.fadeOut(function() {
						body.fadeIn();

						text.css('height', '');
					});
				});
			});
		});
	});
})(jQuery);