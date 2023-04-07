/*
 * chrome插件
 */ 


function getVideoElement() {
    return document.querySelector('video');
}

// Path: src\video.js
// 获取youtube 的视频元素
function getVideo() {
    // 获取 streamingData 中的流数据
    var streamingData = window.ytplayer.config.args.raw_player_response.streamingData;
    // 获取视频的url 列表
    var urlArr = streamingData.adaptiveFormats;

    // // 输出每个视频的清晰度
    for (var i = 0; i < urlArr.length; i++) {
        var url = urlArr[i].url;
        var quality = urlArr[i].quality;
        console.log(quality, url);
    }
    
    // 创建一个video元素
    // var videoElement = document.createElement('video');
    // // 设置video元素的src属性
    // videoElement.src = url;
    // // 设置video元素的autoplay属性
    // videoElement.autoplay = true;
    // // 设置video元素的loop属性
    // videoElement.loop = true;
    // // 设置video元素的controls属性
    // videoElement.controls = true;
    // // 设置video元素的muted属性
    // videoElement.muted = true;
    // // 设置video元素的volume属性
    // videoElement.volume = 0;
    // // 设置video元素的style属性
    // videoElement.style.display = 'none';
    // // 将video元素添加到body中
    // document.body.appendChild(videoElement);
    // // 返回video元素
    // return videoElement;
}


// 将视频元素中的音频元素提取出来
function getAudioElement(videoElement) {
    // 创建一个audio元素
    var audioElement = document.createElement('audio');
    // 设置audio元素的src属性
    audioElement.src = videoElement.src;
    // 设置audio元素的autoplay属性
    audioElement.autoplay = true;
    // 设置audio元素的loop属性
    audioElement.loop = true;
    // 设置audio元素的controls属性
    audioElement.controls = true;
    // 设置audio元素的muted属性
    audioElement.muted = true;
    // 设置audio元素的volume属性
    audioElement.volume = 0;
    // 设置audio元素的style属性
    audioElement.style.display = 'none';
    // 将audio元素添加到body中
    document.body.appendChild(audioElement);
    // 返回audio元素
    return audioElement;
}

// 监听播放进度
function listenProgress(videoElement) {
    videoElement.addEventListener('timeupdate', function () {
        var currentTime = videoElement.currentTime;
        var duration = videoElement.duration;
        var progress = currentTime / duration;
        // 输出当前时间和进度百分比, 例如: 10 0.1
        console.log(currentTime, progress);
    });
}

// 监听播放结束
function listenEnded(videoElement) {
    videoElement.addEventListener('ended', function () {
        console.log('ended');
    });
}

// 监听播放错误
function listenError(videoElement) {
    videoElement.addEventListener('error', function () {
        console.log('error');
    });
}

// 监听播放暂停
function listenPause(videoElement) {
    videoElement.addEventListener('pause', function () {
        console.log('pause');

        // getVideo();
    });
}

// 监听播放开始
function listenPlay(videoElement) {
    videoElement.addEventListener('play', function () {
        console.log('play');
    });
}


// 下载音频
function downloadAudio(audioElement) {
    // 获取音频的blob数据
    var blob = new Blob([audioElement], { type: 'audio/mpeg' });
    // 创建一个a标签
    var a = document.createElement('a');
    // 设置a标签的下载地址
    a.href = URL.createObjectURL(blob);
    // 设置a标签的下载文件名
    a.download = 'test.mp3';
    // 触发a标签的点击事件
    a.click();
}

// 获取视频的标题
function getVideoTitle() {
    // 获取页面标签标题
    var title = document.title;
    console.log(title);
}

// 检测到是youtube的网站的时候才启用插件
if (window.location.href.indexOf('youtube.com') > -1) {
    const token = chrome.runtime.id + ':' + performance.now() + ':' + Math.random();
    window.addEventListener(token, e => {
        // console.log('gotPlayerArgs', e.detail);
        chrome.runtime.sendMessage({
            action: 'gotPlayerArgs',
            data: e.detail,
        });
    }); 

    const script = document.createElement('script');
    script.textContent = '(' + (token => {
        const origOpen = XMLHttpRequest.prototype.open;
        const dispatch = data => window.dispatchEvent(new CustomEvent(token, {detail: data}));
        const onLoad = e => {
            const json = e.target.response;
            const player = (Array.isArray(json) && json.find(_ => _.player) || {}).player || {};
            dispatch(player.args);
            console.log('player.args', player.args);
        };
        // get the initial config
        try {
            dispatch(window.ytplayer.config.args);   
        } catch (e) {}
            // intercept the subsequent config queries
            XMLHttpRequest.prototype.open = function (method, url) {
            if (url.startsWith('https://www.youtube.com/watch?')) {
                this.addEventListener('load', onLoad);
            }
            return origOpen.apply(this, arguments);
        };
    }) + `)("${token}")`;
    document.documentElement.appendChild(script);
    script.remove();
}

    // var videoElement = getVideoElement();
    // getVideoTitle();
    // // 监听播放进度
    // listenProgress(videoElement);
    // // 监听播放结束
    // listenEnded(videoElement);
    // // 监听播放错误
    // listenError(videoElement);
    // // 监听播放暂停
    // listenPause(videoElement);
    // // 监听播放开始
    // listenPlay(videoElement);
//     // 获取音频元素
//     var audioElement = getAudioElement(videoElement);
//     // 下载音频
//     downloadAudio(audioElement);
// }