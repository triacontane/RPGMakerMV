//=============================================================================
// CustomizeCritical.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/05/05 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 会心カスタマイズプラグイン
 * @author トリアコンタン
 *
 * @help 会心（クリティカルヒット）の確率とダメージ、演出をカスタマイズします。
 *
 * スキルのメモ欄に以下の通り記述してください。
 *
 * ・会心に専用計算式を適用します。書式はダメージ計算式と同様です。
 * 　計算式を適用した場合、デフォルトのダメージ3倍は無効になります。
 * <CC計算式:JavaScript計算式>
 * 例：<CCダメージ:a.atk * 4> //攻撃力の4倍で相手の防御は無視
 *
 * ・会心の確率を加算します。元の確率に計算結果が加算されます。(百分率)
 * <CC確率加算:加算値>
 * 例：<CC確率加算:50> //元の確率+50%で発生
 *
 * ・会心の確率を変更します。元の確率は無視されます。(百分率)
 * <CC確率変更:変更値>
 * 例：<CC確率変更:\v[1]> //変数[1]の値の確率で発生
 *
 * ・会心発生時の専用の戦闘アニメを適用します。
 * <CCアニメ:戦闘アニメID>
 *
 * アクターもしくは敵キャラのメモ欄に以下の通り記述してください。
 * ただし、フロントビューの場合、敵キャラのアニメーションは表示されません。
 *
 * ・演出用の戦闘アニメを実行前に表示します。
 * <CC演出:戦闘アニメID>
 *
 * ・演出用の専用メッセージを実行前に表示します。
 * <CCメッセージ:メッセージ内容>
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName    = 'CustomizeCritical';
    var metaTagPrefix = 'CC';

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
        var window = SceneManager._scene._windowLayer.children[0];
        if (window) {
            var result = window.convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
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

    //=============================================================================
    // Game_Action
    //  会心をカスタマイズします。
    //=============================================================================
    var _Game_Action_evalDamageFormula = Game_Action.prototype.evalDamageFormula;
    Game_Action.prototype.evalDamageFormula = function(target) {
        var item = this.item();
        var formula = getMetaValues(item, ['計算式', 'Formula']);
        if (formula && target.result().critical) {
            try {
                var a = this.subject();
                var b = target;
                var v = $gameVariables._data;
                var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
                var value = Math.max(eval(getArgString(formula)), 0) * sign;
                if (isNaN(value)) value = 0;
                return value;
            } catch (e) {
                return 0;
            }
        } else {
            return _Game_Action_evalDamageFormula.apply(this, arguments);
        }
    };

    var _Game_Action_itemCri = Game_Action.prototype.itemCri;
    Game_Action.prototype.itemCri = function(target) {
        var changeValue = getMetaValues(this.item(), ['確率変更', 'ProbChange']);
        if (changeValue) {
            return getArgNumber(changeValue, 0, 100) / 100;
        }
        var addValue = getMetaValues(this.item(), ['確率加算', 'ProbAdd']);
        return _Game_Action_itemCri.apply(this, arguments) + (addValue ? getArgNumber(addValue) / 100 : 0);
    };

    var _Game_Action_applyCritical = Game_Action.prototype.applyCritical;
    Game_Action.prototype.applyCritical = function(damage) {
        var formula = getMetaValues(this.item(), ['計算式', 'Formula']);
        return formula ? damage : _Game_Action_applyCritical.apply(this, arguments);
    };

    Game_Action.prototype.applyJudgment = function(target) {
        var result = target.result();
        result.unlockProperty();
        result.clear();
        result.used = this.testApply(target);
        result.missed = (result.used && Math.random() >= this.itemHit(target));
        result.evaded = (!result.missed && Math.random() < this.itemEva(target));
        if (result.isHit()) {
            result.critical = (Math.random() < this.itemCri(target));
        }
        result.lockProperty();
    };

    var _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.apply(this, arguments);
        target.result().unlockProperty();
    };

    //=============================================================================
    // Game_Battler
    //  データオブジェクトを取得します。
    //=============================================================================
    Game_Battler.prototype.getData = function() {
        return null;
    };

    Game_Actor.prototype.getData = function() {
        return this.actor();
    };

    Game_Enemy.prototype.getData = function() {
        return this.enemy();
    };

    //=============================================================================
    // Game_ActionResult
    //  会心判定を事前に行います。
    //=============================================================================
    Object.defineProperty(Game_ActionResult.prototype, 'critical', {
        get: function() {
            return this._critical;
        },
        set: function(value) {
            if (!this._propertyLock) {
                this._critical = !!value;
            }
        },
        configurable: true
    });

    Object.defineProperty(Game_ActionResult.prototype, 'used', {
        get: function() {
            return this._used;
        },
        set: function(value) {
            if (!this._propertyLock) {
                this._used = !!value;
            }
        },
        configurable: true
    });

    Object.defineProperty(Game_ActionResult.prototype, 'missed', {
        get: function() {
            return this._missed;
        },
        set: function(value) {
            if (!this._propertyLock) {
                this._missed = !!value;
            }
        },
        configurable: true
    });

    Object.defineProperty(Game_ActionResult.prototype, 'evaded', {
        get: function() {
            return this._evaded;
        },
        set: function(value) {
            if (!this._propertyLock) {
                this._evaded = !!value;
            }
        },
        configurable: true
    });

    var _Game_ActionResult_initialize = Game_ActionResult.prototype.initialize;
    Game_ActionResult.prototype.initialize = function() {
        _Game_ActionResult_initialize.apply(this, arguments);
        this._critical     = false;
        this._evaded       = false;
        this._missed       = false;
        this._used         = false;
        this._propertyLock = false;
    };

    Game_ActionResult.prototype.lockProperty = function() {
        this._propertyLock = true;
    };

    Game_ActionResult.prototype.unlockProperty = function() {
        this._propertyLock = false;
    };

    //=============================================================================
    // BattleManager
    //  会心判定を事前に行います。
    //=============================================================================
    var _BattleManager_refreshStatus = BattleManager.refreshStatus;
    BattleManager.refreshStatus = function() {
        this.refreshJudgment();
        _BattleManager_refreshStatus.apply(this, arguments);
    };

    BattleManager.refreshJudgment = function() {
        this._targets.forEach(function (target) {
            this._action.applyJudgment(target);
        }.bind(this));
    };

    //=============================================================================
    // Window_BattleLog
    //  会心の演出を追加定義します。
    //=============================================================================
    var _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        var prevAnimationId = null;
        var critical = targets.some(function (target) {
            return target.result().critical;
        });
        if (critical) {
            this.showCriticalEffect(subject, action, targets);
            var animationIdString = getMetaValues(action.item(), ['アニメ', 'Animation']);
            if (animationIdString) {
                prevAnimationId = action.item().animationId;
                action.item().animationId = getArgNumber(animationIdString, 1);
            }
        }
        _Window_BattleLog_startAction.apply(this, arguments);
        if (prevAnimationId) action.item().animationId = prevAnimationId;
    };

    Window_BattleLog.prototype.showCriticalEffect = function(subject, action, targets) {
        var animationIdString = getMetaValues(subject.getData(), ['演出', 'エフェクト']);
        if (animationIdString) {
            var animationId = getArgNumber(animationIdString, 1);
            var animation = $dataAnimations[animationId];
            if (animation) {
                this.push('showAnimation', subject, targets.clone(), animationId);
                this.push('waitForFrame', animation.frames.length * 4);
            }
        }
        var message = getMetaValues(subject.getData(), ['メッセージ', 'Message']);
        if (message) {
            this.push('addText', message);
        }
    };

    Window_BattleLog.prototype.waitForFrame = function(frame) {
        this._waitCount = frame;
    };
})();

