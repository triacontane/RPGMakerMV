//=============================================================================
// TimerStopInBattle.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/08/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc TimerStopInBattlePlugin
 * @author triacontane
 *
 * @param StopSwitchId
 * @desc 指定した番号のスイッチがONのときのみ戦闘中にタイマー停止します。0の場合は戦闘中は常に停止します。
 * @default 0
 * @type switch
 *
 * @param HiddenInStop
 * @desc タイマーの停止中は非表示にします。
 * @default true
 * @type boolean
 *
 * @help TimerStopInBattle.js
 *
 * 戦闘中はタイマーカウントダウンを停止します。特定のスイッチがONのときのみ
 * 停止することや、タイマー自体を非表示にすることも可能です。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦闘中タイマー停止プラグイン
 * @author トリアコンタン
 *
 * @param 停止スイッチID
 * @desc 指定した番号のスイッチがONのときのみ戦闘中にタイマー停止します。0の場合は戦闘中は常に停止します。
 * @default 0
 * @type switch
 *
 * @param 停止中非表示
 * @desc タイマーの停止中は非表示にします。
 * @default true
 * @type boolean
 *
 * @help TimerStopInBattle.js
 *
 * 戦闘中はタイマーカウントダウンを停止します。特定のスイッチがONのときのみ
 * 停止することや、タイマー自体を非表示にすることも可能です。
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
    var pluginName    = 'TimerStopInBattle';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'TRUE';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param       = {};
    param.stopSwitchId = getParamNumber(['StopSwitchId', '停止スイッチID'], 0);
    param.hiddenInStop = getParamBoolean(['HiddenInStop', '停止中非表示']);

    //=============================================================================
    // Game_Timer
    //  戦闘中はタイマーを更新しないように修正します。
    //=============================================================================
    var _Game_TimerUpdate = Game_Timer.prototype.update;
    Game_Timer.prototype.update = function(sceneActive) {
        if (!this.isStopInBattle()) {
            _Game_TimerUpdate.apply(this, arguments);
        }
    };

    Game_Timer.prototype.isStopInBattle = function() {
        return (!param.stopSwitchId || $gameSwitches.value(param.stopSwitchId)) && $gameParty.inBattle();
    };

    //=============================================================================
    // Sprite_Timer
    //  戦闘中にタイマーが停止している場合は非表示にします。
    //=============================================================================
    var _Sprite_Timer_updateVisibility = Sprite_Timer.prototype.updateVisibility;
    Sprite_Timer.prototype.updateVisibility = function() {
        _Sprite_Timer_updateVisibility.apply(this, arguments);
        if (param.hiddenInStop && $gameTimer.isStopInBattle()) {
            this.visible = false;
        }
    };
})();

