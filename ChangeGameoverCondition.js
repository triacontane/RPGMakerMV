//=============================================================================
// ChangeGameOverCondition.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/04/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ゲームオーバー条件変更プラグイン
 * @author トリアコンタン
 *
 * @help ゲームオーバー条件をいずれかの味方が戦闘不能になった場合
 * に変更します。
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

    var _Game_Party_isAllDead = Game_Party.prototype.isAllDead;
    Game_Party.prototype.isAllDead = function() {
        var result = _Game_Party_isAllDead.apply(this, arguments);
        if (!result) {
            return (this.inBattle() || !this.isEmpty()) && this.deadMembers().length > 0;
        }
        return result;
    };
})();

