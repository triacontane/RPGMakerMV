//=============================================================================
// StateTotalization.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2017/04/02 英語ヘルプ作成
// 1.0.1 2017/04/23 少しだけリファクタリング
// 1.0.0 2017/04/23 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc StateTotalizationPlugin
 * @author triacontane
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
 * @author トリアコンタン
 *
 * @help 一部のステートの効果を「味方全体」にします。
 * ステートのメモ欄に以下の通り記述してください。
 * <ST_全体化>
 *
 * 上記メモ欄が記述されたステートの特徴および行動制約が
 * 味方全員に適用されます。
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
    var metaTagPrefix = 'ST_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var isMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName);
    };

    var isMetaValues = function(object, names) {
        return names.some(function(name) {
            return isMetaValue(object, name);
        });
    };

    //=============================================================================
    // Game_BattlerBase
    //  全体化ステートを追加定義します。
    //=============================================================================
    var _Game_BattlerBase_traitObjects = Game_BattlerBase.prototype.traitObjects;
    Game_BattlerBase.prototype.traitObjects = function() {
        var objects = _Game_BattlerBase_traitObjects.apply(this, arguments);
        return objects.concat(this.getPartyTotalizationStates());
    };

    Game_BattlerBase.prototype.getPartyTotalizationStates = function() {
        return this.friendsUnit().members().reduce(function(totalizationStates, member) {
            return member !== this ? totalizationStates.concat(member.getTotalizationStates()) : totalizationStates;
        }, []);
    };

    Game_BattlerBase.prototype.getTotalizationStates = function() {
        return this.states().reduce(function(totalizationStates, state) {
            if (isMetaValues(state, ['全体化', 'Totalization'])) {
                totalizationStates.push(state);
            }
            return totalizationStates;
        }, []);
    };

    var _Game_BattlerBase_restriction = Game_BattlerBase.prototype.restriction;
    Game_BattlerBase.prototype.restriction = function() {
        var restriction = _Game_BattlerBase_restriction.apply(this, arguments);
        return Math.max.apply(null, this.getPartyTotalizationStates().map(function(state) {
            return state.restriction;
        }).concat(restriction));
    };
})();

