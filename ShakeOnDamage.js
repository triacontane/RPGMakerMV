//=============================================================================
// ShakeOnDamage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/08/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ShakeOnDamagePlugin
 * @author triacontane
 *
 * @param シェイク強さ
 * @desc 通常ダメージを受けたときのシェイク強さです。
 * @default 5
 * @type number
 * @min 1
 * @max 9
 *
 * @param クリティカルシェイク強さ
 * @desc クリティカルダメージを受けたときのシェイク強さです。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param シェイク速さ
 * @desc シェイク速さです。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param シェイク時間
 * @desc シェイク時間(フレーム)です。
 * @default 30
 * @type number
 *
 * @help ShakeOnDamage.js
 *
 * 戦闘でアクターがダメージを受けたときに画面を振動させます。
 * クリティカル時と通常時とで強さを変えることができます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ダメージ時の振動プラグイン
 * @author トリアコンタン
 *
 * @param シェイク強さ
 * @desc 通常ダメージを受けたときのシェイク強さです。
 * @default 5
 * @type number
 * @min 1
 * @max 9
 *
 * @param クリティカルシェイク強さ
 * @desc クリティカルダメージを受けたときのシェイク強さです。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param シェイク速さ
 * @desc シェイク速さです。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param シェイク時間
 * @desc シェイク時間(フレーム)です。
 * @default 30
 * @type number
 *
 * @help ShakeOnDamage.js
 *
 * 戦闘でアクターがダメージを受けたときに画面を振動させます。
 * クリティカル時と通常時とで強さを変えることができます。
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
    var pluginName    = 'ShakeOnDamage';

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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                = {};
    param.shakePower         = getParamNumber(['ShakePower', 'シェイク強さ']);
    param.criticalShakePower = getParamNumber(['CriticalShakePower', 'クリティカルシェイク強さ']);
    param.shakeSpeed         = getParamNumber(['ShakeSpeed', 'シェイク速さ']);
    param.shakeDuration      = getParamNumber(['ShakeDuration', 'シェイク時間']);

    //=============================================================================
    // Game_Battler
    //  クリティカル判定を記憶します。
    //=============================================================================
    Game_Battler.prototype.setCriticalForShake = function(value) {
        this._criticalForShake = value;
    };

    Game_Battler.prototype.isCriticalForShake = function() {
        return this._criticalForShake;
    };

    //=============================================================================
    // Game_Action
    //  クリティカル判定を記憶します。
    //=============================================================================
    var _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        target.setCriticalForShake(critical);
        return _Game_Action_makeDamageValue.apply(this, arguments);
    };

    //=============================================================================
    // Window_BattleLog
    //  ダメージ時の振動を実装します。
    //=============================================================================
    var _Window_BattleLog_performDamage      = Window_BattleLog.prototype.performDamage;
    Window_BattleLog.prototype.performDamage = function(target) {
        _Window_BattleLog_performDamage.apply(this, arguments);
        if (target.isActor()) {
            this.shakeOnDamage(target);
        }
    };

    Window_BattleLog.prototype.shakeOnDamage = function(target) {
        var power = target.isCriticalForShake() ? param.criticalShakePower : param.shakePower;
        $gameScreen.startShake(power, param.shakeSpeed, param.shakeDuration);
        target.setCriticalForShake(false);
    };
})();

