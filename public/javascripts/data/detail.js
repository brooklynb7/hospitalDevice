(function($) {
	'use strict';

	var selector = {
		dataPanel: '.dataPanel',
		dataList: '.dataPanel .dataList',
		dataListTbody: '.dataPanel .dataList tbody',
		deviceSelect: '.dataPanel .deviceSelect',
		dateSelect: '.dataPanel .dateSelect',
		selectedDevice: '.dataPanel .deviceSelect option:selected',
		selectedDate: '.dataPanel .dateSelect option:selected',
		dataFlot: '.dataPanel #dataFlotPlacehoder',
		dataTab: '.nav.nav-tabs.dataTab>li>a',
		flotTooltip: '#tooltip',
		modalMsg: '.modal-msg',
		modalContent: '.modal-content'
	};

	var currentDataType = 1;
	var data = [];
	var plot = null;
	var flotConfig = {
		data: [],
		color: 'rgb(30, 180, 20)',
		threshold: {
			below: 2,
			above: 9,
			color: 'rgb(200, 20, 30)'
		},
		points: {
			show: true
		}
	};
	function renderDataFLot(dataList, dateVal) {
		plot = $.plot(selector.dataFlot, [dataList], {
			xaxis: {
				mode: 'time',
				timezone: 'browser',
				minTickSize: [1, 'hour'],
				min: moment(dateVal, 'YYYYMMDD'),
				max: moment(dateVal, 'YYYYMMDD').add(1, 'days')
			},
			yaxis: {
				min: 0,
				max: 10
			},
			series: {
				lines: {
					show: true,
					fill: false,
					lineWidth: 1
				},
				points: {
					show: true,
					radius: 1
				}
			},
			grid: {
				hoverable: true,
				clickable: true
			}
		});
		UI.appendFlotTooltip();
	}

	$(document).ready(function() {
		bindDeviceSelectChangeEvent();
		bindDateSelectChangeEvent();
		bindDataTabChangeEvent();
		bindFlotPointHoverEvent();
		loadDataList($(selector.selectedDevice).val(), $(selector.selectedDate).val());
	});

	function bindDeviceSelectChangeEvent() {
		var $deviceSelect = $(selector.deviceSelect);
		$deviceSelect.on('change', function() {
			loadDataList($deviceSelect.val(), $(selector.selectedDate).val());
		});
	}

	function bindDateSelectChangeEvent() {
		var $dateSelect = $(selector.dateSelect);
		$dateSelect.on('change', function() {
			loadDataList($(selector.selectedDevice).val(), $dateSelect.val());
		});
	}

	function bindDataTabChangeEvent() {
		$(selector.dataTab).on('click', function() {
			currentDataType = parseInt($(this).attr('dataType'));
			flotConfig.data = data[currentDataType - 1];
			renderDataFLot(flotConfig, $(selector.selectedDate).val());
		});
	}

	function bindFlotPointHoverEvent() {
		$(selector.dataFlot).on('plothover', function(event, pos, item) {
			if (item) {
				var x = item.datapoint[0],
					y = item.datapoint[1];

				$(selector.flotTooltip).html('时间: ' + moment(x).format('HH:mm:ss') + '<br/>数值: ' + y)
					.css({
						top: item.pageY + 5,
						left: item.pageX + 15
					})
					.fadeIn(200);
			} else {
				$(selector.flotTooltip).hide();
			}
		});
	}

	function loadDataList(deviceId, date) {
		var bi = new BusyIndicator($(selector.dataPanel));
		bi.show();
		Service.getDataList(date, deviceId).done(function(dataList) {
			$(selector.dataListTbody).empty();
			data = [
				[],
				[],
				[],
				[],
				[]
			];
			if (dataList.length === 0) {
				$(selector.dataListTbody).append(createEmptyDataTr());
			} else {
				$.each(dataList, function(idx, dataItem) {
					$(selector.dataListTbody).append(createDataTr(dataItem));
					var msgTime = new Date(dataItem.msgTime).valueOf();
					data[0].push([msgTime, parseInt(dataItem.data1)]);
					data[1].push([msgTime, parseInt(dataItem.data2)]);
					data[2].push([msgTime, parseInt(dataItem.data3)]);
					data[3].push([msgTime, parseInt(dataItem.data4)]);
					data[4].push([msgTime, parseInt(dataItem.data5)]);
				});
			}
			flotConfig.data = data[currentDataType - 1];
			renderDataFLot(flotConfig, date);
		}).fail(function(jqXHR) {
			console.log(jqXHR.responseText);
		}).always(function() {
			bi.hide();
		});
	}

	function createDataTr(dataItem) {
		var $tr = $('<tr>').attr('id', dataItem._id);
		$tr.append($('<td>').append(createStateDataText(dataItem.data1)));
		$tr.append($('<td>').append(createStateDataText(dataItem.data2)));
		$tr.append($('<td>').append(createStateDataText(dataItem.data3)));
		$tr.append($('<td>').append(createStateDataText(dataItem.data4)));
		$tr.append($('<td>').append(createStateDataText(dataItem.data5)));
		$tr.append($('<td class="date-with-scroll text-center">').text(moment(dataItem.msgTime).format('YYYY-MM-DD HH:mm:ss')));
		return $tr;
	}

	function createEmptyDataTr() {
		return $('<tr><td colspan="6" class="text-center">无数据</td></tr>');
	}

	function createStateDataText(data) {
		var $span = $('<span>' + data + '<span>');
		if (data <= 1) {
			$span.addClass('text-danger');
		}
		return $span;
	}

})(jQuery);