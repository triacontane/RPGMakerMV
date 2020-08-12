/*=============================================================================
 OverpassTileEventAttach.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/03/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @target MZ
 * @plugindesc Overpass Plugin Event Attachment
 * @author triacontane
 * @base OverpassTile
 * @orderAfter OverpassTile
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OverpassTileEventAttach.js
 *
 * @help OverpassTileEventAttach.js
 * An overpass event attachment for the official "OverpassTile.js" plugin.
 * When specified as in the notes field below, the target event will be treated as an overpass.
 *
 * <Overpass>
 *
 * However, the overpass will not work with pages without graphics specified or 
 * in the event that there are no valid pages.
 * As a general rule, please select "Above Normal Characters" for the priority.
 *
 * User Agreement:
 *  You may alter or redistribute the plugin without permission. There are no restrictions on usage format
 *  (such as adult-only use or commercial use).
 *  This plugin is now all yours.
 */

 /*:ja
 * @target MZ
 * @plugindesc 立体交差プラグインのイベントアタッチメント
 * @author トリアコンタン
 * @base OverpassTile
 * @orderAfter OverpassTile
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OverpassTileEventAttach.js
 *
 * @help OverpassTileEventAttach.js
 * 公式プラグイン「OverpassTile.js」の立体交差イベントアタッチメントです。
 * イベントのメモ欄に以下の通り指定すると、対象イベントが立体交差として扱われます。
 *
 * <Overpass>
 *
 * ただし、グラフィックが指定されていないページもしくは有効なページがない場合は
 * 立体交差になりません。
 * また、プライオリティは原則「通常キャラの上」を選択してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._overPass = this.findMeta('Overpass');
    };

    Game_Event.prototype.isOverPathEvent = function() {
        return this._overPass && (this._characterName !== '' || this._tileId > 0);
    };

    const _Game_Map_isOverPath = Game_Map.prototype.isOverPath;
    Game_Map.prototype.isOverPath = function(x, y) {
        const result = _Game_Map_isOverPath.apply(this, arguments);
        if (result) {
            return result;
        } else {
            return this.eventsXy(x, y).some(event => event.isOverPathEvent());
        }
    };
})();
