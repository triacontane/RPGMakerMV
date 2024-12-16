/*=============================================================================
 DisableFastForward.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/12/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc イベント高速化禁止プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DisableFastForward.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param disableSwitchId
 * @text 禁止スイッチID
 * @desc 指定したスイッチがONのときイベントの高速化を禁止します。0を指定すると常に禁止されます。
 * @default 0
 * @type switch
 *
 * @help DisableFastForward.js.js
 *
 * イベント中に決定ボタンを押し続けることでゲームスピードを2倍速にする機能を
 * 無効にできます。
 * 同じ決定ボタン押し続けによるメッセージ早送り機能は無効になりません。
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

    const _Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;
    Scene_Map.prototype.isFastForward = function() {
        return _Scene_Map_isFastForward.apply(this, arguments) && !$gameSwitches.value(param.disableSwitchId);
    };
})();
