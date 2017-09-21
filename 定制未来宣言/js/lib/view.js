// 剧本

define(['jquery', 'swiper', 'weixin', 'tools', 'createjs'], function ($, swiper, wx, tools) {
    var self = {}

    self.host = 'http://www.porsche-cnmkt.com/app202/'

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
          { 'src': 'main/index-1.jpg' },
          { 'src': 'main/index-2.jpg' }
        ]

        loader.on("progress", onProgress);
        loader.on("complete", onComplete);
        loader.loadManifest(source, true, 'img/');


        function onComplete(e) {

            self.share(tools.getUrlParam('words'));

            //form.open();
            self.init();

        }

        function onProgress(e) {
            //console.log(loader.progress);
            $('.loading span').text((loader.progress * 100 | 0) + " %");
        }
    }

    self.init = function () {
        $('body').append(self.template.shareview);
        
        $('.shareview').show();

        tools.fixPosition(640);

        var text = tools.getUrlParam('words');

        var pattern_char = /[a-zA-Z]/g;
        var pattern_chin = /[\u4e00-\u9fa5]/g;
        var count_char = text.match(pattern_char);
        var count_chin = text.match(pattern_chin);

        count_char = count_char == null ? 0 : count_char.length;
        count_chin = count_chin == null ? 0 : count_chin.length;

        var className = ''

        if (count_char < count_chin) {
            className = 'sloganCn'
        }

        var x = splitSlogan(text), o = null;

        //var o = $('<div id="finallyText" class="' + className + '">' + text + '</div>')
        if (count_chin == 0) {
            o = $('<div id="finallyText1">' + text + '</div><div id="finallyText2"></div>');
        }
        else {
            var l = x.line2.length || 0;
            var line2 = x.line2;
            for (var i = 8; i > l; i--) {
                line2 += '　';
            }

            o = $('<div id="finallyText3">' + x.line1 + '</div><div id="finallyText4">' + line2 + '</div>');
        }

        //var l = text.length;
        //for (var i = 16; i > l; i--) {
        //    text += '　';
        //}

        //var o = $('<div id="finallyText">' + text + '</div>')

        $('.declaration').html(o);

        $('#finallyText3').arctext({ radius: 1200 });
        $('#finallyText4').arctext({ radius: 1200 });


        //$('#finallyText').arctext({ radius: 1200 });



        self.bindAction();

        // 初始化完成隐藏loading
        $('.loading').fadeOut();
    }


    self.bindAction = function () {
        $('.shareview .button').hammer().on("tap", function (e) {
            location.href = self.host;
        });
    }


    self.template = {
        loading: '<div class="loading"><span></span></div>',
        block: '<div class="block"><img src="img/main/landscape.png" /><br /><span>竖屏浏览，体验更佳</span></div>',
        shareview: '\
            <div class="shareview">\
                <div class="declaration jsfix" data-size="no"></div>\
                <div class="button"><span>我也要玩</span></div>\
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


    var getBLen = function (str) {
        if (str == null) return 0;
        if (typeof str != "string") {
            str += "";
        }
        return str.replace(/[^\x00-\xff]/g, "01").length;
    }

    var splitSlogan = function (str) {

        var s1 = [], s2 = [];
        var s3 = '', s4 = '';

        var flag = true;
        var start = false;

        if (checkChinese(str.substring(0, 8))) {
            s3 = str.substring(0, 8);
            s4 = str.substring(8, str.length);

            //console.log('纯中文')
        }
        else {
            //console.log('有英文')
            var s5 = [];

            $.each(str.split(''), function (index, item) {

                if ((checkChinese(item) || item == ' ') && s5.length > 0) {
                    return false;
                }

                if (!checkChinese(item) && item != ' ') {
                    s5.push(item);
                }

            })

            //console.log(s5.join('') + '!!!');

            var arr = str.split(s5.join(''));

            if (arr[0].length < 8) {
                s3 = arr[0] + s5.join('');

                _arr = arr[1].split('')
                if (_arr[0] == ' ') {
                    _arr.shift();
                }

                s4 = _arr.join('');
            }
            else {
                s3 = arr[0];
                s4 = s5.join('') + arr[1];
            }
        }

        return { line1: s3, line2: s4 }
    }

    function checkChinese(s) {
        //var re = /[^\u4e00-\u9fa5]/;
        var re = /[A-Za-z0-9]/;

        return !re.test(s);
    }


    return self;
});

















