//=============================================================================
// HiddenParameter.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/04/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc HiddenParameterPlugin
 * @author triacontane
 *
 * @help HiddenParameter.js
 *
 * 装備品もしくはステータスウィンドウから
 * パラメータの表示を除外します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc パラメータ隠蔽プラグイン
 * @author トリアコンタン
 *
 * @help HiddenParameter.js
 *
 * 装備品もしくはステータスウィンドウから
 * パラメータの表示を除外します。
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

    Window_EquipStatus.prototype.windowWidth = function() {
        return 0;
    };

    Window_Status.prototype.drawBlock3 = function(y) {
        this.drawEquipments(48, y);
    };
})();
