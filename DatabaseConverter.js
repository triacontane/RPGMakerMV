//=============================================================================
// DatabaseConverter.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2018/05/30 移動ルートの設定のコマンドをインポートした際、一部の数値がundefinedとなってしまう問題を修正
// 1.0.1 2018/05/20 オリジナルデータの作成方法をヘルプに追加
// 1.0.0 2018/05/20 正式版リファクタリング
// 0.3.0 2018/05/17 オートインポート機能がパラメータ設定に拘わらず有効になっていた問題を修正
//                  マップIDに歯抜けがあった場合、出力エラーになる問題を修正
//                  イベントテストの実行内容を出力する機能を追加
// 0.2.0 2018/05/14 ヘルプ修正
// 0.1.0 2018/05/13 テスト版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc データベース変換プラグイン
 * @author トリアコンタン
 *
 * @param excelDataPath
 * @text シートデータファイルパス
 * @desc シートデータファイルが出力されるパスです。相対パス、絶対パスが入力できます。
 * @default excelData
 *
 * @param ExportPrefix
 * @text 出力ファイル接頭辞
 * @desc エクスポートファイルに付与される接頭辞です。インポートファイルと分けて保持したい場合に指定してください。
 * @default
 *
 * @param targetDatabase
 * @text 対象データベース
 * @desc 入出力の対象になるデータベースの一覧です。独自に定義したデータファイルを追加できます。
 * @default ["{\"JsonName\":\"Actors\",\"VariableName\":\"\"}","{\"JsonName\":\"Classes\",\"VariableName\":\"\"}","{\"JsonName\":\"Skills\",\"VariableName\":\"\"}","{\"JsonName\":\"Items\",\"VariableName\":\"\"}","{\"JsonName\":\"Weapons\",\"VariableName\":\"\"}","{\"JsonName\":\"Armors\",\"VariableName\":\"\"}","{\"JsonName\":\"Enemies\",\"VariableName\":\"\"}","{\"JsonName\":\"Troops\",\"VariableName\":\"\"}","{\"JsonName\":\"States\",\"VariableName\":\"\"}","{\"JsonName\":\"MapInfos\",\"VariableName\":\"\"}"]
 * @type struct<DatabaseInfo>[]
 *
 * @param fileFormat
 * @text 出力ファイル形式
 * @desc 出力データのファイル形式です。
 * @default xlsx
 * @type select
 * @option xlsx : Excel 2007+ XML Format
 * @value xlsx
 * @option xlsm : Excel 2007+ Macro XML Format
 * @value xlsm
 * @option xlsb : Excel 2007+ Binary Format
 * @value xlsb
 * @option ods  : OpenDocument Spreadsheet
 * @value ods
 * @option fods : Flat OpenDocument Spreadsheet
 * @value fods
 * @option csv  : Comma Separated Values
 * @value csv
 * @option txt  : UTF-16 Unicode Text (TSV)
 * @value txt
 *
 * @param originalDataLoad
 * @text オリジナルデータ読み込み
 * @desc 作成済みのオリジナルJSONデータの読み込み処理を実行します。データファイルがないとエラーになります。
 * @default false
 * @type boolean
 *
 * @param autoImport
 * @text 自動インポート
 * @desc インポート処理を実行してからゲーム開始します。テストプレー時のみ有効です。
 * @default false
 * @type boolean
 *
 * @param exportEventTest
 * @text イベントテスト出力
 * @desc イベントテスト実行時に実行内容を出力します。ただし本プラグインのコマンドを実行した場合は出力されません。
 * @default true
 * @type boolean
 *
 * @param commandPrefix
 * @text メモ欄接頭辞
 * @desc 他のプラグインとメモ欄もしくはプラグインコマンドの名称が被ったときに指定する接頭辞です。通常は指定不要です。
 * @default
 *
 * @help DatabaseConverter.js
 * ツクールMVのデータベースをExcelなどのシートデータ（以下シートファイル）に
 * 書き出し、読み込みします。
 *
 * イベントテスト（イベントエディタ上で右クリック→テスト）から所定の
 * プラグインコマンド（後述）を実行すると書き出しおよび読み込みができます。
 *
 * --------------------------------------
 * 書き出し手順
 * --------------------------------------
 * 1. 本プラグインを管理画面からONにする。
 * 2.「プロジェクトの保存」を実行する。(初回実行時のみ)
 * 3. イベントテストから所定のプラグインコマンドを実行する。
 * 4. 所定のフォルダにシートファイルが出力される。
 *
 * --------------------------------------
 * 読み込み手順
 * --------------------------------------
 * 1.「プロジェクトの保存」を実行する。
 * 2. Dataフォルダをバックアップしておく。
 * 3. イベントテストから所定のプラグインコマンドを実行する。
 * 4.「プロジェクトを開く」を実行して、プロジェクトを開き直す。
 *   開き直すとき、プロジェクトの保存はしないでください。
 *
 * ※プラグインコマンドは1つずつ実行してください。
 * 　一度に複数のコマンドを実行することはできません。
 *
 * --------------------------------------
 * オリジナルデータベース作成手順(上級者向け)
 * --------------------------------------
 * 1. パラメータ「オリジナルデータ読み込み」をOFFにする。
 * 2. パラメータ「対象データベース」にオリジナルデータを追加
 * 3. データベースをエクスポート
 * 4. オリジナルデータのシートが追加されるので自由に編集
 * 5. データベースをインポート
 * 6. パラメータ「オリジナルデータ読み込み」をONにする。
 * 7. スクリプトからオリジナルデータの内容を参照できる。
 *
 * --------------------------------------
 * 出力対象データ
 * --------------------------------------
 * ・データベース
 * 既存のデータベースを入出力します。ファイル名は「Database」です。
 * 出力フォーマットに合わせた拡張子が付与されます。(以降も同様)
 * タイルセットおよびコモンイベントは対象外です。
 * さらに独自に定義したデータ（スクリプトから参照）も入出力可能です。
 *
 * ・コモンイベント
 * コモンイベントの実行内容を入出力します。ファイル名は「CommonEvents」です。
 * パラメータの詳細は以下のスプレッドシートが参考になります。
 * https://docs.google.com/spreadsheets/d/1rOIzDuhLC6IqJPEFciYOmXWL_O7X9-hMValMs7DpWCk/edit#gid=1266374350
 *
 * ・マップイベント
 * マップイベントの実行内容を入出力します。ファイル名は「MapXXX」です。
 * シート名に「イベントID」および「イベントページ」が出力されます。
 *
 * ・イベントテスト
 * イベントテストで選択した実行内容を出力します。
 * ファイル名は「Test_Event」です。出力のみに対応しています。
 *
 * --------------------------------------
 * 出力対象フォーマット
 * --------------------------------------
 * Excelファイル以外にもCSVやOpenDocument Spreadsheetなど
 * 以下のフォーマットに対応しています。プラグインパラメータから変更可能です。
 *
 * xlsx : Excel2007以降の一般的な形式です。
 * xlsm : Excel2007以降のマクロ付き形式です。
 * xlsb : Excel2007以降のバイナリ形式です。容量や速度面で優れています。
 * ods  : 特定のベンダに依存しないオープンなファイル形式です。
 * fods : 特定のベンダに依存しないオープンなXMLテキストファイル形式です。
 * csv  : カンマ区切りのテキストファイル形式です。
 * txt  : タブ区切りのテキストファイル形式です。
 *
 * --------------------------------------
 * 出力ファイル詳細
 * --------------------------------------
 * 1. 出力時に同名のファイルが存在した場合は上書きされます。(※1)
 * 2. シート名にはデータ種別が出力されるので編集しないでください。
 * 3. 出力ファイルの1行目には入出力に必須な情報(プロパティ名)が出力されます。
 *    ここも編集しないでください。
 * 4. 2行目には項目の日本語名が出力されます。読み込み時は無視されます。
 * 5. 配列項目（特徴など）は一部除きjson文字列で出力されます。編集は非推奨です。
 * 6. 数値や文字列は編集できますが、整合性のない値の入力には注意してください。
 * 7. Excel計算式は計算結果がデータベースの値として読み込まれます。
 * 8. 書式設定や行列の設定、マクロの追加などは自由です。
 * 9. データベースは読み込み時にID列でソートされます。重複はエラーになります。
 *
 * ※1 同名ファイルを開いているとエラーになるのでファイルを閉じてください。
 * --------------------------------------
 * 注意事項
 * --------------------------------------
 * 当プラグインの機能を使用する前にプロジェクト以下の「data」フォルダの
 * バックアップを「必ず」取得してください。
 *
 * 「data」フォルダの内容を自動でバックアップするプラグインも配布しています。
 * こちらのご利用もご検討ください。
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BackUpDatabase.js
 *
 * いかなる場合も破損したプロジェクトの復元には応じられませんのでご注意ください。
 *
 * エクスポートしたExcelファイルを開いたときに何らかのエラーメッセージが
 * 表示された場合は、そのまま編集およびインポートしないでください。
 *
 * 本プラグインの機能は「イベントテスト」から実行した場合のみ有効です。
 * 通常のテストプレーおよび製品版には影響を与えません。
 * （独自データの読み込み機能は例外）
 *
 * --------------------------------------
 * プラグインコマンド詳細
 * --------------------------------------
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * EXPORT_DATABASE
 *  データベースの内容を指定したフォーマットで出力します。
 *
 * IMPORT_DATABASE
 *  シートファイルを読み込んでデータベースファイルを書き換えます。
 *  エディタに反映させるためには、プロジェクトを開き直す必要があります。
 *
 * EXPORT_COMMON_EVENT 2
 *  ID[2]のコモンイベントの実行内容を出力します。IDは複数指定可能です。
 *  IDを指定しなかった場合は全てのコモンイベントを出力します。
 *
 * IMPORT_COMMON_EVENT 3
 *  シートファイルを読み込んでID[3]のコモンイベントを書き換えます。
 *  IDを指定しなかった場合は全てのコモンイベントを書き換えます。
 *
 * EXPORT_MAP_EVENT 6 20
 *  ID[6]のマップにあるID[20]のイベントの実行内容を出力します。
 *  イベントIDは複数指定可能で省略した場合、全イベントを出力します。
 *  マップIDは省略できません。
 *
 * IMPORT_MAP_EVENT 6 20
 *  シートファイルを読み込んでID[6]のマップにあるID[20]のイベントの
 *  実行内容を書き換えます。
 *  イベントIDは複数指定可能で省略した場合、全イベントを書き換えます。
 *  マップIDは省略できません。
 *
 * --------------------------------------
 * 使用ライブラリ
 * --------------------------------------
 * Excelデータの解析にはSheetJSのCommunity Editionを使用しています。
 * http://sheetjs.com/
 * Copyright (C) 2012-present   SheetJS LLC
 * Licensed under the Apache License, Version 2.0
 *
 * SheetJSはCDNを通じて提供されるため、プラグイン利用者は別途ライブラリを
 * 導入する必要はありませんが、オフラインで作業する場合やダウンロードできない
 * 場合は、以下の手順に従ってダウンロードしプラグインとして適用してください。
 *
 * 1. 以下のサイトのdist/xlsx.full.min.jsをダウンロードする。
 * https://github.com/sheetjs/js-xlsx
 *
 * 2. ファイル名を任意の英字に変更する。
 * （ファイル名に「.」が含まれているとプラグインとして取り込めないため）
 *
 * 3. プラグイン管理画面から有効にする。
 *
 * ExcelはMicrosoftの登録商標です。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~DatabaseInfo:
 *
 * @param JsonName
 * @text データファイル名称
 * @desc データベースファイルのJSON名称です。(拡張子不要) 独自に定義したJSONファイルを読み込む場合は直接入力してください。
 * @default
 * @type combo
 * @option Actors
 * @option Classes
 * @option Skills
 * @option Items
 * @option Weapons
 * @option Armors
 * @option Enemies
 * @option Troops
 * @option States
 * @option MapInfos
 *
 * @param VariableName
 * @text グローバル変数名称
 * @desc データベースが格納されるグローバル変数の名称です。既存データベースの場合は入力不要です。
 * @default
 */

