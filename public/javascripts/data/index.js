(function($) {
	'use strict';

	var selector = {
		dataApi: {
			panel: '#dataApiPanel',
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
			UI.Modal.confirm({
				title: '模拟过去7天设备DV0001的采集数据',
				html: $('<div>此操作将删除过去7天数据并随机生成7天模拟数据，是否继续?</div>'),
				confirm: doSimluate7DaysData()
			});
		});
	}

	function doSimluate7DaysData() {
		return function($modal) {
			var bi = new BusyIndicator($modal.find(selector.modalContent));
			bi.show();
			Service.simluateData(7, 'DV0001').done(function() {				
				$modal.modal('hide');
			}).fail(function(jqXHR) {
				$modal.find(selector.modalMsg).text(jqXHR.responseText);
			}).always(function() {
				bi.hide();
			});
		};
	}

})(jQuery);