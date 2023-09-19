//=============================================================================
// TraceEvent.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2023/09/19 指定イベントの方向を向くあるいは逆方向を向くスクリプトを追加
// 1.2.0 2023/05/11 MZで動作するよう修正
// 1.1.0 2017/10/22 イベントの検索範囲と範囲外だった場合の動作を指定できる機能を追加
// 1.0.0 2017/10/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 指定イベント追跡プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TraceEvent.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param eventPriorityType
 * @text イベント優先基準
 * @desc 対象イベントが複数存在した場合の優先基準です。
 * @default 0
 * @type select
 * @option 最もIDの小さいイベント
 * @value 0
 * @option 自身の現在値から最も近いイベント
 * @value 1
 *
 * @param traceRange
 * @text 追跡範囲
 * @desc イベントを探索する際の探索有効範囲です。制御文字\v[n]を使うと変数値を取得します。
 * @default 0
 * @type number
 *
 * @param outOfRangeAction
 * @text 範囲外動作
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
 * イベントの方向を向きます。
 * this.turnEventById(id);         # idの番号のイベントのを向く
 * this.turnEventByName('name');   # nameの名前のイベントの方を向く
 * this.turnEventByTag('tagName'); # 指定したメモのイベントの方を向く
 * this.turnEventById(id, true);  # idの番号のイベントの逆の方向を向く
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Character
    //  イベント追跡のスクリプトを実装します。
    //=============================================================================
    Game_Character.prototype.turnEventById = function(id, awayFlg = false) {
        const character = (id > 0 ? $gameMap.event(id) : $gamePlayer);
        if (awayFlg) {
            this.turnAwayFromCharacter(character);
        } else {
            this.turnTowardCharacter(character);
        }
    };

    Game_Character.prototype.traceEventByName = function(name, awayFlg) {
        const character = this.findHighestPriorityEvent($gameMap.filterEventsByName(name));
        if (awayFlg) {
            this.turnAwayFromCharacter(character);
        } else {
            this.turnTowardCharacter(character);
        }
    };

    Game_Character.prototype.traceEventByTag = function(tagName, awayFlg) {
        const character = this.findHighestPriorityEvent($gameMap.filterEventsByTag(tagName));
        if (awayFlg) {
            this.turnAwayFromCharacter(character);
        } else {
            this.turnTowardCharacter(character);
        }
    };

    Game_Character.prototype.traceEventById = function(id, awayFlg) {
        const character = (id > 0 ? $gameMap.event(id) : $gamePlayer);
        this.traceEvent(character, awayFlg);
    };

    Game_Character.prototype.traceEventByName = function(name, awayFlg) {
        const character = this.findHighestPriorityEvent($gameMap.filterEventsByName(name));
        this.traceEvent(character, awayFlg);
    };

    Game_Character.prototype.traceEventByTag = function(tagName, awayFlg) {
        const character = this.findHighestPriorityEvent($gameMap.filterEventsByTag(tagName));
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
        const character = (id > 0 ? $gameMap.event(id) : $gamePlayer);
        this.findEvent(character);
    };

    Game_Character.prototype.findEventByName = function(name) {
        const character = this.findHighestPriorityEvent($gameMap.filterEventsByName(name));
        this.findEvent(character);
    };

    Game_Character.prototype.findEventByTag = function(tagName) {
        const character = this.findHighestPriorityEvent($gameMap.filterEventsByTag(tagName));
        this.findEvent(character);
    };

    Game_Character.prototype.findEvent = function(character) {
        this.tryTraceAction(character, function() {
            const direction = this.findDirectionTo(character.x, character.y);
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
        const range = this.getTraceRange();
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
        return param.traceRange;
    };

    Game_Character.prototype.findHighestPriorityEvent = function(events) {
        return param.eventPriorityType === 1 ? this.findNearestEvent(events) : events[0];
    };

    Game_Character.prototype.findNearestEvent = function(events) {
        return events.sort((eventA, eventB) => this.getDistance(eventA) - this.getDistance(eventB))[0];
    };

    Game_Character.prototype.getDistance = function(character) {
        return $gameMap.distance(character.x, character.y, this.x, this.y);
    };

    //=============================================================================
    // Game_Map
    //  イベントを取得します。
    //=============================================================================
    Game_Map.prototype.filterEventsByName = function(name) {
        name = PluginManagerEx.convertEscapeCharacters(name);
        return this.events().filter(event => {
            const eventData = event.event();
            return eventData && eventData.name === name;
        });
    };

    Game_Map.prototype.filterEventsByTag = function(tagName) {
        tagName = PluginManagerEx.convertEscapeCharacters(tagName);
        return this.events().filter(event => {
            const eventData = event.event();
            return eventData && !!eventData.meta[tagName];
        });
    };
})();

