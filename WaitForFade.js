//=============================================================================
// WaitForFade.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/10/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc WaitForFadePlugin
 * @author triacontane
 *
 * @help 場所移動の際のフェードイン・フェードアウト中は
 * イベント実行中でなくても移動を禁止します。
 *
 * このプラグインにはプラグインコマンドはありません。
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc フェード中移動禁止プラグイン
 * @author トリアコンタン
 *
 * @help 場所移動の際のフェードイン・フェードアウト中は
 * イベント実行中でなくても移動を禁止します。
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
    // SceneManager
    //  シーンクラスのビジー状態を返します。
    //=============================================================================
    SceneManager.isBusy = function() {
        return this._scene.isBusy();
    };

    //=============================================================================
    // Game_Player
    //  シーンクラスのビジー状態のときに移動を禁止します。
    //=============================================================================
    var _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        return _Game_Player_canMove.apply(this, arguments) && !SceneManager.isBusy();
    };
})();

