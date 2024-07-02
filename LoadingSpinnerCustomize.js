/*=============================================================================
 LoadingSpinnerCustomize.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/07/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ローディングスピナー調整プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/LoadingSpinnerCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param hidden
 * @text 非表示
 * @desc ローディングスピナーを非表示にします。
 * @default false
 * @type boolean
 *
 * @help LoadingSpinnerCustomize.js
 *
 * ロード中に表示されるローディングスピナーをカスタマイズします。
 * 現バージョンでは非表示にする機能のみ提供します。
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

    const _Graphics_createLoadingSpinner = Graphics._createLoadingSpinner;
    Graphics._createLoadingSpinner = function() {
        _Graphics_createLoadingSpinner.apply(this, arguments);
        if (param.hidden) {
            this._loadingSpinner.style.display = 'none';
        }
    };

    if (param.hidden) {
        const main = new Main();
        main.eraseLoadingSpinner();
    }
})();
