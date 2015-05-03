(function ($) {
	'use strict';

	var UI = function() {
		
	};

	UI.prototype.setElementDisabled = function(element, isDisabled){
		element.prop('disabled', isDisabled);
	};

	window.UI = new UI();
})(jQuery);