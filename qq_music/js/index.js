$(function () {
    var $audio = $('audio');
    var player = new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;
    // 加载歌曲列表
    getPlayerList();
    function getPlayerList() {
        $.ajax({
            url: "./musiclist.json",//文件位置
            dataType: "json",//文件类型
            success: function (data) {//加载成功
                // console.log(data);
                // 遍历获取的数据 创建音乐
                player.musicList = data;
                var $musiclist = $('.content_list ul');
                $.each(data, function (index, ele) {
                    var $item = createMusicItem(index, ele);
                    // console.log($item);
                    $musiclist.append($item);
                });
                initMusicInfo(data[0]); //初始化 第0首歌曲
                initMusicLyric(data[0]); //初始化 歌词信息


            },
            error: function (e) {//加载失败
                // console.log(e);
            }
        });
    }

    //初始化歌曲信息
    function initMusicInfo(music) {
        var $musicImage = $(".song_info_pic img");
        var $musicName = $(".song_info_name a");
        var $musicSinger = $(".song_info_singer a");
        var $musicAlbum = $(".song_info_album a");
        var $musicProgressName = $('.music_progress_name');
        var $musicProgressTime = $('.music_progress_time');
        var $miusBg = $('.mask_bg');

        $musicImage.attr('src', music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAlbum.text(music.album);
        $musicProgressName.text(music.name + " / " + music.singer);
        $musicProgressTime.text("00:00 / " + music.time);
        $miusBg.css({
            background: 'url(' + music.cover + ')'
        })

    }

    //初始化歌词信息
    function initMusicLyric(music) {
        lyric = new Lyric(music.link_lrc);
        var $lyricContainer = $('.song_lyric');
        $lyricContainer.html('');
        lyric.loadLyric(function () {
            $.each(lyric.lyrics, function (index, ele) {
                var $item = $("<li>" + ele + "</li>");
                // console.log($item.text());
                $lyricContainer.append($item);

            })
        });
    }

    //初始化进度条
    initProgress();
    function initProgress() {
        var $progressBar = $(".music_progress_bar");
        var $progressLine = $(".music_progress_line");
        var $progressDot = $(".music_progress_dot");

        progress = new Progress($progressBar, $progressLine, $progressDot);
        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value);
        });

        var $voiceBar = $(".music_voice_bar");
        var $voiceLine = $(".music_voice_line");
        var $voiceDot = $(".music_voice_dot");
        voiceProgress = new Progress($voiceBar, $voiceLine, $voiceDot);
        voiceProgress.progressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function (value) {
            player.musicVoiceSeekTo(value);
        });
    }

    // 创建一条音乐
    function createMusicItem(index, music) {
        var $item = $(`                        
        <li class="list_music">
            <div class="list_check">
                <i></i>
            </div>
            <div class="list_number">${index + 1}</div>
            <div class="list_name">${music.name}
                <div class="list_menu">
                    <a href="javascript:;" title="播放" class="list_menu_play"></a>
                    <a href="javascript:;" title="添加"></a>
                    <a href="javascript:;" title="下载"></a>
                    <a href="javascript:;" title="分享"></a>
                </div>
            </div>
            <div class="list_singer">${music.singer}</div>
            <div class="list_time">
                <span>${music.time}</span>
                <a href="javascript:;" title="删除" class="list_menu_del"></a>
            </div>
        </li>`);
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }

    // 事件监听
    initEvents();
    function initEvents() {
        //事件的监听
        //自定义滚动条
        $('.content_list').mCustomScrollbar()

        // 歌曲移入移出监听
        $('.content_list').on('mouseenter', '.list_music', function () {
            $(this).find('.list_menu').stop().show();
            $(this).find('.list_time>span').stop().hide();
            $(this).find('.list_time>a').stop().show();

        });
        $('.content_list').on('mouseleave', '.list_music', function () {
            $(this).find('.list_menu').stop().hide();
            $(this).find('.list_time>span').stop().show();
            $(this).find('.list_time>a').stop().hide();

        });


        // 监听复选框的点击
        $(".content_list").on('click', '.list_check', function () {
            $(this).toggleClass('list_checked');


        });

        // 子菜单播放按钮监听
        var $musicPlay = $('.music_play');
        $(".content_list").on('click', '.list_menu_play', function () {
            var $item = $(this).parents('.list_music');
            // console.log($($item).get(0).index);
            $(this).toggleClass('list_menu_play2');
            $(this).parents('.list_music').siblings().find('.list_menu_play').removeClass('list_menu_play2')
            if ($(this).attr('class').indexOf('list_menu_play2') != -1) {
                $musicPlay.addClass('music_play2');

                $item.find('div').css('color', "#fff");
                $item.siblings().find('div').css('color', "rgba(255,255,255,.5)");

                $item.find('.list_number').addClass("list_number2");
                $item.siblings().find('.list_number').removeClass("list_number2");
            } else {
                $musicPlay.removeClass('music_play2');
                $item.find('div').css('color', "rgba(255,255,255,.5)");
                $item.find('.list_number').removeClass("list_number2");
            }
            player.playMusic($item.get(0).index, $item.get(0).music);
            initMusicInfo($item.get(0).music);
            initMusicLyric($item.get(0).music);
        });

        // 底部控制区域
        //上一首
        $(".music_pre").click(function () {
            $('.list_music').eq(player.preIndex()).find('.list_menu_play').trigger('click');
        });

        //播放
        $musicPlay.on('click', function () {
            //有无播放过音乐
            // alert(1);
            if (player.currentIndex == -1) {
                //没有
                $('.list_music').eq(0).find('.list_menu_play').trigger('click');
                // console.log("wu", player.currentIndex);
            } else {
                //有
                $('.list_music').eq(player.currentIndex).find('.list_menu_play').trigger('click');
                // console.log("you", player.currentIndex);
            }
            // initMusicLyric();
        });

        //下一首
        $(".music_next").click(function () {
            $('.list_music').eq(player.nextIndex()).find('.list_menu_play').trigger('click');
        })

        //删除歌曲
        $(".content_list").on('click', '.list_menu_del', function () {
            // alert(1);
            var $item = $(this).parents('.list_music');
            //判断当前删除的是否是正在播放的
            if ($item.get(0).index == player.currentIndex) {
                $(".music_next").trigger('click');
            }
            $item.remove();
            player.changeMusic($item.get(0).index);

            //重新排序
            $('.list_music').each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
            })
        });

        //播放进度
        player.musicTimeUpdate(function (currentTime, duration, timeStr) {
            $(".music_progress_time").text(timeStr);

            var value = currentTime / duration * 100;
            progress.setProgress(value);

            //实现歌词同步
            var index = lyric.currentIndex(currentTime);
            var $item = $(".song_lyric li").eq(index);
            console.log(index);
            $item.addClass('cur').siblings().removeClass('cur');
            if (index <= 2) return;
            $(".song_lyric").css({
                marginTop: (-index + 2) * 30
            });
            // console.log($(".song_lyric").css('marginTop'));
        });

        //声音按钮
        $(".music_voice_icon").click(function () {
            //图标切换
            $(this).toggleClass('music_voice_icon2');
            //静音切换
            if ($(this).attr('class').indexOf('music_voice_icon2') != -1) {
                //变为静音
                player.musicVoiceSeekTo(0);
            } else {
                //开启声音
                player.musicVoiceSeekTo(1);
            }
        });
    }






});