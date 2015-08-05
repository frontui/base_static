/*!
 * Notify ֪ͨ
 * tommyshao <jinhong.shao@frontpay.cn>
 * Reference uikit.notify.js
 * API:
 *      $.notify({
 *          message: '',
 *          status:['success', 'warning', 'danger'],
 *          group: false,
 *          pos: 'top-center',
 *          opacity: .85,
 *          timeout: 5000,
 *          onClose: function(){}
 *      });
 */

+(function($) {
    'use strict';

    // ��ŷ�λ����
    var containers = {};
    //  ֪ͨ����
    var messages = {};
    // �ӿڣ���չ$.notify
    var notify = function(options) {
        if(typeof options === 'string') {
            options = { message: options };
        }

        if(arguments[1]) {
            options = $.extend(options, typeof arguments[1] === 'string' ? { status: arguments[1]} : arguments[1]);
        }

        return (new Notify(options)).show();
    };
    // �ر����нӿ�
    var closeAll = function(group, instantly) {
        var id;

        if(group) {
            for(id in messages) {
                if(group === messages[id].group) messages[id].close(instantly)
            }
        } else {
            for(id in messages) { messages[id].close(instantly)}
        }
    };

    // ���캯��
    // ===============
    var Notify = function(options) {

        this.timeout = false;
        this.currentStatus = "";
        this.group = false;
        this.options = $.extend({}, Notify.DEFAULTS, options);

        // uuid ����Ψһid
        this.uuid = 'Notify_'+ Math.random().toString(36).substr(2);

        // ����Ԫ��
        this.$el = $([
            '<div class="notify-message">',
                '<a class="notify-close">&times;</a>',
                '<div></div>',
            '</div>'
        ].join('')).data('ui.notify', this);

        // ��������
        this.content(this.options.message);

        // ����״̬
        if(this.options.status) {
            this.$el.addClass('notify-message-'+ this.options.status);
            this.currentStatus = this.options.status;
        }

        // ����
        this.group = this.options.group;

        // ��Ϣ��uuid���
        messages[this.uuid] = this;

        // ��λ���
        if(!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="notify notify-'+ this.options.pos +'"></div>')
                                            .appendTo($('body'))
                                            .on('click', '.notify-message', function(){
                                                var message = $(this).data('ui.notify');
                                                message.$el.trigger('manualclose.ui.notify', [message]);
                                                message.close();
                                            });
        }
    };

    Notify.VERSION = '1.0.0';

    Notify.DEFAULTS = {
        message: "", // ��ʾ����
        status: "",  // ״̬����ʽ��ɫ
        opacity:.85, // ��͸����
        timeout: 5000, // ��ʱ�ӳ���ʧ
        group: null,   // �Ƿ����
        pos: "top-center", // ��λ
        onClose: function() {}  // �رմ����¼�
    };

    // Public Method
    // ===============
    /* ��ʾ */
    Notify.prototype.show = function(){
        if(this.$el.is(':visible')) return;

        var $this = this;

        // ��λ���Ԫ��
        containers[this.options.pos].show().prepend(this.$el);

        var marginbottom = parseInt(this.$el.css('margin-bottom'), 10);

        // ������ʾ
        this.$el.css({ opacity: 0, "margin-top": -1 * this.$el.outerHeight(), "margin-bottom": 0})
            .animate({opacity: this.options.opacity, "margin-top": 0, "margin-bottom": marginbottom}, function(){
                if($this.options.timeout) { // ��ʱ�ر�
                    var closefn = function(){ $this.close() };
                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.$el.hover(
                        function(){ clearTimeout($this.timeout)},
                        function(){ $this.timeout = setTimeout(closefn, $this.options.timeout)}
                    );
                }
            });

        return this;
    };

    /* �ر� */
    Notify.prototype.close = function(instanly){
        var $this = this,
            finalize = function(){
                $this.$el.remove();

                if(!containers[$this.options.pos].children().length) {
                    containers[$this.options.pos].hide();
                }

                $this.options.onClose.apply($this, []);
                $this.$el.trigger('close.ui.notify', [$this]);

                delete messages[$this.uuid];
            }

        if (this.timeout) clearTimeout(this.timeout);

        if( instanly ) {
            finalize();
        } else {
            this.$el.animate({opacity: 0, "margin-top": -1 * this.$el.outerHeight(), "margin-bottom": 0}, function(){
                finalize();
            })
        }
    };

    /* �������ݻ��ȡ */
    Notify.prototype.content = function(html){
        var container = this.$el.find('>div');

        if(!html) {
            return container.html();
        }

        container.html(html);

        return this;
    };

    /* ����״̬����ʽ */
    Notify.prototype.status = function(status) {
          if(!status) {
              return this.currentStatus;
          }

        this.$el.removeClass('nofity-message-'+ this.currentStatus).addClass('notify-message-'+ status);

        this.currentStatus = status;

        return this;
    };


    // �������
    //======================
    function Plugin(option) {
        return $(this).on('click', function(){
            option = typeof option === 'string' ?  { message: option } : option;
            var data = new Notify(option);
            data.show();
        });
    }


    // jQuery �����չ
    $.notify = notify;
    $.notify.closeAll = closeAll;
    $.fn.notify = Plugin;
    $.fn.notify.Constructor = Notify;

})( jQuery );
