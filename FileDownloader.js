//=============================================================================
// FileDownloader.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2019/08/25 本体v1.6.0以降に対応
// 1.0.1 2016/12/04 少しコードをリファクタリング
// 1.0.0 2016/11/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc FileDownloaderPlugin
 * @author triacontane
 *
 * @param NormalEndSwitch
 * @desc コマンドが正常終了した際にONになるスイッチIDです。
 * @default 0
 *
 * @param AbnormalEndSwitch
 * @desc コマンドが異常終了した際にONになるスイッチIDです。
 * @default 0
 *
 * @param ResourceUrl
 * @desc リソースの配布元URLです。特定の配布元からのダウンロードを簡略化できます。
 * @default https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/
 *
 * @help ゲーム中にインターネット上からファイルをダウンロードして
 * プロジェクト配下の任意の場所に配置できます。同名ファイルは上書きされます。
 * 配置したファイルはゲーム中で動的に参照することができます。
 *
 * 主に以下のような用途に使用できます。
 *
 * 1. 開発時のプラグインの自動アップデート
 * ゲーム起動時に自動で配布元の最新版を適用できます。わざわざ確認しなくても
 * 機能追加やバグ修正が行われた最新のファイルを利用できます。
 *
 * ただし、すでに適用済みのプラグインを更新した場合、
 * 変更を反映させるにはゲームをリロードする必要があります。
 *
 * ※パラメータ「配布サイトURL」をデフォルトのままで
 * 以下のプラグインコマンドを実行すると、本プラグインを最新化できます。
 *
 * FD_MY_PLUGIN FileDownloader.js
 *
 * 2. 小規模なアップデートファイル配信
 * あらかじめ準備しておけば、プレイヤーにゲーム全体を再ダウンロードさせずに
 * 一部ファイルのみ差し替えさせることができます。
 *
 * 3. インターネット上の画像をピクチャ表示
 * ネット上の画像ファイルなどを取り込んでゲーム内で使用することができます。
 * 著作権等には十分ご注意ください。
 *
 * 注意！
 * 1. ダウンロードには非常に時間が掛かります。（特にWindowsの場合）
 *
 * 2. ファイルは確認なしに上書きされます。復元はできませんのでご注意ください。
 *
 * 3. サーバによっては拒否される場合もあります。
 *
 * 4. ローカル実行（テストプレー含む）以外では利用できません。
 *
 * また、おまけ機能で「指定したURLを既定のブラウザで開く」機能もあります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * FD_FILE http://～.png test/     # 指定したURLのファイルをtest/に配置
 * FD_ファイル http://～.png test/ # 同上
 * FD_MY_FILE ～.json data/        # 指定したパスのファイルをdata/に配置
 * FD_マイファイル ～.json data/   # 同上
 * FD_PLUGIN http://～.js          # 指定したURLのjsをjs/plugins/に配置
 * FD_プラグイン http://～.js      # 同上
 * FD_MY_PLUGIN ～.js              # 指定したパスのjsをjs/plugins/に配置
 * FD_マイプラグイン ～.js         # 同上
 * FD_PICTURE http://～.png        # 指定したURLのpngをimg/pictures/に配置
 * FD_ピクチャ http://～.png       # 同上
 * FD_MY_PICTURE ～.png            # 指定したパスのpngをimg/pictures/に配置
 * FD_マイピクチャ ～.png          # 同上
 * FD_START_SITE http://～.jp      # 規定のブラウザで指定したURLを開く
 * FD_サイト起動 http://～.jp      # 同上
 *
 * 「マイ～」と言うコマンドは「配布サイトURL」パラメータ配下の
 * ファイルを取得できます。URLの記述を簡略化できます。
 *
 * また追加パラメータを後ろに付与すると、処理の正常終了時と異常終了時に
 * 任意のスイッチをONにできます。
 * 以下の例では処理終了後に正常終了なら[10]を異常終了なら[11]をONにします。
 *
 * FD_FILE http://～.png test/ 10 11
 *
 * 省略すると、もともとのプラグインパラメータで指定したスイッチがONになります。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ファイルダウンロードプラグイン
 * @author トリアコンタン
 *
 * @param 正常終了スイッチID
 * @desc コマンドが正常終了した際にONになるスイッチIDです。
 * @default 0
 *
 * @param 異常終了スイッチID
 * @desc コマンドが異常終了した際にONになるスイッチIDです。
 * @default 0
 *
 * @param 配布サイトURL
 * @desc リソースの配布元URLです。特定の配布元からのダウンロードを簡略化できます。
 * @default https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/
 *
 * @help ゲーム中にインターネット上からファイルをダウンロードして
 * プロジェクト配下の任意の場所に配置できます。同名ファイルは上書きされます。
 * 配置したファイルはゲーム中で動的に参照することができます。
 *
 * 主に以下のような用途に使用できます。
 *
 * 1. 開発時のプラグインの自動アップデート
 * ゲーム起動時に自動で配布元の最新版を適用できます。わざわざ確認しなくても
 * 機能追加やバグ修正が行われた最新のファイルを利用できます。
 *
 * ただし、すでに適用済みのプラグインを更新した場合、
 * 変更を反映させるにはゲームをリロードする必要があります。
 *
 * ※パラメータ「配布サイトURL」をデフォルトのままで
 * 以下のプラグインコマンドを実行すると、本プラグインを最新化できます。
 *
 * FD_MY_PLUGIN FileDownloader.js
 *
 * 2. 小規模なアップデートファイル配信
 * あらかじめ準備しておけば、プレイヤーにゲーム全体を再ダウンロードさせずに
 * 一部ファイルのみ差し替えさせることができます。
 *
 * 3. インターネット上の画像をピクチャ表示
 * ネット上の画像ファイルなどを取り込んでゲーム内で使用することができます。
 * 著作権等には十分ご注意ください。
 *
 * 注意！
 * 1. ダウンロードには非常に時間が掛かります。（特にWindowsの場合）
 *
 * 2. ファイルは確認なしに上書きされます。復元はできませんのでご注意ください。
 *
 * 3. サーバによっては拒否される場合もあります。
 *
 * 4. ローカル実行（テストプレー含む）以外では利用できません。
 *
 * また、おまけ機能で「指定したURLを既定のブラウザで開く」機能もあります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * FD_FILE http://～.png test/     # 指定したURLのファイルをtest/に配置
 * FD_ファイル http://～.png test/ # 同上
 * FD_MY_FILE ～.json data/        # 指定したパスのファイルをdata/に配置
 * FD_マイファイル ～.json data/   # 同上
 * FD_PLUGIN http://～.js          # 指定したURLのjsをjs/plugins/に配置
 * FD_プラグイン http://～.js      # 同上
 * FD_MY_PLUGIN ～.js              # 指定したパスのjsをjs/plugins/に配置
 * FD_マイプラグイン ～.js         # 同上
 * FD_PICTURE http://～.png        # 指定したURLのpngをimg/pictures/に配置
 * FD_ピクチャ http://～.png       # 同上
 * FD_MY_PICTURE ～.png            # 指定したパスのpngをimg/pictures/に配置
 * FD_マイピクチャ ～.png          # 同上
 * FD_START_SITE http://～.jp      # 規定のブラウザで指定したURLを開く
 * FD_サイト起動 http://～.jp      # 同上
 *
 * 「マイ～」と言うコマンドは「配布サイトURL」パラメータ配下の
 * ファイルを取得できます。URLの記述を簡略化できます。
 *
 * また追加パラメータを後ろに付与すると、処理の正常終了時と異常終了時に
 * 任意のスイッチをONにできます。
 * 以下の例では処理終了後に正常終了なら[10]を異常終了なら[11]をONにします。
 *
 * FD_FILE http://～.png test/ 10 11
 *
 * 省略すると、もともとのプラグインパラメータで指定したスイッチがONになります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const pluginName = 'FileDownloader';

    const getParamOther = function(paramNames) {
        for (let name of paramNames) {
            const paramName = PluginManager.parameters(pluginName)[name];
            if (paramName) return paramName;
        }
        return null;
    };

    const getParamString = function(paramNames) {
        const value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    const getParamNumber = function(paramNames, min, max) {
        const value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    const convertAllArguments = function(args) {
        for (let i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    const convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        const windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    const addSlashOfEnd = function(text) {
        if (text[text.length - 1] !== '/') text += '/';
        return text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    const paramNormalEndSwitch   = getParamNumber(['NormalEndSwitch', '正常終了スイッチID'], 0);
    const paramAbnormalEndSwitch = getParamNumber(['AbnormalEndSwitch', '異常終了スイッチID'], 0);
    const paramResourceUrl       = addSlashOfEnd(getParamString(['ResourceUrl', '配布サイトURL']));

    const pluginCommandMap = new Map([
        ['FD_FILE' ,'downloadFile'],
        ['FD_ファイル' , 'downloadFile'],
        ['FD_MY_FILE' , 'downloadMyFile'],
        ['FD_マイファイル' ,'downloadMyFile'],
        ['FD_PLUGIN' , 'downloadPlugin'],
        ['FD_プラグイン' , 'downloadPlugin'],
        ['FD_MY_PLUGIN', 'downloadMyPlugin'],
        ['FD_マイプラグイン', 'downloadMyPlugin'],
        ['FD_PICTURE', 'downloadPicture'],
        ['FD_ピクチャ', 'downloadPicture'],
        ['FD_MY_PICTURE', 'downloadMyPicture'],
        ['FD_マイピクチャ', 'downloadMyPicture'],
        ['FD_START_SITE', 'startupWebSite'],
        ['FD_サイト起動', 'startupWebSite']
    ]);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    const _Game_Interpreter_clear    = Game_Interpreter.prototype.clear;
    Game_Interpreter.prototype.clear = function() {
        _Game_Interpreter_clear.apply(this, arguments);
        this._downloader = null;
    };

    const _Game_Interpreter_pluginCommand    = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        this.pluginCommandFileDownloader.apply(this, arguments);
    };

    Game_Interpreter.prototype.pluginCommandFileDownloader = function(command, args) {
        const pluginCommand = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommand) {
            args = convertAllArguments(args);
            this.makeDownloader(args);
            this[pluginCommand](args);
            this._downloader = null;
        }
    };

    Game_Interpreter.prototype.downloadFile = function(args) {
        args[1] = addSlashOfEnd(args[1]);
        this._downloader.execute(args[0], args[1]);
    };

    Game_Interpreter.prototype.downloadMyFile = function(args) {
        args[0] = paramResourceUrl + args[0];
        this.downloadFile(args);
    };

    Game_Interpreter.prototype.downloadPlugin = function(args) {
        args[1] = 'js/plugins/';
        this.downloadFile(args);
    };

    Game_Interpreter.prototype.downloadMyPlugin = function(args) {
        args[0] = paramResourceUrl + args[0];
        this.downloadPlugin(args);
    };

    Game_Interpreter.prototype.downloadPicture = function(args) {
        args[1] = 'img/pictures/';
        this.downloadFile(args);
    };

    Game_Interpreter.prototype.downloadMyPicture = function(args) {
        args[0] = paramResourceUrl + args[0];
        this.downloadPicture(args);
    };

    Game_Interpreter.prototype.startupWebSite = function(args) {
        const commander = GameStartUpWebSite.getInstance();
        commander.execute(args[0]);
    };

    Game_Interpreter.prototype.makeDownloader = function(args) {
        this._downloader = this._downloader || GameFileDownload.getInstance();
        this._downloader.setResultSwitchId(Number(args[args.length - 2]), Number(args[args.length - 1]));
    };

    //=============================================================================
    // GameChildProcess
    //  node.jsのchild_processを用いてコマンド実行を実現する基底クラスです。
    //=============================================================================
    class GameChildProcess {
        constructor() {
            this._normalSwitchId   = paramNormalEndSwitch;
            this._abnormalSwitchId = paramAbnormalEndSwitch;
        }

        setResultSwitchId(normalSwitchId, abnormalSwitchId) {
            this.setNormalSwitchId(normalSwitchId || paramNormalEndSwitch);
            this.setAbnormalSwitchId(abnormalSwitchId || paramAbnormalEndSwitch);
        }

        setNormalSwitchId(switchId) {
            this._normalSwitchId = switchId;
        }

        setAbnormalSwitchId(switchId) {
            this._abnormalSwitchId = switchId;
        }

        execute() {
            this.executeChildProcess(this.getCommand.apply(this, arguments));
        }

        executeChildProcess(command) {
            this.outputDebugLog('*** Execute Command : ' + command);
            this.setResultSwitch(this._normalSwitchId, false);
            this.setResultSwitch(this._abnormalSwitchId, false);
            const childProcess = require('child_process');
            const promise = new Promise(function(resolve, reject) {
                childProcess.exec(command, function(error, stdout, stderr) {
                    if (stdout) this.outputDebugLog(stdout);
                    if (stderr) this.outputDebugLog(stderr);
                    return error ? reject(error) : resolve();
                }.bind(this));
            }.bind(this));
            promise.then(this.onNormalEnd.bind(this), this.onAbnormalEnd.bind(this));
        }

        onNormalEnd() {
            this.setResultSwitch(this._normalSwitchId, true);
            this.outputDebugLog('*** Command Normal End ***');
        }

        onAbnormalEnd(error) {
            this.setResultSwitch(this._abnormalSwitchId, true);
            this.outputErrorLog(error);
            this.outputDebugLog('*** Command Abnormal End ***');
        }

        setResultSwitch(switchId, value) {
            if (switchId > 0) {
                $gameSwitches.setValue(switchId, value);
            }
        }

        outputDebugLog() {
            this.outputLog(false, arguments);
        }

        outputErrorLog() {
            this.outputLog(true, arguments);
        }

        outputLog(errorFlg, args) {
            if (!$gameTemp.isPlaytest() && !errorFlg) return;
            this.showDevTool();
            console[errorFlg ? 'error' : 'log'].apply(console, args);
        }

        showDevTool() {
            const gameWindow = require('nw.gui').Window.get();
            gameWindow.showDevTools();
        }

        getCommand() {
            return '';
        }

        static getInstance() {
            return this.isNwjs() ? (this.isWindows() ? this.getWindowsInstance() : this.getMacInstance()) :
                this.getNoNwjsInstance();
        }

        static getDefaultInstance() {
            return new GameEmptyProcess();
        }

        static getWindowsInstance() {
            return this.getDefaultInstance();
        }

        static getMacInstance() {
            return this.getDefaultInstance();
        }

        static getNoNwjsInstance() {
            return this.getDefaultInstance();
        }

        static isWindows() {
            return process.platform === 'win32';
        }

        static isNwjs() {
            return Utils.isNwjs();
        }
    }

    //=============================================================================
    // GameEmptyProcess
    //  実行不可能な環境では何も実行しません。
    //=============================================================================
    class GameEmptyProcess extends GameChildProcess {
        execute() {
            console.log('指定した動作はこの環境では実行できません。');
        }
    }

    //=============================================================================
    // GameFileDownload
    //  ファイルダウンロードを実現します。
    //=============================================================================
    class GameFileDownload extends GameChildProcess {
        execute(url, localDir) {
            const path        = require('path');
            const projectBase = path.dirname(process.mainModule.filename);
            const localPath   = path.join(projectBase, localDir) + path.basename(url);
            super.execute(url, localPath);
        }

        static getWindowsInstance() {
            return new GameFileDownloadWindows();
        }

        static getMacInstance() {
            return new GameFileDownloadMac();
        }
    }

    //=============================================================================
    // GameFileDownloadWindows
    //  Windowsでファイルダウンロードを実現します。
    //=============================================================================
    class GameFileDownloadWindows extends GameFileDownload {
        getCommand(url, localPath) {
            return `bitsadmin.exe /TRANSFER FILE_DOWNLOAD ${url} ${localPath}`;
        }
    }

    //=============================================================================
    // GameFileDownloadMac
    //  Macでファイルダウンロードを実現します。
    //=============================================================================
    class GameFileDownloadMac extends GameFileDownload {
        getCommand(url, localPath) {
            return `curl ${url} -o ${localPath}`;
        }
    }

    //=============================================================================
    // GameStartUpWebSite
    //  ウェブサイトを開きます。
    //=============================================================================
    class GameStartUpWebSite extends GameChildProcess {
        static getWindowsInstance() {
            return new GameStartUpWebSiteWindows();
        }

        static getMacInstance() {
            return new GameStartUpWebSiteMac();
        }

        static getNoNwjsInstance() {
            return new GameStartUpWebSiteNoNwjs();
        }
    }

    //=============================================================================
    // GameStartUpWebSiteWindows
    //  Windowsでウェブサイトを開きます。
    //=============================================================================
    class GameStartUpWebSiteWindows extends GameStartUpWebSite {
        getCommand(url) {
            return `rundll32.exe url.dll,FileProtocolHandler "${url}"`;
        }
    }

    //=============================================================================
    // GameStartUpWebSiteMac
    //  Macでファイルダウンロードを実現します。
    //=============================================================================
    class GameStartUpWebSiteMac extends GameStartUpWebSite {
        getCommand(url) {
            return `open "${url}"`;
        }
    }

    //=============================================================================
    // GameStartUpWebSiteNoNwjs
    //  ブラウザでウェブサイトを開きます。
    //=============================================================================
    class GameStartUpWebSiteNoNwjs extends GameStartUpWebSite {
        execute(url) {
            window.open(url);
        }
    }
})();

