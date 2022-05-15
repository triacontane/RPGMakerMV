//=============================================================================
// StateTotalization.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.4 2023/01/10 全体化ステートの当事者に対して一部の効果が重複して適用されていた問題を修正
// 1.1.3 2021/11/17 戦闘不能者については全体化の適用外とするよう仕様変更
// 1.1.2 2020/11/05 MZ向けにリファクタリング
// 1.1.1 2020/11/05 全体化ステートが敵グループに対しても指定可能であることがヘルプの記述だと分かりにくいので記述を修正
// 1.1.0 2018/09/25 全体化ステートを有するアクターの対象を戦闘メンバーのみにするかどうかの設定を追加
// 1.0.2 2017/04/02 英語ヘルプ作成
// 1.0.1 2017/04/23 少しだけリファクタリング
// 1.0.0 2017/04/23 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc StateTotalizationPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateTotalization.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param battleMemberOnly
 * @desc 全体化ステートを有するアクターの対象を戦闘メンバーに限定します。OFFにすると非戦闘メンバーのステートも全体化します。
 * @type boolean
 * @default true
 *
 * @help Change the effect of some states to "all friends".
 * Please describe it in the memo field of the state as follows.
 * <ST_Totalization>
 *
 * If the feature of the state in which the memo field is trait
 * and the behavior restriction are
 * It applies to all friend members.
 *
 * However, since the state itself is not infected
 * Icons and messages are not displayed.
 *
 * There is no plug-in command in this plug-in.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ステート全体化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateTotalization.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param battleMemberOnly
 * @text 戦闘メンバーのみ
 * @desc 全体化ステートの対象を戦闘メンバーに限定します。OFFにすると非戦闘メンバーのステートも全体化します。
 * @type boolean
 * @default true
 *
 * @help 一部のステートの効果を「メンバー全体」に拡張します。
 * ステートのメモ欄に以下の通り記述してください。
 * <ST_全体化>
 *
 * 上記メモ欄が記述されたステートの特徴および行動制約が
 * 全員に適用されます。
 * ただし、ステート自体が感染するわけではないので
 * アイコンやメッセージは表示されません。
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
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Unit
    //  全体化ステートを対象メンバーを取得します。
    //=============================================================================
    Game_Unit.prototype.getStateTotalizationMember = function() {
        return this.members();
    };

    Game_Party.prototype.getStateTotalizationMember = function() {
        return param.battleMemberOnly ? Game_Unit.prototype.getStateTotalizationMember.call(this) : this.allMembers();
    };

    //=============================================================================
    // Game_BattlerBase
    //  全体化ステートを追加定義します。
    //=============================================================================
    const _Game_BattlerBase_traitObjects = Game_BattlerBase.prototype.traitObjects;
    Game_BattlerBase.prototype.traitObjects = function() {
        const objects = _Game_BattlerBase_traitObjects.apply(this, arguments);
        if (this.isDead()) {
            return objects;
        }
        return objects.concat(this.getPartyTotalizationStates());
    };

    Game_BattlerBase.prototype.getPartyTotalizationStates = function() {
        return this.friendsUnit().getStateTotalizationMember().reduce(function(totalizationStates, member) {
            return member !== this ? totalizationStates.concat(member.getTotalizationStates()) : totalizationStates;
        }.bind(this), []);
    };

    Game_BattlerBase.prototype.getTotalizationStates = function() {
        return this.states().reduce(function(totalizationStates, state) {
            if (PluginManagerEx.findMetaValue(state, ['ST_全体化', 'ST_Totalization'])) {
                totalizationStates.push(state);
            }
            return totalizationStates;
        }, []);
    };

    const _Game_BattlerBase_restriction = Game_BattlerBase.prototype.restriction;
    Game_BattlerBase.prototype.restriction = function() {
        const restriction = _Game_BattlerBase_restriction.apply(this, arguments);
        return Math.max.apply(null, this.getPartyTotalizationStates().map(function(state) {
            return state.restriction;
        }).concat(restriction));
    };
})();

