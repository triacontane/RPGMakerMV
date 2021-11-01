/*=============================================================================
 DynamicDatabaseNote.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2021/11/01 MZで動作するよう修正
 1.0.0 2019/10/22 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc データベースのメモ欄動的設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DynamicDatabaseNote.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command CHANGE_NOTE_ACTOR
 * @text アクターメモ欄変更
 * @desc 指定したデータのメモ欄を別のデータで上書きします。
 *
 * @arg destId
 * @text 上書き先ID
 * @desc 上書きされる対象となるデータのIDです。
 * @default 0
 * @type actor
 *
 * @arg srcId
 * @text 上書き元ID
 * @desc 上書きする元データとなるデータのIDです。
 * @default 0
 * @type actor
 *
 * @command CHANGE_NOTE_CLASS
 * @text 職業メモ欄変更
 * @desc 指定したデータのメモ欄を別のデータで上書きします。
 *
 * @arg destId
 * @text 上書き先ID
 * @desc 上書きされる対象となるデータのIDです。
 * @default 0
 * @type class
 *
 * @arg srcId
 * @text 上書き元ID
 * @desc 上書きする元データとなるデータのIDです。
 * @default 0
 * @type class
 * 
 * @command CHANGE_NOTE_ITEM
 * @text アイテムメモ欄変更
 * @desc 指定したデータのメモ欄を別のデータで上書きします。
 *
 * @arg destId
 * @text 上書き先ID
 * @desc 上書きされる対象となるデータのIDです。
 * @default 0
 * @type item
 *
 * @arg srcId
 * @text 上書き元ID
 * @desc 上書きする元データとなるデータのIDです。
 * @default 0
 * @type item
 * 
 * @command CHANGE_NOTE_SKILL
 * @text スキルメモ欄変更
 * @desc 指定したデータのメモ欄を別のデータで上書きします。
 *
 * @arg destId
 * @text 上書き先ID
 * @desc 上書きされる対象となるデータのIDです。
 * @default 0
 * @type skill
 *
 * @arg srcId
 * @text 上書き元ID
 * @desc 上書きする元データとなるデータのIDです。
 * @default 0
 * @type skill
 *
 * @command CHANGE_NOTE_WEAPON
 * @text 武器メモ欄変更
 * @desc 指定したデータのメモ欄を別のデータで上書きします。
 *
 * @arg destId
 * @text 上書き先ID
 * @desc 上書きされる対象となるデータのIDです。
 * @default 0
 * @type weapon
 *
 * @arg srcId
 * @text 上書き元ID
 * @desc 上書きする元データとなるデータのIDです。
 * @default 0
 * @type weapon
 * 
 * @command CHANGE_NOTE_ARMOR
 * @text 防具メモ欄変更
 * @desc 指定したデータのメモ欄を別のデータで上書きします。
 *
 * @arg destId
 * @text 上書き先ID
 * @desc 上書きされる対象となるデータのIDです。
 * @default 0
 * @type armor
 *
 * @arg srcId
 * @text 上書き元ID
 * @desc 上書きする元データとなるデータのIDです。
 * @default 0
 * @type armor
 * 
 * @command CHANGE_NOTE_STATE
 * @text ステートメモ欄変更
 * @desc 指定したデータのメモ欄を別のデータで上書きします。
 *
 * @arg destId
 * @text 上書き先ID
 * @desc 上書きされる対象となるデータのIDです。
 * @default 0
 * @type state
 *
 * @arg srcId
 * @text 上書き元ID
 * @desc 上書きする元データとなるデータのIDです。
 * @default 0
 * @type state
 * 
 * @command CHANGE_NOTE_ENEMY
 * @text 敵キャラメモ欄変更
 * @desc 指定したデータのメモ欄を別のデータで上書きします。
 *
 * @arg destId
 * @text 上書き先ID
 * @desc 上書きされる対象となるデータのIDです。
 * @default 0
 * @type enemy
 *
 * @arg srcId
 * @text 上書き元ID
 * @desc 上書きする元データとなるデータのIDです。
 * @default 0
 * @type enemy
 *
 * @help DynamicDatabaseNote.js
 *
 * データベースのメモ欄をゲーム中に上書き変更します。
 * 変更対象のデータと、変更前後のIDを指定してください。
 * 存在しないIDやデータベースを指定するとエラーになります。
 *
 * 注意事項：
 * 使っているプラグインのメモ欄の使い方によっては
 * 当プラグインの変更が反映されない場合があります。
 * その場合、本プラグイン側での対処は難しいです。
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

    PluginManagerEx.registerCommand(script, 'CHANGE_NOTE_ACTOR', function (args) {
        this.changeDataNote('$dataActors', args);
    });

    PluginManagerEx.registerCommand(script, 'CHANGE_NOTE_CLASS', function (args) {
        this.changeDataNote('$dataClasses', args);
    });

    PluginManagerEx.registerCommand(script, 'CHANGE_NOTE_ITEM', function (args) {
        this.changeDataNote('$dataItems', args);
    });

    PluginManagerEx.registerCommand(script, 'CHANGE_NOTE_SKILL', function (args) {
        this.changeDataNote('$dataSkills', args);
    });

    PluginManagerEx.registerCommand(script, 'CHANGE_NOTE_WEAPON', function (args) {
        this.changeDataNote('$dataWeapons', args);
    });

    PluginManagerEx.registerCommand(script, 'CHANGE_NOTE_ARMOR', function (args) {
        this.changeDataNote('$dataArmors', args);
    });

    PluginManagerEx.registerCommand(script, 'CHANGE_NOTE_STATE', function (args) {
        this.changeDataNote('$dataStates', args);
    });

    PluginManagerEx.registerCommand(script, 'CHANGE_NOTE_ENEMY', function (args) {
        this.changeDataNote('$dataEnemies', args);
    });

    Game_Interpreter.prototype.changeDataNote = function(databaseName, args) {
        $gameSystem.changeMetaData(databaseName, args.destId, args.srcId);
    };

    Game_System.prototype.restoreMetaData = function() {
        if (!this._notes) {
            return;
        }
        Object.keys(this._notes).forEach(databaseName => {
            Object.keys(this._notes[databaseName]).forEach(key => {
                this.rewriteMetaData(databaseName, key, this._notes[databaseName][key]);
            });
        });
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
        const database = window[databaseName];
        if (database && Array.isArray(database)) {
            DataManager.rewriteMetadata(database[targetId], database[srcId]);
        }
    };

    const _Scene_GameEnd_create = Scene_GameEnd.prototype.create;
    Scene_GameEnd.prototype.create = function() {
        _Scene_GameEnd_create.apply(this, arguments);
        DataManager.loadDatabase();
    };

    //=============================================================================
    // DataManager
    //  メタデータの更新処理を追加定義します。
    //=============================================================================
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents      = function(saveFileId) {
        _DataManager_extractSaveContents.apply(this, arguments);
        $gameSystem.restoreMetaData();
    };

    DataManager.rewriteMetadata = function(targetData, srcData) {
        if (!targetData.originalNote) {
            targetData.originalNote = targetData.note;
        }
        targetData.note = srcData.originalNote ? srcData.originalNote : srcData.note;
        this.extractMetadata(targetData);
    };
})();
