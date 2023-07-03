/*=============================================================================
 EventInterceptor.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.3 2023/07/03 「並列処理は無効」の設定を削除
 1.1.2 2023/07/03 不要なヘルプの記述を削除
 1.1.1 2022/11/07 MZ版を移植
 1.1.0 2022/11/04 特定のページ番号にのみ割り込みする機能を追加
                  並列処理のイベントを割り込み対象外にできる機能を追加
                  選択肢や条件分岐の分岐終了のタイミングで終了後の割り込み処理が走ってしまう問題を修正
 1.0.0 2022/11/03 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc イベント処理の割り込みプラグイン
 * @author トリアコンタン
 *
 * @param interceptorList
 * @text 割り込み設定リスト
 * @desc 割り込んで実行できるコモンイベントのリストです。実行されるのはタグが一致したひとつだけです。
 * @default []
 * @type struct<Interceptor>[]
 *
 * @param tagName
 * @text タグ名
 * @desc イベントタイプを判定するためのタグ名称です。
 * @default EvTp
 *
 * @help EventInterceptor.js
 *
 * イベントの開始もしくは終了時に指定したコモンイベントを自動で
 * 割り込み実行できます。マップイベントが対象です。
 * 何らかの共通処理を実行したいときに使用します。
 * パラメータで指定したタグをイベントのメモ欄に記述して使います。
 *
 * <EvTp:aaa>
 *
 * タグの指定を無しにして無条件で割り込みすることに可能です。
 * その場合、割り込み不要なイベントには以下のタグをメモ欄に設定します。　
 * <EvTp:none>
 *
 * イベント中で『場所移動』した場合、終了の割り込みは行われません。
 * こちらは制約事項となります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Interceptor:
 *
 * @param id
 * @text 識別子
 * @desc 識別用の名称です。特に用途はありません。
 * @default
 *
 * @param tagValue
 * @text タグ設定値
 * @desc 指定したタグ(<EvTp:aaa>)がイベントのメモ欄に記載されていれば割り込みを実行します。指定がない場合は無条件で実行します。
 * @default aaa
 *
 * @param timing
 * @text タイミング
 * @desc 割り込みのタイミングです。イベント開始前と終了後を選択できます。
 * @default start
 * @type select
 * @option 開始前
 * @value start
 * @option 終了後
 * @value finish
 *
 * @param pageIndex
 * @text ページインデックス
 * @desc イベントのページが指定値と一致するときだけ実行します。
 * @default 0
 * @type number
 *
 * @param commonEventId
 * @text コモンイベントID
 * @desc 実行するコモンイベントのIDです。
 * @default 1
 * @type common_event
 *
 */

(function() {
    'use strict';

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

    var param = createPluginParameter('EventInterceptor');
    if (!param.interceptorList) {
        param.interceptorList = [];
    }

    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._eventType = this.event().meta[param.tagName];
    };

    Game_Event.prototype.findEventType = function() {
        return this._eventType;
    };

    var _Game_Interpreter_setup = Game_Interpreter.prototype.setup;
    Game_Interpreter.prototype.setup = function(list, eventId) {
        _Game_Interpreter_setup.apply(this, arguments);
        this.setupInterceptor(eventId, 'start');
    };

    var _Game_Interpreter_command0 = Game_Interpreter.prototype.command0;
    Game_Interpreter.prototype.command0 = function(param) {
        if (_Game_Interpreter_command0) {
            _Game_Interpreter_command0.apply(this, arguments);
        }
        if (this._list[this._index + 1]) {
            return true;
        }
        this.setupInterceptor(this.eventId(), 'finish');
        return true;
    };

    Game_Interpreter.prototype.setupInterceptor = function(eventId, timing) {
        var event = $gameMap.event(eventId);
        if (this._depth > 0 || !this.isOnCurrentMap() || !event) {
            return;
        }
        var interceptor = param.interceptorList.find(item => this.isInterceptorValid(item, event, timing));
        if (!interceptor) {
            return;
        }
        var commonEvent = $dataCommonEvents[interceptor.commonEventId];
        if (!commonEvent) {
            return;
        }
        this.setupChild(commonEvent.list, eventId);
    };

    Game_Interpreter.prototype.isInterceptorValid = function(item, event, timing) {
        var type = event.findEventType();
        var pageIndex = event._pageIndex + 1;
        if (item.timing !== timing) {
            return false;
        } else if (item.pageIndex > 0 && pageIndex !== item.pageIndex) {
            return false;
        } else if (!item.tagValue && type !== 'none') {
            return true;
        } else if (item.tagValue === type) {
            return true;
        } else {
            return false;
        }
    };
})();
