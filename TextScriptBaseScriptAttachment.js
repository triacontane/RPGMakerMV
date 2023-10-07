/*=============================================================================
 TextScriptBaseScriptAttachment.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/10/07 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc TextScriptBaseのスクリプトアタッチメント
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TextScriptBaseScriptAttachment.js
 * @base TextScriptBase
 * @orderAfter TextScriptBase
 * @author トリアコンタン
 *
 * @help TextScriptBaseScriptAttachment.js
 *　
 * 公式プラグイン『TextScriptBase』の効果を
 * 各種スクリプトにも適用するアタッチメントです。
 * 以下の状況で\tx[n]や\v[n]が使えます。
 *
 * 移動ルートの設定『スクリプト』
 * イベントコマンド『条件分岐』
 * イベントコマンド『スクリプト』
 * イベントコマンド『変数の操作』
 *
 * このプラグインの利用にはベースプラグイン『TextScriptBase.js』が必要です。
 * 『TextScriptBase.js』は、RPGツクールMZのインストールフォルダ配下の
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

    const _Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
    Game_Character.prototype.processMoveCommand = function(command) {
        const gc = Game_Character;
        if (command.code !== gc.ROUTE_SCRIPT) {
            _Game_Character_processMoveCommand.apply(this, arguments);
            return;
        }
        const params = command.parameters;
        const prevScript = params[0];
        params[0] = PluginManagerEx.convertEscapeCharacters(prevScript);
        _Game_Character_processMoveCommand.apply(this, arguments);
        params[0] = prevScript;
    };

    const _Game_Interpreter_command111 = Game_Interpreter.prototype.command111;
    Game_Interpreter.prototype.command111 = function(params) {
        if (params[0] !== 12) { // Script以外
            return _Game_Interpreter_command111.apply(this, arguments);
        }
        const prevScript = params[1];
        params[1] = PluginManagerEx.convertEscapeCharacters(params[1]);
        const result = _Game_Interpreter_command111.apply(this, arguments);
        params[1] = prevScript;
        return result;
    };

    const _Game_Interpreter_command122 = Game_Interpreter.prototype.command122;
    Game_Interpreter.prototype.command122 = function(params) {
        const operand = params[3];
        if (operand !== 4) { // Script以外
            return _Game_Interpreter_command122.apply(this, arguments);
        }
        const prevScript = params[4];
        params[4] = PluginManagerEx.convertEscapeCharacters(params[4]);
        const result = _Game_Interpreter_command122.apply(this, arguments);
        params[4] = prevScript;
        return result;
    };

    // Orverride
    Game_Interpreter.prototype.command355 = function() {
        let script = this.currentCommand().parameters[0] + "\n";
        while (this.nextEventCode() === 655) {
            this._index++;
            script += this.currentCommand().parameters[0] + "\n";
        }
        eval(PluginManagerEx.convertEscapeCharacters(script));
        return true;
    };
})();
