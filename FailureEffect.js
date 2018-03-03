//=============================================================================
// FailureEffect.js
// ----------------------------------------------------------------------------
// (C)2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2018/03/03 失敗時はクリティカルヒットしないよう仕様変更
// 1.1.0 2017/10/04 ダメージが整数にならない場合がある不具合を修正
//                  失敗時にメッセージを出力する機能を追加
// 1.0.0 2017/10/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc FailureEffectPlugin
 * @author triacontane
 *
 * @param FailureDamageRate
 * @desc 失敗時のダメージ倍率(%)です。各スキルのメモ欄に個別の設定があればそちらが優先されます。
 * @default 30
 * @type number
 *
 * @param FailureMessageOutput
 * @desc 失敗時にメッセージを出力するかどうかです。
 * @default false
 * @type boolean
 *
 * @help FailureEffect.js
 *
 * 行動に失敗した場合でも一定割合のダメージを一部の効果を適用できるようになります。
 * 失敗時のダメージ倍率はパラメータもしくはスキルのメモ欄から指定可能です。
 *
 * <FE_失敗倍率:10>       # 失敗時のダメージ倍率が[10%]になります。
 * <FE_FailureRate:10>    # 同上
 * <FE_失敗効果:2,3>      # 失敗時にも[2]番目、[3]番目の効果は適用されます。
 * <FE_FailureEffect:2,3> # 同上
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 失敗効果プラグイン
 * @author トリアコンタン
 *
 * @param 失敗時のダメージ倍率
 * @desc 失敗時のダメージ倍率(%)です。各スキルのメモ欄に個別の設定があればそちらが優先されます。
 * @default 30
 * @type number
 *
 * @param 失敗時メッセージ出力
 * @desc 失敗時にメッセージを出力するかどうかです。
 * @default false
 * @type boolean
 *
 * @help FailureEffect.js
 *
 * 行動に失敗した場合でも一定割合のダメージを一部の効果を適用できるようになります。
 * 失敗時のダメージ倍率はパラメータもしくはスキルのメモ欄から指定可能です。
 *
 * <FE_失敗倍率:10>       # 失敗時のダメージ倍率が[10%]になります。
 * <FE_FailureRate:10>    # 同上
 * <FE_失敗効果:2,3>      # 失敗時にも[2]番目、[3]番目の効果は適用されます。
 * <FE_FailureEffect:2,3> # 同上
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~パラメータ:ja
 * @param param
 * @desc
 * @type number
 * @default
 */

(function() {
    'use strict';
    var pluginName    = 'FailureEffect';
    var metaTagPrefix = 'FE_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        alert('Fail to load plugin parameter of ' + pluginName);
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'TRUE';
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    var getArgArrayString = function(args) {
        return args.split(',').map(function(value) {
            return value.trim();
        });
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                  = {};
    param.failureDamageRate    = getParamNumber(['FailureDamageRate', '失敗時のダメージ倍率'], 0);
    param.failureMessageOutput = getParamBoolean(['FailureMessageOutput', '失敗時メッセージ出力']);

    var local         = {};
    local.originalHit = true;

    //=============================================================================
    // Game_ActionResult
    //  必ずヒット扱いに変更します。
    //=============================================================================
    var _Game_ActionResult_isHit      = Game_ActionResult.prototype.isHit;
    Game_ActionResult.prototype.isHit = function() {
        local.originalHit = _Game_ActionResult_isHit.apply(this, arguments);
        this.missed       = false;
        this.evaded       = false;
        return this.used;
    };

    //=============================================================================
    // Game_Action
    //  失敗時のダメージ倍率と適用効果を変更します。
    //=============================================================================
    var _Game_Action_makeDamageValue      = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        var damage = _Game_Action_makeDamageValue.apply(this, arguments);
        return local.originalHit ? damage : Math.floor(damage * this.getFailureRate() / 100);
    };

    var _Game_Action_itemCri = Game_Action.prototype.itemCri;
    Game_Action.prototype.itemCri = function(target) {
        var result = _Game_Action_itemCri.apply(this, arguments);
        if (!local.originalHit) {
            result = 0;
        }
        return result;
    };

    Game_Action.prototype.getFailureRate = function() {
        var metaValue = getMetaValues(this.item(), ['失敗倍率', 'FailureRate']);
        return metaValue ? getArgNumber(metaValue, 0) : param.failureDamageRate;
    };

    var _Game_Action_applyItemEffect      = Game_Action.prototype.applyItemEffect;
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        if (!local.originalHit && !this.isValidEffectWhenFailure(effect)) {
            return;
        }
        _Game_Action_applyItemEffect.apply(this, arguments);
    };

    /**
     * 失敗時にも適用する効果かどうかの判断。
     * @param {Object} effect
     * @returns {Boolean} result
     */
    Game_Action.prototype.isValidEffectWhenFailure = function(effect) {
        var metaValue = getMetaValues(this.item(), ['失敗効果', 'FailureEffect']);
        if (!metaValue) {
            return false;
        }
        var effectIndex = this.getEffectIndex(effect);
        return getArgArrayString(metaValue).contains(String(effectIndex));
    };

    /**
     * 効果のインデックスを返す。
     * @param {Object} effect
     * @returns {Number} インデックス
     */
    Game_Action.prototype.getEffectIndex = function(effect) {
        return this.item().effects.indexOf(effect) + 1;
    };

    //=============================================================================
    // Window_BattleLog
    //  失敗時のメッセージを出力します。
    //=============================================================================
    var _Window_BattleLog_displayActionResults      = Window_BattleLog.prototype.displayActionResults;
    Window_BattleLog.prototype.displayActionResults = function(subject, target) {
        this.displayFailureEffect(target);
        _Window_BattleLog_displayActionResults.apply(this, arguments);
    };

    /**
     * 失敗メッセージの出力。
     * @param {Game_Battler} target
     */
    Window_BattleLog.prototype.displayFailureEffect = function(target) {
        if (!local.originalHit && param.failureMessageOutput) {
            this.displayMiss(target);
        }
    };
})();

