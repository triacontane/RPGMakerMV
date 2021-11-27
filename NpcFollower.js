//=============================================================================
// NpcFollower.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2021/11/27 MZで動作するよう修正
// 1.1.1 2019/11/02 1.1.0の修正でメンバーの入れ替えを実施すると表示が不正になる場合がある問題を修正
// 1.1.0 2019/01/27 通常のフォロワーを表示せず、NPCフォロワーのみを表示できる機能を追加
// 1.0.3 2018/08/06 コアスクリプトが1.6.0より古い場合にエラーになる記述を修正
// 1.0.2 2017/01/17 プラグインコマンドが小文字でも動作するよう修正（byこまちゃん先輩）
// 1.0.1 2016/07/17 セーブデータをロードした際のエラーになる現象の修正
// 1.0.0 2016/07/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc NPCフォロワープラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/NpcFollower.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param MaxNpcNumber
 * @text 最大同時NPC数
 * @desc 同時に隊列に存在できるNPCの最大数です。
 * @default 1
 * @type number
 * @min 1
 *
 * @param HideNormalFollower
 * @text 通常フォロワーを表示しない
 * @desc 隊列歩行の設定にかかわらず通常のフォロワーを一切表示せず、NPCフォロワーのみを表示します。
 * @default false
 * @type boolean
 *
 * @command ADD_NPC
 * @text NPC追加
 * @desc 指定したアクターをNPCとして隊列に追加します。
 *
 * @arg actorId
 * @text アクターID
 * @desc 追加するアクターID
 * @default 1
 * @type actor
 *
 * @arg index
 * @text 隊列位置
 * @desc 追加する隊列位置(パーティの並び順)です。指定した位置の後ろに追加されます。
 * @default 0
 * @type number
 *
 * @command REMOVE_NPC
 * @text NPC削除
 * @desc 追加位置を指定してNPCを隊列から除去します。
 *
 * @arg index
 * @text 隊列位置
 * @desc 削除する隊列位置(パーティの並び順)です。
 * @default 0
 * @type number
 *
 * @help NpcFollower.js
 *
 * マップ上の隊列の好きな位置にパーティメンバー以外のNPCを追加します。
 * NPCはデータベース上はアクターで定義してプラグインコマンドから追加、削除します。
 * バトルメンバーではないので、メニュー画面や戦闘画面には影響を与えません。
 * また、隊列表示していない場合は何も表示されません。
 * 同一IDのアクターを複数追加することもできます。
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'ADD_NPC', args => {
        $gameParty.addNpc(args.actorId, args.index);
    });

    PluginManagerEx.registerCommand(script, 'REMOVE_NPC', args => {
        $gameParty.removeNpc(args.index);
    });

    //=============================================================================
    // Game_Party
    //  NPCの追加と削除を追加定義します。
    //=============================================================================
    const _Game_Party_initialize      = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.apply(this, arguments);
        this.initNpc();
    };

    Game_Party.prototype.initNpc = function() {
        this._npcs       = [];
        this._npcIndexes = [];
    };

    Game_Party.prototype.isNpcInvalid = function() {
        return !this._npcs;
    };

    Game_Party.prototype.initNpcIfNeed = function() {
        if (this.isNpcInvalid()) {
            this.initNpc();
            $gamePlayer.followers().initNpc();
        }
    };

    Game_Party.prototype.addNpc = function(actorId, index) {
        if (this._npcs.length < param.MaxNpcNumber) {
            this._npcs.push(actorId);
            this._npcIndexes.push(index);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        } else {
            throw new Error('登録可能な最大数を超えています。');
        }
    };

    Game_Party.prototype.removeNpc = function(index) {
        for (let i = 0, n = this._npcs.length; i < n; i++) {
            if (this._npcIndexes[i] === index) {
                this._npcs.splice(i, 1);
                this._npcIndexes.splice(i, 1);
                i--;
            }
        }
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
    };

    Game_Party.prototype.npcMembers = function() {
        return this._npcs.map(function(id) {
            return $gameActors.actor(id);
        });
    };

    Game_Party.prototype.visibleMembers = function() {
        return this._visibleMembers;
    };

    Game_Party.prototype.makeVisibleMembers = function() {
        const battleMembers  = this.battleMembers();
        const npcMembers     = this.npcMembers();
        const visibleMembers = [];
        for (let i = 0, n = this.maxBattleMembers() + 1; i < n; i++) {
            for (let j = 0, m = npcMembers.length; j < m; j++) {
                if (this._npcIndexes[j] === i) {
                    visibleMembers.push(npcMembers[j]);
                }
            }
            if (battleMembers.length > i && !param.HideNormalFollower) {
                visibleMembers.push(battleMembers[i]);
            }
        }
        this._visibleMembers = visibleMembers;
    };

    //=============================================================================
    // Game_Followers
    //  NPCの最大数ぶんだけ余分にGame_Followerを作成します。
    //=============================================================================
    const _Game_Followers_initialize      = Game_Followers.prototype.initialize;
    Game_Followers.prototype.initialize = function() {
        _Game_Followers_initialize.apply(this, arguments);
        if (param.HideNormalFollower) {
            this._data = [];
        }
        this.initNpc();
    };

    Game_Followers.prototype.initNpc = function() {
        const memberLength = this._data.length > 0 ? this._data.length + 1 : 0;
        for (let i = 0; i < param.MaxNpcNumber; i++) {
            this._data.push(new Game_Follower(memberLength + i));
        }
    };

    //=============================================================================
    // Game_Follower
    //  NPC判定を追加定義します。
    //=============================================================================
    const _Game_Follower_actor      = Game_Follower.prototype.actor;
    Game_Follower.prototype.actor = function() {
        _Game_Follower_actor.apply(this, arguments);
        return $gameParty.visibleMembers()[this._memberIndex];
    };

    //=============================================================================
    // Game_Player
    //  リフレッシュまえに表示メンバーを更新します。
    //=============================================================================
    const _Game_Player_refresh      = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        $gameParty.makeVisibleMembers();
        _Game_Player_refresh.apply(this, arguments);
    };

    //=============================================================================
    // DataManager
    //  プラグイン未適用のデータをロードした場合に必要なデータを初期化します。
    //=============================================================================
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents      = function(saveFileId) {
        _DataManager_extractSaveContents.apply(this, arguments);
        $gameParty.initNpcIfNeed();
    };
})();

