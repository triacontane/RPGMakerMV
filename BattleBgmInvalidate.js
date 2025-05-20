/*=============================================================================
 BattleBgmInvalidate.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/05/21 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 戦闘BGMの無効化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleBgmInvalidate.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param switchId
 * @text 条件スイッチ
 * @desc 指定したスイッチがONのとき、戦闘BGMが無効となります。指定がない場合、常に無効になります。
 * @default 1
 * @type switch
 *
 * @param invalidateMe
 * @text 勝利ME無効化
 * @desc 条件を満たしているとき、戦闘BGMだけでなく勝利MEも同時に無効にします。
 * @default true
 * @type boolean
 *
 * @help BattleBgmInvalidate.js
 *
 * 指定したスイッチがONのとき、戦闘BGMおよび勝利MEが再生が無効になります。
 * 戦闘画面でもマップBGMおよびマップBGSを再生しつづけます。
 *
 * 戦闘イベントでBGMを変更した場合、マップにも引き継がれます。
 * また、敗北MEは通常通り再生されます。
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

    BattleManager.isValidBattleBgm = function() {
        return param.switchId && !$gameSwitches.value(param.switchId);
    };

    const _BattleManager_playBattleBgm = BattleManager.playBattleBgm;
    BattleManager.playBattleBgm = function() {
        if (this.isValidBattleBgm()) {
            _BattleManager_playBattleBgm.apply(this, arguments);
        }
    };

    const _BattleManager_playVictoryMe = BattleManager.playVictoryMe;
    BattleManager.playVictoryMe = function() {
        if (this.isValidBattleBgm() || !param.invalidateMe) {
            _BattleManager_playVictoryMe.apply(this, arguments);
        }
    };

    const _BattleManager_replayBgmAndBgs = BattleManager.replayBgmAndBgs;
    BattleManager.replayBgmAndBgs = function() {
        if (this.isValidBattleBgm()) {
            _BattleManager_replayBgmAndBgs.apply(this, arguments);
        }
    };

    const _Scene_Map_stopAudioOnBattleStart = Scene_Map.prototype.stopAudioOnBattleStart;
    Scene_Map.prototype.stopAudioOnBattleStart = function() {
        if (BattleManager.isValidBattleBgm()) {
            _Scene_Map_stopAudioOnBattleStart.apply(this, arguments);
        }
    };
})();
