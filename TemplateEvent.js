//=============================================================================
// TemplateEvent.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.2 2017/06/03 固有イベントのグラフィックで上書きした場合は、オプションと向き、パターンも固有イベントで上書きするよう変更
// 1.1.1 2017/05/25 場所移動直後にアニメパターンが一瞬だけ初期化されてしまう問題を修正
// 1.1.0 2017/04/22 テンプレートイベントIDに変数の値を指摘できる機能を追加
// 1.0.2 2017/04/09 イベント生成系のプラグインで発生する可能性のある競合を解消
// 1.0.1 2016/06/28 固有イベントのページ数がテンプレートイベントのページ数より少ない場合に発生するエラーを修正
// 1.0.0 2016/06/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Template Event Plugin
 * @author triacontane
 *
 * @param TemplateMapId
 * @desc テンプレートイベントが存在するマップIDです。
 * @default 1
 *
 * @param KeepEventId
 * @desc マップイベントを呼び出す際に、呼び出し元のイベントIDを維持します。対象を「このイベント」にした際の挙動が変わります。
 * @default OFF
 *
 * @param ReplaceGraphic
 * @desc 固有イベントにグラフィックが指定されていた場合でも、無視してテンプレートイベントのグラフィフィックに置換します。
 * @default OFF
 *
 * @help 汎用的に使用するイベントをテンプレート化できます。
 * テンプレートイベントは、専用に用意したマップに定義してください。
 * 実際のイベントのメモ欄に所定の記述をするだけで、テンプレートイベントと
 * 動的に置き換えることができます。
 *
 * イベント初期配置以外の全項目はテンプレートイベントの設定に置き換わりますが
 * グラフィックを指定していた場合、置き換え元のグラフィックを維持します。
 *
 * また、テンプレートイベントから置き換え元のイベントを呼び出すことができます。
 * 宝箱や場所移動イベント等、一部だけ固有の処理をしたい場合に有効です。
 * 外観や共通部分のイベント処理をテンプレートイベントに記述し、
 * アイテム入手や場所移動先指定など固有部分だけを元のイベントに記述します。
 *
 * さらに、任意のマップイベントをコモンイベントのように呼び出す機能も
 * 提供します。IDおよびイベント名で呼び出すイベントを指定可能です。
 *
 * 利用手順
 * 1.テンプレートマップを作成して、テンプレートイベントを配置します。
 *
 * 2.テンプレートイベントに置き換えたいイベントのメモ欄を記述します。
 *   IDとイベント名の双方が指定可能です。
 * <TE:1>     テンプレートマップのID[1]のイベントに置き換わります。
 * <TE:aaa>   テンプレートマップのイベント名[aaa]のイベントに置き換わります。
 * <TE:\v[1]> テンプレートマップのID[変数[1]の値]のイベントに置き換わります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * TE固有イベント呼び出し [ページ番号]
 * TE_CALL_ORIGIN_EVENT [ページ番号]
 *  置き換え元のイベント処理を呼び出します。処理完了後、元の処理に戻ります。
 *  ページ番号を省略すると、実行中のページ番号がそのまま適用されます。
 *  テンプレートイベントに記述した場合のみ有効です。
 *
 *  例1:置き換え元イベントの1ページ目を呼び出します。
 *  TE固有イベント呼び出し 1
 *
 * TEマップイベント呼び出し [イベントID] [ページ番号]
 * TE_CALL_MAP_EVENT [イベントID] [ページ番号]
 *  同一マップ内の別のイベント処理を呼び出します。処理完了後、元の処理に戻ります。
 *  イベントIDに数値以外を指定すると、イベント名として扱われ
 *  イベント名が一致するイベントの処理を呼び出します。
 *  テンプレートイベントに記述した場合以外でも有効です。
 *
 *  例1:ID[5]のイベントの1ページ目を呼び出します。
 *  TEマップイベント呼び出し 5 1
 *
 *  例2:[aaa]という名前のイベントの1ページ目を呼び出します。
 *  TEマップイベント呼び出し aaa 1
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc テンプレートイベントプラグイン
 * @author トリアコンタン
 *
 * @param テンプレートマップID
 * @desc テンプレートイベントが存在するマップIDです。
 * @default 1
 *
 * @param イベントIDを維持
 * @desc マップイベントを呼び出す際に、呼び出し元のイベントIDを維持します。対象を「このイベント」にした際の挙動が変わります。
 * @default OFF
 *
 * @param グラフィック置換
 * @desc 固有イベントにグラフィックが指定されていた場合でも、無視してテンプレートイベントのグラフィフィックに置換します。
 * @default OFF
 *
 * @help 汎用的に使用するイベントをテンプレート化できます。
 * テンプレートイベントは、専用に用意したマップに定義してください。
 * 実際のイベントのメモ欄に所定の記述をするだけで、テンプレートイベントと
 * 動的に置き換えることができます。
 *
 * イベント初期配置以外の全項目はテンプレートイベントの設定に置き換わりますが
 * グラフィックを指定していた場合、置き換え元のグラフィックを維持します。
 *
 * また、テンプレートイベントから置き換え元のイベントを呼び出すことができます。
 * 宝箱や場所移動イベント等、一部だけ固有の処理をしたい場合に有効です。
 * 外観や共通部分のイベント処理をテンプレートイベントに記述し、
 * アイテム入手や場所移動先指定など固有部分だけを元のイベントに記述します。
 *
 * さらに、任意のマップイベントをコモンイベントのように呼び出す機能も
 * 提供します。IDおよびイベント名で呼び出すイベントを指定可能です。
 *
 * 利用手順
 * 1.テンプレートマップを作成して、テンプレートイベントを配置します。
 *
 * 2.テンプレートイベントに置き換えたいイベントのメモ欄を記述します。
 *   IDとイベント名の双方が指定可能です。
 * <TE:1>   テンプレートマップのID[1]のイベントに置き換わります。
 * <TE:aaa> テンプレートマップのイベント名[aaa]のイベントに置き換わります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * TE固有イベント呼び出し [ページ番号]
 * TE_CALL_ORIGIN_EVENT [ページ番号]
 *  置き換え元のイベント処理を呼び出します。処理完了後、元の処理に戻ります。
 *  ページ番号を省略すると、実行中のページ番号がそのまま適用されます。
 *  テンプレートイベントに記述した場合のみ有効です。
 *
 *  例1:置き換え元イベントの1ページ目を呼び出します。
 *  TE固有イベント呼び出し 1
 *
 * TEマップイベント呼び出し [イベントID] [ページ番号]
 * TE_CALL_MAP_EVENT [イベントID] [ページ番号]
 *  同一マップ内の別のイベント処理を呼び出します。処理完了後、元の処理に戻ります。
 *  イベントIDに数値以外を指定すると、イベント名として扱われ
 *  イベント名が一致するイベントの処理を呼び出します。
 *  テンプレートイベントに記述した場合以外でも有効です。
 *  
 *  例1:ID[5]のイベントの1ページ目を呼び出します。
 *  TEマップイベント呼び出し 5 1
 *
 *  例2:[aaa]という名前のイベントの1ページ目を呼び出します。
 *  TEマップイベント呼び出し aaa 1
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var $dataTemplateEvents = null;

