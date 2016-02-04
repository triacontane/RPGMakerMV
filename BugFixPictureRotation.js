//=============================================================================
// BugFixPictureRotation.js
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
 * 利用規約：
 *  バグ修正プラグインにつき規約なしの無条件でご利用頂けます。
 */
(function () {
    'use strict';

    Game_Picture.prototype.updateRotation = function() {
        if (this._rotationSpeed === 0) return;
        this._angle -= this._rotationSpeed / 2;
        while (this._angle < 0) this._angle += 360;
        this._angle %= 360;
    };
})();
