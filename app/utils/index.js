'use strict';

var _ = require('lodash');

exports.getRealIP = function(ipString) {
	if (!ipString) {
		return ipString;
	}
	var realIP = null;
	var ipArray = ipString.split(':');
	if (ipArray.length === 1) {
		realIP = ipString;
	} else {
		var ip = ipArray[ipArray.length - 1];
		if (ip === '1') {
			realIP = '127.0.0.1';
		} else {
			realIP = ip;
		}
	}

	return realIP;
};
