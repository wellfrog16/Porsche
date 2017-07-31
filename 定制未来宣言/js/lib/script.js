// 剧本

define(['jquery', 'swiper', 'weixin', 'tools', 'createjs'], function ($, swiper, wx, tools) {
    var self = {}

    self.open = function () {
        // 如果是手机端，加载横屏提示
        if (!tools.isPC) {
            $('body').append(self.template.block);
        }

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
          { 'src': 'main/index-1.jpg' },
          { 'src': 'main/index-2.jpg' }
        ]

        loader.on("progress", onProgress);
        loader.on("complete", onComplete);
        loader.loadManifest(source, true, 'img/');


        function onComplete(e) {

            //self.share();


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

    self.initPageSwiper = function () {

        $('body').append(self.template.pageSwiper);

        // 主体swiper 初始化
        self.pageSwiper = new swiper('#pageSwiper', {
            direction: 'vertical',
            width: window.innerWidth,
            height: window.innerHeight,
            onInit: function (sw) { initMainSwiper(sw); }
        });

        // 选择3D翻页swiper
        function initMainSwiper(sw) {
            self.mainSwiper = new swiper('#mainSwiper', {
                effect: 'cube',
                speed: 500,
                loop: false,
                onlyExternal: true,
                onInit: function (swiper) { initThemeSwiper(sw); }
            });
        }

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
                onInit: function (swiper) {

                    // 循环9次，单次9个
                    for (var i = 1; i <= 15; i++) {
                        $.each(self.data, function (index, item) {
                            swiper.appendSlide('<div class="swiper-slide">' + item.n + '</div>');
                        })
                    }

                    swiper.update();
                    //swi

                    // 动作绑定
                    self.bindAction();

                    // 初始化完成隐藏loading
                    $('.loading').fadeOut();

                    sw.slideTo(2);
                },
                onSlideChangeStart: function (swiper) {
                    $('#themeSwiper .highlight').removeClass('highlight');

                },
                onTransitionStart: function () {
                    $('#themeSwiper .highlight').removeClass('highlight');
                },
                onSlideChangeEnd: function (swiper) {

                    self.themeIndex = swiper.activeIndex;

                    $('.themeSwiper li').removeClass('highlight');
                    $('.themeSwiper li').eq(swiper.activeIndex).addClass('highlight');

                    //console.log($('#themeSwiper .swiper-slide').length);
                    $('#themeSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');

                },
                onTransitionEnd: function (swiper) {
                    self.themeIndex = swiper.activeIndex;

                    $('.themeSwiper li').removeClass('highlight');
                    $('.themeSwiper li').eq(swiper.activeIndex).addClass('highlight');

                    $('#themeSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');
                }
            });
        }

        //-----
    }


    self.bindAction = function () {
        $('.scene-main .next').hammer().on("tap", function (e) {

            //self.mainSwiper.params.effect = 'cube';
            //self.mainSwiper.update();
            //self.mainSwiper.activeIndex

            //console.log(self.themeIndex)

            //console.log(self.mainSwiper.previousIndex)

            console.log(self.currentSwiper)

            if (self.currentSwiper == 'theme') {

                switch (self.themeIndex) {
                    case 0:
                        if (self.lastSecondSwiper != 'lvxing') {
                            self.lastSecondSwiper = 'lvxing';
                            self.currentSwiper = 'lvxing';
                            self.appendLvxing();
                        }
                        break;

                }

                self.mainSwiper.slideNext();
            }
        });

        $('.scene-main .pre').hammer().on("tap", function (e) {

            var s = 'lvxing';

            // 调整变量：设置为新的当前swiper
            if (s.indexOf(self.currentSwiper) >= 0) { self.currentSwiper = 'theme'; }

            self.mainSwiper.slidePrev();
        });
    }

    self.appendLvxing = function () {
        self.mainSwiper.appendSlide(self.template.lvxingSwiper);
        self.mainSwiper.update();

        self.lvxingSwiper = new swiper('#lvxingSwiper', {
            direction: 'vertical',
            freeModeMomentumRatio: 0.2,
            slidesPerView: 3,
            freeMode: true,
            freeModeSticky: true,
            centeredSlides: true,
            onInit: function () {



            },
            onSlideChangeStart: function (swiper) {
                $('#lvxingSwiper .highlight').removeClass('highlight');

            },
            onTransitionStart: function () {
                $('#lvxingSwiper .highlight').removeClass('highlight');
            },
            onSlideChangeEnd: function (swiper) {

                self.themeIndex = swiper.activeIndex;

                $('.lvxingSwiper li').removeClass('highlight');
                $('.lvxingSwiper li').eq(swiper.activeIndex).addClass('highlight');

                //console.log($('#themeSwiper .swiper-slide').length);
                $('#lvxingSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');

            },
            onTransitionEnd: function (swiper) {
                self.themeIndex = swiper.activeIndex;

                $('.lvxingSwiper li').removeClass('highlight');
                $('.lvxingSwiper li').eq(swiper.activeIndex).addClass('highlight');

                $('#lvxingSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');
            }
        });
    }


    self.data = [
        {
            n: '旅行', m: [
                { n: '是时候来一场<span></span>之旅', m: ['沙漠', '公路', '海滩', '都市', '山地'] },
                { n: '祝你<span></span>之行轻松愉悦', m: 'city' },
                { n: '祝你<span></span>之行顺利', m: 'city' }
            ]
        },

        {
            n: '表白', m: [
                { n: '令心跳加速的不止<span></span>，还有你', m: ['保时捷', '速度', '未来', '远方', '风景'] },
                { n: '因为有你，每一次<span></span>都是惊喜', m: ['远行', '旅途', '出发', '邂逅', '启程'] }
            ]
        },

        {
            n: '生日', m: ['(Chinese)生日快乐', '(English) Happy Birthday', '(French) Bon Anniversaire', '(German) Alles Gute Zum Geburtstag', '(Spanish) iFeliz Cumpleaños']
        },

        {
            n: '工作', m: [
                { n: '我爱<span></span>，<span></span>让我快乐', m: ['出差', '工作', '加班', '开会', '公司'] },
                { n: '全情投入，偶尔也要逃离<span></span>', m: ['办公室', '写字楼', '北上广', '大城市', '格子间'] }
            ]
        },

        {
            n: '团聚', m: [
                { n: '这一次出发，只为<span></span>', m: ['抵达', '重逢', '邂逅', '约定', '回家'] },
                { n: '要去的方向，是有<span></span>的地方', m: ['家人', '朋友', '闺蜜', '兄弟', '挚爱'] }
            ]
        },

        {
            n: '比赛', m: [
                { n: '期待你创造新的<span></span>', m: ['记录', '荣耀', '传奇', '故事', '篇章'] },
                { n: '下赛道，<span></span>！', m: ['一决高下', '实力说话', '创造传奇', '极速竞技', '挑战极限'] }
            ]
        },

        {
            n: '成长', m: [
                { n: '一生中一定要有一次<span></span>', m: ['热恋', '旅行', '奋不顾身', '独处', '任性'] },
                { n: '成长的乐趣是实现<span></span>的梦想', m: ['儿时', '青春', '看似幼稚', '小小', '不切实际'] }
            ]
        },

        {
            n: '梦想', m: [
                { n: '一部车，<span></span>，就是心之所向', m: ['一片星空', '一个梦想', '一座岛屿', '一份自由', '一个终点'] },
                { n: '我的梦想，在<span></span>', m: ['赛场', '舞台', '路上', '远方', '故乡'] }
            ]
        },

        {
            n: '自定义', m: 'other'
        }
    ]

    self.template = {
        loading: '<div class="loading"><span></span></div>',
        pageSwiper:
            '<div class="swiper-container" id="pageSwiper">\
                <div class="swiper-wrapper">\
                    <div class="swiper-slide scene-index1"></div>\
                    <div class="swiper-slide scene-index2"></div>\
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
                        </div>\
                        <div class="pagination"><div class="pre button">上一步</div><div class="next button">下一步</div></div>\
                    </div>\
                </div>\
            </div>',
        lvxingSwiper:
            '<div class="swiper-slide lvxingSwiper">\
                <div class="header">宣言</div>\
                <ul class="indicator"><li class="highlight"></li><li></li><li></li></ul>\
                <div class="swiper-container" id="lvxingSwiper">\
                    <div class="swiper-wrapper">\
                        <div class="swiper-slide highlight">是时候来一场<span></span>之旅</div>\
                        <div class="swiper-slide">祝你<span></span>之行轻松愉悦</div>\
                        <div class="swiper-slide">祝你<span></span>之行顺利</div>\
                    </div>\
                </div>\
            </div>'
    }


    // 分享
    self.share = function () {
        var host = "http://m.canon.com.cn/m/products/printer/pixma/pixmaevent";
        var project = '';

        $.ajax({
            type: 'post',
            url: host + '/share/jssdk',
            data: { url: window.location.href, m: 'getWxConfig' },
            //url: 'https://www.tron-m.com/wx/jssdk?m=getWxConfig',
            //data: { url: window.location.href },
            dataType: 'json',
            success: function (args) {
                ////////////
                args = args.result;

                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: args.appId, // 必填，公众号的唯一标识
                    timestamp: args.timestamp, // 必填，生成签名的时间戳
                    nonceStr: args.nonceStr, // 必填，生成签名的随机串
                    signature: args.signature,// 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wx.ready(function () {
                    var url = document.location.href,
                        title = '111111',
                        desc = '2222222',
                        imgUrl = host + '/img/main/sharecover.jpg'

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

    return self;
});

















