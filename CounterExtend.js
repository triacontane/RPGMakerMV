//=============================================================================
// CounterExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.3 2017/08/09 反撃条件に属性を指定する際に「通常攻撃」を指定した場合も考慮する関数を追加
// 1.4.2 2017/07/12 複数のバトラーが同時に反撃を行った場合に全員分の反撃が正常に行われない問題を修正
// 1.4.1 2017/07/11 1.4.0の機能追加以降、スキル反撃を行うとアクター本来の行動がキャンセルされる場合がある問題を修正
// 1.4.0 2017/06/13 反撃スキルに指定した効果範囲と連続回数が適用されるようになりました。
//                  攻撃を受けてから反撃するクロスカウンター機能を追加
// 1.3.3 2017/06/10 CustumCriticalSoundVer5.jsとの競合を解消
// 1.3.2 2017/05/20 BattleEffectPopup.jsとの併用でスキルによる反撃が表示されない問題を修正。
// 1.3.1 2017/04/22 1.3.0の機能がBattleEngineCoreで動作するよう修正
// 1.3.0 2017/04/09 反撃に成功した時点で相手の行動をキャンセルできる機能を追加
// 1.2.2 2017/02/07 端末依存の記述を削除
// 1.2.1 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
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
 * @default false
 * @type boolean
 *
 * @param FailureCostShortage
 * @desc 固有スキルによる反撃がコスト不足の場合、反撃は行いません。(ON/OFF)
 * @default false
 * @type boolean
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
 * 反撃スキルは、通常は攻撃してきた相手をターゲットとしますが
 * 味方対象のスキルなどは自分や味方に対して使用します。
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
 * また、アクションオブジェクトはローカル変数「action」で参照できます。
 * <CE_反撃条件:skill.id === 10>      # スキルIDが[10]なら反撃します。
 * <CE_反撃条件:action.hasElement(3)> # スキル属性IDが[3]なら反撃します。
 *
 * 対象のバトラー情報は「this」で、相手のバトラー情報は「target」で参照できます。
 * <CE_反撃条件:this.hpRate() &lt; 0.5> # 自分のHPが50%を下回ると反撃します。
 *
 * ※2 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * 4. 複数の反撃スキルおよび反撃条件を設定できます。
 * 複数定義する場合は、末尾に「_n」を付与してください。
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
 * 6. 反撃成功時に相手の行動をキャンセル（中断）できます。
 * 相手が全体攻撃のスキルを使った場合に、反撃成功時点で以降の相手には
 * 当たらなくなります。特徴を有するメモ欄に以下の通り入力してください。
 * <CE_キャンセル> # 反撃成功時に相手の行動をキャンセル
 * <CE_Cancel>     # 同上
 *
 * 7. デフォルトの反撃とは異なり、攻撃を受けてから反撃させることができます。
 * 特徴を有するメモ欄に以下の通り入力してください。
 * <CE_クロスカウンター> # 相手の攻撃を受けてから反撃します。
 * <CE_CrossCounter>     # 同上
 * ※クロスカウンターはスキルによる反撃の場合のみ有効です。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 反撃拡張プラグイン
 * @author トリアコンタン
 *
 * @param 反撃コスト消費
 * @desc 固有スキルによる反撃がコスト消費するかどうかを設定します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param コスト不足で失敗
 * @desc 固有スキルによる反撃がコスト不足の場合、反撃は行いません。(ON/OFF)
 * @default false
 * @type boolean
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
 * 反撃スキルは、通常は攻撃してきた相手をターゲットとしますが
 * 味方対象のスキルなどは自分や味方に対して使用します。
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
 * また、アクションオブジェクトはローカル変数「action」で参照できます。
 * <CE_反撃条件:skill.id === 10>      # スキルIDが[10]なら反撃します。
 * <CE_反撃条件:action.hasElement(3)> # スキル属性IDが[3]なら反撃します。
 *
 * 対象のバトラー情報は「this」で、相手のバトラー情報は「target」で参照できます。
 * <CE_反撃条件:this.hpRate() &lt; 0.5> # 自分のHPが50%を下回ると反撃します。
 *
 * ※2 文章、スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 *
 * 4. 複数の反撃スキルおよび反撃条件を設定できます。
 * 複数定義する場合は、末尾に「_n」を付与してください。
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
 * 6. 反撃成功時に相手の行動をキャンセル（中断）できます。
 * 相手が全体攻撃のスキルを使った場合に、反撃成功時点で以降の相手には
 * 当たらなくなります。特徴を有するメモ欄に以下の通り入力してください。
 * <CE_キャンセル> # 反撃成功時に相手の行動をキャンセル
 * <CE_Cancel>     # 同上
 *
 * 7. デフォルトの反撃とは異なり、攻撃を受けてから反撃させることができます。
 * 特徴を有するメモ欄に以下の通り入力してください。
 * <CE_クロスカウンター> # 相手の攻撃を受けてから反撃します。
 * <CE_CrossCounter>     # 同上
 * ※クロスカウンターはスキルによる反撃の場合のみ有効です。
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
    var pluginName    = 'CounterExtend';
    var metaTagPrefix = 'CE_';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
    };

    var getArgEval = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (eval(convertEscapeCharacters(arg)) || 0).clamp(min, max);
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        text            = text.replace(/&gt;?/gi, '>');
        text            = text.replace(/&lt;?/gi, '<');
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramPayCounterCost      = getParamBoolean(['PayCounterCost', '反撃コスト消費']);
    var paramFailureCostShortage = getParamBoolean(['FailureCostShortage', 'コスト不足で失敗']);

    //=============================================================================
    // Game_BattlerBase
    //  行動制約が有効なステートデータを取得します。
    //=============================================================================
    Game_BattlerBase.prototype.isValidMagicCounter = function() {
        return this.traitObjects().some(function(traitObject) {
            return getMetaValues(traitObject, ['魔法反撃', 'MagicCounter']);
        });
    };

    Game_BattlerBase.prototype.isCounterCancel = function() {
        return this.traitObjects().some(function(traitObject) {
            return getMetaValues(traitObject, ['キャンセル', 'Cancel']);
        });
    };

    Game_BattlerBase.prototype.isCrossCounter = function() {
        return this.traitObjects().some(function(traitObject) {
            return getMetaValues(traitObject, ['クロスカウンター', 'CrossCounter']);
        });
    };

    Game_BattlerBase.prototype.getMagicCounterRate = function() {
        return this.traitObjects().reduce(function(prevValue, traitObject) {
            var metaValue = getMetaValues(traitObject, ['魔法反撃', 'MagicCounter']);
            return metaValue ? Math.max(getArgEval(metaValue) / 100, prevValue) : prevValue;
        }, 0);
    };

    Game_BattlerBase.prototype.getCounterAnimationId = function() {
        var counterAnimationId = 0;
        this.traitObjects().some(function(traitObject) {
            var metaValue = getMetaValues(traitObject, ['反撃アニメID', 'CounterAnimationId']);
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
            var metaValue = getMetaValues(traitObject, names);
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
        var counterCondition;
        this.traitObjects().some(function(traitObject) {
            var metaValue = getMetaValues(traitObject, names);
            if (metaValue) {
                counterCondition = getArgString(metaValue);
                return true;
            }
            return false;
        }.bind(this));
        return counterCondition ? this.executeCounterScript(counterCondition, action, target) : 1;
    };

    Game_BattlerBase.prototype.executeCounterScript = function(counterCondition, action, target) {
        var skill      = action.item();
        // use in eval
        var v          = $gameVariables.value.bind($gameVariables);
        var s          = $gameSwitches.value.bind($gameSwitches);
        var elementId  = skill.damage.elementId;
        var result;
        try {
            result = !!eval(counterCondition);
            if ($gameTemp.isPlaytest()) {
                console.log('Execute Script:' + counterCondition);
                console.log('Execute Result:' + result);
            }
        } catch (e) {
            console.error(e.toString());
            throw new Error('Failed To Execute Counter Condition Script :' + counterCondition);
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
    // Game_Battler
    //  カウンター時のスキルコスト消費処理を別途定義します。
    //=============================================================================
    var _Game_Battler_useItem      = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function(item) {
        if (this.isCounterSubject() && !paramPayCounterCost) return;
        _Game_Battler_useItem.apply(this, arguments);
        this.refresh();
    };

    Game_Battler.prototype.setCounterAction = function(target) {
        var counterSkillId = this.getCounterSkillId();
        var action         = new Game_Action(this);
        action.setSkill(counterSkillId);
        var counterTargetIndex;
        if (action.isForFriend()) {
            counterTargetIndex = this.friendsUnit().members().indexOf(this);
        } else {
            counterTargetIndex = target.friendsUnit().members().indexOf(target);
        }
        this._nativeActions  = this._actions;
        this._counterSubject = true;
        this.forceAction(counterSkillId, counterTargetIndex);
    };

    Game_Battler.prototype.clearCounterAction = function() {
        if (this._nativeActions && this._nativeActions.length > 0) {
            this._actions = this._nativeActions;
        }
        this._nativeActions  = null;
        this._counterSubject = false;
    };

    Game_Battler.prototype.isCounterSubject = function() {
        return this._counterSubject;
    };

    var _Game_Battler_onAllActionsEnd      = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function() {
        if (this.isCounterSubject()) {
            this.clearResult();
        } else {
            _Game_Battler_onAllActionsEnd.apply(this, arguments);
        }
    };

    //=============================================================================
    // Game_Action
    //  魔法反撃を可能にします。
    //=============================================================================
    var _Game_Action_itemCnt      = Game_Action.prototype.itemCnt;
    Game_Action.prototype.itemCnt = function(target) {
        if (this.subject().isCounterSubject()) {
            return 0;
        }
        var cnt = _Game_Action_itemCnt.apply(this, arguments);
        if (this.isMagical()) {
            return this.itemMagicCnt(target);
        } else {
            var rate = this.reserveTargetCounterSkillId(target, false, 0);
            return rate * cnt;
        }
    };

    Game_Action.prototype.itemMagicCnt = function(target) {
        if (target.isValidMagicCounter() && this.isMagical() && target.canMove()) {
            var rate = this.reserveTargetCounterSkillId(target, true, 0);
            return rate * (target.getMagicCounterRate() || target.cnt);
        } else {
            return 0;
        }
    };

    Game_Action.prototype.reserveTargetCounterSkillId = function(target, magicFlg, depth) {
        var skillMetaNames = this.getMetaNamesForCounterExtend(['反撃スキルID', 'CounterSkillId'], magicFlg, depth);
        var counterSkill   = target.reserveCounterSkillId(skillMetaNames);
        if (counterSkill === 0 && depth > 0) {
            return 0;
        }
        var rateMetaNames = this.getMetaNamesForCounterExtend(['反撃条件', 'CounterCond'], magicFlg, depth);
        var counterRate   = target.getCounterCustomRate(rateMetaNames, this, target);
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

    Game_Action.prototype.hasElement = function(elementId) {
        var skillElementId = this.item().damage.elementId;
        // Normal attack elementID[-1]
        if (skillElementId === -1) {
            return this.subject().attackElements().contains(elementId);
        } else {
            return elementId === skillElementId;
        }
    };

    //=============================================================================
    // BattleManager
    //  スキルによる反撃を実装します。
    //=============================================================================
    var _BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers      = function() {
        _BattleManager_initMembers.apply(this, arguments);
        this._counterBattlers = [];
    };

    var _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction      = function() {
        this._actionCancel = false;
        if (this._subject.isCounterSubject()) {
            this._logWindow.displaySkillCounter(this._subject);
        }
        _BattleManager_startAction.apply(this, arguments);
    };

    var _BattleManager_invokeCounterAttack = BattleManager.invokeCounterAttack;
    BattleManager.invokeCounterAttack      = function(subject, target) {
        if (!target.isReserveCounterSkill()) {
            _BattleManager_invokeCounterAttack.apply(this, arguments);
        } else {
            if (target.isCrossCounter()) {
                this.invokeNormalAction(subject, target);
            }
            if (!target.isCounterSubject()) {
                this.prepareCounterSkill(subject, target);
            }
        }
        if (target.isCounterCancel()) {
            this._actionCancel = true;
        }
    };

    BattleManager.prepareCounterSkill = function(subject, target) {
        target.setCounterAction(subject);
        this._counterBattlers.push(target);
    };

    var _BattleManager_invokeAction = BattleManager.invokeAction;
    BattleManager.invokeAction      = function(subject, target) {
        if (this._actionCancel) return;
        _BattleManager_invokeAction.apply(this, arguments);
    };

    var _BattleManager_getNextSubject = BattleManager.getNextSubject;
    BattleManager.getNextSubject      = function() {
        if (this._subject && this._subject.isCounterSubject()) {
            this._subject.clearCounterAction();
        }
        if (this._counterBattlers.length > 0) {
            return this._counterBattlers.shift();
        }
        return _BattleManager_getNextSubject.apply(this, arguments);
    };

    //=============================================================================
    // Window_BattleLog
    //  スキルによる反撃を演出します。
    //=============================================================================
    Window_BattleLog.prototype.displaySkillCounter = function(subject) {
        var counterAnimation = subject.getCounterAnimationId();
        if (counterAnimation) {
            this.push('showAnimation', subject, [subject], counterAnimation);
            this.push('waitForAnimation');
        }
        if (!Imported.YEP_BattleEngineCore) {
            this.push('addText', TextManager.counterAttack.format(subject.name()));
        }
        // for BattleEffectPopup.js
        if (this.popupCounter) {
            this.popupCounter(subject);
        }
    };

    var _Window_BattleLog_updateWaitMode      = Window_BattleLog.prototype.updateWaitMode;
    Window_BattleLog.prototype.updateWaitMode = function() {
        var waiting = false;
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

