/*!
 * accordion �ַ���
 * ������ ui/switcher.js
 * tommyshao <jinhong.shao@frontpay.cn>
 * API:
 *
 */

+(function($) {
    'use strict';

    $.fn.accordion = function(option){
        var defaults = {
            item: 'li',
            target: '>div',
            active: 'active',
            except: false
        };

        option = $.extend({}, defaults, option);

        // ֱ�ӵ���
        $(this).switcher(option);

        // �¼�����
        return $(this).each(function(){
            var $items = $(this).find(option.item);
            $(this).on('select.ui.switcher', function(e){
                var $this = $(e.relatedTarget), has = $this.hasClass(option.active), $actived = $items.find(option.target), $target = $this.find(option.target);
                !!!(option.except) && $actived.slideUp();
                $target.stop()[!has ? 'slideUp': 'slideDown']();

                e.stopPropagation();
                e.preventDefault();
            });
        });
    };

})( jQuery );

