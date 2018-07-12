//=============================================================================
// EventItemCondition.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2018/07/13 パラメータの型指定機能に対応。条件を満たしたアイテムの文字色を変える機能を追加
// 1.1.1 2017/05/04 1.1.0で<EICScript:s>タグが正しく機能しない場合がある問題を修正
// 1.1.0 2017/05/04 ウィンドウを表示中にリフレッシュする機能を追加
// 1.0.1 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.0.0 2016/09/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc EventItemConditionPlugin
 * @author triacontane
 *
 * @param DefaultVisible
 * @desc メモ欄が指定されていないアイテムの表示可否です。OFFにするとメモ欄に指定がないアイテムは表示されません。
 * @default true
 * @type boolean
 *
 * @param RefreshSwitchId
 * @desc 指定したIDのスイッチがONになるとウィンドウを再描画します。描画後、スイッチは自動でOFFになります。
 * @default 0
 * @type switch
 *
 * @param TextColor
 * @text テキストカラー番号
 * @desc 指定すると条件を満たしたときに文字色が変化します。(条件を満たさないときは通常表示となります)
 * @default 0
 * @type number
 * @min 0
 * @max 20
 *
 * @help イベントコマンド「アイテム選択の処理」において
 * 表示可否の条件をアイテムごとに設定できます。
 * 対象アイテムのメモ欄に以下の通り設定してください。
 *
 * <EICSwitch:1>     # スイッチ[1]がONのときのみ表示対象
 * <EICScript:s>     # 評価結果がtrueのときのみ表示
 * スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例：<EICスクリプト:\v[1] &gt; 10> // 変数[1]が10より大きい場合
 *
 * 「条件を満たさないアイテムを非表示」ではなく
 * 「条件を満たしたアイテムの文字色を変える」仕様にもできます。
 * その場合は、パラメータ「テキストカラー番号」を指定してください。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc アイテム選択の表示条件プラグイン
 * @author トリアコンタン
 *
 * @param DefaultVisible
 * @text デフォルト表示可否
 * @desc メモ欄が指定されていないアイテムの表示可否です。OFFにするとメモ欄に指定がないアイテムは表示されません。
 * @default true
 * @type boolean
 *
 * @param RefreshSwitchId
 * @text 再描画スイッチID
 * @desc 指定したIDのスイッチがONになるとウィンドウを再描画します。描画後、スイッチは自動でOFFになります。
 * @default 0
 * @type switch
 *
 * @param TextColor
 * @text テキストカラー番号
 * @desc 指定すると条件を満たしたときに文字色が変化します。(条件を満たさないときは通常表示となります)
 * @default 0
 * @type number
 * @min 0
 * @max 20
 *
 * @help イベントコマンド「アイテム選択の処理」において
 * 表示可否の条件をアイテムごとに設定できます。
 * 対象アイテムのメモ欄に以下の通り設定してください。
 *
 * <EICスイッチ:1>   # スイッチ[1]がONのときのみ表示対象
 * <EICSwitch:1>     # 同上
 * <EICスクリプト:s> # 評価結果がtrueのときのみ表示
 * <EICScript:s>     # 同上
 * スクリプト中で不等号を使いたい場合、以下のように記述してください。
 * < → &lt;
 * > → &gt;
 * 例：<EICスクリプト:\v[1] &gt; 10> // 変数[1]が10より大きい場合
 *
 * 「条件を満たさないアイテムを非表示」ではなく
 * 「条件を満たしたアイテムの文字色を変える」仕様にもできます。
 * その場合は、パラメータ「テキストカラー番号」を指定してください。
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
    var metaTagPrefix = 'EIC';

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null || text === true) text = '';
        text            = text.replace(/&gt;?/gi, '>');
        text            = text.replace(/&lt;?/gi, '<');
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
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

    var param = createPluginParameter('EventItemCondition');

    //=============================================================================
    // Window_EventItem
    //  アイテム選択ウィンドウに条件を設定します。
    //=============================================================================
    var _Window_EventItem_includes      = Window_EventItem.prototype.includes;
    Window_EventItem.prototype.includes = function(item) {
        var result = _Window_EventItem_includes.apply(this, arguments);
        if (result && !param.TextColor) {
            this._existCondition = false;
            result = this.isOkEventItem(item);
            if (!this._existCondition) {
                result = param.DefaultVisible;
            }
        }
        return result;
    };

    Window_EventItem.prototype.isOkEventItem = function(item) {
        return this.isOkEventItemSwitch(item) && this.isOkEventItemScript(item);
    };

    Window_EventItem.prototype.isOkEventItemSwitch = function(item) {
        var metaValue = getMetaValues(item, ['スイッチ', 'Switch']);
        if (metaValue) {
            this._existCondition = true;
            return $gameSwitches.value(getArgNumber(metaValue, 1));
        }
        return true;
    };

    Window_EventItem.prototype.isOkEventItemScript = function(item) {
        var metaValue = getMetaValues(item, ['スクリプト', 'Script']);
        if (metaValue) {
            this._existCondition = true;
            return eval(getArgString(metaValue));
        }
        return true;
    };

    var _Window_EventItem_update      = Window_EventItem.prototype.update;
    Window_EventItem.prototype.update = function() {
        _Window_EventItem_update.apply(this, arguments);
        this.updateAutoRefresh();
    };

    Window_EventItem.prototype.updateAutoRefresh = function() {
        if ($gameSwitches.value(param.RefreshSwitchId) && this.openness === 255) {
            $gameSwitches.setValue(param.RefreshSwitchId, false);
            this.refresh();
            this.select(0);
        }
    };

    var _Window_EventItem_drawItemName = Window_EventItem.prototype.drawItemName;
    Window_EventItem.prototype.drawItemName = function(item, x, y, width) {
        this._existCondition = false;
        var needChange = param.TextColor > 0 && this.isOkEventItem(item) && this._existCondition;
        if (needChange) {
            this.changeTextColor(this.textColor(param.TextColor));
            this._textColorResetDiaabled = true;
        }
        _Window_EventItem_drawItemName.apply(this, arguments);
        if (needChange) {
            this._textColorResetDiaabled = false;
            this.resetTextColor();
        }
    };

    var _Window_EventItem_resetTextColor = Window_EventItem.prototype.resetTextColor;
    Window_EventItem.prototype.resetTextColor = function() {
        if (this._textColorResetDiaabled) {
            return;
        }
        _Window_EventItem_resetTextColor.apply(this, arguments);
    };
})();

