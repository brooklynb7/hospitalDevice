(function($) {
	'use strict';

	var Service = function() {
		this.url_prefix = '/api';
	};

	Service.prototype.apiUrl = function(serviceUrl) {
		if (serviceUrl.indexOf('/') !== 0) {
			serviceUrl = '/' + serviceUrl;
		}
		return this.url_prefix + serviceUrl;
	};

	Service.prototype.signup = function(userObj) {
		return $.ajax({
			url: this.apiUrl('/auth/signup'),
			method: 'POST',
			data: userObj
		});
	};

	window.Service = new Service();
})(jQuery);