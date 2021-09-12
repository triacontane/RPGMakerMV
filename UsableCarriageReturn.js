//=============================================================================
// UsableCarriageReturn.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2021/09/12 ヘルプウィンドウの行数をパラメータから指定できる機能を追加
// 1.0.1 2020/11/22 MZで正常に機能するよう修正
// 1.0.0 2016/05/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 改行コード使用可能プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/UsableCarriageReturn.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param lineNumber
 * @text ヘルプウィンドウ行数
 * @desc ヘルプウィンドウの行数です。0を指定するとデフォルトの2行になります。
 * @default 0
 * @type number
 *
 * @help ウィンドウ中の任意の箇所で改行コードが使用可能になります。
 * データベースやメッセージウィンドウで改行したい箇所に「\n」と入力してください。
 * 主にデータベースの説明やプロフィール欄に3行目を入力したい場合に使用します。
 * すべてのウィンドウで有効です。
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        _Window_Base_processEscapeCharacter.apply(this, arguments);
        if (code.match(/^n/i)) {
            this.processNewLine(textState);
            textState.index -= code.length - 1;
        }
    };

    const _Scene_MenuBase_helpAreaHeight = Scene_MenuBase.prototype.helpAreaHeight;
    Scene_MenuBase.prototype.helpAreaHeight = function() {
        const lineNumber = param.lineNumber;
        if (lineNumber > 0) {
            return this.calcWindowHeight(lineNumber, false);
        } else {
            return _Scene_MenuBase_helpAreaHeight.apply(this, arguments);
        }
    };
})();

