//=============================================================================
// ShakeOnDamage.js
// ----------------------------------------------------------------------------
// (C)2020 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2020/06/15 MV版から流用作成
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ShakeOnDamagePlugin
 * @author triacontane
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShakeOnDamage.js
 *
 * @param ShakePower
 * @desc This is the shake strength when you take normal damage.
 * @default 5
 * @type number
 * @min 1
 * @max 9
 *
 * @param CriticalShakePower
 * @desc This is the shake strength when you take critical damage.
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param EffectiveShakePower
 * @desc This is the shake strength when you take weakness damage.
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param ShakeSpeed
 * @desc Shake speed.
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param ShakeDuration
 * @desc Shake time (frames).
 * @default 30
 * @type number
 *
 * @param ApplyActor
 * @desc Shake when the actor does damage.
 * @default true
 * @type boolean
 *
 * @param ApplyEnemy
 * @desc Shake when the enemy does damage.
 * @default false
 * @type boolean
 *
 * @help ShakeOnDamage.js
 *
 * Shake the screen when an actor takes damage in combat.
 * You can change the strength between critical and normal.
 *
 * A formula can be applied to each parameter. In addition, you can also set a local variable
 * The following can be used
 * a : Target actor that took damage.
 * r : percentage of remaining HP of the target actor that took damage (0-100).
 *
 * To enter a formula, select the "Text" tab in the Parameter Settings dialog.
 * Please make your selection and then enter it.
 *
 * There are no plugin commands in this plugin.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ダメージ時の振動プラグイン
 * @author トリアコンタン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShakeOnDamage.js
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
 * @param 弱点シェイク強さ
 * @desc 弱点ダメージを受けたときのシェイク強さです。
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
 * @param アクターに適用
 * @desc アクターのダメージ時にシェイクします。
 * @default true
 * @type boolean
 *
 * @param 敵キャラに適用
 * @desc 敵キャラのダメージ時にシェイクします。
 * @default false
 * @type boolean
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

(() => {
    'use strict';
    const pluginName = 'ShakeOnDamage';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    const getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for(let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    const getParamBoolean = function(paramNames) {
        const value = getParamString(paramNames).toUpperCase();
        return value === 'TRUE';
    };

    const convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        const windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    const isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    const param                 = {};
    param.shakePower          = getParamString(['ShakePower', 'シェイク強さ']);
    param.criticalShakePower  = getParamString(['CriticalShakePower', 'クリティカルシェイク強さ']);
    param.effectiveShakePower = getParamString(['EffectiveShakePower', '弱点シェイク強さ']);
    param.shakeSpeed          = getParamString(['ShakeSpeed', 'シェイク速さ']);
    param.shakeDuration       = getParamString(['ShakeDuration', 'シェイク時間']);
    param.applyActor          = getParamBoolean(['ApplyActor', 'アクターに適用']);
    param.applyEnemy          = getParamBoolean(['ApplyEnemy', '敵キャラに適用']);

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

    Game_Battler.prototype.setEffectiveForShake = function(value) {
        this._effectiveForShake = value;
    };

    Game_Battler.prototype.isEffectiveForShake = function() {
        return this._effectiveForShake;
    };

    const _Game_Battler_performDamage      = Game_Battler.prototype.performDamage;
    Game_Battler.prototype.performDamage = function() {
        _Game_Battler_performDamage.apply(this, arguments);
        if (this.isShakeOnDamage()) {
            this.shakeOnDamage();
        }
    };

    Game_Battler.prototype.shakeOnDamage = function() {
        const power    = this.getDamageShakePower();
        const speed    = this.convertShakeParameter(param.shakeSpeed);
        const duration = this.convertShakeParameter(param.shakeDuration);
        $gameScreen.startShake(power, speed, duration);
        this.setCriticalForShake(false);
    };

    Game_Battler.prototype.getDamageShakePower = function() {
        let power = param.shakePower;
        if (param.criticalShakePower && this.isCriticalForShake()) {
            power = param.criticalShakePower;
        } else if (param.effectiveShakePower && this.isEffectiveForShake()) {
            power = param.effectiveShakePower;
        }
        return this.convertShakeParameter(power);
    };

    Game_Battler.prototype.convertShakeParameter = function(param) {
        const convertParam = convertEscapeCharacters(param);
        // use in eval
        const a            = this;
        const r            = a.hpRate() * 100;
        return isNaN(Number(convertParam)) ? eval(convertParam) : parseInt(convertParam);
    };

    Game_Battler.prototype.isShakeOnDamage = function() {
        return false;
    };

    Game_Actor.prototype.isShakeOnDamage = function() {
        return param.applyActor;
    };

    Game_Enemy.prototype.isShakeOnDamage = function() {
        return param.applyEnemy;
    };

    //=============================================================================
    // Game_Action
    //  クリティカル判定を記憶します。
    //=============================================================================
    const _Game_Action_makeDamageValue      = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        target.setCriticalForShake(critical);
        return _Game_Action_makeDamageValue.apply(this, arguments);
    };

    const _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        const result = _Game_Action_calcElementRate.apply(this, arguments);
        target.setEffectiveForShake(result > 1.0);
        return result;
    };
})();

