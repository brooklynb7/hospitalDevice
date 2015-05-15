(function($) {
	'use strict';

	var selector = {
		dataApi: {
			panel: '#dataApiPanel',
			selectedDevice: '#dataApiPanel .deviceSelect option:selected',
			simulate7DaysBtn: '#dataApiPanel .simulate7daysBtn'
		},
		modalMsg: '.modal-msg',
		modalContent: '.modal-content'
	};

	$(document).ready(function() {
		bindSimulate7DaysDataEvent();
	});

	function bindSimulate7DaysDataEvent() {
		$(selector.dataApi.simulate7DaysBtn).on('click', function() {
			var $deviceSelect = $(selector.dataApi.selectedDevice);
			var deviceId = $deviceSelect.val();
			UI.Modal.confirm({
				title: '模拟过去7天 '+ $deviceSelect.text() +' 的采集数据' + deviceId,
				html: $('<div>此操作将删除过去7天数据并随机生成7天模拟数据，是否继续?</div>'),
				confirm: doSimluate7DaysData(deviceId)
			});
		});
	}

	function doSimluate7DaysData(deviceId) {
		return function($modal) {
			var bi = new BusyIndicator($modal.find(selector.modalContent));
			bi.show();
			Service.simluateData(7, deviceId).done(function() {				
				$modal.modal('hide');
			}).fail(function(jqXHR) {
				$modal.find(selector.modalMsg).text(jqXHR.responseText);
			}).always(function() {
				bi.hide();
			});
		};
	}

})(jQuery);