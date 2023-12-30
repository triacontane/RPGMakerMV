/*=============================================================================
 ActionEffectExtend.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/12/28 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 使用効果拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ActionEffectExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param effects
 * @text 使用効果リスト
 * @desc 使用効果の一覧です。スキルやアイテム使用時の追加効果を定義します。
 * @default []
 * @type struct<Effects>[]
 *
 * @help ActionEffectExtend.js
 *
 * スキルやアイテムの使用効果をより柔軟に指定できます。
 * デフォルトの使用効果では表現しきれない場合に使用します。
 * プラグインパラメータから効果情報を設定のうえ
 * スキル、アイテムのメモ欄に以下の通り記述してください。
 *
 * <effect:id01> # 識別子[id01]の効果が使用時に適用されます。
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

/*~struct~Effects:
 * @param id
 * @text 識別子
 * @desc スキルやアイテムのメモ欄で指定するIDです。<effect:id01>
 * @default id01
 * @type string
 *
 * @param itemList
 * @text 効果項目リスト
 * @desc 適用される効果の一覧です。記載した効果がすべて適用されます。
 * @default []
 * @type struct<EffectItem>[]
 *
 * @param target
 * @text 対象
 * @desc 使用効果が適用される対象です。
 * @default target
 * @type select
 * @option 対象者
 * @value target
 * @option 使用者
 * @value user
 * @option 対象者と使用者
 * @value both
 * @option 対象者の味方全員
 * @value targetAll
 * @option 対象者の味方ランダム
 * @value targetRandom
 * @option 使用者の味方全員
 * @value userAll
 * @option 使用者の味方ランダム
 * @value userRandom
 * @option 敵味方全員
 * @value all
 *
 * @param animation
 * @text アニメーション
 * @desc 使用効果の際に再生されるアニメーションです。
 * @default 0
 * @type animation
 *
 * @param message
 * @text メッセージ
 * @desc 使用効果の際に表示されるメッセージです。
 * @default
 * @type string
 *
 */

