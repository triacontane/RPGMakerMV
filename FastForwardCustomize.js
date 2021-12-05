//=============================================================================
// FastForwardCustomize.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2021/12/05 イベント高速化が無効のときはメッセージスキップも無効にできる設定を追加
// 1.1.0 2021/01/17 MZ向けにリファクタリング
// 1.0.0 2017/07/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc FastForwardCustomizePlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FastForwardCustomize.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param eventSpeedVariableId
 * @desc Variable number to get the speed at event acceleration.
 * @default 0
 * @type variable
 *
 * @param disableMessageSkip
 * @desc When the event speed is 0, message skipping is also disabled.
 * @default false
 * @type boolean
 *
 * @help FastForwardCustomize.js
 *
 * This function allows you to adjust the fast forward of event acceleration.
 * The speed at which the event is accelerated changes depending on the value of the specified variable.
 * The speed changes as follows depending on the value of the variable.
 * 0 : Fast forward is disabled.
 * 1 : This is the default speed.
 * 2+ : The higher the value, the faster the speed. If an abnormally high value is set, processing will fail.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc イベント高速化調整プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FastForwardCustomize.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param eventSpeedVariableId
 * @text イベント速度変数
 * @desc イベント高速化時の速度を取得する変数番号です。変数値が0なら高速化禁止、数値が大きくなると速度も速くなります。
 * @default 0
 * @type variable
 *
 * @param disableMessageSkip
 * @text メッセージスキップ禁止
 * @desc イベント速度が0のときはメッセージスキップも禁止にします。
 * @default false
 * @type boolean
 *
 * @help FastForwardCustomize.js
 *
 * イベント高速化時の速度を調整できます。
 * 指定した変数の値によって高速化時の速度が変化します。
 * 変数値によって以下の通り変化します。
 * 0  : 高速化が禁止されます。
 * 1  : デフォルトの速度です。
 * 2+ : 数値が高いほど高速になります。異常に高い値を設定すると処理落ちします。
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

(function() {
    'use strict';

    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Scene_Map_updateMainMultiply = Scene_Map.prototype.updateMainMultiply;
    Scene_Map.prototype.updateMainMultiply = function() {
        _Scene_Map_updateMainMultiply.apply(this, arguments);
        if (this.isFastForward()) {
            this.updateMainForMoreFast();
        }
    };

    Scene_Map.prototype.updateMainForMoreFast = function() {
        const updateCount = $gameMap.getFastSpeed() - 1;
        for (let i = 0; i < updateCount; i++) {
            this.updateMain();
        }
    };

    const _Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;
    Scene_Map.prototype.isFastForward = function() {
        return _Scene_Map_isFastForward.apply(this, arguments) && $gameMap.getFastSpeed() > 0;
    };

    Game_Map.prototype.getFastSpeed = function() {
        return param.eventSpeedVariableId > 0 ? $gameVariables.value(param.eventSpeedVariableId) : 1;
    };

    const _Window_Message_updateShowFast = Window_Message.prototype.updateShowFast;
    Window_Message.prototype.updateShowFast = function() {
        _Window_Message_updateShowFast.apply(this, arguments);
        if (param.disableMessageSkip && $gameMap.getFastSpeed() === 0) {
            this._showFast = false;
        }
    };
})();

