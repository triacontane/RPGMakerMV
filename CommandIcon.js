//=============================================================================
// CommandIcon.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2021/08/22 MZで動作するよう修正
// 1.0.1 2016/03/07 オプション画面のレイアウトが崩れる問題を修正
// 1.0.0 2016/03/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc アイコン付きコマンドプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CommandIcon.js
 * @author トリアコンタン
 *
 * @help CommandIcon.js
 *
 * メニューやタイトルのコマンドにアイコンが付けられるようになります。
 * 正確にはコマンドに制御文字が使えるようになりますので
 * 文章の表示と同じ要領でアイコンを設定したり、文字色を変えたりできます。
 * ただし、横幅をはみ出した場合に文字を自動で縮小する機能は無効となります。
 *
 * 対象ウィンドウ
 * ・タイトルコマンド
 * ・メインメニュー
 * ・アクターコマンド
 * ・パーティコマンド
 * ・オプション
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';

    Window_Command.prototype.drawText = function(text, x, y, width, align) {
        if (align !== 'left') {
            const textWidth = this.textSizeEx(text).width;
            x += (width - textWidth) / (align === 'center' ? 2 : 1);
        }
        this.drawTextEx(text, x, y);
    };
})();
