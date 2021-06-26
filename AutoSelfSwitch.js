/*=============================================================================
 AutoSelfSwitch.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/06/25 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc オートセルフスイッチプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AutoSelfSwitch.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param list
 * @text 条件リスト
 * @desc セルフスイッチを変動させる条件のリストです。
 * @default []
 * @type struct<Condition>[]
 *
 * @help AutoSelfSwitch.js
 *
 * マップイベントを監視しセルフスイッチを自動でON/OFFします。
 * パラメータから条件を指定します。
 * 現在指定できる条件は「プレイヤーとの距離」だけです。
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

/*~struct~Condition:
 * @param noteTag
 * @text メモタグ
 * @desc 識別子です。この名前のメモ欄をイベントに指定します。例：<selfSwitch>
 * @default selfSwitch
 *
 * @param playerDistance
 * @text プレイヤーとの距離
 * @desc プレイヤーとの距離が指定値以内のときに条件を満たします。
 * @default 0
 * @type number
 *
 * @param type
 * @text セルフスイッチ種別
 * @desc 条件を満たしたときにONにするセルフスイッチです。
 * @default A
 * @type select
 * @option A
 * @option B
 * @option C
 * @option D
 *
 * @param turnOff
 * @text OFFにする
 * @desc 条件を満たさなくなったときにセルフスイッチをOFFにします。
 * @default false
 * @type boolean
 *
 * @param reverse
 * @text 反転
 * @desc 条件を満たしたときに逆にセルフスイッチをOFFにします。
 * @default false
 * @type boolean
 *
 * @param switchId
 * @text 有効スイッチ
 * @desc 指定した場合、このスイッチがONのときのみセルフスイッチが変動します。
 * @default 0
 * @type switch
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.list || !Array.isArray(param.list)) {
        return;
    }

    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function() {
        _Game_Event_initialize.apply(this, arguments);
        const dataList = param.list.filter(item => PluginManagerEx.findMetaValue(this.event(), item.noteTag));
        this._autoSelfSwitchIndexList = dataList.map(data => param.list.indexOf(data));
    };

    const _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function() {
        _Game_Event_update.apply(this, arguments);
        this.updateAutoSelfSwitchList();
    };

    Game_Event.prototype.findAutoSelfSwitchList = function() {
        return this._autoSelfSwitchIndexList.map(index => param.list[index]);
    };

    Game_Event.prototype.updateAutoSelfSwitchList = function() {
        this.findAutoSelfSwitchList().forEach(data => {
            if (data.switchId && !$gameSwitches.value(data.switchId)) {
                return;
            }
            if (this.isValidAutoSelfSwitchList(data)) {
                this.controlSelfSwitch(data.type, !data.reverse);
            } else if (data.turnOff) {
                this.controlSelfSwitch(data.type, data.reverse);
            }
        });
    };

    Game_Event.prototype.controlSelfSwitch = function(type, value) {
        const key = [$gameMap.mapId(), this.eventId(), type];
        const prevValue = $gameSelfSwitches.value(key);
        if (prevValue !== value) {
            $gameSelfSwitches.setValue(key, value);
        }
    };

    Game_Event.prototype.isValidAutoSelfSwitchList = function(data) {
        const sx = Math.abs(this.deltaXFrom($gamePlayer.x));
        const sy = Math.abs(this.deltaYFrom($gamePlayer.y));
        return sx + sy <= data.playerDistance;
    };
})();
