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

    var theme = 0, record = 0, customKey = 0, step = 0;

    self.initPageSwiper = function () {

        $('body').append(self.template.pageSwiper);

        tools.fixPosition(320);

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
                loopAdditionalSlides: self.data.length,
                onInit: function (swiper) {

                    // 更新数据
                    $.each(self.data, function (index, item) {
                        swiper.appendSlide('<div class="swiper-slide">' + item.n + '</div>');
                    })

                    swiper.update();

                    swiper.slideTo(self.data.length);

                    // 第一个默认高亮
                    $('#themeSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');

                    // 动作绑定
                    self.bindAction();

                    // 初始化完成隐藏loading
                    $('.loading').fadeOut();

                    // 调试直接显示第三页
                    sw.slideTo(2);
                },
                //onSlideChangeStart: function (swiper) {
                //    $('#themeSwiper .highlight').removeClass('highlight');

                //},
                onTransitionStart: function () {
                    $('#themeSwiper .highlight').removeClass('highlight');
                },
                //onSlideChangeEnd: function (swiper) {

                //    self.themeIndex = swiper.activeIndex;

                //    $('.themeSwiper li').removeClass('highlight');
                //    $('.themeSwiper li').eq(swiper.realIndex).addClass('highlight');

                //    //console.log($('#themeSwiper .swiper-slide').length);
                //    $('#themeSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');

                //    theme = swiper.realIndex;
                //},
                onTransitionEnd: function (swiper) {
                    self.themeIndex = swiper.activeIndex;

                    $('.themeSwiper li').removeClass('highlight');
                    $('.themeSwiper li').eq(swiper.realIndex).addClass('highlight');

                    $('#themeSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');

                    theme = swiper.realIndex;
                    console.log('theme=' + theme)
                }
            });
        }

        //-----
    }

    //var 


    self.bindAction = function () {
        $('.scene-main .next').hammer().on("tap", function (e) {

            //self.mainSwiper.params.effect = 'cube';
            //self.mainSwiper.update();
            //self.mainSwiper.activeIndex

            //console.log(self.themeIndex)

            //console.log(self.mainSwiper.previousIndex)

            //console.log(self.currentSwiper)

            console.log(theme)

            if (step == 0) {

                switch (theme) {
                    case 8:
                        self.appendCustomTheme();
                        break;

                    default:
                        self.appendSecondCommon();
                        break;
                }

                self.mainSwiper.slideNext();
            }

            if (step == 1) {
                
                if (theme == 0 && record > 0) {     // 城市选择
                    self.appendCity();
                }
                else if (theme == 2) {              // 生日祝福
                    return;
                }
                else if (theme == 8) {
                    return;
                }
                else {
                    self.appendThirdCommon();
                }

                self.mainSwiper.slideNext();
            }

            if (step == 2 && customKey == 1) {

                self.appendCustomKey();
                self.mainSwiper.slideNext();
            }



            //step++;
        });

        $('.scene-main .pre').hammer().on("tap", function (e) {            
            self.mainSwiper.slidePrev();
            //step--;
        });
    }


    self.appendSecondCommon = function () {
        self.mainSwiper.removeSlide([1, 2, 3]);
        self.mainSwiper.appendSlide(self.template.commonSecondSwiper);
        self.mainSwiper.update();

        $('.commonSecondSwiper .header').text(self.data[theme].title);

        self.commonSecondSwiper = new swiper('#commonSecondSwiper', {
            direction: 'vertical',
            freeModeMomentumRatio: 0.2,
            slidesPerView: 3,
            freeMode: true,
            freeModeSticky: true,
            centeredSlides: true,
            loop: true,
            loopAdditionalSlides: self.data[theme].m.length,
            onInit: function (swiper) {
                // 更新数据
                $.each(self.data[theme].m, function (index, item) {
                    swiper.appendSlide('<div class="swiper-slide">' + item.n + '</div>');
                })

                swiper.update();

                swiper.slideTo(self.data[theme].m.length);

            },
            onTransitionStart: function (swiper) {
                $('#commonSecondSwiper .highlight').removeClass('highlight');

            },
            onTransitionEnd: function (swiper) {
                $('#commonSecondSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');
                $('.declaration').html(self.data[theme].m[swiper.realIndex].n);

                record = swiper.realIndex;
                console.log('record='+ record)
            }
        });
    }

    self.appendThirdCommon = function () {

        self.mainSwiper.removeSlide([2, 3]);
        self.mainSwiper.appendSlide(self.template.commonThirdSwiper);
        self.mainSwiper.update();

        $.each(self.data[theme].m[record].m, function (index, item) {
            $('.commonThirdSwiper ul').append('<li><span>' + item + '</span></li>');
        })

        $('.commonThirdSwiper ul').append('<li><span>自定义</span></li>');

        $('.commonThirdSwiper ul li').each(function () {
            $(this).hammer().on("tap", function (e) {
                $('.commonThirdSwiper ul li span').removeClass('active');
                $('span', $(this)).addClass('active');

                var declaration = $('.declaration').text();

                var text = $('span', $(this)).text()

                customKey = text == '自定义' ? 1 : 0;

                if (text != '自定义') {
                    $('.declaration span').text(text);
                    $('.declaration span').addClass('active');
                }
                else {
                    $('.declaration span').text('');
                    $('.declaration span').removeClass('active');
                }

            });
        })
    }

    self.appendCity = function () {
        self.mainSwiper.removeSlide([2, 3]);
        self.mainSwiper.appendSlide(self.template.citySwiper);
        self.mainSwiper.update();

        initRegion();

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
                    $.each(city, function (index, item) {
                        swiper.appendSlide('<div class="swiper-slide">' + item.region + '</div>');
                    })

                    swiper.update();

                    //swiper.slideTo(city.length);
                    $('#regionSwiper .swiper-slide').eq(0).addClass('highlight');

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

                        $.each(city[regionIndex].country, function (index, item) {
                            self.countrySwiper.appendSlide('<div class="swiper-slide">' + item.name + '</div>');
                        })

                        self.countrySwiper.update();

                        $('#countrySwiper .swiper-slide').eq(0).addClass('highlight');

                        // ---------
                        self.citySwiper.removeAllSlides();

                        $.each(city[regionIndex].country[0].city, function (index, item) {
                            self.citySwiper.appendSlide('<div class="swiper-slide">' + item + '</div>');
                        })

                        self.citySwiper.update();

                        $('#citySwiper .swiper-slide').eq(0).addClass('highlight');


                        var text = $(self.citySwiper.slides[0]).text();

                        $('.declaration span').text(text);
                        $('.declaration span').addClass('active');
                    }

                    //console.log(self.countrySwiper);
                    //$('.declaration').html(self.data[theme].m[swiper.realIndex].n);

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
                    $.each(city[0].country, function (index, item) {
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
                    //$('.declaration').html(self.data[theme].m[swiper.realIndex].n);

                    if (countryIndex != swiper.realIndex) {
                        countryIndex = swiper.realIndex;

                        // ---------
                        self.citySwiper.removeAllSlides();

                        $.each(city[regionIndex].country[countryIndex].city, function (index, item) {
                            self.citySwiper.appendSlide('<div class="swiper-slide">' + item + '</div>');
                        })

                        self.citySwiper.update();

                        $('#citySwiper .swiper-slide').eq(0).addClass('highlight');

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
                    $.each(city[0].country[0].city, function (index, item) {
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

                    $('.declaration span').text(text);
                    $('.declaration span').addClass('active');

                    //$('.declaration').html(self.data[theme].m[swiper.realIndex].n);

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

        $('.customKeySwiper input').on('keyup', function () {

            var text = $(this).val();

            if (text.length > 4) { return }

            if (text != '') {
                $('.declaration span').text(text);
                $('.declaration span').addClass('active');
            }
            else {
                $('.declaration span').text('');
                $('.declaration span').removeClass('active');
            }

        })
    }

    self.appendCustomTheme = function () {
        self.mainSwiper.removeSlide([1,2,3]);
        self.mainSwiper.appendSlide(self.template.customThemeSwiper);
        self.mainSwiper.update();

        $('.customThemeSwiper input').on('keyup', function () {

            var text = $(this).val();

            if (text.length > 10) { return }

            $('.declaration').text(text);
        })
    }

    self.appendLvxing = function () {
        self.mainSwiper.removeSlide([1, 2]);
        self.mainSwiper.appendSlide(self.template.lvxingSwiper);
        self.mainSwiper.update();

        self.lvxingSwiper = new swiper('#lvxingSwiper', {
            direction: 'vertical',
            freeModeMomentumRatio: 0.2,
            slidesPerView: 3,
            freeMode: true,
            freeModeSticky: true,
            centeredSlides: true,
            loop: true,
            loopAdditionalSlides: self.data[theme].m.length,
            onInit: function (swiper) {
                // 更新数据
                $.each(self.data[theme].m, function (index, item) {
                    swiper.appendSlide('<div class="swiper-slide">' + item.n + '</div>');
                })

                swiper.update();

                swiper.slideTo(self.data[theme].m.length);

            },
            onSlideChangeStart: function (swiper) {
                $('#lvxingSwiper .highlight').removeClass('highlight');

            },
            onSlideChangeEnd: function (swiper) {

                theme = swiper.activeIndex;

                $('#lvxingSwiper .swiper-slide').eq(swiper.activeIndex).addClass('highlight');

            }
        });
    }


    self.data = [
        {
            n: '旅行', title:'旅行宣言', m: [
                { n: '是时候来一场<span></span>之旅', m: ['沙漠', '公路', '海滩', '都市', '山地'] },
                { n: '祝你<span></span>之行轻松愉悦', m: 'city' },
                { n: '祝你<span></span>之行顺利', m: 'city' }
            ]
        },

        {
            n: '表白', title: '表白宣言', m: [
                { n: '令心跳加速的不止<span></span>，还有你', m: ['保时捷', '速度', '未来', '远方', '风景'] },
                { n: '因为有你，每一次<span></span>都是惊喜', m: ['远行', '旅途', '出发', '邂逅', '启程'] }
            ]
        },

        {
            n: '生日', title: '选择祝福语言', m: [
                { n: '(Chinese) 生日快乐' },
                { n: '(English) Happy Birthday' },
                { n: '(French) Bon Anniversaire' },
                { n: '(German) Alles Gute Zum Geburtstag' },
                { n: '(Spanish) iFeliz Cumpleaños' }
            ]
        },

        {
            n: '工作', title: '工作宣言', m: [
                { n: '我爱<span></span>，<span></span>让我快乐', m: ['出差', '工作', '加班', '开会', '公司'] },
                { n: '全情投入，偶尔也要逃离<span></span>', m: ['办公室', '写字楼', '北上广', '大城市', '格子间'] }
            ]
        },

        {
            n: '团聚', title: '团聚宣言', m: [
                { n: '这一次出发，只为<span></span>', m: ['抵达', '重逢', '邂逅', '约定', '回家'] },
                { n: '要去的方向，是有<span></span>的地方', m: ['家人', '朋友', '闺蜜', '兄弟', '挚爱'] }
            ]
        },

        {
            n: '比赛', title: '比赛宣言', m: [
                { n: '期待你创造新的<span></span>', m: ['记录', '荣耀', '传奇', '故事', '篇章'] },
                { n: '下赛道，<span></span>！', m: ['一决高下', '实力说话', '创造传奇', '极速竞技', '挑战极限'] }
            ]
        },

        {
            n: '成长', title: '成长宣言', m: [
                { n: '一生中一定要有一次<span></span>', m: ['热恋', '旅行', '奋不顾身', '独处', '任性'] },
                { n: '成长的乐趣是实现<span></span>的梦想', m: ['儿时', '青春', '看似幼稚', '小小', '不切实际'] }
            ]
        },

        {
            n: '梦想', title: '梦想宣言', m: [
                { n: '一部车，<span></span>，就是心之所向', m: ['一片星空', '一个梦想', '一座岛屿', '一份自由', '一个终点'] },
                { n: '我的梦想，在<span></span>', m: ['赛场', '舞台', '路上', '远方', '故乡'] }
            ]
        },

        {
            n: '自定义', m: 'other'
        }
    ]

    var city = [
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

    self.template = {
        loading: '<div class="loading"><span></span></div>',
        pageSwiper:
            '<div class="declaration jsfix" data-size="no"></div>\
            <div class="swiper-container" id="pageSwiper">\
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
                <div><input type="text"></div>\
            </div>',
        customThemeSwiper:
            '<div class="swiper-slide customThemeSwiper">\
                <div class="header">打造专属霸屏</div>\
                <div><input type="text"></div>\
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

