(function() {
    'use strict';
    var pluginName    = 'TemplateEvent';
    var metaTagPrefix = 'TE';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!object) return undefined;
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
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

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameActors.actor(parseInt(arguments[1])) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameParty.members()[parseInt(arguments[1]) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramTemplateMapId  = getParamNumber(['TemplateMapId', 'テンプレートマップID']);
    var paramKeepEventId    = getParamBoolean(['KeepEventId', 'イベントIDを維持']);
    var paramReplaceGraphic = getParamBoolean(['ReplaceGraphic', 'グラフィック置換']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix))) return;
        try {
            this.pluginCommandTemplateEvent(command.replace(metaTagPrefix, ''), args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.stack || e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandTemplateEvent = function(command, args) {
        switch (getCommandName(command)) {
            case '固有イベント呼び出し' :
            case '_CALL_ORIGIN_EVENT' :
                this.callOriginEvent(getArgNumber(args[0]));
                break;
            case 'マップイベント呼び出し' :
            case '_CALL_MAP_EVENT' :
                var pageIndex = getArgNumber(args[1], 1);
                var eventId   = getArgNumber(args[0]);
                if ($gameMap.event(eventId)) {
                    this.callMapEventById(pageIndex, eventId);
                } else {
                    var eventName = getArgString(args[0]);
                    if (eventName) {
                        this.callMapEventByName(pageIndex, eventName);
                    } else {
                        this.callMapEventById(pageIndex, this._eventId);
                    }
                }
                break;
        }
    };

    Game_Interpreter.prototype.callOriginEvent = function(pageIndex) {
        var event = $gameMap.event(this._eventId);
        if (event && event.hasTemplate()) {
            this.setupAnotherList(null, event.getOriginalPages(), pageIndex);
        }
    };

    Game_Interpreter.prototype.callMapEventById = function(pageIndex, eventId) {
        var event = $gameMap.event(eventId);
        if (event) {
            this.setupAnotherList(paramKeepEventId ? null : eventId, event.getPages(), pageIndex);
        }
    };

    Game_Interpreter.prototype.callMapEventByName = function(pageIndex, eventName) {
        var event = DataManager.searchDataItem($dataMap.events, 'name', eventName);
        if (event) {
            this.setupAnotherList(paramKeepEventId ? null : event.id, event.pages, pageIndex);
        }
    };

    Game_Interpreter.prototype.setupAnotherList = function(eventId, pages, pageIndex) {
        var page = pages[pageIndex - 1 || this._pageIndex] || pages[0];
        if (!eventId) eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(page.list, eventId);
    };

    //=============================================================================
    // Game_Event
    //  テンプレートイベントマップをロードしてグローバル変数に保持します。
    //=============================================================================
    var _Game_Event_initialize      = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        var event = $dataMap.events[eventId];
        this.setTemplate(event);
        _Game_Event_initialize.apply(this, arguments);
        if (this.hasTemplate()) {
            this.setPosition(event.x, event.y);
            this.refreshBushDepth();
        }
    };

    var _Game_Event_setupPageSettings      = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        _Game_Event_setupPageSettings.apply(this, arguments);
        if (this.hasTemplate()) {
            this.setupPageSettingsForTemplate();
        }
    };

    Game_Event.prototype.setupPageSettingsForTemplate = function() {
        var page  = this.getOriginalPages()[this._pageIndex];
        if (!page) return;
        if (this.isOverrideGraphic()) {
            var image = page.image;
            if (image.tileId > 0) {
                this.setTileImage(image.tileId);
            } else if (image.characterName) {
                this.setupPageOptions(page);
                this.setupPageImage(image);
            }
        }
    };

    Game_Event.prototype.isOverrideGraphic = function() {
        return !paramReplaceGraphic;
    };

    Game_Event.prototype.setupPageOptions = function(page) {
        this.setWalkAnime(page.walkAnime);
        this.setStepAnime(page.stepAnime);
        this.setDirectionFix(page.directionFix);
        this.setThrough(page.through);
    };

    Game_Event.prototype.setupPageImage = function(image) {
        this.setImage(image.characterName, image.characterIndex);
        this.setDirection(image.direction);
        this.setPattern(image.pattern);
    };

    Game_Event.prototype.setTemplate = function(event) {
        var value = getMetaValues(event, '');
        if (value) {
            var templateId = getArgNumber(value, 0, $dataTemplateEvents.length - 1);
            if (!templateId) {
                var template = DataManager.searchDataItem($dataTemplateEvents, 'name', value);
                if (template) templateId = template.id;
            }
            this._templateId = templateId;
        } else {
            this._templateId = 0;
        }
    };

    Game_Event.prototype.hasTemplate = function() {
        return this._templateId > 0;
    };

    var _Game_Event_event      = Game_Event.prototype.event;
    Game_Event.prototype.event = function() {
        return this.hasTemplate() ? $dataTemplateEvents[this._templateId] : _Game_Event_event.apply(this, arguments);
    };

    Game_Event.prototype.getOriginalPages = function() {
        return $dataMap.events[this._eventId].pages;
    };

    Game_Event.prototype.getPages = function() {
        return this.event().pages;
    };

    //=============================================================================
    // DataManager
    //  データ検索用の共通処理です。
    //=============================================================================
    if (!DataManager.searchDataItem) {
        DataManager.searchDataItem = function(dataArray, columnName, columnValue) {
            var result = 0;
            dataArray.some(function(dataItem) {
                if (dataItem && dataItem[columnName] === columnValue) {
                    result = dataItem;
                    return true;
                }
                return false;
            });
            return result;
        };
    }

    //=============================================================================
    // Scene_Boot
    //  テンプレートイベントマップをロードしてグローバル変数に保持します。
    //=============================================================================
    var _Scene_Boot_create      = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _Scene_Boot_create.apply(this, arguments);
        DataManager.loadMapData(paramTemplateMapId);
    };

    var _Scene_Boot_isReady      = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        if (!this._mapLoaded && DataManager.isMapLoaded()) {
            this.onTemplateMapLoaded();
            this._mapLoaded = true;
        }
        return this._mapLoaded && _Scene_Boot_isReady.apply(this, arguments);
    };

    Scene_Boot.prototype.onTemplateMapLoaded = function() {
        $dataTemplateEvents = $dataMap.events;
        $dataMap            = undefined;
    };
})();

