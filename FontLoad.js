//=============================================================================
// FontLoad.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.2.1 2022/11/26 ヘルプ微修正
// 2.2.0 2022/08/28 メッセージ中に一時的にフォントを変更できる機能を追加
// 2.1.0 2022/06/19 メッセージフォントを変更できるプラグインコマンドを追加
// 2.0.1 2021/10/20 ヘルプ微修正
// 2.0.0 2021/06/05 MZで動作するよう再構築
// 1.1.1 2019/09/15 パラメータの型指定機能に対応
// 1.1.0 2017/03/11 本体v1.3.5(コミュニティ版)で機能しなくなる問題を修正
// 1.0.0 2016/06/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc フォントロードプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FontLoad.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param fontList
 * @text フォント一覧
 * @desc 使用するフォントの一覧です。
 * @default []
 * @type struct<Font>[]
 *
 * @command CHANGE_MESSAGE_FONT
 * @text メッセージフォント変更
 * @desc メッセージ表示のフォントを変更します。
 *
 * @arg name
 * @text フォント名
 * @desc 変更するフォントの名称です。
 * @default
 *
 * @help 指定したURLのフォントを指定した名前でロードします。
 * ロードするだけなので、基本的には他のプラグインやスクリプトと
 * 組み合わせて使用します。
 *
 * メッセージフォントの変更だけはプラグインコマンドと制御文字を用意しています。
 * メッセージ中に以下の制御文字が使用できます。
 * ・nameで指定したフォント名に一時的に変更
 * \fn[name]
 *
 * ・デフォルトのフォントに戻す
 * \fn
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

/*~struct~Font:
 *
 * @param name
 * @text 名称
 * @desc 利用側から指定する際に使うフォントの名称です。省略するとフォントファイルから拡張子を除いた名称になります。
 * @default
 *
 * @param fileName
 * @text ファイル名
 * @desc フォントのファイル名です。fontフォルダ配下のwoffファイルを拡張子付きで指定してください。
 * @default
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'CHANGE_MESSAGE_FONT', args => {
        $gameMessage.setFontFace(args.name);
    });

    const _Scene_Boot_loadGameFonts = Scene_Boot.prototype.loadGameFonts;
    Scene_Boot.prototype.loadGameFonts = function() {
        _Scene_Boot_loadGameFonts.apply(this, arguments);
        param.fontList.forEach(font => {
            const name = font.name || font.fileName.replace(/\..*/, '');
            FontManager.load(name, font.fileName);
        });
    };

    const _Window_Message_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        _Window_Message_newPage.apply(this, arguments);
        if ($gameMessage.getFontFace()) {
            this.contents.fontFace = $gameMessage.getFontFace();
        }
    };

    const _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        _Window_Message_processEscapeCharacter.apply(this, arguments);
        if (code === 'FN') {
            const font = this.obtainEscapeParamForFontLoad(textState);
            this.contents.fontFace = font ? font : $gameSystem.mainFontFace();
        }
    };

    Window_Message.prototype.obtainEscapeParamForFontLoad = function(textState) {
        const arr = /^\[.+?]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[0].substring(1, arr[0].length - 1);
        } else {
            return '';
        }
    };

    Game_Message.prototype.getFontFace = function() {
        return this._faceFace;
    };

    Game_Message.prototype.setFontFace = function(font) {
        this._faceFace = font;
    };
})();

