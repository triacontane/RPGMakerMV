/*=============================================================================
 SkillFunctionTemplate.js
=============================================================================*/

/*:
 * @plugindesc スキル関数テンプレート
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillFunctionTemplate.js
 *
 * @help SkillFunctionTemplate.js
 *　
 * スキルのダメージ計算式をプラグイン化するためのテンプレートです。
 * 計算式で以下を呼ぶとサンプルの関数が呼ばれます。
 * this.funcSample(b)
 *
 * 利用にはJavaScriptの知識が必要です。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    Game_Action.prototype.funcSample = function(b) {
        const item = this.item();
        const a = this.subject();
        const v = $gameVariables._data;
        // FIXME 計算結果を返すよう修正してください。
        console.log('funcSample called!');
        return 100;
    };
})();
