//=============================================================================
// SyncVariable.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/04/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ユーザ間の変数同期プラグイン
 * @author トリアコンタン
 *
 * @param ユーザID
 * @desc 本プラグインを利用するためのユーザIDです。MilkcocoaのユーザIDではありません。
 * @default
 *
 * @param 同期開始変数番号
 * @desc 同期対象になる変数の番号の開始位置です。
 * @default 0
 *
 * @param 同期終了変数番号
 * @desc 同期対象になる変数の番号の終了位置です。
 * @default 0
 *
 * @param 同期開始スイッチ番号
 * @desc 同期対象になるスイッチの番号の開始位置です。
 * @default 0
 *
 * @param 同期終了スイッチ番号
 * @desc 同期対象になるスイッチの番号の終了位置です。
 * @default 0
 *
 * @help ゲームをプレーしている全てのユーザ間で指定範囲内のスイッチ、変数の値を
 * 同期し、共有できるようになります。
 * オンライン要素が存在するゲームで使えるほか、作者が任意のタイミングで
 * プレイヤーのデータの変数・スイッチを操作できます。
 *
 * 実装にはMilkcocoa(https://mlkcca.com/)を使用していますが、
 * 新規に利用登録する必要はなく通常利用する上で意識する必要はありません。
 * 詳細は「使用方法」を参照してください。
 *
 * ・使用方法
 * 1. パラメータ「ユーザID」に任意の文字列を設定する。
 * 例：triacontane
 *
 * 2. イベントテストから以下のプラグインコマンドを実行する。
 * SV_MAKE_AUTH_DATA 任意のパスワード
 *
 * ログに「その名称のユーザはすでに登録されています。」が表示された場合は
 * パラメータ「ユーザID」に別の値を設定して再実行してください。
 *
 * ログに「登録が完了しました。...」が表示されれば登録成功です。
 *
 * 3. あとはゲームを開始すれば指定範囲の変数やスイッチが同期される状態になります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SV_認証データ作成 password
 * SV_MAKE_AUTH_DATA password
 *  パラメータのユーザIDと指定したパスワードでサーバに認証情報を登録し
 *  認証情報ファイルを作成します。イベントテストから実行してください。
 *
 * SV_REMAKE_AUTH_FILE password
 * SV_認証ファイル再作成 password
 *  認証情報ファイルを再作成します。誤ってファイルを削除した場合などに
 *  イベントテストから実行してください。
 *
 * SV_DELETE_AUTH_DATA
 * SV_認証データ削除
 *  認証情報をサーバから削除し、同時に認証情報ファイルも削除します。
 *  イベントテストから実行してください。
 *
 * ！！注意事項！！
 * 1. 変数やスイッチに、個人情報などの情報資産にあたるものを
 * 絶対に格納しない(させない)よう注意してください。
 * いかなる場合でもこのプラグインを使用することによって生じた
 * 不利益に関しては一切責任を負いません。
 *
 * 2. 本プラグインは試験運用中です。利用状況によっては
 * サービスの運用を停止せざるを得ない場合があります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function SyncManager() {
    throw new Error('This is a static class');
}

(function () {
    'use strict';
    var pluginName = 'SyncVariable';

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
        var window = SceneManager._scene._windowLayer.children[0];
        if (window) {
            var result = window.convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramUserId            = getParamString(['UserId', 'ユーザID']);
    var paramSyncVariableStart = getParamNumber(['SyncVariableStart', '同期開始変数番号'], 0, 5000);
    var paramSyncVariableEnd   = getParamNumber(['SyncVariableEnd'  , '同期終了変数番号'], 0, 5000);
    var paramSyncSwitchStart   = getParamNumber(['SyncSwitchStart'  , '同期開始スイッチ番号'], 0, 5000);
    var paramSyncSwitchEnd     = getParamNumber(['SyncSwitchEnd'    , '同期終了スイッチ番号'], 0, 5000);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandSyncVariable(command, args);
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
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandSyncVariable = function (command, args) {
        switch (getCommandName(command)) {
            case 'SV_MAKE_AUTH_DATA' :
            case 'SV_認証データ作成' :
                SyncManager.makeAuthData(getArgString(args[0]));
                break;
            case 'SV_REMAKE_AUTH_FILE' :
            case 'SV_認証ファイル再作成' :
                SyncManager.makeAuthFile(getArgString(args[0]), true);
                break;
            case 'SV_DELETE_AUTH_DATA' :
            case 'SV_認証データ削除' :
                SyncManager.deleteAuthData();
                break;
        }
    };

    //=============================================================================
    // Game_Switches
    //  スイッチの同期処理を追加定義します。
    //=============================================================================
    Game_Switches.prototype.getSyncData = function() {
        var syncData = {};
        for(var i = paramSyncSwitchStart; i < paramSyncSwitchEnd + 1; i++) {
            syncData[i] = this.value(i);
        }
        return syncData;
    };

    Game_Switches.prototype.setSyncData = function(syncData) {
        for(var i = paramSyncSwitchStart; i < paramSyncSwitchEnd + 1; i++) {
            this.setValue(i, syncData[i]);
        }
    };

    var _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
        _Game_Switches_setValue.apply(this, arguments);
        if (paramSyncSwitchStart <= switchId && paramSyncSwitchEnd >= switchId) {
            SyncManager.setNeedUpload();
        }
    };

    //=============================================================================
    // Game_Variables
    //  スイッチの同期処理を追加定義します。
    //=============================================================================
    Game_Variables.prototype.getSyncData = function() {
        var syncData = {};
        for(var i = paramSyncVariableStart; i < paramSyncVariableEnd + 1; i++) {
            syncData[i] = this.value(i);
        }
        return syncData;
    };

    Game_Variables.prototype.setSyncData = function(syncData) {
        for(var i = paramSyncVariableStart; i < paramSyncVariableEnd + 1; i++) {
            this.setValue(i, syncData[i]);
        }
    };

    var _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function(variableId, value) {
        _Game_Variables_setValue.apply(this, arguments);
        if (paramSyncVariableStart <= variableId && paramSyncVariableEnd >= variableId) {
            SyncManager.setNeedUpload();
        }
    };

    //=============================================================================
    // SyncManager
    //  変数を同期するためにMilkCocoaとの通信を行います。
    //=============================================================================
    SyncManager._milkCocoaUrl   = 'https://cdn.mlkcca.com/v2.0.0/milkcocoa.js';
    SyncManager._milkCocoaApiId = 'leadinlmv4lo.mlkcca.com';
    SyncManager._loadListeners  = [];
    SyncManager.authFileName    = 'SyncVariable.rpgdata';
    SyncManager.userId          = paramUserId;
    SyncManager.needUpload      = false;
    SyncManager.needDownload    = false;
    SyncManager.isDownloaded    = false;
    SyncManager.isExecute       = false;
    SyncManager._authFile       = null;

    SyncManager.initialize = function() {
        this._milkCocoa = new MilkCocoa(this._milkCocoaApiId);
        this._authData  = this._milkCocoa.dataStore('auth');
        this._mainData  = this._milkCocoa.dataStore('main');
        this._mainData.on('set', this.downloadVariables.bind(this));
        this._online    = true;
        this._authority = false;
        if (!DataManager.isEventTest()) this.loadAuthData();
        this._callLoadListeners();
    };

    SyncManager.addLoadListener = function(listener) {
        if (!this._online) {
            this._loadListeners.push(listener);
        } else {
            listener();
        }
    };

    SyncManager._callLoadListeners = function() {
        while (this._loadListeners.length > 0) {
            var listener = this._loadListeners.shift();
            listener();
        }
    };

    SyncManager.canUse = function() {
        return this._online && this._authority;
    };

    SyncManager.setNeedUpload = function() {
        if (!this.isExecute) this.needUpload = true;
    };

    SyncManager.setNeedDownload = function() {
        if (!this.isExecute) this.needDownload = true;
    };

    SyncManager.update = function() {
        if (Graphics.frameCount % 60 === 0 && this.canUse()) {
            if (this.needDownload) {
                this.needDownload = false;
                this.downloadVariables();
            }
            if (this.needUpload && this.isDownloaded) {
                this.needUpload = false;
                this.uploadVariables();
            }
        }
    };

    SyncManager.uploadVariables = function() {
        var syncData = {};
        syncData.variables = $gameVariables.getSyncData();
        syncData.switches  = $gameSwitches.getSyncData();
        this._mainData.set(paramUserId, syncData, function () {
            console.log('変数情報を送信しました。');
        }.bind(this));
    };

    SyncManager.downloadVariables = function() {
        if (!this.canUse()) return;
        this._mainData.get(paramUserId, function (err, datum) {
            if (!err) {
                console.log('変数情報を受信しました。');
                var syncData = datum.value;
                this.isExecute = true;
                $gameVariables.setSyncData(syncData.variables);
                $gameSwitches.setSyncData(syncData.switches);
                this.isExecute = false;
                this.isDownloaded = true;
            }
        }.bind(this));
    };

    SyncManager.getAuthData = function(onComplete) {
        this._authData.get(SyncManager.userId, onComplete);
    };

    SyncManager.loadAuthData = function(onComplete, onError) {
        this.loadAuthFile(this.onLoadAuthData.bind(this, onComplete, onError));
    };

    SyncManager.onLoadAuthData = function(onComplete, onError) {
        this.getAuthData(function (err, datum) {
            if (!err && datum.value.pass === SyncManager._authFile.pass) {
                console.log('認証に成功しました。');
                this._authority = true;
                if (onComplete) onComplete();
            } else {
                this._online = false;
                if (onError) onError();
                console.log('認証に失敗しました。ユーザ登録を行っていない場合は行ってください。');
            }
        }.bind(this));
    };

    SyncManager.makeAuthData = function(pass) {
        this.addLoadListener(function () {
            this.showDevTools();
            if (!paramUserId) this.terminate('パラメータ「ユーザID」を指定してください。');
            this.getAuthData(function (err, datum) {
                if (err) {
                    this._authData.set(SyncManager.userId, {pass:pass}, function () {
                        StorageManager.saveSyncVariableAuthFile(JsonEx.stringify({pass:pass}));
                        this.uploadVariables();
                        this.terminate('登録が完了しました。パスワードは削除の際に必要なので控えておいてください。:' + pass);
                    }.bind(this));
                } else {
                    this.terminate('その名称のユーザはすでに登録されています。');
                }
            }.bind(this));
        }.bind(this));
    };

    SyncManager.makeAuthFile = function(pass) {
        this.addLoadListener(function () {
            SyncManager.showDevTools();
            StorageManager.saveSyncVariableAuthFile(JsonEx.stringify({pass:pass}));
            SyncManager.terminate('認証ファイルの再作成が完了しました。');
        }.bind(this));
    };

    SyncManager.deleteAuthData = function() {
        this.addLoadListener(function () {
            this.showDevTools();
            this.loadAuthData(function () {
                this._authData.remove(SyncManager.userId, function () {
                    StorageManager.removeSyncVariableAuthFile();
                    this._mainData.remove(SyncManager.userId);
                    this.terminate('対象のユーザ情報を削除しました。:' + SyncManager.userId);
                }.bind(this), function () {
                    this.terminate('対象のユーザ情報を削除できませんでした。:' + SyncManager.userId);
                }.bind(this));
            }.bind(this), function () {
                this.terminate('ユーザ情報の認証に失敗しました。すでに削除済みか、認証が不正です。:' + SyncManager.userId);
            }.bind(this));
        }.bind(this));
    };

    SyncManager.loadAuthFile = function(onLoad) {
        var xhr = new XMLHttpRequest();
        var url = 'data/' + SyncManager.authFileName;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status < 400) {
                var json = LZString.decompressFromBase64(xhr.responseText);
                SyncManager._authFile = JsonEx.parse(json);
                onLoad();
            }
        };
        xhr.onerror = function() {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        xhr.send();
    };

    SyncManager.terminate = function(message) {
        console.log(message);
        SyncManager.pause(SceneManager.terminate.bind(SceneManager));
    };

    SyncManager.showDevTools = function() {
        var nwWin = require('nw.gui').Window.get();
        if (!nwWin.isDevToolsOpen()) {
            var devTool = nwWin.showDevTools();
            devTool.moveTo(0, 0);
            devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
            nwWin.focus();
        }
    };

    SyncManager.pause = function(handler) {
        console.log('続行するには何かキーを押してください……');
        setInterval(function() {
            if (Object.keys(Input._currentState).length > 0 || TouchInput.isPressed()) handler();
        }, 100);
    };

    //=============================================================================
    // DataManager
    //  変動を同期します。
    //=============================================================================
    var DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue = function(savefileId) {
        var result = DataManager_loadGameWithoutRescue.apply(this, arguments);
        if (result) SyncManager.setNeedDownload();
        return result;
    };

    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.apply(this, arguments);
        SyncManager.setNeedDownload();
    };

    //=============================================================================
    // StorageManager
    //  認証ファイルのセーブやロードを追加定義します。
    //=============================================================================
    StorageManager.saveSyncVariableAuthFile = function(json) {
        var data = LZString.compressToBase64(json);
        var fs = require('fs');
        var dirPath = this.authFileDirectoryPath();
        var filePath = this.authFileDirectoryPath() + SyncManager.authFileName;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, data);
    };

    StorageManager.loadSyncVariableAuthFile = function() {
        var data = null;
        var fs = require('fs');
        var filePath = this.authFileDirectoryPath() + SyncManager.authFileName;
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath, { encoding: 'utf8' });
        }
        return LZString.decompressFromBase64(data);
    };

    StorageManager.removeSyncVariableAuthFile = function() {
        var fs = require('fs');
        var filePath = this.authFileDirectoryPath() + SyncManager.authFileName;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };

    StorageManager.authFileDirectoryPath = function() {
        var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/data/');
        if (path.match(/^\/([A-Z]\:)/)) {
            path = path.slice(1);
        }
        return decodeURIComponent(path);
    };

    //=============================================================================
    // PluginManager
    //  Milkcocoaのライブラリを読み込みます。
    //=============================================================================
    PluginManager.loadOnlineScript = function(name, callBackFunction) {
        var url = name;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = false;
        script.onerror = this.onError.bind(this);
        script.onload = callBackFunction;
        script._url = url;
        document.body.appendChild(script);
    };

    //=============================================================================
    // SceneManager
    //  SyncManagerの更新処理を呼び出します。
    //=============================================================================
    var _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize = function() {
        PluginManager.loadOnlineScript(SyncManager._milkCocoaUrl, SyncManager.initialize.bind(SyncManager));
        _SceneManager_initialize.apply(this, arguments);
    };

    var _SceneManager_updateMain = SceneManager.updateMain;
    SceneManager.updateMain = function() {
        _SceneManager_updateMain.apply(this, arguments);
        SyncManager.update();
    };
})();

