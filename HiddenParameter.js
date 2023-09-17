//=============================================================================
// HiddenParameter.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2023/09/17 MZ向けにリファクタリング
// 1.0.0 2018/04/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc パラメータ非表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/HiddenParameter.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param hiddenParams
 * @text 非表示パラメータ
 * @desc 非表示にするパラメータのリストです。
 * @default []
 * @type struct<PARAM>[]
 *
 * @help HiddenParameter.js
 *
 * 装備品もしくはステータスウィンドウから
 * パラメータの表示を除外します。
 * 非表示にするだけで、パラメータ自体は有効です。
 *
 * 戦闘画面やショップ画面の表示には
 * 影響を与えません。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~PARAM:
 * @param actorId
 * @desc 対象となるアクターIDです。0を指定すると全アクターが対象になります。
 * @default 0
 * @type actor
 *
 * @param paramId
 * @desc 対象となるパラメータIDです。0を指定すると全パラメータが対象になります。
 * @default 0
 * @type select
 * @option 最大HP
 * @value 0
 * @option 最大MP
 * @value 1
 * @option 攻撃力
 * @value 2
 * @option 防御力
 * @value 3
 * @option 魔法力
 * @value 4
 * @option 魔法防御
 * @value 5
 * @option 敏捷性
 * @value 6
 * @option 運
 * @value 7
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    TextManager.isVisibleParam = function(paramId, actorId) {
        return !param.hiddenParams.some(data => {
            return (data.actorId === 0 || data.actorId === actorId) &&
                (data.paramId === 0 || data.paramId === paramId);
        });
    };

    const _Window_StatusParams_drawItem = Window_StatusParams.prototype.drawItem;
    Window_StatusParams.prototype.drawItem = function(index) {
        const paramId = index + 2;
        if (TextManager.isVisibleParam(paramId, this._actor.actorId())) {
            _Window_StatusParams_drawItem.apply(this, arguments);
        }
    };

    const _Window_EquipStatus_drawItem = Window_EquipStatus.prototype.drawItem;
    Window_EquipStatus.prototype.drawItem = function(x, y, paramId) {
        if (TextManager.isVisibleParam(paramId, this._actor?.actorId())) {
            _Window_EquipStatus_drawItem.apply(this, arguments);
        }
    };
})();
