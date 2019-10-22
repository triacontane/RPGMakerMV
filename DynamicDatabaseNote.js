/*=============================================================================
 DynamicDatabaseNote.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2019/10/22 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc DynamicDatabaseNotePlugin
 * @author triacontane
 *
 * @param commandPrefix
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help DynamicDatabaseNote.js
 *
 * データベースのメモ欄をゲーム中に上書き変更します。
 * 変更対象のデータと、変更前後のIDを指定してください。
 * 存在しないIDやデータベースを指定するとエラーになります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * メモ欄変更 $dataActors 1 2   # ID[1]のアクター(※1)のメモ欄をID[2]のメモ欄で上書き。
 * CHANGE_NOTE $dataActors 1 2 # 同上
 *
 * ※1
 * 変更対象のデータベース以下の通り指定してください。
 * $dataActors : アクター
 * $dataItems : アイテム
 * $dataWeapons : 武器
 * $dataArmors : 防具
 * $dataStates : ステート
 * $dataEnemies : 敵キャラ
 *
 * 注意事項：
 * 使っているプラグインのメモ欄の使い方によっては
 * 当プラグインの変更が反映されない場合があります。
 * その場合、本プラグイン側での対処は難しいです。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc データベースのメモ欄動的設定プラグイン
 * @author トリアコンタン
 *
 * @param commandPrefix
 * @text メモ欄接頭辞
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help DynamicDatabaseNote.js
 *
 * データベースのメモ欄をゲーム中に上書き変更します。
 * 変更対象のデータと、変更前後のIDを指定してください。
 * 存在しないIDやデータベースを指定するとエラーになります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * メモ欄変更 $dataActors 1 2   # ID[1]のアクター(※1)のメモ欄をID[2]のメモ欄で上書き。
 * CHANGE_NOTE $dataActors 1 2 # 同上
 *
 * ※1
 * 変更対象のデータベース以下の通り指定してください。
 * $dataActors : アクター
 * $dataItems : アイテム
 * $dataWeapons : 武器
 * $dataArmors : 防具
 * $dataStates : ステート
 * $dataEnemies : 敵キャラ
 *
 * 注意事項：
 * 使っているプラグインのメモ欄の使い方によっては
 * 当プラグインの変更が反映されない場合があります。
 * その場合、本プラグイン側での対処は難しいです。
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

    var param = createPluginParameter('DynamicDatabaseNote');

    /**
     * Set plugin command to method
     * @param commandName plugin command name
     * @param methodName execute method(Game_Interpreter)
     */
    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(param.commandPrefix + commandName, methodName);
    };

    var pluginCommandMap = new Map();
    setPluginCommand('メモ欄変更', 'changeDataNote');
    setPluginCommand('CHANGE_NOTE', 'changeDataNote');

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

    Game_Interpreter.prototype.changeDataNote = function(args) {
        var targetId = parseInt(args[1]) || 1;
        var srcId = parseInt(args[2]) || 1;
        $gameSystem.changeMetaData(args[0], targetId, srcId);
    };

    Game_System.prototype.restoreMetaData = function() {
        if (!this._notes) {
            return;
        }
        Object.keys(this._notes).forEach(function(databaseName) {
            Object.keys(this._notes[databaseName]).forEach(function(key) {
                this.rewriteMetaData(databaseName, key, this._notes[databaseName][key]);
            }, this);
        }, this);
    };

    Game_System.prototype.saveMetaData = function(databaseName, targetId, srcId) {
        if (!this._notes) {
            this._notes = {};
        }
        if (!this._notes[databaseName]) {
            this._notes[databaseName] = {};
        }
        this._notes[databaseName][targetId] = srcId;
    };

    Game_System.prototype.changeMetaData = function(databaseName, targetId, srcId) {
        this.rewriteMetaData(databaseName, targetId, srcId);
        this.saveMetaData(databaseName, targetId, srcId);
    };

    Game_System.prototype.rewriteMetaData = function(databaseName, targetId, srcId) {
        var database = window[databaseName];
        if (database && Array.isArray(database)) {
            DataManager.rewriteMetadata(database[targetId], database[srcId]);
        }
    };

    //=============================================================================
    // DataManager
    //  メタデータの更新処理を追加定義します。
    //=============================================================================
    var _DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue      = function(saveFileId) {
        var result = _DataManager_loadGameWithoutRescue.apply(this, arguments);
        $gameSystem.restoreMetaData();
        return result;
    };

    DataManager.rewriteMetadata = function(targetData, srcData) {
        if (!targetData.originalNote) {
            targetData.originalNote = targetData.note;
        }
        targetData.note = srcData.originalNote ? srcData.originalNote : srcData.note;
        this.extractMetadata(targetData);
    };
})();
