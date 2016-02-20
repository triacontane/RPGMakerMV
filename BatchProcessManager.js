//=============================================================================
// BatchProcessManager.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc バッチ処理プラグイン
 * @author トリアコンタン
 *
 * @help プラグインコマンドから実行可能なバッチ処理を提供します。
 * 様々なファイルやデータ出力の一括処理を実現可能にする予定です。
 * イベントテストからの実行を推奨します。
 * イベントエディターからコマンドを右クリック→テストで実行できます。
 * このプラグインはローカル環境下でのみ動作します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SOUND_TEST_MAKE_CSV or
 * サウンドテストCSV作成
 * 　サウンドテストプラグイン(SceneSoundTest.js)で使用する
 *   CSVファイルのひな形を出力します。
 * 　必要な列とBGMごとの行が出力され、あとは説明と表示名を入力するだけです。
 * 　例：SOUND_TEST_MAKE_CSV
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    'use strict';
    // テストプレー時以外は一切の機能を無効
    if (!Utils.isOptionValid('test') || !Utils.isNwjs()) {
        console.log('BatchProcessManager is valid only test play and nw.js.');
        return;
    }

    var pluginName = 'BatchProcessManager';

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    if (!Object.prototype.hasOwnProperty('isEmpty')) {
        Object.defineProperty(Object.prototype, 'isEmpty', {
            value : function () {
                return Object.keys(this).length <= 0;
            }
        });
    }

    function BatchProcessManager() {
        throw new Error('This is a static class');
    }

    BatchProcessManager.batchStart = function(handlerString) {
        this.devToolOpen();
        console.log('処理を開始します。');
        try {
            this[handlerString]();
            console.log('処理が正常に終了しました。');
        } catch (e) {
            console.error('処理で例外が発生しました。:' + e.toString());
            throw e;
        }
        this.pause(SceneManager.terminate);
    };

    BatchProcessManager.pause = function(handler) {
        console.log('続行するには何かキーを押してください……');
        setInterval(function() {
            if (Input.isPressedAny() || TouchInput.isPressed()) handler();
        }, 50);
    };

    BatchProcessManager.devToolOpen = function() {
        var window = require('nw.gui').Window.get();
        if (!window.isDevToolsOpen()) {
            var devTool = window.showDevTools();
            devTool.moveTo(0, 0);
            devTool.resizeTo(Graphics.width, Graphics.height);
            window.focus();
        }
    };

    BatchProcessManager.getFileNameList = function(directly) {
        var fs = require('fs');
        var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, directly);
        if (path.match(/^\/([A-Z]\:)/)) {
            path = path.slice(1);
        }
        var fileList = [];
        var fileNameMap = {};
        fs.readdirSync(path).forEach(function(fileName) {
            fileName = fileName.replace(/(.*)\..*$/, function() {
                return arguments[1];
            });
            if (fileNameMap[fileName]) return;
            fileNameMap[fileName] = true;
            fileList.push(fileName);
        });
        return fileList;
    };

    BatchProcessManager.saveCsvData = function(fileName, objects) {
        var columns = null, outText = '';
        objects.forEach(function(data) {
            if (!data)return;
            if (columns == null) {
                columns = [];
                data.iterate(function(key) {
                    if (data.hasOwnProperty(key)) {
                        columns.push(key);
                        outText += key + ',';
                    }
                });
                outText = this._parseCsvText(outText);
            }
            columns.forEach(function (column) {
                outText += Object.prototype.toString.call(data[column]) !== 'Number' ? '"' + data[column] + '",' : data[column] + ',';
            });
            outText = this._parseCsvText(outText);
        }.bind(this));
        StorageManager.saveToLocalTextFile(fileName, outText);
    };

    BatchProcessManager._parseCsvText = function(text) {
        return (text[text.length - 1] === ',' ? text.substr(0, text.length - 1) : text) + '\n';
    };

    BatchProcessManager.getFileNameListAudioBgm = function() {
        return this.getFileNameList('/audio/bgm/');
    };

    StorageManager.saveToLocalTextFile = function(fileName, text) {
        var fs = require('fs');
        var dirPath = this.localDataDirectoryPath();
        var filePath = dirPath + fileName;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, text);
        console.log('dirPath:' + dirPath);
        console.log('filePath:' + filePath);
    };

    StorageManager.localDataDirectoryPath = function() {
        var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/data/');
        if (path.match(/^\/([A-Z]\:)/)) {
            path = path.slice(1);
        }
        return decodeURIComponent(path);
    };

    Input.isPressedAny = function() {
        return !this._currentState.isEmpty();
    };

    BatchProcessManager.outputSoundTestCsv = function() {
        var fileList = this.getFileNameListAudioBgm();
        var objects = [];
        fileList.forEach(function (fileName) {
            var data = {};
            data.fileName = fileName;
            data.displayName = fileName;
            data.description = '　';
            objects.push(data);
        });
        this.saveCsvData('SoundTest.csv', objects);
    };

    BatchProcessManager.deleteAllSaveFile = function() {

        alert(this.getFileNameList('/save/'));
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandBatchProcessManager(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window  = require('nw.gui').Window.get();
                var devTool = window.showDevTools();
                devTool.moveTo(0, 0);
                devTool.resizeTo(Graphics.width, Graphics.height);
                window.focus();
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
            throw e;
        }
    };

    Game_Interpreter.prototype.pluginCommandBatchProcessManager = function (command, args) {
        switch (getCommandName(command)) {
            case 'SOUND_TEST_MAKE_CSV' :
            case 'サウンドテストCSV作成':
                BatchProcessManager.batchStart('outputSoundTestCsv');
                break;
            case 'DELETE_SAVE_DATA' :
            case 'セーブファイル全削除':
                BatchProcessManager.batchStart('deleteAllSaveFile');
                break;
        }
    };
})();

