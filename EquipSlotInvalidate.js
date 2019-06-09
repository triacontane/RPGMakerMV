/*=============================================================================
 EquipSlotInvalidate.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2019/06/09 ステートなどのメモ欄の記述でスロット無効化できる機能を追加
 1.0.1 2019/06/08 二刀流設定時、対象スロットが無効化されていると戦闘アニメーションも表示されないよう修正
 1.0.0 2019/05/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc EquipSlotInvalidatePlugin
 * @author triacontane
 *
 * @param commandPrefix
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help InvalidateEquipSlot.js
 *
 * アクターの装備スロットを無効化できます。
 * 無効化されたスロットに装備された武具は効力を発揮しなくなります。
 * 装備自体が外れることはありませんが、能力値変化及び特徴が全て無効になります。
 *
 * 無効化された場合もメニュー画面から装備変更は可能ですが、
 * パラメータは表示上も実際も変更されなくなります。
 * 無効化はメモ欄もしくはプラグインコマンドから指定します。
 *
 * ステートなど特徴を持つメモ欄に以下の通り入力してください。
 * <装備無効:1>     # スロット[1]を無効化
 * <EquipInvalid:1> # 同上
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * EQUIP_SLOT_INVALIDATE [アクターID] [スロット番号]
 * 装備武器無効化 [アクターID] [スロット番号]
 *  指定したアクターの装備スロットを無効化します。
 *  アクターIDに[0]を指定すると、パーティ全員が無効になります。
 *  スロット番号が一番上から1, 2, 3...の順で指定します。
 *  例：
 *  INVALIDATE_EQUIP_SLOT 1 1 # アクター[1]のスロット[1]を無効化
 *  装備武器無効化 0 2        # パーティ全員のスロット[2]を無効化
 *
 * EQUIP_SLOT_VALIDATE [アクターID] [スロット番号]
 * 装備武器有効化 [アクターID] [スロット番号]
 *  無効化したスロットを元に戻します。
 *  例：
 *  EQUIP_SLOT_VALIDATE 1 1 # アクター[1]のスロット[1]を戻す
 *  装備武器有効化 0 2      # パーティ全員のスロット[2]を戻す
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 装備スロットの無効化プラグイン
 * @author トリアコンタン
 *
 * @param commandPrefix
 * @text メモ欄接頭辞
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help InvalidateEquipSlot.js
 *
 * アクターの装備スロットを無効化できます。
 * 無効化されたスロットに装備された武具は効力を発揮しなくなります。
 * 装備自体が外れることはありませんが、能力値変化及び特徴が全て無効になります。
 *
 * 無効化された場合もメニュー画面から装備変更は可能ですが、
 * パラメータは表示上も実際も変更されなくなります。
 * 無効化はメモ欄もしくはプラグインコマンドから指定します。
 *
 * ステートなど特徴を持つメモ欄に以下の通り入力してください。
 * <装備無効:1>     # スロット[1]を無効化
 * <EquipInvalid:1> # 同上
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * EQUIP_SLOT_INVALIDATE [アクターID] [スロット番号]
 * 装備武器無効化 [アクターID] [スロット番号]
 *  指定したアクターの装備スロットを無効化します。
 *  アクターIDに[0]を指定すると、パーティ全員が無効になります。
 *  スロット番号が一番上から1, 2, 3...の順で指定します。
 *  例：
 *  INVALIDATE_EQUIP_SLOT 1 1 # アクター[1]のスロット[1]を無効化
 *  装備武器無効化 0 2        # パーティ全員のスロット[2]を無効化
 *
 * EQUIP_SLOT_VALIDATE [アクターID] [スロット番号]
 * 装備武器有効化 [アクターID] [スロット番号]
 *  無効化したスロットを元に戻します。
 *  例：
 *  EQUIP_SLOT_VALIDATE 1 1 # アクター[1]のスロット[1]を戻す
 *  装備武器有効化 0 2      # パーティ全員のスロット[2]を戻す
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/**
 * GameInvalidSlot
 * @constructor
 */
