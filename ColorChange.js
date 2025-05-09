/*=============================================================================
 ColorChange.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/05/07 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc システムカラー変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ColorChange.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param normalColor
 * @text 通常カラー
 * @desc 通常カラーの色番号を指定します。
 * @default 0
 * @type color
 *
 * @param systemColor
 * @text システムカラー
 * @desc システムカラーの色番号を指定します。
 * @default 16
 * @type color
 *
 * @param crisisColor
 * @text 瀕死カラー
 * @desc 瀕死カラーの色番号を指定します。
 * @default 16
 * @type color
 *
 * @param deathColor
 * @text 戦闘不能カラー
 * @desc 戦闘不能カラーの色番号を指定します。
 * @default 17
 * @type color
 *
 * @param gaugeBackColor
 * @text ゲージ背景カラー
 * @desc ゲージ背景カラーの色番号を指定します。
 * @default 19
 * @type color
 *
 * @param hpGaugeColor1
 * @text HPゲージカラー1
 * @desc HPゲージカラー1の色番号を指定します。
 * @default 20
 * @type color
 *
 * @param hpGaugeColor2
 * @text HPゲージカラー2
 * @desc HPゲージカラー2の色番号を指定します。
 * @default 21
 * @type color
 *
 * @param mpGaugeColor1
 * @text MPゲージカラー1
 * @desc MPゲージカラー1の色番号を指定します。
 * @default 22
 * @type color
 *
 * @param mpGaugeColor2
 * @text MPゲージカラー2
 * @desc MPゲージカラー2の色番号を指定します。
 * @default 23
 * @type color
 *
 * @param mpCostColor
 * @text MPコストカラー
 * @desc MPコストカラーの色番号を指定します。
 * @default 23
 * @type color
 *
 * @param powerUpColor
 * @text 能力値アップカラー
 * @desc 能力値アップカラーの色番号を指定します。装備変更などで能力値が上昇した際に使われます。
 * @default 24
 * @type color
 *
 * @param powerDownColor
 * @text 能力値ダウンカラー
 * @desc 能力値ダウンカラーの色番号を指定します。装備変更などで能力値が減少した際に使われます。
 * @default 25
 * @type color
 *
 * @param ctGaugeColor1
 * @text CTゲージカラー1
 * @desc CTゲージカラー1の色番号を指定します。
 * @default 26
 * @type color
 *
 * @param ctGaugeColor2
 * @text CTゲージカラー2
 * @desc CTゲージカラー2の色番号を指定します。
 * @default 27
 * @type color
 *
 * @param tpGaugeColor1
 * @text TPゲージカラー1
 * @desc TPゲージカラー1の色番号を指定します。
 * @default 28
 * @type color
 *
 * @param tpGaugeColor2
 * @text TPゲージカラー2
 * @desc TPゲージカラー2の色番号を指定します。
 * @default 29
 * @type color
 *
 * @param tpCostColor
 * @text TPコストカラー
 * @desc TPコストカラーの色番号を指定します。
 * @default 29
 * @type color
 *
 * @param mpColor
 * @text MPカラー
 * @desc MPカラーの色番号を指定します。
 * @default 0
 * @type color
 *
 * @param tpColor
 * @text TPカラー
 * @desc TPカラーの色番号を指定します。
 * @default 0
 * @type color
 *
 * @help ColorChange.js
 *
 * 各種システムカラーを変更します。
 * ウィンドウスキンを変更することなく、様々な色を試行錯誤できます。
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

    Object.keys(param._parameter).forEach(methodName => {
        const color = param[methodName];
        if (isNaN(color)) {
            return;
        }
        ColorManager[methodName] = function() {
            return this.textColor(color);
        };
    });
})();
