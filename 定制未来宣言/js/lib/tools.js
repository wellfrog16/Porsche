define(['jquery'], function ($) {

    var self = {}

    // 获得url参数
    self.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURIComponent(r[2]); return null; //返回参数值
    }

    // 移动设备简单判断
    self.device = (function () {
        return /android/.test(navigator.userAgent.toLowerCase()) ? 'android' : 'iphone'
    })();

    // 是否PC端简单判断
    self.isPC = (function () {
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (navigator.userAgent.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    })();


    // 坐标修正
    self.fixPosition = function (baseWidth) {
        var scaleNum = document.documentElement.clientWidth / baseWidth;
        var ele = $('.jsfix');

        ele.each(function () {
            var o = $(this),
                fix = o.attr('data-fixPosi') || 'top-left',     // 需要调整的方向，默认top-left
                size = o.attr('data-size') || 'yes';         // 是否需要大小调整，默认yes

            var fixArray = fix.split('-');

            if (size == 'yes') { fixArray.push('width', 'height'); }

            $.each(fixArray, function (index, item) {
                o.css(item, scaleNum * parseInt(o.css(item)));
            });
        });
    }

    return self;

});