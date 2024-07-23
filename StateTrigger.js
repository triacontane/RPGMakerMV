/*=============================================================================
 StateTrigger.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/07/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ステートトリガープラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateTrigger.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param stateList
 * @text ステートリスト
 * @desc ステートトリガーの一覧です。
 * @default []
 * @type struct<Trigger>[]
 *
 * @help StateTrigger.js
 *
 * ステートの付与、解除をトリガーに別のステートやバフを付与、解除できます。
 * スイッチの切替や任意スクリプトの実行も可能です。
 *
 * 適用条件を指定するとメモ欄(※1)に任意のタグが記述されていた場合のみ
 * トリガーを実行できます。
 * 例えば、条件にaaaと指定した場合メモ欄に<aaa>を含むバトラーが対象です。
 *
 * ※1 アクター、職業、武器、防具、ステート、敵キャラが対象
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

/*~struct~Trigger:
 * @param stateId
 * @text ステートID
 * @desc トリガーとなるステートIDです。
 * @default 1
 * @type state
 *
 * @param type
 * @text トリガータイプ
 * @desc トリガーの種類（付与 or 解除）です。
 * @default add
 * @type select
 * @option 付与
 * @value add
 * @option 解除
 * @value remove
 *
 * @param affectedOnly
 * @text 有効時のみ
 * @desc ステートが付与されていない状態での解除や、付与された状態での再付与ではトリガーを実行しません。
 * @default true
 * @type boolean
 *
 * @param removeStates
 * @text 解除ステートID一覧
 * @desc トリガーステート有効時に解除されるステートIDのリストです。
 * @default []
 * @type state[]
 *
 * @param addStates
 * @text 付与ステートID一覧
 * @desc トリガーステート有効時に付与されるステートIDのリストです。
 * @default []
 * @type state[]
 *
 * @param removeBuff
 * @text 解除バフ一覧
 * @desc トリガーステート有効時に解除されるバフのリストです。
 * @default []
 * @type struct<Buff>[]
 *
 * @param addBuff
 * @text 付与バフ一覧
 * @desc トリガーステート有効時に付与されるバフのリストです。
 * @default []
 * @type struct<Buff>[]
 *
 * @param removeDebuff
 * @text 解除デバフ一覧
 * @desc トリガーステート有効時に解除されるデバフのリストです。
 * @default []
 * @type struct<Buff>[]
 *
 * @param addDebuff
 * @text 付与デバフ一覧
 * @desc トリガーステート有効時に付与されるデバフのリストです。
 * @default []
 * @type struct<Buff>[]
 *
 * @param switchId
 * @text スイッチID
 * @desc トリガーステート有効時にONになるスイッチIDです。
 * @default 0
 * @type switch
 *
 * @param script
 * @text スクリプト
 * @desc トリガーステート有効時に実行されるスクリプトです。
 * @default
 * @type multiline_string
 *
 * @param conditionTag
 * @text 適用条件タグ
 * @desc トリガーの適用条件を指定するタグです。aaaと指定するとメモ欄に<aaa>を保つバトラーにのみ適用されます。
 * @default
 * @type string
 *
 * @param conditionReverse
 * @text 適用条件反転
 * @desc 適用条件を反転し、条件を満たさないバトラーに適用されます。
 * @default false
 * @type boolean
 */

/*~struct~Buff:
 * @param id
 * @text バフ種別
 * @desc 対象となるバフの種別です。
 * @default 0
 * @type select
 * @option 最大HP
 * @value 0
 * @option 最大MP
 * @value 1
 * @option 攻撃力
 * @value 2
 * @option 防御力
 * @value 3
 * @option 魔法力
 * @value 4
 * @option 魔法防御
 * @value 5
 * @option 敏捷性
 * @value 6
 * @option 運
 * @value 7
 *
 * @param turn
 * @text ターン数
 * @desc バフ(デバフ)のターン数です。解除の場合は入力不要です。
 * @default 5
 * @type number
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.stateList) {
        return;
    }

    const _Game_Battler_addState = Game_Battler.prototype.addState;
    Game_Battler.prototype.addState = function(stateId) {
        const addable = this.isStateAddable(stateId);
        const effectValid = !this.isStateAffected(stateId);
        _Game_Battler_addState.apply(this, arguments);
        if (addable) {
            this.executeStateTrigger(stateId, 'add', effectValid);
        }
    };

    const _Game_Battler_removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function(stateId) {
        const effectValid = this.isStateAffected(stateId);
        _Game_Battler_removeState.apply(this, arguments);
        this.executeStateTrigger(stateId, 'remove', effectValid);
    };

    Game_Battler.prototype.executeStateTrigger = function(stateId, type, effectValid) {
        this._stateTriggerDepth = this._stateTriggerDepth || 0;
        if (this._stateTriggerDepth > 10) {
            return;
        }
        this._stateTriggerDepth++;
        const triggers = param.stateList.filter(trigger => trigger.stateId === stateId && trigger.type === type);
        triggers.forEach(trigger => {
            if (this.isStateTriggerValid(trigger, effectValid)) {
                this.executeStateTriggerEffect(trigger);
            }
        });
        this._stateTriggerDepth--;
    };

    Game_Battler.prototype.isStateTriggerValid = function(trigger, effectValid) {
        if (!effectValid && trigger.affectedOnly) {
            return false;
        }
        if (!trigger.conditionTag) {
            return true;
        }
        const result = this.traitObjects().some(traitObject => {
            return PluginManagerEx.findMetaValue(traitObject, trigger.conditionTag);
        });
        return trigger.conditionReverse ? !result : result;
    };

    Game_Battler.prototype.executeStateTriggerEffect = function(trigger) {
        trigger.removeStates.forEach(stateId => this.removeState(stateId));
        trigger.addStates.forEach(stateId => this.addState(stateId));
        this.executeBuffEffect(trigger.removeBuff, 'removeBuff');
        this.executeBuffEffect(trigger.addBuff, 'addBuff');
        this.executeBuffEffect(trigger.removeDebuff, 'removeBuff');
        this.executeBuffEffect(trigger.addDebuff, 'addDebuff');
        $gameSwitches.setValue(trigger.switchId, true);
        if (trigger.script) {
            eval(trigger.script);
        }
    };

    Game_Battler.prototype.executeBuffEffect = function(buffList, method) {
        if (!buffList) {
            return;
        }
        buffList.forEach(buff => this[method](buff.id, buff.turn));
    };
})();
