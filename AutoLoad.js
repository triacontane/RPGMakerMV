//=============================================================================
// AutoLoad.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/05/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 自動ロードプラグイン
 * @author トリアコンタン
 *
 * @param 効果音演奏
 * @desc セーブ成功時にシステム効果音を演奏します。
 * @default ON
 *
 * @help セーブファイルが存在する場合、タイトル画面をスキップします。
 * また、セーブ画面を経由せずに最後にアクセスしたセーブファイルに
 * 直接セーブするプラグインコマンドを提供します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * 最後にアクセスしたセーブファイルIDに直接セーブします。
 * AL_オートセーブ
 * AL_AUTO_SAVE
 * 例:AL_オートセーブ
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'AutoLoad';
    var metaTagPrefix = 'AL';

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramPlaySe = getParamBoolean(['PlaySe', '効果音演奏']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandAutoLoad(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.stack || e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandAutoLoad = function (command, args) {
        switch (getCommandName(command)) {
            case metaTagPrefix + 'オートセーブ' :
            case metaTagPrefix + '_AUTO_SAVE' :
                this._index++;
                $gameSystem.autoSave();
                break;
        }
    };

    //=============================================================================
    // Game_System
    //  自動セーブ処理を追加定義します。
    //=============================================================================
    Game_System.prototype.autoSave = function() {
        this.onBeforeSave();
        var result = DataManager.autoSaveGame();
        if (result && paramPlaySe) {
            SoundManager.playSave();
        }
    };

    //=============================================================================
    // DataManager
    //  自動セーブ処理を追加定義します。
    //=============================================================================
    DataManager.autoSaveGame = function() {
        var saveFileId = this.lastAccessedSavefileId();
        var result = this.saveGame(saveFileId);
        if (result) StorageManager.cleanBackup(saveFileId);
        return result;
    };

    DataManager.autoLoadGame = function() {
        var saveFileId = this.latestSavefileId();
        var result = false;
        if (this.isAnySavefileExists()) {
            result = this.loadGame(saveFileId);
        }
        return result;
    };

    //=============================================================================
    // Scene_Boot
    //  タイトル画面をとばしてマップ画面に遷移します。
    //=============================================================================
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        if (!DataManager.isBattleTest() && !DataManager.isEventTest()) {
            this.goToAutoLoad();
        }
    };

    Scene_Boot.prototype.goToAutoLoad = function() {
        var result = DataManager.autoLoadGame();
        if (result) {
            Scene_Load.prototype.reloadMapIfUpdated.call(Scene_Load);
            SceneManager.goto(Scene_Map);
            $gameSystem.onAfterLoad();
        }
    };
})();

