/*=============================================================================
 PluginCommonBaseSubPatch.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/06/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc PluginCommonBaseサブフォルダ適用パッチ
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PluginCommonBaseSubPatch.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help PluginCommonBaseSubPatch.js
 *
 * ベースプラグイン『PluginCommonBase.js』を使ったプラグインをサブフォルダに
 * 配置したとき正しくパラメータを取得できるようにするパッチです。
 *
 * このプラグインは『PluginCommonBase.js』の直下に配置してください。
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

    PluginManagerEx.findPluginName = function (currentScript) {
        return decodeURIComponent(currentScript.src.match(/^.*\/js\/plugins\/(.*)\.js$/)[1]);
    };
})();
