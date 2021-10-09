//=============================================================================
// StateChangeIfRemove.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2021/10/08 MZで動作するよう全面的に修正
// 1.2.0 2018/08/05 ステート解除でスイッチを操作する機能を追加
// 1.1.2 2017/07/12 YEP_BattleEngineCore.jsと組み合わせたときに戦闘不能へのステート変化ができない競合を解消
// 1.1.1 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.1.0 2016/02/07 解除条件によって様々なステートIDを付与できる機能を追加
// 1.0.0 2016/02/04 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ステート解除時の変化プラグイン
 * @target MZ 
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateChangeIfRemove.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param list
 * @text ステートリスト
 * @desc ステート解除時の変化ステートの一覧を設定します。
 * @default []
 * @type struct<STATE>[]
 *
 * @help ステートが解除されたタイミングで、自動的に別のステートに変化させます。
 * プラグインパラメータから情報を設定してください。
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

/*~struct~STATE:
 * @param targetStateId
 * @text 対象ステートID
 * @desc 解除のトリガーとなるステートIDです。同一のステートIDの情報は複数定義できません。
 * @default 1
 * @type state
 *
 * @param changeStateId
 * @text 変化ステートID
 * @desc 対象ステートが解除されたときに付与されるステートIDです。IDを変数で指定したい場合は制御文字を使用してください。
 * @default 1
 * @type state
 *
 * @param condition
 * @text 解除条件
 * @desc 対象ステートが解除された状況によってステート変化が有効になるかどうかを指定します。未指定の場合、常に変化します。
 * @default []
 * @type select[]
 * @option アイテムやスキルの効果で解除
 * @value item
 * @option 歩数で解除
 * @value step
 * @option 行動制約で解除
 * @value restrict
 * @option ダメージで解除
 * @value damage
 * @option 戦闘終了時に解除
 * @value battleEnd
 * @option ターン経過等で自動解除
 * @value auto
 *
 * @param triggerSwitch
 * @text 変化トリガースイッチ
 * @desc 対象ステートが変化したとき、指定したスイッチがONになります。
 * @default 0
 * @type switch
 *
 * @param noRemoveMessage
 * @text 解除メッセージ非表示
 * @desc ステート変化時に本来のステート解除メッセージが表示されなくなります。
 * @default false
 * @type boolean
 *
 * @param noAddedMessage
 * @text 付与メッセージ非表示
 * @desc ステート変化時に本来のステート付与メッセージが表示されなくなります。
 * @default false
 * @type boolean
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.list || param.list.length === 0) {
        console.warn('!!State list not found. by ' + PluginManagerEx.findPluginName(script));
        return;
    }

    //=============================================================================
    //  Game_Actor
    //   解除時のステート変更処理を追加
    //=============================================================================
    const _Game_Actor_updateStateSteps = Game_Actor.prototype.updateStateSteps;
    Game_Actor.prototype.updateStateSteps = function(state) {
        _Game_Actor_updateStateSteps.apply(this, arguments);
        this.changeState(state.id, 'step');
    };

    //=============================================================================
    //  Game_Action
    //   解除時のステート変更処理を追加
    //=============================================================================
    const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        target.checkToRemoveStates(_Game_Action_applyItemEffect.bind(this), arguments, 'item');
    };

    //=============================================================================
    //  Game_Battler
    //   解除時のステート変更処理を追加
    //=============================================================================
    const _Game_Battler_removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function(stateId) {
        _Game_Battler_removeState.apply(this, arguments);
        this.changeState(stateId, '');
    };

    const _Game_Battler_onRestrict = Game_Battler.prototype.onRestrict;
    Game_Battler.prototype.onRestrict = function() {
        this.checkToRemoveStates(_Game_Battler_onRestrict.bind(this), arguments, 'restrict');
    };

    const _Game_Battler_removeStatesByDamage = Game_Battler.prototype.removeStatesByDamage;
    Game_Battler.prototype.removeStatesByDamage = function() {
        this.checkToRemoveStates(_Game_Battler_removeStatesByDamage.bind(this), arguments, 'damage');
    };

    const _Game_Battler_removeBattleStates = Game_Battler.prototype.removeBattleStates;
    Game_Battler.prototype.removeBattleStates = function() {
        this.checkToRemoveStates(_Game_Battler_removeBattleStates.bind(this), arguments, 'battleEnd');
    };

    const _Game_Battler_removeStatesAuto = Game_Battler.prototype.removeStatesAuto;
    Game_Battler.prototype.removeStatesAuto = function(timing) {
        this.checkToRemoveStates(_Game_Battler_removeStatesAuto.bind(this), arguments, 'auto');
    };

    const _Game_BattlerBase_updateStateTurnTiming = Game_BattlerBase.prototype.updateStateTurnTiming;
    Game_BattlerBase.prototype.updateStateTurnTiming = function(timing) {
        this.checkToRemoveStates(_Game_BattlerBase_updateStateTurnTiming.bind(this), arguments, 'auto');
    };

    Game_Battler.prototype.checkToRemoveStates = function(handler, args, tagName) {
        const prevStates = this.states();
        handler.apply(null, args);
        prevStates.forEach(state => this.changeState(state.id, tagName));
    };

    Game_Battler.prototype.changeState = function(stateId, condition) {
        const data = param.list.find(item => item.targetStateId === stateId);
        if (!data || this.hasState(stateId)) {
            return;
        }
        if (data.condition && data.condition.length > 0 &&
            !data.condition.find(item => item === condition)) {
            return;
        }
        if (data.noRemoveMessage) {
            this._result.deleteRemovedStates(stateId);
        }
        if (data.changeStateId) {
            this.addState(data.changeStateId);
            if (data.noAddedMessage) {
                this._result.deleteAddedStates(data.changeStateId);
            }
        }
        if (data.triggerSwitch) {
            $gameSwitches.setValue(data.triggerSwitch, true);
        }
    };

    Game_Battler.prototype.hasState = function(stateId) {
        return this._states.contains(stateId);
    };

    //=============================================================================
    // Game_ActionResult
    //  ステート付与、解除時のメッセージを抑制します。
    //=============================================================================
    Game_ActionResult.prototype.deleteRemovedStates = function(stateId) {
        this.removedStates.forEach((value, index) => {
            if (value === stateId) {
                this.removedStates.splice(index, 1);
            }
        });
    };

    Game_ActionResult.prototype.deleteAddedStates = function(stateId) {
        this.addedStates.forEach((value, index) => {
            if (value === stateId) {
                this.addedStates.splice(index, 1);
            }
        });
    };
})();
