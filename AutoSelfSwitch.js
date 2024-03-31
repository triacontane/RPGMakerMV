/*=============================================================================
 AutoSelfSwitch.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2024/03/31 条件種別を「以内」以外にも設定できる機能を追加
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
 * @desc プレイヤーとの距離が条件種別で指定した条件を満たしたときに条件を満たします。
 * @default 0
 * @type number
 *
 * @param conditionType
 * @text 条件種別
 * @desc 距離の条件を判定する際の種別です。
 * @default 0
 * @type select
 * @option <=(以内)
 * @value 0
 * @option <(未満)
 * @value 1
 * @option >=(以上)
 * @value 2
 * @option >(より大きい)
 * @value 3
 * @option ==(等しい)
 * @value 4
 * @option !=(等しくない)
 * @value 5
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
        const distance = sx + sy;
        switch (data.conditionType) {
            case 1:
                return distance < data.playerDistance;
            case 2:
                return distance >= data.playerDistance;
            case 3:
                return distance > data.playerDistance;
            case 4:
                return distance === data.playerDistance;
            case 5:
                return distance !== data.playerDistance;
            default:
                return distance <= data.playerDistance;
        }
    };
})();
