//=============================================================================
// SuppressEffectNoDamage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2019/09/09 全体攻撃で特定の誰かがノーダメージだった場合、以後のターゲットがダメージを受けても効果抑制されてしまう問題を修正
// 1.0.0 2016/10/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SuppressEffectNoDamagePlugin
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author triacontane
 *
 * @help HPおよびMPのダメージもしくは回復が設定されている
 * スキルにおいて結果が[0]だった場合に、使用効果が適用されなくなります。
 *
 * ただし、例外的にコモンイベントは実行されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ノーダメージ時の効果抑制プラグイン
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author トリアコンタン
 *
 * @help HPおよびMPのダメージもしくは回復が設定されている
 * スキルにおいて結果が[0]だった場合に、使用効果が適用されなくなります。
 *
 * ただし、例外的にコモンイベントは実行されます。
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

    var _Game_Action_clear = Game_Action.prototype.clear;
    Game_Action.prototype.clear = function() {
        _Game_Action_clear.apply(this, arguments);
        this._effectSuppress = null;
    };

    var _Game_Action_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        if ((this.isHpEffect() || this.isMpEffect()) && value === 0) {
            this._effectSuppress = target;
        }
        _Game_Action_executeDamage.apply(this, arguments);
    };

    var _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        if (this._effectSuppress === target) {
            return;
        }
        _Game_Action_applyItemEffect.apply(this, arguments);
    };
})();

