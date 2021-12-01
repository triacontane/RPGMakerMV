/*=============================================================================
 NoCastNoWait.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2021/12/01 スリップダメージで戦闘不能になったバトラーを蘇生させた場合、対象バトラーのタイムプログレスゲージが進まなくなる問題を修正
 1.0.0 2021/05/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ノーキャストノーウェイトプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NoCastNoWait.js
 * @author トリアコンタン
 *
 * @help NoCastNoWait.js
 *　
 * タイムプログレス戦闘において、キャストタイムが設定されていないスキルは、
 * 選択した直後にタイムラグなしで即発動するよう仕様変更します。
 * （デフォルト仕様ではスキル入力後、他バトラーのタイムゲージが1回分増加します）
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_Battler_startTpbCasting = Game_Battler.prototype.startTpbCasting;
    Game_Battler.prototype.startTpbCasting = function() {
        _Game_Battler_startTpbCasting.apply(this, arguments);
        if (this.isDead()) {
            return;
        }
        this.updateTpbCastTime();
        if (this.isTpbReady()) {
            BattleManager.updateTpbBattler(this);
        }
    };
})();