function GameInvalidEquipSlot() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';

    /**
     * Get database meta information.
     * @param object Database item
     * @param name Meta name
     * @returns {String} meta value
     */
    var getMetaValue = function(object, name) {
        var tagName = param.commandPrefix + name;
        return object.meta.hasOwnProperty(tagName) ? convertEscapeCharacters(object.meta[tagName]) : null;
    };

    /**
     * Get database meta information.(for multi language)
     * @param object Database item
     * @param names Meta name array (for multi language)
     * @returns {String} meta value
     */
    var getMetaValues = function(object, names) {
        var metaValue;
        names.some(function(name) {
            metaValue = getMetaValue(object, name);
            return metaValue !== null;
        });
        return metaValue;
    };

    /**
     * Convert escape characters.(require any window object)
     * @param text Target text
     * @returns {String} Converted text
     */
    var convertEscapeCharacters = function(text) {
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
    };

    /**
     * Convert escape characters.(for text array)
     * @param texts Target text array
     * @returns {Array<String>} Converted text array
     */
    var convertEscapeCharactersAll = function(texts) {
        return texts.map(function(text) {
            return convertEscapeCharacters(text);
        });
    };

    /**
     * Set plugin command to method
     * @param commandName plugin command name
     * @param methodName execute method(Game_Interpreter)
     */
    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(param.commandPrefix + commandName, methodName);
    };

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
    var param = createPluginParameter('EquipSlotInvalidate');

    var pluginCommandMap = new Map();
    setPluginCommand('EQUIP_SLOT_INVALIDATE', 'invalidateEquipSlot');
    setPluginCommand('装備武器無効化', 'invalidateEquipSlot');
    setPluginCommand('EQUIP_SLOT_VALIDATE', 'validateEquipSlot');
    setPluginCommand('装備武器有効化', 'validateEquipSlot');

    /**
     * Game_Interpreter
     * プラグインコマンドを追加定義します。
     */
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertEscapeCharactersAll(args));
        }
    };

    Game_Interpreter.prototype.invalidateEquipSlot = function(args) {
        var id = parseInt(args[0]) || 0;
        var slot = parseInt(args[1]) || 1;
        $gameParty.setEquipSlotValidation(id, slot, true);
    };

    Game_Interpreter.prototype.validateEquipSlot = function(args) {
        var id = parseInt(args[0]) || 0;
        var slot = parseInt(args[1]) || 1;
        $gameParty.setEquipSlotValidation(id, slot, false);
    };

    /**
     * Game_Party
     */
    Game_Party.prototype.setEquipSlotValidation = function(id, slot, value) {
        if (!this._invalidSlot) {
            this._invalidSlot = new GameInvalidEquipSlot();
        }
        this._invalidSlot.setValue(id, slot, value);
    };

    Game_Party.prototype.isInvalidEquipSlot = function(id, slot) {
        return this._invalidSlot && this._invalidSlot.getValue(id, slot);
    };

    /**
     * GameInvalidEquipSlot
     * 装備スロットの禁止状態を保持します。
     */
    GameInvalidEquipSlot.prototype.initialize = function() {
        this._actorInvalidSlotList = {};
    };

    GameInvalidEquipSlot.prototype.setValue = function(actorId, slotIndex, value) {
        this._actorInvalidSlotList[[actorId, slotIndex]] = value;
    };

    GameInvalidEquipSlot.prototype.getValue = function(actorId, slotIndex) {
        return this._actorInvalidSlotList[[actorId, slotIndex]] ||
            this._actorInvalidSlotList[[0, slotIndex]];
    };

    /**
     * 装備スロットの無効化を反映させます。
     */
    var _Game_Actor_equips = Game_Actor.prototype.equips;
    Game_Actor.prototype.equips = function() {
        var result = _Game_Actor_equips.apply(this, arguments);
        if (this._calcInvalidSlot) {
            this._calcInvalidSlot = false;
            return result.map(function(item, index) {
                return this.isInvalidEquipSlot(index + 1) ? null : item;
            }, this);
        } else {
            return result;
        }
    };

    Game_Actor.prototype.isInvalidEquipSlot = function(index) {
        if ($gameParty.isInvalidEquipSlot(this._actorId, index)) {
            return true;
        }
        // 再帰呼び出しのエラーを避けるため、上書き前のtraitObjectsを呼ぶ
        return _Game_Actor_traitObjects.apply(this).some(function(traitObj) {
            var metaValue = getMetaValues(traitObj, ['装備無効', 'EquipInvalid']);
            return metaValue && parseInt(metaValue) === index;
        });
    };

    var _Game_Actor_attackAnimationId1 = Game_Actor.prototype.attackAnimationId1;
    Game_Actor.prototype.attackAnimationId1 = function() {
        this._calcInvalidSlot = true;
        return _Game_Actor_attackAnimationId1.apply(this, arguments);
    };

    var _Game_Actor_attackAnimationId2 = Game_Actor.prototype.attackAnimationId2;
    Game_Actor.prototype.attackAnimationId2 = function() {
        this._calcInvalidSlot = true;
        return _Game_Actor_attackAnimationId2.apply(this, arguments);
    };

    var _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function(paramId) {
        this._calcInvalidSlot = true;
        return _Game_Actor_paramPlus.apply(this, arguments);
    };

    var _Game_Actor_traitObjects = Game_Actor.prototype.traitObjects;
    Game_Actor.prototype.traitObjects = function() {
        this._calcInvalidSlot = true;
        return _Game_Actor_traitObjects.apply(this, arguments);
    };
})();
