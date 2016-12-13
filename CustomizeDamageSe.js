//=============================================================================
// CustomizeDamageSe.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @param WeaknessSe
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
    const pluginName = 'CustomizeDamageSe';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    const getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    const getParamNumber = function(paramNames, min, max) {
        const value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    const getParamString = function(paramNames) {
        const value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    const paramWeaknessSe     = getParamString(['WeaknessSe', '弱点SE']);
    const paramResistanceSe   = getParamString(['ResistanceSe', '耐性SE']);
    const paramWeaknessLine   = getParamNumber(['WeaknessLine', '弱点閾値']);
    const paramResistanceLine = getParamNumber(['ResistanceLine', '耐性閾値']);

    const userSettings = new Map([
        ['weaknessSe', {name: paramWeaknessSe, volume: 90, pitch: 100, pan: 0}],
        ['resistanceSe', {name: paramResistanceSe, volume: 90, pitch: 100, pan: 0}]
    ]);

    //=============================================================================
    // Game_Action
    //  弱点および耐性を検知します。
    //=============================================================================
    const _Game_Action_calcElementRate    = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        const result = _Game_Action_calcElementRate.apply(this, arguments);
        if (result >= paramWeaknessLine / 100) {
            target.setEffectiveSe(userSettings.get('weaknessSe'));
        } else if (result <= paramResistanceLine / 100) {
            target.setEffectiveSe(userSettings.get('resistanceSe'));
        }
        return result;
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

    //=============================================================================
    // SoundManager
    //  ダメージ効果音をカスタマイズ可能にします。
    //=============================================================================
    SoundManager.changeDamageSe = function(se) {
        this._damageSe = se;
    };

    SoundManager.playCustomDamage = function() {
        if (this._damageSe) {
            AudioManager.playSe(this._damageSe);
            this._damageSe = null;
            return true;
        }
        return false;
    };

    const _SoundManager_playActorDamage = SoundManager.playActorDamage;
    SoundManager.playActorDamage        = function() {
        this.playCustomDamage() || _SoundManager_playActorDamage.apply(this, arguments);
    };

    const _SoundManager_playEnemyDamage = SoundManager.playEnemyDamage;
    SoundManager.playEnemyDamage        = function() {
        this.playCustomDamage() || _SoundManager_playEnemyDamage.apply(this, arguments);
    };

    //=============================================================================
    // Window_BattleLog
    //  ダメージ効果音を演奏します。
    //=============================================================================
    const _Window_BattleLog_performDamage    = Window_BattleLog.prototype.performDamage;
    Window_BattleLog.prototype.performDamage = function(target) {
        const effectiveSe = target.getEffectiveSe();
        if (effectiveSe) {
            SoundManager.changeDamageSe(effectiveSe);
            target.setEffectiveSe(null);
        }
        _Window_BattleLog_performDamage.apply(this, arguments);
    };
})();
