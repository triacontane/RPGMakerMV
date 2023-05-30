//=============================================================================
// CursedAction.js
// ----------------------------------------------------------------------------
// (C)2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2023/05/31 MZで動作するよう全面的に修正
// 1.0.1 2020/02/26 特定条件化で戦闘行動の強制を実行するとエラーになる問題を修正
// 1.0.0 2018/06/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 呪われたプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CursedAction.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param actionList
 * @text 行動リスト
 * @desc 呪いによって行動が変化するリストです。複数指定可能です。
 * @default []
 * @type struct<CursedAction>[]
 *
 * @param priority
 * @text 優先度
 * @desc 自動戦闘および混乱の設定との優先度を選択します。
 * @default 2
 * @type select
 * @option 自動戦闘が優先
 * @value 0
 * @option 自動戦闘より優先
 * @value 1
 * @option 自動戦闘、混乱より優先
 * @value 2
 *
 * @param message
 * @text 呪いのメッセージ
 * @desc 呪いによって行動が変化した場合に表示するメッセージです。%1でバトラー名に変換されます。
 * @default
 *
 * @help CursedAction.js
 *
 * 戦闘中、指定した行動とは異なる行動を取らせることができます。
 * 行動が変化する条件や確率も設定できます。
 * 特徴を有するデータベース(※1)のメモ欄に以下の通り入力してください。
 * ※1 アクター、職業、武器、防具、ステート、敵キャラ
 *
 * <CursedAction:name> # 名称[name]で設定した呪い行動を実行
 * <呪い行動:name>      # 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~CursedAction:
 *
 * @param name
 * @text 名称
 * @desc 呪い行動の名称です。メモタグからこの名称を指定します。同一名称の行動を複数指定すると、その中からランダムで選択されます。
 * @default action01
 * @type string
 * 
 * @param skillId
 * @text スキルID
 * @desc 行動として実行するスキルIDです。
 * @default 1
 * @type skill
 *
 * @param probability
 * @text 確率
 * @desc 行動を実行する確率です。
 * @default 100
 * @type number
 * @max 100
 * @min 0
 *
 * @param conditionSwitchId
 * @text 条件スイッチID
 * @desc 指定したスイッチがONのときのみ行動を実行します。
 * @default 0
 * @type switch
 *
 * @param conditionScript
 * @text 条件スクリプト
 * @desc 指定したスクリプトの評価結果がtrueのときのみ行動を実行します。
 * @default
 * @type string
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * Game_Action:呪い行動を実行します。
     */
    const _Game_Action_prepare = Game_Action.prototype.prepare;
    Game_Action.prototype.prepare = function() {
        _Game_Action_prepare.apply(this, arguments);
        const skillId = this.subject().getCursedSkillIdIfExist();
        if (skillId) {
            this.setSkill(skillId);
        }
    };

    /**
     * Game_Battler:呪い行動の作成処理を追加します。
     */
    Game_Battler.prototype.getCursedSkillIdIfExist = function() {
        if (!this.canCurse()) {
            this._cursedActionList = [];
            return null;
        }
        this._cursedActionList = this.createCursedActionList();
        if (this.isCursed()) {
            return this._cursedActionList[Math.randomInt(this._cursedActionList.length)];
        } else {
            return null;
        }
    };

    Game_Battler.prototype.createCursedActionList = function() {
        const names = this.traitObjects()
            .map(obj => PluginManagerEx.findMetaValue(obj, ['CursedAction', '呪い行動']));
        return param.actionList
            .filter(action => this.isValidCursedAction(action, names))
            .map(action => action.skillId);
    };

    Game_Battler.prototype.isValidCursedAction = function(action, names) {
        const conditions = [];
        conditions.push(() => names.includes(action.name));
        conditions.push(() => Math.randomInt(100) < action.probability);
        conditions.push(() => this.isValidCursedActionSwitch(action));
        conditions.push(() => this.isValidCursedActionScript(action));
        return conditions.every(condition => condition());
    }

    Game_Battler.prototype.isValidCursedActionSwitch = function(action) {
        return !action.conditionSwitchId || $gameSwitches.value(action.conditionSwitchId);
    }

    Game_Battler.prototype.isValidCursedActionScript = function(action) {
        return !action.conditionScript || eval(action.conditionScript);
    }

    Game_Battler.prototype.isCursed = function() {
        const list = this._cursedActionList;
        return list && list.length > 0;
    };

    Game_Battler.prototype.canCurse = function() {
        return !(param.priority < 2 && this.isConfused()) && !this._actions?.some(action => action._forcing);
    };

    /**
     * Game_Actor:呪い行動の作成処理を追加します。
     */
    Game_Actor.prototype.canCurse = function() {
        return Game_Battler.prototype.canCurse.call(this) && !(param.priority < 1 && this.isAutoBattle());
    };

    const _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        if (subject.isCursed() && param.message) {
            this.push('addText', param.message.format(subject.name()));
        }
        _Window_BattleLog_startAction.apply(this, arguments);
    };
})();
