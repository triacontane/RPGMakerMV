//=============================================================================
// ChangeGameOverCondition.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2025/12/10 MZ向けに再作成
// 1.1.0 2016/05/11 ゲームオーバーになるアクターIDを個別に指定できる機能を追加
// 1.0.0 2016/04/21 初版
// ----------------------------------------------------------------------------
// [X]: https://x.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ゲームオーバー条件変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChangeGameOverCondition.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command SET_VIP
 * @text ゲームオーバーアクター設定
 * @desc 指定したアクターが戦闘不能になるとゲームオーバーになります。複数指定可能。
 *
 * @arg actorIdList
 * @text アクターIDリスト
 * @desc ゲームオーバー条件とするアクターIDのリストです。複数指定でいずれかのアクターの戦闘不能でゲームオーバーです。
 * @default []
 * @type actor[]
 *
 * @help ChangeGameOverCondition.js
 *
 * 指定したアクターが戦闘不能になったときに
 * ゲームオーバーになるよう仕様を変更できます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'SET_VIP', args => {
        const actorIdList = args.actorIdList;
        if (!actorIdList || actorIdList.length === 0) {
            $gameParty.removeVip();
        } else {
            $gameParty.setVipList(actorIdList);
        }
    });

    var _Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.apply(this, arguments);
        this._vipActorList = null;
    };

    Game_Party.prototype.setVipList = function(list) {
        this._vipActorList = list;
    };

    Game_Party.prototype.removeVip = function() {
        this._vipActorList = null;
    };

    const _Game_Party_isAllDead = Game_Party.prototype.isAllDead;
    Game_Party.prototype.isAllDead = function() {
        const isAllDead = _Game_Party_isAllDead.apply(this, arguments);
        if (!isAllDead && this.deadMembers().length > 0 && (this.inBattle() || !this.isEmpty())) {
            return this._vipActorList && this._vipActorList.some(actorId => {
                const actor = $gameActors.actor(actorId);
                return actor && actor.isDead();
            });
        }
        return isAllDead;
    };
})();

