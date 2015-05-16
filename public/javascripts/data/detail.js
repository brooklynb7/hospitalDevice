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
		modalMsg: '.modal-msg',
		modalContent: '.modal-content'
	};

	$(document).ready(function() {
		bindDeviceSelectChangeEvent();
		bindDateSelectChangeEvent();
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

	function renderDataFLot(dataList, dateVal) {
		$.plot(selector.dataFlot, [dataList], {
			xaxis: {
				mode: "time",
				timezone: "browser",
				minTickSize: [1, "hour"],
				min: moment(dateVal, 'YYYYMMDD'),
				max: moment(dateVal, 'YYYYMMDD').add(1, 'days')
			}
		});
	}

	function loadDataList(deviceId, date) {
		var bi = new BusyIndicator($(selector.dataPanel));
		bi.show();
		Service.getDataList(date, deviceId).done(function(dataList) {
			$(selector.dataListTbody).empty();
			var flotData = [];
			if (dataList.length === 0) {
				$(selector.dataListTbody).append(createEmptyDataTr());
			} else {
				$.each(dataList, function(idx, dataItem) {
					$(selector.dataListTbody).append(createDataTr(dataItem));
					flotData.push([new Date(dataItem.msgTime).valueOf(), parseInt(dataItem.data1)]);
				});
			}
			renderDataFLot({
				label: '指标1',
				data: flotData,
				color: 'rgb(30, 180, 20)',
				threshold: {
					below: 2,
					color: 'rgb(200, 20, 30)'
				}
			}, date);
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
		$tr.append($('<td>').text(moment(dataItem.msgTime).format('YYYY-MM-DD HH:mm:ss')));
		return $tr;
	}

	function createEmptyDataTr() {
		return $('<tr><td colspan="6" class="text-center">无数据</td></tr>')
	}

	function createStateDataText(data) {
		var $span = $('<span>' + data + '<span>');
		if (data <= 1) {
			$span.addClass('text-danger');
		}
		return $span;
	}

})(jQuery);