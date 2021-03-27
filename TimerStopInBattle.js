//=============================================================================
// TimerStopInBattle.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2021/03/28 MZで動作するよう修正
// 1.0.0 2017/08/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc TimerStopInBattle
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TimerStopInBattle.js
 * @base PluginCommonBase
 * @author Triacontane
 *
 * @param StopSwitchId
 * @desc The timer will stop during battle only when the switch with the specified number is ON.
 * @default 0
 * @type switch
 *
 * @param HiddenInStop
 * @desc Hides the timer when it is stopped.
 * @default true
 * @type boolean
 *
 * @help TimerStopInBattle.js
 *
 * The timer countdown is stopped during combat.
 * It can be stopped only when a specific switch is turned on,
 * or the timer itself can be hidden.
 */
/*:ja
 * @plugindesc 戦闘中タイマー停止プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TimerStopInBattle.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param StopSwitchId
 * @text 停止スイッチID
 * @desc 指定した番号のスイッチがONのときのみ戦闘中にタイマー停止します。0の場合は戦闘中は常に停止します。
 * @default 0
 * @type switch
 *
 * @param HiddenInStop
 * @text 停止中非表示
 * @desc タイマーの停止中は非表示にします。
 * @default true
 * @type boolean
 *
 * @help TimerStopInBattle.js
 *
 * 戦闘中はタイマーカウントダウンを停止します。特定のスイッチがONのときのみ
 * 停止することや、タイマー自体を非表示にすることも可能です。
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Timer
    //  戦闘中はタイマーを更新しないように修正します。
    //=============================================================================
    const _Game_TimerUpdate = Game_Timer.prototype.update;
    Game_Timer.prototype.update = function(sceneActive) {
        if (!this.isStopInBattle()) {
            _Game_TimerUpdate.apply(this, arguments);
        }
    };

    Game_Timer.prototype.isStopInBattle = function() {
        return (!param.StopSwitchId || $gameSwitches.value(param.StopSwitchId)) && $gameParty.inBattle();
    };

    //=============================================================================
    // Sprite_Timer
    //  戦闘中にタイマーが停止している場合は非表示にします。
    //=============================================================================
    const _Sprite_Timer_updateVisibility = Sprite_Timer.prototype.updateVisibility;
    Sprite_Timer.prototype.updateVisibility = function() {
        _Sprite_Timer_updateVisibility.apply(this, arguments);
        if (param.HiddenInStop && $gameTimer.isStopInBattle()) {
            this.visible = false;
        }
    };
})();

