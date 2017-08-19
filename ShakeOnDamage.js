//=============================================================================
// ShakeOnDamage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/08/19 パラメータに計算式を使用できる機能を追加
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
 * 各パラメータには計算式を適用できます。さらにローカル変数として
 * 以下が使用可能です。
 * a : ダメージを受けた対象のアクターです。
 * r : ダメージを受けた対象のアクターの残りHP率(0-100)です。
 *
 * 計算式を入力する場合はパラメータ設定ダイアログで「テキスト」タブを
 * 選択してから入力してください。
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
 * 各パラメータには計算式を適用できます。
 * さらにローカル変数として以下が使用可能です。
 * a : ダメージを受けた対象のアクターです。
 * r : ダメージを受けた対象のアクターの残りHP率(0-100)です。
 *
 * 計算式を入力する場合はパラメータ設定ダイアログで「テキスト」タブを
 * 選択してから入力してください。
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
    var pluginName = 'ShakeOnDamage';

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
    var param                = {};
    param.shakePower         = getParamString(['ShakePower', 'シェイク強さ']);
    param.criticalShakePower = getParamString(['CriticalShakePower', 'クリティカルシェイク強さ']);
    param.shakeSpeed         = getParamString(['ShakeSpeed', 'シェイク速さ']);
    param.shakeDuration      = getParamString(['ShakeDuration', 'シェイク時間']);

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
    var _Game_Action_makeDamageValue      = Game_Action.prototype.makeDamageValue;
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
        this._targetOnDamage = target;
        var power    = target.isCriticalForShake() ? this.getCriticalDamageShakePower() : this.getDamageShakePower();
        var speed    = this.convertShakeParameter(param.shakeSpeed);
        var duration = this.convertShakeParameter(param.shakeDuration);
        $gameScreen.startShake(power, speed, duration);
        target.setCriticalForShake(false);
        this._targetOnDamage = null;
    };

    Window_BattleLog.prototype.getDamageShakePower = function() {
        return this.convertShakeParameter(param.shakePower);
    };

    Window_BattleLog.prototype.getCriticalDamageShakePower = function() {
        var power = param.criticalShakePower !== '' ? param.criticalShakePower : param.shakePower;
        return this.convertShakeParameter(power);
    };

    Window_BattleLog.prototype.convertShakeParameter = function(param) {
        var convertParam = convertEscapeCharacters(param);
        // use in eval
        var a = this._targetOnDamage;
        var r = a.hpRate() * 100;
        return isNaN(Number(convertParam)) ? eval(convertParam) : parseInt(convertParam);
    };
})();

