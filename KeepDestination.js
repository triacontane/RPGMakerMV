//=============================================================================
// KeepDestination.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/01/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc KeepDestinationPlugin
 * @author triacontane
 *
 * @help KeepDestination.js
 *
 * タッチ移動中にイベントが実行された場合でもタッチ移動が
 * 中断されなくなります。
 * ただし、進行方向が通行不可だった場合は停止します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc タッチ移動先の保持プラグイン
 * @author トリアコンタン
 *
 * @help KeepDestination.js
 *
 * タッチ移動中にイベントが実行された場合でもタッチ移動が
 * 中断されなくなります。
 * ただし、進行方向が通行不可だった場合は停止します。
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
    // Scene_Map
    //=============================================================================
    var _Scene_Map_updateDestination = Scene_Map.prototype.updateDestination;
    Scene_Map.prototype.updateDestination = function() {
        if ($gamePlayer.canPassStraight() && !$gamePlayer.isTransferring()) {
            $gameTemp.keepDestination();
        }
        _Scene_Map_updateDestination.apply(this, arguments);
        $gameTemp.clearKeepDestination();
    };

    //=============================================================================
    // Game_Temp
    //=============================================================================
    Game_Temp.prototype.keepDestination = function() {
        this._keepDestination = true;
    };

    Game_Temp.prototype.clearKeepDestination = function() {
        this._keepDestination = false;
    };

    var _Game_Temp_clearDestination = Game_Temp.prototype.clearDestination;
    Game_Temp.prototype.clearDestination = function() {
        if (this._keepDestination) {
            return;
        }
        _Game_Temp_clearDestination.apply(this, arguments);
    };

    //=============================================================================
    // Game_CharacterBase
    //=============================================================================
    Game_CharacterBase.prototype.canPassStraight = function() {
        return this.canPass(this.x, this.y, this.direction());
    };
})();
