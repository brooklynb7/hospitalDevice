(function($) {
	'use strict';

	var selector = {
		dataApi: {
			panel: '#dataApiPanel',
			selectedDevice: '#dataApiPanel .deviceSelect option:selected',
			simulate7DaysBtn: '#dataApiPanel .simulate7daysBtn',
			selectedDevice2: '#dataApiPanel .deviceSelect2 option:selected',
			simulateTodayBtn: '#dataApiPanel .simulateTodayBtn',
			data1Input: '#dataApiPanel #data1Input',
			data2Input: '#dataApiPanel #data2Input',
			data3Input: '#dataApiPanel #data3Input',
			data4Input: '#dataApiPanel #data4Input',
			data5Input: '#dataApiPanel #data5Input',
			simulate7daysMsg: '#dataApiPanel .simulate7daysMsg',
			postDataMsg: '#dataApiPanel .postDataMsg'
		},
		qualifiedDataApi: {
			panel: '#qualifiedDataApiPanel',
			selectedDevice: '#qualifiedDataApiPanel .deviceSelect option:selected',
			simulate7DaysBtn: '#qualifiedDataApiPanel .simulate7daysBtn',
			selectedDevice2: '#qualifiedDataApiPanel .deviceSelect2 option:selected',
			simulateTodayBtn: '#qualifiedDataApiPanel .simulateTodayBtn',
			selectedQualifiedData: 'input[type="radio"][name="qualifiedRadios"]:checked',
			postQualifiedDataMsg: '#qualifiedDataApiPanel .postQualifiedDataMsg'
		},
		modalMsg: '.modal-msg',
		modalContent: '.modal-content'
	};

	$(document).ready(function() {
		bindSimulate7DaysDataEvent();
		bindSimulate7DaysQualifiedDataEvent();

		bindSimulateTodayDataEvent();
		bindSimulateTodayQualifiedDataEvent();
	});

	function bindSimulate7DaysDataEvent() {
		$(selector.dataApi.simulate7DaysBtn).on('click', function() {
			var $deviceSelect = $(selector.dataApi.selectedDevice);
			var deviceId = $deviceSelect.val();
			UI.Modal.confirm({
				title: '模拟过去7天 ' + $deviceSelect.text() + ' 的采集数据' + deviceId,
				html: $('<div>此操作将删除过去7天数据并随机生成7天模拟数据，是否继续?</div>'),
				confirm: doSimluate7DaysData(deviceId)
			});
		});
	}

	function bindSimulate7DaysQualifiedDataEvent() {
		$(selector.qualifiedDataApi.simulate7DaysBtn).on('click', function() {
			var $deviceSelect = $(selector.qualifiedDataApi.selectedDevice);
			var deviceId = $deviceSelect.val();
			UI.Modal.confirm({
				title: '模拟过去7天 ' + $deviceSelect.text() + ' 的消毒合格数据' + deviceId,
				html: $('<div>此操作将删除过去7天数据并随机生成7天模拟数据，是否继续?</div>'),
				confirm: doSimluate7DaysQualifiedData(deviceId)
			});
		});
	}

	function doSimluate7DaysData(deviceId) {
		return function($modal) {
			var bi = new BusyIndicator($modal.find(selector.modalContent));
			bi.show();
			Service.simluateData(7, deviceId).done(function() {
				$modal.modal('hide');
				$(selector.dataApi.simulate7daysMsg)
					.show()
					.text('数据模拟成功').addClass('text-success').removeClass('text-danger')
					.fadeOut(4000);
			}).fail(function(jqXHR) {
				$modal.find(selector.modalMsg).text(jqXHR.responseText);
			}).always(function() {
				bi.hide();
			});
		};
	}

	function doSimluate7DaysQualifiedData(deviceId) {
		return function($modal) {
			var bi = new BusyIndicator($modal.find(selector.modalContent));
			bi.show();
			Service.simluateQualifiedData(7, deviceId).done(function() {
				$modal.modal('hide');
			}).fail(function(jqXHR) {
				$modal.find(selector.modalMsg).text(jqXHR.responseText);
			}).always(function() {
				bi.hide();
			});
		};
	}

	function bindSimulateTodayDataEvent() {
		$(selector.dataApi.simulateTodayBtn).on('click', function() {
			var dataInputs = [
				$(selector.dataApi.data1Input).val(),
				$(selector.dataApi.data2Input).val(),
				$(selector.dataApi.data3Input).val(),
				$(selector.dataApi.data4Input).val(),
				$(selector.dataApi.data5Input).val()
			];

			var isValid = true;

			_.each(dataInputs, function(val, idx) {
				var formSelector = $('#data' + (idx + 1) + 'InputFormGroup');
				val = parseInt(val);
				if (!$.isNumeric(val) || val < 1 || val > 10) {
					formSelector.addClass('has-error');
					isValid = false;
				} else {
					formSelector.removeClass('has-error');
				}
			});

			var $postDataMsg = $(selector.dataApi.postDataMsg);

			if (!isValid) {
				$postDataMsg.text('请填写1－10之间的数字').addClass('text-danger').removeClass('text-success');
			} else {
				$postDataMsg.text('');
				var bi = new BusyIndicator($(selector.dataApi.panel));
				bi.show();

				Service.postData({
						data1: dataInputs[0],
						data2: dataInputs[1],
						data3: dataInputs[2],
						data4: dataInputs[3],
						data5: dataInputs[4],
						deviceId: $(selector.dataApi.selectedDevice2).val()
					}).done(function() {
						$postDataMsg.removeClass('text-danger').addClass('text-success').text('数据提交成功').fadeOut(4000);
					})
					.fail(function(jqXHR) {
						$postDataMsg.addClass('text-danger').removeClass('text-success').text(jqXHR.responseText);
					})
					.always(function() {
						bi.hide();
					});
			}
		});
	}

	function bindSimulateTodayQualifiedDataEvent() {
		$(selector.qualifiedDataApi.simulateTodayBtn).on('click', function() {
			var val = parseInt($(selector.qualifiedDataApi.selectedQualifiedData).val());
			var bi = new BusyIndicator($(selector.qualifiedDataApi.panel));
			bi.show();
			var $postQualifiedDataMsg = $(selector.qualifiedDataApi.postQualifiedDataMsg);
			Service.postQualifiedData({
				deviceId: $(selector.qualifiedDataApi.selectedDevice2).val(),
				isQualified: val ? true : false
			}).done(function(){
				$postQualifiedDataMsg.removeClass('text-danger').addClass('text-success').text('数据提交成功').fadeOut(4000);
			})
			.fail(function(jqXHR){
				$postQualifiedDataMsg.addClass('text-danger').removeClass('text-success').text(jqXHR.responseText);
			})
			.always(function(){
				bi.hide();
			});
		});
	}

})(jQuery);