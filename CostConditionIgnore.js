/*=============================================================================
 CostConditionIgnore.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2019/09/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc CostConditionIgnorePlugin
 * @target MZ @author triacontane
 *
 * @help CostConditionIgnore.js
 *
 * 戦闘時、MPやTPなどのコスト条件を無視してスキルを選択できるよう仕様変更します。
 * コスト不足によりスキルが発動できない場合、対象者は何も行動しません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦闘時のコスト条件無視プラグイン
 * @target MZ @author トリアコンタン
 *
 * @help CostConditionIgnore.js
 *
 * 戦闘時、MPやTPなどのコスト条件を無視してスキルを選択できるよう仕様変更します。
 * コスト不足によりスキルが発動できない場合、対象者は何も行動しません。
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

    Game_Party.prototype.isCostIgnore = function() {
        return this.inBattle();
    };

    var _Game_BattlerBase_canPaySkillCost      = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        if (this._ignoreCostCheck) {
            return true;
        } else {
            return _Game_BattlerBase_canPaySkillCost.apply(this, arguments);
        }
    };

    Game_BattlerBase.prototype.ignoreCostCheckOnlyProcess = function(process) {
        if ($gameParty.isCostIgnore()) {
            this._ignoreCostCheck = true;
            var result = process();
            this._ignoreCostCheck = false;
            return result;
        } else {
            return process();
        }
    };

    var _Window_SkillList_isEnabled      = Window_SkillList.prototype.isEnabled;
    Window_SkillList.prototype.isEnabled = function(item) {
        if (this._actor) {
            return this._actor.ignoreCostCheckOnlyProcess(_Window_SkillList_isEnabled.bind(this, item))
        } else {
            return _Window_SkillList_isEnabled.apply(this, arguments);
        }
    };
})();
