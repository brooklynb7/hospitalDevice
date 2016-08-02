'use strict';

const net = require('net'),
	fs = require('fs'),
	_ = require('lodash'),
	request = require('request'),
	moment = require('moment'),
	path = require('path'),
	init = require(path.resolve('./config/init'))(),
	config = require(path.resolve('./config/config'));

const HOST = '0.0.0.0';
const PORT = config.tcp_port;

let crlf = new Buffer(2);
crlf[0] = 0xD; // CR - Carriage return character
crlf[1] = 0xA; // LF - Line feed character

let isValidDemoData = (data) => {
	let rst = false;
	data = parseInt(data, 10);
	if (_.isNumber(data) && data > 0 && data < 11) {
		rst = true;
	}

	return rst;
};

net.createServer((sock) => {

	console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

	sock.on('data', function(data) {
		var rstMsg = '';
		var time = moment().format('YYYY-MM-DD HH:mm:ss');
		if (data) {
			var originalData = (data + '');
			var dataStrings = originalData.split('&');
			var json = {};
			_.each(dataStrings, (item) => {
				let keyValue = item.split('=');
				if (keyValue.length > 1) {
					json[keyValue[0]] = keyValue[1];
				}
			});
			var msg = '[' + time + '] ' + sock.remoteAddress + ':' + sock.remotePort + ' - ' + data;
			console.log(msg);
			if (!json.deviceId) {
				sock.write('Error: Need deviceId');
			} else if (!isValidDemoData(json.data1) || !isValidDemoData(json.data2) ||
				!isValidDemoData(json.data3) || !isValidDemoData(json.data4) ||
				!isValidDemoData(json.data5)) {
				sock.write('Error: Demo data need to be between 1 to 10');
			} else {
				var requestOption = {
					url: 'http://127.0.0.1:9101/api/data',
					form: json
				};
				request.post(requestOption, function(error, response, body) {
					if (error) {
						console.log(msg);
						rstMsg = 'FAIL';
					} else if (response.statusCode !== 200) {
						console.log(body);
						rstMsg = 'FAIL - ' + body;
					} else {
						console.log(body);
						rstMsg = 'OK';
					}
					sock.write(rstMsg);
				});
			}
		} else {
			rstMsg = '[' + time + '] ' + 'Error: Empty Data';
			sock.write(rstMsg);
		}
	});

	sock.on('close', function(data) {
		console.log('CLOSED\n');
	});

	sock.on('error', function(err) {
		var time = moment().format('YYYY-MM-DD HH:mm:ss');
		console.log('[' + time + '] ' + console.log(err.stack));
	});

}).listen(PORT, HOST);

console.log('TCP Server listening on ' + HOST + ':' + PORT);
