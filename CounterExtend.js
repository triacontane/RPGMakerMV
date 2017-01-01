//=============================================================================
// CounterExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2016/11/27 反撃スキルIDを複数設定できる機能を追加。条件に応じたスキルで反撃します。
// 1.1.0 2016/11/20 特定のスキルによる反撃や反撃条件を細かく指定できる機能を追加
// 1.0.0 2016/11/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc CounterExtendPlugin
 * @author triacontane
 *
 * @param PayCounterCost
 * @desc 固有スキルによる反撃がコスト消費するかどうかを設定します。(ON/OFF)
 * @default OFF
 *
 * @param FailureCostShortage
 * @desc 固有スキルによる反撃がコスト不足の場合、反撃は行いません。(ON/OFF)
 * @default OFF
 *
 * @help 反撃の仕様を拡張します。
 * 魔法に対する反撃や、特定のスキルを使った反撃、
 * 特定の条件下でのみ発動する反撃などが作成できます。
 *
 * 具体的な機能詳細は以下の通りです。
 *
 * 機能詳細
 *
 * 1. 魔法攻撃を受けた場合もカウンターが発動するようになります。
 * 特徴を有するメモ欄(※1)に以下の通り入力してください。
 *
 * <CE_魔法反撃:50>      # 魔法攻撃を受けた場合に50%の確率で反撃します。
 * <CE_MagicCounter:50>  # 同上
 *
 * ※1 アクター、職業、武器、防具、ステートが該当します。
 *
 * 数値を指定しない場合は、物理攻撃と同様の反撃率が適用されます。
 *
 * <CE_魔法反撃>     # 魔法攻撃を受けた場合にもともとの反撃率で反撃します。
 * <CE_MagicCounter> # 同上
 *
 * 2. 反撃時のスキルを個別に設定することができます。
 * 特徴を有するメモ欄に以下の通り入力してください。
 *
 * <CE_反撃スキルID:\v[1]>    # 反撃時に変数[1]のIDのスキルを使用します。
 * <CE_CounterSkillId:\v[1]>  # 同上
 * <CE_魔法反撃スキルID:3>    # 魔法反撃時にID[3]のスキルを使用します。
 * <CE_MagicCounterSkillId:3> # 同上
 *
 * 3. 反撃条件をJavaScript計算式の評価結果を利用できます。
 * 反撃条件を満たさない場合は反撃は実行されません。
 * 特徴を有するメモ欄に以下の通り入力してください。
 *
 * <CE_反撃条件:v(1) &lt; 100>    # 変数[1]が100より小さければ反撃します。
 * <CE_CounterCond:v(1) &lt; 100> # 同上(※2)
 * <CE_魔法反撃条件:s(1)>         # スイッチ[1]がONなら魔法反撃します。
 * <CE_MagicCounterCond:s(1)>     # 同上
 *
 * 実行したスキルの情報はローカル変数「skill」で参照できます。
 * <CE_反撃条件:skill.id === 10>              # スキルIDが[10]なら反撃します。
 * <CE_反撃条件:skill.damage.elementId === 3> # スキル属性が[3]なら反撃します。
 *
 * 対象のバトラー情報は「this」で、相手のバトラー情報は「target」で参照できます。
 * <CE_反撃条件:this.hpRate() &lt; 0.5> # 自分のHPが50%を下回ると反撃します。
 *
 * ※2 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * 4. 反撃実行時に専用のアニメーションIDを再生します。
 * 特徴を有するメモ欄に以下の通り入力してください。
 * <CE_反撃アニメID:20>       # 反撃実行前にアニメーション[20]を再生します。
 * <CE_CounterAnimationId:20> # 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 反撃拡張プラグイン
 * @author トリアコンタン
 *
 * @param 反撃コスト消費
 * @desc 固有スキルによる反撃がコスト消費するかどうかを設定します。(ON/OFF)
 * @default OFF
 *
 * @param コスト不足で失敗
 * @desc 固有スキルによる反撃がコスト不足の場合、反撃は行いません。(ON/OFF)
 * @default OFF
 *
 * @help 反撃の仕様を拡張します。
 * 魔法に対する反撃や、特定のスキルを使った反撃、
 * 特定の条件下でのみ発動する反撃などが作成できます。
 *
 * 具体的な機能詳細は以下の通りです。
 *
 * 機能詳細
 *
 * 1. 魔法攻撃を受けた場合もカウンターが発動するようになります。
 * 特徴を有するメモ欄(※1)に以下の通り入力してください。
 *
 * <CE_魔法反撃:50>      # 魔法攻撃を受けた場合に50%の確率で反撃します。
 * <CE_MagicCounter:50>  # 同上
 *
 * ※1 アクター、職業、武器、防具、ステートが該当します。
 *
 * 数値を指定しない場合は、物理攻撃と同様の反撃率が適用されます。
 *
 * <CE_魔法反撃>     # 魔法攻撃を受けた場合にもともとの反撃率で反撃します。
 * <CE_MagicCounter> # 同上
 *
 * 2. 反撃時のスキルを個別に設定することができます。
 * 特徴を有するメモ欄に以下の通り入力してください。
 *
 * <CE_反撃スキルID:\v[1]>    # 反撃時に変数[1]のIDのスキルを使用します。
 * <CE_CounterSkillId:\v[1]>  # 同上
 * <CE_魔法反撃スキルID:3>    # 魔法反撃時にID[3]のスキルを使用します。
 * <CE_MagicCounterSkillId:3> # 同上
 *
 * 3. 反撃条件をJavaScript計算式の評価結果を利用できます。
 * 反撃条件を満たさない場合は反撃は実行されません。
 * 特定のスキルに対してのみ反撃したり、特定の条件下でのみ反撃したりできます。
 * 特徴を有するメモ欄に以下の通り入力してください。
 *
 * <CE_反撃条件:v(1) &lt; 100>    # 変数[1]が100より小さければ反撃します。
 * <CE_CounterCond:v(1) &lt; 100> # 同上(※2)
 * <CE_魔法反撃条件:s(1)>         # スイッチ[1]がONなら魔法反撃します。
 * <CE_MagicCounterCond:s(1)>     # 同上
 *
 * 実行したスキルの情報はローカル変数「skill」で参照できます。
 * <CE_反撃条件:skill.id === 10> # スキルIDが[10]なら反撃します。
 * <CE_反撃条件:elementId === 3> # スキル属性IDが[3]なら反撃します。
 *
 * 対象のバトラー情報は「this」で、相手のバトラー情報は「target」で参照できます。
 * <CE_反撃条件:this.hpRate() &lt; 0.5> # 自分のHPが50%を下回ると反撃します。
 *
 * ※2 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * 4. 複数の反撃スキルおよび反撃条件を設定できます。
 * 複数定義する場合は、末尾に「_1」を付与してください。
 * <CE_反撃スキルID:4>   # スイッチ[1]がONならスキルID[4]で反撃
 * <CE_反撃条件:s(1)>    #
 * <CE_反撃スキルID_1:5> # スイッチ[2]がONならスキルID[5]で反撃
 * <CE_反撃条件_1:s(2)>  #
 * <CE_反撃スキルID_2:6> # スイッチ[3]がONならスキルID[6]で反撃
 * <CE_反撃条件_2:s(3)>  #
 *
 * 複数の条件を一度に満たした場合は、インデックスの小さい方が
 * 優先して使用されます。
 *
 * 5. 反撃実行時に専用のアニメーションIDを再生します。
 * 特徴を有するメモ欄に以下の通り入力してください。
 * <CE_反撃アニメID:20>       # 反撃実行前にアニメーション[20]を再生します。
 * <CE_CounterAnimationId:20> # 同上
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var Imported = Imported || {};

