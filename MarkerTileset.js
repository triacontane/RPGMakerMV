/*=============================================================================
 MarkerTileset.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2018/08/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc MarkerTilesetPlugin
 * @author triacontane
 *
 * @param commandPrefix
 * @text メモ欄接頭辞
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help MarkerTileset.js
 *
 * タイルセットのうち特定の画像だけをゲーム上でのみ非表示にできます。
 * 主にエディタ上でのみ表示されるマーカーのような使い方ができます。
 *
 * タイルセットのメモ欄に以下の通り指定してください。
 * <HiddenTiles:A> // [A]タブがゲーム上で非表示になります。Eまで指定可
 *
 * 複数指定する場合は以下のようにカンマ区切りで指定してください。
 * <HiddenTiles:A,B,D>
 *
 * 表示されなくなるのは画像だけで、通行可能判定等はそのまま残ります。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc マーカータイルセットプラグイン
 * @author トリアコンタン
 *
 * @param commandPrefix
 * @text メモ欄接頭辞
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help MarkerTileset.js
 *
 * タイルセットのうち特定の画像だけをゲーム上でのみ非表示にできます。
 * 主にエディタ上でのみ表示されるマーカーのような使い方ができます。
 *
 * タイルセットのメモ欄に以下の通り指定してください。
 * <非表示タイル:A> // [A]タブがゲーム上で非表示になります。Eまで指定可
 * <HiddenTiles:A>  // 同上
 *
 * 複数指定する場合は以下のようにカンマ区切りで指定してください。
 * <非表示タイル:A,B,D>
 *
 * 表示されなくなるのは画像だけで、通行可能判定等はそのまま残ります。
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

    var param = createPluginParameter('MarkerTileset');

    /**
     * Game map 条件を満たした場合のタイルセットファイル名を空にします。
     */
    Game_Map._tilesetTags = {'a': [0, 1, 2, 3, 4], 'b': [5], 'c': [6], 'd': [7], 'e': [8]};

    var _Game_Map_tileset      = Game_Map.prototype.tileset;
    Game_Map.prototype.tileset = function() {
        var tileset = _Game_Map_tileset.apply(this, arguments);
        if (!tileset.makerApplied) {
            this.hiddenMakerTiles(tileset);
        }
        return tileset;
    };

    Game_Map.prototype.hiddenMakerTiles = function(tileset) {
        var hiddenTiles = getMetaValues(tileset, ['非表示タイル', 'HiddenTiles']);
        if (hiddenTiles) {
            var hiddenTileList = hiddenTiles.split(',');
            hiddenTileList.forEach(function(hiddenTile) {
                var indexList = Game_Map._tilesetTags[hiddenTile.toLowerCase()];
                if (!indexList) {
                    throw new Error(`Invalid tag name [${hiddenTile}]. Please set A, B, C, D, or E by MarkerTileset.js`);
                }
                indexList.forEach(function(index) {
                    tileset.tilesetNames[index] = '';
                });
            });
        }
        tileset.makerApplied = true;
    };
})();
