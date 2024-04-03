/*=============================================================================
 OptionReset.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/04/03 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc オプションリセットプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OptionReset.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderAfter CustomizeConfigItem
 * @author トリアコンタン
 *
 * @param commandName
 * @text コマンド名称
 * @desc デフォルト設定にリセットするコマンドの名称です。
 * @default - デフォルト設定に戻す -
 * @type string
 *
 * @help OptionReset.js
 *
 * オプション画面ですべての設定項目をリセットし、デフォルト設定に戻す
 * コマンドを提供します。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    Scene_Options.prototype.maxCommands = function() {
        const result = _Scene_Options_maxCommands.apply(this, arguments);
        return param.commandName ? result + 1 : result;
    };

    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.apply(this, arguments);
        if (param.commandName) {
            this.addCommand(param.commandName, 'reset');
        }
    };

    Window_Options.prototype.isResetCommand = function(index) {
        return this.commandSymbol(index) === 'reset';
    };

    const _Window_Options_drawItem = Window_Options.prototype.drawItem;
    Window_Options.prototype.drawItem = function(index) {
        if (this.isResetCommand(index)) {
            const title = this.commandName(index);
            const rect = this.itemLineRect(index);
            this.resetTextColor();
            this.drawText(title, rect.x, rect.y, rect.width, "center");
        } else {
            _Window_Options_drawItem.apply(this, arguments);
        }
    };

    const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function() {
        if (!this.isResetCommand(this.index())) {
            _Window_Options_cursorRight.apply(this, arguments);
        }
    };

    const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function() {
        if (!this.isResetCommand(this.index())) {
            _Window_Options_cursorLeft.apply(this, arguments);
        }
    };

    const _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        if (this.isResetCommand(this.index())) {
            this.resetOption();
        } else {
            _Window_Options_processOk.apply(this, arguments);
        }
    };

    Window_Options.prototype.resetOption = function() {
        ConfigManager.resetData();
        this.refresh();
        this.playOkSound();
    };

    ConfigManager.resetData = function() {
        this.applyData({});
        this.save();
    };
})();
