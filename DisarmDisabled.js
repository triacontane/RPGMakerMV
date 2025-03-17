/*=============================================================================
 DisarmDisabled.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2025/03/17 最強装備を選択すると、装備解除ができてしまう場合がある問題を修正
 1.0.0 2022/11/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 装備解除禁止プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DisarmDisabled.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param equipTypes
 * @text 装備タイプリスト
 * @desc 装備解除を禁止する装備タイプのリストです。
 * @default []
 * @type number[]
 *
 * @help DisarmDisabled.js
 *
 * パラメータで指定した装備タイプの装備を外すことを禁止できます。
 * 同時に『すべて外す』コマンドの対象外になります。
 * 初期装備で何も装備していないパターンは考慮しません。
 * データベースで何かのアイテムを装備させてください。
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
    if (!param.equipTypes) {
        param.equipTypes = [];
    }

    const _Game_Actor_clearEquipments = Game_Actor.prototype.clearEquipments;
    Game_Actor.prototype.clearEquipments = function() {
        this._clearEquipments = true;
        _Game_Actor_clearEquipments.apply(this, arguments);
        this._clearEquipments = false;
    };

    const _optimizeEquipments = Game_Actor.prototype.optimizeEquipments;
    Game_Actor.prototype.optimizeEquipments = function() {
        this._optimizeEquipments = true;
        _optimizeEquipments.apply(this, arguments);
        this._optimizeEquipments = false;
    };

    const _Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
    Game_Actor.prototype.isEquipChangeOk = function(slotId) {
        const result = _Game_Actor_isEquipChangeOk.apply(this, arguments);
        if (this._clearEquipments || this._optimizeEquipments) {
            const eTypeId = this.equipSlots()[slotId];
            if (param.equipTypes.includes(eTypeId)) {
                return false;
            }
        }
        return result;
    };

    const _Window_EquipItem_includes = Window_EquipItem.prototype.includes;
    Window_EquipItem.prototype.includes = function(item) {
        if (this.isEmptyDisable(item)) {
            return false;
        }  else {
            return _Window_EquipItem_includes.apply(this, arguments);
        }
    };

    Window_EquipItem.prototype.isCurrentItemEnabled = function() {
        return !this.isEmptyDisable(this.item());
    };

    Window_EquipItem.prototype.isEmptyDisable = function(item) {
        return param.equipTypes.includes(this.etypeId()) && !item;
    };
})();
