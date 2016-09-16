//=============================================================================
// MessageFontChange.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/09/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MessageFontChangePlugin
 * @author triacontane
 *
 * @param Font1
 * @desc 1番のフォントセットです。
 * @default ヒラギノゴシック ProN W3,Hiragino Gothic ProN,ＭＳ Ｐゴシック,MS PGothic
 *
 * @param Font2
 * @desc 2番のフォントセットです。
 * @default ヒラギノ明朝 ProN W3,Hiragino Mincho ProN,ＭＳ Ｐ明朝,MS PMincho
 *
 * @param Font3
 * @desc 3番のフォントセットです。
 * @default
 *
 * @param Font4
 * @desc 4番のフォントセットです。
 * @default
 *
 * @param Font5
 * @desc 5番のフォントセットです。
 * @default
 *
 * @param DefaultFont
 * @desc デフォルトで使用されるフォント番号です。(1-5)
 * @default 0
 *
 * @help 文章の表示で使用されるフォントを一時的に変更します。
 * fontsフォルダに入っているものではなく、ユーザ環境にインストール
 * されているフォントから選択されるのでロードの必要はありません。
 *
 * 使用するフォントはパラメータで指定してください。(最大5つまで)
 * フォントは複数指定が可能です。カンマ(,)で区切ってください。
 * 複数指定した場合は順番に存在チェックして見付かり次第使用します。
 * 全て見付からなかった場合は、通常のフォントが使用されます。
 *
 * 文章の表示中に以下の制御文字を指定してください。
 * \fc[1] # 指定した番号のフォントを候補として使用する
 * \fc[0] # フォント指定をデフォルトに戻す
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メッセージフォント変更プラグイン
 * @author トリアコンタン
 *
 * @param フォント1
 * @desc 1番のフォントセットです。
 * @default ヒラギノゴシック ProN W3,Hiragino Gothic ProN,ＭＳ Ｐゴシック,MS PGothic
 *
 * @param フォント2
 * @desc 2番のフォントセットです。
 * @default ヒラギノ明朝 ProN W3,Hiragino Mincho ProN,ＭＳ Ｐ明朝,MS PMincho
 *
 * @param フォント3
 * @desc 3番のフォントセットです。
 * @default
 *
 * @param フォント4
 * @desc 4番のフォントセットです。
 * @default
 *
 * @param フォント5
 * @desc 5番のフォントセットです。
 * @default
 *
 * @param デフォルトフォント
 * @desc デフォルトで使用されるフォント番号です。0を指定するとデフォルトフォンが未指定になります。
 * @default 0
 *
 * @help 文章の表示で使用されるフォントを一時的に変更します。
 * fontsフォルダに入っているものではなく、ユーザ環境にインストール
 * されているフォントから選択されるのでロードの必要はありません。
 *
 * 使用するフォントはパラメータで指定してください。(最大5つまで)
 * フォントは複数指定が可能です。カンマ(,)で区切ってください。
 * 複数指定した場合は順番に存在チェックして見付かり次第使用します。
 * 全て見付からなかった場合は、通常のフォントが使用されます。
 *
 * 文章の表示中に以下の制御文字を指定してください。
 * \fc[1] # 指定した番号のフォントを候補として使用する
 * \fc[0] # フォント指定をデフォルトに戻す
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'MessageFontChange';
    var setting       = {
        fontChangeCode: 'FC',
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramFonts = {};
    for (var i = 1; i < 6; i++) {
        paramFonts[i] = getParamString(['Font' + i, 'フォント' + i]);
    }
    var paramDefaultFont = getParamNumber(['DefaultFont', 'デフォルトフォント'], 0, 5);

    var _Window_Message_processEscapeCharacter      = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        switch (code) {
            case setting.fontChangeCode:
                this.changeFontFace(this.obtainEscapeParam(textState));
                break;
            default:
                _Window_Message_processEscapeCharacter.apply(this, arguments);
        }
    };

    Window_Message.prototype.changeFontFace = function(fontIndex) {
        var fonts = paramFonts[fontIndex];
        this.contents.fontFace = (fonts ? fonts + ',' : '') + this.standardFontFace();
    };

    var _Window_Message_standardFontFace = Window_Message.prototype.standardFontFace;
    Window_Message.prototype.standardFontFace = function() {
        var fonts = paramFonts[paramDefaultFont];
        return (fonts ? fonts + ',' : '') + _Window_Message_standardFontFace.apply(this, arguments);
    };
})();

