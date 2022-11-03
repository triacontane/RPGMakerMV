/*=============================================================================
 EventInterceptor.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/11/03 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc イベント処理の割り込みプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventInterceptor.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
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
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
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
 * @param commonEventId
 * @text コモンイベントID
 * @desc 実行するコモンイベントのIDです。
 * @default 1
 * @type common_event
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.interceptorList) {
        param.interceptorList = [];
    }

    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._eventType = PluginManagerEx.findMetaValue(this.event(), param.tagName);
    };

    Game_Event.prototype.findEventType = function() {
        return this._eventType;
    };

    const _Game_Interpreter_setup = Game_Interpreter.prototype.setup;
    Game_Interpreter.prototype.setup = function(list, eventId) {
        _Game_Interpreter_setup.apply(this, arguments);
        this.setupInterceptor(eventId, 'start');
    };

    const _Game_Interpreter_command0 = Game_Interpreter.prototype.command0;
    Game_Interpreter.prototype.command0 = function() {
        if (_Game_Interpreter_command0) {
            _Game_Interpreter_command0.apply(this, arguments);
        }
        this.setupInterceptor(this.eventId(), 'finish');
        return true;
    };

    Game_Interpreter.prototype.setupInterceptor = function(eventId, timing) {
        const event = $gameMap.event(eventId);
        if (this._depth > 0 || !this.isOnCurrentMap() || !event) {
            return;
        }
        const type = event.findEventType();
        const interceptor = param.interceptorList.find(item => {
            return ((!item.tagValue && type !== 'none') || item.tagValue === type) && item.timing === timing;
        });
        if (!interceptor) {
            return;
        }
        const commonEvent = $dataCommonEvents[interceptor.commonEventId];
        if (!commonEvent) {
            return;
        }
        this.setupChild(commonEvent.list, eventId);
    };
})();
