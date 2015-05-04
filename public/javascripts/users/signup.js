(function($) {
	'use strict';

	var selector = {
		usernameInput: '#inputUsername',
		passwordInput: '#inputPassword',
		signupBtn: '#signupBtn',
		signupMsg: '.signupMsg'
	};

	$(document).ready(function() {
		bindSignupEvent();
	});

	function bindSignupEvent() {
		var bi = new BusyIndicator($(selector.signupMsg));

		$(selector.signupBtn).on('click', function() {
			bi.show();
			setSignupBtnDisabled(true);
			Service.signup({
				username: $(selector.usernameInput).val(),
				password: $(selector.passwordInput).val()
			}).done(function() {
				window.location.href = '/';
			}).fail(function(jqXHR) {
				$(selector.signupMsg).text(jqXHR.responseText);
			}).always(function() {
				bi.hide();
				setSignupBtnDisabled(false);
			});
		});
	}

	function setSignupBtnDisabled(isDisabled) {
		UI.setElementDisabled($(selector.signupBtn), isDisabled);
	}

})(jQuery);