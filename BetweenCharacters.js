//=============================================================================
// BetweenCharacters.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.4 2021/02/16 MessageWindowPopup.jsと併用したとき、ウィンドウ幅が字間を考慮するよう修正
// 1.2.3 2021/01/31 1.2.2の修正で、決定ボタン長押しによる瞬間表示が効かなくなる問題を修正
// 1.2.2 2021/01/31 字間設定中に決定ボタンを連打、長押しすると表示が崩れる問題を修正
// 1.2.1 2020/10/24 メッセージウィンドウ以外に適用されてしまう問題を修正
//                  MessageWindowPopup.jsとの競合を解消
// 1.2.0 2020/10/22 MZ対応版を作成
// 1.1.0 2018/01/30 パラメータの型指定機能に対応。MessageWindowPopup.jsとの競合を解消
// 1.0.0 2017/04/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BetweenCharactersPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BetweenCharacters.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param BetweenVariableId
 * @desc The variable number to get the value (in pixels) between characters.
 * @default 0
 * @type variable
 *
 * @help You can set the character spacing of the text.
 * The value of the specified variable will be the character spacing (in pixels).
 * Enter the value in the specified variable before displaying the message.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 字間設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BetweenCharacters.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param BetweenVariableId
 * @text 字間変数番号
 * @desc 字間を値(ピクセル単位)を取得する変数番号です。メッセージを表示する前に指定した変数に値を入れてください。
 * @default 0
 * @type variable
 *
 * @help 文章に字間を設定できます。
 * 指定した変数の値がそのまま字間（ピクセル数）になります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_Message_processCharacter = Window_Message.prototype.processCharacter;
    Window_Message.prototype.processCharacter = function(textState) {
        _Window_Message_processCharacter.apply(this, arguments);
        this.applyBetweenCharacter(textState);
    };

    const _Window_Message_shouldBreakHere = Window_Message.prototype.shouldBreakHere;
    Window_Message.prototype.shouldBreakHere = function(textState) {
        const result = _Window_Message_shouldBreakHere.apply(this, arguments);
        if (this.getBetweenCharacters() > 0) {
            this.flushTextState(textState);
        }
        return result;
    };

    Window_Base.prototype.applyBetweenCharacter = function(textState) {
        if (textState.index > 1 && (textState.x > textState.startX || !textState.drawing)) {
            const between = this.getBetweenCharacters();
            textState.x += textState.rtl ? -between : between;
        }
    };

    Window_Base.prototype.getBetweenCharacters = function() {
        return $gameVariables.value(param.BetweenVariableId) || 0;
    };
})();

