/*=============================================================================
 SkillExistRecheck.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/08/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc スキル使用時の存在チェックプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillExistRecheck.js
 * @author トリアコンタン
 *
 * @help SkillExistRecheck.js
 *
 * スキルを使用するタイミングでスキルを保持しているかどうかを
 * 再度チェックします。保持していない場合、スキルは不発となります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_BattlerBase_meetsSkillConditionsExistRecheck = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
        return _Game_BattlerBase_meetsSkillConditionsExistRecheck.apply(this, arguments) &&
            this.hasSkillForUsing(skill.id);
    };

    Game_BattlerBase.prototype.hasSkillForUsing = function(skillId) {
        return true;
    };

    Game_Actor.prototype.hasSkillForUsing = function(skillId) {
        return this.hasSkill(skillId);
    };
})();
