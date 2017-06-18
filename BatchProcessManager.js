//=============================================================================
// BatchProcessManager.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/06/18 サウンドテストプラグインの修正に合わせてBGS,ME,SEの情報も出力する機能を追加
// 1.0.1 2017/06/14 サウンドテストプラグインと組み合わせて使わないとエラーになる問題を修正
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
 * BPM_SOUND_TEST_MAKE_CSV or
 * BPM_サウンドテストCSV作成
 * 　サウンドテストプラグイン(SceneSoundTest.js)で使用する
 *   CSVファイルのひな形を出力します。
 * 　必要な列とオーディオごとの行が出力され、あとは説明と表示名を入力するだけです。
 * 　引数にコードを指定すればBGM以外も出力できます。
 * 　例1：BPM_SOUND_TEST_MAKE_CSV se            # SEのみ出力
 * 　例2：BPM_SOUND_TEST_MAKE_CSV bgm bgs me se # 全オーディオを出力
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function() {
    'use strict';
    var pluginName    = 'BatchProcessManager';
    var metaTagPrefix = 'BPM_';
    // テストプレー時以外は一切の機能を無効
    if (!StorageManager.isLocalMode()) {
        console.log(pluginName + 'is valid only local mode.');
        return;
    }

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var isEmpty = function(that) {
        return Object.keys(that).length <= 0;
    };

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    function BatchProcessManager() {
        throw new Error('This is a static class');
    }

    BatchProcessManager.batchStart = function(handlerString, args) {
        this.devToolOpen();
        console.log('処理を開始します。');
        try {
            this[handlerString](args);
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

    BatchProcessManager.getFileNameList = function(directly, IncludeExtension) {
        var fs   = require('fs');
        var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, directly);
        if (path.match(/^\/([A-Z]\:)/)) {
            path = path.slice(1);
        }
        var fileList    = [];
        var fileNameMap = {};
        fs.readdirSync(path).forEach(function(fileName) {
            if (!IncludeExtension) {
                fileName = fileName.replace(/(.*)\..*$/, function() {
                    return arguments[1];
                });
            }
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
            if (!columns) {
                columns = [];
                iterate(data, function(key) {
                    if (data.hasOwnProperty(key)) {
                        columns.push(key);
                        outText += key + ',';
                    }
                });
                outText = this._parseCsvText(outText);
            }
            columns.forEach(function(column) {
                outText += Object.prototype.toString.call(data[column]) !== 'Number' ? '"' + data[column] + '",' : data[column] + ',';
            });
            outText = this._parseCsvText(outText);
        }.bind(this));
        StorageManager.saveToLocalTextFile(fileName, outText);
    };

    BatchProcessManager._parseCsvText = function(text) {
        return (text[text.length - 1] === ',' ? text.substr(0, text.length - 1) : text) + '\n';
    };

    BatchProcessManager.getFileNameListAudio = function(type) {
        return this.getFileNameList(`/audio/${type}/`);
    };

    StorageManager.saveToLocalTextFile = function(fileName, text) {
        var fs       = require('fs');
        var dirPath  = this.localDataDirectoryPath();
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
        return !isEmpty(this._currentState);
    };

    BatchProcessManager.outputSoundTestCsv = function(types) {
        var objects = [];
        types.forEach(function(type) {
            objects = objects.concat(this.makeSoundTestCsv(type.toLowerCase()))
        }, this);
        this.saveCsvData('SoundTest.csv', objects);
    };

    BatchProcessManager.makeSoundTestCsv = function(type) {
        var fileList = this.getFileNameListAudio(type);
        var objects  = [];
        fileList.forEach(function(fileName) {
            var data         = {};
            data.fileName    = fileName;
            data.displayName = fileName;
            data.description = '　';
            data.type        = type;
            objects.push(data);
        });
        return objects;
    };

    BatchProcessManager.deleteAllSaveFile = function() {
        alert('作成中です');
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var commandPrefix = new RegExp('^' + metaTagPrefix);
        if (!command.match(commandPrefix)) return;
        try {
            this.pluginCommandBatchProcessManager(command.replace(commandPrefix, ''), args);
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

    Game_Interpreter.prototype.pluginCommandBatchProcessManager = function(command, args) {
        switch (getCommandName(command)) {
            case 'SOUND_TEST_MAKE_CSV' :
            case 'サウンドテストCSV作成':
                if (args.length === 0) args[0] = 'bgm';
                BatchProcessManager.batchStart('outputSoundTestCsv', args);
                break;
            case 'DELETE_SAVE_DATA' :
            case 'セーブファイル全削除':
                BatchProcessManager.batchStart('deleteAllSaveFile');
                break;
        }
    };
})();

