(function($) {
	'use strict';

	var selector = {
		dataList: '.dataPanel .dataList',
		dataListTbody: '.dataPanel .dataList tbody',
		modalMsg: '.modal-msg',
		modalContent: '.modal-content'
	};

	$(document).ready(function() {
		loadDataList();
	});

	function loadDataList() {
		var bi = new BusyIndicator($(selector.dataList));
		bi.show();
		Service.getDataList('20150512', 'DV0001').done(function(dataList) {
			$.each(dataList, function(idx, dataItem) {
				$(selector.dataListTbody).append(createDataTr(dataItem));
			});
		}).fail(function(jqXHR) {
			console.log(jqXHR.responseText);
		}).always(function() {
			bi.hide();
		});
	}

	function createDataTr(dataItem) {
		var $tr = $('<tr>').attr('id', dataItem._id);
		$tr.append($('<td>').text(dataItem.data1));
		$tr.append($('<td>').text(dataItem.data2));
		$tr.append($('<td>').text(dataItem.data3));
		$tr.append($('<td>').text(dataItem.data4));
		$tr.append($('<td>').text(dataItem.data5));
		$tr.append($('<td>').text(moment(dataItem.msgTime).format('YYYY-MM-DD HH:mm:ss')));
		return $tr;
	}

})(jQuery);