/*~struct~EffectItem:
 *
 * @param stateType
 * @text ステート種別
 * @desc ステートの付与や解除の種別です。複数のステートに対して同時に付与や解除できます。
 * @default
 * @type select
 * @option なし
 * @value
 * @option 付与
 * @value add
 * @option 解除
 * @value remove
 * @option ランダムでひとつ付与
 * @value addRandom
 * @option 全解除
 * @value removeAll
 *
 * @param states
 * @text ステート
 * @desc 付与や解除の対象となるステート一覧です。全解除を選択した場合は、本指定に拘わらず全てのステートが解除されます。
 * @default []
 * @type state[]
 * @parent stateType
 *
 * @param damageType
 * @text ダメージ種別
 * @desc ダメージの種別です
 * @default
 * @type select
 * @option なし
 * @value
 * @option HP
 * @value hp
 * @option MP
 * @value mp
 * @option TP
 * @value tp
 *
 * @param damageValue
 * @text ダメージ量
 * @desc ダメージの量です。負の値を指定すると回復になります。
 * @default 0
 * @type number
 * @min -9999999
 * @max 9999999
 * @parent damageType
 *
 * @param levelUp
 * @text レベルアップ
 * @desc レベルアップします。
 * @default false
 * @type boolean
 *
 * @param exp
 * @text 経験値獲得
 * @desc 経験値を獲得します。獲得量は、経験獲得率の特徴の影響を受けません。
 * @default 0
 * @type number
 *
 * @param showLevelUpMessage
 * @text メッセージ表示
 * @desc レベルアップ時にメッセージを表示します。メニュー画面で使用するとマップ画面に戻ってから表示します。
 * @default false
 * @type boolean
 *
 * @param disarmament
 * @text 武装解除
 * @desc 装備している武器や防具を解除します。装備固定されている場合は無効です。
 * @default false
 * @type boolean
 *
 * @param equipType
 * @text 装備タイプ
 * @desc 解除する装備タイプです。0を指定した場合、全ての武具が解除されます。
 * @default 0
 * @type number
 * @parent disarmament
 *
 * @param switchId
 * @text スイッチ操作
 * @desc 指定した番号のスイッチを操作します。
 * @default 0
 * @type switch
 *
 * @param switchValue
 * @text スイッチ値
 * @desc 操作するスイッチの値です。
 * @default true
 * @type boolean
 * @parent switchId
 *
 * @param script
 * @text スクリプト
 * @desc スクリプトを実行します。thisで効果の対象者を、subjectで使用者を参照できます。
 * @default
 * @type multiline_string
 *
 * @param probability
 * @text 発生確率
 * @desc 効果が発生する確率です。100を指定すると必ず発生します。
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
    if (!param.effects) {
        param.effects = [];
    }

    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.extendMassage = null;
        this.extendAnimation = null;
    };

    Game_ActionResult.prototype.setEffectExtend = function(effect) {
        this.extendMassage = effect.message;
        this.extendAnimation = effect.animation;
        this.used = true;
    };

    const _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        this.clearActionExtendBattler();
    };

    BattleManager.clearActionExtendBattler = function() {
        this._actionExtendBattlers = [];
    };

    BattleManager.appendActionExtendBattler = function(battler) {
        this._actionExtendBattlers.push(battler);
    };

    const _BattleManager_invokeNormalAction = BattleManager.invokeNormalAction;
    BattleManager.invokeNormalAction = function(subject, target) {
        _BattleManager_invokeNormalAction.apply(this, arguments);
        const battlers = this._actionExtendBattlers;
        if (battlers.length > 0) {
            battlers.filter(battler => battler !== target)
                .forEach(battler => this._logWindow.displayActionResults(subject, battler));
            this._logWindow.setupEffectExtend(battlers);
            this.clearActionExtendBattler();
        }
    };

    Window_BattleLog.prototype.setupEffectExtend = function(battlers) {
        this._damagePopupBattlers = battlers;
        const animationId = battlers[0].result().extendAnimation;
        if (animationId > 0) {
            this._methods.unshift({name: 'showAnimation', params: [null, battlers, animationId]});
        }
    };

    const _Window_BattleLog_popupDamage = Window_BattleLog.prototype.popupDamage;
    Window_BattleLog.prototype.popupDamage = function(target) {
        _Window_BattleLog_popupDamage.apply(this, arguments);
        if (this._damagePopupBattlers) {
            this._damagePopupBattlers.forEach(battler => {
                if (battler.shouldPopupDamage()) {
                    battler.startDamagePopup();
                }
            });
            this._damagePopupBattlers = null;
        }
    };

    const _Window_BattleLog_displayFailure = Window_BattleLog.prototype.displayFailure;
    Window_BattleLog.prototype.displayFailure = function(target) {
        _Window_BattleLog_displayFailure.apply(this, arguments);
        this.displayActionExtendResults(target);
    };

    Window_BattleLog.prototype.displayActionExtendResults = function(target) {
        const result = target.result();
        if (result.extendMassage) {
            this.push('addText', result.extendMassage.format(target.name()));
        }
    };

    const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        this.applyItemEffectExtend(target);
    };

    Game_Action.prototype.applyItemEffectExtend = function(target) {
        const effect = this.findItemEffectExtend();
        if (!effect) {
            return;
        }
        this.findEffectExtendTargets(effect.target, target).forEach(target => {
            target.applyItemEffectExtend(effect, this.subject());
            if ($gameParty.inBattle()) {
                BattleManager.appendActionExtendBattler(target);
            }
        });
    };

    Game_Action.prototype.findItemEffectExtend = function() {
        const tagName = this.item().meta.effect;
        return param.effects.find(e => e.id === tagName);
    };

    const _Game_Action_hasItemAnyValidEffects = Game_Action.prototype.hasItemAnyValidEffects;
    Game_Action.prototype.hasItemAnyValidEffects = function(target) {
        const result = _Game_Action_hasItemAnyValidEffects.apply(this, arguments);
        return result || !!this.findItemEffectExtend();
    };

    Game_Action.prototype.findEffectExtendTargets = function(effectTarget, actionTarget) {
        switch (effectTarget) {
            case 'target':
                return [actionTarget];
            case 'user':
                return [this.subject()];
            case 'both':
                return [actionTarget, this.subject()];
            case 'targetAll':
                return actionTarget.friendsUnit().members();
            case 'targetRandom':
                return [actionTarget.friendsUnit().randomTarget()];
            case 'userAll':
                return this.subject().friendsUnit().members();
            case 'userRandom':
                return [this.subject().friendsUnit().randomTarget()];
            case 'all':
                return $gameParty.members().concat($gameTroop.members());
            default:
                return [];
        }
    };

    Game_Battler.prototype.applyItemEffectExtend = function(effect, actionSubject) {
        effect.itemList
            .filter(item => Math.randomInt(100) < item.probability)
            .forEach(item => this.applyEffectExtendItem(item, actionSubject));
        this.result().setEffectExtend(effect);
    };

    Game_Battler.prototype.applyEffectExtendItem = function(item, subject) {
        if (item.stateType) {
            this.applyEffectExtendState(item.stateType, item.states);
        }
        if (item.damageType) {
            this.applyEffectExtendDamage(item.damageType, item.damageValue);
        }
        if (item.switchId) {
            $gameSwitches.setValue(item.switchId, item.switchValue);
        }
        if (item.script) {
            eval(item.script);
        }
        this.result().success = true;
    };

    Game_Actor.prototype.applyEffectExtendItem = function(item) {
        this._itemLevelUp = true;
        if (item.levelUp) {
            this.changeExp(this.nextLevelExp() - this.currentExp(), item.showLevelUpMessage);
        }
        if (item.exp) {
            const newExp = this.currentExp() + item.exp;
            this.changeExp(newExp, item.showLevelUpMessage);
        }
        this._itemLevelUp = false;
        if (item.disarmament) {
            if (item.equipType) {
                this.clearEquipmentsByEType(item.equipType);
            } else {
                this.clearEquipments();
            }
        }
        Game_Battler.prototype.applyEffectExtendItem.apply(this, arguments);
    };

    const _Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
    Game_Actor.prototype.displayLevelUp = function(newSkills) {
        _Game_Actor_displayLevelUp.apply(this, arguments);
        if (this._itemLevelUp && !$gameParty.inBattle()) {
            SceneManager.goto(Scene_Map);
        }
    };

    Game_Actor.prototype.clearEquipmentsByEType = function(eType) {
        const slots = this.equipSlots();
        for (let i = 0; i < slots.length; i++) {
            if (this.isEquipChangeOk(i) && slots[i] === eType) {
                this.changeEquip(i, null);
            }
        }
    };

    Game_Battler.prototype.applyEffectExtendState = function(stateType, states) {
        switch (stateType) {
            case 'add':
                states.forEach(state => this.addState(state));
                break;
            case 'remove':
                states.forEach(state => this.removeState(state));
                break;
            case 'addRandom':
                this.addNewState(states[Math.randomInt(states.length)]);
                break;
            case 'removeAll':
                this.clearStates();
                break;
        }
    };

    Game_Battler.prototype.applyEffectExtendDamage = function(damageType, damageValue) {
        switch (damageType) {
            case 'hp':
                this.gainHp(-damageValue);
                if (damageValue > 0) {
                    this.onDamage(damageValue);
                }
                break;
            case 'mp':
                this.gainMp(-damageValue);
                break;
            case 'tp':
                this.gainTp(-damageValue);
                break;
        }
    };
})();
