/*=============================================================================
 EncounterFormula.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/05/25 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc エンカウント計算式プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EncounterFormula.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param formula
 * @text 計算式
 * @desc エンカウント率を計算するJavaScriptの式です。
 * @default Math.randomInt(n) + Math.randomInt(n) + 1;
 * @type multiline_string
 *
 * @help EncounterFormula.js
 *
 * エンカウントまでの歩数を計算する計算式を設定できます。
 * スクリプトの実行結果が、エンカウントまでの歩数になります。
 * nでマップ設定で入力した「敵出現歩数」を参照できます。
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

    const _Game_Player_makeEncounterCount = Game_Player.prototype.makeEncounterCount;
    Game_Player.prototype.makeEncounterCount = function() {
        _Game_Player_makeEncounterCount.apply(this, arguments);
        const formula = param.formula;
        if (formula) {
            const n = $gameMap.encounterStep();
            this._encounterCount = eval(formula);
        }
    };
})();
