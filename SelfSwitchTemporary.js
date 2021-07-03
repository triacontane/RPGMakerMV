//=============================================================================
// SelfSwitchTemporary.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.1 2021/07/03 パラメータ『デフォルト一時スイッチ』が正常に機能していなかった問題を修正
// 2.1.0 2020/12/27 MZ用に修正
// 2.0.0 2020/12/25 解除タイミングをプラグインコマンドで決められる機能を追加
//                  メモ欄の設定なしで必ず解除されるセルフスイッチを指定できる機能を追加
// 1.0.1 2018/03/16 セルフスイッチが切り替わった際、イベントページが切り替わらない問題を修正
// 1.0.0 2017/04/26 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SelfSwitchTemporary
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SelfSwitchTemporary.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param clearTransfer
 * @desc The self-switch is automatically released when the location is moved.
 * @default true
 * @type boolean
 *
 * @param defaultTemporary
 * @desc  A self-switch that is treated as a temporary self-switch even if it is not specified in the memo field.
 * @default []
 * @type select[]
 * @option A
 * @option B
 * @option C
 * @option D
 *
 * @command CLEAR_TEMPORARY_SELF_SWITCH
 * @desc Release all self switch.
 *
 * @help You can define a temporary self-switch that will be
 * automatically released.
 * Please fill in the memo field of the event as follows
 *
 * <TempS:A,B>   # Release A,B
 * <TempS>       # Release All
 *
 * It will be automatically deactivated when the
 * following plug-in command is executed.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 一時セルフスイッチプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SelfSwitchTemporary.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param clearTransfer
 * @text 場所移動時に自動解除
 * @desc 場所移動したときにセルフスイッチを自動で解除します。(同マップへの場所移動では解除されません)
 * @default true
 * @type boolean
 *
 * @param defaultTemporary
 * @text デフォルト一時スイッチ
 * @desc メモ欄に指定がなくても一時セルフスイッチとして扱うセルフスイッチです。全イベントに適用されるので注意してください。
 * @default []
 * @type select[]
 * @option A
 * @option B
 * @option C
 * @option D
 *
 * @command CLEAR_TEMPORARY_SELF_SWITCH
 * @text 一時セルフスイッチ解除
 * @desc 一時セルフスイッチを全てOFFに戻します。
 *
 * @help 自動で解除される一時的なセルフスイッチを定義できます。
 * イベントのメモ欄に以下の通り記入してください。
 *
 * <TempS:A,B> # セルフスイッチ「A」「B」を自動解除
 * <TempS>     # セルフスイッチを全て自動解除
 *
 * ※MV版から名称を変更しました。後方互換性のためMVのメモ欄でも機能します。
 *
 * プラグインコマンドを実行したタイミングで自動解除されます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'CLEAR_TEMPORARY_SELF_SWITCH', () => {
        $gameSelfSwitches.clearTemporary();
    });

    /**
     * Game_SelfSwitches
     */
    Game_SelfSwitches.prototype.appendTemporary = function(mapId, eventId, type) {
        if (!this._temporaryList) {
            this._temporaryList = {};
        }
        this._temporaryList[[mapId, eventId, type]] = true;
    };

    Game_SelfSwitches.prototype.clearTemporary = function() {
        if (!this._temporaryList) {
            return;
        }
        Object.keys(this._temporaryList).forEach(function(key) {
            this.setValue(key, false);
        }, this);
    };

    /**
     * Game_Map
     */
    const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        if (param.clearTransfer) {
            $gameSelfSwitches.clearTemporary();
        }
        _Game_Map_setupEvents.apply(this, arguments);
        this.events().forEach(function(event) {
            event.addTemporarySelfSwitch();
        });
    };

    /**
     * Game_Event
     */
    Game_Event.prototype.addTemporarySelfSwitch = function() {
        const switchList = this.findTemporarySelfSwitch();
        if (!switchList) {
            return;
        }
        switchList.forEach(function(type) {
            $gameSelfSwitches.appendTemporary($gameMap.mapId(), this.eventId(), type.toUpperCase().trim());
        }, this);
    };

    Game_Event.prototype.findTemporarySelfSwitch = function() {
        const metaValue = PluginManagerEx.findMetaValue(this.event(), ['TempS', 'SST_Switch', 'SST_スイッチ']);
        if (!metaValue) {
            return param.defaultTemporary || null;
        }
        const list = metaValue === true ? ['A', 'B', 'C', 'D'] : metaValue.split(',');
        return param.defaultTemporary ? list.concat(param.defaultTemporary) : list;
    };
})();

