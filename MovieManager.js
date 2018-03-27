//=============================================================================
// MovieManager.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.4 2018/03/28 ムービー再生後、ロード完了前にムービーを停止するとムービーが停止されない問題を修正
// 1.0.3 2018/03/27 Saba_SimpleScenario.jsとの競合を解消（こちらの設定で上書き）
// 1.0.2 2018/01/30 ヘルプの記述を修正
// 1.0.1 2016/06/24 メニューを開いたときに最後に表示していたムービーが写り込む不具合を修正
// 1.0.0 2016/06/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 動画管理プラグイン
 * @author トリアコンタン
 *
 * @help イベントコマンド「ムービーの再生」で再生できる動画をピクチャのように
 * コントロールできるようになります。
 * 座標や拡大率はもちろん、ループ可否や再生速度を自由に調整可能です。
 * イベントコマンド「ムービーの再生」後に以下のプラグインコマンドを実行します。
 * （大抵のコマンドは「ムービーの再生」前でも機能しますが「MM_ウェイト」のみ
 * 　「ムービーの再生」前では機能しません）
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * すべてのプラグインコマンドはムービーが再生中でなくても有効です。
 *
 * MM_移動_座標 [X座標] [Y座標] [移動時間(f)] [待ちフラグ(ON/OFF)]
 *  ムービーの表示座標を時間を掛けて変更します。
 *  下記の例は、座標[100:100]に[60]フレーム掛けて移動し、処理中はウェイトします。
 *  ex:MM_移動_座標 100 100 60 ON
 *
 * MM_移動_拡大率 [X拡大率(100%)] [Y拡大率(100%)] [時間(f)] [待ちフラグ(ON/OFF)]
 *  ムービーの拡大率を時間を掛けて変更します。
 *  下記の例は、縦横の拡大率を[50%]に60フレーム掛けて縮小し、
 *  処理中はウェイトしません。
 *  ex:MM_移動_拡大率 50 50 60
 *
 * MM_移動_不透明度 [不透明度(0-256)] [時間(f)] [ウェイトフラグ(ON/OFF)]
 *  ムービーの不透明度を時間を掛けて変更します。
 *  下記の例は、不透明度が変数[1]の値に即座に変更されます。
 *  ex:MM_移動_不透明度 \v[1] 0 ON
 *
 * MM_設定_再生速度 [再生速度(標準:1.0)]
 *  ムービーの再生速度倍率を変更します。
 *  下記の例は、再生速度が1.5倍になります。
 *  ex:MM_設定_再生速度 1.5
 *
 * MM_設定_再生位置 [再生位置(S)]
 *  ムービーの再生位置を変更します。
 *  ただしChromeの場合ロードしていない位置に移動すると再生が終了してしまうため
 *  使用には注意が必要です。(2016/06/12時点での最新版で確認)
 *  下記の例は、100秒目の再生位置にジャンプします。
 *  ex:MM_設定_再生位置 100
 *
 * MM_設定_画面に合わせる [設定値(ON/OFF)]
 *  ONにすると拡大率が100%の状態でムービーのサイズが画面にフィットするように
 *  調整されます。OFFにすると元の動画ファイルのサイズに合わせます。
 *  ex:MM_設定_画面に合わせる ON
 *
 * MM_設定_ループ [設定値(ON/OFF)]
 *  ONにすると、再生終了後に最初からループ再生します。
 *  ex:MM_設定_ループ ON
 *
 * MM_一時停止
 *  再生を一時停止します。
 *  ex:MM_一時停止
 *
 * MM_再生
 *  一時停止した状態から再生します。初回はイベントコマンドだけで再生されるので
 *  このコマンドの実行は不要です。
 *  ex:MM_再生
 *
 * MM_停止
 *  再生を終了してムービーを消去します。
 *  ex:MM_停止
 *
 * MM_ウェイト
 *  ムービーの再生が終了するまでイベント実行を待機します。
 *  ループ再生している場合はゲームの進行が停止するので注意してください。
 *  このコマンドはイベント「ムービーの再生」の直後に実行してください。
 *  ex:MM_ウェイト
 *
 * スクリプトコマンド詳細
 *
 * MovieManager.isPlaying();
 * ムービーが再生中の場合にtrueを返します。
 *
 * 制約事項
 * 現状、ムービーの表示状態はセーブできません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/**
 * 動画管理モジュールです。
 * @constructor
 */
