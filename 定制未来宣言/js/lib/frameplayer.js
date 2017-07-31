define(['jquery'], function ($) {

    /************************************************************
    { 
        target: 对象,
        total : 总帧数,
        row : 一行几个,
        fps: 每秒帧数,
        scale: 缩放倍数，默认  1
        baseWidth : 640
        loop : 是否循环,
        loopDelay : 循环间隔帧数，默认0,
        loopTimes : 循环次数，默认 无限,
        finishedCallback: 回调,
        loopCallback: 循环回调,
        autoSize: 自适应，默认true
    }
    ***********************************************************/
    var self = function (args) {
        var scale = args.scale || 1,
            baseScale = document.documentElement.clientWidth / (args.baseWidth || 640);

        args.width = args.width || args.target.width();
        args.height = args.height || args.target.height();
        args.loopDelay = args.loopDelay || 0;
        args.loopTimes = args.loopTimes || -1;
        args.autoSize = args.autoSize == undefined ? true : args.autoSize;

        // 如果非自适应，将基础缩放定为1
        if (!args.autoSize) {
            baseScale = 1;
        }
        
        //if (args.autoSize)

        // 内部变量
        args.times = args.times || 0;

        args.target.css("transform", "scale(" + baseScale * scale + ")");
        args.target.css("background-size", args.row * 100 + '%');
        args.target.css('background-position', '0 0');
        //args.target.css("transform-origin", '0px 0px 0px');
        args.target.show();

        var num = 0, delay = args.loopDelay;
        var timer = setInterval(function () {

            //if (num++ < 0) { console.log(num); return }

            if (num++ >= args.total - 1) {

                // 有循环，且有循环回调，优先执行
                if (args.loop && args.loopCallback && delay == args.loopDelay) {
                    args.loopCallback(++args.times);

                    // 有循环次数，则次数到达后退出
                    if (args.times == args.loopTimes) {
                        clearInterval(timer);

                        // 执行结束回调
                        if (args.finishedCallback) { args.finishedCallback(); }

                        // 结束函数
                        return;
                    }
                }

                // 延迟，空执行
                if (delay > 0) {
                    delay--;
                    return;
                }

                // 有循环
                if (args.loop) {
                    args.target.css('background-position', '0 0');
                    num = 0;
                    delay = args.loopDelay;
                }


                // 无循环
                if (!args.loop) { clearInterval(timer); }

                // 无循环，且有 结束回调
                if (!args.loop && args.finishedCallback) { args.finishedCallback(); }
            }
            else {
                var x = args.width * (num % args.row) * -1,
                    y = args.height * parseInt(num / args.row) * -1

                args.target.css('background-position', x + 'px ' + y + 'px');
            }
        }, 1000 / args.fps)

        return timer;
    }

    return self;

});