// const { off } = require("process");

(function (window) {
    function Progress($progressBar, $progressLine, $progressDot) {
        return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        musicList: [],
        init: function ($progressBar, $progressLine, $progressDot) {
            this.progressBar = $progressBar;
            this.progressLine = $progressLine;
            this.progressDot = $progressDot;
        },
        isMove: false,
        progressClick: function (callBack) {
            var $this = this;
            //监听背景的点击
            this.progressBar.click(function (event) {
                //背景到窗口的距离
                var normalLeft = $(this).offset().left;
                //点击位置到窗口的距离
                var eventLeft = event.pageX;
                //设置前景宽度
                // alert(eventLeft - normalLeft);
                $this.progressLine.css('width', eventLeft - normalLeft + 'px')
                $this.progressDot.css('left', eventLeft - normalLeft + 'px')
                //进度条比例计算
                var value = (eventLeft - normalLeft) / $(this).width();
                callBack(value);
            })

        },
        progressMove: function (callBack) {

            var $this = this;
            var normalLeft;
            var eventLeft;
            //鼠标按下
            this.progressBar.mousedown(function () {
                $this.isMove = true; // 开启节流
                //背景到窗口的距离
                //鼠标移动
                normalLeft = $(this).offset().left;
                var barWidth = $(this).width();
                $(document).mousemove(function () {
                    //点击位置到窗口的距离
                    eventLeft = event.pageX;
                    //设置前景宽度
                    // alert(eventLeft - normalLeft);

                    var offset = eventLeft - normalLeft;
                    if (offset >= 0 && offset <= barWidth) {
                        $this.progressLine.css('width', offset + 'px')
                        $this.progressDot.css('left', offset + 'px')
                    } else if (offset < 0) {
                        $this.progressLine.css('width', 0 + 'px')
                        $this.progressDot.css('left', 0 + 'px')
                    } else {
                        $this.progressLine.css('width', barWidth + 'px')
                        $this.progressDot.css('left', barWidth + 'px')
                    }

                });
                //鼠标抬起
                $(document).mouseup(function () {
                    $(this).off('mousemove');
                    $this.isMove = false;
                    //进度条比例计算
                    var value = (eventLeft - normalLeft) / $this.progressBar.width();

                    callBack(value);
                    $(this).off('mouseup');
                })

            })
        },
        setProgress: function (value) {
            if (this.isMove) return;
            if (value < 0 || value > 100) return;
            this.progressLine.css({
                width: value + '%'
            });
            this.progressDot.css({
                left: value + '%'
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);