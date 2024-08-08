/*=============================================================================
 DeathLostMpTp.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2024/08/08 戦闘不能時はダメージによるTPチャージを無効にする機能を追加
 1.0.1 2024/08/07 戦闘不能時にエラーになるバグを修正
 1.0.0 2024/08/06 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 戦闘不能でMP消失プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DeathLostMpTp.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param mpLostRate
 * @text MP消失率
 * @desc 戦闘不能時に消失するMPの割合です。100で全消失します。
 * @default 100
 * @type number
 * @min 0
 * @max 100
 *
 * @param tpLostRate
 * @text TP消失率
 * @desc 戦闘不能時に消失するTPの割合です。100で全消失します。
 * @default 100
 * @type number
 * @min 0
 * @max 100
 *
 * @param invalidDeathChargeTp
 * @text 戦闘不能時のTPチャージ無効
 * @desc 戦闘不能時は、ダメージによるTPチャージを無効にします。
 * @default false
 * @type boolean
 *
 * @help DeathLostMpTp.js
 *
 * 戦闘不能時にアクターのMPやTPが指定した割合で消失するようになります。
 * メモ欄(※1)に値を指定するかパラメータで消失率を指定してください。
 * ※1 アクター、職業、武器、防具、ステート、敵キャラのメモ欄
 *
 * <DeathLostMp:50> // 戦闘不能時にMPが50%消失
 * <DeathLostTp:50> // 戦闘不能時にTPが50%消失
 *
 * メモ欄に指定した場合はプラグインパラメータよりも優先されます。
 * また同一バトラーが複数のメモ欄を持っている場合は最小の値が採用されます。
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

    const _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        if (!this._deathLostProcess) {
            this._deathLostProcess = true;
            const mpLostRate = this.findDeathLostRate('DeathLostMp', param.mpLostRate);
            const tpLostRate = this.findDeathLostRate('DeathLostTp', param.tpLostRate);
            this.setMp(Math.floor(this.mp * (100 - mpLostRate) / 100));
            this.setTp(Math.floor(this.tp * (100 - tpLostRate) / 100));
            this._deathLostProcess = false;
        }
        _Game_BattlerBase_die.apply(this, arguments);
    };

    Game_BattlerBase.prototype.findDeathLostRate = function(metaKey, defaultValue) {
        const values = this.traitObjects()
            .filter(obj => !!obj.meta[metaKey])
            .map(obj => PluginManagerEx.findMetaValue(obj, metaKey));
        if (values.length > 0) {
            return Math.min(...values);
        } else {
            return defaultValue;
        }
    };

    const _Game_Battler_chargeTpByDamage = Game_Battler.prototype.chargeTpByDamage;
    Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
        if (!this.isAlive() && param.invalidDeathChargeTp) {
            return;
        }
        _Game_Battler_chargeTpByDamage.apply(this, arguments);
    };
})();
