/*=============================================================================
 TimerExpireCustomize.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/09/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc タイマー時間切れカスタマイズプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TimerExpireCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param noAbortSwitch
 * @text 戦闘中断しない
 * @desc 指定したスイッチがONのとき、戦闘中に時間切れになっても戦闘が中断されなくなります。
 * @default 0
 * @type switch
 *
 * @param triggerSwitch
 * @text トリガースイッチ
 * @desc 時間切れになったとき、指定したスイッチが自動でONになります。
 * @default 0
 * @type switch
 *
 * @help TimerExpireCustomize.js
 *
 * タイマーが時間切れになったときに仕様を変更します。
 * ・戦闘を中断させなくする
 * ・任意のスイッチをONにする
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Timer_onExpire = Game_Timer.prototype.onExpire;
    Game_Timer.prototype.onExpire = function() {
        if ($gameSwitches.value(param.noAbortSwitch)) {
            BattleManager.abortInvalid = true;
        }
        _Game_Timer_onExpire.apply(this, arguments);
        if (param.triggerSwitch) {
            $gameSwitches.setValue(param.triggerSwitch, true);
        }
    };

    BattleManager.abortInvalid = false;
    const _BattleManager_abort = BattleManager.abort;
    BattleManager.abort = function() {
        if (this.abortInvalid) {
            this.abortInvalid = false;
            return;
        }
        _BattleManager_abort.apply(this, arguments);
    };
})();
