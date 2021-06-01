/*=============================================================================
 BattleEndMessage.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2021/06/02 メッセージの表示タイミングを『ゴールド獲得の直後』に表示できる設定を追加
 1.0.0 2021/05/31 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 戦闘終了メッセージプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleEndMessage.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param victoryMessage
 * @text 勝利メッセージ
 * @desc 戦闘勝利時に表示するメッセージです。
 * @default
 * @type multiline_string
 *
 * @param conditionSwitch
 * @text 条件スイッチ
 * @desc 指定した場合、スイッチがONのときだけメッセージが表示されます。
 * @default 0
 * @type switch
 *
 * @param timing
 * @text 表示タイミング
 * @desc メッセージの表示タイミングです。
 * @default 0
 * @type select
 * @option 勝利メッセージの直後
 * @value 0
 * @option 報酬獲得メッセージの直後
 * @value 1
 * @option ゴールド獲得メッセージの直後
 * @value 2
 *
 * @param newPage
 * @text ページ送り
 * @desc 追加メッセージの表示前にページ送りします。
 * @default true
 * @type boolean
 *
 * @help BattleEndMessage.js
 *
 * 戦闘終了時に追加でメッセージを表示できます。
 * スイッチがONのときだけメッセージ表示することも可能です。
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

    const _BattleManager_displayVictoryMessage = BattleManager.displayVictoryMessage;
    BattleManager.displayVictoryMessage = function() {
        _BattleManager_displayVictoryMessage.apply(this, arguments);
        if (param.timing === 0) {
            this.displayVictoryCustom();
        }
    };

    const _BattleManager_displayGold = BattleManager.displayGold;
    BattleManager.displayGold = function() {
        _BattleManager_displayGold.apply(this, arguments);
        if (param.timing === 2) {
            this.displayVictoryCustom();
        }
    };

    const _BattleManager_displayRewards = BattleManager.displayRewards;
    BattleManager.displayRewards = function() {
        _BattleManager_displayRewards.apply(this, arguments);
        if (param.timing === 1) {
            this.displayVictoryCustom();
        }
    };

    BattleManager.displayVictoryCustom = function() {
        if (param.conditionSwitch && !$gameSwitches.value(param.conditionSwitch)) {
            return;
        }
        if (param.newPage) {
            $gameMessage.newPage();
        }
        $gameMessage.add(param.victoryMessage);
    };
})();
