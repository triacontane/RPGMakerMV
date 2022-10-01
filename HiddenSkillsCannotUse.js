//=============================================================================
// HiddenSkillsCannotUse.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2022/10/01 コスト不足無視できるフラグを追加
// 1.0.0 2016/06/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 使用不可スキルの非表示
 * @author トリアコンタン
 *
 * @param ignoreCost
 * @text コスト不足は無視
 * @desc コスト不足によって使用できないスキルは本プラグインの対象外(非表示にならない)とします。
 * @default false
 * @type boolean
 *
 * @help 戦闘画面のスキル選択ウィンドウにおいて
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

(function() {
    'use strict';
    var pluginName    = 'HiddenSkillsCannotUse';

    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter(pluginName);

    //=============================================================================
    // Window_BattleSkill
    //  使用できないスキルを非表示にします。
    //=============================================================================
    Window_BattleSkill.prototype.includes = function(item) {
        if (param.ignoreCost) {
            this._actor.ignoreCost();
        }
        return Window_SkillList.prototype.includes.call(this, item) && this._actor.canUse(item);
    };

    //=============================================================================
    // Game_BattlerBase
    //  コスト不足無視できるフラグを追加
    //=============================================================================
    var _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        var result = _Game_BattlerBase_canPaySkillCost.apply(this, arguments);
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

