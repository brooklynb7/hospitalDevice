(function($) {
	'use strict';

	var UI = function() {};

	UI.prototype.setElementDisabled = function(element, isDisabled) {
		element.prop('disabled', isDisabled);
	};

	UI.prototype.appendFlotTooltip = function(){
		return $('<div id="tooltip"></div>').css({
			position: 'absolute',
			display: 'none',
			border: '1px solid #fdd',
			padding: '2px',
			'background-color': '#fee',
			opacity: 0.80
		}).appendTo('body');
	};

	UI.prototype.Model = window.Modal;

	window.UI = new UI();
})(jQuery);

(function($) {
	'use strict';

	var _confirmModalHtml = function(options) {
		options = options || {};
		var modalSize = (options.size === 'large' ? 'modal-lg' : '');
		var $modal = $('<div class="modal  fade" tabindex="-1" />');
		if (navigator.userAgent.indexOf('Android 2.3') !== -1) {
			$modal.attr('style', 'position:absolute;overflow: visible;');
		}
		var $modal_dialog = $('<div class="modal-dialog ' + modalSize + '" />');
		var $modal_content = $('<div class="modal-content" />');

		var $modal_header = $('<div class="modal-header" />');
		var $close_btn = $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>');
		var $modal_title = $('<h4 class="modal-title">' + (options.title || 'Modal title') + '</h4>');
		$modal_header.append($close_btn).append($modal_title);

		var $modal_body = $('<div class="modal-body" />').append($('<p />').append(options.html || ''));
		$modal_content.append($modal_header).append($modal_body);

		if (options.modalType === 1) {
			var $modal_footer = $('<div class="modal-footer" />');
			var $modal_msg = $('<span class="text-danger modal-msg"></span>');
			var $modal_close = $('<button type="button" class="btn btn-sm btn-default" data-dismiss="modal">取消</button>');
			var $modal_confirm = $('<button type="button" class="btn btn-sm btn-primary confirm-btn">确认</button>');
			if(options.suspendConfirm === true) {
				$modal_confirm = $('<button type="button" class="btn btn-sm btn-primary confirm-btn" disabled>暂不开放</button>');
			}

			$modal_footer.append($modal_msg).append($modal_close).append($modal_confirm);
			$modal_content.append($modal_footer);
		}

		$modal.append($modal_dialog.append($modal_content));
		$modal.on('hidden.bs.modal', function() {
			$modal.remove();
		});
		$modal.on('shown.bs.modal', function() {
			if ($.isFunction(options.shownEvent)) {
				options.shownEvent();
			}
			if (navigator.userAgent.indexOf('Android 2.3') !== -1) {
				$('body.modal-open').css('overflow', 'auto');
				window.scrollTo(0, 0);
			}
		});
		//$modal.find('.plh').placeholder();
		return $modal;
	};

	var creatConfirmModal = function(options) {
		options.modalType = 1;
		var $modal = _confirmModalHtml(options);
		$('body').append($modal);
		$modal.modal('show');
		if (options && options.confirm && $.isFunction(options.confirm)) {
			$modal.find('.confirm-btn').on('click', function() {
				options.confirm($modal);
			});
		}
		return $modal;
	};

	var createDialogModal = function(options) {
		options.modalType = 2;
		var $modal = _confirmModalHtml(options);
		$('body').append($modal);
		$modal.modal('show');

		return $modal;
	};

	window.UI.Modal = {
		confirm: creatConfirmModal,
		dialog: createDialogModal
	};
})(jQuery);