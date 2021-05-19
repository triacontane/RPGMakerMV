/*=============================================================================
 StepsForTurn.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/05/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ターン経過歩数変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StepsForTurn.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param turn
 * @text ターン経過歩数
 * @desc 1ターン経過歩数です。
 * @default 20
 * @type number
 * @min 1
 *
 * @help StepsForTurn.js
 *
 * 1ターン経過と認識される歩数(通常20歩)を変更できます。
 * 主にステートによるスリップダメージの頻度が変わります。
 * パラメータから調整してください。
 *　
 * このプラグインにはプラグインコマンドはありません。
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

    const _Game_Actor_stepsForTurn = Game_Actor.prototype.stepsForTurn;
    Game_Actor.prototype.stepsForTurn = function() {
        return param.turn || _Game_Actor_stepsForTurn.apply(this, arguments);
    };
})();
