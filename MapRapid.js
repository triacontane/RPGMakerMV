//=============================================================================
// MapRapid.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2017/08/12 型指定機能に対応
// 1.1.0 2016/01/11 テストプレー時のみ有効にできる設定を追加
//                  すべてのフェードアウト・フェードインを一瞬で行う機能を追加
// 1.0.0 2015/11/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc マップ高速化プラグイン
 * @author トリアコンタン
 *
 * @param testPlayOnly
 * @desc テストプレー時のみ本プラグインを適用します。
 * @default false
 * @type boolean
 *
 * @param showMessageRapid
 * @desc 制御文字にかかわらずメッセージを一瞬で表示する。
 * @default true
 * @type boolean
 *
 * @param windowOpenRapid
 * @desc ウィンドウの開閉を一瞬で行います。
 * @default true
 * @type boolean
 *
 * @param fadeRapid
 * @desc フェードイン・フェードアウトを一瞬で行います。
 * @default true
 * @type boolean
 *
 * @help マップ上の様々なウェイトを排除してゲームを高速化します。
 * 項目ごとに設定をON/OFFできます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    var pluginName = 'MapRapid';

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    if (getParamBoolean('testPlayOnly') && !Utils.isOptionValid('test')) {
        return;
    }

    //=============================================================================
    // Window_Message
    //  制御文字にかかわらずメッセージを一瞬で表示する。
    //=============================================================================
    if (getParamBoolean('showMessageRapid')) {
        var _Window_Message_updateMessage = Window_Message.prototype.updateMessage;
        Window_Message.prototype.updateMessage = function() {
            this._lineShowFast = true;
            return _Window_Message_updateMessage.call(this);
        };
    }

    //=============================================================================
    // Window_Base
    //  ウィンドウの開閉を一瞬で行います。
    //=============================================================================
    if (getParamBoolean('windowOpenRapid')) {
        var _Window_Base_updateOpen = Window_Base.prototype.updateOpen;
        Window_Base.prototype.updateOpen = function () {
            if (this._opening) {
                this.openness = 255;
            }
            _Window_Base_updateOpen.call(this);
        };

        var _Window_Base_updateClose = Window_Base.prototype.updateClose;
        Window_Base.prototype.updateClose = function () {
            if (this._closing) this.openness = 0;
            _Window_Base_updateClose.call(this);
        };
    }

    //=============================================================================
    // Scene_Base
    //  フェードアウトを一瞬で行います。
    //=============================================================================
    if (getParamBoolean('fadeRapid')) {
        Scene_Base.prototype.fadeSpeed = function () {
            return 1;
        };

        var _Scene_Base_startFadeIn = Scene_Base.prototype.startFadeIn;
        Scene_Base.prototype.startFadeIn = function(duration, white) {
            arguments[0] = 1;
            _Scene_Base_startFadeIn.apply(this, arguments);
        };

        var _Scene_Base_startFadeOut = Scene_Base.prototype.startFadeOut;
        Scene_Base.prototype.startFadeOut = function(duration, white) {
            arguments[0] = 1;
            _Scene_Base_startFadeOut.apply(this, arguments);
        };
    }
})();