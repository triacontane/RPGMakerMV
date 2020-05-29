/*=============================================================================
 MOG_BattleHudAddMemberPatch.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.2 2020/05/29 いくつかのスキンでメンバー入替時にゲージの表示位置が一部ずれる問題を修正
 1.0.1 2020/05/28 パーティからメンバーを外すとエラーになる問題を修正
 1.0.0 2020/05/23 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc MOG_BattleHudの戦闘メンバー追加時の不整合修正パッチ
 * @author トリアコンタン
 *
 * @help MOG_BattleHudAddMemberPatch.js
 *
 * MOG_BattleHudで戦闘中にメンバーを追加したときの
 * HUDの表示不整合を修正します。
 * MOG_BattleHudより下に配置してください。
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

    var _Battle_Hud_update = Battle_Hud.prototype.update;
    Battle_Hud.prototype.update = function() {
        var memberSize = $gameParty.members().length;
        if (this._mamberSize !== memberSize) {
            this._hud_size[0] = 0;
            this._hp_old[0] = -1;
            this._mp_old[0] = -1;
            this._tp_old[0] = -1;
            this._mp_old_ani[0] = -1;
            this._hp_old_ani[0] = -1;
        }
        _Battle_Hud_update.apply(this, arguments);
        if (this._mamberSize !== memberSize && this._battler) {
            this.update_sprites();
        }
        this._mamberSize = memberSize;
    };
})();
