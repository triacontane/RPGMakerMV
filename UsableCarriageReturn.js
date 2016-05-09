//=============================================================================
// UsableCarriageReturn.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/05/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 改行コード使用可能プラグイン
 * @author トリアコンタン
 *
 * @help ウィンドウ中の任意の箇所で改行コードが使用可能になります。
 * データベースやメッセージウィンドウで改行したい箇所に「\n」と入力してください。
 * 主にデータベースの説明やプロフィール欄に3行目を入力したい
 * 場合に使用します。
 * すべてのウィンドウで有効です。
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

    var _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        _Window_Base_processEscapeCharacter.apply(this, arguments);
        switch (code) {
            case 'N':
                this.processNewLine(textState);
                textState.index--;
                break;
        }
    };
})();

