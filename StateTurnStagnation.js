/*=============================================================================
 StateTurnStagnation.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/09/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ステート残りターン停滞プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateTurnStagnation.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param stagnationList
 * @text 停滞設定リスト
 * @desc 残りターン数停滞の設定一覧です。
 * @default []
 * @type struct<Stagnation>[]
 *
 * @help StateTurnStagnation.js
 *
 * ターン経過で解消するステートの残りターンが減らなくなる特徴を定義できます。
 * アクター、職業、装備品、ステート、敵キャラのメモ欄に以下の通り指定すると
 * 識別子[item01]で定義したステート群の残りターンが減らなくなります。
 * <ステート停滞:item01>
 * <StateStagnation:item01>
 * 識別子に対応するステート群はプラグインパラメータで定義します。
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

/*~struct~Stagnation:
 *
 * @param id
 * @text 識別子
 * @desc 対象を特定するための識別子です。他と重複しない値を設定します。
 * @default item01
 *
 * @param stateList
 * @text ステートリスト
 * @desc 残りターン数を停滞させるステート一覧です。
 * @default []
 * @type state[]
 *
 * @param itemAll
 * @text 全ステート対象
 * @desc 有効のすると全ステートが停滞の対象になります。
 * @default false
 * @type boolean
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    Game_BattlerBase.prototype.isStateStagnation = function(stateId) {
        const idList = this.traitObjects()
            .map(obj => PluginManagerEx.findMetaValue(obj, ['StateStagnation', 'ステート停滞']));
        return param.stagnationList?.some(item => {
            if (idList.includes(item.id)) {
                return item.itemAll || item.stateList?.includes(stateId);
            } else {
                return false;
            }
        })
    };

    const _Game_BattlerBase_updateStateTurns = Game_BattlerBase.prototype.updateStateTurns;
    Game_BattlerBase.prototype.updateStateTurns = function() {
        const prevTurns = {};
        for (const stateId in this._stateTurns) {
            if (this.isStateStagnation(parseInt(stateId))) {
                prevTurns[stateId] = this._stateTurns[stateId];
            }
        }
        _Game_BattlerBase_updateStateTurns.apply(this, arguments);
        for (const stateId in prevTurns) {
            this._stateTurns[stateId] = prevTurns[stateId];
        }
    };
})();