(function() {
    'use strict';
    const pluginName    = 'CounterExtend';
    const metaTagPrefix = 'CE_';

    const getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    const getParamBoolean = function(paramNames) {
        const value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    const getArgEval = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (eval(convertEscapeCharacters(arg)) || 0).clamp(min, max);
    };

    const getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    const getMetaValue = function(object, name) {
        const metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    const getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (let i = 0, n = names.length; i < n; i++) {
            const value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    const convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        text = text.replace(/&gt;?/gi, '>');
        text = text.replace(/&lt;?/gi, '<');
        const windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    const paramPayCounterCost      = getParamBoolean(['PayCounterCost', '反撃コスト消費']);
    const paramFailureCostShortage = getParamBoolean(['FailureCostShortage', 'コスト不足で失敗']);

    //=============================================================================
    // Game_BattlerBase
    //  行動制約が有効なステートデータを取得します。
    //=============================================================================
    Game_BattlerBase.prototype.isValidMagicCounter = function() {
        return this.traitObjects().some(function(traitObject) {
            return getMetaValues(traitObject, ['魔法反撃', 'MagicCounter']);
        });
    };

    Game_BattlerBase.prototype.getMagicCounterRate = function() {
        return this.traitObjects().reduce(function(prevValue, traitObject) {
            const metaValue = getMetaValues(traitObject, ['魔法反撃', 'MagicCounter']);
            return metaValue ? Math.max(getArgEval(metaValue) / 100, prevValue) : prevValue;
        }, 0);
    };

    Game_BattlerBase.prototype.getCounterAnimationId = function() {
        let counterAnimationId = 0;
        this.traitObjects().some(function(traitObject) {
            const metaValue = getMetaValues(traitObject, ['反撃アニメID', 'CounterAnimationId']);
            if (metaValue) {
                counterAnimationId = getArgEval(metaValue, 1);
                return true;
            }
            return false;
        }.bind(this));
        return counterAnimationId;
    };

    Game_BattlerBase.prototype.reserveCounterSkillId = function(names) {
        this._reserveCounterSkillId = 0;
        this.traitObjects().some(function(traitObject) {
            const metaValue = getMetaValues(traitObject, names);
            if (metaValue) {
                this._reserveCounterSkillId = getArgEval(metaValue, 1);
                return true;
            }
            return false;
        }.bind(this));
        return this._reserveCounterSkillId;
    };

    Game_BattlerBase.prototype.getCounterCustomRate = function(names, action, target) {
        if (!target.canPaySkillCostForCounter()) return 0;
        let counterCondition;
        this.traitObjects().some(function(traitObject) {
            const metaValue = getMetaValues(traitObject, names);
            if (metaValue) {
                counterCondition = getArgString(metaValue);
                return true;
            }
            return false;
        }.bind(this));
        return counterCondition ? this.executeCounterScript(counterCondition, action, target) : 1;
    };

    Game_BattlerBase.prototype.executeCounterScript = function(counterCondition, action, target) {
        const skill     = action.item();
        const v         = $gameVariables.value.bind($gameVariables);
        const s         = $gameSwitches.value.bind($gameSwitches);
        const elementId = skill.damage.elementId;
        let result;
        try {
            result = !!eval(counterCondition);
            if ($gameTemp.isPlaytest()) {
                console.log('Execute Script:' + counterCondition);
            }
        } catch (e) {
            console.error(e.toString());
            throw new Error('反撃条件計算式の評価に失敗しました。式:' + counterCondition);
        }
        return result ? 1 : 0;
    };

    Game_BattlerBase.prototype.getCounterSkillId = function() {
        return this.isReserveCounterSkill() ? this._reserveCounterSkillId : this.attackSkillId();
    };

    Game_BattlerBase.prototype.isReserveCounterSkill = function() {
        return !!this._reserveCounterSkillId;
    };

    Game_BattlerBase.prototype.canPaySkillCostForCounter = function() {
        return !paramFailureCostShortage || !this._reserveCounterSkillId ||
            this.canPaySkillCost($dataSkills[this._reserveCounterSkillId]);
    };

    //=============================================================================
    // Game_Action
    //  魔法反撃を可能にします。
    //=============================================================================
    const _Game_Action_itemCnt    = Game_Action.prototype.itemCnt;
    Game_Action.prototype.itemCnt = function(target) {
        const cnt = _Game_Action_itemCnt.apply(this, arguments);
        if (this.isMagical()) {
            return this.itemMagicCnt(target);
        } else {
            const rate = this.reserveTargetCounterSkillId(target, false, 0);
            return rate * cnt;
        }
    };

    Game_Action.prototype.itemMagicCnt = function(target) {
        if (target.isValidMagicCounter() && this.isMagical() && target.canMove()) {
            const rate = this.reserveTargetCounterSkillId(target, true, 0);
            return rate * (target.getMagicCounterRate() || target.cnt);
        } else {
            return 0;
        }
    };

    Game_Action.prototype.reserveTargetCounterSkillId = function(target, magicFlg, depth) {
        const skillMetaNames = this.getMetaNamesForCounterExtend(['反撃スキルID', 'CounterSkillId'], magicFlg, depth);
        const counterSkill   = target.reserveCounterSkillId(skillMetaNames);
        if (counterSkill === 0 && depth > 0) {
            return 0;
        }
        const rateMetaNames = this.getMetaNamesForCounterExtend(['反撃条件', 'CounterCond'], magicFlg, depth);
        const counterRate   = target.getCounterCustomRate(rateMetaNames, this, target);
        if (counterRate > 0 || depth > 100) {
            return counterRate;
        } else {
            return this.reserveTargetCounterSkillId(target, magicFlg, depth + 1);
        }
    };

    Game_Action.prototype.getMetaNamesForCounterExtend = function(names, magicFlg, depth) {
        if (depth > 0) {
            names[0] = names[0] + '_' + String(depth);
            names[1] = names[1] + '_' + String(depth);
        }
        if (magicFlg) {
            names[0] = '魔法' + names[0];
            names[1] = 'Magic' + names[1];
        }
        return names;
    };

    Game_Action.prototype.setCounterSkill = function() {
        this.setSkill(this.subject().getCounterSkillId());
    };

    //=============================================================================
    // BattleManager
    //  スキルによる反撃を実装します。
    //=============================================================================
    const _BattleManager_invokeCounterAttack = BattleManager.invokeCounterAttack;
    BattleManager.invokeCounterAttack        = function(subject, target) {
        if (!target.isReserveCounterSkill()) {
            _BattleManager_invokeCounterAttack.apply(this, arguments);
        } else {
            const action = new Game_Action(target);
            action.setCounterSkill();
            if (paramPayCounterCost) target.useItem(action.item());
            action.apply(subject);
            this._logWindow.displaySkillCounter(target, action, [subject]);
            this._logWindow.displayActionResults(target, subject);
        }
    };

    //=============================================================================
    // Window_BattleLog
    //  スキルによる反撃を演出します。
    //=============================================================================
    Window_BattleLog.prototype.displaySkillCounter = function(subject, action, targets) {
        const item             = action.item();
        const counterAnimation = subject.getCounterAnimationId();
        if (counterAnimation) {
            this.push('showAnimation', subject, [subject], counterAnimation);
            this.push('waitForAnimation');
        }
        if (!Imported.YEP_BattleEngineCore) {
            this.push('addText', TextManager.counterAttack.format(subject.name()));
        }
        this.push('performAction', subject, action);
        this.push('showAnimation', subject, targets.clone(), item.animationId);
        this.push('waitForAnimation');
        this.displayAction(subject, item);
    };

    const _Window_BattleLog_updateWaitMode    = Window_BattleLog.prototype.updateWaitMode;
    Window_BattleLog.prototype.updateWaitMode = function() {
        let waiting = false;
        switch (this._waitMode) {
            case 'animation':
                waiting = this._spriteset.isAnimationPlaying();
                break;
        }
        if (!waiting) {
            waiting = _Window_BattleLog_updateWaitMode.apply(this, arguments);
        }
        return waiting;
    };

    Window_BattleLog.prototype.waitForAnimation = function() {
        this.setWaitMode('animation');
    };
})();

