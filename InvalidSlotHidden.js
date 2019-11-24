/*=============================================================================
 InvalidSlotHidden.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2019/11/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc InvalidSlotHiddenPlugin
 * @author triacontane
 *
 * @help InvalidSlotHidden.js
 *
 * 特徴によって封印された装備スロットを非表示にします。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 封印装備スロットの非表示プラグイン
 * @author トリアコンタン
 *
 * @help InvalidSlotHidden.js
 *
 * 特徴によって封印された装備スロットを非表示にします。
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

    var _Game_Actor_equipSlots = Game_Actor.prototype.equipSlots;
    Game_Actor.prototype.equipSlots = function() {
        return _Game_Actor_equipSlots.apply(this, arguments).filter(function(slot) {
            return this.isValidSlot(slot);
        }.bind(this));
    };

    Game_Actor.prototype.isValidSlot = function(slot) {
        return !this.isEquipTypeSealed(slot);
    };
})();
