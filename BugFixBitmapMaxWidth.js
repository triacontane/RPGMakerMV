//=============================================================================
// BugFixBitmapMaxWidth.js
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/03/23 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc FilefoxのdrawTextエラー修正プラグイン
 * @author トリアコンタン
 *
 * @help FilefoxでBitmap.prototype.drawTextの引数「maxWidth」に
 * 負の値が設定された場合に発生するUnknownErrorを回避します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  バグ修正プラグインなので無制限で使用できます。
 */

(function () {
    'use strict';

    var _Bitmap_drawText = Bitmap.prototype.drawText;
    Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
        if (arguments[3] < 0) arguments[3] = 0;
        _Bitmap_drawText.apply(this, arguments);
    };
})();

