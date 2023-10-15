/*=============================================================================
 ConditionalXparam.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/10/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 条件付き追加能力値プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ConditionalXparam.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param xparamList
 * @text 追加能力値リスト
 * @desc 条件付き追加能力値のリストです。
 * @default []
 * @type struct<Xparam>[]
 *
 * @help ConditionalXparam.js
 *
 * 特定の条件下で追加能力値（命中率や回避率）を変化させます。
 * スキルの属性や本人のパラメータ状態などを条件に指定できます。
 *
 * プラグインパラメータで指定したタグを以下のデータベースのメモ欄に指定します。
 * アクター、職業、武器、防具、ステート、敵キャラ
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

/*~struct~Xparam:
 * @param tag
 * @text タグ名称
 * @desc メモ欄に指定するタグ名称です。aaaを指定した場合、メモ欄に記入すべきタグは<aaa>です。
 * @default aaa
 *
 * @param xparamId
 * @text 追加能力値ID
 * @desc 追加能力値のIDです。
 * @default 0
 * @type select
 * @option 命中率
 * @value 0
 * @option 回避率
 * @value 1
 * @option 会心率
 * @value 2
 * @option 会心回避率
 * @value 3
 * @option 魔法回避率
 * @value 4
 * @option 魔法反射率
 * @value 5
 * @option 反撃率
 * @value 6
 * @option HP再生率
 * @value 7
 * @option MP再生率
 * @value 8
 * @option TP再生率
 * @value 9
 *
 * @param isTarget
 * @text 対象者の能力値を増減
 * @desc 能力を増減する対象をスキルの使用者ではなく、対象者にします。主に回避や反射、反撃系の能力値の場合に設定します。
 * @default false
 * @type boolean
 *
 * @param value
 * @text 増減値
 * @desc 能力値を増減させる値です。マイナスを指定すると減少します。
 * @default 0
 * @type number
 * @min -999
 * @max 999
 *
 * @param condition
 * @text 条件
 * @desc 能力値を増減させる条件です。複数指定した場合は全ての条件を満たした場合に能力値を増減させます。
 * @default {}
 * @type struct<Condition>
 *
 */

/*~struct~Condition:
 *
 * @param skillId
 * @text スキルID条件
 * @desc 指定したスキルを使用した場合のみ能力値を増減します。
 * @default 0
 * @type skill
 *
 * @param itemId
 * @text アイテムID条件
 * @desc 指定したアイテムを使用した場合のみ能力値を増減します。
 * @default 0
 * @type item
 *
 * @param elementId
 * @text 属性ID条件
 * @desc 指定した属性IDのスキルを使用した場合のみ能力値を増減します。
 * @default 0
 * @type number
 *
 * @param skillType
 * @text スキルタイプ条件
 * @desc 指定したスキルタイプのスキルを使用した場合のみ能力値を増減します。
 * @default 0
 * @type number
 *
 * @param note
 * @text メモ欄条件
 * @desc 指定したメモタグが記載されたスキルを使用した場合のみ能力値を増減します。
 * @default
 *
 * @param hpRate
 * @text HP割合条件
 * @desc 指定したHP割合未満の場合のみ能力値を増減します。0を指定すると条件なしになります。
 * @default 0
 * @type number
 * @max 100
 *
 * @param mpRate
 * @text MP割合条件
 * @desc 指定したMP割合未満の場合のみ能力値を増減します。0を指定すると条件なしになります。
 * @default 0
 * @type number
 * @max 100
 *
 * @param tpRate
 * @text TP割合条件
 * @desc 指定したTP割合未満の場合のみ能力値を増減します。0を指定すると条件なしになります。
 * @default 0
 * @type number
 * @max 100
 *
 * @param switchId
 * @text スイッチ条件
 * @desc 指定したスイッチがONの場合のみ能力値を増減します。
 * @default 0
 * @type switch
 *
 * @param script
 * @text スクリプト条件
 * @desc 指定したスクリプトがtrueを返した場合のみ能力値を増減します。
 * @default
 * @type multiline_string
 *
 * @param reverse
 * @text 条件反転
 * @desc 条件を満たした場合に能力値を増減させるのではなく、満たさなかった場合に増減させます。
 * @default false
 * @type boolean
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    let skillTarget = null;
    let actionData = null;

    const _Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
    Game_BattlerBase.prototype.xparam = function(xparamId) {
        const value = _Game_BattlerBase_xparam.apply(this, arguments);
        return value + this.getConditionalXparam(xparamId);
    };

    Game_BattlerBase.prototype.getConditionalXparam = function(xparamId) {
        return param.xparamList.reduce((prev, data) => {
            if (this.isMatchXparamCondition(data, xparamId)) {
                return prev + data.value / 100;
            } else {
                return prev;
            }
        }, 0);
    };

    Game_BattlerBase.prototype.isMatchXparamCondition = function(data, xparamId) {
        if (data.xparamId !== xparamId) {
            return false;
        }
        const target = data.isTarget ? skillTarget : this;
        if (!target) {
            return false;
        }
        if (!target.traitObjects().some(trait => trait.meta[data.tag])) {
            return false;
        }
        const dataCondition = data.condition || {};
        const conditions = [];
        if (actionData) {
            const skillData = actionData.item();
            conditions.push(dataCondition.skillId === 0 || dataCondition.skillId === skillData.id && DataManager.isSkill(skillData));
            conditions.push(dataCondition.itemId === 0 || dataCondition.itemId === skillData.id && DataManager.isItem(skillData));
            conditions.push(dataCondition.elementId === 0 || actionData.hasElement(dataCondition.elementId));
            conditions.push(dataCondition.skillType === 0 || dataCondition.skillType === skillData.stypeId);
            conditions.push(dataCondition.note === '' || skillData.note.includes(dataCondition.note));
        }
        conditions.push(dataCondition.hpRate === 0 || target.hpRate() < dataCondition.hpRate / 100);
        conditions.push(dataCondition.mpRate === 0 || target.mpRate() < dataCondition.mpRate / 100);
        conditions.push(dataCondition.tpRate === 0 || target.tpRate() < dataCondition.tpRate / 100);
        conditions.push(dataCondition.switchId === 0 || $gameSwitches.value(dataCondition.switchId));
        conditions.push(dataCondition.script === '' || eval(dataCondition.script));
        const result = conditions.every(condition => condition);
        return dataCondition.reverse ? !result : result;
    };

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

    const _BattleManager_invokeAction = BattleManager.invokeAction;
    BattleManager.invokeAction = function(subject, target) {
        skillTarget = target;
        actionData = this._action;
        _BattleManager_invokeAction.apply(this, arguments);
        skillTarget = null;
        actionData = null;
    };
})();
