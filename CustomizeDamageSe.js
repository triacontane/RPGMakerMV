//=============================================================================
// CustomizeDamageSe.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.4 2017/07/11 YEP_BattleEngineCore.jsとの競合を解消
// 1.1.3 2017/06/10 自動戦闘が有効なアクターがいる場合に一部機能が正常に動作しない問題を修正
// 1.1.2 2017/06/10 リファクタリング
// 1.1.1 2017/06/07 CustumCriticalSoundVer5.jsとの競合を解消
// 1.1.0 2017/02/02 ダメージが0だった場合に専用SEを演奏できる機能を追加
// 1.0.0 2016/12/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc CustomizeDamageSePlugin
 * @author triacontane
 *
 * @param WeaknessLine
 * @desc この値以上なら弱点と見なします。百分率で指定します。
 * @default 200
 *
 * @param WeaknessSe
 * @desc 弱点時に演奏されるSEです。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param ResistanceLine
 * @desc この値以下なら耐性と見なします。百分率で指定します。
 * @default 50
 *
 * @param ResistanceSe
 * @desc 耐性時に演奏されるSEです。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param NoDamageSe
 * @desc ダメージが0だった場合に演奏されるSEです。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @help 弱点時と耐性時と通常時（デフォルト）でダメージ効果音を分けることができます。
 * 弱点と耐性とで、それぞれダメージ倍率の閾値を指定可能です。
 *
 * パラメータで指定可能なのは効果音の名称のみです。
 * 音量、ピッチ、左右バランスを変更したい場合は、
 * ソースコードのユーザ設定箇所を変更する必要があります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ダメージSEカスタマイズプラグイン
 * @author トリアコンタン
 *
 * @param 弱点閾値
 * @desc この値以上なら弱点と見なします。百分率で指定します。
 * @default 200
 *
 * @param 弱点SE
 * @desc 弱点時に演奏されるSEです。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param 耐性閾値
 * @desc この値以下なら耐性と見なします。百分率で指定します。
 * @default 50
 *
 * @param 耐性SE
 * @desc 耐性時に演奏されるSEです。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param 無効SE
 * @desc ダメージが0だった場合に演奏されるSEです。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @help 弱点時と耐性時と通常時（デフォルト）でダメージ効果音を分けることができます。
 * 弱点と耐性とで、それぞれダメージ倍率の閾値を指定可能です。
 *
 * パラメータで指定可能なのは効果音の名称のみです。
 * 音量、ピッチ、左右バランスを変更したい場合は、
 * ソースコードのユーザ設定箇所を変更する必要があります。
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
    var pluginName = 'CustomizeDamageSe';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var isExistPlugin = function(pluginName) {
        return Object.keys(PluginManager.parameters(pluginName)).length > 0
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramWeaknessSe     = getParamString(['WeaknessSe', '弱点SE']);
    var paramResistanceSe   = getParamString(['ResistanceSe', '耐性SE']);
    var paramWeaknessLine   = getParamNumber(['WeaknessLine', '弱点閾値']);
    var paramResistanceLine = getParamNumber(['ResistanceLine', '耐性閾値']);
    var paramNoDamageSe     = getParamString(['NoDamageSe', '無効SE']);

    var userSettings = new Map([
        ['weaknessSe', {name: paramWeaknessSe, volume: 90, pitch: 100, pan: 0}],
        ['resistanceSe', {name: paramResistanceSe, volume: 90, pitch: 100, pan: 0}],
        ['noDamageSe', {name: paramNoDamageSe, volume: 90, pitch: 100, pan: 0}]
    ]);

    //=============================================================================
    // Game_Action
    //  弱点および耐性を検知します。
    //=============================================================================
    var _Game_Action_calcElementRate    = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        var result = _Game_Action_calcElementRate.apply(this, arguments);
        if (BattleManager.isInputting()) return result;
        if (result >= paramWeaknessLine / 100) {
            target.setEffectiveSe(userSettings.get('weaknessSe'));
        } else if (result <= paramResistanceLine / 100) {
            target.setEffectiveSe(userSettings.get('resistanceSe'));
        }
        return result;
    };

    var _Game_Action_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        if (value === 0) {
            target.setEffectiveSe(userSettings.get('noDamageSe'));
        }
        _Game_Action_executeDamage.apply(this, arguments);
    };

    //=============================================================================
    // Game_Battler
    //  弱点および耐性の効果音を設定します。
    //=============================================================================
    Game_Battler.prototype.setEffectiveSe = function(se) {
        this._effectiveSe = se;
    };

    Game_Battler.prototype.getEffectiveSe = function() {
        return this._effectiveSe;
    };

    Game_Battler.prototype.performNoDamage = function() {
        SoundManager.playCustomDamage();
    };

    var _Game_Battler_performResultEffects = Game_Battler.prototype.performResultEffects;
    Game_Battler.prototype.performResultEffects = function() {
        var effectiveSe = this.getEffectiveSe();
        if (effectiveSe) {
            SoundManager.changeDamageSe(effectiveSe);
            this.setEffectiveSe(null);
        }
        _Game_Battler_performResultEffects.apply(this, arguments);
    };

    //=============================================================================
    // SoundManager
    //  ダメージ効果音をカスタマイズ可能にします。
    //=============================================================================
    SoundManager.changeDamageSe = function(se) {
        this._damageSe = se;
    };

    SoundManager.playCustomDamage = function() {
        var result = false;
        if (this._damageSe && this._damageSe.name) {
            AudioManager.playSe(this._damageSe);
            this._damageSe = null;
            result = true;
        }
        this._damageSe = null;
        return result;
    };

    var _SoundManager_playActorDamage = SoundManager.playActorDamage;
    SoundManager.playActorDamage        = function() {
        this.playCustomDamage() || _SoundManager_playActorDamage.apply(this, arguments);
    };

    var _SoundManager_playEnemyDamage = SoundManager.playEnemyDamage;
    SoundManager.playEnemyDamage        = function() {
        this.playCustomDamage() || _SoundManager_playEnemyDamage.apply(this, arguments);
    };

    //=============================================================================
    // Window_BattleLog
    //  ダメージ効果音を演奏します。
    //=============================================================================
    var _Window_BattleLog_performDamage    = Window_BattleLog.prototype.performDamage;
    Window_BattleLog.prototype.performDamage = function(target) {
        this.setEffectiveSe(target);
        _Window_BattleLog_performDamage.apply(this, arguments);
    };

    Window_BattleLog.prototype.performNoDamage = function(target) {
        this.setEffectiveSe(target);
        target.performNoDamage();
    };

    Window_BattleLog.prototype.setEffectiveSe = function(target) {
        var effectiveSe = target.getEffectiveSe();
        if (effectiveSe) {
            SoundManager.changeDamageSe(effectiveSe);
            target.setEffectiveSe(null);
        }
    };

    var _Window_BattleLog_displayHpDamage = Window_BattleLog.prototype.displayHpDamage;
    Window_BattleLog.prototype.displayHpDamage = function(target) {
        if (target.result().hpAffected) {
            if (target.result().hpDamage === 0) {
                this.push('performNoDamage', target);
            }
        }
        if (isExistPlugin('CustumCriticalSoundVer5') && target.result().hpDamage > 0) {
            this.setEffectiveSe(target);
        }
        _Window_BattleLog_displayHpDamage.apply(this, arguments);
    };
})();
