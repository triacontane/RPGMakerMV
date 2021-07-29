/*=============================================================================
 MessageAlignCenter.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2021/07/29 リファクタリング
 1.0.0 2021/07/28 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc メッセージの中央揃えプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageAlignCenter.js
 * @author トリアコンタン
 *
 * @help MessageAlignCenter.js
 *
 * 文章の表示などのメッセージやスキルの説明文などを中央揃え、右揃えにできます。
 * 以下の制御文字を行の先頭に記述すると揃えを変更できます。
 * \ac : 中央揃え
 * \ar : 右揃え
 *
 * メッセージのプレビューには反映されません。
 * 制御文字は必ず行の先頭に記述してください。
 * 右読み言語には現バージョンでは対応していません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        if (textState.drawing) {
            switch (code) {
                case "AC":
                    textState.x += this.findInnerSpace(textState) / 2;
                    break;
                case "AR":
                    textState.x += this.findInnerSpace(textState);
                    break;
            }
        }
        _Window_Base_processEscapeCharacter.apply(this, arguments);
    };

    Window_Base.prototype.findInnerSpace = function(textState) {
        return this.innerWidth - this.textSizeEx(this.findLineText(textState)).width - textState.startX;
    };

    Window_Base.prototype.findLineText = function(textState) {
        let text = '';
        let index = textState.index;
        while (textState.text[index] !== '\n' && !!textState.text[index]) {
            text += textState.text[index++];
        }
        return text;
    };
})();
