(function($) {
	'use strict';

	var selector = {
		qualifiedDataPanel: '.qualifiedDataPanel',
		dataList: '.qualifiedDataPanel .dataList',
		dataListTbody: '.qualifiedDataPanel .dataList tbody',
		deviceSelect: '.qualifiedDataPanel .deviceSelect',
		dateSelect: '.qualifiedDataPanel .dateSelect',
		selectedDevice: '.qualifiedDataPanel .deviceSelect option:selected',
		selectedDate: '.qualifiedDataPanel .dateSelect option:selected',
		dataFlot: '.qualifiedDataPanel #dataFlotPlacehoder',
		modalMsg: '.modal-msg',
		modalContent: '.modal-content'
	};

	var flotConfig = {
		data: [],
		color: 'rgb(30, 180, 20)',
		threshold: {
			below: 1,
			color: 'rgb(200, 20, 30)'
		}
	};
	var flotData = [];
	var plot = null;

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
				min: -1,
				max: 2
			},
			series: {
				lines: {
					show: false
				},
				points: {
					show: true,
					radius: 4
				}
			},
			grid: {
				hoverable: true,
				clickable: true
			}
		});

		$("<div id='tooltip'></div>").css({
			position: "absolute",
			display: "none",
			border: "1px solid #fdd",
			padding: "2px",
			"background-color": "#fee",
			opacity: 0.80
		}).appendTo("body");
	}

	$(document).ready(function() {
		bindDeviceSelectChangeEvent();
		bindDateSelectChangeEvent();
		bindFlotPointHoverEvent();
		bindFlotPointClickEvent();
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

	function bindFlotPointHoverEvent() {
		$(selector.dataFlot).on('plothover', function(event, pos, item) {
			if (item) {
				var x = item.datapoint[0],
					y = item.datapoint[1];

				$("#tooltip").html('时间: ' + moment(x).format('HH:mm:ss') + '<br/>指标: ' + y)
					.css({
						top: item.pageY + 5,
						left: item.pageX + 15
					})
					.fadeIn(200);
			} else {
				$("#tooltip").hide();
			}
		});
	}

	function bindFlotPointClickEvent(){
		$(selector.dataFlot).on('plotclick', function(event, pos, item) {
			if (item) {
				var dataId = null;
				if(item.datapoint[1] === 1) {
					dataId = item.series.dataIds[item.dataIndex];
				} else {
					dataId = item.series.thresholdDataIds[item.dataIndex]
				}
				plot.unhighlight();
				plot.highlight(item.series, item.datapoint);
				$(selector.dataListTbody + '>tr').removeClass('info');
				$('#' + dataId).addClass('info');
			}
		});
	}

	function loadDataList(deviceId, date) {
		var bi = new BusyIndicator($(selector.qualifiedDataPanel));
		bi.show();
		Service.getQualifedDataList(date, deviceId).done(function(dataList) {
			$(selector.dataListTbody).empty();
			var dataIds = [];
			var thresholdDataIds = [];
			flotData = [];
			if (dataList.length === 0) {
				$(selector.dataListTbody).append(createEmptyDataTr());
			} else {
				$.each(dataList, function(idx, dataItem) {
					$(selector.dataListTbody).append(createDataTr(dataItem));
					var msgTime = new Date(dataItem.msgTime).valueOf();
					flotData.push([msgTime, dataItem.isQualified ? 1 : 0]);
					if(dataItem.isQualified) {
						dataIds.push(dataItem._id);
					} else {
						thresholdDataIds.push(dataItem._id);
					}
				});
			}
			flotConfig.data = flotData;
			flotConfig.dataIds = dataIds;
			flotConfig.thresholdDataIds = thresholdDataIds;
			renderDataFLot(flotConfig, date);
		}).fail(function(jqXHR) {
			console.log(jqXHR.responseText);
		}).always(function() {
			bi.hide();
		});
	}

	function createDataTr(dataItem) {
		var $tr = $('<tr>').attr('id', dataItem._id);
		$tr.append($('<td>').append(createStateDataText(dataItem.isQualified)));
		$tr.append($('<td>').text(moment(dataItem.msgTime).format('YYYY-MM-DD HH:mm:ss')));
		return $tr;
	}

	function createEmptyDataTr() {
		return $('<tr><td colspan="2" class="text-center">无数据</td></tr>');
	}

	function createStateDataText(data) {
		var $span = $('<span>' + (data ? '合格' : '不合格') + '<span>');
		if (data === false) {
			$span.addClass('text-danger');
		}
		return $span;
	}

})(jQuery);