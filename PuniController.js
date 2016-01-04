//=============================================================================
// PuniController.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/01/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc プラグイン名称が未入力です。
 * @author トリアコンタン
 *
 * @param パラメータ
 * @desc パラメータ説明
 * @default デフォルト値
 *
 * @help プラグイン説明が未入力です。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    'use strict';
    var pluginName = 'PuniController';

    Bitmap.prototype.fillRect = function(x, y, width, height, color) {
        var context = this._context;
    };

    //=============================================================================
    // Game_PuniController
    //  PuniController
    //=============================================================================
    function Game_PuniController() {
        this.initialize.apply(this, arguments);
    }

    Game_PuniController.prototype.initialize = function() {
        this._dragX = 0;
        this._dragY = 0;
        this._x = 0;
        this._y = 0;
    };

    Game_PuniController.prototype.updateDragMove = function() {
        if (this.isTriggered() || (this._holding && TouchInput.isPressed())) {
            this._x = TouchInput.x;
            this._y = TouchInput.y;
            if (!this._holding) this.hold();
        } else if (this._holding) {
            this.release();
        }
    };

    Game_PuniController.prototype.hold = function() {
        this._holding = true;
        this._dragX = this._x;
        this._dragY = this._y;
    };

    Game_PuniController.prototype.release = function() {
        this._holding = false;
        this._dragX = 0;
        this._dragY = 0;
    };

    Game_PuniController.prototype.dir4 = function() {

    };
})();

