/*=============================================================================
 MessageAlignCenter.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.2 2021/10/08 1.2.1の修正により、\c[n]などの制御文字が文字幅としてカウントされ揃え位置がズレてしまう問題を修正
 1.2.1 2021/09/24 ウェイト系の制御文字を使ったときに、正常な動作をしなくなる問題を修正
 1.2.0 2021/09/19 縦方向の揃えを中央揃え、下揃えにする機能を追加
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
 * @param escapeCharacterVCenter
 * @text 縦中央揃えの制御文字
 * @desc メッセージを縦方向中央揃えにする制御文字です。通常はそのままで使えますが、他プラグインと競合する場合は変更してください。
 * @default vc
 *
 * @param escapeCharacterVBottom
 * @text 縦下揃えの制御文字
 * @desc メッセージを縦方向下揃えにする制御文字です。通常はそのままで使えますが、他プラグインと競合する場合は変更してください。
 * @default vb
 *
 * @help MessageAlignCenter.js
 *
 * 文章の表示などのメッセージやスキルの説明文などを中央揃え、右揃えにできます。
 * 以下の制御文字を行の先頭に記述すると揃えを変更できます。
 * \ac : 中央揃え
 * \ar : 右揃え
 * \vc : 縦方向の中央揃え
 * \vb : 縦方向の下揃え
 *
 * メッセージのプレビューには反映されません。
 * 制御文字は必ず行の先頭に記述してください。
 * 縦方向揃えは、いち文章につきひとつだけ指定できます。
 * 必ず文章の先頭に記述してください。
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
                case this.findEscapeVCenter():
                    textState.y += this.findInnerVSpace(textState) / 2;
                    break;
                case this.findEscapeVBottom():
                    textState.y += this.findInnerVSpace(textState);
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

    Window_Base.prototype.findEscapeVCenter = function() {
        return (param.escapeCharacterVCenter || 'VC').toUpperCase();
    };

    Window_Base.prototype.findEscapeVBottom = function() {
        return (param.escapeCharacterVBottom || 'VB').toUpperCase();
    };

    Window_Base.prototype.findInnerSpace = function(textState) {
        return this.innerWidth - this.textSizeEx(this.findLineText(textState)).width - textState.startX;
    };

    Window_Base.prototype.findInnerVSpace = function(textState) {
        return this.innerHeight - this.textSizeEx(textState.text).height - textState.startY;
    };

    Window_Base.prototype.findLineText = function(textState) {
        let text = '';
        let index = textState.index;
        while (textState.text[index] !== '\n' && !!textState.text[index]) {
            text += textState.text[index++];
        }
        return text;
    };

    const _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (!textState.drawing) {
            Window_Base.prototype.processEscapeCharacter.apply(this, arguments);
            this.changeTextColor(ColorManager.textColor(0));
            return;
        }
        _Window_Message_processEscapeCharacter.apply(this, arguments);
    };
})();
