//=============================================================================
// DifficultyExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/05/18 弱点・耐性倍率の小数点が無視されていた問題を修正
// 1.0.0 2016/05/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 難易度選択拡張プラグイン
 * @author トリアコンタン
 *
 * @param 難易度ID変数
 * @desc 難易度IDの値が格納される変数です。
 * @default 0
 *
 * @param 難易度IDスイッチ_1
 * @desc 難易度IDが[1]のときに自動でONになるスイッチです。
 * @default 0
 * 
 * @param 難易度ID弱点倍率_1
 * @desc 難易度IDが[1]のときの弱点属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度ID耐性倍率_1
 * @desc 難易度IDが[1]のときの耐性属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度IDスイッチ_2
 * @desc 難易度IDが[2]のときに自動でONになるスイッチです。
 * @default 0
 * 
 * @param 難易度ID弱点倍率_2
 * @desc 難易度IDが[2]のときの弱点属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度ID耐性倍率_2
 * @desc 難易度IDが[2]のときの耐性属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度IDスイッチ_3
 * @desc 難易度IDが[3]のときに自動でONになるスイッチです。
 * @default 0
 * 
 * @param 難易度ID弱点倍率_3
 * @desc 難易度IDが[3]のときの弱点属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度ID耐性倍率_3
 * @desc 難易度IDが[3]のときの耐性属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度IDスイッチ_4
 * @desc 難易度IDが[4]のときに自動でONになるスイッチです。
 * @default 0
 * 
 * @param 難易度ID弱点倍率_4
 * @desc 難易度IDが[4]のときの弱点属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度ID耐性倍率_4
 * @desc 難易度IDが[4]のときの耐性属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度IDスイッチ_5
 * @desc 難易度IDが[5]のときに自動でONになるスイッチです。
 * @default 0
 * 
 * @param 難易度ID弱点倍率_5
 * @desc 難易度IDが[5]のときの弱点属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度ID耐性倍率_5
 * @desc 難易度IDが[5]のときの耐性属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度IDスイッチ_6
 * @desc 難易度IDが[6]のときに自動でONになるスイッチです。
 * @default 0
 * 
 * @param 難易度ID弱点倍率_6
 * @desc 難易度IDが[6]のときの弱点属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度ID耐性倍率_6
 * @desc 難易度IDが[6]のときの耐性属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度IDスイッチ_7
 * @desc 難易度IDが[7]のときに自動でONになるスイッチです。
 * @default 0
 * 
 * @param 難易度ID弱点倍率_7
 * @desc 難易度IDが[7]のときの弱点属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度ID耐性倍率_7
 * @desc 難易度IDが[7]のときの耐性属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度IDスイッチ_8
 * @desc 難易度IDが[8]のときに自動でONになるスイッチです。
 * @default 0
 * 
 * @param 難易度ID弱点倍率_8
 * @desc 難易度IDが[8]のときの弱点属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @param 難易度ID耐性倍率_8
 * @desc 難易度IDが[8]のときの耐性属性の攻撃を行ったときにさらに乗算される値です。
 * @default 1.0
 *
 * @help 尾角 つの様作成の難易度選択プラグインの機能を拡張します。
 * プラグイン管理画面で同プラグインより下に配置してください。
 *
 * 配布元：http://tm.lucky-duet.com/viewtopic.php?t=430
 *
 * 現在の難易度を変数・スイッチに格納します。
 * これにより、特定の難易度でのみ有効になる敵キャラのスキル等が
 * 実現できたり、難易度変数を計算式に組み込むことで、難易度によって威力の変動する
 * スキルが作成できます。
 *
 * さらに、難易度によって弱点・耐性倍率を変えられるようになります。
 * 弱点倍率を2.0に設定した難易度の場合、1.1倍の弱点属性が2.2倍になります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var Vitsuno = Vitsuno || {};

(function () {
    'use strict';
    var pluginName    = 'DifficultyExtend';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamFloat = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseFloat(value) || 0).clamp(min, max);
    };

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramDiffIdVariable     = getParamNumber(['DiffIdVariable', '難易度ID変数'], 0, 5000);
    var paramDiffIdSwitches     = [];
    var paramWeakElementRates   = [];
    var paramResistElementRates = [];
    for (var i = 1; i <= 8; i++) {
        var idString = String(i);
        paramDiffIdSwitches[i]     = getParamNumber(['DiffIdSwitch_'     + idString, '難易度IDスイッチ_' + idString], 0, 5000);
        paramWeakElementRates[i]   = getParamFloat(['WeakElementRate_'   + idString, '難易度ID弱点倍率_' + idString], 0, 5000);
        paramResistElementRates[i] = getParamFloat(['ResistElementRate_' + idString, '難易度ID耐性倍率_' + idString], 0, 5000);
    }

    if (!Vitsuno.Difficulty) {
        alert('難易度選択プラグインが有効になっていません。[' + pluginName + '.js]より上に配置してください。');
    }

    //=============================================================================
    // SceneManager
    //  初期設定時にスイッチと変数を設定します。
    //=============================================================================
    var _SceneManager_setDifficultyMutable = SceneManager.setDifficultyMutable;
    SceneManager.setDifficultyMutable = function() {
        _SceneManager_setDifficultyMutable.apply(this, arguments);
        $gameSystem.setDifficultyId($gameSystem.difficultyId());
    };

    //=============================================================================
    // Game_System
    //  対象のスイッチと変数を設定します。
    //=============================================================================
    var _Game_System_setDifficultyId = Game_System.prototype.setDifficultyId;
    Game_System.prototype.setDifficultyId = function(difficultyId) {
        _Game_System_setDifficultyId.apply(this, arguments);
        if (paramDiffIdVariable > 0) {
            $gameVariables.setValue(paramDiffIdVariable, difficultyId);
        }
        for (var i = 1, n = paramDiffIdSwitches.length + 1; i < n; i++) {
            var diffIdSwitch = paramDiffIdSwitches[i];
            if (diffIdSwitch > 0) {
                $gameSwitches.setValue(diffIdSwitch, i === difficultyId);
            }
        }
    };

    //=============================================================================
    // Game_BattlerBase
    //  弱点および耐性属性の補正を適用させます。
    //=============================================================================
    var _Game_BattlerBase_elementRate = Game_BattlerBase.prototype.elementRate;
    Game_BattlerBase.prototype.elementRate = function(elementId) {
        var result = _Game_BattlerBase_elementRate.apply(this, arguments);
        if (result > 1) {
            result *= paramWeakElementRates[$gameSystem.difficultyId()];
        } else if (result < 1) {
            result *= paramResistElementRates[$gameSystem.difficultyId()];
        }
        return result;
    };
})();

