/*=============================================================================
 SkillCostShared.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/03/16 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc スキルコスト共有プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillCostShared.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param mpShared
 * @text MP共有
 * @desc パーティ全体でMPを共有します。
 * @default true
 * @type boolean
 *
 * @param maxMpVariableId
 * @text 最大MPの変数ID
 * @desc 最大MPの値を格納しておく変数のIDです。
 * @default 1
 * @type variable
 * @parent mpShared
 *
 * @param mpVariableId
 * @text MPの変数ID
 * @desc MPの値を取得する変数のIDです。取得専用で、この変数値を変更してもMPは変更されません。
 * @default 0
 * @type variable
 * @parent mpShared
 *
 * @param tpShared
 * @text TP共有
 * @desc パーティ全体でTPを共有します。
 * @default true
 * @type boolean
 *
 * @param maxTpVariableId
 * @text 最大TPの変数ID
 * @desc 最大TPの値を格納しておく変数のIDです。指定しない場合、最大値はデフォルト値の100となります。
 * @default 0
 * @type variable
 * @parent tpShared
 *
 * @param tpVariableId
 * @text TPの変数ID
 * @desc TPの値を取得する変数のIDです。取得専用で、この変数値を変更してもTPは変更されません。
 * @default 0
 * @type variable
 * @parent tpShared
 *
 * @param hiddenDefaultUi
 * @text デフォルトUI非表示
 * @desc 共有している場合、個々のアクターのMP,TPを非表示にします。
 * @default true
 * @type boolean
 *
 * @help SkillCostShared.js
 *
 * パーティ全体でMPやTPを共有します。MP,TP個別に利用可否を設定できます。
 * 共有MP,TPを表示するUI（汎用ゲージプラグインなど）は別途用意してください。
 *
 * 個々のアクターの特徴やバフ、成長による最大MP,TPの増減設定は無効となります。
 * 増減させたい場合は、パラメータで指定した変数値を変更してください。
 *
 * この設定はパーティのみで敵キャラ、敵グループには適用されません。
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

    BattleManager.isSkillCostShared = function(type) {
        if (type === 'mp') {
            return param.mpShared;
        } else if (type === 'tp') {
            return param.tpShared;
        } else {
            return false;
        }
    };

    if (BattleManager.isSkillCostShared('mp')) {
        Object.defineProperties(Game_Actor.prototype, {
            // Magic Points
            _mp: {
                get: function() {
                    return $gameParty.getMp();
                },
                set: function(value) {
                    return $gameParty.setMp(value);
                },
                configurable: true
            },
            // Maximum Magic Points
            mmp: {
                get: function() {
                    return $gameParty.getMaxMp();
                },
                configurable: true
            }
        });

        Game_Party.prototype.setMp = function(mp) {
            if (this._sharedMp === mp) {
                return;
            }
            this._sharedMp = mp.clamp(0, this.getMaxMp());
            $gameVariables.setValue(param.mpVariableId, this._sharedMp);
        };

        Game_Party.prototype.getMp = function() {
            return this._sharedMp || 0;
        };

        Game_Party.prototype.getMaxMp = function() {
            return Math.max($gameVariables.value(param.maxMpVariableId), 1);
        };
    }

    if (BattleManager.isSkillCostShared('tp')) {
        Object.defineProperties(Game_Actor.prototype, {
            // Tactical Points
            _tp: {
                get: function() {
                    return $gameParty.getTp();
                },
                set: function(value) {
                    return $gameParty.setTp(value);
                },
                configurable: true
            },
        });

        const _Game_BattlerBase_maxTp = Game_BattlerBase.prototype.maxTp;
        Game_BattlerBase.prototype.maxTp = function() {
            const tp = _Game_BattlerBase_maxTp.apply(this, arguments);
            if (this.isActor()) {
                return $gameParty.getMaxTp();
            } else {
                return tp;
            }
        };

        Game_Party.prototype.setTp = function(tp) {
            if (this._sharedTp === tp) {
                return;
            }
            this._sharedTp = tp.clamp(0, this.getMaxTp());
            $gameVariables.setValue(param.tpVariableId, this._sharedTp);
        };

        Game_Party.prototype.getTp = function() {
            return this._sharedTp || 0;
        };

        Game_Party.prototype.getMaxTp = function() {
            if (param.maxTpVariableId > 0) {
                return Math.max($gameVariables.value(param.maxTpVariableId), 1);
            } else {
                return 100;
            }
        };
    }

    const _Window_StatusBase_placeGauge = Window_StatusBase.prototype.placeGauge;
    Window_StatusBase.prototype.placeGauge = function(actor, type, x, y) {
        if (param.hiddenDefaultUi && BattleManager.isSkillCostShared(type)) {
            return;
        }
        _Window_StatusBase_placeGauge.apply(this, arguments);
    };
})();
