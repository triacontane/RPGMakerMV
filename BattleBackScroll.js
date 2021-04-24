/*=============================================================================
 BattleBackScroll.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/04/25 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc BattleBackScrollPlugin
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleBackScroll.js
 * @author triacontane
 *
 * @param Back1SpeedX
 * @desc Variable number for obtaining the scroll speed in the X direction for Combat Background 1.
 * @default 0
 * @type variable
 *
 * @param Back1SpeedY
 * @desc Variable number for obtaining the scroll speed in the Y direction for Combat Background 2.
 * @default 0
 * @type variable
 *
 * @param Back2SpeedX
 * @desc Variable number for obtaining the scroll speed in the X direction for Combat Background 1.
 * @default 0
 * @type variable
 *
 * @param Back2SpeedY
 * @desc Variable number for obtaining the scroll speed in the Y direction for Combat Background 2.
 * @default 0
 * @type variable
 *
 * @help BattleBackScroll.js
 *
 * Scrolls the battle background.
 * Set the variable number to get the scroll speed
 * of background 1 and background 2 from the
 * parameters respectively.
 *
 * The base plugin "PluginCommonBase.js" is required to use this plugin.
 * The "PluginCommonBase.js" is here.
 * (MZ install path)dlc/BasicResources/plugins/official/PluginCommonBase.js
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦闘背景スクロールプラグイン
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleBackScroll.js
 * @author トリアコンタン
 *
 * @param Back1SpeedX
 * @text 戦闘背景1のX速度
 * @desc 戦闘背景1のX方向のスクロール速度を取得する変数番号
 * @default 0
 * @type variable
 *
 * @param Back1SpeedY
 * @text 戦闘背景1のY速度
 * @desc 戦闘背景1のY方向のスクロール速度を取得する変数番号
 * @default 0
 * @type variable
 *
 * @param Back2SpeedX
 * @text 戦闘背景2のX速度
 * @desc 戦闘背景2のX方向のスクロール速度を取得する変数番号
 * @default 0
 * @type variable
 *
 * @param Back2SpeedY
 * @text 戦闘背景2のY速度
 * @desc 戦闘背景2のY方向のスクロール速度を取得する変数番号
 * @default 0
 * @type variable
 *
 * @help BattleBackScroll.js
 *
 * 戦闘背景をスクロール表示します。
 * 背景1と背景2のスクロール速度を取得する変数番号を
 * それぞれパラメータから設定してください。
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

    const _Spriteset_Battle_updateBattleback = Spriteset_Battle.prototype.updateBattleback;
    Spriteset_Battle.prototype.updateBattleback = function() {
        _Spriteset_Battle_updateBattleback.apply(this, arguments);
        this._back1Sprite.origin.x += $gameVariables.value(param.Back1SpeedX);
        this._back1Sprite.origin.y += $gameVariables.value(param.Back1SpeedY);
        this._back2Sprite.origin.x += $gameVariables.value(param.Back2SpeedX);
        this._back2Sprite.origin.y += $gameVariables.value(param.Back2SpeedY);
    }
})();
