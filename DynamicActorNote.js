//=============================================================================
// DynamicActorNote.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/07/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc アクターのメモ欄動的設定プラグイン
 * @author トリアコンタン
 *
 * @help アクターのメモ欄を別のアクターのメモ欄で上書きします。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * DANメモ欄更新 1 2   # ID1のアクターのメモ欄をID2のアクターのメモ欄で上書き。
 * DAN_UPDATE_NOTE 1 2 # 上と同じです。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var metaTagPrefix = 'DAN';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix))) return;
        try {
            this.pluginCommandDynamicActorNote(command.replace(metaTagPrefix, ''), args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.stack || e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandDynamicActorNote = function(command, args) {
        switch (getCommandName(command)) {
            case 'メモ欄更新' :
            case '_UPDATE_NOTE':
                $gameActors.rewriteMetaData(getArgNumber(args[0], 1), getArgNumber(args[1], 1));
                break;
        }
    };

    //=============================================================================
    // Game_Actors
    //  メタデータの更新処理を追加定義します。
    //=============================================================================
    Game_Actors.prototype.restoreMetaData = function() {
        if (this._notes) {
            Object.keys(this._notes).forEach(function(key) {
                this.rewriteMetaData(key, this._notes[key]);
            }.bind(this));
        }
    };

    Game_Actors.prototype.rewriteMetaData = function(targetId, srcId) {
        DataManager.rewriteMetadata($dataActors[targetId], $dataActors[srcId]);
        if (!this._notes) this._notes = {};
        this._notes[targetId] = srcId;
    };

    //=============================================================================
    // DataManager
    //  メタデータの更新処理を追加定義します。
    //=============================================================================
    var _DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue      = function(saveFileId) {
        var result = _DataManager_loadGameWithoutRescue.apply(this, arguments);
        $gameActors.restoreMetaData();
        return result;
    };

    DataManager.rewriteMetadata = function(targetData, srcData) {
        if (!targetData.originalNote) targetData.originalNote = targetData.note;
        targetData.note = srcData.originalNote ? srcData.originalNote : srcData.note;
        this.extractMetadata(targetData);
    };
})();

