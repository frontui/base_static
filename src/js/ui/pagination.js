/*!
 * ��ҳ|pagination
 * tommyshao <jinhong.shao@frontpay.cn>
 * Reference uikit.pagination.js
 * API:
 *      $(element).pagination({ onSelectPage: function(index, instance){});
 *
 *      $(element).on('ui.select.pagination', function(e, index, instance){
            console.log(index)
         })

        $(element).pagination({ onSelectPage: function(index, instance){});

        $(element).pagination('selectPage', 2, 100);
 */

+(function($) {
    'use strict';

    // Ĭ�ϸ�����
    var active = 'active';

    // ���캯��
    // ===============
    var Pagination = function(element, options) {
        this.$el = $(element);
        this._setOption(options);
        this._init();
    };

    // �汾
    Pagination.VERSION = '1.0.0';
    Pagination.DEFAULTS = {
        // �ܼ�¼��
        items: 1,
        // ÿҳ��¼��
        itemsOnPage: 1,
        // ��ҳ��
        pages: 100,
        // ֻ��ʾҳ������
        displayedPages: 8,
        // ��ĩҳ��ʾ����ҳ��
        edges: 1,
        // ��ǰҳ
        currentPage: 1,
        lblPrev: '\u4e0a\u4e00\u9875', //��һҳ
        lblNext: '\u4e0b\u4e00\u9875', //��һҳ
        // ѡ�д����¼�
        onSelectPage: function(){}
    };

    // ��ʼ��
    // =================
    Pagination.prototype._init = function() {
        var $this = this;

        // ��ҳ��
        $this.pages = $this.options.pages ? $this.options.pages : Math.ceil($this.options.items / this.options.itemsOnPage) ? Math.ceil($this.options.items / $this.options.itemsOnPage) : 1;

        // ��ǰҳ����0��ʼ
        $this.currentPage = $this.options.currentPage -1;
        // ҳ�������һ��
        $this.halfDisplayed = $this.options.displayedPages / 2;

        // �󶨵���л�ҳ��
        $this.$el.on('click', 'a[data-page]', function(e) {
            e.preventDefault();
            $this.selectPage($(this).data('page'));
        });

        // dom ��Ⱦ
        $this._render();
    };

    // ˽�з���
    // ��������
    Pagination.prototype._setOption = function(options){
        this.options = $.extend({}, Pagination.DEFAULTS, options);
    };

    // �л�ҳ��
    Pagination.prototype.selectPage = function(pageIndex, pages) {
        // �л�������ҳ
        this.currentPage = pageIndex - 1;
        // ������Ⱦdom
        this.render(pages);

        // �����л�ѡ����
        this.options.onSelectPage(pageIndex, this);
        // ����api�ӿ�
        this.$el.trigger('ui.select.pagination', [pageIndex, this]);
    };

    Pagination.prototype._render  = function(){
        var o = this.options, interval = this._getInterval(), i;
        // ���dom
        this.$el.empty();

        // ��һҳ,falseʱ����ʾ����ǰҳ-1��textΪ��ʾ���֣�trueΪ�Զ���label
        if(o.lblPrev) this._append(o.currentPage - 1, { text: o.lblPrev}, true);


        // �����ҳ��ʾ��Եҳ��
        if(interval.start > 0 && o.edges > 0) { // ��ʾĩҳ
            var end = Math.min(o.edges, interval.start);
            for(i = 0; i < end; i++) this._append(i);

            if(o.edges < interval.start && (interval.start - o.edges != 1)) {
                this.$el.append('<li><span>...</span></li>')
            } else if( interval.start - o.edges == 1) {
                this._append(o.edges);
            }
        }

        // ��ʾ (��ǰҳ-4, ��ǰҳ�� ��ǰҳ+4)
        for(i = interval.start; i < interval.end; i++) this._append(i);

        // �ұ�ĩҳ��ʾ��Եҳ��
        if(interval.end < this.pages && o.edges > 0) {
            if(this.pages - o.edges > interval.end && (this.pages - o.edges - interval.end != 1)) {
                this.$el.append('<li><span>...</span></li>')
            } else if ( this.pages - o.edges - interval.end == 1) {
                this._append(interval.end++);
            }

            var begin = Math.max(this.pages - o.edges, interval.end);

            for(i = begin; i < this.pages; i++) this._append(i);
        }

        // ��һҳ,falseʱ����ʾ����ǰҳ+1��textΪ��ʾ���֣�trueΪ�Զ���label
        if(o.lblNext) this._append(o.currentPage+1, {text: o.lblNext}, true);
    };

    // ������Ⱦ,�ⲿ�ӿ�
    Pagination.prototype.render = function(pages){
        this.pages = pages ? pages: this.pages;
        this._render();
    };

    // ��ȡ��ʾҳ�뷶Χ
    Pagination.prototype._getInterval = function(){
        return {
            start: Math.ceil(
                // ��ǰҳ�Ƿ������ʾ��Χ��һ��
                this.currentPage > this.halfDisplayed
                ? Math.max(
                    // �ӵ�ǰҳ-��ʾһ�뷶Χ��ʼ
                    Math.min(this.currentPage - this.halfDisplayed, (this.pages - this.options.displayedPages))
                    // ��ǰҳС��һ������ҳ��С����ʾ��Χ���ӵ�һҳ��ʼ
                    , 0)
                // �ӵ�һҳ��ʼ
                : 0),
            end: Math.ceil(
                // ��ǰҳ�Ƿ������ʾ��Χ��һ��
                this.currentPage > this.halfDisplayed
                    // ��ǰҳ+��ʾ��Χ��һ��
                    ? Math.min(this.currentPage + this.halfDisplayed, this.pages)
                    // ����Ϊ�����ʾ��ĩҳ
                    : Math.min(this.options.displayedPages, this.pages))
        }
    };

    // ������֯dom�ṹ
    // pageIndex ��Ⱦҳ��
    // opts �ı�����
    // islb �Ƿ���һҳ��һҳ����������active
    Pagination.prototype._append = function(pageIndex, opts, islb) {
        var $this = this, item, link, options;

        // �ж���ҳ��ĩҳ������ҳ
        pageIndex = pageIndex < 0 ? 0: (pageIndex < this.pages ? pageIndex : this.pages -1);
        options = $.extend({ text: pageIndex + 1}, opts);

        // �жϵ�ǰҳ��ǵ�ǰҳ
        item = (pageIndex == this.currentPage) ? '<li '+ (islb ? '' : 'class="'+ active +'"') +'><a href="###">'+ (options.text) +'</a></li>' : '<li><a href="#page-'+ (pageIndex + 1) +'" data-page="'+ (pageIndex + 1) +'">'+ options.text +'</a></li>';

        $this.$el.append(item);
    };

    // �������
    //======================
    function Plugin(options) {
        var args = arguments;
        return $(this).each(function () {
            var $this = $(this);
            var data = $this.data('ui.pagination');

            if(!data) $this.data('ui.pagination', (data = new Pagination($this, options)));

            if(typeof options == 'string') { // ���ýӿڷ���
                data[options].apply(data, [].slice.call(args, 1));
            }
        })
    }

    // jQuery �����չ
    $.fn.pagination = Plugin;
    $.fn.pagination.Constructor = Pagination;

    // Ԫ�ز����
    // ====================
    $(document).ready(function(){
        $('[ui-pagination],.pagination').pagination();
    })
})(jQuery);
