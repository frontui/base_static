/*!
 * smooth-scroll ƽ������
 * tommyshao <jinhong.shao@frontpay.cn>
 * Reference uikit.smoothscroll.js
 * API:
 *      $(element).placeholder();
 */

+(function($) {
    'use strict';

    if(!$.easing.easeOutExpo) $.easing.easeOutExpo = function(x, t, b, c, d) { return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b; };

    // ���캯��
    // ===============
    var SmoothScroll = function(element, options) {
        this.$el = $(element);
        this.options = options;
        this.init();
    };

    SmoothScroll.VERSION = '1.0.0';

    /**
     * Ĭ�����ò���
     * @param duration ����ʱ��
     * @param transition ��������
     * @param offset ����Ŀ��λ��
     * @param complete ����λ��ʱ���ִ��
     * @type {{duration: number, transition: string, offset: number, complete: (*|number|noop|Function)}}
     */
    SmoothScroll.DEFAULTS = {
        duration: 500,
        transition: 'easeOutExpo',
        offset: 0,
        complete: $.noop
    };

    /**
     * init ��ʼ��
     */
    SmoothScroll.prototype.init = function(){
        this.$el.on('click.ui.smoothScroll', this.scroll(this.$el, this.options));
    };



    /**
     * ����
     * @param options
     * @returns {Function}
     */
    SmoothScroll.prototype.scroll = function(elem, options) {
        return function(e) {
            e.preventDefault();
            scrollToElement(elem, $(this.hash).length ? $(this.hash) : $("body"), options);
        }
    };

    /**
     * ��ɴ���
     */
    function emit(elem){
        return function(){
            var e = $.Event('done.ui.smoothscroll', {relatedTarget: elem});
            elem.trigger(e);
        }
    };

    /**
     * ��������ת��ĳԪ��
     * @param elem Ŀ��Ԫ��
     * @param options ���ò���
     */
    function scrollToElement(elem, targetElement, options) {
        options = $.extend({}, SmoothScroll.DEFAULTS, options);

        var target = targetElement.offset().top - options.offset,
            docH = $(document).height(),
            winH = $(window).height();

        if((target + winH) > docH) {
            target = docH - winH;
        }

        $('html,body')
            .stop()
            .animate({ scrollTop: target}, options.duration, options.transition)
            .promise()
            .done([options.complete, emit(elem)]);
    }



    // �������
    //======================
    function Plugin(options) {
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.smoothScroll');
            if(!data){
                $this.data('ui.smoothScroll', (new SmoothScroll(this, options)));
            } else {
                $this.trigger('click.ui.smoothScroll');
            }
        })
    }


    // jQuery �����չ
    $.fn.smoothScroll = Plugin;
    $.fn.smoothScroll.Constructor = SmoothScroll;

    $(document).ready(function(){ $('[data-toggle="smooth-scroll"]').smoothScroll() })

})( jQuery );

