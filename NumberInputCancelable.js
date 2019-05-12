/*=============================================================================
 NumberInputCancelable.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2019/05/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc NumberInputCancelablePlugin
 * @author triacontane
 *
 * @param validSwitchId
 * @text ValidSwitchId
 * @desc 指定した番号のスイッチがONのときプラグインの機能が有効になります。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @param canceledSwitchId
 * @text CanceledSwitchId
 * @desc 数値入力処理をキャンセルしたときにONになるスイッチ番号です。
 * @default 0
 * @type switch
 *
 * @help NumberInputCancelable.js
 *
 * イベントコマンド「数値入力処理」をキャンセル可能にします。
 * キャンセルした場合、対象変数に入っている値はそのままで
 * パラメータ「CanceledSwitchId」のスイッチがONになります。
 * (一度ONになったスイッチは再度、数値入力処理を実行したときにOFFになります)
 *
 * マウス操作の場合もキャンセルできます。タッチ操作の場合は二本指タッチが必要です。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 数値入力のキャンセル可能化プラグイン
 * @author トリアコンタン
 *
 * @param validSwitchId
 * @text 有効スイッチ番号
 * @desc 指定した番号のスイッチがONのときプラグインの機能が有効になります。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @param canceledSwitchId
 * @text キャンセルスイッチ番号
 * @desc 数値入力処理をキャンセルしたときにONになるスイッチ番号です。
 * @default 0
 * @type switch
 *
 * @help NumberInputCancelable.js
 *
 * イベントコマンド「数値入力処理」をキャンセル可能にします。
 * キャンセルした場合、対象変数に入っている値はそのままで
 * パラメータ「キャンセルスイッチ番号」のスイッチがONになります。
 * (一度ONになったスイッチは再度、数値入力処理を実行したときにOFFになります)
 *
 * マウス操作の場合もキャンセルできます。タッチ操作の場合は二本指タッチが必要です。
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

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
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
    var param = createPluginParameter('NumberInputCancelable');

    /**
     * Window_NumberInput
     */
    var _Window_NumberInput_initialize = Window_NumberInput.prototype.initialize;
    Window_NumberInput.prototype.initialize = function() {
        _Window_NumberInput_initialize.apply(this, arguments);
        this.setHandler('cancel', this.onCancel.bind(this));
    };

    var _Window_NumberInput_start = Window_NumberInput.prototype.start;
    Window_NumberInput.prototype.start = function() {
        _Window_NumberInput_start.apply(this, arguments);
        if (param.canceledSwitchId) {
            $gameSwitches.setValue(param.canceledSwitchId, false);
        }
    };

    Window_NumberInput.prototype.isCancelEnabled = function() {
        return !param.validSwitchId || $gameSwitches.value(param.validSwitchId);
    };

    Window_NumberInput.prototype.onCancel = function() {
        if (param.canceledSwitchId) {
            $gameSwitches.setValue(param.canceledSwitchId, true);
        }
        this._messageWindow.terminateMessage();
        this.updateInputData();
        this.deactivate();
        this.close();
    };
})();
