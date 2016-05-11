//=============================================================================
// ChangeGameOverCondition.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2016/05/11 ゲームオーバーになるアクターIDを個別に指定できる機能を追加
// 1.0.0 2016/04/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ゲームオーバー条件変更プラグイン
 * @author トリアコンタン
 *
 * @help ゲームオーバー条件をいずれかの味方が戦闘不能になった場合
 * に変更します。
 * 対象となるアクターIDを指定することもできます。
 *
 * 条件を変更するにはスクリプトで以下を実行してください。
 *
 * $gameParty.setVip(1);   // アクターID[1]が戦闘不能になるとゲームオーバー
 * $gameParty.setVipAll(); // いずれか一人のアクターが戦闘不能になるとゲームオーバー
 * $gameParty.removeVip(); // ゲームオーバーの設定を解除
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

    var _Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.apply(this, arguments);
        this._vipActor = null;
        this._vipAll   = true;
    };

    Game_Party.prototype.setVip = function(id) {
        this._vipActor = id;
        this._vipAll   = false;
    };

    Game_Party.prototype.setVipAll = function() {
        this._vipAll   = true;
    };

    Game_Party.prototype.removeVip = function() {
        this._vipActor = null;
        this._vipAll   = false;
    };

    var _Game_Party_isAllDead = Game_Party.prototype.isAllDead;
    Game_Party.prototype.isAllDead = function() {
        var result = _Game_Party_isAllDead.apply(this, arguments);
        if (!result && this.deadMembers().length > 0 && (this.inBattle() || !this.isEmpty())) {
            return this._vipAll ? true :
                this._vipActor ? this.deadMembers().contains($gameActors.actor(this._vipActor)) : false;
        }
        return result;
    };
})();

