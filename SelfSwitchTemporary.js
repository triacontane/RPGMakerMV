//=============================================================================
// SelfSwitchTemporary.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @help You can define a temporary self-switch that will be
 * automatically released.
 * Please fill in the memo field of the event as follows
 *
 * <SST_Switch:A,B>   # Release A,B
 * <SST_Switch>       # Release All
 *
 * It will be automatically deactivated when the
 * following plug-in command is executed.
 *
 * CLEAR_TEMPORARY_SELF_SWITCH
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 一時セルフスイッチプラグイン
 * @author トリアコンタン
 *
 * @param clearTransfer
 * @text 場所移動時に自動解除
 * @desc 場所移動したときにセルフスイッチを自動で解除します。
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
 * @help 自動で解除される一時的なセルフスイッチを定義できます。
 * イベントのメモ欄に以下の通り記入してください。
 *
 * <SST_スイッチ:A,B> # セルフスイッチ「A」「B」を自動解除
 * <SST_Switch:A,B>   # 同上
 * <SST_スイッチ>     # セルフスイッチを全て自動解除
 * <SST_Switch>       # 同上
 *
 * 以下のプラグインコマンドを実行したタイミングで自動解除されます。
 *
 * 一時セルフスイッチ解除
 * CLEAR_TEMPORARY_SELF_SWITCH
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var metaTagPrefix = 'SST_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var getArgArrayString = function(args) {
        var values = args.split(',');
        for (var i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    };

    var convertEscapeCharacters = function(text) {
        if (String(text) !== text) return text;
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

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

    var param = createPluginParameter('SelfSwitchTemporary');

    /**
     * Game_Interpreter
     * プラグインコマンドを追加定義します。
     */
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (command === 'CLEAR_TEMPORARY_SELF_SWITCH' || command === '一時セルフスイッチ解除') {
            $gameSelfSwitches.clearTemporary();
        }
    };

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
    var _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
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
        var switchList = this.findTemporarySelfSwitch();
        if (!switchList) {
            return;
        }
        switchList.forEach(function(type) {
            $gameSelfSwitches.appendTemporary($gameMap.mapId(), this.eventId(), type.toUpperCase());
        }, this);
    };

    Game_Event.prototype.findTemporarySelfSwitch = function() {
        var metaValue = getMetaValues(this.event(), ['Switch', 'スイッチ']);
        if (!metaValue) {
            return null;
        }
        var list = metaValue === true ? ['A', 'B', 'C', 'D'] : getArgArrayString(metaValue);
        return param.defaultTemporary ? list.concat(param.defaultTemporary) : list;
    };
})();

