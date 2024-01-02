/*=============================================================================
 ExpForOutsideParty.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.3.0 2024/01/02 控えメンバーとパーティ外メンバとで別々の取得割合を指定できる機能を追加
 1.2.1 2023/08/13 割合をメモ欄から指定するとき、0も指定できるよう修正
 1.2.0 2023/08/12 MZで動作するよう修正
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
 * @plugindesc パーティ外メンバーの経験値取得プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ExpForOutsideParty.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param expPercent
 * @text 経験値取得割合
 * @desc 控えメンバーが受け取ることのできる経験値の割合(%)です。
 * @default 100
 * @type number
 *
 * @param expPercentForOutParty
 * @text パーティ外経験値取得割合
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
 * パーティ外のアクターとは以下を指します。
 * ・戦闘に参加していなかった控えメンバー
 * ・一度でもパーティに加わったことがあるが、現在はパーティにいないメンバー
 *
 * なお、本プラグインを適用前のセーブデータには使用できません。
 *
 * 経験値の割合(%)をメモ欄から指定することもできます。
 * この指定がある場合、プラグインパラメータの値は無視されます。
 * アクター、職業、武器、防具、ステートのメモ欄に以下の通り記述してください。
 * 重複して定義されていた場合は大きい値が優先されます。
 * <OutsidePartyExpRate:50> # 経験値取得割合を50%に設定
 * <パーティ外経験値レート:50> # 同上
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * BattleManager.gainExp
     * EXPを加算します。
     */
    const _BattleManager_gainExp = BattleManager.gainExp;
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
        const partyMember = $gameParty.allMembers();
        this._data.filter(actor => actor && !partyMember.includes(actor) && actor.isInPartyAtLeastOnce())
            .forEach(actor => actor.gainExp(exp));
    };

    const _Game_Actor_shouldDisplayLevelUp = Game_Actor.prototype.shouldDisplayLevelUp;
    Game_Actor.prototype.shouldDisplayLevelUp = function() {
        if (!$gameParty.battleMembers().includes(this)) {
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
    const _Game_Actor_benchMembersExpRate = Game_Actor.prototype.benchMembersExpRate;
    Game_Actor.prototype.benchMembersExpRate = function() {
        const rate = _Game_Actor_benchMembersExpRate.apply(this, arguments);
        if (!$gameParty.battleMembers().includes(this)) {
            const customRate = this.findOutsideCustomExpRate();
            const paramRate = $gameParty.allMembers().includes(this) ? param.expPercent : param.expPercentForOutParty;
            return (customRate !== undefined ? customRate : paramRate) / 100;
        } else {
            return rate;
        }
    };

    Game_Actor.prototype.findOutsideCustomExpRate = function() {
        return this.traitObjects()
            .map(obj => PluginManagerEx.findMetaValue(obj, ['OutsidePartyExpRate', 'パーティ外経験値レート']))
            .filter(value => value !== undefined)
            .sort().pop();
    };

    const _Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function(actorId) {
        _Game_Party_addActor.apply(this, arguments);
        $gameActors.actor(actorId).addParty();
    };

    const _Game_Party_setupStartingMembers = Game_Party.prototype.setupStartingMembers;
    Game_Party.prototype.setupStartingMembers = function() {
        _Game_Party_setupStartingMembers.apply(this, arguments);
        this._actors.forEach(actorId => $gameActors.actor(actorId).addParty());
    };
})();
