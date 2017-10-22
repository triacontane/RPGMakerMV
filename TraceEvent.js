//=============================================================================
// TraceEvent.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/10/22 イベントの検索範囲と範囲外だった場合の動作を指定できる機能を追加
// 1.0.0 2017/10/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc TraceEventPlugin
 * @author triacontane
 *
 * @param EventPriorityType
 * @desc 対象イベントが複数存在した場合の優先基準です。
 * @default 0
 * @type select
 * @option 最もIDの小さいイベント
 * @value 0
 * @option 自身の現在値から最も近いイベント
 * @value 1
 *
 * @param TraceRange
 * @desc イベントを探索する際の探索有効範囲です。制御文字\v[n]を使うと変数値を取得します。
 * @default 0
 *
 * @param OutOfRangeAction
 * @desc イベントが範囲外だった場合の動作です。
 * @default 0
 * @type select
 * @option No Move
 * @value 0
 * @option Random
 * @value 1
 * @option Toward Player
 * @value 2
 *
 * @help TraceEvent.js
 *
 * 様々な方法で指定イベントに近づくコマンドを提供します。
 * 「移動ルートの設定」のスクリプトから以下を実行してください。
 *
 * 一般的な方法でイベントに近づきます。
 * this.traceEventById(id);         # idの番号のイベントに近づく
 * this.traceEventByName('name');   # nameの名前のイベントに近づく
 * this.traceEventByTag('tagName'); # 指定したメモ(※1)のイベントに近づく
 *
 * ※1 イベントのメモ欄に<tagName>(関数で指定する名前)と記述してください。
 * 例：メモ欄     : <aaa>
 *     スクリプト : this.traceEventByNote('aaa');
 *
 * 高精度かつ高負荷な方法でイベントに近づきます。
 * this.findEventById(id);         # idの番号のイベントに近づく
 * this.findEventByName('name');   # nameの名前のイベントに近づく
 * this.findEventByTag('tagName'); # 指定したメモ(※1)のイベントに近づく
 *
 * 一般的な方法でイベントから遠ざかります。
 * this.awayEventById(id);         # idの番号のイベントから遠ざかる
 * this.awayEventByName('name');   # nameの名前のイベントから遠ざかる
 * this.awayEventByTag('tagName'); # 指定したメモ(※1)のイベントから遠ざかる
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 指定イベント追跡プラグイン
 * @author トリアコンタン
 *
 * @param イベント優先基準
 * @desc 対象イベントが複数存在した場合の優先基準です。
 * @default 0
 * @type select
 * @option 最もIDの小さいイベント
 * @value 0
 * @option 自身の現在値から最も近いイベント
 * @value 1
 *
 * @param 追跡範囲
 * @desc イベントを探索する際の探索有効範囲です。制御文字\v[n]を使うと変数値を取得します。
 * @default 0
 *
 * @param 範囲外動作
 * @desc イベントが範囲外だった場合の動作です。
 * @default 0
 * @type select
 * @option 動かない
 * @value 0
 * @option ランダム移動
 * @value 1
 * @option プレイヤーに近づく
 * @value 2
 *
 * @help TraceEvent.js
 *
 * 様々な方法で指定イベントに近づくコマンドを提供します。
 * 「移動ルートの設定」のスクリプトから以下を実行してください。
 *
 * 一般的な方法でイベントに近づきます。
 * this.traceEventById(id);         # idの番号のイベントに近づく
 * this.traceEventByName('name');   # nameの名前のイベントに近づく
 * this.traceEventByTag('tagName'); # 指定したメモ(※1)のイベントに近づく
 *
 * ※1 イベントのメモ欄に<tagName>(関数で指定する名前)と記述してください。
 * 例：メモ欄     : <aaa>
 *     スクリプト : this.traceEventByNote('aaa');
 *
 * 高精度かつ高負荷な方法でイベントに近づきます。
 * this.findEventById(id);         # idの番号のイベントに近づく
 * this.findEventByName('name');   # nameの名前のイベントに近づく
 * this.findEventByTag('tagName'); # 指定したメモ(※1)のイベントに近づく
 *
 * 一般的な方法でイベントから遠ざかります。
 * this.awayEventById(id);         # idの番号のイベントから遠ざかる
 * this.awayEventByName('name');   # nameの名前のイベントから遠ざかる
 * this.awayEventByTag('tagName'); # 指定したメモ(※1)のイベントから遠ざかる
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
    var pluginName = 'TraceEvent';

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
        alert('Fail to load plugin parameter of ' + pluginName);
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
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
    param.eventPriorityType = getParamNumber(['EventPriorityType', 'イベント優先基準'], 0);
    param.traceRange        = getParamString(['TraceRange', '追跡範囲'], 0);
    param.outOfRangeAction  = getParamNumber(['OutOfRangeAction', '範囲外動作'], 0);

    //=============================================================================
    // Game_Character
    //  イベント追跡のスクリプトを実装します。
    //=============================================================================
    Game_Character.prototype.traceEventById = function(id, awayFlg) {
        var character = (id > 0 ? $gameMap.event(id) : $gamePlayer);
        this.traceEvent(character, awayFlg);
    };

    Game_Character.prototype.traceEventByName = function(name, awayFlg) {
        var character = this.findHighestPriorityEvent($gameMap.filterEventsByName(name));
        this.traceEvent(character, awayFlg);
    };

    Game_Character.prototype.traceEventByTag = function(tagName, awayFlg) {
        var character = this.findHighestPriorityEvent($gameMap.filterEventsByTag(tagName));
        this.traceEvent(character, awayFlg);
    };

    Game_Character.prototype.awayEventById = function(id) {
        this.traceEventById(id, true);
    };

    Game_Character.prototype.awayEventByName = function(name) {
        this.traceEventByName(name, true);
    };

    Game_Character.prototype.awayEventByTag = function(tagName) {
        this.traceEventByTag(tagName, true);
    };

    Game_Character.prototype.traceEvent = function(character, awayFlg) {
        this.tryTraceAction(character, function() {
            if (!awayFlg) {
                this.moveTowardCharacter(character);
            } else {
                this.moveAwayFromCharacter(character);
            }
        });
    };

    Game_Character.prototype.findEventById = function(id) {
        var character = (id > 0 ? $gameMap.event(id) : $gamePlayer);
        this.findEvent(character);
    };

    Game_Character.prototype.findEventByName = function(name) {
        var character = this.findHighestPriorityEvent($gameMap.filterEventsByName(name));
        this.findEvent(character);
    };

    Game_Character.prototype.findEventByTag = function(tagName) {
        var character = this.findHighestPriorityEvent($gameMap.filterEventsByTag(tagName));
        this.findEvent(character);
    };

    Game_Character.prototype.findEvent = function(character) {
        this.tryTraceAction(character, function() {
            var direction = this.findDirectionTo(character.x, character.y);
            if (direction > 0) {
                this.moveStraight(direction);
            }
        });
    };

    Game_Character.prototype.tryTraceAction = function(character, actionCallBack) {
        if (!this.canTraceCharacter(character)) {
            this.actionWhenOutOfRange();
            return;
        }
        actionCallBack.call(this);
    };

    Game_Character.prototype.canTraceCharacter = function(character) {
        if (!character) {
            return false;
        }
        var range = this.getTraceRange();
        return range <= 0 || this.getDistance(character) <= range;
    };

    Game_Character.prototype.actionWhenOutOfRange = function() {
        switch (param.outOfRangeAction) {
            case 1:
                this.moveRandom();
                break;
            case 2:
                this.moveTowardPlayer();
                break;
            default:
            // do nothing
        }
    };

    Game_Character.prototype.getTraceRange = function() {
        return getArgNumber(convertEscapeCharacters(param.traceRange), 0);
    };

    Game_Character.prototype.findHighestPriorityEvent = function(events) {
        return param.eventPriorityType === 1 ? this.findNearestEvent(events) : events[0];
    };

    Game_Character.prototype.findNearestEvent = function(events) {
        return events.sort(function(eventA, eventB) {
            return this.getDistance(eventA) - this.getDistance(eventB)
        }.bind(this))[0];
    };

    Game_Character.prototype.getDistance = function(character) {
        return $gameMap.distance(character.x, character.y, this.x, this.y);
    };

    //=============================================================================
    // Game_Map
    //  イベントを取得します。
    //=============================================================================
    Game_Map.prototype.filterEventsByName = function(name) {
        name = convertEscapeCharacters(name);
        return this.events().filter(function(event) {
            var eventData = event.event();
            return eventData && eventData.name === name;
        });
    };

    Game_Map.prototype.filterEventsByTag = function(tagName) {
        tagName = convertEscapeCharacters(tagName);
        return this.events().filter(function(event) {
            var eventData = event.event();
            return eventData && !!eventData.meta[tagName];
        });
    };
})();

