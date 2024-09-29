/*=============================================================================
 ParamOrder.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2024/09/29 並び順パラメータの指定によっては正しい並び順にならない場合がある問題を修正
 1.0.0 2022/07/28 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc パラメータ並び順プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParamOrder.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param paramOrderList
 * @text 並び順リスト
 * @desc パラメータの並び順リストです。必ず6つぶんを過不足なく定義してください。
 * @default ["攻撃力","防御力","魔法力","魔法防御","敏捷性","運"]
 * @type select[]
 * @option 攻撃力
 * @option 防御力
 * @option 魔法力
 * @option 魔法防御
 * @option 敏捷性
 * @option 運
 *
 * @help ParamOrder.js
 *
 * メニュー画面におけるパラメータの並び順を任意の順番で入れ替えます。
 * 装備画面、ステータス画面が対象です。
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
    if (!param.paramOrderList) {
        return;
    }
    const paramNames = ['攻撃力', '防御力', '魔法力', '魔法防御', '敏捷性', '運'];

    Window_Base.prototype.convertParamId = function(paramId) {
        const name = param.paramOrderList[paramId - 2];
        const index = paramNames.indexOf(name);
        return index >= 0 ? index + 2 : paramId;
    };

    // override
    Window_StatusParams.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        const paramId = this.convertParamId(index + 2);
        const name = TextManager.param(paramId);
        const value = this._actor.param(paramId);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(name, rect.x, rect.y, 160);
        this.resetTextColor();
        this.drawText(value, rect.x + 160, rect.y, 60, "right");
    };

    const _Window_EquipStatus_drawParamName = Window_EquipStatus.prototype.drawParamName;
    Window_EquipStatus.prototype.drawParamName = function(x, y, paramId) {
        _Window_EquipStatus_drawParamName.call(this, x, y, this.convertParamId(paramId));
    };

    const _Window_EquipStatus_drawCurrentParam = Window_EquipStatus.prototype.drawCurrentParam;
    Window_EquipStatus.prototype.drawCurrentParam = function(x, y, paramId) {
        _Window_EquipStatus_drawCurrentParam.call(this, x, y, this.convertParamId(paramId));
    };

    const _Window_EquipStatus_drawNewParam = Window_EquipStatus.prototype.drawNewParam;
    Window_EquipStatus.prototype.drawNewParam = function(x, y, paramId) {
        _Window_EquipStatus_drawNewParam.call(this, x, y, this.convertParamId(paramId));
    };
})();