/**
 * ConverterManager
 * コンバータを管理します。
 * @constructor
 */
function ConverterManager() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';

    let param = {};
    const pluginCommandMap = new Map();

    const paramReplacer = function(key, value) {
        if (value === 'null' || value === null) {
            return value;
        }
        if (value[0] === '"' && value[value.length - 1] === '"') {
            return value;
        }
        if (value === String(value)) {
            if (value.toLowerCase() === 'true') {
                return true;
            }
            if (value.toLowerCase() === 'false') {
                return false;
            }
        }
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    };

    if (typeof Utils !== 'undefined' && Utils.RPGMAKER_NAME === 'MV') {
        /**
         * Convert escape characters.(require any window object)
         * @param text Target text
         * @returns {String} Converted text
         */
        const convertEscapeCharacters = function(text) {
            const windowLayer = SceneManager._scene._windowLayer;
            return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
        };

        /**
         * Convert escape characters.(for text array)
         * @param texts Target text array
         * @returns {Array<String>} Converted text array
         */
        const convertEscapeCharactersAll = function(texts) {
            return texts.map(function(text) {
                return convertEscapeCharacters(text);
            });
        };

        /**
         * Set plugin command to method
         * @param commandName plugin command name
         * @param methodName execute method(Game_Interpreter)
         */
        const setPluginCommand = function(commandName, methodName) {
            pluginCommandMap.set(param.commandPrefix + commandName, methodName);
        };

        /**
         * Create plugin parameter. param[paramName] ex. param.commandPrefix
         * @param pluginName plugin name(ExcelDataConverter)
         * @returns {Object} Created parameter
         */
        const createPluginParameter = function(pluginName) {
            const parameter = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
            PluginManager.setParameters(pluginName, parameter);
            return parameter;
        };
        param = createPluginParameter('DatabaseConverter');

        if (param.originalDataLoad && !DataManager.isEventTest()) {
            param.targetDatabase.forEach(function(databaseInfo) {
                const srcName = `${databaseInfo.JsonName}.json`;
                const exist   = DataManager._databaseFiles.some(function(fileInfo) {
                    return fileInfo.src === srcName;
                });
                if (!exist) {
                    DataManager._databaseFiles.push({name: databaseInfo.VariableName, src: srcName});
                }
            });
        }

        if (!Utils.isOptionValid('test') && !DataManager.isEventTest()) {
            return;
        }

        setPluginCommand('EXPORT_DATABASE', 'exportDatabase');
        setPluginCommand('IMPORT_DATABASE', 'importDatabase');
        setPluginCommand('EXPORT_COMMON_EVENT', 'exportCommonEvent');
        setPluginCommand('IMPORT_COMMON_EVENT', 'importCommonEvent');
        setPluginCommand('EXPORT_MAP_EVENT', 'exportMapEvent');
        setPluginCommand('IMPORT_MAP_EVENT', 'importMapEvent');

        //=============================================================================
        // Game_Interpreter
        //=============================================================================
        const _Game_Interpreter_pluginCommand    = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function(command, args) {
            _Game_Interpreter_pluginCommand.apply(this, arguments);
            const pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
            if (pluginCommandMethod) {
                this[pluginCommandMethod](convertEscapeCharactersAll(args));
            }
        };

        Game_Interpreter.prototype.exportDatabase = function() {
            ConverterManager.executeDataExport(new ConvertTargetDatabase(false));
        };

        Game_Interpreter.prototype.importDatabase = function() {
            ConverterManager.executeDataImport(new ConvertTargetDatabase(false));
        };

        Game_Interpreter.prototype.exportCommonEvent = function(args) {
            ConverterManager.executeDataExport(new ConvertTargetCommonEvent(args));
        };

        Game_Interpreter.prototype.importCommonEvent = function(args) {
            ConverterManager.executeDataImport(new ConvertTargetCommonEvent(args));
        };

        Game_Interpreter.prototype.exportMapEvent = function(args) {
            const mapId = parseInt(args.shift());
            ConverterManager.executeDataExport(new ConvertTargetMapEvent(args, mapId));
        };

        Game_Interpreter.prototype.importMapEvent = function(args) {
            const mapId = parseInt(args.shift());
            ConverterManager.executeDataImport(new ConvertTargetMapEvent(args, mapId));
        };

        const _Game_Interpreter_terminate    = Game_Interpreter.prototype.terminate;
        Game_Interpreter.prototype.terminate = function() {
            _Game_Interpreter_terminate.apply(this, arguments);
            if (DataManager.isEventTest() && this._depth === 0 && param.exportEventTest) {
                ConverterManager.executeDataExport(new ConvertTargetTestEvent());
            }
        };

        //=============================================================================
        // SceneManager
        //  コンバータマネージャーを追加定義します。
        //=============================================================================
        const _SceneManager_initialize = SceneManager.initialize;
        SceneManager.initialize        = function() {
            _SceneManager_initialize.apply(this, arguments);
            ConverterManager.initialize();
        };

        //=============================================================================
        // DataManager
        //  起動時の自動読み込みを追加します。
        //=============================================================================
        var _DataManager_loadDatabase = DataManager.loadDatabase;
        DataManager.loadDatabase      = function() {
            if (!this.isEventTest() && !this._databaseImport && param.autoImport) {
                ConverterManager.executeDataImportSync(function() {
                    _DataManager_loadDatabase.apply(this, arguments);
                }.bind(this));
                this._databaseImport = true;
            } else {
                _DataManager_loadDatabase.apply(this, arguments);
            }
        };

        //=============================================================================
        // Scene_Boot
        //  変換オブジェクトの準備完了を待ちます。
        //=============================================================================
        const _Scene_Boot_isReady    = Scene_Boot.prototype.isReady;
        Scene_Boot.prototype.isReady = function() {
            return _Scene_Boot_isReady.apply(this, arguments) && ConverterManager.isSheetDataConverterReady();
        };
    }

    //=============================================================================
    // ConverterManager
    //  シート変換オブジェクトを生成、管理します。
    //=============================================================================
    ConverterManager.initialize = function() {
        this._sheetDataConverter = AbstractSheetConverter.getInstance(param.fileFormat);
        this._sheetJs            = new SheetJsCreator();
    };

    ConverterManager.isSheetDataConverterReady = function() {
        return this._sheetJs.isReady() && this._sheetDataConverter.isReady();
    };

    ConverterManager.executeDataImportSync = function(callBack) {
        this._sheetJs.addLoadListener(function() {
            this._sheetDataConverter.executeImport(new ConvertTargetDatabase(true));
            callBack();
        }.bind(this));
    };

    ConverterManager.executeDataExport = function(target) {
        this._executeDataConvert('executeExport', target);
    };

    ConverterManager.executeDataImport = function(target) {
        this._executeDataConvert('executeImport', target);
    };

    ConverterManager._executeDataConvert = function(process, target) {
        if (!this.isSheetDataConverterReady()) {
            return;
        }
        var nwWin = require('nw.gui').Window.get();
        nwWin.showDevTools();
        console.log(`----- ${process} Process Start -----`);
        this._sheetDataConverter[process](target);
        console.log(`----- ${process} Process End   -----`);
        setTimeout(function() {
            nwWin.focus();
        }, 500);
        this._pause();
    };

    ConverterManager._pause = function() {
        console.log('Press or Click any key to shutdown....');
        setInterval(function() {
            if (Object.keys(Input._currentState).length > 0 || TouchInput.isPressed()) SceneManager.terminate();
        }, 10);
    };

    ConverterManager.getDatabasePath = function() {
        return this.getRelativePath('data/');
    };

    ConverterManager.getRelativePath = function(subPath) {
        const path = require('path');
        const base = path.dirname(process.mainModule.filename);
        return path.join(base, subPath);
    };

    ConverterManager.setParameter = function(name, value) {
        param[name] = value;
    };

    /**
     * SheetJsCreator
     * SheetJsライブラリをダウンロードして保持します。
     */
    class SheetJsCreator {
        constructor() {
            this._loaded       = false;
            this._loadListener = [];
            this._urlIndex     = 0;
            this._loadSheetJs();
        }

        isReady() {
            return this._loaded;
        }

        addLoadListener(callBack) {
            if (this._loaded) {
                callBack();
            } else {
                this._loadListener.push(callBack);
            }
        }

        _loadSheetJs() {
            if (typeof XLSX !== 'undefined') {
                this._onLoadScript();
                return;
            }
            const script   = document.createElement('script');
            script.type    = 'text/javascript';
            script.src     = this._getSheetJsUrl();
            script.onerror = this._onLoadScriptError.bind(this);
            script.onload  = this._onLoadScript.bind(this);
            document.body.appendChild(script);
        }

        _getSheetJsUrl() {
            return AbstractSheetConverter.CDN_SERVER_URL_LIST[this._urlIndex];
        }

        _onLoadScript() {
            if (typeof XLSX === 'undefined') {
                this._onLoadScriptError();
                return;
            }
            this._loaded = true;
            this._loadListener.forEach(function(callBack) {
                callBack();
            });
            this._loadListener = null;
        }

        _onLoadScriptError() {
            this._urlIndex++;
            if (this._getSheetJsUrl()) {
                this._loadSheetJs();
            } else {
                throw new Error('CDNサーバからのライブラリダウンロードに失敗しました。マニュアルダウンロードをお試しください。');
            }
        }
    }

    /**
     * ConverterStorage
     * データファイルのロード・セーブを行います。
     */
    class ConverterStorage {
        loadDataBaseFileSync(fileName) {
            try {
                const filePath = this.getDatabaseFullPath(fileName);
                return JSON.parse(require('fs').readFileSync(filePath, {encoding: 'utf8'}));
            } catch (e) {
                console.error('Fail to Load ' + fileName);
                return [null, {id: 1, name: ' '}];
            }
        }

        saveDataBaseFile(fileName, data, sync) {
            try {
                const filePath  = this.getDatabaseFullPath(fileName);
                const fs        = require('fs');
                const writeFunc = sync ? fs.writeFileSync : fs.writeFile;
                writeFunc(filePath, JSON.stringify(data), {encoding: 'utf8'});
            } catch (e) {
                console.error('Fail to Save ' + fileName);
                throw e;
            }
        }

        getDatabaseFullPath(fileName) {
            return ConverterManager.getDatabasePath() + fileName + '.json';
        }
    }

    /**
     * AbstractSheetConverter
     * データベースとシートファイルの相互変換を行う抽象クラスです。
     */
    class AbstractSheetConverter {
        constructor(format) {
            const directory = this._getTargetDirectory();
            if (!this._makeSheetDirectoryIfNeed(directory)) {
                throw new Error(`シート出力ディレクトリ[${directory}]が見付かりませんでした。`);
            }
            this._format     = format;
            this._directory  = directory;
            this._serializer = null;
            this._target     = null;
        }

        _makeSheetDirectoryIfNeed(filePath) {
            const fs = require('fs');
            if (!fs.existsSync(filePath)) {
                try {
                    fs.mkdirSync(filePath);
                } catch (e) {
                    console.error(e);
                    return false;
                }
            }
            return fs.existsSync(filePath);
        }

        isReady() {
            return !this._serializer;
        }

        executeExport(target) {
            this._target     = target;
            this._workBook   = this._createWorkBook();
            this._serializer = new DataSerializer(target);
            this._target.execute(this._exportItem.bind(this));
            this.writeAllWorkbook();
        }

        _createWorkBook() {
            return {SheetNames: [], Sheets: {}};
        }

        _exportItem(dataName) {
            console.log('Export ' + dataName);
            const data = this._target.load(dataName);
            if (!data) {
                return;
            }
            this._workBook.SheetNames.push(dataName);
            this._workBook.Sheets[dataName] = this._serializer.serializeData(data);
        }

        /**
         * writeAllWorkbook
         * @abstract
         */
        writeAllWorkbook() {}

        writeWorkbookFile(dataBaseName, workbookData) {
            const writeOption = {bookType: this._format};
            const path        = this._getTargetFilePath(this._target.getFileName() + param.ExportPrefix, dataBaseName);
            try {
                XLSX.writeFile(workbookData, path, writeOption);
            } catch (e) {
                if (e.code === 'EBUSY') {
                    throw new Error(`ファイル[${path}]の書き出しに失敗しました。ファイルを開いている可能性があります。`);
                } else {
                    throw e;
                }
            }
        }

        executeImport(target) {
            this._target     = target;
            this._workBook   = this.readAllWorkbook();
            this._serializer = new DataSerializer(target);
            this._target.execute(this._importItem.bind(this));
        }

        _importItem(dataName) {
            const sheetData = this._workBook.Sheets[dataName];
            if (!sheetData) {
                console.warn('Skip Import ' + dataName);
                return;
            } else {
                console.log('Import ' + dataName);
            }
            const data = this._serializer.deserializeData(sheetData);
            this._target.save(dataName, data);
        }

        /**
         * readAllWorkbook
         * @abstract
         */
        readAllWorkbook() {}

        readWorkbookFile(dataBaseName) {
            const readOption = {};
            const path       = this._getTargetFilePath(this._target.getFileName(), dataBaseName);
            try {
                return XLSX.readFile(path, readOption);
            } catch (e) {
                if (e.code === 'ENOENT') {
                    throw new Error(`ファイル[${path}]が見付かりませんでした。`);
                } else {
                    throw e;
                }
            }
        }

        _getTargetDirectory() {
            const path = param.excelDataPath;
            return (!path.match(/^[A-Z]:/) ? ConverterManager.getRelativePath(path) : path);
        }

        _getTargetFilePath(baseName, dataName) {
            return `${this._directory}/${baseName}${dataName}.${this._format}`;
        }

        static getInstance(format) {
            if (AbstractSheetConverter.SINGLE_FORMATS.contains(format)) {
                return new SingleSheetConverter(format);
            } else {
                return new MultiSheetConverter(format);
            }
        }

        static get SINGLE_FORMATS() {
            return ['csv', 'txt'];
        }

        static get CDN_SERVER_URL_LIST() {
            return [
                'https://unpkg.com/xlsx/dist/xlsx.full.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.11.19/xlsx.full.min.js',
                'https://cdn.jsdelivr.net/npm/xlsx@0.11.19/dist/xlsx.full.min.js'
            ];
        }
    }

    /**
     * MultiSheetConverter
     * マルチチート用の変換クラスです。
     */
    class MultiSheetConverter extends AbstractSheetConverter {
        writeAllWorkbook() {
            this.writeWorkbookFile('', this._workBook);
        }

        readAllWorkbook() {
            return this.readWorkbookFile('');
        }
    }

    /**
     * SingleSheetConverter
     * シングルシート用の変換クラスです。
     */
    class SingleSheetConverter extends AbstractSheetConverter {
        writeAllWorkbook() {
            this._target.execute(function(databaseName) {
                var workbook = this._createWorkBook();
                workbook.SheetNames.push(databaseName);
                workbook.Sheets[databaseName] = this._workBook.Sheets[databaseName];
                this.writeWorkbookFile(databaseName, workbook);
            }.bind(this));
        }

        readAllWorkbook() {
            const workbook = this._createWorkBook();
            this._target.execute(function(databaseName) {
                const singleWork = this.readWorkbookFile(databaseName);
                if (singleWork) {
                    workbook.SheetNames.push(databaseName);
                    workbook.Sheets[databaseName] = singleWork.Sheets['Sheet1'];
                }
            }.bind(this));
            return workbook;
        }
    }

    /**
     * InterfaceConvertTarget
     * 変換対象インタフェース
     */
    class InterfaceConvertTarget {

        static METHODS() {
            return ['execute', 'getFileName', 'load', 'save', 'getColumnDescriptions', 'getArrayProperties', 'appendData'];
        }

        constructor() {
            InterfaceConvertTarget.METHODS().forEach(function(method) {
                if (!this[method] || typeof this[method] !== 'function') {
                    throw new Error(`Require method ${method} not found.`);
                }
            }, this);
        }
    }

    /**
     * ConvertTargetDatabase
     * データベース用の変換対象クラス
     */
    class ConvertTargetDatabase extends InterfaceConvertTarget {
        constructor(sync) {
            super();
            this._sync    = sync;
            this._storage = new ConverterStorage();
        }

        execute(process) {
            param.targetDatabase.map(function(databaseInfo) {
                return databaseInfo.JsonName;
            }).forEach(process, this);
        }

        getFileName() {
            return 'Database';
        }

        load(name) {
            const data = this._storage.loadDataBaseFileSync(name);
            data.shift(0);
            return data;
        }

        save(name, data) {
            data[0] = null;
            this._storage.saveDataBaseFile(name, data, this._sync);
        }

        appendData(database, dataItem) {
            if (database[dataItem.id]) {
                throw new Error(`データ内のID[${dataItem.id}]が重複しています。`);
            }
            if (!dataItem.hasOwnProperty('name')) {
                dataItem.name = '';
            }
            if (!dataItem.hasOwnProperty('note')) {
                dataItem.note = '';
            }
            database[dataItem.id] = dataItem;
        }

        getColumnDescriptions() {
            return ConvertTargetDatabase._commonDescriptions;
        }

        getArrayProperties() {
            return ConvertTargetDatabase._arrayProperties;
        }

        getSplitProperties() {
            return ConvertTargetDatabase._splitProperties;
        }

        getObjectProperties() {
            return ConvertTargetDatabase._objectProperties;
        }

    }
    ConvertTargetDatabase._commonDescriptions = {
        id                 : 'ID',
        name               : '名前',
        description        : '説明',
        traits             : '特徴',
        effects            : '効果',
        note               : 'メモ',
        actions            : '行動',
        dropItems          : 'ドロップアイテム',
        members            : 'メンバー',
        animationId        : 'アニメーション',
        hitType            : '命中タイプ',
        iconIndex          : 'アイコン',
        occasion           : '使用可能時',
        repeats            : '連続回数',
        scope              : '範囲',
        speed              : '速度補正',
        successRate        : '成功率',
        tpCost             : '消費TP',
        tpGain             : '得TP',
        mpCost             : '消費MP',
        damage_elementId   : '属性',
        damage_type        : 'タイプ',
        damage_variance    : '分散度',
        damage_critical    : '会心',
        damage_formula     : '計算式',
        price              : '価格',
        params0            : '最大HP',
        params1            : '最大MP',
        params2            : '攻撃力',
        params3            : '防御力',
        params4            : '魔法力',
        params5            : '魔法防御',
        params6            : '敏捷性',
        params7            : '運',
        stypeId            : 'スキルタイプ',
        requiredWtypeId1   : '武器タイプ1',
        requiredWtypeId2   : '武器タイプ2',
        itypeId            : 'アイテムタイプ',
        consumable         : '消耗',
        wtypeId            : '武器タイプ',
        atypeId            : '防具タイプ',
        etypeId            : '装備タイプ',
        battlerHue         : '色相',
        exp                : '経験値',
        gold               : '所持金',
        autoRemovalTiming  : '自動解除のタイミング',
        chanceByDamage     : 'ダメージで解除_ダメージ',
        maxTurns           : '継続ターン数_最大',
        minTurns           : '継続ターン数_最小',
        motion             : '[SV] モーション',
        overlay            : '[SV] 重ね合わせ',
        priority           : '優先度',
        removeAtBattleEnd  : '戦闘終了時に解除',
        removeByDamage     : 'ダメージで解除',
        removeByRestriction: '行動制約で解除',
        removeByWalking    : '歩数で解除',
        restriction        : '行動制約',
        stepsToRemove      : '歩数で解除_歩数',
        battlerName        : '[SV] 戦闘キャラ',
        characterIndex     : '歩行キャラ_インデックス',
        characterName      : '歩行キャラ_ファイル名',
        classId            : '職業',
        equips             : '装備',
        faceIndex          : '顔_インデックス',
        faceName           : '顔_ファイル名',
        initialLevel       : '初期レベル',
        maxLevel           : '最大レベル',
        nickname           : '二つ名',
        profile            : 'プロフィール',
        expParams          : '経験値曲線',
        learnings          : '習得するスキル',
        damage             : 'ダメージ',
        message1           : 'メッセージ1',
        message2           : 'メッセージ2',
        pages              : 'バトルイベント',
        message3           : 'メッセージ3',
        message4           : 'メッセージ4',
        releaseByDamage    : 'ダメージで解除_チェック',
        flags              : 'マップデータ',
        mode               : 'モード',
        list               : '実行内容',
        switchId           : 'スイッチ',
        trigger            : 'トリガー',
        tilesetNames       : '画像',
        expanded           : '展開状態',
        order              : '並び順',
        parentId           : '親マップID',
        scrollX            : 'スクロールX',
        scrollY            : 'スクロールY'
    };

    ConvertTargetDatabase._arrayProperties = [
        'equips',
        'traits',
        'expParams',
        'learnings',
        'effects',
        'actions',
        'dropItems',
        'members',
        'pages',
        'flags',
        'tilesetNames',
        'list'
    ];

    ConvertTargetDatabase._splitProperties = ['params'];

    ConvertTargetDatabase._objectProperties = {
        damage: [
            'critical',
            'elementId',
            'formula',
            'type',
            'variance'
        ]
    };

    /**
     * AbstractConvertTargetEvent
     * イベント用の変換対象抽象クラス
     */
    class AbstractConvertTargetEvent extends InterfaceConvertTarget {
        constructor(eventIdList, mapId) {
            super();
            this._mapId   = mapId;
            this._storage = new ConverterStorage();
            this.setup(eventIdList);
        }

        setup(eventIdList) {
            this._dataName = this.getFileName();
            this._database = this._storage.loadDataBaseFileSync(this._dataName);
            this.setupTargetList(eventIdList);
        }

        execute(process) {
            this._targetList.forEach(process);
        }

        appendData(database, dataItem) {
            database.push(dataItem);
        }

        load(name) {
            return this.getList(name).map(function(item) {
                item.codeName = AbstractConvertTargetEvent._eventNamesMap[item.code];
                return item;
            });
        }

        save(name, data) {
            const list = data.map(function(item) {
                delete item.codeName;
                return item;
            });
            this.setList(name, list);
            if (this._targetList.indexOf(name) === this._targetList.length - 1) {
                this._storage.saveDataBaseFile(this._dataName, this._database, false);
            }
        }

        getColumnDescriptions() {
            return AbstractConvertTargetEvent._commonDescriptions;
        }

        getArrayProperties() {
            return AbstractConvertTargetEvent._arrayProperties;
        }

        getSplitProperties() {
            return AbstractConvertTargetEvent._splitProperties;
        }

        getObjectProperties() {
            return AbstractConvertTargetEvent._objectProperties;
        }
    }
    AbstractConvertTargetEvent._commonDescriptions = {
        code       : 'イベントコード',
        indent     : 'インデント',
        codeName   : 'イベント内容',
        parameters0: 'パラメータリスト',
    };

    AbstractConvertTargetEvent._arrayProperties = [];

    AbstractConvertTargetEvent._splitProperties = ['parameters'];

    AbstractConvertTargetEvent._objectProperties = {};

    AbstractConvertTargetEvent._eventNamesMap = {
        0  : '空行',
        101: '文章の表示(設定)',
        102: '選択肢の表示',
        103: '数値入力の処理',
        104: 'アイテム選択の処理',
        401: '文章の表示',
        402: '選択肢の表示(**のとき)',
        403: '選択肢の表示(キャンセルのとき)',
        404: '選択肢の表示(分岐終了)',
        105: '文章のスクロール表示',
        405: '文章のスクロール表示(メッセージ内容)',
        108: '注釈',
        111: '条件分岐',
        411: '条件分岐(それ以外の場合)',
        412: '条件分岐(分岐終了)',
        112: 'ループ',
        413: 'ループ(以上繰り返し)',
        113: 'ループの中断',
        115: 'イベント処理の中断',
        117: 'コモンイベント',
        118: 'ラベル',
        119: 'ラベルジャンプ',
        121: 'スイッチの操作',
        122: '変数の操作',
        123: 'セルフスイッチの操作',
        124: 'タイマーの操作',
        125: '所持金の増減',
        126: 'アイテムの増減',
        127: '武器の増減',
        128: '防具の増減',
        129: 'メンバーの入れ替え',
        132: '戦闘BGMの変更',
        133: '勝利MEの変更',
        134: 'セーブ禁止の変更',
        135: 'メニュー禁止の変更',
        136: 'エンカウント禁止の変更',
        137: '並べ替え禁止の変更',
        138: 'ウィンドウカラーの変更',
        139: '敗北MEの変更',
        140: '乗り物BGMの変更',
        201: '場所移動',
        202: '乗り物位置の設定',
        203: 'イベント位置の設定',
        204: 'マップのスクロール',
        205: '移動ルートの設定',
        505: '移動ルートの設定(空行)',
        206: '乗り物の乗降',
        211: '透明状態の変更',
        212: 'アニメーションの表示',
        213: 'フキダシアイコンの表示',
        214: 'イベントの一時消去',
        216: '隊列歩行の変更',
        217: '隊列メンバーの集合',
        221: '画面のフェードアウト',
        222: '画面のフェードイン',
        223: '画面の色調変更',
        224: '画面のフラッシュ',
        225: '画面のシェイク',
        230: 'ウェイト',
        231: 'ピクチャの表示',
        232: 'ピクチャの移動',
        233: 'ピクチャの回転',
        234: 'ピクチャの色調変更',
        235: 'ピクチャの消去',
        236: '天候の設定',
        241: 'BGMの設定',
        242: 'BGMのフェードアウト',
        243: 'BGMの保存',
        244: 'BGMの再開',
        245: 'BGSの演奏',
        246: 'BGSのフェードアウト',
        249: 'MEの演奏',
        250: 'SEの演奏',
        251: 'SEの停止',
        261: 'ムービーの再生',
        281: 'マップ名表示の変更',
        282: 'タイルセットの変更',
        283: '戦闘背景の変更',
        284: '遠景の変更',
        285: '指定位置の情報取得',
        301: '戦闘の処理',
        601: '戦闘の処理(勝ったとき)',
        602: '戦闘の処理(逃げたとき)',
        603: '戦闘の処理(負けたとき)',
        302: 'ショップの処理',
        303: '名前入力の処理',
        311: 'HPの増減',
        312: 'MPの増減',
        326: 'TPの増減',
        313: 'ステートの変更',
        314: '全回復',
        315: '経験値の増減',
        316: 'レベルの増減',
        317: '能力値の増減',
        318: 'スキルの増減',
        319: '装備の変更',
        320: '名前の変更',
        321: '職業の変更',
        322: 'アクター画像の変更',
        323: '乗り物画像の変更',
        324: '二つ名の変更',
        325: 'プロフィールの変更',
        331: '敵キャラのHP増減',
        332: '敵キャラのMP増減',
        342: '敵キャラのTP増減',
        333: '敵キャラのステート変更',
        334: '敵キャラの全回復',
        335: '敵キャラの出現',
        336: '敵キャラの変身',
        337: '戦闘アニメーションの表示',
        339: '戦闘行動の強制',
        340: 'バトルの中断',
        351: 'メニュー画面を開く',
        352: 'セーブ画面を開く',
        353: 'ゲームオーバー',
        354: 'タイトル画面に戻す',
        355: 'スクリプト',
        655: 'スクリプト(2行目以降)',
        356: 'プラグインコマンド'
    };

    /**
     * ConvertTargetCommonEvent
     * コモンイベント用の変換対象クラス
     */
    class ConvertTargetCommonEvent extends AbstractConvertTargetEvent {
        setupTargetList(eventIdList) {
            if (eventIdList.length > 0) {
                this._targetList = eventIdList;
            } else {
                this._targetList = this._database.map(function(commonEvent) {
                    return commonEvent ? String(commonEvent.id) : null;
                });
                this._targetList.shift();
            }
        }

        getFileName() {
            return 'CommonEvents';
        }

        getList(name) {
            return this._database[parseInt(name)].list;
        }

        setList(name, list) {
            this._database[parseInt(name)].list = list;
        }
    }

    /**
     * ConvertTargetMapEvent
     * マップイベント用の変換対象クラス
     */
    class ConvertTargetMapEvent extends AbstractConvertTargetEvent {
        setupTargetList(eventIdList) {
            if (eventIdList.length === 0) {
                eventIdList = this._database.events.map(function(event) {
                    return event ? String(event.id) : null;
                }).filter(function(event) {
                    return !!event;
                });
            }
            this._targetList = eventIdList.reduce(function(prevData, eventId) {
                this._database.events[eventId].pages.forEach(function(page, index) {
                    prevData.push(this._joinName(eventId, index));
                }, this);
                return prevData;
            }.bind(this), []);
        }

        getFileName() {
            return 'Map%1'.format(this._mapId.padZero(3));
        }

        getList(name) {
            return this._getEventPage(name).list;
        }

        setList(name, list) {
            this._getEventPage(name).list = list;
        }

        _getEventPage(name) {
            const names = this._splitName(name);
            return this._database.events[names[0]].pages[names[1] - 1];
        }

        _splitName(name) {
            return name.split('_').map(function(data) {
                return parseInt(data);
            });
        }

        _joinName(eventId, pageIndex) {
            return `${eventId}_${pageIndex + 1}`;
        }
    }

    /**
     * ConvertTargetTestEvent
     * イベントテスト用の変換対象クラス
     */
    class ConvertTargetTestEvent extends AbstractConvertTargetEvent {
        setupTargetList() {
            this._targetList = ['EventTest'];
        }

        getFileName() {
            return 'Test_Event';
        }

        getList() {
            return this._database;
        }

        setList() {
            this._database = arguments[1];
        }
    }

    /**
     * DataSerializer
     *  Game_SheetConverterAbstract内部で使用されるデータ変換クラスです。
     */
    class DataSerializer {
        constructor(target) {
            this._utils  = XLSX.utils;
            this._target = target;
        }

        serializeData(dataList) {
            dataList = dataList.filter(function(dataItem) {
                return !!dataItem;
            });
            dataList.forEach(this._parseForSerialize, this);
            this._addColumnDescriptions(dataList);
            return this._utils.json_to_sheet(dataList);
        }

        _parseForSerialize(dataItem) {
            this._target.getArrayProperties().forEach(function(property) {
                if (dataItem.hasOwnProperty(property)) {
                    dataItem[property] = JSON.stringify(dataItem[property]);
                }
            });
            this._target.getSplitProperties().forEach(function(property) {
                this._parseArrayForSerialize(property, dataItem);
            }, this);
            Object.keys(this._target.getObjectProperties()).forEach(function(property) {
                this._parseObjectForSerialize(property, dataItem);
            }, this);
        }

        _parseArrayForSerialize(propName, dataItem) {
            if (!dataItem.hasOwnProperty(propName) || !Array.isArray(dataItem[propName])) {
                return;
            }
            dataItem[propName].forEach(function(param, index) {
                if (Array.isArray(param) || this._isObject(param)) {
                    param = JSON.stringify(param);
                }
                dataItem[propName + index] = param;
            }, this);
            delete dataItem[propName];
        }

        _parseObjectForSerialize(propName, dataItem) {
            if (!this._isObject(dataItem) || !dataItem.hasOwnProperty(propName)) {
                return;
            }
            Object.keys(dataItem[propName]).forEach(function(keyName) {
                dataItem[propName + '_' + keyName] = dataItem[propName][keyName];
            });
            delete dataItem[propName];
        }

        _isObject(param) {
            return Object.prototype.toString.call(param).slice(8, -1).toLowerCase() === 'object';
        }

        _addColumnDescriptions(data) {
            const descriptions   = {};
            const allDescription = this._target.getColumnDescriptions();
            Object.keys(data[0]).forEach(function(keyName) {
                descriptions[keyName] = allDescription[keyName] || '';
            }, this);
            data.unshift(descriptions);
        }

        deserializeData(sheetData) {
            const convertData = JSON.parse(JSON.stringify(this._utils.sheet_to_json(sheetData)), paramReplacer);
            const database    = [];
            convertData.shift();
            convertData.forEach(function(dataItem) {
                this._parseForDeserialize(dataItem);
                this._target.appendData(database, dataItem);
            }, this);
            return database;
        }

        _parseForDeserialize(dataItem) {
            this._target.getSplitProperties().forEach(function(property) {
                this._parseArrayForDeserialize(property, dataItem);
            }, this);
            Object.keys(this._target.getObjectProperties()).forEach(function(property) {
                this._parseObjectForDeserialize(property, dataItem, this._target.getObjectProperties()[property]);
            }, this);
        }

        _parseArrayForDeserialize(propName, dataItem) {
            if (!dataItem.hasOwnProperty(`${propName}0`)) {
                return;
            }
            dataItem[propName] = [];
            let index          = 0;
            while (dataItem.hasOwnProperty(`${propName}${index}`)) {
                const property            = `${propName}${index}`;
                dataItem[propName][index] = dataItem[property];
                delete dataItem[property];
                index++;
            }
        }

        _parseObjectForDeserialize(propName, dataItem, properties) {
            if (!dataItem.hasOwnProperty(`${propName}_${properties[0]}`)) {
                return;
            }
            dataItem.damage = {};
            properties.forEach(function(keyName) {
                const property           = `${propName}_${keyName}`;
                dataItem.damage[keyName] = dataItem[property];
                delete dataItem[property];
            });
        }
    }
})();
