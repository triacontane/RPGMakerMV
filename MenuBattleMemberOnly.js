//=============================================================================
// MenuBattleMemberOnly.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/05/10 YEP_PartySystem.jsとの競合を解消
// 1.0.0 2016/05/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 戦闘メンバーのみメニュープラグイン
 * @author トリアコンタン
 *
 * @help メインメニューの表示を戦闘メンバーのみにします。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';

    Window_MenuStatus.prototype.maxItems = function() {
        return $gameParty.battleMembers().length;
    };

    var _Window_MenuStatus_selectLast = Window_MenuStatus.prototype.selectLast;
    Window_MenuStatus.prototype.selectLast = function() {
        _Window_MenuStatus_selectLast.apply(this, arguments);
        if (this.index() > this.maxItems() - 1) {
            this.select(0);
        }
    };
})();

