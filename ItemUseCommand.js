/*=============================================================================
 ItemUseCommand.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/01/15 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アイテム使用コマンドプラグイン
 * @author トリアコンタン
 *
 * @param unusableSwitch
 * @text 使用不可トリガー
 * @desc アイテムを使用できなかった場合にONになるスイッチです。
 * @default 0
 * @type switch
 *
 * @param playSe
 * @text 効果音演奏
 * @desc アイテム使用時に効果音を演奏します。
 * @default true
 * @type boolean
 *
 * @help ItemUseCommand.js
 *
 * 指定したIDのアイテムを使用するコマンドを提供します。
 * コマンド実行後は必要に応じてアイテムを消費し、
 * またアイテムがなければ使用はできません。
 *
 * メニュー画面で使用可能なアイテムのみが対象で戦闘用の
 * アイテムは使用できず、敵キャラは効果の適用外です。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * ITEM_USE [アイテムID] [対象者(並び順)]
 *
 * ex1. 対象者を指定せずID[1]のアイテムを使用
 * ITEM_USE 1
 *
 * ex2. ID[2]のアイテムを隊列の[3]番目のメンバーに使用
 * アイテム使用 2 3
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

    var param = createPluginParameter('ItemUseCommand');

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
        pluginCommandMap.set(commandName, methodName);
    };

    var pluginCommandMap = new Map();
    setPluginCommand('ITEM_USE', 'commandItemUse');
    setPluginCommand('アイテム使用', 'commandItemUse');

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

    Game_Interpreter.prototype.commandItemUse = function(args) {
        var item = $dataItems[parseInt(args[0])];
        if (item) {
            var targetIndex = parseInt(args[1]) - 1;
            var itemUse = new Game_ItemUse(item, targetIndex);
            itemUse.execute();
        }
    };

    /**
     * Game_ItemUse
     */
    class Game_ItemUse {
        constructor(item, targetIndex) {
            this._user = this.findUser();
            this._item = item;
            this._targetIndex = targetIndex || 0;
            this._action = new Game_Action(this._user);
            this._action.setItemObject(item);
        }

        canUse() {
            return this._user.canUse(this._item) && this.isEffectsValid();
        }

        isNeedActorWindow() {
            return this._action.isForFriend();
        }

        execute() {
            if (!this.canUse()) {
                if (param.unusableSwitch) {
                    $gameSwitches.setValue(param.unusableSwitch, true);
                }
                return;
            }
            console.log(param.playSe);
            if (param.playSe) {
                SoundManager.playUseItem();
            }
            this._user.consumeItem(this._item);
            var action = this._action;
            this.findTarget().forEach(function(target) {
                var repeats = action.numRepeats();
                for (var i = 0; i < repeats; i++) {
                    action.apply(target);
                }
            });
            action.applyGlobal();
        }

        isEffectsValid() {
            var action = this._action;
            return this.findTarget().some(function(target) {
                return action.testApply(target);
            });
        }

        findTarget() {
            var action = this._action;
            if (!action.isForFriend()) {
                return [];
            } else if (action.isForAll()) {
                return $gameParty.members();
            } else {
                return [$gameParty.members()[this._targetIndex]];
            }
        }

        findUser() {
            var members = $gameParty.movableMembers();
            var bestActor = members[0];
            var bestPha = 0;
            for (var i = 0; i < members.length; i++) {
                if (members[i].pha > bestPha) {
                    bestPha = members[i].pha;
                    bestActor = members[i];
                }
            }
            return bestActor;
        }
    }
})();
