//=============================================================================
// SceneSoundTest.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.0 2017/06/21 BGMが一曲も存在しないデータリストを読み込んで再生しようとするとエラーになる問題を修正
//                  リストウィンドウでの操作タイプを2パターン用意しました。
// 2.0.0 2017/06/18 BGS、ME、SEの演奏機能を追加
// 1.1.1 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.1.0 2017/01/25 同一サーバで同プラグインを適用した複数のゲームを公開する際に、設定が重複するのを避けるために管理番号を追加
//                  RPGアツマール等CSVが使えない環境のためデータファイルとしてJSON形式をサポート
// 1.0.3 2016/10/10 設定項目をすべて非表示にした場合、リストから選択後、ゲームが止まってしまう問題を修正
// 1.0.2 2016/05/11 ウィンドウの位置指定方法を少し変更（見た目上はそのまま）
// 1.0.1 2016/02/07 改行コード（CR+LF）に対応
//                  英語対応
// 1.0.0 2016/01/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Sound test plugin
 * @author triacontane
 *
 * @param CommandName
 * @desc Command name
 * @default Sound Test
 *
 * @param AddCommandTitle
 * @desc Add command at title scene(ON/OFF)
 * @default ON
 *
 * @param AddCommandMenu
 * @desc Add command at menu scene(ON/OFF)
 * @default ON
 *
 * @param NameVolume
 * @desc Name volume for Bgm setting window
 * @default Volume
 *
 * @param NamePitch
 * @desc Name pitch for Bgm setting window
 * @default Pitch
 *
 * @param NamePan
 * @desc Name pan for Bgm setting window
 * @default Pan
 *
 * @param BackPicture
 * @desc Back ground picture（/img/pictures/）
 * @default
 *
 * @param ReadFormat
 * @desc read data format(CSV or JSON)
 * @default CSV
 *
 * @param ManageNumber
 * @desc 同一サーバ内に複数のゲームを配布する場合のみ、ゲームごとに異なる値を設定してください。(RPGアツマールは対象外)
 * @default
 *
 * @param ListControlType
 * @desc リストウィンドウでの操作タイプです。(1, 2)
 * @default 1
 *
 * @help Add sound test screen.
 *
 * Preparation
 * Make [/data/SoundTest.csv] UFT-8
 *
 * COLUMN      : DESCRIPTION
 * fileName    : Audio File name
 * displayName : Audio Display name
 * description : Audio Description
 * type        : Audio Type(bgm or bgs or me or se)
 *
 * ex :
 * fileName,displayName,description,type
 * aaa,bbb,ccc,bgm
 *
 * CSV Sample
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/SoundTest.csv
 *
 * Plugin Command
 *
 * SOUND_TEST_CALL
 *   Call sound test scene
 *   ex : SOUND_TEST_CALL
 *
 * SOUND_TEST_LIBERATE_ALL
 *   All BGM liberate
 *   ex : SOUND_TEST_LIBERATE_ALL
 *
 * SOUND_TEST_TITLE_VALID
 *   Add command at title scene
 *   ex : SOUND_TEST_TITLE_VALID
 *
 * SOUND_TEST_MENU_VALID
 *   Add command at menu scene
 * 　例：SOUND_TEST_MENU_VALID
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc サウンドテストプラグイン
 * @author トリアコンタン
 *
 * @param コマンド名称
 * @desc タイトルやメニュー画面に表示されるコマンド名です。
 * @default サウンドテスト
 *
 * @param タイトルに追加
 * @desc タイトル画面にサウンドテストを追加します。(ON/OFF)
 * OFFにした場合もコマンドで後から有効にできます。
 * @default ON
 *
 * @param メニューに追加
 * @desc メニュー画面にサウンドテストを追加します。(ON/OFF)
 * OFFにした場合もコマンドで後から有効にできます。
 * @default ON
 *
 * @param 音量名称
 * @desc BGMの設定項目「音量」のゲーム内での名称です。
 * 空にすると、設定ウィンドウに音量が表示されなくなります。
 * @default 音量
 *
 * @param ピッチ名称
 * @desc BGMの設定項目「ピッチ」のゲーム内での名称です。
 * 空にすると、設定ウィンドウにピッチが表示されなくなります。
 * @default ピッチ
 *
 * @param 位相名称
 * @desc BGMの設定項目「位相」のゲーム内での名称です。
 * 空にすると、設定ウィンドウに位相が表示されなくなります。
 * @default 位相
 *
 * @param 背景ピクチャ
 * @desc 背景として表示するピクチャ（/img/pictures/）を指定できます。
 * サイズは画面サイズに合わせて拡縮されます。拡張子、パス不要。
 * @default
 *
 * @param 読込形式
 * @desc データファイルの読み込み形式です。
 * CSV形式およびJSON形式をサポートしています。
 * @default CSV
 *
 * @param 管理番号
 * @desc 同一サーバ内に複数のゲームを配布する場合のみ、ゲームごとに異なる値を設定してください。(RPGアツマールは対象外)
 * @default
 *
 * @param リスト操作タイプ
 * @desc リストウィンドウでの操作タイプです。(1[OK:演奏＋音量調整][Shift:演奏停止]　2[OK:演奏][Shift:音量調整])
 * @default 1
 *
 * @help ゲーム中のオーディオを視聴できるサウンドテスト画面を実装します。
 * タイトル画面、メニュー画面およびプラグインコマンドから専用画面に遷移します。
 * ゲーム中に一度でも再生したことのあるオーディオを視聴できるようになります。
 *
 * 準備
 * 1.CSV形式の場合
 * 以下の書式で「SoundTest.csv」を用意し、「/data/」以下に配置します。
 * カンマ区切りのCSV形式で、データ中にカンマは使用できません。
 * また、文字コードは「UTF-8」で保存してください。
 * 特にExcel等で編集した後は注意してください。
 *
 * 項目名      : 説明
 * fileName    : BGMのファイル名です。拡張子不要。
 * displayName : BGMリストに表示される曲名です。
 * description : ヘルプウィンドウに表示される説明です。
 * type        : オーディオ種別(bgm or bgs or me or se)
 *
 * なお、別プラグイン「バッチ処理プラグイン」(BatchProcessManager.js)
 * を使えば現在のBGMフォルダを解析して上記書式のひな形CSVを自動生成できます。
 *
 * 「バッチ処理プラグイン」配布先
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/BatchProcessManager.js
 *
 * こちらにCSVのサンプルをあげています。
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/SoundTest.csv
 *
 * 2.JSON形式の場合
 * RPGアツマール等のCSV形式が使用できない環境の場合、
 * こちらのJSON形式を選択してください。
 * 以下の書式で「SoundTest.json」を用意し、「/data/」以下に配置します。
 * 文字コードは「UTF-8」で保存してください。
 *
 * [
 *  {"fileName":"BGMファイル名", "displayName":"BGM表示名", "description":"説明", "type":"BGM"},
 *  {"fileName":"BGMファイル名", "displayName":"BGM表示名", "description":"説明", "type":"BGS""}
 * ]
 *
 * CSV→JSON変換ツールを使用した場合、末尾のカンマ等が正しく記述されていないと
 * エラーが発生するので注意してください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SOUND_TEST_CALL or
 * サウンドテスト画面の呼び出し
 * 　サウンドテスト画面を呼び出します。
 * 　例：SOUND_TEST_CALL
 *
 * SOUND_TEST_LIBERATE_ALL or
 * サウンドテスト全開放
 * 　サウンドテスト画面で？？？となっている曲目を全開放します。
 * 　例：SOUND_TEST_LIBERATE_ALL
 *
 * SOUND_TEST_TITLE_VALID or
 * タイトル画面のサウンドテスト有効化
 * 　タイトル画面の項目にサウンドテストが追加されます。
 * 　例：SOUND_TEST_TITLE_VALID
 *
 * SOUND_TEST_MENU_VALID or
 * メニュー画面のサウンドテスト有効化
 * 　メニュー画面の項目にサウンドテストが追加されます。
 * 　例：SOUND_TEST_MENU_VALID
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

//=============================================================================
// グローバル変数
//  サウンドテストデータファイルとゲームファイル
//=============================================================================
var $gameSoundTest = null;
var $dataSoundTest = null;

function Game_SoundTest() {
    this.initialize.apply(this, arguments);
}

function Game_AudioSelector() {
    this.initialize.apply(this, arguments);
}

function Scene_SoundTest() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    var pluginName = 'SceneSoundTest';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
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

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    var paramReadFormat      = getParamString(['読込形式', 'ReadFormat']).toUpperCase();
    var paramManageNumber    = getParamString(['管理番号', 'ManageNumber']);
    var paramListControlType = getParamNumber(['リスト操作タイプ', 'ListControlType'], 1, 2);

    //=============================================================================
    // DataManager
    //  CSV読み込み処理を定義します。
    //=============================================================================
    DataManager._dataSeparater = ',';
    DataManager.soundTestFiles = [];

    DataManager.loadCsvFiles = function() {
        this.soundTestFiles.forEach(function(file) {
            this._loadCsvFile(file.name, file.src);
        }.bind(this));
    };

    DataManager._loadCsvFile = function(name, src) {
        var xhr = new XMLHttpRequest();
        var url = 'data/' + src;
        xhr.open('GET', url);
        xhr.onload   = function() {
            if (xhr.status < 400) {
                window[name] = this._loadSoundData(xhr.responseText);
            } else {
                window[name] = [];
            }
        }.bind(this);
        xhr.onerror  = function() {
            window[name] = [];
        }.bind(this);
        window[name] = null;
        xhr.send();
    };

    DataManager._loadSoundData = function(responseText) {
        switch (paramReadFormat) {
            case 'JSON':
                return JSON.parse(responseText);
            default :
                return this._loadCsvData(responseText);
        }
    };

    DataManager._loadCsvData = function(responseText) {
        var dataList  = [null];
        var dataArray = responseText.replace(/\r\n?/g, '\n').split('\n');
        var columns   = dataArray.shift().split(this._dataSeparater);
        dataArray.forEach(function(line) {
            if (line === '') return;
            var dataObject = {};
            dataObject.id  = dataList.length;
            iterate(line.split(this._dataSeparater), function(key, data) {
                dataObject[columns[key]] = data.replace(/^\s*\"?(.*?)\"?\s*$/, function() {
                    return arguments[1];
                });
            }.bind(this));
            dataList[dataObject.id] = dataObject;
        }.bind(this));
        return dataList;
    };

    DataManager.isLoadedCsv = function() {
        return this.soundTestFiles.every(function(file) {
            return window[file.name];
        }.bind(this));
    };

    DataManager.getSoundTestFileName = function() {
        switch (paramReadFormat) {
            case 'JSON':
                return 'SoundTest.json';
            default :
                return 'SoundTest.csv';
        }
    };

    DataManager.soundTestFiles.push({name: '$dataSoundTest', src: DataManager.getSoundTestFileName()});

    //=============================================================================
    // StorageManager
    //  サウンドテスト設定ファイルのパス取得処理を追加定義します。
    //=============================================================================
    var _StorageManager_localFilePath = StorageManager.localFilePath;
    StorageManager.localFilePath      = function(saveFileId) {
        if (saveFileId === SoundTestManager.saveId) {
            return this.localFileDirectoryPath() + 'SoundTest.rpgsave';
        } else {
            return _StorageManager_localFilePath.apply(this, arguments);
        }
    };

    var _StorageManager_webStorageKey = StorageManager.webStorageKey;
    StorageManager.webStorageKey      = function(saveFileId) {
        if (saveFileId === SoundTestManager.saveId) {
            return 'RPG SoundTest' + paramManageNumber;
        } else {
            return _StorageManager_webStorageKey.apply(this, arguments);
        }
    };

    //=============================================================================
    // AudioManager
    //  演奏時にプレイリストに追加します。
    //=============================================================================
    var _AudioManager_playBgm = AudioManager.playBgm;
    AudioManager.playBgm      = function(bgm, pos) {
        _AudioManager_playBgm.apply(this, arguments);
        SoundTestManager.addPlayListIfNeed(bgm, 0);
    };

    var _AudioManager_playBgs = AudioManager.playBgs;
    AudioManager.playBgs      = function(bgs, pos) {
        _AudioManager_playBgs.apply(this, arguments);
        SoundTestManager.addPlayListIfNeed(bgs, 1);
    };

    var _AudioManager_playMe = AudioManager.playMe;
    AudioManager.playMe      = function(me) {
        _AudioManager_playMe.apply(this, arguments);
        SoundTestManager.addPlayListIfNeed(me, 2);
    };

    var _AudioManager_playSe = AudioManager.playSe;
    AudioManager.playSe      = function(se) {
        _AudioManager_playSe.apply(this, arguments);
        SoundTestManager.addPlayListIfNeed(se, 3);
    };

    var _AudioManager_playStaticSe = AudioManager.playStaticSe;
    AudioManager.playStaticSe      = function(se) {
        _AudioManager_playStaticSe.apply(this, arguments);
        SoundTestManager.addPlayListIfNeed(se, 3);
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandSceneSoundTest(command, args);
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
            console.error('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandSceneSoundTest = function(command) {
        switch (getCommandName(command)) {
            case 'SOUND_TEST_CALL' :
            case 'サウンドテスト画面の呼び出し' :
                SceneManager.push(Scene_SoundTest);
                break;
            case 'SOUND_TEST_LIBERATE_ALL':
            case 'サウンドテスト全開放':
                $gameSoundTest.addPlayListAll();
                SoundTestManager.saveGame();
                break;
            case 'SOUND_TEST_TITLE_VALID' :
            case 'タイトル画面のサウンドテスト有効化' :
                $gameSoundTest.titleCommandVisible = true;
                SoundTestManager.saveGame();
                break;
            case 'SOUND_TEST_MENU_VALID' :
            case 'メニュー画面のサウンドテスト有効化' :
                $gameSoundTest.menuCommandVisible = true;
                SoundTestManager.saveGame();
                break;
        }
    };

    //=============================================================================
    // Scene_Boot
    //  サウンドテスト設定ファイルを読み込んでからゲームを開始します。
    //=============================================================================
    var _Scene_Boot_create      = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _Scene_Boot_create.apply(this, arguments);
        DataManager.loadCsvFiles();
        if (!SoundTestManager.loadGame()) {
            SoundTestManager.makeGame();
        }
    };

    var _Scene_Boot_isReady      = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        return _Scene_Boot_isReady.apply(this, arguments) && DataManager.isLoadedCsv();
    };

    var _Scene_Boot_start      = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        SoundTestManager.saveGame();
    };

    //=============================================================================
    // Scene_Title
    //  サウンドテスト画面の呼び出しを追加します。
    //=============================================================================
    var _Scene_Title_createCommandWindow      = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.apply(this, arguments);
        if ($gameSoundTest.titleCommandVisible)
            this._commandWindow.setHandler('soundTest', this.commandSoundTest.bind(this));
    };

    Scene_Title.prototype.commandSoundTest = function() {
        this._commandWindow.close();
        SceneManager.push(Scene_SoundTest);
    };

    //=============================================================================
    // Scene_Menu
    //  サウンドテスト画面の呼び出しを追加します。
    //=============================================================================
    var _Scene_Menu_createCommandWindow      = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.apply(this, arguments);
        if ($gameSoundTest.menuCommandVisible)
            this._commandWindow.setHandler('soundTest', this.commandSoundTest.bind(this));
    };

    Scene_Menu.prototype.commandSoundTest = function() {
        SceneManager.push(Scene_SoundTest);
    };

    //=============================================================================
    // Window_TitleCommand
    //  サウンドテスト画面の呼び出しの選択肢を追加定義します。
    //=============================================================================
    var _Window_TitleCommand_makeCommandList      = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.apply(this, arguments);
        if ($gameSoundTest.titleCommandVisible)
            this.addCommand(getParamString(['コマンド名称', 'CommandName']), 'soundTest');
    };

    var _Window_TitleCommand_updatePlacement      = Window_TitleCommand.prototype.updatePlacement;
    Window_TitleCommand.prototype.updatePlacement = function() {
        _Window_TitleCommand_updatePlacement.apply(this, arguments);
        if ($gameSoundTest.titleCommandVisible) this.y += this.height / 8;
    };

    //=============================================================================
    // Window_MenuCommand
    //  サウンドテスト画面の呼び出しの選択肢を追加定義します。
    //=============================================================================
    var _Window_MenuCommand_addOriginalCommands      = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.apply(this, arguments);
        var enabled = this.isSoundTestEnabled();
        if ($gameSoundTest.menuCommandVisible)
            this.addCommand(getParamString(['コマンド名称', 'CommandName']), 'soundTest', enabled);
    };

    Window_MenuCommand.prototype.isSoundTestEnabled = function() {
        return true;
    };

    //=============================================================================
    // Scene_SoundTest
    //  サウンドテスト画面を扱うクラスです。
    //=============================================================================
    Scene_SoundTest.prototype             = Object.create(Scene_MenuBase.prototype);
    Scene_SoundTest.prototype.constructor = Scene_SoundTest;

    Scene_SoundTest.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        $gameSoundTest.refresh();
        this._backgroundLoading = false;
    };

    Scene_SoundTest.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createAudioCategoryWindow();
        this.createAudioListWindow();
        this.createAudioSettingWindow();
        this.activateAudioList();
        this.changeAudioCategory();
    };

    var _Scene_SoundTest_createBackground      = Scene_SoundTest.prototype.createBackground;
    Scene_SoundTest.prototype.createBackground = function() {
        var background = getParamString(['背景ピクチャ', 'BackPicture']);
        if (background) {
            this._backgroundSprite        = new Sprite();
            this._backgroundSprite.bitmap = ImageManager.loadPicture(background, 0);
            this.addChild(this._backgroundSprite);
            this._backgroundLoading = true;
        } else {
            _Scene_SoundTest_createBackground.apply(this, arguments);
        }
    };

    Scene_SoundTest.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        if (this._backgroundLoading && this._backgroundSprite.bitmap.isReady()) {
            this._backgroundSprite.scale.x = Graphics.boxWidth / this._backgroundSprite.width;
            this._backgroundSprite.scale.y = Graphics.boxHeight / this._backgroundSprite.height;
            this._backgroundLoading        = false;
        }
    };

    Scene_SoundTest.prototype.createAudioCategoryWindow = function() {
        var y                     = this._helpWindow.y + this._helpWindow.height;
        this._audioCategoryWindow = new Window_AudioCategory(0, y);
        this._audioCategoryWindow.setHandler('touchInside', this.onTouchCategory.bind(this));
        this.addWindow(this._audioCategoryWindow);
    };

    Scene_SoundTest.prototype.createAudioListWindow = function() {
        var upperWindow       = this._audioCategoryWindow.isCommandExist() ? this._audioCategoryWindow : this._helpWindow;
        var y                 = upperWindow.y + upperWindow.height;
        var height            = Graphics.boxHeight - y;
        this._audioListWindow = new Window_AudioList(0, y, 320, height, this._audioCategoryWindow);
        this._audioListWindow.setHelpWindow(this._helpWindow);
        this._audioListWindow.setHandler('ok', this.onListOk.bind(this));
        this._audioListWindow.setHandler('cancel', this.escapeScene.bind(this));
        this._audioListWindow.setHandler('change', this.changeAudioCategory.bind(this));
        this._audioListWindow.setHandler('shift', this.onListShift.bind(this));
        this._audioListWindow.setHandler('touchInside', this.activateAudioList.bind(this));
        this.addWindow(this._audioListWindow);
    };

    Scene_SoundTest.prototype.createAudioSettingWindow = function() {
        this._audioSettingWindow = new Window_AudioSetting(this._audioCategoryWindow.width, this._audioCategoryWindow.y);
        this._audioSettingWindow.setHandler('cancel', this.activateAudioList.bind(this));
        this._audioSettingWindow.setHandler('touchInside', this.activateAudioSetting.bind(this));
        this.addWindow(this._audioSettingWindow);
        if (SoundTestManager.isSettingEmpty()) this._audioSettingWindow.hide();
    };

    Scene_SoundTest.prototype.onListOk = function() {
        if (!this._audioListWindow.isCurrentItemEnabled()) return;
        this.playAudio();
        if (paramListControlType === 1) {
            this.activateAudioSetting();
        } else {
            this.activateAudioList();
        }
    };

    Scene_SoundTest.prototype.onListShift = function() {
        if (!this._audioListWindow.isCurrentItemEnabled()) return;
        if (paramListControlType === 1) {
            this.stopAudio();
        } else {
            this.activateAudioSetting();
        }
    };

    Scene_SoundTest.prototype.playAudio = function() {
        $gameSoundTest.setNameAndPlay(this._audioListWindow.item().fileName);
    };

    Scene_SoundTest.prototype.stopAudio = function() {
        $gameSoundTest.setNameAndPlay('');
        AudioManager.stopAll();
    };

    Scene_SoundTest.prototype.escapeScene = function() {
        $gameSoundTest.restoreAudio();
        this.popScene();
    };

    Scene_SoundTest.prototype.activateAudioSetting = function() {
        if (!SoundTestManager.isSettingEmpty()) {
            this._audioListWindow.deactivate();
            this._audioSettingWindow.activate();
            this._audioSettingWindow.select(0);
            this._audioCategoryWindow.deactivate();
            this.changeAudioName();
        } else {
            this.activateAudioList();
        }
    };

    Scene_SoundTest.prototype.onTouchCategory = function() {
        this._audioCategoryWindow.selectForTouch();
        this.changeAudioCategory();
        this.activateAudioList();
    };

    Scene_SoundTest.prototype.activateAudioList = function() {
        this._audioSettingWindow.deselect();
        this._audioSettingWindow.deactivate();
        this._audioListWindow.activate();
    };

    Scene_SoundTest.prototype.changeAudioCategory = function() {
        var type = this._audioCategoryWindow.getAudioType();
        $gameSoundTest.setAudioType(type);
        this._audioListWindow.setup(type);
        this.changeAudioName();
    };

    Scene_SoundTest.prototype.changeAudioName = function() {
        $gameSoundTest.setName(this._audioListWindow.item().fileName);
    };

    //=============================================================================
    // Window_Selectable
    //  サウンドテスト画面のウィンドウ共通処理です。
    //=============================================================================
    var _Window_Selectable_processTouch      = Window_Selectable.prototype.processTouch;
    Window_Selectable.prototype.processTouch = function() {
        _Window_Selectable_processTouch.apply(this, arguments);
        if (this._soundTestWindow) {
            this.processTouchNonActive();
        }
    };

    Window_Selectable.prototype.processTouchNonActive = function() {
        if (this.isOpen() && !this.active && this.isTouchedInsideFrame() &&
            this.isHandled('touchInside') && TouchInput.isTriggered()) {
            this.callHandler('touchInside');
            this.selectForTouch();
        }
    };

    var _Window_Selectable_processHandling      = Window_Selectable.prototype.processHandling;
    Window_Selectable.prototype.processHandling = function() {
        _Window_Selectable_processHandling.apply(this, arguments);
        if (!this._soundTestWindow) return;
        if (this.isOpenAndActive()) {
            if (this.isShiftEnabled() && this.isShiftTriggered()) {
                this.processShift();
            }
        }
    };

    Window_Selectable.prototype.isShiftEnabled = function() {
        return this.isHandled('shift');
    };

    Window_Selectable.prototype.isShiftTriggered = function() {
        return Input.isRepeated('shift');
    };

    Window_Selectable.prototype.processShift = function() {
        this.callHandler('shift');
    };

    Window_Selectable.prototype.selectForTouch = function() {
        var lastIndex = this.index();
        var x         = this.canvasToLocalX(TouchInput.x);
        var y         = this.canvasToLocalY(TouchInput.y);
        var hitIndex  = this.hitTest(x, y);
        if (hitIndex >= 0) {
            this.select(hitIndex);
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    };

    //=============================================================================
    // Window_AudioSetting
    //  オーディオカテゴリウィンドウです。
    //=============================================================================
    function Window_AudioCategory() {
        this.initialize.apply(this, arguments);
    }

    Window_AudioCategory._audioTypeNames = {
        bgm: 'BGM',
        bgs: 'BGS',
        me : 'ME',
        se : 'SE'
    };

    Window_AudioCategory.prototype             = Object.create(Window_HorzCommand.prototype);
    Window_AudioCategory.prototype.constructor = Window_AudioCategory;

    Window_AudioCategory.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
        this._soundTestWindow = true;
        this.select(0);
        this.deactivate();
    };

    Window_AudioCategory.prototype.getAudioType = function() {
        return this.commandSymbol(this.index());
    };

    Window_AudioCategory.prototype.makeCommandList = function() {
        SoundTestManager.types.forEach(function(type) {
            if ($gameSoundTest.isExistAudio(type)) {
                this.addCommand(Window_AudioCategory._audioTypeNames[type], type);
            }
        }, this);
        this.updateVisibility();
    };

    Window_AudioCategory.prototype.maxCols = function() {
        return 4;
    };

    Window_AudioCategory.prototype.windowWidth = function() {
        return 320;
    };

    Window_AudioCategory.prototype.updateVisibility = function() {
        if (!this.isCommandExist()) {
            this.visible = false;
        }
    };

    Window_AudioCategory.prototype.isCommandExist = function() {
        return this._list.length > 1;
    };

    //=============================================================================
    // Window_AudioList
    //  オーディオリストウィンドウです。
    //=============================================================================
    function Window_AudioList() {
        this.initialize.apply(this, arguments);
        this._soundTestWindow = true;
    }

    Window_AudioList.prototype             = Object.create(Window_Selectable.prototype);
    Window_AudioList.prototype.constructor = Window_AudioList;

    Window_AudioList.prototype.initialize = function(x, y, width, height, categoryWindow) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._data           = [];
        this._categoryWindow = categoryWindow;
        this.setup(categoryWindow.getAudioType());
        this.select(0);
    };

    Window_AudioList.prototype.maxCols = function() {
        return 1;
    };

    Window_AudioList.prototype.spacing = function() {
        return 0;
    };

    Window_AudioList.prototype.maxItems = function() {
        return this._data ? this._data.length : 1;
    };

    Window_AudioList.prototype.item = function() {
        var index = this.index();
        return this._data && index >= 0 ? this._data[index] : null;
    };

    Window_AudioList.prototype.isEnabled = function(item) {
        return item ? $gameSoundTest.isPlayAlready(item.fileName, this._audioType) : false;
    };

    Window_AudioList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this._data[this.index()]);
    };

    Window_AudioList.prototype.makeItemList = function() {
        this._data = $gameSoundTest.getAudioDataList(this._audioType);
    };

    Window_AudioList.prototype.drawItem = function(index) {
        var item = this._data[index];
        if (item) {
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    Window_AudioList.prototype.drawItemName = function(item, x, y, width) {
        this.resetTextColor();
        this.drawText(this.isEnabled(item) ? item.displayName : '？？？', x, y, width);
    };

    Window_AudioList.prototype.updateHelp = function() {
        var item = this.item();
        this._helpWindow.setText(item ? this.getDescription(item) : '');
    };

    Window_AudioList.prototype.getDescription = function(item) {
        return this.isEnabled(item) ? '【' + item.displayName + '】\n' + item.description : '？？？';
    };

    Window_AudioList.prototype.setup = function(audioType) {
        if (this._audioType === audioType) return;
        this._audioType = audioType;
        this.refresh();
        this.select(0);
    };

    Window_AudioList.prototype.refresh = function() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    var _Window_AudioList_cursorRight      = Window_AudioList.prototype.cursorRight;
    Window_AudioList.prototype.cursorRight = function(wrap) {
        var prevIndex = this._categoryWindow.index();
        _Window_AudioList_cursorRight.apply(this, arguments);
        this._categoryWindow.cursorRight(wrap);
        this.callHandler('change');
        if (prevIndex !== this._categoryWindow.index()) {
            SoundManager.playCursor();
        }
    };

    var _Window_AudioList_cursorLeft      = Window_AudioList.prototype.cursorLeft;
    Window_AudioList.prototype.cursorLeft = function(wrap) {
        var prevIndex = this._categoryWindow.index();
        _Window_AudioList_cursorLeft.apply(this, arguments);
        this._categoryWindow.cursorLeft(wrap);
        this.callHandler('change');
        if (prevIndex !== this._categoryWindow.index()) {
            SoundManager.playCursor();
        }
    };

    var _Window_AudioList_playOkSound      = Window_AudioList.prototype.playOkSound;
    Window_AudioList.prototype.playOkSound = function() {
        if (!$gameSoundTest.isSelectSe()) {
            _Window_AudioList_playOkSound.apply(this, arguments);
        }
    };

    //=============================================================================
    // Window_AudioSetting
    //  BGM設定ウィンドウです。
    //=============================================================================
    function Window_AudioSetting() {
        this.initialize.apply(this, arguments);
    }

    Window_AudioSetting.prototype             = Object.create(Window_Command.prototype);
    Window_AudioSetting.prototype.constructor = Window_AudioSetting;

    Window_AudioSetting.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
        this._soundTestWindow = true;
        this.deselect();
    };

    Window_AudioSetting.prototype.windowWidth = function() {
        return 360;
    };

    Window_AudioSetting.prototype.windowHeight = function() {
        return this.fittingHeight(this.maxRows());
    };

    Window_AudioSetting.prototype.lineHeight = function() {
        return 42;
    };

    Window_AudioSetting.prototype.makeCommandList = function() {
        var volume = SoundTestManager.settingNameValues.volume;
        if (volume !== '') this.addCommand(volume, 'volume');
        var pitch = SoundTestManager.settingNameValues.pitch;
        if (pitch !== '') this.addCommand(pitch, 'pitch');
        var pan = SoundTestManager.settingNameValues.pan;
        if (pan !== '') this.addCommand(pan, 'pan');
    };

    Window_AudioSetting.prototype.drawItem = function(index) {
        this.resetTextColor();
        var rect        = this.itemRectForText(index);
        var statusWidth = this.statusWidth();
        var titleWidth  = rect.width - statusWidth;
        var symbol      = this.commandSymbol(index);
        var value       = this.getSettingValue(symbol);
        var unit        = SoundTestManager.settingUnitValues[symbol];
        this.drawItemGauge(index);
        this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
        this.drawText(value + unit, titleWidth, rect.y, statusWidth, 'right');
    };

    Window_AudioSetting.prototype.drawItemGauge = function(index) {
        var rect   = this.itemRectForText(index);
        var symbol = this.commandSymbol(index);
        var value  = this.getSettingValue(symbol);
        var min    = SoundTestManager.settingMinValues[symbol];
        var max    = SoundTestManager.settingMaxValues[symbol];
        var rate   = (value - min) / (max - min);
        var color1 = this.mpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        this.drawGauge(rect.x, rect.y, rect.width, rate, color1, color2);
    };

    Window_AudioSetting.prototype.statusWidth = function() {
        return 120;
    };

    var _Window_BgmSetting_cursorRight        = Window_AudioSetting.prototype.cursorRight;
    Window_AudioSetting.prototype.cursorRight = function(wrap) {
        _Window_BgmSetting_cursorRight.apply(this, arguments);
        this._shiftValue(this.valueOffset(), Input.isTriggered('right'));
    };

    var _Window_BgmSetting_cursorLeft        = Window_AudioSetting.prototype.cursorLeft;
    Window_AudioSetting.prototype.cursorLeft = function(wrap) {
        _Window_BgmSetting_cursorLeft.apply(this, arguments);
        this._shiftValue(-this.valueOffset(), Input.isTriggered('left'));
    };

    Window_AudioSetting.prototype.processOk = function() {
        this._shiftValue(this.valueOffset(), Input.isTriggered('ok') || TouchInput.isTriggered('ok'));
    };

    Window_AudioSetting.prototype._shiftValue = function(offset, loopFlg) {
        var index  = this.index();
        var symbol = this.commandSymbol(index);
        var value  = this.getSettingValue(symbol);
        var min    = SoundTestManager.settingMinValues[symbol];
        var max    = SoundTestManager.settingMaxValues[symbol];
        if (loopFlg) {
            value += offset;
            if (value > max) value = min;
            if (value < min) value = max;
        } else {
            value = (value + offset).clamp(min, max);
        }
        this.changeValue(symbol, value);
    };

    Window_AudioSetting.prototype.valueOffset = function() {
        return 10;
    };

    Window_AudioSetting.prototype.changeValue = function(symbol, value) {
        var lastValue = this.getSettingValue(symbol);
        if (lastValue !== value) {
            $gameSoundTest.setBgmPropertyAndPlay(symbol, value);
            this.redrawItem(this.findSymbol(symbol));
            if (!$gameSoundTest.isSelectSe()) {
                SoundManager.playCursor();
            }
        }
    };

    Window_AudioSetting.prototype.getSettingValue = function(symbol) {
        return $gameSoundTest.getBgmProperty(symbol);
    };

    var paramVolume = getParamString(['音量名称', 'NameVolume']);
    var paramPitch  = getParamString(['ピッチ名称', 'NamePitch']);
    var paramPan    = getParamString(['位相名称', 'NamePan']);
    //=============================================================================
    // SoundTestManager
    //  サウンドテスト設定ファイルのセーブとロードを定義します。
    //=============================================================================
    function SoundTestManager() {
        throw new Error('This is a static class');
    }

    SoundTestManager.saveId            = -5684;
    SoundTestManager.settingNameValues = {volume: paramVolume, pitch: paramPitch, pan: paramPan};
    SoundTestManager.settingMinValues  = {volume: 0, pitch: 50, pan: -100};
    SoundTestManager.settingMaxValues  = {volume: 100, pitch: 150, pan: 100};
    SoundTestManager.settingUnitValues = {volume: '%', pitch: '%', pan: ''};
    SoundTestManager.types             = ['bgm', 'bgs', 'me', 'se'];

    SoundTestManager.makeGame = function() {
        $gameSoundTest = new Game_SoundTest();
    };

    SoundTestManager.loadGame = function() {
        var json;
        try {
            json = StorageManager.load(this.saveId);
        } catch (e) {
            console.error(e);
            return false;
        }
        if (json) {
            $gameSoundTest = JsonEx.parse(json);
            $gameSoundTest.onLoad();
        } else {
            return false;
        }
        return true;
    };

    SoundTestManager.saveGame = function() {
        StorageManager.save(this.saveId, JsonEx.stringify($gameSoundTest));
    };

    SoundTestManager.isSettingEmpty = function() {
        return this.settingNameValues.volume + this.settingNameValues.pitch + this.settingNameValues.pan === '';
    };

    SoundTestManager.addPlayListIfNeed = function(audio, typeIndex) {
        var added = $gameSoundTest.addPlayList(audio, this.types[typeIndex]);
        if (added) this.saveGame();
    };

    //=============================================================================
    // Game_AudioSelector
    //  選択中のサウンド情報を保持するクラスです。
    //=============================================================================
    Game_AudioSelector.prototype.initialize = function() {
        this._type      = '';
        this._container = null;
        this._player    = null;
    };

    Game_AudioSelector.prototype.setData = function(type, container, playingAudio, player) {
        this._type      = type;
        this._container = container;
        this._player    = player;
    };

    Game_AudioSelector.prototype.play = function(audio) {
        this._player(audio);
    };

    Game_AudioSelector.prototype.getAudioType = function() {
        return this._type;
    };

    Game_AudioSelector.prototype.getContainer = function() {
        return this._container;
    };

    //=============================================================================
    // Game_SoundTest
    //  サウンドテスト情報を保持するクラスです。
    //  $gameSoundTestとして作成され、専用のセーブファイルに保存されます。
    //=============================================================================
    Game_SoundTest.prototype.initialize = function() {
        this.titleCommandVisible = getParamBoolean(['タイトルに追加', 'AddCommandTitle']);
        this.menuCommandVisible  = getParamBoolean(['メニューに追加', 'AddCommandMenu']);
        this._playedList         = {};
        this._playedBgsList      = {};
        this._playedMeList       = {};
        this._playedSeList       = {};
        this._originalBgm        = null;
        this._originalBgs        = null;
        this._playingAudio       = null;
        this._audioSelector      = null;
        this.onLoad();
    };

    Game_SoundTest.prototype.onLoad = function() {
        this._audioSelector = null;
        this.setAudioType();
    };

    Game_SoundTest.prototype.setAudioType = function(type) {
        if (!type) type = SoundTestManager.types[0];
        if (!this._audioSelector) {
            this._audioSelector = new Game_AudioSelector();
        }
        if (type === this._audioSelector.getAudioType()) return;
        var audioData = this.getAudioData(type);
        this._audioSelector.setData(type, audioData.container, audioData.playingAudio, audioData.player);
    };

    Game_SoundTest.prototype.getAudioData = function(type) {
        var container, player;
        switch (type.toLowerCase()) {
            case SoundTestManager.types[0]:
                container = this._playedList;
                player    = AudioManager.playBgm.bind(AudioManager);
                break;
            case SoundTestManager.types[1]:
                if (!this._playedBgsList) this._playedBgsList = {};
                container = this._playedBgsList;
                player    = AudioManager.playBgs.bind(AudioManager);
                break;
            case SoundTestManager.types[2]:
                if (!this._playedMeList) this._playedMeList = {};
                container = this._playedMeList;
                player    = AudioManager.playMe.bind(AudioManager);
                break;
            case SoundTestManager.types[3]:
                if (!this._playedSeList) this._playedSeList = {};
                container = this._playedSeList;
                player    = AudioManager.playSe.bind(AudioManager);
                break;
        }
        return {
            container: container,
            player   : player
        }
    };

    Game_SoundTest.prototype.refresh = function() {
        this.saveAudio();
        this.initAudio();
        AudioManager.stopAll();
    };

    Game_SoundTest.prototype.initAudio = function() {
        this._playingAudio = {name: '', volume: 90, pitch: 100, pan: 0};
    };

    Game_SoundTest.prototype.getAudioContainer = function(type) {
        return type ? this.getAudioData(type).container : this._audioSelector.getContainer()
    };

    Game_SoundTest.prototype.addPlayList = function(audio, type) {
        var container = this.getAudioContainer(type);
        if (!container.hasOwnProperty(audio.name)) {
            container[audio.name] = audio.pitch;
            return true;
        }
        return false;
    };

    Game_SoundTest.prototype.addPlayListAll = function() {
        $dataSoundTest.forEach(function(data) {
            if (data) this.addPlayList({name: data.fileName, volume: 90, pitch: 100, pan: 0}, data.type);
        }.bind(this));
    };

    Game_SoundTest.prototype.getAudioDataList = function(type) {
        return $dataSoundTest.filter(function(data) {
            return data && ((data.type || SoundTestManager.types[0]) === type);
        });
    };

    Game_SoundTest.prototype.isExistAudio = function(type) {
        return this.getAudioDataList(type).length > 0;
    };

    Game_SoundTest.prototype.isPlayAlready = function(audioName, type) {
        var container = this.getAudioContainer(type);
        return !!container[audioName];
    };

    Game_SoundTest.prototype.setName = function(audioName) {
        var audio  = this._playingAudio;
        audio.name = audioName;
        if (SoundTestManager.settingNameValues.pitch === '') {
            audio.pitch = this.getAudioContainer()[audioName];
        }
    };

    Game_SoundTest.prototype.setNameAndPlay = function(audioName) {
        this.setName(audioName);
        this.play();
    };

    Game_SoundTest.prototype.setBgmPropertyAndPlay = function(symbol, value) {
        this._playingAudio[symbol] = value;
        this.play();
    };

    Game_SoundTest.prototype.getBgmProperty = function(symbol) {
        return this._playingAudio[symbol];
    };

    Game_SoundTest.prototype.play = function() {
        if (this.isSelectBgs()) {
            AudioManager.stopBgm();
        }
        if (this.isSelectBgm()) {
            AudioManager.stopBgs();
            AudioManager.stopMe();
        }
        this._audioSelector.play(this._playingAudio);
    };

    Game_SoundTest.prototype.saveAudio = function() {
        this._originalBgm = AudioManager.saveBgm();
        this._originalBgs = AudioManager.saveBgs();
    };

    Game_SoundTest.prototype.restoreAudio = function() {
        AudioManager.replayBgm(this._originalBgm);
        AudioManager.replayBgs(this._originalBgs);
    };

    Game_SoundTest.prototype.isSelectType = function(type) {
        return this._audioSelector.getAudioType() === SoundTestManager.types[type];
    };

    Game_SoundTest.prototype.isSelectBgm = function() {
        return this.isSelectType(0);
    };

    Game_SoundTest.prototype.isSelectBgs = function() {
        return this.isSelectType(1);
    };

    Game_SoundTest.prototype.isSelectSe = function() {
        return this.isSelectType(3);
    };
})();
