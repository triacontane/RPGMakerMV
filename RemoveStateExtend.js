/*=============================================================================
 RemoveStateExtend.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.1 2023/10/23 解除条件に属性を指定したとき、スキルの指定が「通常攻撃」の場合、解除の対象にならない問題を修正
 1.1.0 2022/06/08 解除条件にスクリプトを設定、解除確率を補正するタグを追加
 1.0.0 2022/03/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 条件付きステート解除プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/RemoveStateExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param byDamageList
 * @text ダメージで解除のリスト
 * @desc ダメージを受けたときのステート解除を条件付きにします。データベースの当該項目とは独立して動作します。
 * @default []
 * @type struct<DAMAGE>[]
 *
 * @help RemoveStateExtend.js
 *
 * ステート解除の条件を拡張します。
 * 特定の属性を含む（含まない）攻撃を受けたときや、魔法攻撃を受けたとき
 * HP割合が指定値を下回った場合のみ解除されるステートなどが作成できます。
 * パラメータから条件リストを設定します。
 *
 * ステートを解除するときの確率を補正(加算)するメモ欄です。
 * アクター、職業、武器、防具、敵キャラ、ステートのメモ欄で有効です。
 * ex:ステートID[3]のステート解除確率が20%加算されます。
 * <ステート解除補正3:20>
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

/*~struct~DAMAGE:
 *
 * @param stateId
 * @text ステートID
 * @desc 解除条件を設定するステートIDです。同一ステートを複数定義したときは『いずれか』の条件を満たすと解除されます。
 * @default 1
 * @type state
 *
 * @param elementId
 * @text 属性ID
 * @desc 相手の攻撃が特定の属性を含んでいたときに解除されます。
 * @default 0
 * @type number
 *
 * @param hitType
 * @text 命中タイプ
 * @desc 命中タイプが指定したものと一致するときに解除されます。
 * @default 0
 * @type select
 * @option 指定なし
 * @value 0
 * @option 物理攻撃
 * @value 1
 * @option 魔法攻撃
 * @value 2
 *
 * @param hpRate
 * @text HP割合(%)
 * @desc HPが指定した割合以下の場合に解除されます。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param mpRate
 * @text MP割合(%)
 * @desc MPが指定した割合以下の場合に解除されます。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param tpRate
 * @text TP割合(%)
 * @desc TPが指定した割合以下の場合に解除されます。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param script
 * @text スクリプト
 * @desc 指定した場合、スクリプトの評価結果がtrueを返した場合に解除されます。thisでバトラー、stateでステートが参照できます。
 * @default
 * @type multiline_string
 *
 * @param reverse
 * @text 条件反転
 * @desc 上記の条件を『満たさなかった』場合に解除されるよう変更します。
 * @default false
 * @type boolean
 *
 * @param chanceByDamage
 * @text 解除確率
 * @desc 条件を満たしたときに解除される確率です。100%にすると常に解除されます。
 * @default 100
 * @type number
 * @min 0
 * @max 100
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Battler_removeStatesByDamage = Game_Battler.prototype.removeStatesByDamage;
    Game_Battler.prototype.removeStatesByDamage = function() {
        _Game_Battler_removeStatesByDamage.apply(this, arguments);
        if (!this._acceptAction) {
            return;
        }
        this.states().forEach(state => {
            param.byDamageList
                .filter(item => this.isRemoveStateExtend(state, item))
                .forEach(item => this.removeState(item.stateId));
        });
    };

    Game_Battler.prototype.isRemoveStateExtend = function(state, paramItem) {
        if (state.id !== paramItem.stateId) {
            return false;
        }
        const acceptItem = this._acceptAction.item();
        let result = true;
        if (paramItem.elementId && !this._acceptAction.hasElement(paramItem.elementId)) {
            result = false;
        }
        if (paramItem.hitType && acceptItem.hitType !== paramItem.hitType) {
            result = false;
        }
        if (paramItem.hpRate && this.hpRate() > paramItem.hpRate / 100) {
            result = false;
        }
        if (paramItem.mpRate && this.mpRate() > paramItem.mpRate / 100) {
            result = false;
        }
        if (paramItem.tpRate && this.tpRate() > paramItem.tpRate / 100) {
            result = false;
        }
        if (paramItem.script && !eval(paramItem.script)) {
            result = false;
        }
        if (paramItem.reverse) {
            result = !result;
        }
        return Math.randomInt(100) < this.findRemoveStateRate(paramItem, state) ? result : false;
    }

    Game_Battler.prototype.findRemoveStateRate = function(paramItem, state) {
        const tag = `ステート解除補正${state.id}`
        const rate = this.traitObjects()
            .reduce((prev, obj) => prev + (PluginManagerEx.findMetaValue(obj, tag) || 0), 0);
        return paramItem.chanceByDamage + rate;
    }

    Game_Battler.prototype.setAcceptedAction = function(action) {
        this._acceptAction = action;
    }

    Game_Action.prototype.hasElement = function(elementId) {
        if (this.item().damage.type === 0) {
            return false;
        }
        const skillElementId = this.item().damage.elementId;
        // Normal attack elementID[-1]
        if (skillElementId === -1) {
            return this.subject().attackElements().contains(elementId);
        } else {
            return elementId === skillElementId;
        }
    };

    const _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        target.setAcceptedAction(this);
        _Game_Action_executeHpDamage.apply(this, arguments);
        target.setAcceptedAction(null);
    };
})();
