//=============================================================================
// ShakeOnDamage.js
// ----------------------------------------------------------------------------
// (C)2020 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2024/06/09 振動を一時的に無効化するスイッチを追加
// 1.0.0 2020/06/15 MV版から流用作成
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Screen shake on damage plugin
 * @author Triacontane
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShakeOnDamage.js
 *
 * @param shakePower
 * @text Shake Power
 * @desc The shake power when taking normal damage.
 * @default 5
 * @type number
 * @min 1
 * @max 9
 *
 * @param criticalShakePower
 * @text Critical Shake Power
 * @desc The shake power when taking critical damage.
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param effectiveShakePower
 * @text Weakness Shake Power
 * @desc The shake power when taking weakness damage.
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param shakeSpeed
 * @text Shake Speed
 * @desc The speed of the shake effect.
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param shakeDuration
 * @text Shake Duration
 * @desc The duration of the shake effect (in frames).
 * @default 30
 * @type number
 *
 * @param applyActor
 * @text Apply to Actors
 * @desc Shake the screen when actors take damage.
 * @default true
 * @type boolean
 *
 * @param applyEnemy
 * @text Apply to Enemies
 * @desc Shake the screen when enemies take damage.
 * @default false
 * @type boolean
 *
 * @param disableSwitch
 * @text Disable Switch
 * @desc When the specified switch is ON, the shake effect is disabled.
 * @default 0
 * @type switch
 *
 * @help ShakeOnDamage.js
 *
 * This plugin shakes the screen when an actor takes damage in battle.
 * You can set different shake powers for normal and critical damage.
 *
 * Each parameter can accept a calculation formula.
 * The following local variables can be used:
 *  a : The actor who took damage.
 *  r : The remaining HP rate (0–100) of the actor who took damage.
 *
 * If you want to use a calculation formula, select the “Text” tab
 * in the parameter setting dialog before entering it.
 *
 * This plugin does not provide any plugin commands.
 *
 * Terms of Use:
 *  You may modify and redistribute this plugin without permission.
 *  There are no restrictions on its use, including commercial and adult use.
 *  This plugin is now yours.
 */

/*:ja
 * @plugindesc ダメージ時の振動プラグイン
 * @author トリアコンタン
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShakeOnDamage.js
 *
 * @param shakePower
 * @text シェイク強さ
 * @desc 通常ダメージを受けたときのシェイク強さです。
 * @default 5
 * @type number
 * @min 1
 * @max 9
 *
 * @param criticalShakePower
 * @text クリティカルシェイク強さ
 * @desc クリティカルダメージを受けたときのシェイク強さです。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param effectiveShakePower
 * @text 弱点シェイク強さ
 * @desc 弱点ダメージを受けたときのシェイク強さです。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param shakeSpeed
 * @text シェイク速さ
 * @desc シェイク速さです。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param shakeDuration
 * @text シェイク時間
 * @desc シェイク時間(フレーム)です。
 * @default 30
 * @type number
 *
 * @param applyActor
 * @text アクターに適用
 * @desc アクターのダメージ時にシェイクします。
 * @default true
 * @type boolean
 *
 * @param applyEnemy
 * @text 敵キャラに適用
 * @desc 敵キャラのダメージ時にシェイクします。
 * @default false
 * @type boolean
 *
 * @param disableSwitch
 * @text 無効スイッチ
 * @desc 指定したスイッチがONのときは振動を無効にします。
 * @default 0
 * @type switch
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

/*:zh
 * @plugindesc 受到伤害时的画面震动插件
 * @author triacontane
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShakeOnDamage.js
 *
 * @param shakePower
 * @text 普通伤害震动强度
 * @desc 角色受到普通伤害时的画面震动强度。
 * @default 5
 * @type number
 * @min 1
 * @max 9
 *
 * @param criticalShakePower
 * @text 暴击震动强度
 * @desc 角色受到暴击伤害时的画面震动强度。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param effectiveShakePower
 * @text 弱点震动强度
 * @desc 角色受到克制（弱点）伤害时的画面震动强度。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param shakeSpeed
 * @text 震动速度
 * @desc 画面震动的速度。
 * @default 9
 * @type number
 * @min 1
 * @max 9
 *
 * @param shakeDuration
 * @text 震动持续时间
 * @desc 震动的持续帧数。
 * @default 30
 * @type number
 *
 * @param applyActor
 * @text 应用于角色
 * @desc 当角色受到伤害时是否进行震动。
 * @default true
 * @type boolean
 *
 * @param applyEnemy
 * @text 应用于敌人
 * @desc 当敌人受到伤害时是否进行震动。
 * @default false
 * @type boolean
 *
 * @param disableSwitch
 * @text 禁用开关
 * @desc 当指定的开关为 ON 时，将禁用画面震动效果。
 * @default 0
 * @type switch
 *
 * @help ShakeOnDamage.js
 *
 * 当角色在战斗中受到伤害时，屏幕会震动。
 * 普通伤害和会心伤害可以设置不同的震动强度。
 *
 * 各参数可使用计算公式。
 * 可用的本地变量如下：
 * a：受到伤害的角色对象
 * r：受到伤害的角色当前HP比例（0-100）
 *
 * 如果要输入计算公式，请在参数设置窗口中
 * 选择“文本”标签后输入。
 *
 * 本插件没有插件命令。
 *
 * 使用条款：
 *  允许自由修改与再分发，无需获得作者许可。
 *  使用形式（商用、18禁等）不受限制。
 *  这个插件现在属于你了。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

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

    Game_Battler.prototype.convertShakeParameter = function(value) {
        // use in eval
        const a= this;
        const r = a.hpRate() * 100;
        return isNaN(value) ? eval(value) : value;
    };

    Game_Battler.prototype.isShakeOnDamage = function() {
        return !$gameSwitches.value(param.disableSwitch);
    };

    const _Game_Actor_isShakeOnDamage = Game_Actor.prototype.isShakeOnDamage;
    Game_Actor.prototype.isShakeOnDamage = function() {
        return _Game_Actor_isShakeOnDamage.apply(this, arguments) && param.applyActor;
    };

    const _Game_Enemy_isShakeOnDamage = Game_Enemy.prototype.isShakeOnDamage;
    Game_Enemy.prototype.isShakeOnDamage = function() {
        return _Game_Enemy_isShakeOnDamage.apply(this, arguments) && param.applyEnemy;
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
