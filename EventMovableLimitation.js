/*=============================================================================
 EventMovableLimitation.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2018/12/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc EventMovableLimitationPlugin
 * @author triacontane
 *
 * @param commandPrefix
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help EventMovableRange.js
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
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc イベント移動範囲制限プラグイン
 * @author トリアコンタン
 *
 * @param commandPrefix
 * @text メモ欄接頭辞
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help EventMovableRange.js
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

(function() {
    'use strict';

    /**
     * Get database meta information.
     * @param object Database item
     * @param name Meta name
     * @returns {String} meta value
     */
    var getMetaValue = function(object, name) {
        var tagName = param.commandPrefix + name;
        return object.meta.hasOwnProperty(tagName) ? convertEscapeCharacters(object.meta[tagName]) : null;
    };

    /**
     * Get database meta information.(for multi language)
     * @param object Database item
     * @param names Meta name array (for multi language)
     * @returns {String} meta value
     */
    var getMetaValues = function(object, names) {
        var metaValue;
        names.some(function(name) {
            metaValue = getMetaValue(object, name);
            return metaValue !== null;
        });
        return metaValue;
    };

    /**
     * Convert escape characters.(require any window object)
     * @param text Target text
     * @returns {String} Converted text
     */
    var convertEscapeCharacters = function(text) {
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
    };

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };
    var param = createPluginParameter('EventMovableLimitation');

    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        var movables = getMetaValues(this.event(), ['移動制限', 'Movable']);
        if (movables) {
            this._movables = movables.split(',').map(function(value) {
                return parseInt(value);
            });
            this._initX = this._x;
            this._initY = this._y;
        }
    };

    var _Game_Event_canPass = Game_Event.prototype.canPass;
    Game_Event.prototype.canPass = function(x, y, d) {
        if (this._movables) {
            var x2 = $gameMap.roundXWithDirection(x, d);
            var y2 = $gameMap.roundYWithDirection(y, d);
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
