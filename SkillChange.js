/*=============================================================================
 SkillChange.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2025/08/03 アイテム変化機能を追加
 1.1.0 2024/10/12 AttackChain.jsとの連携機能を追加
 1.0.0 2024/09/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [X]      : https://x.com/triacontane
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc スキル変化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillChange.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param skillList
 * @text スキル変化リスト
 * @desc スキル変化する条件と変化後のスキルのリストです。同一のスキルIDを複数指定した場合、リストの下が優先されます。
 * @default []
 * @type struct<Skill>[]
 *
 * @param itemList
 * @text アイテム変化リスト
 * @desc アイテム変化する条件と変化後のアイテムのリストです。同一のアイテムIDを複数指定した場合、リストの下が優先されます。
 * @default []
 * @type struct<Item>[]
 *
 * @param changeMessage
 * @text 変化メッセージ
 * @desc スキル変化時にバトルログに表示されるメッセージです。
 * %1:使用者 %2:元スキル名 %3:変化スキル名
 * @default %1の%2が%3に変化した！
 *
 * @param changeAnimation
 * @text 変化アニメーション
 * @desc スキル変化時に表示されるアニメーションIDです。
 * @default 0
 * @type animation
 *
 * @help SkillChange.js
 *
 * 指定した条件のもとでスキルを使用したとき、別のスキルに変化して発動します。
 * スキルが発動する直前に判定されます。
 * スキル変化後のスキルでMP等のコストを消費し足りない場合はスキル変化しません。
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

/*~struct~Skill:
 * @param skillId
 * @text スキルID
 * @desc 変化する元となるスキルIDです。
 * @default 1
 * @type skill
 *
 * @param changeSkillId
 * @text 変化後スキルID
 * @desc 変化した後のスキルIDです。
 * @default 0
 * @type skill
 *
 * @param mimicrySkill
 * @text ものまねスキル
 * @desc 有効にすると変化後のスキルが直前に誰かが使用したスキルになります。
 * @default false
 * @type boolean
 *
 * @param condition
 * @text 変化条件
 * @desc スキル変化の条件です。何も指定しない場合は常にスキル変化します。
 * @default {}
 * @type struct<Condition>
 */

/*~struct~Item:
 * @param itemId
 * @text アイテムID
 * @desc 変化する元となるスキルIDです。
 * @default 1
 * @type item
 *
 * @param changeItemId
 * @text 変化後アイテムID
 * @desc 変化した後のアイテムIDです。
 * @default 0
 * @type item
 *
 * @param condition
 * @text 変化条件
 * @desc スキル変化の条件です。何も指定しない場合は常にスキル変化します。
 * @default {}
 * @type struct<Condition>
 */