function MovieManager() {
    throw new Error('This is a static class');
}

(function() {
    'use strict';
    var metaTagPrefix = 'MM_';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgFloat = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseFloat(convertEscapeCharactersAndEval(arg, true)) || 0).clamp(min, max);
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    var getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON';
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
        var windowLayer = SceneManager._scene._windowLayer;
        if (windowLayer) {
            var result = windowLayer.children[0].convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
    };

    //=============================================================================
    // Bitmap
    //  キャプチャに表示中のムービーを含めます。
    //=============================================================================
    var _Bitmap_snap = Bitmap.snap;
    Bitmap.snap      = function(stage) {
        var bitmap = _Bitmap_snap.apply(this, arguments);
        if (Graphics.isVideoPlaying()) {
            var video  = Graphics.getVideo();
            bitmap.context.drawImage(video, video.x, video.y, video.width, video.height);
        }
        return bitmap;
    };

    //=============================================================================
    // Graphics
    //  ムービー再生に必要なタグを動的に生成します。
    //=============================================================================
    Graphics._videoScaleFitScreen = false;

    Graphics._createVideo = function() {
        this._videoFrame    = document.createElement('div');
        this._videoFrame.id = 'GameVideoFrame';
        this._video         = document.createElement('video');
        this._video.id      = 'GameVideo';
        this._videoVisible  = false;
        document.body.appendChild(this._videoFrame);
        this._videoFrame.appendChild(this._video);
        this.setVideoContentsPosition(0, 0);
        this.setVideoContentsScale(1.0, 1.0);
        this._updateVideo();
        this._centerElement(this._video);
        this._video.style.margin = 0;
        this._videoLoading       = false;
    };

    Graphics.getVideo = function() {
        return this._video;
    };

    var _Graphics_playVideo = Graphics.playVideo;
    Graphics.playVideo      = function(src) {
        _Graphics_playVideo.apply(this, arguments);
        this._videoLoading = true;
    };

    Graphics.stopVideo = function() {
        if (!this._isVideoVisible() && this.isVideoLoading()) {
            this._needVideoStop = true;
        }
        this._video.pause();
        this._updateVisibility(false);
    };

    Graphics.setVisibleMovie = function(value) {
        this._videoFrame.style.visibility = (value ? 'visible' : 'hidden');
    };

    Graphics.setVideoScaleFitScreen = function(value) {
        this._videoScaleFitScreen = value;
        this.setVideoContentsScale(this._video.scaleX, this._video.scaleY);
    };

    var _Graphics_isVideoPlaying = Graphics.isVideoPlaying;
    Graphics.isVideoPlaying      = function() {
        return _Graphics_isVideoPlaying.apply(this, arguments) || this.isVideoLoading();
    };

    Graphics.isVideoLoading = function() {
        return this._videoLoading;
    };

    Graphics._updateVisibility = function(videoVisible) {
        this._videoVisible           = videoVisible;
        this._video.style.visibility = (videoVisible ? 'visible' : 'hidden');
        this._videoLoading           = false;
    };

    Graphics._isVideoVisible = function() {
        return this._videoVisible;
    };

    var _Graphics__onVideoLoad = Graphics._onVideoLoad;
    Graphics._onVideoLoad      = function() {
        _Graphics__onVideoLoad.apply(this, arguments);
        if (this._needVideoStop) {
            this._needVideoStop = false;
            this.stopVideo();
        } else {
            this.setVideoContentsScale(this._video.scaleX, this._video.scaleY);
        }
    };

    var _Graphics__updateVideo = Graphics._updateVideo;
    Graphics._updateVideo      = function() {
        var prevVideo = this._video;
        this._video   = this._videoFrame;
        _Graphics__updateVideo.apply(this, arguments);
        this._video = prevVideo;
        this._updateVideoContents();
    };

    Graphics.setVideoContentsPosition = function(x, y) {
        this._video.x = x;
        this._video.y = y;
        this._updateVideoContents();
    };

    Graphics.setVideoContentsScale = function(scaleX, scaleY) {
        this._video.scaleX = scaleX;
        this._video.scaleY = scaleY;
        this._video.width  = (this._videoScaleFitScreen ? this._width : this._video.videoWidth) * scaleX;
        this._video.height = (this._videoScaleFitScreen ? this._height : this._video.videoHeight) * scaleY;
        this._updateVideoContents();
    };

    Graphics._updateVideoContents = function() {
        var video          = this._video;
        video.style.width  = video.width * this._realScale + 'px';
        video.style.height = video.height * this._realScale + 'px';
        video.style.left   = video.x * this._realScale + 'px';
        video.style.top    = video.y * this._realScale + 'px';
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix))) return;
        this.pluginCommandMovieManager(command.replace(metaTagPrefix, ''), args);
    };

    Game_Interpreter.prototype.pluginCommandMovieManager = function(command, args) {
        var waitTime = 0;
        switch (getCommandName(command)) {
            case '設定_ループ':
            case 'SETTING_LOOP':
                MovieManager.setLoop(getArgBoolean(args[0]));
                break;
            case '設定_画面に合わせる':
            case 'SETTING_FIT_SCREEN':
                MovieManager.setScaleFitScreen(getArgBoolean(args[0]));
                break;
            case '設定_再生速度':
            case 'SETTING_PLAY_RATE':
                MovieManager.setPlaybackRate(getArgFloat(args[0], 0));
                break;
            case '設定_再生位置':
            case 'SETTING_CURRENT_TIME':
                MovieManager.setCurrentTime(getArgFloat(args[0], 0));
                break;
            case '移動_不透明度':
            case 'MOVE_OPACITY':
                waitTime = getArgNumber(args[1], 0);
                MovieManager.moveOpacity(getArgNumber(args[0], 0, 256), waitTime);
                if (getArgBoolean(args[2])) this.wait(waitTime);
                break;
            case '移動_座標':
            case 'MOVE_POSITION':
                waitTime = getArgNumber(args[2], 0);
                MovieManager.movePosition(getArgNumber(args[0]), getArgNumber(args[1]), waitTime);
                if (getArgBoolean(args[3])) this.wait(waitTime);
                break;
            case '移動_拡大率':
            case 'MOVE_SCALE':
                waitTime = getArgNumber(args[2], 0);
                MovieManager.moveScale(getArgNumber(args[0]), getArgNumber(args[1]), waitTime);
                if (getArgBoolean(args[3])) this.wait(waitTime);
                break;
            case '停止':
            case 'STOP':
                MovieManager.stop();
                break;
            case 'ウェイト':
            case 'WAIT':
                this.setWaitMode('video');
                break;
            case '一時停止':
            case 'PAUSE':
                MovieManager.pause();
                break;
            case '再生':
            case 'PLAY':
                MovieManager.play();
                break;
        }
    };

    var _Game_Interpreter_command261      = Game_Interpreter.prototype.command261;
    Game_Interpreter.prototype.command261 = function() {
        var result = _Game_Interpreter_command261.apply(this, arguments);
        this._waitMode = '';
        $gameTemp.sabaWaitForMovieMode = 0;
        return result;
    };

    var _Game_Interpreter_command354 = Game_Interpreter.prototype.command354;
    Game_Interpreter.prototype.command354 = function() {
        MovieManager.stop();
        return  _Game_Interpreter_command354.apply(this, arguments);
    };

    //=============================================================================
    // SceneManager
    //  動画管理モジュールを操作します。
    //=============================================================================
    var _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize      = function() {
        _SceneManager_initialize.apply(this, arguments);
        MovieManager.initTarget();
    };

    var _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene      = function() {
        _SceneManager_updateScene.apply(this, arguments);
        MovieManager.update();
    };

    //=============================================================================
    // MovieManager
    //  動画管理モジュールです。
    //=============================================================================
    MovieManager.initTarget = function() {
        this._targetX          = this.getPositionX();
        this._targetY          = this.getPositionY();
        this._durationPosition = 0;
        this._targetScaleX     = this.getScaleX();
        this._targetScaleY     = this.getScaleY();
        this._durationScale    = 0;
        this._targetOpacity    = this.getOpacity();
        this._durationOpacity  = 0;
    };

    MovieManager.update = function() {
        this.updatePosition();
        this.updateScale();
        this.updateOpacity();
    };

    MovieManager.updatePosition = function() {
        if (this._durationPosition > 0) {
            var x = this.getPositionX();
            var y = this.getPositionY();
            var d = this._durationPosition;
            x     = (x * (d - 1) + this._targetX) / d;
            y     = (y * (d - 1) + this._targetY) / d;
            this.setPosition(x, y);
            this._durationPosition--;
        }
    };

    MovieManager.updateScale = function() {
        if (this._durationScale > 0) {
            var sx = this.getScaleX();
            var sy = this.getScaleY();
            var d  = this._durationScale;
            sx     = (sx * (d - 1) + this._targetScaleX) / d;
            sy     = (sy * (d - 1) + this._targetScaleY) / d;
            this.setScale(sx, sy);
            this._durationScale--;
        }
    };

    MovieManager.updateOpacity = function() {
        if (this._durationOpacity > 0) {
            var opacity = this.getOpacity();
            var d       = this._durationOpacity;
            opacity     = (opacity * (d - 1) + this._targetOpacity) / d;
            this.setOpacity(opacity);
            this._durationOpacity--;
        }
    };

    MovieManager.getVideo = function() {
        return Graphics.getVideo();
    };

    MovieManager.isPlaying = function() {
        return Graphics._isVideoVisible();
    };

    MovieManager.play = function() {
        if (!Graphics.isVideoLoading()) {
            this.getVideo().play();
        }
    };

    MovieManager.pause = function() {
        this.getVideo().pause();
    };

    MovieManager.stop = function() {
        Graphics.stopVideo();
        this.initTarget();
    };

    MovieManager.setLoop = function(value) {
        this.getVideo().loop = !!value;
    };

    MovieManager.getLoop = function() {
        return this.getVideo().loop;
    };

    MovieManager.setScaleFitScreen = function(value) {
        Graphics.setVideoScaleFitScreen(!!value);
    };

    MovieManager.setCurrentTime = function(value) {
        this.getVideo().currentTime = value;
    };

    MovieManager.getCurrentTime = function() {
        return this.getVideo().currentTime;
    };

    MovieManager.setPlaybackRate = function(value) {
        this.getVideo().playbackRate = value;
    };

    MovieManager.getPlaybackRate = function() {
        return this.getVideo().playbackRate;
    };

    MovieManager.moveOpacity = function(opacity, duration) {
        if (duration === 0) {
            this.setOpacity(opacity);
        } else {
            this._targetOpacity   = opacity;
            this._durationOpacity = duration;
        }
    };

    MovieManager.setOpacity = function(opacity) {
        var realOpacity = opacity / 256;
        if (realOpacity !== this.getOpacity()) {
            this.getVideo().style.opacity = String(realOpacity);
        }
    };

    MovieManager.getOpacity = function() {
        return this.getVideo().style.opacity * 256;
    };

    MovieManager.moveScale = function(scaleX, scaleY, duration) {
        if (duration === 0) {
            this.setScale(scaleX, scaleY);
        } else {
            this._targetScaleX  = scaleX;
            this._targetScaleY  = scaleY;
            this._durationScale = duration;
        }
    };

    MovieManager.setScale = function(scaleX, scaleY) {
        if (scaleX !== this.getScaleX() || scaleY !== this.getScaleY()) {
            Graphics.setVideoContentsScale(scaleX / 100, scaleY / 100);
        }
    };

    MovieManager.getScaleX = function() {
        return this.getVideo().scaleX * 100;
    };

    MovieManager.getScaleY = function() {
        return this.getVideo().scaleY * 100;
    };

    MovieManager.movePosition = function(x, y, duration) {
        if (duration === 0) {
            this.setPosition(x, y);
        } else {
            this._targetX          = x;
            this._targetY          = y;
            this._durationPosition = duration;
        }
    };

    MovieManager.setPosition = function(x, y) {
        if (this.getPositionX() !== x || this.getPositionY() !== y) {
            Graphics.setVideoContentsPosition(x, y);
        }
    };

    MovieManager.getPositionX = function() {
        return this.getVideo().x;
    };

    MovieManager.getPositionY = function() {
        return this.getVideo().y;
    };
})();
