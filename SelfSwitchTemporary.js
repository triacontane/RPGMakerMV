//=============================================================================
// SelfSwitchTemporary.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/04/26 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SelfSwitchTemporaryPlugin
 * @author triacontane
 *
 * @help 場所移動時に自働で初期化される一時セルフスイッチを定義できます。
 * イベントのメモ欄に以下の通り記入してください。
 *
 * <SST_Switch:A> # 移動時にセルフスイッチ「A」を解除
 * <SST_Switch>   # 移動時にセルフスイッチを全て解除
 *
 * セルフスイッチの解除は、当該マップに入り直した段階で行われます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 一時セルフスイッチプラグイン
 * @author トリアコンタン
 *
 * @help 場所移動時に自働で初期化される一時セルフスイッチを定義できます。
 * イベントのメモ欄に以下の通り記入してください。
 *
 * <SST_スイッチ:A,B> # 移動時にセルフスイッチ「A」「B」を解除
 * <SST_Switch:A,B>   # 同上
 * <SST_スイッチ>     # 移動時にセルフスイッチを全て解除
 * <SST_Switch>       # 同上
 *
 * セルフスイッチの解除は、当該マップに入り直した段階で行われます。
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
    var metaTagPrefix = 'SST_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var getArgArrayString = function(args) {
        var values = args.split(',');
        for (var i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) return text;
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // Game_Map
    //  セットアップ時に一時セルフスイッチを解除します。
    //=============================================================================
    var _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        _Game_Map_setupEvents.apply(this, arguments);
        this.events().forEach(function(event) {
            event.clearTemporarySelfSwitchIfNeed();
        });
    };

    //=============================================================================
    // Game_Event
    //  セットアップ時に一時セルフスイッチを解除します。
    //=============================================================================
    Game_Event.prototype.clearTemporarySelfSwitchIfNeed = function() {
        var selfSwitchTypes = getMetaValues(this.event(), ['Switch', 'スイッチ']);
        if (!selfSwitchTypes) return;
        this.clearTemporarySelfSwitch(selfSwitchTypes === true ? ['A', 'B', 'C', 'D'] : getArgArrayString(selfSwitchTypes));
    };

    Game_Event.prototype.clearTemporarySelfSwitch = function(selfSwitchTypes) {
        var mapId = $gameMap.mapId();
        var eventId = this.eventId();
        selfSwitchTypes.forEach(function(selfSwitchType) {
            $gameSelfSwitches.setValue([mapId, eventId, selfSwitchType.toUpperCase()], false);
        });
    };
})();

