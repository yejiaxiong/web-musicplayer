(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex: -1,
        playMusic: function (index, music) {
            // 判断是否是同一首音乐
            if (this.currentIndex == index) {
                //同
                if (this.audio.paused) {
                    this.audio.play();
                    console.log('播放');
                } else {
                    this.audio.pause();
                    console.log('暂停');
                }
            } else {
                //不同
                this.$audio.attr('src', music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex: function () {
            var index = this.currentIndex - 1;
            if (index < 0)
                index = this.musicList.length - 1;
            return index;
        },
        nextIndex: function () {
            var index = this.currentIndex + 1;
            if (index > this.musicList.length - 1)
                index = 0;
            return index;
        },
        changeMusic: function (index) {
            this.musicList.splice(index, 1);
            //删除的是否是正在播放的音乐之前的
            if (index < this.currentIndex) {
                this.currentIndex -= 1;
            }
        },

        formatDate: function (currentTime, duration) {
            var endMin = parseInt(duration / 60);
            var endSec = parseInt(duration % 60);
            endMin = endMin > 10 ? endMin : '0' + endMin;
            endSec = endSec > 10 ? endSec : '0' + endSec;

            var startMin = parseInt(currentTime / 60);
            var startSec = parseInt(currentTime % 60);
            startMin = startMin > 10 ? startMin : '0' + startMin;
            startSec = startSec > 10 ? startSec : '0' + startSec;

            return startMin + ':' + startSec + '/' + endMin + ':' + endSec

        },
        musicTimeUpdate: function (callback) {
            var $this = this;
            this.$audio.on('timeupdate', function () {
                // console.log(player.getMusicCurrentTime());
                var duration = $this.audio.duration || '0';
                var currentTime = $this.audio.currentTime || '0';
                var timeStr = $this.formatDate(currentTime, duration);
                callback(currentTime, duration, timeStr);
            })
        },
        musicSeekTo: function (value) {
            if (isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        musicVoiceSeekTo: function (value) {
            //value 0 ~ 1
            if (isNaN(value)) return;
            if (value >= 0 && value <= 1) {
                this.audio.volume = value;
                console.log(this.audio.volume)
            }
        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);