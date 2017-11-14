//=============================================================================
// MenuBattleMemberOnly.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/11/15 プラグインの機能を有効にするかどうかをスイッチで切り替える機能を追加
// 1.0.3 2016/07/22 スキル画面でのアクターの切り替えで先頭キャラからのキャラ変更ができない問題を修正
// 1.0.2 2016/05/10 スキル画面、装備画面、ステータス画面でのアクターの切り替えに対応
// 1.0.1 2016/05/10 YEP_PartySystem.jsとの競合を解消
// 1.0.0 2016/05/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc MenuBattleMemberOnlyPlugin
 * @author triacontane
 *
 * @param ActivateSwitchId
 * @desc プラグインの機能が有効になるスイッチ番号です。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @help メインメニューの表示を戦闘メンバーのみにします。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
/*:ja
 * @plugindesc 戦闘メンバーのみメニュープラグイン
 * @author トリアコンタン
 *
 * @param 有効スイッチ番号
 * @desc プラグインの機能が有効になるスイッチ番号です。0を指定すると常に有効になります。
 * @default 0
 * @type switch
 *
 * @help メインメニューの表示を戦闘メンバーのみにします。
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
    var pluginName = 'MenuBattleMemberOnly';

    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param              = {};
    param.activateSwitchId = getParamNumber(['ActivateSwitchId', '有効スイッチ番号'], 0);

    //=============================================================================
    // Window_MenuStatus
    //  リザーブメンバーを非表示にします。
    //=============================================================================
    var _Window_MenuStatus_maxItems      = Window_MenuStatus.prototype.maxItems;
    Window_MenuStatus.prototype.maxItems = function() {
        return $gameParty.isBattleMemberMenu() ? $gameParty.battleMembers().length : _Window_MenuStatus_maxItems.apply(this, arguments);
    };

    var _Window_MenuStatus_selectLast      = Window_MenuStatus.prototype.selectLast;
    Window_MenuStatus.prototype.selectLast = function() {
        _Window_MenuStatus_selectLast.apply(this, arguments);
        if ($gameParty.isBattleMemberMenu() && this.index() > this.maxItems() - 1) {
            this.select(0);
        }
    };

    //=============================================================================
    // Game_Party
    //  メニュー画面でのアクターの選択をアクティブメンバーに限定します。
    //=============================================================================
    var _Game_Party_members      = Game_Party.prototype.members;
    Game_Party.prototype.members = function() {
        return this._isSettingMenuActor && this.isBattleMemberMenu() ? this.battleMembers() : _Game_Party_members.apply(this, arguments);
    };

    Game_Party.prototype.isBattleMemberMenu = function() {
        return param.activateSwitchId > 0 ? $gameSwitches.value(param.activateSwitchId) : true;
    };

    var _Game_Party_makeMenuActorNext      = Game_Party.prototype.makeMenuActorNext;
    Game_Party.prototype.makeMenuActorNext = function() {
        this._isSettingMenuActor = true;
        _Game_Party_makeMenuActorNext.apply(this, arguments);
        this._isSettingMenuActor = false;
    };

    var _Game_Party_makeMenuActorPrevious      = Game_Party.prototype.makeMenuActorPrevious;
    Game_Party.prototype.makeMenuActorPrevious = function() {
        this._isSettingMenuActor = true;
        _Game_Party_makeMenuActorPrevious.apply(this, arguments);
        this._isSettingMenuActor = false;
    };
})();

