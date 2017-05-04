//=============================================================================
// EventItemCondition.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @default ON
 *
 * @param RefreshSwitchId
 * @desc 指定したIDのスイッチがONになるとウィンドウを再描画します。描画後、スイッチは自動でOFFになります。
 * @default 0
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
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc アイテム選択の表示条件プラグイン
 * @author トリアコンタン
 *
 * @param デフォルト表示可否
 * @desc メモ欄が指定されていないアイテムの表示可否です。OFFにするとメモ欄に指定がないアイテムは表示されません。
 * @default ON
 *
 * @param 再描画スイッチID
 * @desc 指定したIDのスイッチがONになるとウィンドウを再描画します。描画後、スイッチは自動でOFFになります。
 * @default 0
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
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'EventItemCondition';
    var metaTagPrefix = 'EIC';

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

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON';
    };

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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramDefaultVisible  = getParamBoolean(['DefaultVisible', 'デフォルト表示可否']);
    var paramRefreshSwitchId = getParamNumber(['RefreshSwitchId', '再描画スイッチID'], 0);

    //=============================================================================
    // Window_EventItem
    //  アイテム選択ウィンドウに条件を設定します。
    //=============================================================================
    var _Window_EventItem_includes      = Window_EventItem.prototype.includes;
    Window_EventItem.prototype.includes = function(item) {
        var result = _Window_EventItem_includes.apply(this, arguments);
        if (result) {
            this._existCondition = false;
            result               = this.isOkEventItemSwitch(item) && this.isOkEventItemScript(item);
            if (!this._existCondition) result = paramDefaultVisible;
        }
        return result;
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
        if ($gameSwitches.value(paramRefreshSwitchId) && this.openness === 255) {
            $gameSwitches.setValue(paramRefreshSwitchId, false);
            this.refresh();
            this.select(0);
        }
    };
})();

