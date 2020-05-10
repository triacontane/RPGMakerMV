/*=============================================================================
 BattleToneTemporary.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/05/11 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc BattleToneTemporaryPlugin
 * @author triacontane
 *
 * @help BattleToneTemporary.js
 *
 * Temporalize the color tone during combat by separating
 * it from the map.
 * It is initialized at the start of the battle,
 * and when the battle ends
 * It will return to the color tone you have specified
 * on the map.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦闘時の色調の一時化プラグイン
 * @author トリアコンタン
 *
 * @help BattleToneTemporary.js
 *
 * 戦闘中の色調をマップと切り離して一時化します。
 * 戦闘開始時に初期化され、戦闘が終了すると
 * マップ上で指定していた色調に戻ります。
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

    //=============================================================================
    // Game_Screen
    //  色調を保持、復帰する機能を実装します。
    //=============================================================================
    Game_Screen.prototype.saveTone = function() {
        this._prevTone = this._tone;
        this._tone = [0, 0, 0, 0];
    };

    Game_Screen.prototype.restoreTone = function() {
        if (this._prevTone) {
            this._tone = this._prevTone;
        }
    };

    //=============================================================================
    // Scene_Battle
    //  戦闘中にマップの色調変更が反映されなくなります。
    //=============================================================================
    var _Scene_Battle_start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function() {
        $gameScreen.saveTone();
        _Scene_Battle_start.apply(this, arguments);
    };

    var _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        $gameScreen.restoreTone();
        _Scene_Battle_terminate.apply(this, arguments);
    };
})();
