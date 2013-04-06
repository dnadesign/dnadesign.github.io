(function($) {
	$(document).ready(function() {
		$(".search-tags").click(function() {
			if($(".tags").is(":visible")) {
				$(".tags").fadeOut();
			}
			else {
				$(".tags").fadeIn();
			}
		})
	});
})(jQuery);