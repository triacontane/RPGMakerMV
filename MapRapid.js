//=============================================================================
// MapRapid.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2015/11/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc マップ高速化プラグイン
 * @author トリアコンタン
 * 
 * @param showMessageRapid
 * @desc 制御文字にかかわらずメッセージを一瞬で表示する。
 * @default ON
 *
 * @param windowOpenRapid
 * @desc ウィンドウの開閉を一瞬で行います。
 * @default ON
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
    var parameters = PluginManager.parameters('MapRapid');

    //=============================================================================
    // Window_Message
    //  制御文字にかかわらずメッセージを一瞬で表示する。
    //=============================================================================
    if (parameters['showMessageRapid'] === "ON") {
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
    if (parameters['windowOpenRapid'] === "ON") {
        var _Window_Base_updateOpen = Window_Base.prototype.updateOpen;
        Window_Base.prototype.updateOpen = function () {
            this._opening && (this.openness = 255);
            _Window_Base_updateOpen.call(this);
        };

        var _Window_Base_updateClose = Window_Base.prototype.updateClose;
        Window_Base.prototype.updateClose = function () {
            this._closing && (this.openness = 0);
            _Window_Base_updateClose.call(this);
        };
    }
})();