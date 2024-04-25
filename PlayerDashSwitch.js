/*=============================================================================
 PlayerDashSwitch.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/04/25 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc プレイヤーダッシュスイッチプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PlayerDashSwitch.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param dashSwitch
 * @text ダッシュスイッチ
 * @desc プレイヤーがダッシュしている間だけONになるスイッチ番号です。
 * @default 0
 * @type switch
 *
 * @param jumpSwitch
 * @text ジャンプスイッチ
 * @desc プレイヤーがジャンプしている間だけONになるスイッチ番号です。
 * @default 0
 * @type switch
 *
 * @help PlayerDashSwitch.js
 *
 * マップ上でプレイヤーキャラクターがダッシュもしくはジャンプしている間だけ
 * スイッチをONにできます。
 * DynamicActorGraphic.jsと組み合わせることで、ダッシュやジャンプ時に
 * アクターグラフィックを変更したりできます。
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

    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.apply(this, arguments);
        this.updateDashJumpSwitch(param.dashSwitch, this.isDashing());
        this.updateDashJumpSwitch(param.jumpSwitch, this.isJumping());
    };

    Game_Player.prototype.updateDashJumpSwitch = function(switchId, newValue) {
        if (switchId > 0) {
            const prevValue = $gameSwitches.value(switchId);
            if (newValue !== prevValue) {
                $gameSwitches.setValue(switchId, newValue);
                if ($gameParty.refreshMemberCustomGraphic) {
                    $gameParty.refreshMemberCustomGraphic();
                }
            }
        }
    };
})();
