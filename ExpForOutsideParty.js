/*=============================================================================
 ExpForOutsideParty.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2018/09/04 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ExpForOutsidePartyPlugin
 * @author triacontane
 *
 * @param expPercent
 * @desc パーティ外の仲間が受け取ることのできる経験値の割合(%)です。
 * @default 100
 * @type number
 *
 * @help ExpForOutsideParty.js
 *
 * パーティ外のアクターに対しても戦闘で得た経験値のうち一定量を
 * 取得可能にします。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc パーティ外メンバーの経験値取得プラグイン
 * @author トリアコンタン
 *
 * @param expPercent
 * @text 経験値取得割合
 * @desc パーティ外の仲間が受け取ることのできる経験値の割合(%)です。
 * @default 100
 * @type number
 *
 * @help ExpForOutsideParty.js
 *
 * パーティ外のアクターに対しても戦闘で得た経験値のうち一定量を
 * 取得可能にします。
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

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('ExpForOutsideParty');

    /**
     * BattleManager.gainExp
     * EXPを加算します。
     */
    var _BattleManager_gainExp = BattleManager.gainExp;
    BattleManager.gainExp = function() {
        _BattleManager_gainExp.apply(this, arguments);
        $gameActors.gainExpWithoutParty(this._rewards.exp);
    };

    /**
     * Game_Actors.prototype.gainExpWithoutParty
     * パーティ外のメンバーにEXPを加算します。
     * @param exp EXP
     */
    Game_Actors.prototype.gainExpWithoutParty = function(exp) {
        var partyMember = $gameParty.allMembers();
        this._data.filter(function(actor) {
            return !partyMember.contains(actor);
        }).forEach(function(actor) {
            actor.gainExp(exp);
        });
    };

    /**
     * Game_Actor.prototype.benchMembersExpRate
     * パーティ外のメンバーのレートを返します。
     */
    var _Game_Actor_benchMembersExpRate = Game_Actor.prototype.benchMembersExpRate;
    Game_Actor.prototype.benchMembersExpRate = function() {
        if (!$gameParty.allMembers().contains(this)) {
            return param.expPercent / 100;
        } else {
            return _Game_Actor_benchMembersExpRate.apply();
        }
    };
})();
