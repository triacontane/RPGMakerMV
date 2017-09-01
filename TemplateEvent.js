//=============================================================================
// TemplateEvent.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.7.1 2017/09/01 スクリプトヘルプの誤記を修正
// 1.7.0 2017/08/29 プラグインコマンドで制御文字\sv[n]が利用できる機能を追加
// 1.6.1 2017/08/26 セルフ変数に文字列が入っている場合でも出現条件の注釈が正しく動作するよう修正
// 1.6.0 2017/08/19 セルフ変数の一括操作のコマンドおよびセルフ変数を外部から操作するスクリプトを追加
// 1.5.1 2017/08/15 文章のスクロール表示でセルフ変数が正しく表示できていなかった問題を修正
// 1.5.0 2017/08/14 セルフ変数の操作を「移動ルートの設定」からも行えるよう修正
// 1.4.1 2017/07/21 SAN_MapGenerator.jsとの競合を解消
// 1.4.0 2017/07/16 セルフ変数機能を追加
// 1.3.0 2017/07/07 固有処理呼び出し中にテンプレートイベントのIDと名称を取得できるスクリプトを追加
// 1.2.0 2017/06/09 設定を固有イベントで上書きする機能を追加。それに伴い既存のパラメータ名称を一部変更
// 1.1.2 2017/06/03 固有イベントのグラフィックで上書きした場合は、オプションと向き、パターンも固有イベントで上書きするよう変更
// 1.1.1 2017/05/25 場所移動直後にアニメパターンが一瞬だけ初期化されてしまう問題を修正
// 1.1.0 2017/04/22 テンプレートイベントIDに変数の値を指定できる機能を追加
// 1.0.2 2017/04/09 イベント生成系のプラグインで発生する可能性のある競合を解消
// 1.0.1 2016/06/28 固有イベントのページ数がテンプレートイベントのページ数より少ない場合に発生するエラーを修正
// 1.0.0 2016/06/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Template Event Plugin
 * @author triacontane
 *
 * @param TemplateMapId
 * @desc The map ID where the template event resides.
 * @default 1
 * @type number
 *
 * @param KeepEventId
 * @desc Maintain the event ID of the caller when invoking the map event.
 * @default false
 * @type boolean
 *
 * @param NoOverride
 * @desc Even if a graphic is specified for a specific event, it will not overwrite the setting.
 * @default false
 * @type boolean
 *
 * @help TemplateEvent.js[Template Event Plugin]
 *
 * You can template commonly used events.
 * Please define the template event in the map prepared exclusively.
 * Just by writing a predetermined description in the note of the actual event,
 * It can be replaced dynamically.
 *
 * You can also call up the source event from the template event.
 * It is effective when you want to do some unique processing,
 * such as treasure boxes and place movement events.
 * Describe the appearance and event processing of the common part
 * in the template event,
 * We describe only the unique part such as item acquisition and
 * location destination designation in the original event.
 *
 * It also provides a function to call an arbitrary map event like a common event.
 * Events to be called can be specified by ID and event name.
 *
 * Procedure
 * 1.Create a template map and place a template event.
 *
 * 2.Write a memo field of the event you want to replace
 * with the template event. Both ID and event name can be specified.
 * <TE:1>   It is replaced with the event of ID [1] of the template map.
 * <TE:aaa> It is replaced with the event of event name [aaa] of the template map.
 * <TE:\v[1]> It is replaced with the event of ID of template map [value of variable [1]].
 *
 * In principle, all settings except initial placement will be replaced with
 * template event settings If you specify graphics as an exception and when you
 * write a memo field (* 1)
 * Priority is given to the settings of unique events for the following settings.
 * Image
 * Autonomous Movement
 * Options
 * Priority
 * Trigger
 *
 * *1 Write it in the memo field of the unique event as follows.
 * <TEOverRide>
 *
 * Plugin Command
 *
 * TE_CALL_ORIGIN_EVENT [PageIndex]
 *  Call up the event processing of the replacement source. After processing is completed,
 *  it returns to the original processing. If you omit the page number, the running page
 *  number is applied as it is. It is effective only when described in the template event.
 *
 *  ex
 *  TE_CALL_ORIGIN_EVENT 1
 *
 * TE_CALL_MAP_EVENT [EventId] [PageIndex]
 *  Call up another event processing in the same map. After processing is completed,
 *  it returns to the original processing. If you specify an event ID other than a numeric value,
 *  it calls processing of an event that is treated as an event name and whose event name matches.
 *  It is valid even if it is described in the template event.
 *
 *  ex1
 *  TE_CALL_MAP_EVENT 5 1
 *
 *  ex2
 *  TE_CALL_MAP_EVENT aaa 1
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
 * @type number
 *
 * @param イベントIDを維持
 * @desc マップイベントを呼び出す際に、呼び出し元のイベントIDを維持します。対象を「このイベント」にした際の挙動が変わります。
 * @default false
 * @type boolean
 *
 * @param 上書き禁止
 * @desc 固有イベントにグラフィックが指定されていた場合でも、設定の上書きを行いません。
 * @default false
 * @type boolean
 *
 * @help TemplateEvent.js[テンプレートイベントプラグイン]
 *
 * 汎用的に使用するイベントをテンプレート化できます。
 * テンプレートイベントは、専用に用意したマップに定義してください。
 * 実際のイベントのメモ欄に所定の記述をするだけで、テンプレートイベントと
 * 動的に置き換えることができます。
 *
 * またテンプレートイベントから置き換え元のイベントを呼び出すことができます。
 * 宝箱や場所移動イベント等、一部だけ固有の処理をしたい場合に有効です。
 * 外観や共通部分のイベント処理をテンプレートイベントに記述し、
 * アイテム入手や場所移動先指定など固有部分だけを元のイベントに記述します。
 *
 * 任意のマップイベントをコモンイベントのように呼び出す機能も提供します。
 * IDおよびイベント名で呼び出すイベントを指定可能です。
 *
 * 利用手順
 * 1.テンプレートマップを作成して、テンプレートイベントを配置します。
 *
 * 2.テンプレートイベントに置き換えたいイベントのメモ欄を記述します。
 *   IDとイベント名の双方が指定可能です。
 * <TE:1>   テンプレートマップのID[1]のイベントに置き換わります。
 * <TE:aaa> テンプレートマップのイベント名[aaa]のイベントに置き換わります。
 * <TE:\v[1]> テンプレートマップのID[変数[1]の値]のイベントに置き換わります。
 *
 * 原則、初期配置以外の全設定はテンプレートイベントの設定に置き換わりますが
 * 例外としてグラフィックを指定していた場合とメモ欄(※1)を記述した場合は
 * 以下の設定について固有イベントの設定を優先します。
 * ・画像
 * ・自律移動
 * ・オプション
 * ・プライオリティ
 * ・トリガー
 *
 * ※1 固有イベントのメモ欄に以下の通り記述します。
 * <TE上書き>
 * <TEOverRide>
 *
 * ・セルフ変数機能
 * イベントに対してセルフ変数（そのイベント専用の変数）を定義できます。
 * プラグインコマンドから操作し、文章の表示やイベント出現条件として使用可能です。
 *
 * 「文章の表示」で使用する場合
 * 制御文字「\sv[n](n:インデックス)」で表示できます。
 *
 * 「イベント出現条件」で使用する場合
 * 対象ページのイベントコマンドの先頭を「注釈」にして
 * 以下の書式で条件を指定してください。複数指定も可能です。
 *
 * \TE{条件}
 *
 * 条件はJavaScriptとしてで記述し、制御文字が使用可能です。
 * 指定例：
 * \TE{\sv[1] >= 3}      # セルフ変数[1]が3以上の場合
 * \TE{\sv[2] === \v[1]} # セルフ変数[2]が変数[1]と等しい場合
 * \TE{\sv[3] === 'AAA'} # セルフ変数[3]が'AAA'と等しい場合
 *
 * 「条件分岐」などのスクリプトで使用する場合
 * 以下のスクリプトで指定したインデックスのセルフ変数が取得できます。
 * this.getSelfVariable(n)
 * 指定例：
 * this.getSelfVariable(1) !== 0 # セルフ変数[1]が3以上の場合
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
 *  同一マップ内の別イベント処理を呼び出します。処理完了後、元の処理に戻ります。
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
 * TEセルフ変数の操作 [インデックス] [操作種別] [オペランド]
 * TE_SET_SELF_VARIABLE [インデックス] [操作種別] [オペランド]
 *  セルフ変数を操作します。
 *  インデックス : 操作対象のセルフ変数のインデックスです。1以上の数値を指定
 *  操作種別     : 操作種別です。以下の通り指定してください。
 *   0 : 代入
 *   1 : 加算
 *   2 : 減算
 *   3 : 乗算
 *   4 : 除算
 *   5 : 剰余
 *  オペランド   : 設定値です。数値を指定してください。
 * ※セルフ変数に数値以外を設定したい場合は、スクリプトで指定してください。
 *
 *  例1:インデックス[1]のセルフ変数に値[100]を代入します。
 *  TE_SET_SELF_VARIABLE 1 0 100
 *
 *  例2:インデックス[3]のセルフ変数から値[50]を減算します。
 *  TE_SET_SELF_VARIABLE 3 2 50
 *
 *  例2:インデックス[5]のセルフ変数に値[セルフ変数[1]の値]を加算します。
 *  TE_SET_SELF_VARIABLE 5 1 \sv[1]
 *
 * TEセルフ変数の一括操作 [開始INDEX] [終了INDEX] [操作種別] [オペランド]
 * TE_SET_RANGE_SELF_VARIABLE [開始INDEX] [終了INDEX] [操作種別] [オペランド]
 *  セルフ変数を一括操作します。
 *
 * 本プラグインのすべてのプラグインコマンドで制御文字\sv[n]を使用できます。
 *
 * ・スクリプト（イベントコマンドのスクリプト、変数の操作から実行）
 * 固有処理呼び出し中にテンプレートイベントのIDと名称を取得します。
 *  this.character(0).getTemplateId();
 *  this.character(0).getTemplateName();
 *
 * 指定したインデックスのセルフ変数を取得します。
 *  this.getSelfVariable(index);
 *
 * セルフ変数に値を設定します。
 * このスクリプトは「移動ルートの設定」でも実行できます。
 * formulaFlgをtrueに設定すると、operandを計算式として評価します。
 *  this.controlSelfVariable(index, type, operand, formulaFlg);
 *
 * セルフ変数に値を一括設定します。
 * このスクリプトは「移動ルートの設定」でも実行できます。
 *  this.controlSelfVariableRange(start, end, type, operand, formulaFlg);
 *
 * 外部のイベントのセルフ変数を操作します。
 *  $gameSelfSwitches.setVariableValue([マップID, イベントID, INDEX], 設定値);
 *
 * 外部のイベントのセルフ変数を取得します。
 *  $gameSelfSwitches.getVariableValue([マップID, イベントID, INDEX]);
 *
 * SAN_MapGenerator.jsと組み合わせる場合
 * このプラグインをSAN_MapGenerator.jsより下に定義してください。
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

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON' || (value || '').toUpperCase() === 'TRUE';
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

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
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

    var isExistPlugin = function(pluginName) {
        return Object.keys(PluginManager.parameters(pluginName)).length > 0
    };

    var convertAllArguments = function(args) {
        return args.map(function(arg) {
            return convertEscapeCharacters(arg);
        })
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    var pluginCommandMap = new Map();
    setPluginCommand('固有イベント呼び出し', 'execCallOriginEvent');
    setPluginCommand('_CALL_ORIGIN_EVENT', 'execCallOriginEvent');
    setPluginCommand('マップイベント呼び出し', 'execCallMapEvent');
    setPluginCommand('_CALL_MAP_EVENT', 'execCallMapEvent');
    setPluginCommand('セルフ変数の操作', 'execControlSelfVariable');
    setPluginCommand('_SET_SELF_VARIABLE', 'execControlSelfVariable');
    setPluginCommand('セルフ変数の一括操作', 'execControlSelfVariableRange');
    setPluginCommand('_SET_RANGE_SELF_VARIABLE', 'execControlSelfVariableRange');

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramTemplateMapId = getParamNumber(['TemplateMapId', 'テンプレートマップID'], 1);
    var paramKeepEventId   = getParamBoolean(['KeepEventId', 'イベントIDを維持']);
    var paramNoOverride    = getParamBoolean(['NoOverride', '上書き禁止']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_command101      = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setEventId(this._eventId);
        }
        return _Game_Interpreter_command101.apply(this, arguments);
    };

    var _Game_Interpreter_command105      = Game_Interpreter.prototype.command105;
    Game_Interpreter.prototype.command105 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setEventId(this._eventId);
        }
        return _Game_Interpreter_command105.apply(this, arguments);
    };

    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](this.convertAllSelfVariables(convertAllArguments(args)));
        }
    };

    Game_Interpreter.prototype.execCallOriginEvent = function(args) {
        this.callOriginEvent(getArgNumber(args[0]));
    };

    Game_Interpreter.prototype.execCallMapEvent = function(args) {
        var pageIndex = getArgNumber(args[1], 1);
        var eventId   = getArgNumber(args[0]);
        if ($gameMap.event(eventId)) {
            this.callMapEventById(pageIndex, eventId);
        } else if (args[0] !== '') {
            this.callMapEventByName(pageIndex, args[0]);
        } else {
            this.callMapEventById(pageIndex, this._eventId);
        }
    };

    Game_Interpreter.prototype.execControlSelfVariable = function(args) {
        var selfIndex   = getArgNumber(args[0], 0);
        var controlType = getArgNumber(args[1], 0, 5);
        var operand     = isNaN(Number(args[2])) ? args[2] : getArgNumber(args[2]);
        this.controlSelfVariable(selfIndex, controlType, operand, false);
    };

    Game_Interpreter.prototype.execControlSelfVariableRange = function(args) {
        var selfStartIndex = getArgNumber(args[0], 0);
        var selfEndIndex   = getArgNumber(args[1], 0);
        var controlType    = getArgNumber(args[2], 0, 5);
        var operand        = isNaN(Number(args[3])) ? args[3] : getArgNumber(args[3]);
        this.controlSelfVariableRange(selfStartIndex, selfEndIndex, controlType, operand, false);
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

    Game_Interpreter.prototype.controlSelfVariable = function(index, type, operand, formulaFlg) {
        var character = this.character(0);
        if (character) {
            character.controlSelfVariable(index, type, operand, formulaFlg);
        }
    };

    Game_Interpreter.prototype.controlSelfVariableRange = function(startIndex, endIndex, type, operand, formulaFlg) {
        var character = this.character(0);
        if (character) {
            character.controlSelfVariableRange(startIndex, endIndex, type, operand, formulaFlg);
        }
    };

    Game_Interpreter.prototype.getSelfVariable = function(selfVariableIndex) {
        var character = this.character(0);
        return character ? character.getSelfVariable(selfVariableIndex) : 0;
    };

    Game_Interpreter.prototype.convertAllSelfVariables = function(args) {
        return args.map(function(arg) {
            return $gameSelfSwitches.convertSelfVariableCharacter(this._eventId, arg, false);
        }, this);
    };

    //=============================================================================
    // Game_Message
    //  メッセージ表示中のイベントIDを保持します。
    //=============================================================================
    var _Game_Message_clear      = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.apply(this, arguments);
        this._eventId = 0;
    };

    Game_Message.prototype.setEventId = function(id) {
        this._eventId = id;
    };

    Game_Message.prototype.getEventId = function() {
        return this._eventId;
    };

    //=============================================================================
    // Game_System
    //  ロード完了時に必要ならセルフ変数を初期化します。
    //=============================================================================
    var _Game_System_onAfterLoad      = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        $gameSelfSwitches.clearVariableIfNeed();
    };

    //=============================================================================
    // Game_SelfSwitches
    //  セルフ変数を追加します。
    //=============================================================================
    var _Game_SelfSwitches_initialize      = Game_SelfSwitches.prototype.initialize;
    Game_SelfSwitches.prototype.initialize = function() {
        _Game_SelfSwitches_initialize.apply(this, arguments);
        this.clearVariable();
    };

    Game_SelfSwitches.prototype.clearVariable = function() {
        this._variableData = {};
    };

    Game_SelfSwitches.prototype.clearVariableIfNeed = function() {
        if (!this._variableData) {
            this.clearVariable();
        }
    };

    Game_SelfSwitches.prototype.getVariableValue = function(key) {
        return this._variableData.hasOwnProperty(key) ? this._variableData[key] : 0;
    };

    Game_SelfSwitches.prototype.setVariableValue = function(key, value) {
        if (this._variableData[key] === value) {
            return;
        }
        if (value !== undefined && value !== 0) {
            this._variableData[key] = value;
        } else {
            delete this._variableData[key];
        }
        this.onChange();
    };

    Game_SelfSwitches.prototype.makeSelfVariableKey = function(eventId, index) {
        return eventId > 0 ? [$gameMap.mapId(), eventId, index] : null;
    };

    Game_SelfSwitches.prototype.convertSelfVariableCharacter = function(eventId, text, scriptFlag) {
        text = text.replace(/\x1bSV\[(\d+)\]/gi, function() {
            var key   = this.makeSelfVariableKey(eventId, parseInt(arguments[1]));
            var value = this.getVariableValue(key);
            return isNotAString(value) || !scriptFlag ? value : '\'' + value + '\'';
        }.bind(this));
        return text;
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
        if (this.hasTemplate() && this.isOverrideProperty()) {
            this._needOriginalPage = true;
        }
        _Game_Event_setupPageSettings.apply(this, arguments);
        this._needOriginalPage = false;
    };

    var _Game_Event_page      = Game_Event.prototype.page;
    Game_Event.prototype.page = function() {
        return this._needOriginalPage ? this.getOriginalPage() : _Game_Event_page.apply(this, arguments);
    };

    Game_Event.prototype.isOverrideProperty = function() {
        var page = this.getOriginalPage();
        if (!page) return false;
        return (!paramNoOverride && (page.image.tileId > 0 || page.image.characterName)) || this._override;
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
            this._override   = !!getMetaValues(event, ['OverRide', '上書き']);
        } else {
            this._templateId = 0;
            this._override   = false;
        }
    };

    Game_Event.prototype.getTemplateId = function() {
        return this._templateId;
    };

    Game_Event.prototype.getTemplateName = function() {
        return this.hasTemplate() ? $dataTemplateEvents[this._templateId].name : '';
    };

    Game_Event.prototype.hasTemplate = function() {
        return this._templateId > 0;
    };

    var _Game_Event_event      = Game_Event.prototype.event;
    Game_Event.prototype.event = function() {
        return this.hasTemplate() ? $dataTemplateEvents[this._templateId] : _Game_Event_event.apply(this, arguments);
    };

    Game_Event.prototype.getOriginalPages = function() {
        var eventId = isExistPlugin('SAN_MapGenerator') ? this._dataEventId : this._eventId;
        return $dataMap.events[eventId].pages;
    };

    Game_Event.prototype.getOriginalPage = function() {
        return this.getOriginalPages()[this._pageIndex];
    };

    Game_Event.prototype.getPages = function() {
        return this.event().pages;
    };

    var _Game_Event_meetsConditions      = Game_Event.prototype.meetsConditions;
    Game_Event.prototype.meetsConditions = function(page) {
        return _Game_Event_meetsConditions.apply(this, arguments) && this.meetsConditionsForSelfVariable(page);
    };

    Game_Event.prototype.meetsConditionsForSelfVariable = function(page) {
        var comment = this.getStartComment(page);
        return !(comment && this.execConditionScriptForSelfVariable(comment) === false);
    };

    Game_Event.prototype.getStartComment = function(page) {
        var index   = 0;
        var comment = '';
        while (true) {
            var currentComment = this.getCurrentComment(page, index);
            if (currentComment) {
                comment += currentComment;
                index++;
            } else {
                break;
            }
        }
        return comment
    };

    Game_Event.prototype.getCurrentComment = function(page, index) {
        var command = page.list[index];
        return command && (command.code === 108 || command.code === 408) ? command.parameters[0] : '';
    };

    Game_Event.prototype.execConditionScriptForSelfVariable = function(note) {
        var scripts = [];
        note.replace(/\\TE\{(.+?)\}/gi, function() {
            scripts.push(arguments[1]);
        }.bind(this));
        return scripts.every(function(script) {
            script = convertEscapeCharacters(script);
            script = $gameSelfSwitches.convertSelfVariableCharacter(this._eventId, script, true);
            return eval(script);
        }, this);
    };

    Game_Event.prototype.getSelfVariableKey = function(index) {
        return $gameSelfSwitches.makeSelfVariableKey(this._eventId, index);
    };

    Game_Event.prototype.controlSelfVariable = function(index, type, operand, formulaFlg) {
        var key = this.getSelfVariableKey(index);
        if (key) {
            this.operateSelfVariable(key, type, formulaFlg ? eval(operand) : operand);
        }
    };

    Game_Event.prototype.controlSelfVariableRange = function(startIndex, endIndex, type, operand, formulaFlg) {
        for (var index = startIndex; index <= endIndex; index++) {
            this.controlSelfVariable(index, type, operand, formulaFlg);
        }
    };

    Game_Event.prototype.getSelfVariable = function(selfVariableIndex) {
        var key = this.getSelfVariableKey(selfVariableIndex);
        return $gameSelfSwitches.getVariableValue(key);
    };

    Game_Event.prototype.operateSelfVariable = function(key, operationType, value) {
        var oldValue = $gameSelfSwitches.getVariableValue(key);
        switch (operationType) {
            case 0:  // Set
                $gameSelfSwitches.setVariableValue(key, oldValue = value);
                break;
            case 1:  // Add
                $gameSelfSwitches.setVariableValue(key, oldValue + value);
                break;
            case 2:  // Sub
                $gameSelfSwitches.setVariableValue(key, oldValue - value);
                break;
            case 3:  // Mul
                $gameSelfSwitches.setVariableValue(key, oldValue * value);
                break;
            case 4:  // Div
                $gameSelfSwitches.setVariableValue(key, oldValue / value);
                break;
            case 5:  // Mod
                $gameSelfSwitches.setVariableValue(key, oldValue % value);
                break;
        }
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

    var _Window_Base_convertEscapeCharacters      = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        text = _Window_Base_convertEscapeCharacters.apply(this, arguments);
        return $gameSelfSwitches.convertSelfVariableCharacter($gameMessage.getEventId(), text, false);
    };

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

