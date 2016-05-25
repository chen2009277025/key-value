/***
 * create by chenjainhui
 *
 * key-value键值对输入框
 */

(function ($) {
	$.keyValCouple = function (element, options) {
		var defaults = {
			prefix:                'keyval_',
			height:                'auto',
			useDimmer:             false,
			showAllOptionsOnFocus: false,
			allowAutocompleteOnly: false
		};

		var plugin = this;
		var selected_index = -1;
		var box_element = null;
		var tags_element = null;
		var keyval_wrap = null;
		var input_key = null;
		var input_value = null;
		var keyval_seperate = null;
		var textlength_element = null;
		var key = {
			backspace: 8,
			enter:     13,
			escape:    27,
			left:      37,
			up:        38,
			right:     39,
			down:      40,
			comma:     188
		};
		plugin.settings = {};

		plugin.init = function () {
			plugin.settings = $.extend({}, defaults, options);
			// dimmer
			if (plugin.settings.useDimmer) {
				if ($('#' + plugin.settings.prefix + 'dimmer').length === 0) {
					var dimmer_element = document.createElement('div');
					$(dimmer_element).attr('id', plugin.settings.prefix + 'dimmer');
					$(dimmer_element).hide();
					$(document.body).prepend(dimmer_element);
				}
			}
			// box element
			box_element = document.createElement('div');
			if (element.id !== undefined) {
				$(box_element).attr('id', plugin.settings.prefix + element.id);
			}
			$(box_element).addClass(plugin.settings.prefix + 'element options-hidden');
			$(box_element).css({
				padding:     $(element).css('padding'),
				'flex-grow': $(element).css('flex-grow'),
				position:    'relative'
			});
			if (parseInt($(element).css('width')) != 0) {
				$(box_element).css({
					width: $(element).css('width')
				});
			}
			if (plugin.settings.height === 'element') {
				$(box_element).css({
					height: $(element).outerHeight() + 'px'
				});
			}
			$(element).after(box_element);
			$(element).hide();
			// textlength element
			textlength_element = document.createElement('span');
			$(textlength_element).addClass(plugin.settings.prefix + 'textlength');
			$(textlength_element).css({
				position:   'absolute',
				visibility: 'hidden'
			});
			$(box_element).append(textlength_element);
			// tags element
			tags_element = document.createElement('div');
			$(tags_element).addClass(plugin.settings.prefix + 'tags');
			$(box_element).append(tags_element);

			keyval_wrap = document.createElement('span');
			$(keyval_wrap).addClass(plugin.settings.prefix + 'wrap');
			$(box_element).append(keyval_wrap);
			//key
			input_key = document.createElement('input');
			$(input_key).addClass(plugin.settings.prefix + 'input_key');
			$(input_key).width(40);
			$(input_key).attr("placeholder","key");
			$(input_key).attr('autocomplete', 'false');
			$(keyval_wrap).append(input_key);

			//冒号
			keyval_seperate = document.createElement('span');
			$(keyval_seperate).text(":");
			$(keyval_seperate).addClass(plugin.settings.prefix + 'keyval_seperate');
			$(keyval_wrap).append(keyval_seperate);

			//value
			input_value = document.createElement('input');
			$(input_value).addClass(plugin.settings.prefix + 'input_value');
			$(input_value).width(40);
			$(input_value).attr("placeholder","value");
			$(input_value).attr('autocomplete', 'false');
			$(keyval_wrap).append(input_value);

			// source element
			$(element).change(function () {
				refreshTags();
			});
			// box element
			$(box_element).bind('focus', function (e) {
				e.preventDefault();
				e.stopPropagation();
				$(input_key).focus();
			});

			$(box_element).bind('dblclick', function (e) {
				e.preventDefault();
				e.stopPropagation();
				input_key.focus();
				input_key.select();
			});

			$(input_key,input_value).bind('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
			});

			$(input_key).bind('dblclick', function (e) {
				e.preventDefault();
				e.stopPropagation();
			});

			$(input_value).bind('keydown', function (e) {
				e.stopPropagation();
				var keyCode = e.keyCode || e.which;
				switch (keyCode) {
					case key.up:
						input_key.focus();
						break;
					case key.down:
						e.preventDefault();
						break;
					case key.escape:
						e.preventDefault();
						break;
					case key.comma:
						e.preventDefault();
						if (selected_index === -1) {
							if ($(input_key).val() !== '') {
								addKeyVal($(input_key).val(),$(input_value).val());
							}
						}
						resizeInput(this);
						break;
					case key.enter:
						e.preventDefault();
						if (selected_index !== -1) {
							selectOption();
						} else {
							if ($(input_key).val() !== '') {
								addKeyVal($(input_key).val(),$(input_value).val());
							}
						}
						resizeInput(this);
						break;
					case key.backspace:
						if (input_key.value === '') {
							$(element).val($(element).val().substring(0, $(element).val().lastIndexOf(',')));
							$(element).trigger('change');
						}
						resizeInput(this);
						break;
					default:
						resizeInput(this);
						break;
				}
			});

			$(input_key).bind('keydown', function (e) {
				e.stopPropagation();
				var keyCode = e.keyCode || e.which;
				switch (keyCode) {
					case key.up:
						e.preventDefault();
						break;
					case key.down:
						e.preventDefault();
						input_value.focus();
						break;
					case key.escape:
						e.preventDefault();
						break;
					case key.comma:
						e.preventDefault();
						if (selected_index === -1) {
							if ($(input_key).val() !== '') {
								addKeyVal($(input_key).val(),$(input_value).val());
							}
						}
						resizeInput(this);
						break;
					case key.enter:
						e.preventDefault();
						if (selected_index !== -1) {
							selectOption();
						} else {
							if ($(input_key).val() !== '') {
								addKeyVal($(input_key).val(),$(input_value).val());
							}
						}
						resizeInput(this);
						break;
					case key.backspace:
						if (input_key.value === '') {
							$(element).val($(element).val().substring(0, $(element).val().lastIndexOf(',')));
							$(element).trigger('change');
						}
						resizeInput(this);
						break;
					default:
						resizeInput(this);
						break;
				}
			});

			$(input_key).bind('keyup', function (e) {
				e.preventDefault();
				e.stopPropagation();
				resizeInput(this);
			});

			$(input_value).bind('keyup', function (e) {
				e.preventDefault();
				e.stopPropagation();
				resizeInput(this);
			});


			$(input_key).bind('focus', function (e) {
				e.preventDefault();
				e.stopPropagation();
			});

			$(input_key).bind('blur', function (e) {
				e.preventDefault();
				e.stopPropagation();
			});
			refreshTags();
		};


		// 重置输入框大小
		var resizeInput = function (ele) {
			textlength_element.innerHTML = ele.value;
			$(ele).css({width: (Math.max(($(textlength_element).width() + 10),40)) + 'px'});
		};

		// REFRESH TAGS
		plugin.refresh = function () {
			refreshTags();
		};
		var refreshTags = function () {
			$(tags_element).empty();
			var selectedTags = $(element).val().split('|');
			$.each(selectedTags, function (i, key) {
				if (key !== '') {
					var _keyval = key.split(","),_key = _keyval[0],_val=_keyval[1];

					var tag_element = document.createElement('div');
					$(tag_element).addClass(plugin.settings.prefix + 'tag');
					$(tag_element).html(_val);
					// remove button
					var button_remove_element = document.createElement('div');
					$(button_remove_element).data('val',_val);
					$(button_remove_element).data('key',_key);
					$(button_remove_element).addClass(plugin.settings.prefix + 'tag_remove');
					$(button_remove_element).bind('mousedown', function (e) {
						e.preventDefault();
						e.stopPropagation();
					});
					$(button_remove_element).bind('mouseup', function (e) {
						e.preventDefault();
						e.stopPropagation();
						removeKeyVal($(this).data('key'));
						$(element).trigger('change');
					});
					$(button_remove_element).html('x');
					$(tag_element).append(button_remove_element);
					// clear
					var clear_element = document.createElement('div');
					clear_element.style.clear = 'both';
					$(tag_element).append(clear_element);

					$(tags_element).append(tag_element);
				}
			});
		};

		// REMOVE TAG FROM ORIGINAL ELEMENT
		var removeKeyVal = function (key) {
			var tagsBefore = $(element).val().split('|');
			var tagsAfter = [];
			$.each(tagsBefore, function (i, keyval) {
				var _keyval = keyval.split(",");
				if (_keyval[0] !== key && keyval !== '') {
					tagsAfter.push(keyval);
				}
			});
			$(element).val(tagsAfter.join('|'));
		};

		//检查是否存在标签
		var hasTag = function (key) {
			var selectedTags = $(element).val().split('|');
			var hasTag = false;
			$.each(selectedTags, function (i, keyval) {
				var _keyval = keyval.split(",");
				if ($.trim(key) === $.trim(_keyval[0])) {
					hasTag = true;
				}
			});
			return hasTag;
		};

		//检查是否存在值
		var isNotEmpty = function(val){
			if($.trim(val) !== ""){
				return true;
			}
			return false
		}

		// 增加标签
		var addKeyVal = function (key,val) {
			if (!hasTag(key) && isNotEmpty(val)) {
				$(element).val($(element).val() + ($(element).val() !== '' ? '|' : '') + (key+","+val));
				$(element).trigger('change');
			}
			$(input_key).val('');
			$(input_value).val('');
			input_key.focus();
		};

		// 销毁
		plugin.destroy = function () {
			$(box_element).remove();
			$.removeData(element, 'keyval');
			$(element).show();
			if ($('.keyValCouple').length === 0) {
				$('#' + plugin.settings.prefix + 'dimmer').remove();
			}
		};

		// 初始化
		plugin.init();
	};

	$.fn.keyValCouple = function () {
		var parameters = arguments[0] !== undefined ? arguments : [{}];
		return this.each(function () {
			if (typeof(parameters[0]) === 'object') {
				if (undefined === $(this).data('keyval')) {
					var plugin = new $.keyValCouple(this, parameters[0]);
					$(this).data('keyval', plugin);
				}
			} else if ($(this).data('keyval')[parameters[0]]) {
				$(this).data('keyval')[parameters[0]].apply(this, Array.prototype.slice.call(parameters, 1));
			} else {
				$.error('Method ' + parameters[0] + ' does not exist in $.keyValCouple');
			}
		});
	};

	$(function () {
		$('[data-toggle="keyvalcouple"]').each(function () {
			var $this = $(this);
			var options = {};
			$.each($this.data(), function (key, value) {
				if (key.substring(0,7) == 'keyval') {
					var value_temp = value.toString().replace(/'/g, '"');
					value_temp = $.parseJSON(value_temp);
					if (typeof value_temp == 'object') {
						value = value_temp;
					}
					options[key.substring(7,8).toLowerCase() + key.substring(8)] = value;
				}
			});
			$this.keyValCouple(options);
		});
	});
}(jQuery));



