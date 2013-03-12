define(
    function(require) {
        var View = require('er/View');

        function BookListView() {
            View.apply(this, arguments);
        }

        function buyBook(e) {
            var isbn = $(e.target).closest('.book-info').attr('data-isbn');
            this.fire('buy', { isbn: isbn });
        }

        function search() {
            var keywords = document.getElementById('keywords').value;
            this.fire('search', { keywords: keywords });
        }

        function flip(e) {
            var page = e.target.innerHTML;
            if (/(\+|\-)/.test(page)) {
                page = parseInt(page) + (RegExp.$1 === '+' ? 1 : -1);
                //如果模版里支持最简单的${page + 1} 这样的表达式就不会这样了。。。
            }
            this.fire('flip', { page: page });
        }

        BookListView.prototype.template = 'bookList';

        BookListView.prototype.enterDocument = function() {
            var container = $('#' + this.container);

            var util = require('er/util');
            $('#book-list').on('click', '.buy', util.bindFn(buyBook, this));
            $('#submit-search').on('click', util.bindFn(search, this));
            $('#list-page').on('click', ':not(.disable)', util.bindFn(flip, this));
        };

        BookListView.prototype.showBoughtTip = function(isbn) {
            var target = $('#link-to-cart > a');
            var targetOffset = target.offset();
            targetOffset.left += target.width() / 2;
            targetOffset.top += target.height() / 2;

            var image = $('#' + this.container)
                .find('.book-info[data-isbn="' + isbn + '"]')
                .find('.image > img');
            var startingOffset = image.offset();
            var helper = image.clone()
                .css('position', 'absolute')
                .css('z-index', 999)
                .css('top', startingOffset.top)
                .css('left', startingOffset.left)
                .appendTo('body');
            var animationProperties = {
                top: targetOffset.top,
                left: targetOffset.left,
                width: 0,
                height: 0,
                opacity: 0
            };
            helper.animate(animationProperties, 1000)
                .promise()
                .done(function() { $(this).remove(); });
        };

        require('er/util').inherits(BookListView, View);

        return BookListView;
    }
);