/*~struct~Condition:
 * @param level
 * @text レベル条件
 * @desc 使用者のレベルが指定した値以上の場合にスキル変化します。（アクターのみ条件を満たします）
 * @default 0
 * @type number
 *
 * @param ParamType
 * @text パラメータ条件
 * @desc 使用者のパラメータが指定条件を満たしたときにスキル変化します。
 * @default
 * @type select
 * @option なし
 * @value
 * @option HP割合
 * @value hpRate
 * @option MP割合
 * @value mpRate
 * @option TP割合
 * @value tpRate
 * @option 攻撃力
 * @value atk
 * @option 防御力
 * @value def
 * @option 魔法力
 * @value mat
 * @option 魔法防御
 * @value mdf
 * @option 敏捷性
 * @value agi
 * @option 運
 * @value luk
 *
 * @param paramValue
 * @text パラメータ条件値
 * @desc パラメータ条件を満たす値です。
 * @default 0
 * @type number
 * @parent ParamType
 *
 * @param paramMethod
 * @text パラメータ条件方法
 * @desc パラメータ条件の比較方法です。
 * @default >=
 * @type select
 * @option >=
 * @option <
 * @parent ParamType
 *
 * @param switchId
 * @text スイッチ条件
 * @desc 指定したスイッチがONの場合にスキル変化します。
 * @default 0
 * @type switch
 *
 * @param actorIdList
 * @text アクター条件
 * @desc 指定したアクターが使用した場合にスキル変化します。
 * @default []
 * @type actor[]
 *
 * @param classIdList
 * @text 職業条件
 * @desc 指定した職業が使用した場合にスキル変化します。
 * @default []
 * @type class[]
 *
 * @param enemyIdList
 * @text 敵キャラ条件
 * @desc 指定した敵キャラが使用した場合にスキル変化します。
 * @default []
 * @type enemy[]
 *
 * @param chain
 * @text 連携条件
 * @desc AttackChain.jsを使っている場合、連携数が指定値以上になるとスキル変化します。
 * @default 0
 * @type number
 *
 * @param script
 * @text スクリプト条件
 * @desc スクリプトで条件を指定します。条件を満たす場合にスキル変化します。
 * @default
 * @type multiline_string
 *
 * @param reverse
 * @text 条件反転
 * @desc 他の項目で指定した条件を「満たさない場合に」スキル変化します。
 * @default false
 * @type boolean
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.skillList) {
        param.skillList = [];
    }

    const _BattleManager_processTurn = BattleManager.processTurn;
    BattleManager.processTurn = function() {
        const changeSkillData = this._subject.currentActionSkillChange();
        if (changeSkillData) {
            this._logWindow.displayActionChange(this._subject, changeSkillData);
        }
        _BattleManager_processTurn.apply(this, arguments);
    };

    Window_BattleLog.prototype.displayActionChange = function(target, changeSkillData) {
        const fmt = param.changeMessage;
        if (fmt) {
            const newSkillName = changeSkillData.newSkillName;
            const oldSkillName = changeSkillData.oldSkillName;
            this.push('addText', fmt.format(target.name(), oldSkillName, newSkillName));
        }
        const animationId = param.changeAnimation;
        if (animationId > 0) {
            this.showNormalAnimation([target], animationId);
        }
    };

    Game_Battler.prototype.currentActionSkillChange = function() {
        const action = this.currentAction();
        if (action && action.isSkill()) {
            const newSkillId = this.findSkillChangeId(action);
            if (newSkillId && this.canUse($dataSkills[newSkillId])) {
                const oldSkillId = action.item().id;
                action.setSkill(newSkillId);
                return { newSkillName: $dataSkills[newSkillId].name, oldSkillName: $dataSkills[oldSkillId].name};
            }
        }
        if (action && action.isItem()) {
            const newItemId = this.findItemChangeId(action);
            if (newItemId && this.canUse($dataItems[newItemId])) {
                const oldItemId = action.item().id;
                action.setItem(newItemId);
                return { newSkillName: $dataItems[newItemId].name, oldSkillName: $dataItems[oldItemId].name};
            }
        }
        return null;
    };

    Game_Battler.prototype.findSkillChangeId = function(action) {
        const skillId = action.item().id;
        const skill = param.skillList.find(data => data.skillId === skillId && this.meetsSkillChangeCondition(data.condition));
        if (!skill) {
            return;
        }
        if (skill.mimicrySkill) {
            const mimicrySkillId = $gameTemp.lastActionData(0);
            if (mimicrySkillId) {
                return mimicrySkillId;
            }
        } else {
            return skill.changeSkillId;
        }
        return null;
    };

    Game_Battler.prototype.findItemChangeId = function(action) {
        const itemId = action.item().id;
        const item = param.itemList.find(data => data.itemId === itemId && this.meetsSkillChangeCondition(data.condition));
        return item.changeItemId || null;
    }

    Game_Battler.prototype.meetsSkillChangeCondition = function(cData) {
        const conditions = [];
        conditions.push(() => !cData.level || this._level >= cData.level);
        conditions.push(() => this.meetsSkillChangeParamCondition(cData));
        conditions.push(() => !cData.switchId || $gameSwitches.value(cData.switchId));
        conditions.push(() => !cData.actorIdList?.length || cData.actorIdList.includes(this._actorId));
        conditions.push(() => !cData.classIdList?.length || cData.classIdList.includes(this._classId));
        conditions.push(() => !cData.enemyIdList?.length || cData.enemyIdList.includes(this._enemyId));
        conditions.push(() => !cData.chain || this.friendsUnit().getChainCount() >= cData.chain);
        conditions.push(() => !cData.script || eval(cData.script));
        const result = conditions.every(condition => condition());
        return cData.reverse ? !result : result;
    };

    Game_Battler.prototype.meetsSkillChangeParamCondition = function(cData) {
        const type = cData.ParamType;
        if (!type) {
            return true;
        }
        const value = this.findSkillChangeParamValue(type);
        if (value === undefined) {
            return false;
        }
        const method = cData.paramMethod;
        if (method === '>=') {
            return value >= cData.paramValue;
        } else {
            return value < cData.paramValue;
        }
    };

    Game_Battler.prototype.findSkillChangeParamValue = function(type) {
        switch (type) {
            case 'hpRate':
                return this.hpRate() * 100;
            case 'mpRate':
                return this.mpRate() * 100;
            case 'tpRate':
                return this.tpRate() * 100;
            default:
                return this[type] || undefined;
        }
    };
})();
