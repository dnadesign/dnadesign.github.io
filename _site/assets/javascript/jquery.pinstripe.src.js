(function ($) {
	"use strict";

	$.fn.Pinstripe = function (settings) {

		var opts =  $.extend({}, $.fn.Pinstripe.defaults);
		opts = $.extend(opts, settings);

		return this.each(function (i, el) {

			var c = $(this),
				windowResizeBinded = false,

				// Set up all events and functions
				Pinstripe = {
					setupEvents: function () {
						if (!windowResizeBinded) {
							var win = $(window),
								win_w = win.width(),
								win_h = win.height(),
								timeout;

							win.on('resize', function (e) {
								// IE wants to constantly run resize for some reason
								// Let’s make sure it is actually a resize event
								var win_w_new = win.width(),
									win_h_new = win.height();

								if (win_w !== win_w_new || win_h !== win_h_new) {
									// timer shennanigans
									clearTimeout(timeout);
									timeout = setTimeout(
										function () {
											Pinstripe.split();
										},
										50
									);
									// Update the width and height
									win_w = win_w_new;
									win_h = win_h_new;
								}
							});
							windowResizeBinded = true;
						}
					},
					split: function () {
						var items = c.children(),
							length = items.length,
							colsWidth = Math.round(items.first().outerWidth() / c.width() * 100),
							cols = Math.floor(100 / colsWidth),
							newCol,
							pullThis,
							pullSize,
							totalPullSize = 0,
							splitAt,
							i;

						c.removeAttr('style');
						items.removeAttr('class').removeAttr('style').addClass('col1');
						if (cols === 1) {
							return false;
						}
						if (length / cols <= cols) {
							return false;
						}
						for (i = 2; i <= cols; i = i + 1) {
							splitAt = Math.ceil(length / cols) * (i - 1);
							newCol = c.children('li:gt(' + splitAt + ')').removeClass('col' + (i - 1)).addClass('col' + i);
							pullThis = newCol.first();
							items.hide();
							c.children('.col' + (i - 1)).show();
							pullSize = c.height();
							items.show();
							newCol.removeAttr('style');
							pullThis.css('marginTop', -1 * pullSize);
							if (pullSize > totalPullSize) {
								totalPullSize = pullSize;
							}
						}
						c.css('height', totalPullSize);

					}
				};

			Pinstripe.split();
			Pinstripe.setupEvents();
		});
	};

	$.fn.Pinstripe.defaults = {

	};

})(jQuery);