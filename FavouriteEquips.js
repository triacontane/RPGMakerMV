//=============================================================================
// FavouriteEquips.js
// ----------------------------------------------------------------------------
// (C) 2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.1 2024/09/30 お気に入り装備を復元する際、装備変更ができない状態であればスキップするよう修正
// 1.2.0 2024/09/21 お気に入り装備のIDとアイコンを取得するスクリプトを追加
// 1.1.0 2022/10/26 MZで動作するよう修正
// 1.0.1 2018/10/14 セーブ＆ロードを挟むとお気に入り装備が復元されない問題を修正
// 1.0.0 2017/10/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc お気に入り装備プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FavouriteEquips.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * 
 * @command FAVOURITE
 * @text お気に入り操作
 * @desc 指定したアクターの装備をお気に入り登録、復元、クリアします。
 *
 * @arg actorId
 * @text アクターID
 * @desc 登録対象のアクターIDです。
 * @default 1
 * @type actor
 * 
 * @arg type
 * @text 操作種別
 * @desc 操作種別です。登録:現装備の登録 復元:登録装備の復元 クリア:登録装備のクリア
 * @default set
 * @type select
 * @option 登録
 * @value set
 * @option 復元
 * @value get
 * @option クリア
 * @value clear
 * 
 * @arg index
 * @text インデックス
 * @desc お気に入り装備のインデックスです。
 * @default 1
 * @type number
 * @min 1
 *
 * @help FavouriteEquips.js
 *
 * お気に入りの装備パターンをプラグインコマンドで記憶、復元します。
 *
 * スクリプト詳細
 * $gameActors.actor(id).getFavouriteEquipName(index, slotId);
 * [id]で指定したアクターのお気に入り[index]の[slotId]の装備品名を取得します。
 *
 * $gameActors.actor(id).getFavouriteEquipId(index, slotId);
 * [id]で指定したアクターのお気に入り[index]の[slotId]の装備品IDを取得します。
 *
 * $gameActors.actor(id).getFavouriteEquipIcon(index, slotId);
 * [id]で指定したアクターのお気に入り[index]の[slotId]のアイコンを取得します。
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

    PluginManagerEx.registerCommand(script, 'FAVOURITE', args => {
        const actor = $gameActors.actor(args.actorId);
        switch (args.type) {
            case 'set':
                actor.setFavouriteEquip(args.index);
                break;
            case 'get':
                actor.restoreFavouriteEquip(args.index);
                break;
            case 'clear':
                actor.clearFavouriteEquip(args.index);
                break;
        }
    });

    Game_Actor.prototype.initFavouriteEquipIfNeed = function() {
        if (!this._favouriteEquipsList) {
            this._favouriteEquipsList = [];
        }
    };

    Game_Actor.prototype.clearFavouriteEquip = function(index) {
        this.initFavouriteEquipIfNeed();
        this._favouriteEquipsList[index] = undefined;
    };

    Game_Actor.prototype.setFavouriteEquip = function(index) {
        this.initFavouriteEquipIfNeed();
        this._favouriteEquipsList[index] = this.equips();
    };

    Game_Actor.prototype.getFavouriteEquip = function(index) {
        this.initFavouriteEquipIfNeed();
        return this._favouriteEquipsList[index];
    };

    Game_Actor.prototype.getFavouriteEquipName = function(index, slotId) {
        const equips = this.getFavouriteEquip(index);
        return equips && equips[slotId] ? equips[slotId].name : ' ';
    };

    Game_Actor.prototype.getFavouriteEquipId = function(index, slotId) {
        const equips = this.getFavouriteEquip(index);
        return equips && equips[slotId] ? equips[slotId].id : 0;
    };

    Game_Actor.prototype.getFavouriteEquipIcon = function(index, slotId) {
        const equips = this.getFavouriteEquip(index);
        return equips && equips[slotId] ? equips[slotId].iconIndex : 0;
    };

    Game_Actor.prototype.restoreFavouriteEquip = function(index) {
        const favouriteEquips = this.getFavouriteEquip(index);
        if (!favouriteEquips) {
            return;
        }
        this.clearEquipments();
        favouriteEquips.forEach((equipItem, slotId) => {
            if (!equipItem) {
                return;
            }
            if (equipItem.wtypeId !== undefined) {
                equipItem = $dataWeapons[equipItem.id];
            } else {
                equipItem = $dataArmors[equipItem.id];
            }
            if (this.isEquipChangeOk(slotId)) {
                this.changeEquip(slotId, equipItem);
            }
        });
    };
})();

