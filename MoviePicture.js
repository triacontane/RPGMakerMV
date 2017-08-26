//=============================================================================
// MoviePicture.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.1 2017/08/27 二連続で再生したときに動画の音量同期機能が正常に動作しない問題を修正
// 1.3.0 2017/08/26 動画の音量をいずれかのオーディオ音量と同期させる機能を追加
// 1.2.0 2017/08/18 動画の再生速度(倍率)を変更できるプラグインコマンドを追加
// 1.1.0 2017/08/09 アルファチャンネル付き動画の再生に対応（ただし特定の手順を踏む必要あり）
// 1.0.3 2017/08/08 エラー処理を追加
// 1.0.2 2017/08/07 環境に関する制約を追加
// 1.0.1 2017/08/07 リファクタリング（仕様の変更はなし）
// 1.0.0 2017/08/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MovieInScreenPlugin
 * @author triacontane
 *
 * @param MovieVolumeType
 * @desc 動画再生時に音声が含まれる場合、その音量を参照するオーディオ種別です。指定しない場合、常に100%で再生されます。
 * @default none
 * @type select
 * @option none
 * @option BGM
 * @option BGS
 * @option ME
 * @option SE
 *
 * @help Play movies using the picture display frame.
 * In addition to being subject to processing by moving and rotating pictures,
 * parallel playback of multiple videos
 * It will be possible. Also, the movie will be displayed at the bottom of
 * the window. However, it does not correspond to "color tone change of picture".
 *
 * This plugin can only be used with core script ver1.5.0 or later.
 *
 * Currently there is a problem that the video may not be played properly
 * with PC Firefox. For the time being we will only support local execution.
 *
 * After preparing movie files with plug-in command "MP_SET_MOVIE"
 * Please execute the event designation "Show Picture"
 * with the file designation empty.
 *
 * Plugin Command
 *
 * MP_SET_MOVIE file  # 動画ファイル[file]を準備します。
 * MP_動画設定 file   # 同上
 * MP_SET_LOOP 1 on   # ピクチャ番号[1]の動画がループ再生されます。
 * MP_ループ設定 1 on # 同上(offでループ再生を解除します)
 * MP_SET_PAUSE 1 on  # ピクチャ番号[1]の動画が一時停止します。
 * MP_ポーズ設定 1 on # 同上(offで再生を再開します)
 * MP_SET_WAIT 1      # ピクチャ番号[1]の動画が再生するまでイベントを待機します。
 * MP_ウェイト設定 1  # 同上
 * MP_SET_VOLUME 1 50 # ピクチャ番号[1]の動画の音量を50%に設定します。
 * MP_音量設定 1 50   # 同上
 * MP_SET_SPEED 1 150 # ピクチャ番号[1]の動画の再生速度を150%に設定します。
 * MP_速度設定 1 150  # 同上
 *
 * 動画音量種別を設定します。設定する内容はプラグインパラメータ「動画音量種別」と
 * 同じです。プラグインパラメータの設定より優先されます。
 * MP_音量種別設定 BGM
 * MP_SET_VOLUME_TYPE BGM
 *
 * 注意：
 * サイズの大きな動画を複数再生すると、パフォーマンスが低下する可能性があります。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 動画のピクチャ表示プラグイン
 * @author トリアコンタン
 *
 * @param 動画音量種別
 * @desc 動画再生時に音声が含まれる場合、その音量を参照するオーディオ種別です。指定しない場合、常に100%で再生されます。
 * @default none
 * @type select
 * @option none
 * @option BGM
 * @option BGS
 * @option ME
 * @option SE
 *
 * @help ピクチャの表示枠を使って動画を再生します。
 * ピクチャの移動や回転による処理の対象になるほか、複数の動画の並行再生が
 * 可能になります。また、動画がウィンドウの下に表示されるようになります。
 * ただし「ピクチャの色調変更」には対応していません。
 *
 * このプラグインはコアスクリプトver1.5.0以降でのみ使用できます。
 *
 * 現在、スマートデバイスで実行したときに動画が最初のフレームで停止する
 * 現象を確認しています。
 * よって当面の間はローカル実行(Game.exe)のみをサポート対象とします。
 *
 * プラグインコマンド「MP_SET_MOVIE」で動画ファイルを準備してから
 * イベントコマンド「ピクチャの表示」をファイル指定を空で実行してください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * MP_SET_MOVIE file  # 動画ファイル[file]を準備します。拡張子不要。
 * MP_動画設定 file   # 同上
 * MP_SET_LOOP 1 on   # ピクチャ番号[1]の動画がループ再生されます。
 * MP_ループ設定 1 on # 同上(offでループ再生を解除します)
 * MP_SET_PAUSE 1 on  # ピクチャ番号[1]の動画が一時停止します。
 * MP_ポーズ設定 1 on # 同上(offで再生を再開します)
 * MP_SET_WAIT 1      # ピクチャ番号[1]の動画が再生するまでイベントを待機します。
 * MP_ウェイト設定 1  # 同上
 * MP_SET_VOLUME 1 50 # ピクチャ番号[1]の動画の音量を50%に設定します。
 * MP_音量設定 1 50   # 同上
 * MP_SET_SPEED 1 150 # ピクチャ番号[1]の動画の再生速度を150%に設定します。
 * MP_速度設定 1 150  # 同上
 *
 * 動画音量種別を設定します。設定する内容はプラグインパラメータ「動画音量種別」と
 * 同じです。プラグインパラメータの設定より優先されます。
 * MP_音量種別設定 BGM
 * MP_SET_VOLUME_TYPE BGM
 *
 * アルファチャンネル付き動画を使用する場合は、以下に注意してください。
 * 1. 通常のGame.exeでは動作しません。NW.jsを最新化してください。
 *
 * 2. プラグインコマンド「MP_SET_MOVIE」実行時に二つめの引数をonにしてください。
 * MP_SET_MOVIE file on
 *
 * 3. スマートデバイス環境(.mp4を使用)では透過を使用できません。
 *    こちらはコーデック(H.264)の仕様なのでプラグイン側では対応できません。
 *
 * 注意：
 * サイズの大きな動画を複数再生すると、パフォーマンスが低下する可能性があります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'MoviePicture';
    var metaTagPrefix = 'MP_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    var convertAllArguments = function(args) {
        for (var i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var getArgBoolean = function(arg) {
        return arg && (arg.toUpperCase() === 'ON' || arg.toUpperCase() === 'TRUE');
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param             = {};
    param.movieVolumeType = getParamString(['MovieVolumeType', '動画音量種別']).toUpperCase();

    var pluginCommandMap = new Map();
    setPluginCommand('SET_MOVIE', 'execSetVideoPicture');
    setPluginCommand('動画設定', 'execSetVideoPicture');
    setPluginCommand('SET_LOOP', 'execSetVideoLoop');
    setPluginCommand('ループ設定', 'execSetVideoLoop');
    setPluginCommand('SET_SPEED', 'execSetVideoSpeed');
    setPluginCommand('速度設定', 'execSetVideoSpeed');
    setPluginCommand('SET_PAUSE', 'execSetVideoPause');
    setPluginCommand('ポーズ設定', 'execSetVideoPause');
    setPluginCommand('SET_WAIT', 'execSetVideoWait');
    setPluginCommand('ウェイト設定', 'execSetVideoWait');
    setPluginCommand('SET_VOLUME', 'execSetVideoVolume');
    setPluginCommand('音量設定', 'execSetVideoVolume');
    setPluginCommand('SET_VOLUME_TYPE', 'execSetVideoVolumeType');
    setPluginCommand('音量種別設定', 'execSetVideoVolumeType');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertAllArguments(args));
        }
    };

    Game_Interpreter.prototype.execSetVideoPicture = function(args) {
        $gameScreen.setVideoPictureName(args[0], getArgBoolean(args[1]));
    };

    Game_Interpreter.prototype.execSetVideoLoop = function(args) {
        var picture = $gameScreen.picture(getArgNumber(args[0]), 1);
        if (picture) {
            picture.setVideoLoop(getArgBoolean(args[1]));
        }
    };

    Game_Interpreter.prototype.execSetVideoPause = function(args) {
        var picture = $gameScreen.picture(getArgNumber(args[0]), 1);
        if (picture) {
            picture.setVideoPause(getArgBoolean(args[1]));
        }
    };

    Game_Interpreter.prototype.execSetVideoVolume = function(args) {
        var picture = $gameScreen.picture(getArgNumber(args[0]), 1);
        if (picture) {
            picture.setVideoVolume(getArgNumber(args[1], 0, 100));
        }
    };

    Game_Interpreter.prototype.execSetVideoVolumeType = function(args) {
        var picture = $gameScreen.picture(getArgNumber(args[0]), 1);
        if (picture) {
            picture.setVideoVolumeType(args[1]);
        }
    };

    Game_Interpreter.prototype.execSetVideoWait = function(args) {
        var picture = $gameScreen.picture(getArgNumber(args[0]), 1);
        if (picture) {
            picture.setVideoWait(true);
            this._waitMode = 'videoPicture';
        }
    };

    Game_Interpreter.prototype.execSetVideoSpeed = function(args) {
        var picture = $gameScreen.picture(getArgNumber(args[0]), 1);
        if (picture) {
            picture.setVideoSpeed(getArgNumber(args[1], 10, 500));
        }
    };

    var _Game_Interpreter_updateWaitMode      = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === 'videoPicture') {
            var waiting = $gameScreen.isVideoWaiting();
            if (!waiting) {
                this._waitMode = '';
            }
            return waiting;
        } else {
            return _Game_Interpreter_updateWaitMode.apply(this, arguments);
        }
    };

    //=============================================================================
    // Utils
    //  動作環境を判定します。
    //=============================================================================
    Utils.isPcChrome = function() {
        var agent = navigator.userAgent;
        return !!(!agent.match(/Android/) && agent.match(/Chrome/)) && !this.isNwjs();
    };

    //=============================================================================
    // Game_Screen
    //  動画ピクチャを準備します。
    //=============================================================================
    Game_Screen.prototype.setVideoPictureName = function(movieName, useAlpha) {
        this._videoPictureName = movieName;
        this._videoUseAlpha    = useAlpha;
    };

    Game_Screen.prototype.getVideoPictureName = function() {
        return this._videoPictureName;
    };

    Game_Screen.prototype.isVideoUseAlpha = function() {
        return this._videoUseAlpha;
    };

    Game_Screen.prototype.clearVideoPictureName = function() {
        this._videoPictureName = null;
        this._videoUseAlpha    = null;
    };

    Game_Screen.prototype.isVideoWaiting = function() {
        return this._pictures.some(function(picture) {
            return picture && picture.isVideoWait();
        });
    };

    //=============================================================================
    // Game_Picture
    //  動画ピクチャに関連するプロパティを追加定義します。
    //=============================================================================
    var _Game_Picture_show      = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        _Game_Picture_show.apply(this, arguments);
        var videoName = $gameScreen.getVideoPictureName();
        if (videoName && !name) {
            this._name          = videoName;
            this._video         = true;
            this._videoUseAlpha = $gameScreen.isVideoUseAlpha();
            this.setVideoVolume(100);
            this.setVideoVolumeType(param.movieVolumeType);
            $gameScreen.clearVideoPictureName();
        } else {
            this._video = false;
        }
    };

    Game_Picture.prototype.isVideo = function() {
        return this._video;
    };

    Game_Picture.prototype.isVideoUseAlpha = function() {
        return this._videoUseAlpha;
    };

    Game_Picture.prototype.setVideoLoop = function(value) {
        this._loopVideo = this.isVideo() && value;
    };

    Game_Picture.prototype.isVideoLoop = function() {
        return this._loopVideo;
    };

    Game_Picture.prototype.setVideoPause = function(value) {
        this._pauseVideo = this.isVideo() && value;
    };

    Game_Picture.prototype.isVideoPause = function() {
        return this._pauseVideo;
    };

    Game_Picture.prototype.setVideoWait = function(value) {
        this._waitVideo = this.isVideo() && value;
    };

    Game_Picture.prototype.isVideoWait = function() {
        return this._waitVideo;
    };

    Game_Picture.prototype.setVideoVolume = function(value) {
        this._volumeVideo = value;
    };

    Game_Picture.prototype.getVideoRealVolume = function() {
        return this._volumeVideo * AudioManager.getVideoPictureVolume(this._volumeVideoType);
    };

    Game_Picture.prototype.setVideoVolumeType = function(value) {
        this._volumeVideoType = value;
    };

    Game_Picture.prototype.setVideoSpeed = function(value) {
        this._speedVideo = value;
    };

    Game_Picture.prototype.getVideoSpeed = function() {
        return this._speedVideo || 100;
    };

    Game_Picture.prototype.setVideoPosition = function(value) {
        this._positionVideo = value;
    };

    Game_Picture.prototype.getVideoPosition = function() {
        return this._positionVideo || 0;
    };

    //=============================================================================
    // Sprite_Picture
    //  ムービーピクチャを読み込みます。
    //=============================================================================
    var _Sprite_Picture_loadBitmap      = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        if (this.picture().isVideo()) {
            this.loadVideo();
        } else {
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };

    Sprite_Picture.prototype.loadVideo = function() {
        if (SceneManager.isBattleStartUnexpectedLoad()) {
            return;
        }
        if (this.isVideoPicture()) {
            this.bitmap.destroy();
        }
        this.bitmap = ImageManager.loadVideo(this._pictureName, this.picture().isVideoUseAlpha());
        this.bitmap.addLoadListener(function() {
            this.startVideo();
        }.bind(this));
    };

    Sprite_Picture.prototype.startVideo = function() {
        this.refreshForVideo();
        this._playStart = true;
        var picture     = this.picture();
        if (picture) {
            this.bitmap.setCurrentTime(picture.getVideoPosition());
            this._volume = null;
            this.updateVideoVolume();
            this.bitmap.play();
        }
    };

    Sprite_Picture.prototype.refreshForVideo = function() {
        this._refresh();
    };

    var _Sprite_Picture_updateBitmap      = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        if (!this.picture()) {
            this.clearVideo();
        }
        _Sprite_Picture_updateBitmap.apply(this, arguments);
        this.updateVideo();
    };

    var _Sprite_Picture_setBlendColor      = Sprite_Picture.prototype.setBlendColor;
    Sprite_Picture.prototype.setBlendColor = function(color) {
        if (this.isVideoPicture()) return;
        _Sprite_Picture_setBlendColor.apply(this, arguments);
    };

    Sprite_Picture.prototype.updateVideo = function() {
        if (!this.isVideoPicture()) return;
        this.bitmap.update();
        if (this.bitmap.isEnded()) {
            this.eraseVideo();
            return;
        }
        if (this.picture() && this._playStart) {
            this.updateVideoSpeed();
            this.updateVideoPause();
            this.updateVideoVolume();
            this.updateVideoLoop();
            this.updateVideoWaiting();
        }
    };

    Sprite_Picture.prototype.updateVideoSpeed = function() {
        var speed = this.picture().getVideoSpeed() / 100;
        if (speed !== this._speed) {
            this._speed = speed;
            this.bitmap.setVideoSpeed(speed);
        }
    };

    Sprite_Picture.prototype.updateVideoPause = function() {
        var pause = this.picture().isVideoPause();
        if (this._pause && !pause) {
            this.bitmap.play();
        }
        if (!this._pause && pause) {
            this.bitmap.pause();
        }
        this._pause = pause;
    };

    Sprite_Picture.prototype.updateVideoLoop = function() {
        this.bitmap.setVideoLoop(this.picture().isVideoLoop());
    };

    Sprite_Picture.prototype.updateVideoVolume = function() {
        var volume = this.picture().getVideoRealVolume();
        if (volume !== this._volume) {
            this._volume = volume;
            this.bitmap.setVolume(volume / 100);
        }
    };

    Sprite_Picture.prototype.updateVideoWaiting = function() {
        var picture = this.picture();
        if (picture.isVideoWait() && !this.bitmap.isFirstLap()) {
            picture.setVideoWait(false);
        }
    };

    Sprite_Picture.prototype.eraseVideo = function() {
        this.clearVideo();
        if (this.picture()) {
            $gameScreen.erasePicture(this._pictureId);
            this.visible = false;
        }
        this._volume = null;
        this._speed  = null;
    };

    Sprite_Picture.prototype.clearVideo = function() {
        if (!this.isVideoPicture()) return;
        var picture = this.picture();
        if (picture) {
            picture.setVideoPosition(this.bitmap.getCurrentTime());
        }
        this.bitmap.destroy();
    };

    Sprite_Picture.prototype.isVideoPicture = function() {
        return this.bitmap && this.bitmap.isVideo();
    };

    //=============================================================================
    // Spriteset_Base
    //  再生中の動画をすべて破棄します。
    //=============================================================================
    Spriteset_Base.prototype.clearAllVideo = function() {
        this._pictureContainer.children.forEach(function(picture) {
            if (picture.clearVideo) {
                picture.clearVideo();
                picture.bitmap = null;
            }
        });
    };

    //=============================================================================
    // Scene_Base
    //  シーン遷移時に再生中の動画をすべて破棄します。
    //=============================================================================
    var _Scene_Base_terminate      = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        if (this._spriteset && this._spriteset instanceof Spriteset_Base) {
            this._spriteset.clearAllVideo();
        }
        _Scene_Base_terminate.apply(this, arguments);
    };

    //=============================================================================
    // ImageManager
    //  動画の読み込みを追加定義します。
    //=============================================================================
    ImageManager.loadVideo = function(filename, alpha) {
        if (filename) {
            var path = 'movies/' + encodeURIComponent(filename) + this.getVideoFileExt();
            return Bitmap_Video.load(path, false, this.getVideoClass(alpha));
        } else {
            return this.loadEmptyBitmap();
        }
    };

    ImageManager.getVideoClass = function(alpha) {
        if ((Utils.isNwjs() || Utils.isPcChrome()) && !alpha) {
            return Bitmap_Video;
        } else {
            return Bitmap_DrawVideo;
        }
    };

    ImageManager.getVideoFileExt = function() {
        if (Graphics.canPlayVideoType('video/webm')) {
            return '.webm';
        } else {
            return '.mp4';
        }
    };

    //=============================================================================
    // SceneManager
    //  戦闘開始時にマップピクチャが一瞬読み込まれてしまう現象を回避します
    //=============================================================================
    SceneManager.isBattleStartUnexpectedLoad = function() {
        return this._scene instanceof Scene_Battle && !$gameParty.inBattle()
    };

    //=============================================================================
    // AudioManager
    //  動画ピクチャの音量を取得します。
    //=============================================================================
    AudioManager._movieVolumePropertyMap = {
        BGM  : 'bgmVolume',
        BGS  : 'bgsVolume',
        ME   : 'meVolume',
        SE   : 'seVolume',
        VOICE: 'voiceVolume'
    };

    AudioManager.getVideoPictureVolume = function(volumeType) {
        var property = this._movieVolumePropertyMap[volumeType];
        return Graphics.getVideoVolume() * (property ? this[property] : 100) / 100;
    };

    //=============================================================================
    // Bitmap
    //  動画かどうかを判定します。
    //=============================================================================
    Bitmap.prototype.isVideo = function() {
        return false;
    };

    //=============================================================================
    // Bitmap_Video
    //  動画ビットマップクラスです。
    //=============================================================================
    function Bitmap_Video() {
        this.initialize.apply(this, arguments);
    }

    Bitmap_Video.prototype             = Object.create(Bitmap.prototype);
    Bitmap_Video.prototype.constructor = Bitmap_Video;

    Bitmap_Video.prototype.initialize = function() {
        Bitmap.prototype.initialize.call(this);
    };

    Bitmap_Video.prototype.isVideo = function() {
        return !!this._video;
    };

    Bitmap_Video.load = function(url, smooth, loadClass) {
        var bitmap    = Object.create(loadClass.prototype);
        bitmap._defer = true;
        bitmap.initialize();
        bitmap.smooth = smooth;
        bitmap._requestVideo(url);
        return bitmap;
    };

    Bitmap_Video.prototype.update = function() {
        if (!Utils.isPcChrome()) {
            this._baseTexture.update();
        }
    };

    Bitmap_Video.prototype.setVolume = function(volume) {
        this._video.volume = volume;
    };

    Bitmap_Video.prototype.pause = function() {
        this._video.pause();
    };

    Bitmap_Video.prototype.play = function() {
        this._video.play();
    };

    Bitmap_Video.prototype.destroy = function() {
        if (this.isReady()) {
            this.pause();
            this._video = null;
            this._baseTexture.destroy();
            this.__baseTexture = null;
        } else {
            this._loadingDestory = true;
        }
    };

    Bitmap_Video.prototype._requestVideo = function(url) {
        if (!this._loader) {
            this._loader = ResourceHandler.createLoader(url, this._requestVideo.bind(this, url), this._onError.bind(this));
        }
        this._createVideo(url);
        this._createVideoBaseTexture();
        this._loadingState = 'requesting';
    };

    Bitmap_Video.prototype._createVideo = function(url) {
        this._video     = document.createElement('video');
        this._video.src = url;
        this._video.addEventListener('canplaythrough', this._loadListener = this._onLoad.bind(this));
        this._video.addEventListener('ended', this._endedListener = this._onEnded.bind(this));
        this._video.addEventListener('error', this._errorListener = this._loader || this._onError.bind(this));
        this._video.load();
        this._video.autoplay = false;
        this._loadingState   = 'requesting';
    };

    Bitmap_Video.prototype._createVideoBaseTexture = function() {
        var scaleMode              = this.smooth ? PIXI.SCALE_MODES.LINEAR : PIXI.SCALE_MODES.NEAREST;
        this.__baseTexture         = PIXI.VideoBaseTexture.fromVideo(this._video, scaleMode);
        this._baseTexture.autoPlay = false;
    };

    Bitmap_Video.prototype._onLoad = function() {
        this._loadingState = 'loaded';
        if (!this._video) {
            return;
        }
        if (this._loadingDestory) {
            this.destroy();
            return;
        }
        var width  = this._video.videoWidth;
        var height = this._video.videoHeight;
        this.resize(width, height);
        this._callLoadListeners();
    };

    Bitmap_Video.prototype._onEnded = function() {
        this._firstLapEnded = true;
        if (!this._video.loop) {
            this._ended = true;
        }
    };

    Bitmap_Video.prototype._onError = function() {
        this._video.removeEventListener('load', this._loadListener);
        this._video.removeEventListener('ended', this._endedListener);
        this._video.removeEventListener('error', this._errorListener);
        this._loadingState = 'error';
    };

    Bitmap_Video.prototype.isFirstLap = function() {
        return !this._firstLapEnded;
    };

    Bitmap_Video.prototype.isEnded = function() {
        return this._ended;
    };

    Bitmap_Video.prototype.setVideoLoop = function(loop) {
        this._video.loop = loop;
    };

    Bitmap_Video.prototype.setCurrentTime = function(value) {
        this._video.currentTime = value;
    };

    Bitmap_Video.prototype.getCurrentTime = function() {
        return this._video.currentTime;
    };

    Bitmap_Video.prototype.setVideoSpeed = function(value) {
        this._video.playbackRate = value;
    };

    //=============================================================================
    // Bitmap_DrawVideo
    //  drawImageで実装する動画ビットマップクラスです。
    //=============================================================================
    function Bitmap_DrawVideo() {
        this.initialize.apply(this, arguments);
    }

    Bitmap_DrawVideo.prototype             = Object.create(Bitmap_Video.prototype);
    Bitmap_DrawVideo.prototype.constructor = Bitmap_DrawVideo;

    Bitmap_DrawVideo.prototype._createVideoBaseTexture = function() {
        // do nothing
    };

    Bitmap_DrawVideo.prototype.update = function() {
        if (this.isHalfRefreshRateSize() && Graphics.frameCount % 2 !== 0) {
            return;
        }
        if (this.getCurrentTime() > 0) {
            this.clear();
        }
        this._context.drawImage(this._video, 0, 0, this.width, this.height);
        this._baseTexture.update();
    };

    Bitmap_DrawVideo.prototype.isHalfRefreshRateSize = function() {
        return this.width * this.height > 1000000;
    };

    //=============================================================================
    // Graphics
    //  動画の音量を取得します。
    //=============================================================================
    Graphics.getVideoVolume = function() {
        return this._videoVolume;
    };
})();

