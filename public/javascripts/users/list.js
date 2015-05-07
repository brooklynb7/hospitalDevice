(function($) {
	'use strict';

	var selector = {
		userList: '.userList',
		userListTbody: '.userList tbody',
		addUserBtn: '.addUserBtn',
		updateUserForm: {
			nameInput: '.updateUserForm #inputName',
			mobileInput: '.updateUserForm #inputMobile',
			emailInput: '.updateUserForm #inputEmail'
		},
		modalMsg: '.modal-msg',
		modalContent: '.modal-content'
	};

	$(document).ready(function() {
		loadUserList();
		bindAddingUserEvent();
	});

	function loadUserList() {
		var bi = new BusyIndicator($(selector.userList));
		bi.show();
		Service.getUserList().done(function(userList) {
			console.log(userList);
			$.each(userList, function(idx, userItem) {
				$(selector.userListTbody).append(createUserTr(userItem));
			});
		}).fail(function() {

		}).always(function() {
			bi.hide();
		});
	}

	function createUserTr(userItem) {
		var $tr = $('<tr>').attr('id', userItem._id);
		$tr.append($('<td>').text(userItem.userId));
		$tr.append($('<td>').text(userItem.username));
		$tr.append($('<td>').text(userItem.name));
		$tr.append($('<td>').text(userItem.mobile));
		$tr.append($('<td>').text(userItem.email));
		$tr.append($('<td class="text-right">')
			.append(createEditUserBtn(userItem))
			.append(createRemoveUserBtn(userItem)));
		return $tr;
	}

	function createEditUserBtn(userItem) {
		var $btn = $('<a href="javascript:void(0)" class="">编辑</a>');
		var $html = $(_.template($('#editFormTpl').html())(userItem));
		$btn.on('click', function() {
			UI.Modal.confirm({
				title: '编辑用户信息',
				html: $html,
				confirm: updateUserInfoFunction(userItem)
			});
		});
		return $btn;
	}

	function updateUserInfoFunction(userItem) {
		return function($modal) {
			var bi = new BusyIndicator($modal.find(selector.modalContent));
			bi.show();
			Service.updateUserInfo(userItem._id, {
				name: $(selector.updateUserForm.nameInput).val(),
				mobile: $(selector.updateUserForm.mobileInput).val(),
				email: $(selector.updateUserForm.emailInput).val()
			}).done(function(user) {
				$modal.modal('hide');
				$(selector.userList).find('tr#' + userItem._id).replaceWith(createUserTr(user));
			}).fail(function(jqXHR) {
				$modal.find(selector.modalMsg).text(jqXHR.responseText);
			}).always(function() {
				bi.hide();
			});
		};
	}

	function createRemoveUserBtn(userItem) {
		var $btn = $('<a href="javascript:void(0)" class="removeUserBtn">删除</a>');
		var $html = $(_.template($('#removeUserTpl').html())(userItem));
		$btn.on('click', function() {
			UI.Modal.confirm({
				title: '删除用户',
				html: $html,
				confirm: removeUserFunction(userItem._id)
			});
		});
		return $btn;
	}

	function removeUserFunction(id){
		return function($modal) {
			var bi = new BusyIndicator($modal.find(selector.modalContent));
			bi.show();
			Service.removeUser(id).done(function(){
				$modal.modal('hide');
				$(selector.userList).find('tr#' + id).remove();
			}).fail(function(jqXHR){
				$modal.find(selector.modalMsg).text(jqXHR.responseText);
			}).always(function(){
				bi.hide();
			});
		};
	}

	function bindAddingUserEvent() {
		$(selector.addUserBtn).on('click', function() {
			UI.Modal.confirm({
				title: '添加用户',
				html: $(_.template($('#addUserTpl').html())()),
				confirm: null,
				suspendConfirm: true
			});
		});
	}

})(jQuery);