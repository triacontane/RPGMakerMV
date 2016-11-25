//=============================================================================
// ParamTextColorChanger.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/11/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ParamTextColorChangerPlugin
 * @author triacontane
 *
 * @param HP閾値配列
 * @desc テキストカラーを変更するHP割合の閾値をカンマ区切りで指定します。
 * @default 0,25,100
 *
 * @param HPカラー配列
 * @desc 対応する閾値の割合以下のHPテキストカラーをシステムカラーのIDで指定します。
 * @default 18,17,0
 *
 * @param MP閾値配列
 * @desc テキストカラーを変更するMP割合の閾値をカンマ区切りで指定します。
 * @default 100
 *
 * @param MPカラー配列
 * @desc 対応する閾値の割合以下のMPテキストカラーをシステムカラーのIDで指定します。
 * @default 0
 *
 * @param TP閾値配列
 * @desc テキストカラーを変更するTP割合の閾値をカンマ区切りで指定します。
 * @default 100
 *
 * @param TPカラー配列
 * @desc 対応する閾値の割合以下のTPテキストカラーをシステムカラーのIDで指定します。
 * @default 0
 *
 * @help HP、MPおよびTPの数値を表示する際に
 * 残量によって表示色を変更することができます。
 *
 * 値は10%単位で指定可能です。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc パラメータテキストカラー変更プラグイン
 * @author トリアコンタン
 *
 * @param HpThresholds
 * @desc テキストカラーを変更するHP割合の閾値をカンマ区切りで指定します。
 * @default 0,25,100
 *
 * @param HpColors
 * @desc 対応する閾値の割合以下のHPテキストカラーをシステムカラーのIDで指定します。
 * @default 18,17,0
 *
 * @param MpThresholds
 * @desc テキストカラーを変更するMP割合の閾値をカンマ区切りで指定します。
 * @default 100
 *
 * @param MpColors
 * @desc 対応する閾値の割合以下のMPテキストカラーをシステムカラーのIDで指定します。
 * @default 0
 *
 * @param TpThresholds
 * @desc テキストカラーを変更するTP割合の閾値をカンマ区切りで指定します。
 * @default 100
 *
 * @param TpColors
 * @desc 対応する閾値の割合以下のTPテキストカラーをシステムカラーのIDで指定します。
 * @default 0
 *
 * @help HP、MPおよびTPの数値をウィンドウに表示する際に
 * 残量によって表示色を変更することができます。
 *
 * 値は10%単位で指定可能です。
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
    var pluginName = 'ParamTextColorChanger';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamArrayString = function(paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getParamArrayNumber = function(paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) {
            if (!isNaN(parseInt(values[i], 10))) {
                values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
            } else {
                values.splice(i--, 1);
            }
        }
        return values;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramHpThresholds = getParamArrayNumber(['HpThresholds', 'HP閾値配列']);
    var paramHpColors     = getParamArrayNumber(['HpColors', 'HPカラー配列']);
    var paramMpThresholds = getParamArrayNumber(['MpThresholds', 'MP閾値配列']);
    var paramMpColors     = getParamArrayNumber(['MpColors', 'MPカラー配列']);
    var paramTpThresholds = getParamArrayNumber(['TpThresholds', 'TP閾値配列']);
    var paramTpColors     = getParamArrayNumber(['TpColors', 'TPカラー配列']);

    //=============================================================================
    // Window_Base
    //  テキストカラーを変更します。
    //=============================================================================
    var _Window_Base_hpColor      = Window_Base.prototype.hpColor;
    Window_Base.prototype.hpColor = function(actor) {
        for (var i = 0, n = paramHpThresholds.length; i < n; i++) {
            if (actor.hpRate() <= paramHpThresholds[i] / 100) {
                return this.textColor(paramHpColors[i]);
            }
        }
        return _Window_Base_hpColor.apply(this, arguments);
    };

    var _Window_Base_mpColor      = Window_Base.prototype.mpColor;
    Window_Base.prototype.mpColor = function(actor) {
        for (var i = 0, n = paramMpThresholds.length; i < n; i++) {
            if (actor.mpRate() <= paramMpThresholds[i] / 100) {
                return this.textColor(paramMpColors[i]);
            }
        }
        return _Window_Base_mpColor.apply(this, arguments);
    };

    var _Window_Base_tpColor      = Window_Base.prototype.tpColor;
    Window_Base.prototype.tpColor = function(actor) {
        for (var i = 0, n = paramTpThresholds.length; i < n; i++) {
            if (actor.tpRate() <= paramTpThresholds[i] / 100) {
                return this.textColor(paramTpColors[i]);
            }
        }
        return _Window_Base_tpColor.apply(this, arguments);
    };
})();

