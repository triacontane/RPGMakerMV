//=============================================================================
// AllowEventOverlap.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/05/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc イベントの重複許可プラグイン
 * @author トリアコンタン
 *
 * @help イベント同士がマップ上の同位置に移動することを許可します。
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
    var pluginName = 'AllowEventOverlap';

    var _Game_Event_isCollidedWithEvents = Game_Event.prototype.isCollidedWithEvents;
    Game_Event.prototype.isCollidedWithEvents = function(x, y) {
        var result = _Game_Event_isCollidedWithEvents.apply(this, arguments);
        if (result) {
            if (!this.isNormalPriority()) return false;
            var events = $gameMap.eventsXyNt(x, y);
            return events.some(function (event) {
                return event.isNormalPriority();
            });
        }
        return result;
    };
})();

