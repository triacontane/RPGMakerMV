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
 * @help イベントコマンド「戦闘行動の強制」をランダムターゲットかつ、
 * 戦闘不能の味方を対象するスキルで指定すると発動時にエラーが発生する
 * 問題に対処します。
 *
 * 戦闘行動の強制時に、何らかの理由(※1)でターゲットを
 * 選択できなかった場合、スキル自体を行動から消去してしまうため、
 * 実行時にスキル情報を参照できずエラーが発生します。
 *
 * ※1 戦闘不能者を対象にしたスキルを実行しようとしたが、味方全員が生存していた等
 *
 * このプラグインでは、戦闘行動の強制時にターゲットを選択できずスキルが
 * 消去されてしまった場合に、元に戻します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦闘不能ランダムターゲットの行動強制エラー修正プラグイン
 * @author トリアコンタン
 *
 * @help イベントコマンド「戦闘行動の強制」をランダムターゲットかつ、
 * 戦闘不能の味方を対象するスキルで指定すると発動時にエラーが発生する
 * 問題に対処します。
 *
 * 戦闘行動の強制時に、何らかの理由(※1)でターゲットを
 * 選択できなかった場合、スキル自体を行動から消去してしまうため、
 * 実行時にスキル情報を参照できずエラーが発生します。
 *
 * ※1 戦闘不能者を対象にしたスキルを実行しようとしたが、味方全員が生存していた等
 *
 * このプラグインでは、戦闘行動の強制時にターゲットを選択できずスキルが
 * 消去されてしまった場合に、元に戻します。
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

