/*=============================================================================
 MessageBetweenLines.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/08/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc メッセージの行間設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageRowBetween.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param AddBetweenLines
 * @text 追加行間ピクセル
 * @desc 指定したピクセル数だけメッセージの行間が大きくなります。
 * @default 0
 * @type number
 * @min -100
 *
 * @param AddHeight
 * @text 追加高さ
 * @desc 指定したピクセル数だけウィンドウ高さが大きくなります。
 * @default 0
 * @type number
 * @min -1000
 *
 * @help MessageBetweenLines.js
 *
 * メッセージウィンドウにおける行間とウィンドウ自体の高さを調整します。
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

    const _Window_Base_processNewLine = Window_Base.prototype.processNewLine;
    Window_Base.prototype.processNewLine = function(textState) {
        _Window_Base_processNewLine.apply(this, arguments);
        if (this instanceof Window_Message) {
            textState.y += param.AddBetweenLines || 0;
        }
    };

    const _Scene_Message_messageWindowRect = Scene_Message.prototype.messageWindowRect;
    Scene_Message.prototype.messageWindowRect = function() {
        const rect = _Scene_Message_messageWindowRect.apply(this, arguments);
        rect.height += param.AddHeight || 0;
        return rect;
    };
})();
