/*=============================================================================
 TextScriptBaseFormulaAttachment.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/07/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc TextScriptBaseの計算式アタッチメント
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TextScriptBaseFormulaAttachment.js
 * @base TextScriptBase
 * @orderAfter TextScriptBase
 * @author トリアコンタン
 *
 * @help TextScriptBaseFormulaAttachment.js
 *
 * 公式プラグイン『TextScriptBase』の効果を
 * スキルやアイテムの計算式にも適用するアタッチメントです。
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

    const _Game_Action_evalDamageFormula = Game_Action.prototype.evalDamageFormula;
    Game_Action.prototype.evalDamageFormula = function(target) {
        const item = this.item();
        const formula = item.damage.formula;
        item.damage.formula = PluginManagerEx.convertEscapeCharacters(formula);
        const result = _Game_Action_evalDamageFormula.apply(this, arguments);
        item.damage.formula = formula;
        return result;
    };
})();
