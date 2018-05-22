//=============================================================================
// DescriptionExtend.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2018/05/22 プラグインの機能を無効化するスイッチを追加
// 1.0.0 2018/05/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DescriptionExtendPlugin
 * @author triacontane
 *
 * @param swapDescription
 * @desc 元の説明文を無視してメモ欄の値で置き換えます。OFFの場合は元の説明文の次行に表示されます。
 * @default true
 * @type boolean
 *
 * @param helpLines
 * @desc ヘルプウィンドウの高さを変更したい場合は指定してください。0の場合は何もしません。
 * @default 0
 * @type number
 *
 * @param validSwitch
 * @desc 指定した番号のスイッチがONのときのみプラグインが有効になります。0の場合は常に有効になります。
 * @default 0
 * @type switch
 *
 * @param notePrefix
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help DescriptionExtend.js
 *
 * ヘルプウィンドウの説明欄を拡張します。3行目以降を表示できるようになります。
 * メモ欄に以下の通り設定してください。
 * <ExtendDesc:aaa> // [aaa]を追加表示します。
 * <拡張説明:aaa>   // 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 説明拡張プラグイン
 * @author トリアコンタン
 *
 * @param swapDescription
 * @text 説明置き換え
 * @desc 元の説明文を無視してメモ欄の値で置き換えます。OFFの場合は元の説明文の次行に表示されます。
 * @default true
 * @type boolean
 *
 * @param helpLines
 * @text ヘルプ行数
 * @desc ヘルプウィンドウの高さを変更したい場合は指定してください。0の場合は何もしません。
 * @default 0
 * @type number
 *
 * @param validSwitch
 * @text 有効スイッチ
 * @desc 指定した番号のスイッチがONのときのみプラグインが有効になります。0の場合は常に有効になります。
 * @default 0
 * @type switch
 *
 * @param notePrefix
 * @text メモ欄接頭辞
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help DescriptionExtend.js
 *
 * ヘルプウィンドウの説明欄を拡張します。3行目以降を表示できるようになります。
 * メモ欄に以下の通り設定してください。
 * <ExtendDesc:aaa> // [aaa]を追加表示します。
 * <拡張説明:aaa>   // 同上
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
        var tagName = param.notePrefix + name;
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

    var param = createPluginParameter('DescriptionExtend');

    /**
     * Window_Help
     * 拡張説明を追記します。
     */
    var _Window_Help_initialize = Window_Help.prototype.initialize;
    Window_Help.prototype.initialize = function(numLines) {
        _Window_Help_initialize.call(this, numLines || param.helpLines);
    };

    var _Window_Help_setItem = Window_Help.prototype.setItem;
    Window_Help.prototype.setItem = function(item) {
        _Window_Help_setItem.apply(this, arguments);
        if (!item || !this.isValidDescriptionExtend()) {
            return;
        }
        var extendText = getMetaValues(item, ['拡張説明', 'ExtendDesc']);
        if (extendText) {
            this.setText((param.swapDescription ? '' : this._text + '\n') + extendText);
        }
    };

    Window_Help.prototype.isValidDescriptionExtend = function() {
        return !param.validSwitch || $gameSwitches.value(param.validSwitch)
    };
})();
