(function($) {
	'use strict';

	var selector = {
		userList: '#userList',
		userListTbody: '#userList tbody'
	};

	$(document).ready(function() {
		loadUserList();
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
		var $tr = $('<tr>');
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
		$btn.on('click', function(){
			UI.Modal.confirm({
				title: '编辑用户信息',
				html: $html,
				confirm: null
			});
		});
		return $btn;
	}

	function createRemoveUserBtn(userItem) {
		var $btn = $('<a href="javascript:void(0)" class="removeUserBtn">删除</a>');
		var $html = $(_.template($('#removeUserTpl').html())(userItem));
		$btn.on('click', function(){
			UI.Modal.confirm({
				title: '删除用户',
				html: $html,
				confirm: null
			});
		});
		return $btn;
	}

})(jQuery);