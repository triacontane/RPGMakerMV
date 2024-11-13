/*=============================================================================
 MovieCustomize.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2024/11/13 ムービー再生時の音量を変数で制御できる機能を追加
 1.0.0 2024/11/04 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ムービー再生カスタマイズプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MovieCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param noHideScreen
 * @text 画面を隠さない
 * @desc ムービー再生時に元の画面を表示したままにします。背景が強制的に黒背景になることを防げます。
 * @default false
 * @type boolean
 *
 * @param volumeVariable
 * @text 音量変数ID
 * @desc ムービー再生時の音量を制御する変数です。変数の値の範囲有効は0から100です。
 * @default 0
 * @type variable
 *
 * @command SET_RECT
 * @text ムービー表示位置設定
 * @desc ムービーの表示位置を設定します。
 *
 * @arg x
 * @text X座標
 * @desc ムービーのX座標です。
 * @default 0
 * @type number
 *
 * @arg y
 * @text Y座標
 * @desc ムービーのY座標です。
 * @default 0
 * @type number
 *
 * @arg width
 * @text 横幅
 * @desc ムービーの横幅です。
 * @default 816
 * @type number
 *
 * @arg height
 * @text 高さ
 * @desc ムービーの高さです。
 * @default 624
 * @type number
 *
 * @help MovieCustomize.js
 *
 * イベントコマンド「ムービーの再生」で再生される動画の位置やサイズを調整します。
 * また、ムービー再生時に背景が強制的に黒背景になる仕様を変更できます。
 *
 * 本プラグインに対して高度な機能追加の予定はありません。
 * より高度な調整が必要な場合「動画のピクチャ表示プラグイン」も検討できます。
 *　
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'SET_RECT', args => {
        $gameScreen.setMovieRect(args.x, args.y, args.width, args.height);
    });

    Game_Screen.prototype.setMovieRect = function(x, y, width, height) {
        this._movieRect = new Rectangle(x, y, width, height);
        Graphics._updateVideo();
    };

    Game_Screen.prototype.getMovieRect = function() {
        return this._movieRect;
    };

    const _Graphics__updateVideo = Graphics._updateVideo;
    Graphics._updateVideo = function() {
        const rect = $gameScreen?.getMovieRect();
        if (rect) {
            const x = rect.x * this._realScale;
            const y = rect.y * this._realScale;
            const width = rect.width * this._realScale;
            const height = rect.height * this._realScale;
            Video.setRect(x, y, width, height);
        } else {
            _Graphics__updateVideo.apply(this, arguments);
        }
    };

    Video.setRect = function(x, y, width, height) {
        if (this._element) {
            this._element.style.left = x + "px";
            this._element.style.top = y + "px";
            this._element.style.width = width + "px";
            this._element.style.height = height + "px";
        }
    };

    const _Video__updateVisibility = Video._updateVisibility;
    Video._updateVisibility = function(videoVisible) {
        _Video__updateVisibility.apply(this, arguments);
        if (param.noHideScreen) {
            Graphics.showScreen();
        }
    };

    const _Video_play = Video.play;
    Video.play = function(src) {
        _Video_play.apply(this, arguments);
        if (param.volumeVariable) {
            const volume = $gameVariables.value(param.volumeVariable);
            this.setVolume(volume.clamp(0, 100) / 100);
        }
    };
})();
