(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (path) {
            this.path = path;
        },
        times: [],
        lyrics: [],
        index: -1,
        parseLyric: function (data) {
            var $this = this;
            var array = data.split('\n');
            var timeReg = /\[(\d*:\d*\.\d*)\]/;
            //遍历取出每一条歌词
            $.each(array, function (index, ele) {
                // 处理歌词
                var lrc = ele.split(']')[1];
                if (lrc.length <= 1) {
                    return true;
                }
                $this.lyrics.push(lrc);
                // console.log(ele);
                //正则表达式匹配时间
                var res = timeReg.exec(ele);
                // console.log(res);
                if (res == null) {
                    return true;
                }
                var timeStr = res[1];  //00:00.92
                var res2 = timeStr.split(':');
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min + sec).toFixed(2));
                // console.log();
                $this.times.push(time);


            })
            console.log(this.times);
            console.log(this.lyrics);
        },
        loadLyric: function (callBack) {
            var $this = this;
            $this.times = [];
            $this.lyrics = [];
            $.ajax({
                url: $this.path,//文件位置
                dataType: "text",//文件类型
                success: function (data) {//加载成功
                    // console.log(data);
                    $this.parseLyric(data);
                    callBack()

                },
                error: function (e) {//加载失败
                    // console.log(e);
                },

            });
        },
        currentIndex: function (currentTime) {
            // console.log(currentTime + '+++');
            if (currentTime >= this.times[0]) {
                // console.log(currentTime + '---' + this.times[0]);
                this.index++;
                this.times.shift(); //删除第一个元素
                //  
            }
            return this.index;
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);