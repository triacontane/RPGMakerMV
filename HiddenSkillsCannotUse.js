//=============================================================================
// HiddenSkillsCannotUse.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/06/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 使用不可スキルの非表示
 * @author トリアコンタン
 *
 * @help 戦闘画面のスキル選択ウィンドウにおいて
 * 使用できないスキルを非表示にします。
 * メニュー画面では通常通り表示されます。
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
    var pluginName    = 'HiddenSkillsCannotUse';

    //=============================================================================
    // Window_BattleSkill
    //  使用できないスキルを非表示にします。
    //=============================================================================
    Window_BattleSkill.prototype.includes = function(item) {
        return Window_SkillList.prototype.includes.call(this, item) && this._actor.canUse(item);
    };
})();

