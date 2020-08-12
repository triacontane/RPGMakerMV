/*=============================================================================
 FixExpLimit.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/03/04 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 経験値上限のレベル上限に合わせた修正プラグイン
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author トリアコンタン
 *
 * @param adjustLevelOnLoad
 * @text ロード時にレベルを補正
 * @desc ロード時に次のレベルよりも多くの経験値を獲得しているアクターがいる場合、自動で適正レベルまでレベルアップします。
 * @default false
 * @type boolean
 *
 * @help FixExpLimit.js
 *
 * アクターの獲得総経験値が、レベル上限の最大経験値を超えないように
 * 内部で調整します。
 * アップデート等により後からアクターのレベル上限を変更したときに
 * 既にレベル上限に達していたアクターのレベルと次の経験値が
 * 不整合になる現象を回避します。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';

    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('FixExpLimit');

    var _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        if (param.adjustLevelOnLoad) {
            $gameActors.refreshExp();
        }
    };

    Game_Actors.prototype.refreshExp = function() {
        this._data.forEach(function (actor) {
            if (actor) {
                actor.changeExp(actor.currentExp(), false);
            }
        });
    };

    Game_Actor.prototype.expForMaxLevel = function() {
        return this.expForLevel(this.maxLevel());
    };

    var _Game_Actor_changeExp = Game_Actor.prototype.changeExp;
    Game_Actor.prototype.changeExp = function(exp, show) {
        arguments[0] = Math.min(this.expForMaxLevel(), exp);
        _Game_Actor_changeExp.apply(this, arguments);
    };
})();
