// 剧本

define(['jquery', 'swiper', 'weixin', 'tools', 'createjs'], function ($, swiper, wx, tools) {
    var self = {}

    self.host = 'http://www.porsche-cnmkt.com/app189/'

    self.open = function () {
        // 如果是手机端，加载横屏提示
        if (!tools.isPC) {
            $('body').append(self.template.block);
        }

        $('body,html').height(document.body.clientHeight);

        // loading界面
        self.preload();
    }

    self.preload = function () {
        var loader = new createjs.LoadQueue(false);

        // 关键！----设置并发数  
        loader.setMaxConnections(5);
        // 关键！---一定要将其设置为 true, 否则不起作用。  
        loader.maintainScriptOrder = true;

        var source = [
          { 'src': 'main/index-1.jpg' },
        ]

        loader.on("complete", onComplete);
        loader.loadManifest(source, true, 'img/');

        function onComplete() {
            $('body').append(self.template.loading);

            self.load();
        }
    }

    self.load = function () {
        var loader = new createjs.LoadQueue(false);

        // 关键！----设置并发数  
        loader.setMaxConnections(5);
        // 关键！---一定要将其设置为 true, 否则不起作用。  
        loader.maintainScriptOrder = true;

        var source = [
          { 'src': 'main/form-bg.jpg' },
          { 'src': 'main/index-1.jpg' },
          { 'src': 'main/index-2.jpg' },
          { 'src': 'main/landscape.png' },
          { 'src': 'main/method.png' },
          { 'src': 'main/movie-home.jpg' },
          { 'src': 'main/movie.jpg' },
          { 'src': 'main/movie.png' },
          { 'src': 'main/movie2.jpg' },
          { 'src': 'main/shadow.png' },
          { 'src': 'main/swiper-bg1.png' },
          { 'src': 'main/title-bg.png' },
          { 'src': 'main/view.jpg' },
          { 'src': 'main/word.png' }
        ]

        loader.on("progress", onProgress);
        loader.on("complete", onComplete);
        loader.loadManifest(source, true, 'img/');


        function onComplete(e) {

            self.share('');

            //form.open();
            self.initPageSwiper();

        }

        function onProgress(e) {
            //console.log(loader.progress);
            $('.loading span').text((loader.progress * 100 | 0) + " %");
        }
    }

    self.currentSwiper = 'theme';
    self.lastSecondSwiper = '';

    self.pageSwiper = null;
    self.mainSwiper = null;

    self.themeSwiper = null;
    self.themeIndex = 0;

    self.lvxingSwiper = null;
    self.lvxingIndex = 0;

    var theme = 0, record = 0, customKey = 0;

    var custom = false, flagCity = false;

    var timer = null;

    //------------------------

    var step = 0;


    self.initPageSwiper = function () {

        $('body').append(self.template.pageSwiper);

        tools.fixPosition(640);

        var x = document.documentElement.clientWidth * -1, y = 1;
        setInterval(function () {
            
            $('.scene-main').css('background-position-x', (x * y) + 'px')
            y++;

            if (y > 4) { y = 0 }
        }, 200)

        var a = document.documentElement.clientWidth * -1, b = 1;
        setInterval(function () {

            $('.scene-index1').css('background-position-x', (a * b) + 'px')
            b++;
            if (b > 3) { b = 0 }
        }, 200)


        // 
        $('.swiper-box').css('top', (document.documentElement.clientWidth / 640) * 484);

        // 主体swiper 初始化
        self.pageSwiper = new swiper('#pageSwiper', {
            direction: 'vertical',
            width: window.innerWidth,
            height: window.innerHeight,
            onInit: function (sw) { initMainSwiper(sw); },
            onTransitionEnd: function (swiper) {

                if (swiper.activeIndex == 2) {
                    swiper.lockSwipes();
                }

            }
        });

        // 选择3D翻页swiper
        function initMainSwiper(sw) {
            self.mainSwiper = new swiper('#mainSwiper', {
                effect: 'cube',
                speed: 500,
                loop: false,
                onlyExternal: true,
                onInit: function (swiper) { initThemeSwiper(sw); },
                onTransitionEnd: function (swiper) {
                    swiper.activeIndex > swiper.previousIndex ? step++ : step--;

                    // 
                    if (step == 0) { slogan.clear(); }

                    // 自动更新宣言
                    if (step == 1) { slogan.update(); }

                    //
                }
            });
        }

        //previousIndex

        // 主题swiper
        function initThemeSwiper(sw) {
            self.themeSwiper = new swiper('#themeSwiper', {
                direction: 'vertical',
                freeModeMomentumRatio: 0.2,
                slidesPerView: 3,
                freeMode: true,
                freeModeSticky: true,
                centeredSlides: true,
                slideToClickedSlide: true,
                loop: true,
                loopAdditionalSlides: slogan.table.slogan.length,
                onInit: function (swiper) {

                    // 更新数据
                    $.each(slogan.table.slogan, function (index, item) {
                        swiper.appendSlide('<div class="swiper-slide">' + item.name + '</div>');
                    })

                    swiper.update();

                    swiper.slideTo(slogan.table.slogan.length);

                    // 第一个默认高亮
                    $('#themeSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');

                    // 动作绑定
                    self.bindAction();

                    // 初始化完成隐藏loading
                    $('.loading').fadeOut();

                    // 调试直接显示第三页
                    // sw.slideTo(2);
                },
                onTransitionStart: function () {
                    $('#themeSwiper .highlight').removeClass('highlight');
                },
                onTransitionEnd: function (swiper) {
                    $('.themeSwiper li').removeClass('highlight').eq(swiper.realIndex).addClass('highlight');
                    $('#themeSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');

                    slogan.selected.first = swiper.realIndex;
                    theme = swiper.realIndex;
                }
            });
        }

        //-----
    }

    //var 


    self.bindAction = function () {
        $('.scene-main .next').hammer().on("tap", function (e) {

            var flagForm = true;
            if (step == 0) {

                switch (theme) {
                    case 8:
                        self.appendCustomTheme();

                        break;

                    default:
                        self.appendSecondCommon();
                        break;
                }

                flagForm = false;
                self.mainSwiper.slideNext();
            }

            if (step == 1) {
                
                if (theme == 0 && record > 0) {     // 城市选择
                    self.appendCity();
                }
                else if (theme == 2) {              // 生日祝福
                    form.open();
                    return;
                }
                else if (theme == 8) {
                    if ($('.customThemeSwiper input').val() != '') { custom = true; form.open(); }
                    return;
                }
                else {
                    self.appendThirdCommon();
                }

                flagForm = false;
                self.mainSwiper.slideNext();
            }

            if (step == 2 && customKey == 1) {

                self.appendCustomKey();

                flagForm = false;
                self.mainSwiper.slideNext();
            }
            
            if (flagForm) {
                console.log('------------------------------------');
                console.log(step)
                console.log(customKey)

                if (step == 3 && customKey == 1 && $('.customKeyText input').val() == '') { return; }
                if (step == 2 && $('.commonThirdSwiper .active').length == 0 && !flagCity) { return; }

                if ($('.customKeyText input').length > 0 && $('.customKeyText input').val() != '') { custom = true; }

                form.open();
            }


            //step++;
        });

        $('.scene-main .pre').hammer().on("tap", function (e) {

            if (step == 0) {
                self.pageSwiper.unlockSwipes();
                self.pageSwiper.slidePrev();

                return;
            }

            $('.customThemeText, .customKeyText').hide();
            $('.customThemeText input, .customKeyText input').val('');

            clearInterval(timer);

            custom = false;

            flagCity = false;

            if ($('.block').length == 0) {
                $('body').append(self.template.block);
            }

            self.mainSwiper.slidePrev();
            //step--;
        });
    }


    self.appendSecondCommon = function () {
        self.mainSwiper.removeSlide([1, 2, 3]);
        self.mainSwiper.appendSlide(self.template.commonSecondSwiper);
        self.mainSwiper.update();

        //$('.commonSecondSwiper .header').text(slogan.data[theme].title);
        slogan.setTitle($('.commonSecondSwiper .header'));

        self.commonSecondSwiper = new swiper('#commonSecondSwiper', {
            direction: 'vertical',
            freeModeMomentumRatio: 0.2,
            slidesPerView: 3,
            freeMode: true,
            freeModeSticky: true,
            centeredSlides: true,
            //loop: true,
            //loopAdditionalSlides: slogan.data[theme].m.length,
            onInit: function (swiper) {
                // 更新数据
                $.each(slogan.table.slogan[slogan.selected.first].list, function (index, item) {
                    swiper.appendSlide('<div class="swiper-slide">' + item.name.replace(/　　/g, '<span></span>') + '</div>');
                })

                swiper.update();

                //swiper.slideTo(0);
                $('#commonSecondSwiper .swiper-slide').eq(0).addClass('highlight');
                //$('.declaration').html(slogan.data[theme].m[0].n);

                

                //$('.declaration').arctext({ radius: 400 });
            },
            onTransitionStart: function (swiper) {
                $('#commonSecondSwiper .highlight').removeClass('highlight');

            },
            onTransitionEnd: function (swiper) {
                $('#commonSecondSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');


                //var text = $('<div id="qq">' + slogan.data[theme].m[swiper.realIndex].n + '</div>')

                //$('.declaration').html(slogan.data[theme].m[swiper.realIndex].n).arctext({ radius: 400 });
                //$('.declaration').html(text);

                //$('#qq').arctext({ radius: 1000 });
                
                
                slogan.selected.second = swiper.realIndex;
                slogan.update();
                record = swiper.realIndex;
            }
        });
    }

    self.appendThirdCommon = function () {

        self.mainSwiper.removeSlide([2, 3]);
        self.mainSwiper.appendSlide(self.template.commonThirdSwiper);
        self.mainSwiper.update();

        $.each(slogan.table.slogan[slogan.selected.first].list[slogan.selected.second].key, function (index, item) {
            $('.commonThirdSwiper ul').append('<li><span>' + item + '</span></li>');
        })

        $('.commonThirdSwiper ul').append('<li><span>自定义</span></li>');

        $('.commonThirdSwiper ul li').each(function (index) {
            $(this).hammer().on("tap", function (e) {
                $('.commonThirdSwiper ul li span').removeClass('active');
                $('span', $(this)).addClass('active');

                slogan.selected.third = index;
                slogan.update();

                //var declaration = $('.declaration').text();

                var text = $('span', $(this)).text()

                customKey = text == '自定义' ? 1 : 0;

                //if (text != '自定义') {
                //    $('.declaration span').text(text);
                //    $('.declaration span').addClass('active');
                //}
                //else {
                //    $('.declaration span').text('');
                //    $('.declaration span').removeClass('active');
                //}

            });
        })
    }

    self.appendCity = function () {
        self.mainSwiper.removeSlide([2, 3]);
        self.mainSwiper.appendSlide(self.template.citySwiper);
        self.mainSwiper.update();

        initRegion();

        flagCity = true;

        var regionIndex = 0, countryIndex = 0, cityIndex = 0;

        function initRegion() {
            self.regionSwiper = new swiper('#regionSwiper', {
                direction: 'vertical',
                freeModeMomentumRatio: 0.2,
                slidesPerView: 3,
                freeMode: true,
                freeModeSticky: true,
                centeredSlides: true,
                //loop: true,
                //loopAdditionalSlides: city.length,
                onInit: function (swiper) {
                    // 更新数据
                    $.each(slogan.table.city, function (index, item) {
                        swiper.appendSlide('<div class="swiper-slide">' + item.region + '</div>');
                    })

                    swiper.update();

                    swiper.slideTo(1);
                    //$('#regionSwiper .swiper-slide').eq(0).addClass('highlight');

                    $('.declaration span').text('三亚');
                    $('.declaration span').addClass('active');

                    initCountry();

                },
                onTransitionStart: function (swiper) {
                    $('#regionSwiper .highlight').removeClass('highlight');

                },
                onTransitionEnd: function (swiper) {
                    $('#regionSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');


                    if (regionIndex != swiper.realIndex) {
                        regionIndex = swiper.realIndex;

                        self.countrySwiper.removeAllSlides();

                        $.each(slogan.table.city[regionIndex].country, function (index, item) {
                            self.countrySwiper.appendSlide('<div class="swiper-slide">' + item.name + '</div>');
                        })

                        self.countrySwiper.update();

                        if ($('#countrySwiper .swiper-slide').length > 1) {
                            self.countrySwiper.slideTo(1)
                        }
                        else {
                            $('#countrySwiper .swiper-slide').eq(0).addClass('highlight');
                        }

                        // ---------
                        self.citySwiper.removeAllSlides();

                        $.each(slogan.table.city[regionIndex].country[0].city, function (index, item) {
                            self.citySwiper.appendSlide('<div class="swiper-slide">' + item + '</div>');
                        })

                        self.citySwiper.update();

                        if ($('#citySwiper .swiper-slide').length > 1) {
                            self.citySwiper.slideTo(1)
                        }
                        else {
                            $('#citySwiper .swiper-slide').eq(0).addClass('highlight');
                        }


                        var text = $(self.citySwiper.slides[0]).text();

                        $('.declaration span').text(text);
                        $('.declaration span').addClass('active');
                    }

                    //console.log(self.countrySwiper);
                    //$('.declaration').html(slogan.data[theme].m[swiper.realIndex].n);

                    //record = swiper.realIndex;
                    //console.log('record=' + record)
                }
            });
        }

        function initCountry() {
            self.countrySwiper = new swiper('#countrySwiper', {
                direction: 'vertical',
                freeModeMomentumRatio: 0.2,
                slidesPerView: 3,
                freeMode: true,
                freeModeSticky: true,
                centeredSlides: true,
                //loop: true,
                //loopAdditionalSlides: city.length,
                onInit: function (swiper) {
                    // 更新数据
                    $.each(slogan.table.city[0].country, function (index, item) {
                        swiper.appendSlide('<div class="swiper-slide">' + item.name + '</div>');
                    })

                    swiper.update();

                    //swiper.slideTo(city[0].country.length);
                    $('#countrySwiper .swiper-slide').eq(0).addClass('highlight');

                    initCity();

                },
                onTransitionStart: function (swiper) {
                    $('#countrySwiper .highlight').removeClass('highlight');

                },
                onTransitionEnd: function (swiper) {
                    $('#countrySwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');
                    //$('.declaration').html(slogan.data[theme].m[swiper.realIndex].n);

                    if (countryIndex != swiper.realIndex) {
                        countryIndex = swiper.realIndex;

                        // ---------
                        self.citySwiper.removeAllSlides();

                        $.each(slogan.table.city[regionIndex].country[countryIndex].city, function (index, item) {
                            self.citySwiper.appendSlide('<div class="swiper-slide">' + item + '</div>');
                        })

                        self.citySwiper.update();

                        if ($('#citySwiper .swiper-slide').length > 1) {
                            self.citySwiper.slideTo(1)
                        }
                        else {
                            $('#citySwiper .swiper-slide').eq(0).addClass('highlight');
                        }

                        var text = $(self.countrySwiper.slides[countryIndex]).text();

                        customKey = text == '其他' ? 1 : 0;

                        if (text != '其他') {
                            $('.declaration span').text(text);
                            $('.declaration span').addClass('active');
                        }
                        else {
                            $('.declaration span').text('');
                            $('.declaration span').removeClass('active');
                        }
                    }

                    //record = swiper.realIndex;
                    //console.log('record=' + record)
                }
            });
        }

        function initCity() {
            self.citySwiper = new swiper('#citySwiper', {
                direction: 'vertical',
                freeModeMomentumRatio: 0.2,
                slidesPerView: 3,
                freeMode: true,
                freeModeSticky: true,
                centeredSlides: true,
                //loop: true,
                //loopAdditionalSlides: city.length,
                onInit: function (swiper) {
                    // 更新数据
                    $.each(slogan.table.city[0].country[0].city, function (index, item) {
                        swiper.appendSlide('<div class="swiper-slide">' + item + '</div>');
                    })

                    swiper.update();

                    //swiper.slideTo(city[0].country.length);
                    $('#citySwiper .swiper-slide').eq(0).addClass('highlight');



                },
                onTransitionStart: function (swiper) {
                    $('#citySwiper .highlight').removeClass('highlight');

                },
                onTransitionEnd: function (swiper) {
                    $('#citySwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');

                    var text = $(self.citySwiper.slides[swiper.activeIndex]).text();

                    //$('.declaration span').text(text);
                    //$('.declaration span').addClass('active');
                    slogan.update(text);

                    //$('.declaration').html(slogan.data[theme].m[swiper.realIndex].n);

                    //record = swiper.realIndex;
                    //console.log('record=' + record)
                }
            });
        }
    }



    self.appendCustomKey = function () {
        self.mainSwiper.removeSlide([3]);
        self.mainSwiper.appendSlide(self.template.customKeySwiper);
        self.mainSwiper.update();

        $('.customKeyText').show();
        $('.block').remove();

        custom = true;

        timer = setInterval(function () {
            var text = $('.customKeyText input').val();

            if (text.length > 4) {
                $('.customKeyText .input div').text('不能超过4个字符').addClass('active')
            }
            else {
                $('.customKeyText .input div').text('最多只能输入4个字符').removeClass('active')
            }

            //if (text != '') {
            //    $('.declaration span').text(text.substring(0, 4));
            //    $('.declaration span').addClass('active');
            //}
            //else {
            //    $('.declaration span').text('');
            //    $('.declaration span').removeClass('active');
            //}

            slogan.update(text.substring(0, 4))

        }, 1000)
    }

    self.appendCustomTheme = function () {
        self.mainSwiper.removeSlide([1,2,3]);
        self.mainSwiper.appendSlide(self.template.customThemeSwiper);
        self.mainSwiper.update();

        $('.customThemeText').show();
        $('.block').remove();

        custom = true;

        timer = setInterval(function () {
            var text = $('.customThemeText input').val();

            if (text.length > 10) {
                $('.customThemeText .input div').text('不能超过10个字符').addClass('active')
            }
            else {
                $('.customThemeText .input div').text('最多只能输入10个字符').removeClass('active')
            }

            slogan.update(text.substring(0, 10))
        }, 1000)
    }


    self.template = {
        loading: '<div class="loading"><span></span></div>',
        block: '<div class="block"><img src="img/main/landscape.png" /><br /><span>竖屏浏览，体验更佳</span></div>',
        pageSwiper:
            '<div class="declaration declaration2 slogan jsfix" data-size="no"></div>\
            <div class="swiper-container" id="pageSwiper">\
                <div class="swiper-wrapper">\
                    <div class="swiper-slide scene-index1">\
                        <img src="img/main/shadow.png" class="shadow">\
                        <img src="img/main/word.png" class="word jsfix">\
                        <div class="arrow"><img src="img/icon/arrow.png"></div></div>\
                    <div class="swiper-slide scene-index2">\
                        <div class="arrow"><img src="img/icon/arrow.png"></div>\
                    </div>\
                    <div class="swiper-slide scene-main">\
                        <div class="swiper-box">\
                            <div class="swiper-container" id="mainSwiper">\
                                <div class="swiper-wrapper">\
                                    <div class="swiper-slide themeSwiper">\
                                        <div class="header">主题</div>\
                                        <ul class="indicator"><li class="highlight"></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>\
                                        <div class="swiper-container" id="themeSwiper">\
                                            <div class="swiper-wrapper"></div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="customKeyText"><div class="input"><input type="text"><div>最多只能输入4个字符</div></div></div>\
                            <div class="customThemeText"><div class="input"><input type="text"><div>最多只能输入10个字符</div></div></div>\
                        </div>\
                        <div class="pagination"><div class="pre button">上一步</div><div class="next button">下一步</div></div>\
                    </div>\
                </div>\
            </div>',
        lvxingSwiper:
            '<div class="swiper-slide lvxingSwiper">\
                <div class="header">宣言</div>\
                <div class="swiper-container" id="lvxingSwiper">\
                    <div class="swiper-wrapper"></div>\
                </div>\
            </div>',
        commonSecondSwiper:
            '<div class="swiper-slide commonSecondSwiper">\
                <div class="header">宣言</div>\
                <div class="swiper-container" id="commonSecondSwiper">\
                    <div class="swiper-wrapper"></div>\
                </div>\
            </div>',
        commonThirdSwiper:
            '<div class="swiper-slide commonThirdSwiper">\
                <div class="header">选择一个关键词</div>\
                <ul></ul>\
            </div>',
        citySwiper:
            '<div class="swiper-slide citySwiper">\
                <div class="header">选择梦想之地</div>\
                <div class="swiper-container" id="regionSwiper">\
                    <div class="swiper-wrapper"></div>\
                </div>\
                <div class="swiper-container" id="countrySwiper">\
                    <div class="swiper-wrapper"></div>\
                </div>\
                <div class="swiper-container" id="citySwiper">\
                    <div class="swiper-wrapper"></div>\
                </div>\
            </div>',
        customKeySwiper:
            '<div class="swiper-slide customKeySwiper">\
                <div class="header">打造专属霸屏</div>\
            </div>',
        customThemeSwiper:
            '<div class="swiper-slide customThemeSwiper">\
                <div class="header">打造专属霸屏</div>\
            </div>'
    }


    // 分享
    self.share = function (s) {

        $.ajax({
            type: 'post',
            url: 'https://api.happy-share.cn/jssdk/?url=' + encodeURIComponent(location.href.split('#')[0]),
            dataType: 'json',
            success: function (args) {
                ////////////
                args = args.data;

                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: args.appId, // 必填，公众号的唯一标识
                    timestamp: args.timestamp, // 必填，生成签名的时间戳
                    nonceStr: args.nonceStr, // 必填，生成签名的随机串
                    signature: args.signature,// 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wx.ready(function () {
                    var url = self.host + '?words=' + (s ? encodeURIComponent(s) : ''),
                        title = '定制你的未来宣言 驭见未来',
                        desc = s ? s : '定制你的未来宣言 驭见未来',
                        imgUrl = 'http://www.porsche-cnmkt.com/img/main/index-1.jpg';

                    wx.onMenuShareTimeline({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareQQ({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareWeibo({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareQZone({
                        title: title, // 分享标题
                        desc: desc, // 分享描述
                        link: url, // 分享链接
                        imgUrl: imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                });

                wx.error(function (res) {
                    console.log("wx has error:" + res);
                });
            }
        });
    }


    // 留资
    // ----------------------------------------------------
    var form = {}

    form.open = function(){

        if ($('#userFrom').length != 0) {
            $('#userFrom').show();
        }
        else {
            var formHtml = 
                '<div class="user-form" id="userForm">\
                    <h3>让保时捷<br />一眼锁定你</h3>\
                    <p></p>\
                    <ul>\
                        <li><span>您的姓名</span><i></i><input type="text" id="name" maxlength="10" ></li>\
                        <li><span>您的手机</span><i></i><input type="text" id="mobile" maxlength="11" value=""></li>\
                        <li><span>验证码　</span><i></i><input type="text" class="code" id="code" maxlength="4" ><a href="#" id="sendCode">发送<span></span></a></li>\
                        <li><span>您的车牌</span><i></i><input type="text" id="number" maxlength="14" ></li>\
                        <li><span>您的车型/品牌</span><input type="text" id="brand" maxlength="24" ></li>\
                    </ul>\
                    <div class="agree"><span></span>我已阅读并了解<a href="#">隐私条款</a></div>\
                    <div class="button"><div class="back">上一步</div><div class="submit">提交</div></div>\
                    <div class="rule"><div class="wrapper">\
                        <span><img src="img/icon/close.png"></span>\
                        <h3>隐私条款</h3>\
                        <p>保时捷集团或其代理机构可能会通过您提供的信息以及我们已经存储的关于您的信息联系您，包括通过邮件、电话、短消息或者传真的形式，向您介绍有关保时捷的产品和我们提供的服务信息。我们可能会在一段合理的时间内保存您的信息，以便向您提供与我们的产品和服务有关的介绍、邀请函或资讯。 </p>\
                    </div></div>\
                    <div class="result"><div class="wrapper">\
                        <div class="text">姓名不能为空</div>\
                        <div class="button"><div>确定</div>\</div>\
                    </div></div>\
                    <div class="finished">\
                        <div class="button">提交成功</div>\
                    </div>\
                    <div class="shareview">\
                        <div class="declaration jsfix" data-size="no"></div>\
                        <div class="button"><span class="reset">再玩一次</span><span class="share">分享好友</span></div>\
                        <div class="wrapper">\
                            <span><img src="img/icon/close.png"></span>\
                            <div class="tips">点击右上角的<img src="img/icon/more.png"><br/>点击分享 <img src="img/icon/wx.png"> ，分享到朋友圈</div>\
                        </div>\
                    </div>\
                </div>'

            var text1 = '注册姓名和手机号码<br />即刻将宣言晒到朋友圈或分享给好友<br />填写真实车牌号码<br />2017 年 8 月 15 日 - 2018 年 2 月 16 日<br />活动期间在前往浦东国际机场的路上<br />即可亲眼见证你的留言登上保时捷大屏幕';
            var text2 = '注册您的真实姓名和手机号码<br />留言审核通过后<br />您将收到一条来自保时捷的短信通知<br />填写真实车牌号码<br />在 2017 年 8 月 15 日 –  2018 年 2 月 16 日<br />任意时间前往浦东国际机场<br />将有机会在高速公路上亲眼见证你的留言<br />登上保时捷大屏幕';

            $('body').append(formHtml);
            $('#userForm>p').html(custom ? text2 : text1);

            tools.fixPosition(640);

            form.init();
        }
    }

    form.agree = false;
    form.key = '';
    form.flagMobile = false;
    form.flagSubmit = false;

    form.init = function () {
        var userForm = $('#userForm');

        // 隐藏横屏
        $('.block').remove();

        // 隐藏选择层
        //$('#mainSwiper').hide();

        // 调整buttton坐标
        $('#userForm>.button').css('top', document.body.clientHeight - 71);



        // 同意条款
        $('.agree span', userForm).hammer().on("tap", function (e) {
            if ($(this).attr('class') == 'active') {
                $(this).removeClass('active');
                form.agree = false;
            }
            else {
                $(this).addClass('active');
                form.agree = true;
            }
        });

        // 关闭表单，返回之前的页面
        $('.back', userForm).hammer().on("tap", function (e) {
            form.close();
            //$('#mainSwiper').show();
        });


        // 规则查看
        $('.agree a', userForm).hammer().on("tap", function (e) {
            $('.rule', userForm).show();
        });

        $('.rule span', userForm).hammer().on("tap", function (e) {
            $('.rule', userForm).hide();
        });

        // 错误信息
        $('.result .button', userForm).hammer().on("tap", function (e) {
            setTimeout(function () {
                $('.result', userForm).hide();
            }, 100)
            
            userForm.focus()
        });

        // 表单验证
        form.check();

        // 发送完成
        $('.shareview .share', userForm).hammer().on("tap", function (e) {
            $('.shareview .wrapper', userForm).show();
        });

        $('.shareview .wrapper span', userForm).hammer().on("tap", function (e) {
            $('.shareview .wrapper', userForm).hide();
        });

        $('.reset').hammer().on("tap", function (e) {
            //location.href = 'http://www.porsche-cnmkt.com';
            location.href = self.host;
        });
    }

    form.error = function (s) {
        var userForm = $('#userForm');

        $('.result .text', userForm).text(s);
        $('.result', userForm).show();
    }

    form.check = function () {
        var userForm = $('#userForm');

        //只能输入数字
        $('#mobile, #code').on('keyup', function () {
            $(this).val($(this).val().replace(/\D/g, ''));
        }).on('afterpaste', function () {
            $(this).val($(this).val().replace(/\D/g, ''));
        })


        // 短信code验证
        $('#code', userForm).on('keyup', function () {
            var code = $(this).val();


            if (code.length == 4) {
                $.ajax({
                    type : "post",
                    url : "http://dev.api.happy-share.cn/sms/verify",
                    data: { key: form.key, code: parseInt(code) },
                    success: function (args) {
                        if (args.code == 200) {
                            form.error('验证成功');
                            form.flagMobile = true;

                            // 验证完成禁止修改手机号
                            $('#mobile').attr('readonly', 'readonly');
                        }
                        else { form.error('验证失败'); }
                    },
                    error: function (args) {
                        alert('网络链接失败！')
                    }
                });
            }
        })

        // 手机验证
        $('#sendCode').hammer().on("tap", function (e) {
            var reg = /^0?1[2|3|4|5|6|7|8|9][0-9]\d{8}$/;

            if ($(this).attr('class') == 'disable') { return; }

            if (!reg.test($('#mobile', userForm).val())) {
                form.error('请填写正确的手机号码');
            }
            else {
                $('#sendCode').addClass('disable');
                var x = 60, t = setInterval(function () {

                    if (--x == 0) {
                        clearInterval(t);
                        $('#sendCode').removeClass('disable');
                        $('#sendCode span').text('');
                    }
                    else {
                        $('#sendCode span').text(' (' + x + ')');
                    }
                }, 1000)

                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: 'http://dev.api.happy-share.cn/sms',
                    data: { aId: 'C83E1SHG', mobile: parseInt($('#mobile', userForm).val()) },
                    //data:{ aid: 'C83E1SHG', mobile: '15502175348' },
                    success: function (args) {
                        if (args.code == 200) {

                            form.error('发送成功');

                            alert('请输入验证码:' + args.data.code)
                            form.key = args.data.verify_key;
                            console.log(form.key);
                        }
                    },
                    error: function () {
                        alert('网络链接失败！')
                    }

                })
            }
        });

        // 表单验证
        $('.submit', userForm).hammer().on("tap", function (e) {

            if (form.flagSubmit) { return; }
            
            var name = $('#name', userForm).val(),
                mobile = $('#mobile', userForm).val(),
                number = $('#number', userForm).val(),
                brand = $('#brand', userForm).val(),
                declaration = slogan.value;



            if (!form.flagMobile) {
                form.error('你需要先验证手机');
                return;
            }


            if (!form.agree) {
                form.error('你需要阅读并了解隐私条款');
                return;
            }

            if (name == '') {
                form.error('请填写姓名');
                return;
            }


            if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(number)) {
                form.error('请填写正确的车牌');
                return;
            }



            //$('.shareview .declaration').text(declaration);

            //alert('name:' + name + ', mobile:' + mobile + ', number:' + number + ', slogan:' + declaration + '。哈哈')


            console.log(name)
            console.log(mobile)
            console.log(number)
            console.log(declaration)

            form.flagSubmit = true;

            $.ajax({
                type: 'post',
                dataType: 'json',
                url: 'http://dev.api.happy-share.cn/form',
                data: { aId: '22511818', series: '1', info1: name, info2: mobile, info3: number + '#' + brand, info4: (custom ? '1' : '0') + '#' + declaration },
                success: function (args) {
                    if (args.code == 200) {
                        //form.error('保存成功');
                        self.share(declaration);



                        $('.finished', userForm).show();
                        $('.shareview', userForm).hide();

                        setTimeout(function () {
                            $('.finished', userForm).fadeOut();
                            $('.shareview', userForm).show();

                            var o = $('<div id="finallyText2">' + slogan.longValue + '</div>')

                            //$('.declaration').html(slogan.data[theme].m[swiper.realIndex].n).arctext({ radius: 400 });
                            $('.shareview .declaration').html(o);

                            if (slogan.selected.first == 2) {
                                $('#finallyText2').arctext({ radius: 1500 });
                            }
                            else {
                                $('#finallyText2').arctext({ radius: 1200 });
                            }


                        }, 1000)
                    }
                    else {
                        form.flagSubmit = false;
                        alert(args.code)
                    }
                },
                error: function (args) {
                    form.flagSubmit = false;
                    alert('网络链接失败！')
                }

            })

        });
    }

    form.close = function(){
        //$('#userForm').hide();
        $('#userForm').remove();
    }


    // 宣言
    var slogan = {}

    slogan.selected = {
        first : 0,
        second : 0,
        third : 0
    }

    slogan.table = {

        slogan : [
            {
                name: '旅行', title: '旅行宣言', list: [
                    { name: '是时候来一场　　之旅', key: ['沙漠', '公路', '海滩', '都市', '山地'] },
                    { name: '祝你　　之行轻松愉悦', key: 'city' },
                    { name: '祝你　　之行顺利', key: 'city' }
                ]
            },

            {
                name: '表白', title: '表白宣言', list: [
                    { name: '令心跳加速的不止　　，还有你', key: ['保时捷', '速度', '未来', '远方', '风景'] },
                    { name: '因为有你，每一次　　都是惊喜', key: ['远行', '旅途', '出发', '邂逅', '启程'] }
                ]
            },

            {
                name: '生日', title: '选择祝福语言', list: [
                    { name: '生日快乐' },
                    { name: 'Happy Birthday' },
                    { name: 'Bon Anniversaire' },
                    { name: 'Alles Gute Zum Geburtstag' },
                    { name: 'iFeliz Cumpleaños' }
                ]
            },

            {
                name: '工作', title: '工作宣言', list: [
                    { name: '我爱　　，　　让我快乐', key: ['出差', '工作', '加班', '开会', '公司'] },
                    { name: '全情投入，偶尔也要逃离　　', key: ['办公室', '写字楼', '北上广', '大城市', '格子间'] }
                ]
            },

            {
                name: '团聚', title: '团聚宣言', list: [
                    { name: '这一次出发，只为　　', key: ['抵达', '重逢', '邂逅', '约定', '回家'] },
                    { name: '要去的方向，是有　　的地方', key: ['家人', '朋友', '闺蜜', '兄弟', '挚爱'] }
                ]
            },

            {
                name: '比赛', title: '比赛宣言', list: [
                    { name: '期待你创造新的　　', key: ['记录', '荣耀', '传奇', '故事', '篇章'] },
                    { name: '下赛道，　　！', key: ['一决高下', '实力说话', '创造传奇', '极速竞技', '挑战极限'] }
                ]
            },

            {
                name: '成长', title: '成长宣言', list: [
                    { name: '一生中一定要有一次　　', key: ['热恋', '旅行', '奋不顾身', '独处', '任性'] },
                    { name: '成长的乐趣是实现　　的梦想', key: ['儿时', '青春', '看似幼稚', '小小', '不切实际'] }
                ]
            },

            {
                name: '梦想', title: '梦想宣言', list: [
                    { name: '一部车，　　，就是心之所向', key: ['一片星空', '一个梦想', '一座岛屿', '一份自由', '一个终点'] },
                    { name: '我的梦想，在　　', key: ['赛场', '舞台', '路上', '远方', '故乡'] }
                ]
            },

            {
                name: '自定义', key: 'other'
            }
        ],

        city: [
            {
                region: '亚洲', country: [
                    { name: '内地', city: ['三亚', '厦门', '青岛', '丽江', '大连', '成都', '上海', '桂林', '北京', '西安'] },
                    { name: '港澳台', city: ['香港', '澳门', '台北', '高雄', '垦丁', '花莲'] },
                    { name: '日本', city: ['东京', '大板', '京都', '奈良', '箱根', '北海道', '冲绳', '福冈', '神户', '神奈川'] },
                    { name: '泰国', city: ['普吉岛', '曼谷', '清迈', '芭提雅', '苏梅岛', '皮皮岛', '甲米', '拜县', '沙美岛', '清莱'] },
                    { name: '韩国', city: ['首尔', '济州岛', '釜山', '仁川', '江原道'] },
                    { name: '越南', city: ['岘港', '胡志明市', '下龙湾', '芽庄', '美奈'] },
                    { name: '新加坡', city: ['新加坡'] },
                    { name: '马来西亚', city: ['吉隆坡', '沙巴', '兰卡威', '马六甲', '滨城'] },
                    { name: '菲律宾', city: ['长滩岛', '马尼拉', '宿雾', '薄荷岛', '巴拉望'] },
                    { name: '其他', city: ['其他'] }
                ]
            },

            {
                region: '欧洲', country: [
                    { name: '英国', city: ['伦敦', '爱丁堡', '牛津', '剑桥', '曼彻斯特', '约克', '巴斯', '利物浦', '伯明翰', '纽卡斯尔'] },
                    { name: '德国', city: ['柏林', '慕尼黑', '多特蒙德', '法兰克福', '科隆', '海德堡', '汉堡', '斯图加特', '纽伦堡'] },
                    { name: '法国', city: ['巴黎', '普罗旺斯', '马赛', '里昂', '戛纳'] },
                    { name: '西班牙', city: ['巴塞罗那', '马德里', '塞维利亚', '瓦伦西亚', '科尔多瓦'] },
                    { name: '意大利', city: ['罗马', '米兰', '那不勒斯', '都灵', '佛罗伦萨', '威尼斯'] },
                    { name: '荷兰', city: ['阿姆斯特丹', '马斯特里赫特', '海牙', '鹿特丹', '乌特勒支'] },
                    { name: '瑞士', city: ['苏黎世', '卢塞恩', '日内瓦', '洛桑', '卢加诺'] },
                    { name: '其他', city: ['其他'] }
                ]
            },

            {
                region: '北美洲', country: [
                    { name: '美国', city: ['纽约', '洛杉矶', '旧金山', '西雅图', '华盛顿', '拉斯维加斯', '夏威夷', '波士顿', '芝加哥', '费城'] },
                    { name: '加拿大', city: ['温哥华', '蒙特利尔', '多伦多', '渥太华', '魁北克'] },
                    { name: '其他', city: ['其他'] }
                ]
            },

            {
                region: '南美洲', country: [
                    { name: '巴西', city: ['里约热内卢', '圣保罗'] },
                    { name: '阿根廷', city: ['布宜诺斯艾利斯', '蒙得维的亚'] },
                    { name: '其他', city: ['其他'] }
                ]
            },

            {
                region: '大洋洲', country: [
                    { name: '澳大利亚', city: ['悉尼', '墨尔本', '凯恩斯', '黄金海岸', '堪培拉'] },
                    { name: '新西兰', city: ['奥克兰', '皇后镇', '惠灵顿'] },
                    { name: '斐济', city: ['斐济'] },
                    { name: '其他', city: ['其他'] }
                ]
            }
        ]
    }

    slogan.target = function () { return $('.slogan') }

    // 当前模板
    slogan.template = null;
    slogan.value = null;
    slogan.longValue = null;


    // 设置选择列表标题
    slogan.setTitle = function (o) {
        o.text(this.table.slogan[this.selected.first].title);
    }

    slogan.update = function (s) {

        var key = '', text = '';

        switch (step) {
            case 1:
                console.log('step::' + step);
                if (slogan.selected.first == 8) {
                    text = s;
                }
                else {
                    this.template = slogan.table.slogan[this.selected.first].list[this.selected.second].name;
                    text = this.template;
                }
                break;

            case 2:
                console.log('step::' + step);
                key = s || slogan.table.slogan[this.selected.first].list[this.selected.second].key[this.selected.third];
                if (key) {
                    text = this.template.replace(/　　/g, key);
                }
                else {
                    text = this.template;
                }
                break;

            case 3:
                console.log('step::' + step);
                if (s != '') {
                    text = this.template.replace(/　　/g, s);
                }
                else {
                    text = this.template;
                }
                
                break;
        }

        slogan.value = text;

        var l = text.length;
        for (var i = 16; i > l; i--) {
            text += '　';
        }

        slogan.longValue = text;

        var o = $('<div id="finallyText">' + text + '</div>')

        //$('.declaration').html(slogan.data[theme].m[swiper.realIndex].n).arctext({ radius: 400 });
        this.target().html(o);

        if (slogan.selected.first == 2) {
            $('#finallyText').arctext({ radius: 1500 });
        }
        else {
            $('#finallyText').arctext({ radius: 1000 });
        }
        


        //this.target().html(text);
    }

    slogan.clear = function () {
        this.selected.second = 0;
        this.selected.third = 0;
        this.target().html('');
    }



    return self;
});

















