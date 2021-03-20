//=============================================================================
// GeneralTrigger.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2021/03/20 パラメータの型指定機能に対応
// 1.1.0 2016/07/06 レベルアップ時、レベルダウン時のトリガーを追加
// 1.0.2 2016/06/22 最強装備を選択した場合にエラーが発生する問題を修正
// 1.0.1 2016/06/17 ロードが失敗するバグを修正
// 1.0.0 2016/06/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc トリガープラグイン
 * @author トリアコンタン
 *
 * @param NewGame
 * @text ニューゲーム
 * @desc ニューゲーム時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param Continue
 * @text コンティニュー
 * @desc コンティニュー時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param Options
 * @text オプション画面
 * @desc オプション画面を出た時にONになるスイッチ番号。ただしタイトル画面の場合は無効です。
 * @default 0
 * @type switch
 *
 * @param Menu
 * @text メニュー画面
 * @desc メニュー画面を出た時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param Save
 * @text セーブ画面
 * @desc セーブ画面を出た時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param Battle
 * @text 戦闘画面
 * @desc 戦闘画面を出た時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param Shop
 * @text ショップ画面
 * @desc ショップ画面を出た時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param MoveMap
 * @text 別マップ移動
 * @desc 別マップ移動時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param GainItem
 * @text アイテム増減
 * @desc アイテム増減時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param GainWeapon
 * @text 武器増減
 * @desc 武器増減時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param GainArmor
 * @text 防具増減
 * @desc 防具増減時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param ItemId
 * @text アイテムID
 * @desc アイテム、武器、防具入手時に格納されるアイテムIDを格納する変数番号
 * @default 0
 * @type variable
 *
 * @param ItemAmount
 * @text アイテム個数
 * @desc アイテム、武器、防具入手時に格納されるアイテム増減数を格納する変数番号
 * @default 0
 * @type variable
 *
 * @param AddMember
 * @text メンバー加入
 * @desc メンバー加入時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param RemoveMember
 * @text メンバー離脱
 * @desc メンバー離脱時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param LevelUp
 * @text レベルアップ
 * @desc レベルアップ時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param LevelDown
 * @text レベルダウン
 * @desc レベルダウン時にONになるスイッチ番号
 * @default 0
 * @type switch
 *
 * @param ActorId
 * @text アクターID
 * @desc 加入・離脱、レベルアップ、レベルダウンしたアクターIDを格納する変数番号
 * @default 0
 * @type variable
 * 
 * @param ValidOnlyMap
 * @text マップ画面でのみ有効
 * @desc アイテムの増減やレベルアップについて、マップ画面でのみスイッチをONにします。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @help ゲーム中、様々な局面でスイッチをONにします。
 * 主に並列処理、自動実行のコモンイベントと組み合わせて使用します。
 * 以下のタイミングでスイッチをONにできます。
 *
 * ・ニューゲーム
 * ・コンティニュー
 * ・メニュー画面を閉じたとき
 * ・オプション画面を閉じたとき
 * ・セーブ画面を閉じたとき
 * ・ショップ画面を閉じたとき
 * ・別マップに移動したとき
 * ・アイテムを入手したとき
 * ・メンバーが加入、離脱したとき
 * ・レベルが増減したとき
 * 
 * また、トリガーの種類によっては、スイッチがONになると同時に変数に
 * 所定の値が代入されます。
 * 
 * 例えば、アイテム入手のトリガーがONになったときに指定された変数に
 * アイテムIDが格納されます。
 * 専用の入手インフォメーション等が作成できます。
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

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('GeneralTrigger');

    //=============================================================================
    // SceneManager
    //  トリガースイッチを設定処理を追加定義します。
    //=============================================================================
    var _SceneManager_pop = SceneManager.pop;
    SceneManager.pop      = function() {
        if (this._stack.length > 0) {
            this._scene.setPopTrigger();
        }
        _SceneManager_pop.apply(this, arguments);
    };

    SceneManager.setTriggerSwitch = function(switchNumber) {
        if ($gameSwitches && switchNumber > 0) {
            $gameSwitches.setValue(switchNumber, true);
        }
    };

    SceneManager.setTriggerVariable = function(variableNumber, value) {
        if ($gameVariables && variableNumber > 0) {
            $gameVariables.setValue(variableNumber, value);
        }
    };

    SceneManager.isTriggerValid = function() {
        return !param.ValidOnlyMap || this._scene instanceof Scene_Map;
    };

    //=============================================================================
    // DataManager
    //  ニューゲーム、コンティニューのトリガースイッチを設定します。
    //=============================================================================
    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame      = function() {
        _DataManager_setupNewGame.apply(this, arguments);
        SceneManager.setTriggerSwitch(param.NewGame);
    };

    var _DataManager_loadGame = DataManager.loadGame;
    DataManager.loadGame      = function(saveFileId) {
        var result = _DataManager_loadGame.apply(this, arguments);
        SceneManager.setTriggerSwitch(param.Continue);
        return result;
    };

    //=============================================================================
    // Game_Player
    //  場所移動時にトリガースイッチを設定します。
    //=============================================================================
    var _Game_Player_reserveTransfer      = Game_Player.prototype.reserveTransfer;
    Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
        _Game_Player_reserveTransfer.apply(this, arguments);
        SceneManager.setTriggerSwitch(param.MoveMap);
    };

    var _Game_Party_addActor      = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function(actorId) {
        var length = this._actors.length;
        _Game_Party_addActor.apply(this, arguments);
        if (length !== this._actors.length && SceneManager.isTriggerValid()) {
            SceneManager.setTriggerSwitch(param.AddMember);
            SceneManager.setTriggerVariable(param.ActorId, actorId);
        }
    };

    var _Game_Party_removeActor      = Game_Party.prototype.removeActor;
    Game_Party.prototype.removeActor = function(actorId) {
        var length = this._actors.length;
        _Game_Party_removeActor.apply(this, arguments);
        if (length !== this._actors.length && SceneManager.isTriggerValid()) {
            SceneManager.setTriggerSwitch(param.RemoveMember);
            SceneManager.setTriggerVariable(param.ActorId, actorId);
        }
    };

    var _Game_Party_gainItem      = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        _Game_Party_gainItem.apply(this, arguments);
        if (!item || !SceneManager.isTriggerValid()) return;
        switch (this.itemContainer(item)) {
            case this._items:
                SceneManager.setTriggerSwitch(param.GainItem);
                break;
            case this._weapons:
                SceneManager.setTriggerSwitch(param.GainWeapon);
                break;
            case this._armors:
                SceneManager.setTriggerSwitch(param.GainArmor);
                break;
        }
        SceneManager.setTriggerVariable(param.ItemId, item.id);
        SceneManager.setTriggerVariable(param.ItemAmount, amount);
    };

    var _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.apply(this, arguments);
        if (SceneManager.isTriggerValid()) {
            SceneManager.setTriggerSwitch(param.LevelUp);
            SceneManager.setTriggerVariable(param.ActorId, this.actorId());
        }
    };

    var _Game_Actor_levelDown = Game_Actor.prototype.levelDown;
    Game_Actor.prototype.levelDown = function() {
        _Game_Actor_levelDown.apply(this, arguments);
        if (SceneManager.isTriggerValid()) {
            SceneManager.setTriggerSwitch(param.LevelDown);
            SceneManager.setTriggerVariable(param.ActorId, this.actorId());
        }
    };

    //=============================================================================
    // Scene_Base
    //  各クラス用のトリガースイッチを設定します。
    //=============================================================================
    Scene_Base.prototype.setPopTrigger = function() {
    };

    Scene_Options.prototype.setPopTrigger = function() {
        SceneManager.setTriggerSwitch(param.Options);
    };

    Scene_Menu.prototype.setPopTrigger = function() {
        SceneManager.setTriggerSwitch(param.Menu);
    };

    Scene_Save.prototype.setPopTrigger = function() {
        SceneManager.setTriggerSwitch(param.Save);
    };

    Scene_Shop.prototype.setPopTrigger = function() {
        SceneManager.setTriggerSwitch(param.Shop);
    };

    Scene_Battle.prototype.setPopTrigger = function() {
        SceneManager.setTriggerSwitch(param.Battle);
    };
})();

