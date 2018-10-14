//=============================================================================
// FavouriteEquips.js
// ----------------------------------------------------------------------------
// (C) 2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2018/10/14 セーブ＆ロードを挟むとお気に入り装備が復元されない問題を修正
// 1.0.0 2017/10/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc FavouriteEquipsPlugin
 * @author triacontane
 *
 * @help FavouriteEquips.js
 *
 * お気に入りの装備パターンをプラグインコマンドで記憶、再現します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * FE_お気に入り設定 1 3     # ID[1]のアクターの装備をお気に入り[3]に設定します。
 * FE_SET_FAVOURITE 1 3      # 同上
 * FE_お気に入り復元 \v[2] 3 # [3]の装備を変数[2]のIDのアクターに復元します。
 * FE_GET_FAVOURITE \v[2] 3  # 同上
 *
 * お気に入り設定数に制限はありません。1以上の値を指定してください。
 *
 * スクリプト詳細
 * $gameActors.actor(id).getFavouriteEquipName(index, slotId);
 *
 * [id]で指定したアクターのお気に入り[index]の[slotId]の装備品名を取得します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc お気に入り装備プラグイン
 * @author トリアコンタン
 *
 * @help FavouriteEquips.js
 *
 * お気に入りの装備パターンをプラグインコマンドで記憶、再現します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * FE_お気に入り設定 1 3     # ID[1]のアクターの装備をお気に入り[3]に設定します。
 * FE_SET_FAVOURITE 1 3      # 同上
 * FE_お気に入り復元 \v[2] 3 # [3]の装備を変数[2]のIDのアクターに復元します。
 * FE_GET_FAVOURITE \v[2] 3  # 同上
 *
 * お気に入り設定数に制限はありません。1以上の値を指定してください。
 *
 * スクリプト詳細
 * $gameActors.actor(id).getFavouriteEquipName(index, slotId);
 *
 * [id]で指定したアクターのお気に入り[index]の[slotId]の装備品名を取得します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var metaTagPrefix = 'FE_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    var convertAllArguments = function(args) {
        return args.map(function(arg) {
            return convertEscapeCharacters(arg);
        });
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var pluginCommandMap = new Map();
    setPluginCommand('GET_FAVOURITE', 'execRestoreFavouriteEquip');
    setPluginCommand('お気に入り復元', 'execRestoreFavouriteEquip');
    setPluginCommand('SET_FAVOURITE', 'execSetFavouriteEquip');
    setPluginCommand('お気に入り設定', 'execSetFavouriteEquip');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertAllArguments(args));
        }
    };

    Game_Interpreter.prototype.execSetFavouriteEquip = function(args) {
        var actor = $gameActors.actor(getArgNumber(args[0], 1));
        if (actor) {
            actor.setFavouriteEquip(getArgNumber(args[1], 1));
        }
    };

    Game_Interpreter.prototype.execRestoreFavouriteEquip = function(args) {
        var actor = $gameActors.actor(getArgNumber(args[0], 1));
        if (actor) {
            actor.restoreFavouriteEquip(getArgNumber(args[1], 1));
        }
    };

    Game_Actor.prototype.initFavouriteEquipIfNeed = function() {
        if (!this._favouriteEquipsList) {
            this._favouriteEquipsList = [];
        }
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
        var equips = this.getFavouriteEquip(index);
        return equips && equips[slotId] ? equips[slotId].name : ' ';
    };

    Game_Actor.prototype.restoreFavouriteEquip = function(index) {
        var favouriteEquips = this.getFavouriteEquip(index);
        if (!favouriteEquips) {
            return;
        }
        this.clearEquipments();
        favouriteEquips.forEach(function(equipItem, slotId) {
            if (!equipItem) {
                return;
            }
            if (equipItem.wtypeId !== undefined) {
                equipItem = $dataWeapons[equipItem.id];
            } else {
                equipItem = $dataArmors[equipItem.id];
            }
            this.changeEquip(slotId, equipItem);
        }, this);
    };
})();

