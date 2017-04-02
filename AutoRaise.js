//=============================================================================
// AutoRaise.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/04/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AutoRaisePlugin
 * @author triacontane
 *
 * @param RaiseAnimationId
 * @desc 自働蘇生時に表示されるアニメーションのID
 * @default 49
 *
 * @param RaiseIconId
 * @desc 自働蘇生が可能な場合に表示されるアイコンのID
 * @default 72
 *
 * @help 戦闘時に、決められた回数分だけ自働蘇生できます。
 * 回数の決定は戦闘開始直後に1回だけ行われます。
 * 特徴を有するメモ欄のプラグインに以下の通り入力してください。
 *
 * <AR_自働蘇生:3>      # 戦闘不能時に3回まで自働蘇生します。
 * <AR_AutoRaise:3>     # 同上
 * <AR_蘇生HPレート:50> # 自働蘇生時にHPが50%まで回復します。
 * <AR_RaiseHpRate:50>  # 同上
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 自働蘇生プラグイン
 * @author トリアコンタン
 *
 * @param 蘇生アニメID
 * @desc 自働蘇生時に表示されるアニメーションのID
 * @default 49
 *
 * @param 蘇生アイコンID
 * @desc 自働蘇生が可能な場合に表示されるアイコンのID
 * @default 72
 *
 * @help 戦闘時に、決められた回数分だけ自働蘇生できます。
 * 回数の決定は戦闘開始直後に1回だけ行われます。
 * 特徴を有するメモ欄のプラグインに以下の通り入力してください。
 *
 * <AR_自働蘇生:3>      # 戦闘不能時に3回まで自働蘇生します。
 * <AR_AutoRaise:3>     # 同上
 * <AR_蘇生HPレート:50> # 自働蘇生時にHPが50%まで回復します。
 * <AR_RaiseHpRate:50>  # 同上
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
    var pluginName    = 'AutoRaise';
    var metaTagPrefix = 'AR_';

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
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param              = {};
    param.raiseAnimationId = getParamNumber(['RaiseAnimationId', '蘇生アニメID']);
    param.raiseIconId      = getParamNumber(['RaiseIconId', '蘇生アイコンID']);

    //=============================================================================
    // BattleManager
    //  戦闘不能時に自働復活します。
    //=============================================================================
    var _BattleManager_setup = BattleManager.setup;
    BattleManager.setup      = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        this.allBattleMembers().forEach(function(member) {
            member.initAutoRaiseCount();
        });
    };

    //=============================================================================
    // Game_BattlerBase
    //  戦闘不能時に自働復活します。
    //=============================================================================
    var _Game_BattlerBase_allIcons      = Game_BattlerBase.prototype.allIcons;
    Game_BattlerBase.prototype.allIcons = function() {
        return _Game_BattlerBase_allIcons.apply(this, arguments).concat(this.getAutoRaiseIcon());
    };

    Game_BattlerBase.prototype.getAutoRaiseIcon = function() {
        return (this.canRaise() && param.raiseIconId > 0) ? [param.raiseIconId] : [];
    };

    Game_BattlerBase.prototype.initAutoRaiseCount = function() {
        this._autoRaiseCount = this.getAutoRaiseCount();
    };

    Game_BattlerBase.prototype.getAutoRaiseCount = function() {
        var raiseCount = 0;
        this.traitObjects().forEach(function(state) {
            var metaValue = getMetaValues(state, ['自働蘇生', 'AutoRaise']);
            if (metaValue) {
                raiseCount += (metaValue === true ? 1 : getArgNumber(metaValue, 1));
            }
        });
        return raiseCount;
    };

    Game_BattlerBase.prototype.getRaiseHpRate = function() {
        var hpRate = 1;
        this.traitObjects().forEach(function(state) {
            var metaValue = getMetaValues(state, ['蘇生HPレート', 'RaiseHpRate']);
            if (metaValue) {
                var newRate = (metaValue === true ? 1 : getArgNumber(metaValue, 1, 100));
                hpRate      = Math.max(hpRate, newRate);
            }
        });
        return hpRate;
    };

    Game_BattlerBase.prototype.canRaise = function() {
        return this._autoRaiseCount > 0 && $gameParty.inBattle();
    };

    Game_BattlerBase.prototype.executeAutoRaise = function() {
        this._autoRaiseCount--;
        BattleManager.processAutoRaise(this);
        this.revive();
        this.setHp(this.mhp * this.getRaiseHpRate() / 100);
    };

    var _Game_BattlerBase_die      = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        _Game_BattlerBase_die.apply(this, arguments);
        if (this.canRaise()) {
            this.executeAutoRaise();
        }
    };

    BattleManager.processAutoRaise = function(target) {
        if (param.raiseAnimationId > 0) {
            this._logWindow.push('showNormalAnimation', [target], param.raiseAnimationId);
        }
    };
})();

