/*=============================================================================
 BattleLogSpeed.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/08/22 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc バトルログ速度調整プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleLogSpeed.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param speedVariable
 * @text 速度変数
 * @desc 指定した変数値をログメッセージスピード(フレーム数)として扱います。
 * @default 1
 * @type variable
 *
 * @help BattleLogSpeed.js
 *
 * バトルログのスピードを可変にできます。
 * パラメータからスピードを取得する変数番号を指定してください。
 * 変数値が0以下の場合は無効となり、デフォルト値(16)が採用されます。
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

    const _Window_BattleLog_messageSpeed = Window_BattleLog.prototype.messageSpeed;
    Window_BattleLog.prototype.messageSpeed = function() {
        const defaultSpeed = _Window_BattleLog_messageSpeed.apply(this, arguments);
        const speed = $gameVariables.value(param.speedVariable);
        return speed > 0 ? speed : defaultSpeed;
    };
})();
