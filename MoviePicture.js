//=============================================================================
// MoviePicture.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.3.1 2025/04/12 The play() request was interrupted by a call to pause()のエラー抑制
// 2.3.0 2025/02/19 プラグインコマンドの動画ファイル指定で@fileに対応
// 2.2.2 2024/09/15 敵キャラを動画表示する機能で、敵キャラの変身に対応できていなかった問題を修正
// 2.2.1 2024/09/11 サブファオルダに配置された動画ファイルを再生できない問題を修正
// 2.2.0 2022/03/10 敵キャラを動画にできる機能を追加
// 2.1.0 2021/08/15 2.0.3の修正により動画音量種別をnoneにするとエラーになっていた問題を修正
//                  動画ファイルの再生でファイル名に制御文字を使えるよう修正
// 2.0.3 2021/07/31 動画音量種別に指定した項目のボリュームを0にしたとき、音量100で再生されてしまう問題を修正
// 2.0.2 2020/09/13 ヘルプ微修正
// 2.0.1 2020/09/13 ヘルプ微修正
// 2.0.0 2020/09/13 MZで動作するよう全面的に改修
// 1.7.1 2019/08/26 他のプラグインとの組み合わせによりエラーになる可能性のある記述を修正
// 1.7.0 2019/06/30 動画の取得元フォルダと拡張子を変更して動画を難読化できるようにしました。
// 1.6.0 2019/06/29 複数の動画を並行してロードしているときは、すべての動画のロードが完了してから再生するよう変更しました
//                  一定フレームで動画を中断させるコマンドを追加
// 1.5.1 2019/06/29 画面遷移したとき、動画でないピクチャまで非表示になってしまう問題を修正
// 1.5.0 2019/06/11 動画再生終了後、動画ピクチャを自動削除せず最終フレームで静止したままにする機能を追加
// 1.4.1 2019/05/21 動画を縮小表示したときのジャギを軽減
//                  ヘルプの記載を本体バージョン1.6を前提に修正
// 1.4.0 2019/01/06 movieフォルダ以外の場所に配置されている動画ファイルを再生できる機能を追加
// 1.3.3 2018/11/08 再生開始直後に停止したとき、特定条件下で正常に停止しない問題を修正
// 1.3.2 2018/06/17 ピクチャの消去によって動画再生を終了した場合に、再生速度と音量が初期化されない問題を修正
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
 * @plugindesc 動画のピクチャ表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MoviePicture.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param movieVolumeType
 * @text 動画音量種別
 * @desc 動画再生時に音声が含まれる場合、その音量を参照するオーディオ種別です。指定しない場合、常に100%で再生されます。
 * @default none
 * @type select
 * @option none
 * @option BGM
 * @option BGS
 * @option ME
 * @option SE
 *
 * @param autoEraseOnEnd
 * @text 終了時自動削除
 * @desc 動画再生終了時に動画ピクチャを自動で削除します。削除しない場合、動画は最終フレームで静止します。
 * @default true
 * @type boolean
 *
 * @param webmExt
 * @text webm偽装拡張子
 * @desc webm形式を再生するときの偽装拡張子です。難読化したい場合に指定します。対応フォーマットが増えるわけではありません。
 * @default
 *
 * @param mp4Ext
 * @text mp4偽装拡張子
 * @desc mp4形式を再生するときの偽装拡張子です。難読化したい場合に指定します。対応フォーマットが増えるわけではありません。
 * @default
 *
 * @command PREPARE
 * @text ピクチャ動画準備
 * @desc 指定した動画ファイルをピクチャ動画として準備します。
 *
 * @arg fileName
 * @text ファイル名
 * @desc 再生する動画ファイルです。『movies』フォルダ以下の動画ファイルを拡張子無しで入力します。
 * @default
 * @type file
 * @dir movies
 *
 * @arg loop
 * @text ループ
 * @desc 有効にすると動画をループ再生します。
 * @default false
 * @type boolean
 *
 * @arg smooth
 * @text なめらか表示
 * @desc 有効にすると動画を拡大したときになめらかな表示になります。
 * @default true
 * @type boolean
 *
 * @arg volume
 * @text 音量
 * @desc 動画の音量です。
 * @default 100
 * @type number
 * @max 100
 *
 * @arg reload
 * @text 再読み込み
 * @desc 同一番号のピクチャに対して同一の動画を表示しようとしたときに、最初から再生し直します。
 * @default false
 * @type boolean
 *
 * @arg autoplay
 * @text 自動再生
 * @desc 読み込み完了と同時に再生を開始します。無効にした場合、プラグインコマンドから手動再生します。
 * @default true
 * @type boolean
 *
 * @arg finishSwitch
 * @text 再生終了スイッチ
 * @desc 動画の再生が終了したタイミングでONになるスイッチです。ループ再生の場合は、1ループした時点でONになります。
 * @default 0
 * @type switch
 *
 * @command PAUSE
 * @text 一時停止
 * @desc 再生中の動画を一時停止します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @command PLAY
 * @text 再生
 * @desc 動作の再生を開始します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @command WAIT
 * @text 完了までウェイト
 * @desc 動作の再生が完了するまでイベントの進行を待機します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @command SET_VOLUME
 * @text 音量設定
 * @desc 動画の音量を設定します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @arg volume
 * @text 音量
 * @desc 動画の音量です。
 * @default 100
 * @type number
 * @max 100
 *
 * @command SET_RATE
 * @text 再生倍率設定
 * @desc 動画の再生倍率を設定します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @arg rate
 * @text 再生倍率
 * @desc 動画の再生倍率です。
 * @default 100
 * @type number
 *
 * @help ピクチャの表示枠を使って動画を再生します。
 * ピクチャの移動や回転、色調変更による処理の対象になるほか、
 * 複数の動画の並行再生が可能になります。
 * また、動画がウィンドウの下に表示されるようになります。
 *
 * 『ピクチャ動画準備』のコマンド実行後に、ファイルを空にして
 * イベントコマンド『ピクチャの表示』を実行してください。
 *
 * このプラグインは、ローカル実行(Game.exe)のみをサポート対象とします。
 * Webブラウザでも動作する可能性はありますが、自己責任でご利用ください。
 *
 * ピクチャ同様、敵キャラを動画表示できます。
 * 敵キャラのメモ欄に以下の通り設定してください。
 *
 * // 動画[aaa]を敵キャラ画像の代わりに表示します。
 * <動画:aaa>
 * <Movie:aaa>
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * We will create an English version when it works well.
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'PREPARE', args => {
        $gameScreen.setVideoPicture(args);
    });

    PluginManagerEx.registerCommand(script, 'PAUSE', args => {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.setVideoPause(true);
        }
    });

    PluginManagerEx.registerCommand(script, 'PLAY', args => {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.setVideoPause(false);
        }
    });

    PluginManagerEx.registerCommand(script, 'SET_VOLUME', args => {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.setVideoVolume(args.volume);
        }
    });

    PluginManagerEx.registerCommand(script, 'WAIT', function(args) {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.setVideoWait(true);
            this._waitMode = 'videoPicture';
        }
    });

    PluginManagerEx.registerCommand(script, 'SET_RATE', args => {
        const picture = $gameScreen.picture(args.pictureId);
        if (picture) {
            picture.setVideoSpeed(args.rate);
        }
    });

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === 'videoPicture') {
            const waiting = $gameScreen.isVideoWaiting();
            if (!waiting) {
                this._waitMode = '';
            }
            return waiting;
        } else {
            return _Game_Interpreter_updateWaitMode.apply(this, arguments);
        }
    };

    //=============================================================================
    // Game_Screen
    //  動画ピクチャを準備します。
    //=============================================================================
    Game_Screen.prototype.setVideoPicture = function(args) {
        this._videoPicture = args;
    };

    Game_Screen.prototype.getVideoPicture = function() {
        return this._videoPicture;
    };

    Game_Screen.prototype.clearVideoPicture = function() {
        this._videoPicture = null;
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
    const _Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                           scaleY, opacity, blendMode) {
        _Game_Picture_show.apply(this, arguments);
        const video = $gameScreen.getVideoPicture();
        if (video && !name) {
            this.showVideo(video)
        } else {
            this._video = false;
        }
    };

    Game_Picture.prototype.showVideo = function(video) {
        this._videoReload = video.reload;
        this._name = PluginManagerEx.convertEscapeCharacters(video.fileName);
        this._videoLoop = video.loop;
        this._videoSmooth = video.smooth;
        this._videoFinishSwitch = video.finishSwitch;
        if (this._videoFinishSwitch) {
            $gameSwitches.setValue(this._videoFinishSwitch, false);
        }
        this._video = true;
        this._ended = false;
        this.setVideoVolume(video.volume || 0);
        this.setVideoPause(!video.autoplay);
        $gameScreen.clearVideoPicture();
    };

    Game_Picture.prototype.onFinishVideo = function() {
        if (this.isVideoWait()) {
            this.setVideoWait(false);
        }
        if (this._videoFinishSwitch) {
            $gameSwitches.setValue(this._videoFinishSwitch, true);
        }
    };

    Game_Picture.prototype.isNeedVideoReload = function() {
        return this._videoReload;
    };

    Game_Picture.prototype.clearNeedVideoReload = function() {
        this._videoReload = false;
    };

    Game_Picture.prototype.isVideo = function() {
        return this._video;
    };

    Game_Picture.prototype.isVideoLoop = function() {
        return this._videoLoop;
    };

    Game_Picture.prototype.isVideoSmooth = function() {
        return this._videoSmooth;
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
        return this._volumeVideo * AudioManager.getVideoPictureVolume();
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

    Game_Picture.prototype.setVideoTimePosition = function(value) {
        this._videoTimePosition = value;
    };

    Game_Picture.prototype.getVideoTimePosition = function() {
        return this._videoTimePosition || 0;
    };

    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.apply(this, arguments);
        this.updateVideoName();
    };

    const _Game_Enemy_transform = Game_Enemy.prototype.transform;
    Game_Enemy.prototype.transform = function(enemyId) {
        _Game_Enemy_transform.apply(this, arguments);
        this.updateVideoName();
    };

    Game_Enemy.prototype.updateVideoName = function() {
        this._videoName = PluginManagerEx.findMetaValue(this.enemy(), ['Movie', '動画']);
    };

    const _Game_Enemy_battlerName = Game_Enemy.prototype.battlerName;
    Game_Enemy.prototype.battlerName = function() {
        return this._videoName ? this._videoName : _Game_Enemy_battlerName.apply(this, arguments);
    };

    Game_Enemy.prototype.isVideo = function() {
        return !!this._videoName;
    };

    const _Sprite_Enemy_loadBitmap = Sprite_Enemy.prototype.loadBitmap;
    Sprite_Enemy.prototype.loadBitmap = function(name) {
        if (this._enemy.isVideo()) {
            this.loadVideo(name);
        } else {
            this.destroyVideo();
            _Sprite_Enemy_loadBitmap.apply(this, arguments);
        }
    };

    Sprite_Enemy.prototype.loadVideo = function(name) {
        if (this.isVideoEnemy()) {
            this.destroyVideo();
        }
        this.bitmap = ImageManager.loadVideo(name, true);
        this.bitmap.setVideoLoop(true);
        this.bitmap.addLoadListener(()=> this.prepareVideo());
        this._loadingState = 'loading';
    };

    Sprite_Enemy.prototype.isVideoEnemy = function() {
        return this.bitmap && this.bitmap.isVideo();
    };

    Sprite_Enemy.prototype.destroyVideo = function() {
        if (!this.isVideoEnemy()) {
            return;
        }
        this.bitmap.destroy();
        this.texture = new PIXI.Texture(Sprite._emptyBaseTexture, new Rectangle());
        this.bitmap = null;
    };

    Sprite_Enemy.prototype.prepareVideo = function() {
        this._refresh();
        this._loadingState = 'prepared';
    };

    //=============================================================================
    // Sprite_Picture
    //  ムービーピクチャを読み込みます。
    //=============================================================================
    const _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        if (this.picture().isVideo()) {
            this.loadVideo();
        } else {
            this.destroyVideo();
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };

    Sprite_Picture.prototype.loadVideo = function() {
        if (SceneManager.isBattleStartUnexpectedLoad()) {
            return;
        }
        if (this.isVideoPicture()) {
            this.destroyVideo();
        }
        this.picture().clearNeedVideoReload();
        this.bitmap = ImageManager.loadVideo(this._pictureName, this.picture().isVideoSmooth());
        this.restoreVideoTimePosition();
        this.bitmap.addLoadListener(function() {
            this.prepareVideo();
        }.bind(this));
        this._loadingState = 'loading';
    };

    Sprite_Picture.prototype.prepareVideo = function() {
        this._refresh();
        this._playStart = true;
        const picture = this.picture();
        if (picture) {
            this._volume = null;
            this.updateVideoVolume();
            this._loadingState = 'prepared';
        } else {
            this._loadingState = null;
        }
    };

    const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        if (!this.picture()) {
            this.destroyVideo();
        }
        _Sprite_Picture_updateBitmap.apply(this, arguments);
        this.updateVideo();
    };

    Sprite_Picture.prototype.updateVideo = function() {
        if (!this.isVideoPicture()) {
            return;
        }
        if (this.picture().isNeedVideoReload()) {
            this.loadVideo();
        }
        this.updateVideoFinish();
        if (this._playStart) {
            this.updateVideoSpeed();
            this.updateVideoPause();
            this.updateVideoVolume();
            this.updateVideoLoop();
        }
    };

    Sprite_Picture.prototype.updateVideoSpeed = function() {
        const speed = this.picture().getVideoSpeed() / 100;
        if (speed !== this._speed) {
            this._speed = speed;
            this.bitmap.setVideoSpeed(speed);
        }
    };

    Sprite_Picture.prototype.updateVideoPause = function() {
        const pause = this.picture().isVideoPause();
        if (this._pause && !pause) {
            this.bitmap.play();
        }
        if (!this._pause && pause) {
            this.bitmap.pause();
        }
        this._pause = pause;
    };

    Sprite_Picture.prototype.stopVideo = function() {
        if (this.isVideoPicture()) {
            this.bitmap.pause();
            this._pause = true;
        }
    };

    Sprite_Picture.prototype.updateVideoLoop = function() {
        this.bitmap.setVideoLoop(this.picture().isVideoLoop());
    };

    Sprite_Picture.prototype.updateVideoVolume = function() {
        const volume = this.picture().getVideoRealVolume();
        if (volume !== this._volume) {
            this._volume = volume;
            this.bitmap.setVolume(volume / 100);
        }
    };

    Sprite_Picture.prototype.updateVideoFinish = function() {
        const picture = this.picture();
        const finish = !this.bitmap.isPlayingWait();
        if (picture && finish) {
            picture.onFinishVideo();
        }
        if (this.bitmap.isEnded() && param.autoEraseOnEnd) {
            this.eraseVideo();
        }
    };

    Sprite_Picture.prototype.eraseVideo = function() {
        this.destroyVideo();
        if (this.picture()) {
            $gameScreen.erasePicture(this._pictureId);
            this.visible = false;
        }
    };

    Sprite_Picture.prototype.saveVideoTimePosition = function() {
        const picture = this.picture();
        if (picture && this.isVideoPicture()) {
            picture.setVideoTimePosition(this.bitmap.getCurrentTime());
        }
    };

    Sprite_Picture.prototype.restoreVideoTimePosition = function() {
        const picture = this.picture();
        if (picture && this.isVideoPicture()) {
            this.bitmap.setCurrentTime(picture.getVideoTimePosition());
        }
    };

    Sprite_Picture.prototype.destroyVideo = function() {
        if (!this.isVideoPicture()) {
            return;
        }
        this.bitmap.destroy();
        this.texture = new PIXI.Texture(Sprite._emptyBaseTexture, new Rectangle());
        this._volume = null;
        this._speed = null;
        this._pause = null;
        this._playStart = false;
        this.bitmap = null;
    };

    Sprite_Picture.prototype.isVideoPicture = function() {
        return this.bitmap && this.bitmap.isVideo();
    };

    Sprite_Picture.prototype.isLoading = function() {
        return this._loadingState === 'loading';
    };

    Sprite_Picture.prototype.isPrepared = function() {
        return this._loadingState === 'prepared';
    };

    //=============================================================================
    // Spriteset_Base
    //=============================================================================
    Spriteset_Base.prototype.clearAllVideo = function() {
        this.findVideoList().forEach(picture => {
            picture.saveVideoTimePosition();
            picture.destroyVideo();
        });
    };

    Spriteset_Base.prototype.stopAllVideo = function() {
        this.findVideoList().forEach(picture => {
            picture.stopVideo();
        });
    };

    Spriteset_Base.prototype.findVideoList = function() {
        return this._pictureContainer.children.filter(picture => {
            return picture instanceof Sprite_Picture && picture.isVideoPicture();
        })
    };

    //=============================================================================
    // Scene_Base
    //=============================================================================
    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        this.clearAllVideo();
        _Scene_Base_terminate.apply(this, arguments);
    };

    Scene_Base.prototype.clearAllVideo = function() {
        if (this._spriteset) {
            this._spriteset.clearAllVideo();
        }
    };

    Scene_Base.prototype.stopAllVideo = function() {
        if (this._spriteset) {
            this._spriteset.stopAllVideo();
        }
    };

    //=============================================================================
    // ImageManager
    //  動画の読み込みを追加定義します。
    //=============================================================================
    ImageManager.loadVideo = function(filename, smooth) {
        if (filename) {
            return new Bitmap_Video(this.getVideoFilePath(filename), smooth);
        } else {
            return this._emptyBitmap;
        }
    };

    ImageManager.getVideoFilePath = function(filename) {
        return 'movies/' + Utils.encodeURI(filename) + this.getVideoFileExt();
    };

    ImageManager.getVideoFileExt = function() {
        if (Utils.canPlayWebm()) {
            return '.' + (param.webmExt || 'webm');
        } else {
            return '.' + (param.mp4Ext || 'mp4');
        }
    };

    //=============================================================================
    // SceneManager
    //  戦闘開始時にマップピクチャが一瞬読み込まれてしまう現象を回避します
    //=============================================================================
    SceneManager.isBattleStartUnexpectedLoad = function() {
        return this._scene instanceof Scene_Battle && !$gameParty.inBattle();
    };

    //=============================================================================
    // AudioManager
    //  動画ピクチャの音量を取得します。
    //=============================================================================
    AudioManager._movieVolumePropertyMap = {
        BGM: 'bgmVolume',
        BGS: 'bgsVolume',
        ME: 'meVolume',
        SE: 'seVolume',
        VOICE: 'voiceVolume'
    };

    AudioManager.getVideoPictureVolume = function() {
        const property = this._movieVolumePropertyMap[param.movieVolumeType];
        return Video._volume * (this.hasOwnProperty(property) ? this[property] / 100 : 1.0);
    };

    const _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene = function() {
        _SceneManager_updateScene.apply(this, arguments);
        if (this._scene && !this.isGameActive()) {
            this._scene.stopAllVideo();
        }
    };

    //=============================================================================
    // Bitmap
    //  動画かどうかを判定します。
    //=============================================================================
    Bitmap.prototype.isVideo = function() {
        return false;
    };

    /**
     * Bitmap_Video
     * 動画ビットマップクラスです。
     * @constructor
     */
    function Bitmap_Video() {
        this.initialize.apply(this, arguments);
    }

    Bitmap_Video.prototype = Object.create(Bitmap.prototype);
    Bitmap_Video.prototype.constructor = Bitmap_Video;

    Bitmap_Video.prototype.initialize = function(url, smooth) {
        Bitmap.prototype.initialize.call(this);
        this._createCanvas(1, 1);
        this.smooth = smooth;
        this._requestVideo(url);
        this._prevCurrentTime = 0;
    };

    Bitmap_Video.prototype.isVideo = function() {
        return !!this._video;
    };

    Bitmap_Video.prototype.setVolume = function(volume) {
        this._video.volume = volume;
    };

    Bitmap_Video.prototype.pause = function() {
        if (this.isLoaded()) {
            this._video.pause();
        }
    };

    Bitmap_Video.prototype.play = function() {
        this._video.play();
    };

    const _Bitmap_Video_destroy = Bitmap_Video.prototype.destroy;
    Bitmap_Video.prototype.destroy = function() {
        if (this.isReady()) {
            this.pause();
            this._video = null;
        } else {
            this._loadingDestory = true;
            return;
        }
        _Bitmap_Video_destroy.apply(this, arguments);
    };

    Bitmap_Video.prototype._requestVideo = function(url) {
        this._createVideo(url);
        this._createVideoBaseTexture();
        this._loadingState = 'requesting';
    };

    Bitmap_Video.prototype._createVideo = function(url) {
        this._video = document.createElement('video');
        this._video.src = url;
        this._video.addEventListener('canplaythrough', this._loadListener = this._onLoad.bind(this));
        this._video.addEventListener('ended', this._endedListener = this._onEnded.bind(this));
        this._video.addEventListener('error', this._errorListener = this._onError.bind(this));
        this._video.load();
        this._video.autoplay = true;
    };

    Bitmap_Video.prototype._createVideoBaseTexture = function() {
        const scaleMode = this.smooth ? PIXI.SCALE_MODES.LINEAR : PIXI.SCALE_MODES.NEAREST;
        this._baseTexture = PIXI.Texture.from(this._video, {scaleMode: scaleMode});
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
        const width = this._video.videoWidth;
        const height = this._video.videoHeight;
        this.resize(width, height);
        this._callLoadListeners();
    };

    Bitmap_Video.prototype._onEnded = function() {
        this._ended = true;
    };

    Bitmap_Video.prototype.isLoaded = function() {
        return this._video && this._loadingState === 'loaded';
    };

    Bitmap_Video.prototype._onError = function() {
        this._video.removeEventListener('load', this._loadListener);
        this._video.removeEventListener('ended', this._endedListener);
        this._video.removeEventListener('error', this._errorListener);
        this._loadingState = 'error';
    };

    Bitmap_Video.prototype.isPlayingWait = function() {
        if (this._video.loop) {
            return this.isFirstLap();
        } else {
            return !this.isEnded();
        }
    };

    Bitmap_Video.prototype.isFirstLap = function() {
        const time = this._video.currentTime;
        if (this._prevCurrentTime >= time) {
            return false;
        }
        this._prevCurrentTime = time;
        return true;
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
})();

