(function($) {
	'use strict';

	var selector = {
		usernameInput: '#inputUsername',
		passwordInput: '#inputPassword',
		confirmPasswordInput: '#inputConfirmPassword',
		nameInput: '#inputName',
		mobileInput: '#inputMobile',
		emailInput: '#inputEmail',
		signupBtn: '#signupBtn',
		signupMsg: '.signupMsg'
	};

	$(document).ready(function() {
		bindSignupEvent();
	});

	function bindSignupEvent() {
		var bi = new BusyIndicator($(selector.signupMsg));

		$(selector.signupBtn).on('click', function() {
			if ($(selector.passwordInput).val() !== $(selector.confirmPasswordInput).val()) {
				$(selector.signupMsg).text('两次密码输入不一致');
				return;
			}
			bi.show();
			setSignupBtnDisabled(true);
			Service.signup({
				username: $(selector.usernameInput).val(),
				password: $(selector.passwordInput).val(),
				name: $(selector.nameInput).val(),
				mobile: $(selector.mobileInput).val(),
				email: $(selector.emailInput).val()

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