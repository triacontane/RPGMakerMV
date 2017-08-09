//=============================================================================
// SaveFileLoadOnly.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/08/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SaveFileLoadOnlyPlugin
 * @author triacontane
 *
 * @help SaveFileLoadOnly.js
 *
 * 特定のセーブファイルを読み取り専用にできます。
 * セーブができないので、作者側であらかじめセーブファイルを用意してください。
 *
 * パラメータでロード専用条件を指定します。
 * 指定例：
 * fileId === 1               # ファイルID[1]を読み取り専用にします。
 * fileId === \v[1]           # ファイルID[変数[1]の値]を読み取り専用にします。
 * fileId >= 1 && fileId <= 3 # ファイルID[1-3]を読み取り専用にします。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc セーブファイルのロード専用化プラグイン
 * @author トリアコンタン
 *
 * @param ロード専用条件
 * @desc ロード専用対象の判定式です。制御文字\v[n]が使用できます。
 * @default fileId === 1
 *
 * @param ロード専用アイコンID
 * @desc セーブファイルウィンドウで、ロード専用ファイルにのみ描画されるアイコンIDです。
 * @default 195
 * @type number
 *
 * @help SaveFileLoadOnly.js
 *
 * 特定のセーブファイルを読み取り専用にできます。
 * パラメータでロード専用条件を指定してください。指定には計算式が使えます。
 * 指定例：
 * fileId === 1               # ファイルID[1]を読み取り専用にします。
 * fileId === \v[1]           # ファイルID[変数[1]の値]を読み取り専用にします。
 * fileId >= 1 && fileId <= 3 # ファイルID[1-3]を読み取り専用にします。
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
    var pluginName = 'SaveFileLoadOnly';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
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

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param               = {};
    param.conditionRoadOnly = getParamString(['ConditionRoadOnly', 'ロード専用条件']);
    param.roadOnlyIconId    = getParamNumber(['RoadOnlyIconId', 'ロード専用アイコンID'], 0);

    //=============================================================================
    // Window_SavefileList
    //  ロード専用ファイルの判定を追加定義します。
    //=============================================================================
    var _Window_SavefileList_isCurrentItemEnabled      = Window_SavefileList.prototype.isCurrentItemEnabled;
    Window_SavefileList.prototype.isCurrentItemEnabled = function() {
        return _Window_SavefileList_isCurrentItemEnabled.apply(this, arguments) && !this.isCurrentItemLoadOnly();
    };

    Window_SavefileList.prototype.isCurrentItemLoadOnly = function() {
        return this.isModeSave() && this.isLoadOnly(this._index + 1);
    };

    Window_SavefileList.prototype.isLoadOnly = function(fileId) {
        var conditionFormula = convertEscapeCharacters(param.conditionRoadOnly);
        var result;
        try {
            result = !!eval(conditionFormula);
        } catch (e) {
            console.error(e.toString());
            throw new Error('Failed To Execute Script :' + conditionFormula);
        }
        return result;
    };

    var _Window_SavefileList_drawFileId      = Window_SavefileList.prototype.drawFileId;
    Window_SavefileList.prototype.drawFileId = function(id, x, y) {
        _Window_SavefileList_drawFileId.apply(this, arguments);
        if (this.isLoadOnly(id) && param.roadOnlyIconId > 0) {
            this.drawIcon(param.roadOnlyIconId, x + 188 - Window_Base._iconWidth, y + 2);
        }
    };

    Window_SavefileList.prototype.isModeSave = function() {
        return this._mode === 'save';
    };
})();

