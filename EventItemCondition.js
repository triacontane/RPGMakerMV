//=============================================================================
// EventItemCondition.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2024/02/07 MZ向けに仕様を再検討
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc アイテム選択の表示条件プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EventItemCondition.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param DefaultVisible
 * @text デフォルト表示可否
 * @desc パラメータが設定されていないアイテムの表示可否です。無効にすると設定がないアイテムはすべて表示されません。
 * @default true
 * @type boolean
 *
 * @param RefreshSwitchId
 * @text 再描画スイッチID
 * @desc 指定したIDのスイッチがONになるとウィンドウを再描画します。描画後、スイッチは自動でOFFになります。
 * @default 0
 * @type switch
 *
 * @param ConditionList
 * @text 表示条件リスト
 * @desc アイテムごとの表示条件を設定します。
 * @default []
 * @type struct<Condition>[]
 *
 * @help EventItemCondition.js
 *
 * イベントコマンド「アイテム選択の処理」において
 * 表示可否の条件をアイテムごとに設定できます。
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
 * @param itemId
 * @text アイテムID
 * @desc 条件を設定するアイテムのIDです。
 * @default 1
 * @type item
 *
 * @param switchId
 * @text スイッチID
 * @desc 条件となるスイッチのIDです。
 * @default 0
 * @type switch
 *
 * @param script
 * @text スクリプト
 * @desc 条件となるスクリプトです。
 * @default
 * @type multiline_string
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_EventItem_includes      = Window_EventItem.prototype.includes;
    Window_EventItem.prototype.includes = function(item) {
        return _Window_EventItem_includes.apply(this, arguments) && this.isOkEventItem(item);
    };

    Window_EventItem.prototype.findEventItemCondition = function(item) {
        return param.ConditionList.find(condition => condition.itemId === item.id);
    };

    Window_EventItem.prototype.isOkEventItem = function(item) {
        const condition = this.findEventItemCondition(item);
        if (condition) {
            return this.isOkEventItemSwitch(condition) && this.isOkEventItemScript(condition);
        } else {
            return param.DefaultVisible;
        }
    };

    Window_EventItem.prototype.isOkEventItemSwitch = function(condition) {
        return !condition.switchId || $gameSwitches.value(condition.switchId);

    };

    Window_EventItem.prototype.isOkEventItemScript = function(condition) {
        return !condition.script || eval(condition.script);
    };

    const _Window_EventItem_update      = Window_EventItem.prototype.update;
    Window_EventItem.prototype.update = function() {
        _Window_EventItem_update.apply(this, arguments);
        this.updateAutoRefresh();
    };

    Window_EventItem.prototype.updateAutoRefresh = function() {
        if ($gameSwitches.value(param.RefreshSwitchId) && this.openness === 255) {
            $gameSwitches.setValue(param.RefreshSwitchId, false);
            this.refresh();
            this.select(0);
        }
    };
})();

