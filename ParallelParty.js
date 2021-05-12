//=============================================================================
// ParallelParty.js
// ----------------------------------------------------------------------------
// (C) 2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.2 2021/05/12 初期パーティから変更後、セーブ、ロードを介することで正常に初期パーティに戻らなくなる場合がある問題を修正
// 2.0.1 2020/09/17 英語版のヘルプ作成とバグ修正
// 2.0.0 2020/09/17 MZ版向けに修正
// 1.3.0 2019/01/02 用語辞典プラグイン使用時に用語履歴を常に継承できるよう修正
// 1.2.1 2017/12/08 SceneGlossary.jsとの間で発生する可能性のある競合を解消
// 1.2.0 2017/05/15 パーティを切り替えた際にリソースを統合できる機能を追加
// 1.1.0 2017/05/13 パーティ間でリソースを共有する設定を追加、各パーティのマップ座標を記憶して自働で場所移動する機能を追加
// 1.0.0 2017/05/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ParallelParty
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallelParty.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param shareResource
 * @desc Different parties share resources, even if they are from different parties.
 * @default false
 * @type boolean
 *
 * @param savePosition
 * @desc Moves itself to a new location when you switch back to the original party.
 * @default false
 * @type boolean
 *
 * @command CHANGE_PARTY
 * @text Change Party
 * @desc Changes the current party to the party with the specified ID.
 *
 * @arg partyId
 * @text Party ID
 * @desc This is a party ID. Please see Help for more information.
 * @default 0
 * @type number
 *
 * @arg resourceCombine
 * @text Resource Integration
 * @desc Integrate your items and money with the party you are joining.
 * @default false
 * @type boolean
 *
 * @help You can manage multiple parties at the same time.
 * Each party is managed by a "party ID", which is initially set to "0".
 * Each of them has its own set of money and items, and you can use the plugin commands to add
 * You can switch to another party.
 *
 * Right after you move to a new party, you'll have zero members.
 * Please add actors in the event "Replace Members".
 *
 * Actors' information is shared, so you can get actors who have joined other parties.
 * If you put them in a different party, they will inherit their status.
 *
 * You cannot switch parties during battle.
 */
