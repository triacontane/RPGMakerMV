//=============================================================================
// BugFixForceRandomDeadTarget.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/10/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BugFixForceRandomDeadTargetPlugin
 * @author triacontane
 *
 * @help 戦闘不能の味方を対象に、ランダムターゲットの行動強制を
 * 行うとエラーが発生する問題に対処します。
 *
 * 戦闘行動の強制時、ターゲットの選択に失敗すると設定した
 * スキルをクリアしてしますが、この処理は不要なので
 * クリアされたスキルを再設定します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦闘不能ランダムターゲットの行動強制エラー修正プラグイン
 * @author トリアコンタン
 *
 * @help 戦闘不能の味方を対象に、ランダムターゲットの行動強制を
 * 行うとエラーが発生する問題に対処します。
 *
 * 戦闘行動の強制時、ターゲットの選択に失敗すると設定した
 * スキルをクリアしてしますが、この処理は不要なので
 * クリアされたスキルを再設定します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    var _Game_Battler_forceAction = Game_Battler.prototype.forceAction;
    Game_Battler.prototype.forceAction = function(skillId, targetIndex) {
        _Game_Battler_forceAction.apply(this, arguments);
        var forceAction = this._actions[this._actions.length - 1];
        if (!forceAction.item()) {
            forceAction.setSkill(skillId);
        }
    };
})();

