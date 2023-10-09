/*=============================================================================
 WindowOneTapDecision.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/10/09 プラグインの機能を一時的に無効にできるスイッチを追加
 1.0.0 2023/09/26 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ワンタップで項目決定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/WindowOneTapDecision.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param disableSwitchId
 * @text 無効スイッチ番号
 * @desc 指定した番号のスイッチがONのとき、プラグインの機能が無効になります。
 * @default 0
 * @type switch
 *
 * @help WindowOneTapDecision.js
 *
 * モバイルデバイス操作時に、ウィンドウの項目をワンタップで
 * 決定できるよう修正します。
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

    const _Window_Selectable_processTouch = Window_Selectable.prototype.processTouch;
    Window_Selectable.prototype.processTouch = function() {
        const hitIndex = this.hitIndex();
        if (Utils.isMobileDevice() && this.isOpenAndActive() &&
            hitIndex !== this.index() && hitIndex >= 0 && TouchInput.isTriggered() &&
            !$gameSwitches.value(param.disableSwitchId)) {
            this.select(hitIndex);
        }
        _Window_Selectable_processTouch.apply(this, arguments);
    };
})();