/*:ja
 * @plugindesc 並列パーティプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallelParty.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param shareResource
 * @text リソース共有
 * @desc 異なるパーティでもリソース(アイテム、武器、防具、お金、歩数)を共有します。
 * @default false
 * @type boolean
 *
 * @param savePosition
 * @text パーティ位置を保持
 * @desc パーティを切り替えたときに元の位置を保存し、元のパーティに戻したときに自働で場所移動します。
 * @default false
 * @type boolean
 *
 * @command CHANGE_PARTY
 * @text パーティ変更
 * @desc 現在のパーティを指定したIDのパーティに変更します。
 *
 * @arg partyId
 * @text パーティID
 * @desc パーティIDです。パーティIDについてはヘルプをご確認ください。
 * @default 0
 * @type number
 *
 * @arg resourceCombine
 * @text リソース統合
 * @desc 所持アイテムやお金を合流先のパーティと統合します。リソース共有のパラメータが有効な場合、統合は行われません。
 * @default false
 * @type boolean
 *
 * @help 複数のパーティを同時に管理できます。
 * 各パーティは「パーティID」で管理され、初期状態のパーティIDは「0」です。
 * それぞれ所持金やアイテムが別々に管理され、プラグインコマンドで
 * 別のパーティに交代できます。
 *
 * 新しいパーティに移った直後はメンバーが0人の状態なので
 * イベント「メンバーの入れ替え」でアクターを追加してください。
 *
 * アクターの情報は共有しているので、他のパーティに加入しているアクターを
 * 別のパーティに入れた場合、状態を引き継ぎます。
 *
 * 戦闘中のパーティの入れ替えはできません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function Game_Parties() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'CHANGE_PARTY', function(args) {
        if ($gameParty.inBattle()) {
            return;
        }
        $gameSystem.changeParty(args.partyId, args.resourceCombine);
        if (!$gamePlayer.isTransferring()) {
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        } else {
            this.setWaitMode('transfer');
        }
    });

    //=============================================================================
    // Game_System
    //  Game_Partiesを生成します。
    //=============================================================================
    Game_System.prototype.changeParty = function(partyId, resourceCombine) {
        if (!this._parties) {
            this._parties = new Game_Parties();
        }
        this._parties.change(partyId, resourceCombine);
    };

    //=============================================================================
    // Game_Party
    //  リソースの引き継ぎと位置の保存を追加定義します。
    //=============================================================================
    Game_Party.prototype.getAllResources = function() {
        return {
            items        : this._items,
            weapons      : this._weapons,
            armors       : this._armors,
            gold         : this._gold,
            steps        : this._steps,
            itemHistory  : this._itemHistory,
            weaponHistory: this._weaponHistory,
            armorHistory : this._armorHistory
        };
    };

    Game_Party.prototype.inheritAllResources = function(prevParty) {
        var resources = prevParty.getAllResources();
        this._items   = resources.items;
        this._weapons = resources.weapons;
        this._armors  = resources.armors;
        this._gold    = resources.gold;
        this._steps   = resources.steps;
        this.inheritItemHistory(prevParty);
    };

    Game_Party.prototype.combineAllResources = function(targetParty) {
        var resources = targetParty.getAllResources();
        Object.keys(resources.items).forEach(function(id) {
            this.gainItem($dataItems[id], resources.items[id], false);
        }, this);
        Object.keys(resources.weapons).forEach(function(id) {
            this.gainItem($dataWeapons[id], resources.weapons[id], false);
        }, this);
        Object.keys(resources.armors).forEach(function(id) {
            this.gainItem($dataArmors[id], resources.armors[id], false);
        }, this);
        this.gainGold(resources.gold);
        this._steps += resources.steps;
        $gameParty.initAllItems();
        $gameParty.loseGold($gameParty.maxGold());
        $gameParty._steps = 0;
    };

    // for SceneGlossary.js
    Game_Party.prototype.inheritItemHistory = function(prevParty) {
        var resources       = prevParty.getAllResources();
        this._itemHistory   = resources.itemHistory;
        this._weaponHistory = resources.weaponHistory;
        this._armorHistory  = resources.armorHistory;
    };

    Game_Party.prototype.moveSavedPosition = function() {
        if (!this._savedMapId) return;
        $gamePlayer.reserveTransfer(this._savedMapId, this._savedX, this._savedY, this._savedDirection, 2);
    };

    Game_Party.prototype.savePosition = function() {
        this._savedMapId     = $gameMap.mapId();
        this._savedX         = $gamePlayer.x;
        this._savedY         = $gamePlayer.y;
        this._savedDirection = $gamePlayer.direction();
    };

    //=============================================================================
    // Game_Parties
    //  複数のパーティを管理します。
    //=============================================================================
    Game_Parties.prototype.initialize = function() {
        this._data    = [$gameParty];
        this._partyId = 0;
    };

    Game_Parties.prototype.createPartyIfNeed = function() {
        if (!this.isExistParty()) {
            this._data[this._partyId] = new Game_Party();
        }
    };

    Game_Parties.prototype.isExistParty = function() {
        return !!this.getCurrentParty();
    };

    Game_Parties.prototype.getCurrentParty = function() {
        return this._data[this._partyId];
    };

    Game_Parties.prototype.setCurrentParty = function() {
        this._data[this._partyId] = $gameParty;
    };

    Game_Parties.prototype.change = function(partyId, resourceCombine) {
        if (this._partyId === partyId) {
            return;
        }
        this.setCurrentParty();
        this._partyId = partyId;
        this.createPartyIfNeed();
        var currentParty = this.getCurrentParty();
        if (param.shareResource) {
            currentParty.inheritAllResources($gameParty);
        } else if (resourceCombine) {
            currentParty.combineAllResources($gameParty);
        } else {
            currentParty.inheritItemHistory($gameParty);
        }
        if (param.savePosition) {
            this.moveSavedPosition();
        }
        $gameParty = currentParty;
    };

    Game_Parties.prototype.moveSavedPosition = function() {
        $gameParty.savePosition();
        var currentParty = this.getCurrentParty();
        currentParty.moveSavedPosition();
    };
})();

