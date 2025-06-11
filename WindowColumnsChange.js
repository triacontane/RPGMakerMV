/*=============================================================================
 WindowColumnsChange.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/06/11 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ウィンドウ列数変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/WindowColumnsChange.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param itemCategoryColumns
 * @text アイテムカテゴリ列数
 * @desc アイテムカテゴリの列数を変更します。0を指定すると変更しません。
 * @default 0
 * @type number
 *
 * @help WindowColumnsChange.js
 *
 * 各種ウィンドウの列数を変更します。
 * 現行バージョンではアイテムカテゴリウィンドウのみ対応しています。
 *　
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_ItemCategory_maxCols = Window_ItemCategory.prototype.maxCols;
    Window_ItemCategory.prototype.maxCols = function() {
        const cols = param.itemCategoryColumns;
        return cols > 0 ? cols : _Window_ItemCategory_maxCols.call(this);
    };
})();
