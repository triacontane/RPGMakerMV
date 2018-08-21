/*=============================================================================
 BugFixMapDisplayPos.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2018/08/22 座標が1/8単位になるよう微修正
 1.0.0 2018/08/21 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc BugFixMapDisplayPosPlugin
 * @author triacontane
 *
 * @help BugFixMapDisplayPos.js
 *
 * 画面サイズの横幅もしくは縦幅を「6で除算した余りが2になる値(※1)」に
 * 設定したとき、キャラクター座標が1ピクセルずれることがある不具合を修正します。
 * ※1 1280など
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 画面サイズ変更時のイベント座標ずれ修正プラグイン
 * @author トリアコンタン
 *
 * @help BugFixMapDisplayPos.js
 *
 * 画面サイズの横幅もしくは縦幅を「6で除算した余りが2になる値(※1)」に
 * 設定したとき、キャラクター座標が1ピクセルずれることがある不具合を修正します。
 * ※1 1280など
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

    var _Game_Map_screenTileX = Game_Map.prototype.screenTileX;
    Game_Map.prototype.screenTileX = function() {
        return Math.round(_Game_Map_screenTileX.apply(this, arguments) * 8) / 8;
    };

    var _Game_Map_screenTileY = Game_Map.prototype.screenTileY;
    Game_Map.prototype.screenTileY = function() {
        return Math.round(_Game_Map_screenTileY.apply(this, arguments) * 8) / 8;
    };

    var _Game_Player_centerX = Game_Player.prototype.centerX;
    Game_Player.prototype.centerX = function() {
        return Math.round(_Game_Player_centerX.apply(this, arguments) * 8) / 8;
    };

    var _Game_Player_centerY = Game_Player.prototype.centerY;
    Game_Player.prototype.centerY = function() {
        return Math.round(_Game_Player_centerY.apply(this, arguments) * 8) / 8;
    };
})();
