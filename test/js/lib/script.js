// 剧本

define(['jquery', 'swiper', 'weixin', 'createjs'], function ($, swiper, wx) {
    var self = {}

    self.open = function () {

        var result = '屏幕宽：' + $(document).width() +
                    '<br>屏幕高：' + $(document).height();

        $('.b1').html(result);

        $(window).resize(function () {
            var x = '屏幕宽：' + $(document).width() +
                        '<br>屏幕高：' + $(document).height();

            $('.b1').html(x);
        });
    }

    return self;
});





















