//=============================================================================
// BugFixFreezeOfSkillEscape.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/10/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BugFixFreezeOfSkillEscapePlugin
 * @author triacontane
 *
 * @help アクター全員が逃走スキルによって逃走した場合に
 * フリーズしてしまう現象を修正します。
 *
 * また逃走できない戦闘の場合は、アクターを対象にした逃走は
 * 無条件で失敗するようになります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 逃走スキルによるフリーズ修正プラグイン
 * @author トリアコンタン
 *
 * @help アクター全員が逃走スキルによって逃走した場合に
 * フリーズしてしまう現象を修正します。
 *
 * また逃走できない戦闘の場合は、アクターを対象にした逃走は
 * 無条件で失敗するようになります。
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

    var _Game_Action_itemEffectSpecial = Game_Action.prototype.itemEffectSpecial;
    Game_Action.prototype.itemEffectSpecial = function(target, effect) {
        if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE && target.isActor() && !BattleManager.canEscape()) {
            this.makeSuccess(target);
            return;
        }
        _Game_Action_itemEffectSpecial.apply(this, arguments);
    };

    var _Game_Party_isAllDead = Game_Party.prototype.isAllDead;
    Game_Party.prototype.isAllDead = function() {
        var result = _Game_Party_isAllDead.apply(this, arguments);
        if (result && this.isEmpty()) {
            result = false;
        }
        return result;
    };

    var _BattleManager_updateEvent = BattleManager.updateEvent;
    BattleManager.updateEvent = function() {
        var result = _BattleManager_updateEvent.apply(this, arguments);
        if (result && $gameParty.isEmpty()) {
            result = false;
            this._escaped = true;
            this.processAbort();
        }
        return result;
    };
})();

