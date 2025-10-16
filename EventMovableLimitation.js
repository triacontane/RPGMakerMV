/*=============================================================================
 EventMovableLimitation.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.2 2021/08/31 ヘルプのプラグイン名表記の誤りを修正
 1.0.1 2020/11/30 英訳版ヘルプをご提供いただいて追加
 1.0.0 2020/06/15 MV版から流用作成
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc EventMovableLimitationPlugin
 * @author triacontane
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventMovableLimitation.js
 *
 * @help EventMovableLimitation.js
 *
 * Limit the movable range of events.
 * If you try to move beyond the limits from the initial placement, you will not be able to move.
 * Please specify the following in the event Note section
 * <Movable:u, d, l, r>
 *  u : The number of movable tiles in the upward direction
 *  d : The number of movable tiles in the downward direction
 *  l : The number of movable tiles in the left direction
 *  r : The number of movable tiles in the right direction
 * If you specify a negative value, such as -1, the movement in the specified direction will be unlimited.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc イベント移動範囲制限プラグイン
 * @author トリアコンタン
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventMovableLimitation.js
 *
 * @help EventMovableLimitation.js
 *
 * イベントの移動可能な範囲を制限します。
 * 初期配置から制限を超えて移動しようとすると移動できなくなります。
 * イベントのメモ欄に以下の通り指定してください。
 * <移動制限:u, d, l, r>
 * <Movable:u, d, l, r>
 *  u : 上方向への移動可能タイル数
 *  d : 下方向への移動可能タイル数
 *  l : 左方向への移動可能タイル数
 *  r : 右方向への移動可能タイル数
 * -1など負の値を指定すると、指定方向への移動は無制限になります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
/*:zh
 * @plugindesc 事件移动范围限制插件
 * @author triacontane
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventMovableLimitation.js
 *
 * @help EventMovableLimitation.js
 *
 * 【功能说明】
 * 限制事件的可移动范围。
 * 当事件尝试超出设定的移动范围时，将无法继续移动。
 *
 * 【使用方法】
 * 请在事件的备注（Note）中添加以下格式的指令：
 *
 * <移动限制:u, d, l, r>
 * <Movable:u, d, l, r>
 *
 * 参数说明：
 *  u ：向上可移动的最大格数  
 *  d ：向下可移动的最大格数  
 *  l ：向左可移动的最大格数  
 *  r ：向右可移动的最大格数  
 *
 * 示例：
 * <Movable:2,3,1,1>
 * → 该事件可以：
 *    向上移动2格，
 *    向下移动3格，
 *    向左移动1格，
 *    向右移动1格。
 *
 * 若为某一方向设置负值（如 -1），则表示该方向的移动不受限制。
 *
 * 【注意事项】
 * - 移动范围的计算基于事件的初始位置。
 * - 适用于 RPG Maker MZ。
 *
 * 【许可】
 * 本插件以 MIT 许可证发布。
 * 您可自由修改、再发布、商用或成人游戏中使用，无需署名。
 * 该插件完全归您所有。
 */

(() => {
    'use strict';

    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        const movables = this.findMeta(['移動制限', 'Movable']);
        if (movables) {
            this._movables = movables.split(',').map(function(value) {
                return parseInt(value);
            });
            this._initX = this._x;
            this._initY = this._y;
        }
    };

    const _Game_Event_canPass = Game_Event.prototype.canPass;
    Game_Event.prototype.canPass = function(x, y, d) {
        if (this._movables) {
            const x2 = $gameMap.roundXWithDirection(x, d);
            const y2 = $gameMap.roundYWithDirection(y, d);
            if (this._movables[0] >= 0 && this._initY - y2 > this._movables[0]) {
                return false;
            }
            if (this._movables[1] >= 0 && y2 - this._initY > this._movables[1]) {
                return false;
            }
            if (this._movables[2] >= 0 && this._initX - x2 > this._movables[2]) {
                return false;
            }
            if (this._movables[3] >= 0 && x2 - this._initX > this._movables[3]) {
                return false;
            }
        }
        return _Game_Event_canPass.apply(this, arguments);
    };
})();
