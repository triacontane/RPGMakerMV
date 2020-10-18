/*=============================================================================
 FixChoiceListWindowY.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2020/10/18 数値入力ウィンドウも同様の仕様に変更
 1.0.0 2020/10/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc FixChoiceListWindowYPlugin
 * @author triacontane
 *
 * @param y
 * @text Y座標
 * @desc Y of the choice window when the message window is not displayed
 * @default
 *
 * @help FixChoiceListWindowY.js
 *
 * Fix the Y of the choice window when the message window
 * is not displayed to the value set by the parameter.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 選択肢ウィンドウのY座標固定パッチ
 * @author トリアコンタン
 *
 * @param y
 * @text Y座標
 * @desc メッセージウィンドウが表示されていない状態での選択肢ウィンドウのY座標(原点は中央)
 * @default 312
 * @type number
 *
 * @help FixChoiceListWindowY.js
 *
 * メッセージウィンドウが表示されていない状態での
 * 選択肢ウィンドウのY座標をパラメータで設定した値に固定します。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    var paramY = parseInt(PluginManager.parameters('FixChoiceListWindowY').y);

    var _Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {
        _Window_ChoiceList_updatePlacement.apply(this, arguments);
        if (this._messageWindow.isClosed()) {
            this.y = paramY - this.height / 2;
        }
    };

    var _Window_NumberInput_updatePlacement = Window_NumberInput.prototype.updatePlacement;
    Window_NumberInput.prototype.updatePlacement = function() {
        _Window_NumberInput_updatePlacement.apply(this, arguments);
        if (this._messageWindow.isClosed()) {
            this.y = paramY - this.height / 2;
        }
    };
})();
