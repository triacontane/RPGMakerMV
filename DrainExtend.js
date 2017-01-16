//=============================================================================
// DrainExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/01/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DrainExtend
 * @author triacontane
 *
 * @param RecoverSe
 * @desc 吸収成功時に回復効果音を演奏します。
 * @default OFF
 *
 * @help ダメージのHP吸収およびMP吸収の仕様を以下の通り拡張します。
 * 1. 吸収率を指定した与えたダメージのN%回復などが可能
 * 2. HPダメージに対してMPを回復することが可能(またはその逆)
 * 3. 通常ダメージ時のメッセージと効果音に変更可能
 * 4. ダメージ上限が相手の残HPになる吸収の仕様を撤廃可能
 *
 * スキルのメモ欄に以下の通り記述してください。
 * <DE_HP吸収率:150>     # HPの吸収率が[150]%になります。
 * <DE_PercentageHP:150> # 同上
 * <DE_MP吸収率:50>      # MPの吸収率が[50]%になります。
 * <DE_PercentageMP:50>  # 同上
 * <DE_攻撃メッセージ>   # メッセージが攻撃メッセージになります。
 * <DE_AttackMessage>    # 同上
 * <DE_上限突破>         # ダメージが相手の残HPを超えるようになります。
 * <DE_LimitOver>        # 同上
 *
 * ※1 HP吸収に対してMPのみ回復させたい場合、HPの吸収率を0に指定してください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 吸収拡張プラグイン
 * @author トリアコンタン
 *
 * @param 回復効果音
 * @desc 吸収成功時に回復効果音を演奏します。
 * @default OFF
 *
 * @help ダメージのHP吸収およびMP吸収の仕様を以下の通り拡張します。
 * 1. 吸収率を指定した与えたダメージのN%回復などが可能
 * 2. HPダメージに対してMPを回復することが可能(またはその逆)
 * 3. 通常ダメージ時のメッセージと効果音に変更可能
 * 4. ダメージ上限が相手の残HPになる吸収の仕様を撤廃可能
 * 
 * スキルのメモ欄に以下の通り記述してください。
 * <DE_HP吸収率:150>     # HPの吸収率が[150]%になります。
 * <DE_PercentageHP:150> # 同上
 * <DE_MP吸収率:50>      # MPの吸収率が[50]%になります。
 * <DE_PercentageMP:50>  # 同上
 * <DE_攻撃メッセージ>   # メッセージが攻撃メッセージになります。
 * <DE_AttackMessage>    # 同上
 * <DE_上限突破>         # ダメージが相手の残HPを超えるようになります。
 * <DE_LimitOver>        # 同上
 *
 * ※1 HP吸収に対してMPのみ回復させたい場合、HPの吸収率を0に指定してください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'DrainExtend';
    var metaTagPrefix = 'DE_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    const getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    const getParamBoolean = function(paramNames) {
        const value = getParamString(paramNames);
        return value.toUpperCase() === 'ON';
    };

    var getArgNumber = function(arg, min, max) {
        if (arg === true || arg === undefined) return undefined;
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (let i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    const param = {};
    param.recoverSe = getParamBoolean(['RecoverSe', '回復効果音']);

    //=============================================================================
    // Game_Action
    //  吸収の仕様を拡張します。
    //=============================================================================
    var _Game_Action_isDrain = Game_Action.prototype.isDrain;
    Game_Action.prototype.isDrain = function() {
        if (this._temporaryDisableDrain) {
            this._temporaryDisableDrain = false;
            return false;
        }
        return _Game_Action_isDrain.apply(this, arguments);
    };

    Game_Action.prototype.getDrainExtendMeta = function(paramNames) {
        return getMetaValues(this.item(), paramNames);
    };

    Game_Action.prototype.getHpDrainRate = function() {
        return getArgNumber(this.getDrainExtendMeta(['PercentageHP', 'HP吸収率']), 0);
    };

    Game_Action.prototype.getMpDrainRate = function() {
        return getArgNumber(this.getDrainExtendMeta(['PercentageMP', 'MP吸収率']), 0);
    };

    Game_Action.prototype.isDrainMessageAttack = function() {
        return !!this.getDrainExtendMeta(['AttackMessage', '攻撃メッセージ']);
    };

    Game_Action.prototype.isDrainLimitOver = function() {
        return !!this.getDrainExtendMeta(['LimitOver', '上限突破']);
    };

    var _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        if (this.isDrainMessageAttack()) this._temporaryDisableDrain = true;
        return _Game_Action_apply.apply(this, arguments);
    };

    var _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        if (this.isDrainLimitOver()) this._temporaryDisableDrain = true;
        _Game_Action_executeHpDamage.apply(this, arguments);
    };

    var _Game_Action_executeMpDamage = Game_Action.prototype.executeMpDamage;
    Game_Action.prototype.executeMpDamage = function(target, value) {
        if (this.isDrainLimitOver()) this._temporaryDisableDrain = true;
        _Game_Action_executeMpDamage.apply(this, arguments);
    };

    var _Game_Action_gainDrainedHp = Game_Action.prototype.gainDrainedHp;
    Game_Action.prototype.gainDrainedHp = function(value) {
        var rate = this.getHpDrainRate();
        if (rate !== undefined) {
            arguments[0] = value * rate / 100;
        }
        if (arguments[0] !== 0) {
            _Game_Action_gainDrainedHp.apply(this, arguments);
        }
        var mpRate = this.getMpDrainRate();
        if (mpRate !== undefined) {
            _Game_Action_gainDrainedMp.call(this, value * mpRate / 100);
        }
    };

    var _Game_Action_gainDrainedMp = Game_Action.prototype.gainDrainedMp;
    Game_Action.prototype.gainDrainedMp = function(value) {
        var rate = this.getMpDrainRate();
        if (rate !== undefined) {
            arguments[0] = value * rate / 100;
        }
        if (arguments[0]) {
            _Game_Action_gainDrainedMp.apply(this, arguments);
        }
        var hpRate = this.getHpDrainRate();
        if (hpRate !== undefined) {
            _Game_Action_gainDrainedHp.call(this, value * hpRate / 100);
        }
    };

    //=============================================================================
    // Window_BattleLog
    //  吸収時に回復効果音を演奏します。
    //=============================================================================
    var _Window_BattleLog_displayDamage = Window_BattleLog.prototype.displayDamage;
    Window_BattleLog.prototype.displayDamage = function(target) {
        _Window_BattleLog_displayDamage.apply(this, arguments);
        if (this.isNeedDrainRecoverSe(target.result())) {
            this.push('performRecovery', target);
        }
    };

    Window_BattleLog.prototype.isNeedDrainRecoverSe = function(result) {
        return param.recoverSe && !result.missed && !result.evaded && result.drain;
    };
})();
