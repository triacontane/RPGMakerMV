//=============================================================================
// ParamTextColorChanger.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2022/02/16 MZで動作するよう修正
//                  パラメータに以上以下の条件を指定できる機能を追加
// 1.0.0 2016/11/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc パラメータテキストカラー変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParamTextColorChanger.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param HpColors
 * @text HPテキストカラー
 * @desc HPのテキストカラーを割合に応じて変更します。リストの上から順番に評価されます。
 * @default []
 * @type struct<Color>[]
 *
 * @param MpColors
 * @text MPテキストカラー
 * @desc MPのテキストカラーを割合に応じて変更します。リストの上から順番に評価されます。
 * @default []
 * @type struct<Color>[]
 *
 * @param TpColors
 * @text TPテキストカラー
 * @desc TPのテキストカラーを割合に応じて変更します。リストの上から順番に評価されます。
 * @default []
 * @type struct<Color>[]
 *
 * @help HP、MPおよびTPの数値をウィンドウに表示する際に
 * 残量もしくはステートによって表示色を変更することができます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Color:
 *
 * @param operand
 * @text 割合設定値
 * @desc 条件判定する際のパラメータの割合(0% - 100%)です。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param sign
 * @text 条件符号
 * @desc パラメータの割合が指定値以上か指定値以下かを設定します。
 * @default ≥
 * @type select
 * @option ≥ (指定割合以上の場合)
 * @value ≥
 * @option ≤ (指定割合以下の場合)
 * @value ≤
 *
 * @param colorIndex
 * @text カラーインデックス
 * @desc 指定した条件を満たしたときに変更されるカラーインデックス（\c[n]で指定する数値）です。
 * @default 0
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.HpColors) {
        param.HpColors = [];
    }
    if (!param.MpColors) {
        param.MpColors = [];
    }
    if (!param.TpColors) {
        param.TpColors = [];
    }

    //=============================================================================
    // Window_Base
    //  テキストカラーを変更します。
    //=============================================================================
    const _ColorManager_hpColor      = ColorManager.hpColor;
    ColorManager.hpColor = function(actor) {
        const defaultColor = _ColorManager_hpColor.apply(this, arguments);
        return this.findParamTextColor(param.HpColors, actor.hpRate()) || defaultColor;
    };

    const _ColorManager_mpColor      = ColorManager.mpColor;
    ColorManager.mpColor = function(actor) {
        const defaultColor = _ColorManager_mpColor.apply(this, arguments);
        return this.findParamTextColor(param.MpColors, actor.mpRate()) || defaultColor;
    };

    const _ColorManager_tpColor      = ColorManager.tpColor;
    ColorManager.tpColor = function(actor) {
        const defaultColor = _ColorManager_tpColor.apply(this, arguments);
        return this.findParamTextColor(param.TpColors, actor.tpRate()) || defaultColor;
    };

    ColorManager.findParamTextColor = function(paramList, rate) {
        const color = paramList.find(item => {
            const operand = item.operand / 100;
            return item.sign === '≥' ? rate >= operand : rate <= operand;
        });
        return color ? this.textColor(color.colorIndex) : null;
    };
})();

