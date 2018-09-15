/*=============================================================================
 ExpForOutsideParty.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2018/09/16 一度もパーティに加わっていないアクターも対しても経験値が加算される場合がある問題を修正
                  パーティ外アクターのレベルアップ時にメッセージを表示するかどうかを選択できる機能を追加
 1.0.1 2018/09/06 アクターが抜けている状態でセーブしたデータに対して本プラグインを適用して戦闘終了するとエラーになる問題を修正
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
 * @param showLevelUpMessage
 * @desc パーティ外の仲間がレベルアップしたときにメッセージを表示するかどうかを選択します。
 * @default true
 * @type boolean
 *
 * @help ExpForOutsideParty.js
 *
 * パーティ外のアクターに対しても戦闘で得た経験値のうち一定量を
 * 取得可能にします。
 * ただし、本プラグインを適用前のセーブデータには使用できません。
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
 * @param showLevelUpMessage
 * @text レベルアップメッセージ表示
 * @desc パーティ外の仲間がレベルアップしたときにメッセージを表示するかどうかを選択します。
 * @default true
 * @type boolean
 *
 * @help ExpForOutsideParty.js
 *
 * パーティ外のアクターに対しても戦闘で得た経験値のうち一定量を
 * 取得可能にします。
 * ただし、本プラグインを適用前のセーブデータには使用できません。
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
            return actor && !partyMember.contains(actor) && actor.isInPartyAtLeastOnce();
        }).forEach(function(actor) {
            actor.gainExp(exp);
        });
    };

    var _Game_Actor_shouldDisplayLevelUp = Game_Actor.prototype.shouldDisplayLevelUp;
    Game_Actor.prototype.shouldDisplayLevelUp = function() {
        if (!$gameParty.allMembers().contains(this)) {
            return param.showLevelUpMessage;
        } else {
            return _Game_Actor_shouldDisplayLevelUp.apply(this, arguments);
        }
    };

    Game_Actor.prototype.addParty = function() {
        this._addParty = true;
    };

    Game_Actor.prototype.isInPartyAtLeastOnce = function() {
        return this._addParty;
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

    var _Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function(actorId) {
        _Game_Party_addActor.apply(this, arguments);
        $gameActors.actor(actorId).addParty();
    };

    var _Game_Party_setupStartingMembers = Game_Party.prototype.setupStartingMembers;
    Game_Party.prototype.setupStartingMembers = function() {
        _Game_Party_setupStartingMembers.apply(this, arguments);
        this._actors.forEach(function(actorId) {
            $gameActors.actor(actorId).addParty();
        });
    };
})();
