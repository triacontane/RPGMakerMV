/*=============================================================================
 AutoBattleCustomize.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2025/07/14 自動戦闘の行動と対象を、行動直前に再度更新する設定を追加
 1.0.0 2025/04/15 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 自動戦闘調整プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AutoBattleCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param mpEffectRate
 * @text MP効果行動の採用度
 * @desc MPに効果のあるスキルを使用候補に加える度合いです。採用度100でHP効果と同等の採用基準となります。
 * @default 0
 * @type number
 * @min 0
 * @max 100
 *
 * @param updateBeforeAction
 * @text 開始直前に更新
 * @desc 自動戦闘の行動と対象を、行動直前に再度更新します。
 * @type boolean
 * @default false
 *
 * @help AutoBattleCustomize.js
 *
 * 自動戦闘の行動基準を調整します。
 * 高度なAIの提供は目的としていません。
 * 現状の機能は、MP効果のあるスキルを採用候補とする機能のみです。
 *
 * デフォルトの自動戦闘の仕様は以下の通りです。
 * ・HP効果のあるスキルのみ使用する(使用効果やMP効果のみのスキルは対象外)
 * ・ダメージも回復も、最大HPに対する効果割合がもっとも高いスキルを使用する
 * ・スキルコスト(MP,TP)の多さは考慮しない
 * ・アイテムは使用しない
 * ・行動はターン開始時にのみ決定される
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

    const _Game_Action_evaluateWithTarget = Game_Action.prototype.evaluateWithTarget;
    Game_Action.prototype.evaluateWithTarget = function(target) {
        let result = _Game_Action_evaluateWithTarget.call(this, target);
        if (this.isMpEffect() && !result) {
            result =  this.evaluateWithTargetByMpEffect(target) * param.mpEffectRate / 100;
        }
        return result;
    };

    Game_Action.prototype.evaluateWithTargetByMpEffect = function(target) {
        const value = this.makeDamageValue(target, false);
        if (this.isForOpponent()) {
            return value / Math.max(target.mp, 1);
        } else {
            const recovery = Math.min(-value, target.mmp - target.mp);
            return recovery / target.mmp;
        }
    };

    const _BattleManager_processTurn = BattleManager.processTurn;
    BattleManager.processTurn = function() {
        const subject = this._subject;
        if (param.updateBeforeAction && subject instanceof Game_Actor && subject.isAutoBattle()) {
            subject.makeAutoBattleActions();
        }
        _BattleManager_processTurn.apply(this, arguments);
    };
})();
