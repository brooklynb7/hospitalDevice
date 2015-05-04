(function($) {
	'use strict';

	var selector = {
		usernameInput: '#inputUsername',
		passwordInput: '#inputPassword',
		signinBtn: '#signinBtn',
		signinMsg: '.signinMsg'
	};

	$(document).ready(function() {
		bindSigninEvent();
	});

	function bindSigninEvent() {
		var bi = new BusyIndicator($(selector.signinMsg));

		$(selector.signinBtn).on('click', function() {
			bi.show();
			setSigninDisabled(true);
			Service.signin({
				username: $(selector.usernameInput).val(),
				password: $(selector.passwordInput).val()
			}).done(function() {
				window.location.href = '/';
			}).fail(function(jqXHR) {
				$(selector.signinMsg).text(jqXHR.responseJSON.message);
			}).always(function() {
				bi.hide();
				setSigninDisabled(false);
			});
		});
	}

	function setSigninDisabled(isDisabled) {
		UI.setElementDisabled($(selector.signinBtn), isDisabled);
	}

})(jQuery);