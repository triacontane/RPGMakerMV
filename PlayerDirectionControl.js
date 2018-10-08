/*=============================================================================
 PlayerDirectionControl.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2018/10/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc PlayerDirectionControlPlugin
 * @author triacontane
 *
 * @param commandPrefix
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help PlayerDirectionControl.js
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * CTRL_PLAYER_DIRECTION （方向）
 * プレイヤーの向きを指定した方向のみに制限します。
 * 複数指定可能です。（2:下 4:左 6:右 8:上）
 * (例)
 * CTRL_PLAYER_DIRECTION 2 4 # プレイヤーの向きを下と左に限定
 *
 * 向きを指定しなかった場合、通常通り全ての方向に転換できます。
 * コマンドを実行した時点で向きが自動的に変わることはありません。
 * 現バージョンでは、向き制御ができるのはプレイヤーのみです。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc プレイヤーの向き制御プラグイン
 * @author トリアコンタン
 *
 * @param commandPrefix
 * @text メモ欄接頭辞
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help PlayerDirectionControl.js
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * CTRL_PLAYER_DIRECTION （方向）
 * プレイヤーの向きを指定した方向のみに制限します。
 * 複数指定可能です。（2:下 4:左 6:右 8:上）
 * (例)
 * CTRL_PLAYER_DIRECTION 2 4 # プレイヤーの向きを下と左に限定
 *
 * 向きを指定しなかった場合、通常通り全ての方向に転換できます。
 * コマンドを実行した時点で向きが自動的に変わることはありません。
 * 現バージョンでは、向き制御ができるのはプレイヤーのみです。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

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
    var param = createPluginParameter('PlayerDirectionControl');

    var pluginCommandMap = new Map();
    setPluginCommand('CTRL_PLAYER_DIRECTION', 'execControlPlayerDirection');

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

    Game_Interpreter.prototype.execControlPlayerDirection = function(args) {
        $gamePlayer.setControlDirections(args.map(function(arg) {
            return parseInt(arg);
        }))
    };

    var _Game_CharacterBase_setDirection      = Game_CharacterBase.prototype.setDirection;
    Game_CharacterBase.prototype.setDirection = function(d) {
        var prevDirection = this.direction();
        _Game_CharacterBase_setDirection.apply(this, arguments);
        if (this._controlDirections) {
            this.modifyDirectionByDirectionControl(prevDirection);
        }
    };

    Game_CharacterBase.prototype.modifyDirectionByDirectionControl = function(prevDirection) {
        if (!this.isDirectionFixed() && !this._controlDirections.contains(this._direction)) {
            this._direction = prevDirection;
        }
    };

    Game_CharacterBase.prototype.setControlDirections = function(controlDirections) {
        if (controlDirections && controlDirections.length > 0) {
            this._controlDirections = controlDirections;
        }
    };
})();
