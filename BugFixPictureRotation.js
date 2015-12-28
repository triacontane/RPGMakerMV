//=============================================================================
// BugFixPictureRotation.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2015/12/28 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ピクチャの回転バグ修正プラグイン
 * @author トリアコンタン
 *
 * @help イベントコマンド「ピクチャの回転」において、
 * 仕様では正の値を入力すると反時計回り、負の値を入力すると時計回りとあるが
 * 実際は、正の値を入力した場合のみ時計回りになる。
 * 本プラグインではその挙動を修正し、仕様通りに動作するようにします。
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

    Game_Picture.prototype.updateRotation = function() {
        if (this._rotationSpeed != 0) {
            this._angle -= this._rotationSpeed / 2;
        }
    };
})();

