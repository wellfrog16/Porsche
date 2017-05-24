// 剧本

define(['jquery', 'swiper', 'weixin', 'createjs'], function ($, swiper, wx) {
    var self = {}

    self.open = function () {

        //var mySwiper = new Swiper('.swiper-container', {
        //    freeMode: true,
        //    freeModeSticky: true,
        //    direction: 'vertical',
        //});



        //var mySwiper = new Swiper('#swiper-container1', {
        //    freeMode: true,
        //})
        //var mySwiper2 = new Swiper('#swiper-container2', {
        //    freeMode: true,
        //    freeModeSticky: true,
        //})
        var mySwiper3 = new Swiper('#swiper-container3', {
            direction: 'vertical',
            freeModeMomentumRatio: 0.3,
            slidesPerView: 9,
            freeMode: true,
            freeModeSticky: true,
            centeredSlides: true,
            mousewheelControl: true,
            watchSlidesProgress: true,
            //effect:'cube',
            //loop:true,
            onInit: function (swiper) {
                swiper.removeSlide(0);
                var s = new Array();
                for (i = 0; i < 24; i++) {
                    if (i.toString().length == 1) { t = '0' + i } else { t = i; };
                    s[i] = '<div class="swiper-slide">' + t + '</div>';
                }
                swiper.appendSlide(s);
                swiper.appendSlide(s);
                swiper.appendSlide(s);
                swiper.appendSlide(s);
                swiper.appendSlide(s);
                swiper.update();
                swiper.slideTo(48 + new Date().getHours(), 0);
            },
            onSlideChangeEnd: function (swiper) {
                if (swiper.activeIndex > 72 || swiper.activeIndex < 48) {
                    swiper.slideTo(48 + swiper.activeIndex % 24, 0);
                }

                $('ul li').removeClass('highlight');
                $('ul li').eq((swiper.activeIndex + 1) % 24).addClass('highlight');
                console.log((swiper.activeIndex + 1) % 24);

            }, onTransitionEnd: function (swiper) {
                if (swiper.activeIndex > 72 || swiper.activeIndex < 48) {
                    swiper.slideTo(48 + swiper.activeIndex % 24, 0);
                }

                $('ul li').removeClass('highlight');
                $('ul li').eq((swiper.activeIndex + 1) % 24).addClass('highlight');
                console.log((swiper.activeIndex + 1) % 24);
            }, onTouchStart: function (swiper, even) {
                if (swiper.activeIndex > 72 || swiper.activeIndex < 48) {
                    swiper.slideTo(48 + swiper.activeIndex % 24, 0);
                }
            }, onSlideChangeStart: function (swiper) {
                //console.log(swiper.activeIndex);
            }, onProgress: function (swiper, progress) {
                //console.log(progress);
                //console.log(swiper.activeIndex);
            }, onSetTransition: function (swiper) {
                //console.log(swiper.activeIndex);
            }, onScroll: function (swiper) {
                console.log(swiper.activeIndex);
            }
        });

        //------------------------------------------------
        var address = {
            '亚洲': {
                '中国': ['北京', '上海', '广州', '深圳'],
                '韩国': ['首尔', '济州岛']
            },
            '欧洲': {
                '英国': ['伦敦', '爱尔兰']
            },
            '北美洲': {
                '美国': ['纽约', '硅谷', '西雅图'],
                '加拿大': ['多伦多']
            },
            '亚洲1': {
                '中国': ['北京', '上海', '广州', '深圳'],
                '韩国': ['首尔', '济州岛']
            },
            '欧洲2': {
                '英国': ['伦敦', '爱尔兰'],
                '法国': ['巴黎', '爱尔兰']
            },
            '北美洲2': {
                '美国': ['纽约', '硅谷', '西雅图'],
                '加拿大': ['多伦多']
            }
        }

        var arr1 = [
            {
                n: '亚洲', m: [
                    { n: '中国', m: ['北京', '上海', '广州', '深圳'] },
                    { n: '韩国', m: ['首尔', '济州岛'] }
                ]
            },

            {
                n: '欧洲', m: [
                    { n: '英国', m: ['伦敦', '爱尔兰'] }
                ]
            },

            {
                n: '北美洲', m: [
                    { n: '美国', m: ['纽约', '硅谷', '西雅图'] },
                    { n: '加拿大', m: ['多伦多'] }
                ]
            },

            {
                n: '亚洲2', m: [
                    { n: '中国2', m: ['北京2', '上海2', '广州2', '深圳2'] },
                    { n: '韩国2', m: ['首尔2', '济州岛2'] }
                ]
            },

            {
                n: '欧洲2', m: [
                    { n: '英国2', m: ['伦敦2', '爱尔兰2'] }
                ]
            },

            {
                n: '北美洲2', m: [
                    { n: '美国2', m: ['纽约2', '硅谷2', '西雅图2'] },
                    { n: '加拿大2', m: ['多伦多2'] }
                ]
            },
        ];

        var indexA = 0, indexB = 0; indexC = 0;


        var mySwiperA = new Swiper('#swiper-container5', {
            direction: 'vertical',
            //freeModeMomentumBounce: false,
            freeModeMomentumRatio:0.3,
            slidesPerView: 5,
            freeMode: true,
            freeModeSticky: true,
            centeredSlides: true,
            mousewheelControl: true,
            //loop: true,
            //watchSlidesProgress: true,
            onInit: function (swiper) {
                $.each(arr1, function (index, item) {
                    swiper.appendSlide('<div class="swiper-slide">' + item.n + '</div>');
                    //console.log(item)
                })

                swiper.update();
            },
            onSlideChangeEnd: function (swiper) {

                //console.log(swiper.activeIndex);
            },
            onTransitionEnd: function (swiper) {

                //if (indexA != swiper.activeIndex) {
                //    indexA = swiper.activeIndex;
                //}

                indexA = swiper.activeIndex;

                mySwiperB.removeAllSlides();

                $.each(arr1[swiper.activeIndex].m, function (index, item) {
                    mySwiperB.appendSlide('<div class="swiper-slide">' + item.n + '</div>');
                });

                mySwiperB.update();

                mySwiperC.removeAllSlides();

                $.each(arr1[swiper.activeIndex].m[0].m, function (index, item) {
                    mySwiperC.appendSlide('<div class="swiper-slide">' + item + '</div>');
                })

                mySwiperC.update();

                //console.log(swiper.activeIndex);
            }

        });

        var mySwiperB = new Swiper('#swiper-container6', {
            direction: 'vertical',
            //freeModeMomentumBounce: false,
            freeModeMomentumRatio: 0.3,
            slidesPerView: 5,
            freeMode: true,
            freeModeSticky: true,
            centeredSlides: true,
            mousewheelControl: true,
            //loop: true,
            //watchSlidesProgress: true,
            onInit: function (swiper) {
                $.each(arr1[0].m, function (index, item) {
                    swiper.appendSlide('<div class="swiper-slide">' + item.n + '</div>');
                })

                swiper.update();
            },
            onSlideChangeEnd: function (swiper) {

                //console.log(swiper.activeIndex);
            },
            onTransitionEnd: function (swiper) {

                //if (indexB != swiper.activeIndex) {
                //    indexB = swiper.activeIndex;
                //}
                indexB = swiper.activeIndex;

                mySwiperC.removeAllSlides();

                $.each(arr1[indexA].m[swiper.activeIndex].m, function (index, item) {
                    mySwiperC.appendSlide('<div class="swiper-slide">' + item + '</div>');
                })

                mySwiperC.update();

                //console.log(swiper.activeIndex);
            }
        });

        var mySwiperC = new Swiper('#swiper-container7', {
            direction: 'vertical',
            //freeModeMomentumBounce: false,
            freeModeMomentumRatio: 0.3,
            slidesPerView: 5,
            freeMode: true,
            freeModeSticky: true,
            centeredSlides: true,
            mousewheelControl: true,
            //loop: true,
            //watchSlidesProgress: true,
            onInit: function (swiper) {

                $.each(arr1[0].m[0].m, function (index, item) {
                    swiper.appendSlide('<div class="swiper-slide">' + item + '</div>');
                })

                swiper.update();
            },
            onSlideChangeEnd: function (swiper) {

                //console.log(swiper.activeIndex);
            },
            onTransitionEnd: function (swiper) {

                if (indexC != swiper.activeIndex) {
                    indexC = swiper.activeIndex;
                }

                console.log(swiper.activeIndex);
            }
        });


        //setInterval(function () {
        //    console.log(mySwiper3.activeIndex)
        //},50)

    }

    return self;
});





















