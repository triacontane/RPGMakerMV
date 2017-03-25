//=============================================================================
// SaveFileDrawFace.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/03/26 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SaveFileDrawFacePlugin
 * @author triacontane
 *
 * @param VisibleItems
 * @desc セーブファイルウィンドウに表示可能な行数です。デフォルト解像度の場合、3のままで問題ありません。
 * @default 3
 *
 * @help セーブファイルウィンドウで歩行フラフィックの代わりに
 * 顔グラフィックを表示します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc セーブファイルのフェイス表示プラグイン
 * @author トリアコンタン
 *
 * @param 表示行数
 * @desc セーブファイルウィンドウに表示可能な行数です。デフォルト解像度の場合、3のままで問題ありません。
 * @default 3
 *
 * @help セーブファイルウィンドウで歩行フラフィックの代わりに
 * 顔グラフィックを表示します。
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
    var pluginName    = 'SaveFileDrawFace';

    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = {};
    param.visibleItems = getParamNumber(['VisibleItems', '表示行数']);

    //=============================================================================
    // Window_SavefileList
    //  歩行グラフィックを非表示にして顔グラフィックを表示します。
    //=============================================================================
    Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {};

    Window_SavefileList.prototype.drawPartyFaces = function(info, x, y) {
        if (info.faces) {
            for (var i = 0; i < info.faces.length; i++) {
                var data = info.faces[i];
                this.drawFace(data[0], data[1], x + i * 148, y);
            }
        }
    };

    var _Window_SavefileList_drawContents = Window_SavefileList.prototype.drawContents;
    Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
        if (valid) {
            var y = rect.y + this.itemHeight() / 2 - Window_Base._faceHeight / 2 + this.lineHeight() / 2;
            var maxY = rect.y + rect.height - Window_Base._faceHeight;
            this.drawPartyFaces(info, rect.x, Math.min(y, maxY));
        }
        _Window_SavefileList_drawContents.apply(this, arguments);
    };

    Window_SavefileList.prototype.maxVisibleItems = function() {
        return param.visibleItems;
    };

    var _Window_SavefileList_drawItem = Window_SavefileList.prototype.drawItem;
    Window_SavefileList.prototype.drawItem = function(index) {
        _Window_SavefileList_drawItem.apply(this, arguments);
        var id = index + 1;
        var rect = this.itemRectForText(index);
        this.drawFileId(id, rect.x, rect.y);
    };
})();

