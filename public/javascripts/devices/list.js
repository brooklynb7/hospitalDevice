(function($) {
	'use strict';

	var selector = {
		deviceList: '.deviceList',
		deviceListTbody: '.deviceList tbody',
		addDeviceBtn: '.addDeviceBtn',
		addDeviceForm: {
			deviceIdInput: '.addDeviceForm #deviceIdInput',
			nameInput: '.addDeviceForm #nameInput',
			typeInput: '.addDeviceForm #typeInput',
			descriptionInput: '.addDeviceForm #descriptionInput'
		},
		updateDeviceForm: {
			nameInput: '.updateUserForm #nameInput',
			typeInput: '.updateUserForm #typeInput',
			descriptionInput: '.updateUserForm #descriptionInput'

		},
		modalMsg: '.modal-msg',
		modalContent: '.modal-content'
	};

	$(document).ready(function() {
		loadDeviceList();
		bindAddingDevice();
	});

	function loadDeviceList() {
		var bi = new BusyIndicator($(selector.deviceList));
		bi.show();
		Service.getDeviceList().done(function(deviceList) {
			$.each(deviceList, function(idx, deviceItem) {
				$(selector.deviceListTbody).append(createDeviceTr(deviceItem));
			});
		}).fail(function() {

		}).always(function() {
			bi.hide();
		});
	}

	function createDeviceTr(deviceItem) {
		var $tr = $('<tr>').attr('id', deviceItem._id);
		$tr.append($('<td>').text(deviceItem.deviceId));
		$tr.append($('<td>').text(deviceItem.name));
		$tr.append($('<td>').text(deviceItem.type));
		$tr.append($('<td>').text(deviceItem.description));
		$tr.append($('<td class="text-center">')
			.append(createEditDeviceBtn(deviceItem))
			.append(createRemoveDeviceBtn(deviceItem)));
		return $tr;
	}

	function createEditDeviceBtn(deviceItem) {
		var $btn = $('<a href="javascript:void(0)" class="">编辑</a>');
		var $html = $(_.template($('#editFormTpl').html())(deviceItem));
		$btn.on('click', function() {
			UI.Modal.confirm({
				title: '编辑设备信息',
				html: $html,
				confirm: updateDeviceInfo(deviceItem)
			});
		});
		return $btn;
	}

	function updateDeviceInfo(deviceItem) {
		return function($modal) {
			var bi = new BusyIndicator($modal.find(selector.modalContent));
			bi.show();
			Service.updateDevice(deviceItem._id, {
				name: $(selector.updateDeviceForm.nameInput).val(),
				type: $(selector.updateDeviceForm.typeInput).val(),
				description: $(selector.updateDeviceForm.descriptionInput).val()
			}).done(function(device) {
				$modal.modal('hide');
				$(selector.deviceList).find('tr#' + deviceItem._id).replaceWith(createDeviceTr(device));
			}).fail(function(jqXHR) {
				$modal.find(selector.modalMsg).text(jqXHR.responseText);
			}).always(function() {
				bi.hide();
			});
		};
	}

	function createRemoveDeviceBtn(deviceItem) {
		var $btn = $('<a href="javascript:void(0)" class="removeUserBtn">删除</a>');
		var $html = $(_.template($('#removeDeviceTpl').html())(deviceItem));
		$btn.on('click', function() {
			UI.Modal.confirm({
				title: '删除设备',
				html: $html,
				confirm: removeDeviceFunction(deviceItem._id)
			});
		});
		return $btn;
	}

	function removeDeviceFunction(id){
		return function($modal) {
			var bi = new BusyIndicator($modal.find(selector.modalContent));
			bi.show();
			Service.removeDevice(id).done(function(){
				$modal.modal('hide');
				$(selector.deviceList).find('tr#' + id).remove();
			}).fail(function(jqXHR){
				$modal.find(selector.modalMsg).text(jqXHR.responseText);
			}).always(function(){
				bi.hide();
			});
		};
	}

	function bindAddingDevice() {
		$(selector.addDeviceBtn).on('click', function() {
			UI.Modal.confirm({
				title: '添加设备',
				html: $(_.template($('#addDeviceTpl').html())()),
				confirm: addDeviceFunction()
			});
		});
	}

	function addDeviceFunction(){
		return function($modal) {
			var bi = new BusyIndicator($modal.find(selector.modalContent));
			bi.show();
			Service.addDevice({
				deviceId: $(selector.addDeviceForm.deviceIdInput).val(),
				name: $(selector.addDeviceForm.nameInput).val(),
				type: $(selector.addDeviceForm.typeInput).val(),
				description: $(selector.addDeviceForm.descriptionInput).val()
			}).done(function(device) {
				$modal.modal('hide');
				$(selector.deviceList).find('tbody').append(createDeviceTr(device));
			}).fail(function(jqXHR) {
				$modal.find(selector.modalMsg).text(jqXHR.responseText);
			}).always(function() {
				bi.hide();
			});
		};
	}

})(jQuery);