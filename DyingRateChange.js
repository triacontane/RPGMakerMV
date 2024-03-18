/*=============================================================================
 DyingRateChange.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 瀕死レート変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DyingRateChange.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param dyingRate
 * @text 瀕死レート
 * @desc 瀕死時のレートです。百分率で指定してください。
 * @default 25
 * @type number
 * @min 0
 * @max 100
 *
 * @help DyingRateChange.js
 *
 * 瀕死となるHPの割合を変更します。
 * HPの表示色やアクターモーション、身代わり条件などに影響します。
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

    const _Game_BattlerBase_isDying = Game_BattlerBase.prototype.isDying;
    Game_BattlerBase.prototype.isDying = function() {
        const result = _Game_BattlerBase_isDying.apply(this, arguments);
        if (param.dyingRate) {
            return this.isAlive() && this.hpRate() <= param.dyingRate / 100;
        } else {
            return result;
        }
    };
})();
