//=============================================================================
// HiddenSkillsCannotUse.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.0 2023/04/01 非表示の対象外にできるスキルを設定できる機能を追加
// 1.3.0 2022/10/02 MZで動作するよう修正
// 1.2.0 2022/10/01 コスト不足無視できるフラグを追加
// 1.0.0 2016/06/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 使用不可スキルの非表示プラグイン
 * @author トリアコンタン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/HiddenSkillsCannotUse.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param ignoreCost
 * @text コスト不足は無視
 * @desc コスト不足によって使用できないスキルは本プラグインの対象外(非表示にならない)とします。
 * @default false
 * @type boolean
 *
 * @param ignoreSkills
 * @text 対象外スキルリスト
 * @desc 本プラグインの対象外(非表示にならない)スキル一覧です。
 * @default []
 * @type skill[]
 *
 * @help HiddenSkillsCannotUse.js
 *
 * 戦闘画面のスキル選択ウィンドウにおいて
 * 使用できないスキルを非表示にします。
 * メニュー画面では通常通り表示されます。
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
    if (!param.ignoreSkills) {
        param.ignoreSkills = [];
    }

    //=============================================================================
    // Window_BattleSkill
    //  使用できないスキルを非表示にします。
    //=============================================================================
    Window_BattleSkill.prototype.includes = function(item) {
        const result = Window_SkillList.prototype.includes.call(this, item);
        if (param.ignoreCost) {
            this._actor.ignoreCost();
        }
        if (param.ignoreSkills.includes(item.id) && DataManager.isSkill(item)) {
            return result;
        }
        return result && this._actor.canUse(item);
    };

    //=============================================================================
    // Game_BattlerBase
    //  コスト不足無視できるフラグを追加
    //=============================================================================
    const _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        const result = _Game_BattlerBase_canPaySkillCost.apply(this, arguments);
        if (this._ignoreCost) {
            this._ignoreCost = false;
            return true;
        } else {
            return result;
        }
    };

    Game_BattlerBase.prototype.ignoreCost = function() {
        this._ignoreCost = true;
    };
})();

