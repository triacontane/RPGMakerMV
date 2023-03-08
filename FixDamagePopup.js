/*=============================================================================
 FixDamagePopup.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/03/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ダメージポップアップ修正プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixDamagePopup.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help FixDamagePopup.js
 *　
 * スキルでダメージと使用効果との両方にHPダメージや回復が設定されたとき
 * 実際の増減とポップアップされる値とで差異が出てしまう問題を修正します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_Battler_gainHp = Game_Battler.prototype.gainHp;
    Game_Battler.prototype.gainHp = function(value) {
        const prev = this._result.hpDamage || 0;
        _Game_Battler_gainHp.apply(this, arguments);
        this._result.hpDamage += prev;
    };

    const _Game_Battler_gainMp = Game_Battler.prototype.gainMp;
    Game_Battler.prototype.gainMp = function(value) {
        const prev = this._result.mpDamage || 0;
        _Game_Battler_gainMp.apply(this, arguments);
        this._result.mpDamage += prev;
    };

    const _Game_Battler_gainTp = Game_Battler.prototype.gainTp;
    Game_Battler.prototype.gainTp = function(value) {
        const prev = this._result.tpDamage || 0;
        _Game_Battler_gainTp.apply(this, arguments);
        this._result.tpDamage += prev;
    };
})();
