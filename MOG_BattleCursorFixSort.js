/*=============================================================================
 MOG_BattleCursorFixSort.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/05/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc MOG_BattleCursorFixSortPlugin
 * @author triacontane
 *
 * @help MOG_BattleCursorFixSort.js
 *
 * MOG_BattleCursorのパラメータ「Sort X-Axis」が機能しない問題を修正します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc MOG_BattleCursorのソート修正プラグイン
 * @author トリアコンタン
 *
 * @help MOG_BattleCursorFixSort.js
 *
 * MOG_BattleCursorのパラメータ「Sort X-Axis」が機能しない問題を修正します。
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

    Game_Troop.prototype.sortMembers = function() {
        if (!this._enemies) {
            return;
        }
        this._enemies.sort(function(a, b) {
            return a._screenX-b._screenX;
        });
    };

    var _Window_BattleEnemy_refresh = Window_BattleEnemy.prototype.refresh;
    Window_BattleEnemy.prototype.refresh = function() {
        if (Moghunter.bcursor_sort_x === "true") {
            $gameTroop.sortMembers();
        }
        var aliveMembers = $gameTroop.aliveMembers();
        _Window_BattleEnemy_refresh.call(this);
        this._enemies = aliveMembers;
    };
})();
