/*=============================================================================
 MessageAlignCenter.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2021/08/01 他プラグインと制御文字が被ったときに備えて、パラメータから制御文字を変更できる機能を追加
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
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param escapeCharacterCenter
 * @text 中央揃えの制御文字
 * @desc メッセージを中央揃えにする制御文字です。通常はそのままで使えますが、他プラグインと競合する場合は変更してください。
 * @default ac
 *
 * @param escapeCharacterRight
 * @text 右揃えの制御文字
 * @desc メッセージを右揃えにする制御文字です。通常はそのままで使えますが、他プラグインと競合する場合は変更してください。
 * @default ar
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
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        if (textState.drawing) {
            switch (code) {
                case this.findEscapeCenter():
                    textState.x += this.findInnerSpace(textState) / 2;
                    break;
                case this.findEscapeRight():
                    textState.x += this.findInnerSpace(textState);
                    break;
            }
        }
        _Window_Base_processEscapeCharacter.apply(this, arguments);
    };

    Window_Base.prototype.findEscapeCenter = function() {
        return (param.escapeCharacterCenter || 'AC').toUpperCase();
    };

    Window_Base.prototype.findEscapeRight = function() {
        return (param.escapeCharacterRight || 'AR').toUpperCase();
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
