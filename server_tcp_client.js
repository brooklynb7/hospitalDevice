'use strict';

const net = require('net'),
	path = require('path'),
	init = require(path.resolve('./config/init'))(),
	config = require(path.resolve('./config/config'));

const tcp_host = '0.0.0.0';
const tcp_port = config.tcp_port;

var client = new net.Socket();

var crlf = new Buffer(2);
crlf[0] = 0xD; // CR - Carriage return character
crlf[1] = 0xA; // LF - Line feed character

client.connect(tcp_port, tcp_host, function() {

	console.log('CONNECTED TO: ' + tcp_host + ':' + tcp_port);
	client.write('data1=5&data2=6&data3=5&data4=5&data5=5&deviceId=DV0001');
});

client.on('data', function(data) {
	console.log('DATA: ' + data);
	client.destroy();
});

client.on('close', function() {
	console.log('Connection closed');
});
