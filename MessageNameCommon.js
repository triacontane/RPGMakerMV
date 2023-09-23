/*=============================================================================
 MessageNameCommon.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/09/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc メッセージ名前コモンプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MessageNameCommon.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param commonList
 * @text コモンイベントリスト
 * @desc 名前指定で呼び出すコモンイベントのリストです。
 * @default []
 * @type struct<COMMON>[]
 *
 * @help MessageNameCommon.js
 *
 * メッセージの表示で名前を指定したときに自動でコモンイベントを呼び出します。
 * 名前とコモンイベントのIDをプラグインパラメータから指定してください。
 * このイベント呼び出しは、マップ画面でのみ有効です。
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

/*~struct~COMMON:
 * @param commonEventId
 * @desc 呼び出すコモンイベントのIDです。
 * @default 1
 * @type common_event
 *
 * @param SpeakerName
 * @desc 文章の表示の「名前」が指定値と一致するときにコモンイベントを呼び出します。（正規表現が使えます）
 * @default
 * @type string
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.apply(this, arguments);
        if ($gameParty.inBattle()) {
            return;
        }
        this.callSpeakerCommon();
    };

    Window_Message.prototype.callSpeakerCommon = function() {
        const speakerName = $gameMessage.speakerName();
        const commonEvents = param.commonList.filter(common => speakerName.match(new RegExp(common.SpeakerName)));
        commonEvents.forEach(common => $gameMap.setupDynamicCommon(common.commonEventId));
    }
})();
