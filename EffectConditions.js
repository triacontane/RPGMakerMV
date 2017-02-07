//=============================================================================
// EffectConditions.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.3 2017/02/07 端末依存の記述を削除
// 1.0.2 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.0.1 2017/01/01 YEP_BattleEngineCore.js用の対策コードを追記
// 1.0.0 2017/01/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc EffectConditionsPlugin
 * @author triacontane
 *
 * @help 効果のひとつひとつに適用条件を設定します。
 * 条件を満たさない効果は無効になります。
 * 効果を記述するデータベースのメモ欄に以下の通り入力してください。
 *
 * <EC1スイッチ:10> // スイッチ[10]がONの場合、1番目の効果が有効になる
 * <EC1Switch:10>   // 同上
 * <EC1条件:JS式>   // JS式の評価結果がtrueの場合、1番目の効果が有効になる
 * <EC1Cond:JS式>   // 同上
 * スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例：<EC1条件:\v[1] &gt; 10> // 変数[1]が10より大きい場合
 *
 * スクリプト中で「subject」と記述すると発動者を参照できます。
 * スクリプト中で「target」と記述すると対象者を参照できます。(※1)
 * スクリプト中で「damage」と記述するとスキルの効果量を参照できます。(※2)
 *
 * ※1 ただし効果の種類が「コモンイベント」の場合は使えません。
 * ※2 回復の場合は負の値になります。
 *
 * 例:<EC1条件:target.hpRate() === 1> # 相手のHPが最大の場合のみ効果あり
 *
 * 2番目以降の効果も同様に設定可能です。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 効果の条件適用プラグイン
 * @author トリアコンタン
 *
 * @help 効果のひとつひとつに適用条件を設定します。
 * 条件を満たさない効果は無効になります。
 * 効果を記述するデータベースのメモ欄に以下の通り入力してください。
 *
 * <EC1スイッチ:10> // スイッチ[10]がONの場合、1番目の効果が有効になる
 * <EC1Switch:10>   // 同上
 * <EC1条件:JS式>   // JS式の評価結果がtrueの場合、1番目の効果が有効になる
 * <EC1Cond:JS式>   // 同上
 * スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例：<EC1条件:\v[1] &gt; 10> // 変数[1]が10より大きい場合
 *
 * スクリプト中で「subject」と記述すると発動者を参照できます。
 * スクリプト中で「target」と記述すると対象者を参照できます。(※1)
 * スクリプト中で「damage」と記述するとスキルの効果量を参照できます。(※2)
 *
 * ※1 ただし効果の種類が「コモンイベント」の場合は使えません。
 * ※2 回復の場合は負の値になります。
 *
 * 例:<EC1条件:target.hpRate() === 1> # 相手のHPが最大の場合のみ効果あり
 *
 * 2番目以降の効果も同様に設定可能です。
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
    var pluginName    = 'EffectConditions';
    var metaTagPrefix = 'EC';

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
        if (text == null || text === true) text = '';
        text = text.replace(/&gt;?/gi, '>');
        text = text.replace(/&lt;?/gi, '<');
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // Game_Action
    //  効果の条件適用を実装します。
    //=============================================================================
    var _Game_Action_executeDamage =Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        this._damageValue = value;
        _Game_Action_executeDamage.apply(this, arguments);
    };

    var _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        if (this.isValidEffect(target, effect)) {
            _Game_Action_applyItemEffect.apply(this, arguments);
        }
    };

    var _Game_Action_applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function() {
        _Game_Action_applyGlobal.apply(this, arguments);
        this.cancelEffectCommonEvent();
    };

    Game_Action.prototype.cancelEffectCommonEvent = function() {
        this.item().effects.some(function(effect) {
            if (effect.code === Game_Action.EFFECT_COMMON_EVENT && !this.isValidEffect(null, effect)) {
                $gameTemp.clearCommonEvent();
            }
        }, this);
    };

    Game_Action.prototype.isValidEffect = function(target, effect) {
        var index = this.getEffectIndex(effect);
        if (!this.isValidEffectSwitch(index)) return false;
        if (!this.isValidEffectScript(index, target)) return false;
        return true;
    };

    Game_Action.prototype.isValidEffectSwitch = function(index) {
        var metaValue = getMetaValues(this.item(), [index + 'スイッチ', index + 'Switch']);
        if (!metaValue) return true;
        return $gameSwitches.value(getArgNumber(metaValue, 1));
    };

    Game_Action.prototype.isValidEffectScript = function(index, target) {
        var metaValue = getMetaValues(this.item(), [index + '条件', index + 'Cond']);
        if (!metaValue) return true;
        try {
            var damage = this._damageValue || 0;
            var subject = this.subject();
            return eval(metaValue);
        } catch (e) {
            throw new Error(pluginName + 'で指定したスクリプト実行中にエラーが発生しました。実行内容:' + metaValue);
        }
    };

    Game_Action.prototype.getEffectIndex = function(effect) {
        return this.item().effects.indexOf(effect) + 1;
    };

    //=============================================================================
    // BattleManager
    //  YEP_BattleEngineCore.js用コード
    //=============================================================================
    var _BattleManager_actionActionCommonEvent = BattleManager.actionActionCommonEvent;
    BattleManager.actionActionCommonEvent = function() {
        var result = _BattleManager_actionActionCommonEvent.apply(this, arguments);
        this._action.cancelEffectCommonEvent();
        return result;
    };
})();

