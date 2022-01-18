/*=============================================================================
 MessageWindowKeep.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/01/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc メッセージウィンドウの維持プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageWindowKeep.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param keepSwitch
 * @text 維持スイッチ番号
 * @desc 指定したスイッチがONのあいだ、メッセージウィンドウを閉じずに残します。
 * @default 1
 * @type switch
 *
 * @help MessageWindowKeep.js
 *
 * 指定したスイッチがONのあいだ、メッセージウィンドウを閉じずに残します。
 * スイッチがOFFになると閉じられます。
 * その他、メニュー画面の開閉でも閉じるので基本的にはイベント中に制御します。
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

    const _Window_Message_checkToNotClose = Window_Message.prototype.checkToNotClose;
    Window_Message.prototype.checkToNotClose = function() {
        _Window_Message_checkToNotClose.apply(this, arguments);
        if (!this.doesContinue() && this.isOpen()) {
            this.close();
        }
    };

    const _Window_Message_doesContinue = Window_Message.prototype.doesContinue;
    Window_Message.prototype.doesContinue = function() {
        const result = _Window_Message_doesContinue.apply(this, arguments);
        return result || $gameSwitches.value(param.keepSwitch);
    };
})();
