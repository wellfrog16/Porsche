require.config(
{
    baseUrl: "js/lib",
    map: {
            '*': {
                'css': 'css.min'
            }
    },

    paths: {
        'swiper': 'swiper-3.4.2.jquery.min',
        //'swiper': 'swiper.jquery.min',
        'jquery': 'jquery-3.1.0.min',
        'createjs': 'createjs-2015.11.26.min',
        'weixin': '//res.wx.qq.com/open/js/jweixin-1.0.0'
    },

    shim: {
        'swiper': ['css!swiper-3.4.2.min.css'],
        'jquery': {  // 用依赖来加载插件
            deps: [
                'jquery-3.1.0.min',
                'jquery.hammer',
                //'jquery.cookie',

                // 临时加载createjs
                //'createjs-2015.11.26.min'
            ]
        }
    },
    waitSeconds: 60
});


require(["jquery", 'script', 'view', 'tools'], function ($, script, view, tools) {

    // 禁止拉动
    $("body").on("touchmove", function (e) {
        e.preventDefault();
    });

    // 
    //$("body").on("touchstart", function (e) {
    //    e.preventDefault();
    //});
    var words = tools.getUrlParam('words');

    if (words == null || words == '') {
        script.open();
    }
    else {
        view.open();
    }
    
});