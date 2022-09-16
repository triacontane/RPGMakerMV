/*=============================================================================
 LoopLimitation.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/09/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ループ制限プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/LoopLimitation.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param maxCount
 * @text 回数制限
 * @desc ループ回数に制限を設けます。
 * @default 1000
 * @type number
 *
 * @help LoopLimitation.js
 *
 * イベントコマンド『ループの処理』に
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

    const _Game_Interpreter_clear = Game_Interpreter.prototype.clear;
    Game_Interpreter.prototype.clear = function() {
        _Game_Interpreter_clear.apply(this, arguments);
        this._loopCount = [];
    };

    const _Game_Interpreter_command112 = Game_Interpreter.prototype.command112;
    Game_Interpreter.prototype.command112 = function() {
        this._loopCount.push(0);
        return _Game_Interpreter_command112.apply(this, arguments);
    };

    const _Game_Interpreter_command413 = Game_Interpreter.prototype.command413;
    Game_Interpreter.prototype.command413 = function() {
        const current = this._loopCount[this._loopCount.length - 1];
        if (current !== undefined) {
            this._loopCount[this._loopCount.length - 1]++;
        }
        return _Game_Interpreter_command413.apply(this, arguments);
    };

    const _Game_Interpreter_command113 = Game_Interpreter.prototype.command113;
    Game_Interpreter.prototype.command113 = function() {
        return _Game_Interpreter_command113.apply(this, arguments);
    };
})();
