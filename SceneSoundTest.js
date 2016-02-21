//=============================================================================
// SceneSoundTest.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @desc read data format(Support CSV only)
 * @default CSV
 *
 * @help Add sound test screen.
 *
 * Preparation
 * Make [/data/SoundTest.csv] UFT-8
 *
 * COLUMN      : DESCRIPTION
 * fileName    : BGM File name
 * displayName : BGM Display name
 * description : BGM Description
 *
 * ex :
 * fileName,displayName,description
 * aaa,bbb,ccc
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
 * 現在はCSVしかサポートしていません。（この項目は無意味です）
 * @default CSV
 *
 * @help ゲーム中のBGMを視聴できるサウンドテストを実装します。
 * タイトル画面、メニュー画面およびプラグインコマンドから専用画面に遷移します。
 * 一度再生するとBGMを視聴できるようになります。
 *
 * 準備
 * 以下の書式で「SoundTest.csv」を用意し、「/data/」以下に配置します。
 * カンマ区切りのCSV形式で、データ中にカンマは使用できません。
 * また、文字コードは「UTF-8」で保存してください。
 * 特にExcel等で編集した後は注意してください。
 *
 * 項目名      : 説明
 * fileName    : BGMのファイル名です。拡張子不要。
 * displayName : BGMリストに表示される曲名です。
 * description : ヘルプウィンドウに表示される説明です。
 *
 * なお、別プラグイン「バッチ処理プラグイン」(BatchProcessManager.js)
 * を使えば現在のBGMフォルダを解析して上記書式のひな形CSVを自動生成できます。
 *
 * 「バッチ処理プラグイン」配布先
 * https://github.com/triacontane/RPGMakerMV/blob/master/ReadMe.md
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

function Scene_SoundTest() {
    this.initialize.apply(this, arguments);
}

(function () {
    'use strict';
    var pluginName = 'SceneSoundTest';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    //=============================================================================
    // DataManager
    //  CSV読み込み処理を定義します。
    //=============================================================================
    if (!DataManager.csvFiles) {
        DataManager._dataSeparater = ',';
        DataManager.csvFiles = [];

        if (!Object.prototype.hasOwnProperty('iterate')) {
            Object.defineProperty(Object.prototype, 'iterate', {
                value : function (handler) {
                    Object.keys(this).forEach(function (key, index) {
                        handler.call(this, key, this[key], index);
                    }, this);
                }
            });
        }

        DataManager.loadCsvFiles = function() {
            this.csvFiles.forEach(function(file) {
                this._loadCsvFile(file.name, file.src);
            }.bind(this));
        };

        DataManager._loadCsvFile = function(name, src) {
            var xhr = new XMLHttpRequest();
            var url = 'data/' + src;
            xhr.open('GET', url);
            xhr.onload = function() {
                if (xhr.status < 400) {
                    window[name] = this._loadCsvData(xhr.responseText);
                }
            }.bind(this);
            xhr.onerror = function() {
                window[name] = [];
            }.bind(this);
            window[name] = null;
            xhr.send();
        };

        DataManager._loadCsvData = function(responseText) {
            var dataList = [null];
            var dataArray = responseText.replace(/\r\n?/g, '\n').split('\n');
            var columns = dataArray.shift().split(this._dataSeparater);
            dataArray.forEach(function(line) {
                if (line === '') return;
                var dataObject = {};
                dataObject.id = dataList.length;
                line.split(this._dataSeparater).iterate(function(key, data) {
                    dataObject[columns[key]] = data.replace(/^\s*\"?(.*?)\"?\s*$/, function() {
                        return arguments[1];
                    });
                }.bind(this));
                dataList[dataObject.id] = dataObject;
            }.bind(this));
            return dataList;
        };

        DataManager.isLoadedCsv = function() {
            return this.csvFiles.every(function(file) {
                return window[file.name];
            }.bind(this));
        };
    }
    DataManager.csvFiles.push({ name: '$dataSoundTest', src: 'SoundTest.csv'});

    //=============================================================================
    // StorageManager
    //  サウンドテスト設定ファイルのパス取得処理を追加定義します。
    //=============================================================================
    var _StorageManager_localFilePath = StorageManager.localFilePath;
    StorageManager.localFilePath = function(saveFileId) {
        if (saveFileId === SoundTestManager.saveId) {
            return this.localFileDirectoryPath() + 'SoundTest.rpgsave';
        } else {
            return _StorageManager_localFilePath.apply(this, arguments);
        }
    };

    var _StorageManager_webStorageKey = StorageManager.webStorageKey;
    StorageManager.webStorageKey = function(saveFileId) {
        if (saveFileId === SoundTestManager.saveId) {
            return 'RPG SoundTest';
        } else {
            return _StorageManager_webStorageKey.apply(this, arguments);
        }
    };

    //=============================================================================
    // AudioManager
    //  BGMの演奏時にプレイリストに追加します。
    //=============================================================================
    var _AudioManager_playBgm = AudioManager.playBgm;
    AudioManager.playBgm = function(bgm, pos) {
        _AudioManager_playBgm.apply(this, arguments);
        if ($gameSoundTest.addPlayList(bgm)) SoundTestManager.saveGame();
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
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

    Game_Interpreter.prototype.pluginCommandSceneSoundTest = function (command, args) {
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
    var _Scene_Boot_create = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _Scene_Boot_create.apply(this, arguments);
        DataManager.loadCsvFiles();
        if (!SoundTestManager.loadGame()) {
            SoundTestManager.makeGame();
        }
    };

    var _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        return _Scene_Boot_isReady.apply(this, arguments) && DataManager.isLoadedCsv();
    };

    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        SoundTestManager.saveGame();
    };

    //=============================================================================
    // Scene_Title
    //  サウンドテスト画面の呼び出しを追加します。
    //=============================================================================
    var _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.apply(this, arguments);
        if ($gameSoundTest.titleCommandVisible)
            this._commandWindow.setHandler('soundTest',  this.commandSoundTest.bind(this));
    };

    Scene_Title.prototype.commandSoundTest = function() {
        this._commandWindow.close();
        SceneManager.push(Scene_SoundTest);
    };

    //=============================================================================
    // Scene_Menu
    //  サウンドテスト画面の呼び出しを追加します。
    //=============================================================================
    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
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
    var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.apply(this, arguments);
        if ($gameSoundTest.titleCommandVisible)
            this.addCommand(getParamString(['コマンド名称','CommandName']), 'soundTest');
    };

    var _Window_TitleCommand_updatePlacement = Window_TitleCommand.prototype.updatePlacement;
    Window_TitleCommand.prototype.updatePlacement = function() {
        _Window_TitleCommand_updatePlacement.apply(this, arguments);
        if ($gameSoundTest.titleCommandVisible) this.y += this.height / 8;
    };

    //=============================================================================
    // Window_MenuCommand
    //  サウンドテスト画面の呼び出しの選択肢を追加定義します。
    //=============================================================================
    var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.apply(this, arguments);
        var enabled = this.isSoundTestEnabled();
        if ($gameSoundTest.menuCommandVisible)
            this.addCommand(getParamString(['コマンド名称','CommandName']), 'soundTest', enabled);
    };

    Window_MenuCommand.prototype.isSoundTestEnabled = function() {
        return true;
    };

    //=============================================================================
    // Scene_SoundTest
    //  サウンドテスト画面を扱うクラスです。
    //=============================================================================
    Scene_SoundTest.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_SoundTest.prototype.constructor = Scene_SoundTest;

    Scene_SoundTest.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        $gameSoundTest.refresh();
        this._backgroundLoading = false;
    };

    Scene_SoundTest.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createBgmListWindow();
        this.createBgmSettingWindow();
    };

    var _Scene_SoundTest_createBackground = Scene_SoundTest.prototype.createBackground;
    Scene_SoundTest.prototype.createBackground = function() {
        var background = getParamString(['背景ピクチャ', 'BackPicture']);
        if (background) {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = ImageManager.loadPicture(background ,0);
            this.addChild(this._backgroundSprite);
            this._backgroundLoading = true;
        } else {
            _Scene_SoundTest_createBackground.apply(this, arguments);
        }
    };

    var _Scene_SoundTest_update = Scene_SoundTest.prototype.update;
    Scene_SoundTest.prototype.update = function() {
        _Scene_SoundTest_update.apply(this, arguments);
        if (this._backgroundLoading && this._backgroundSprite.bitmap.isReady()) {
            this._backgroundSprite.scale.x = Graphics.boxWidth / this._backgroundSprite.width;
            this._backgroundSprite.scale.y = Graphics.boxHeight / this._backgroundSprite.height;
            this._backgroundLoading = false;
        }
    };

    Scene_SoundTest.prototype.createBgmListWindow = function() {
        var wy = this._helpWindow.height;
        var wh = Graphics.boxHeight - wy;
        this._bgmListWindow = new Window_BgmList(0, wy, 320, wh);
        this._bgmListWindow.setHelpWindow(this._helpWindow);
        this._bgmListWindow.setHandler('ok',     this.playAudio.bind(this));
        this._bgmListWindow.setHandler('cancel', this.escapeScene.bind(this));
        this._bgmListWindow.setHandler('shift',  this.stopAudio.bind(this));
        this._bgmListWindow.setHandler('touchInside', this.activateBgmList.bind(this));
        this._bgmListWindow.activate();
        this.addWindow(this._bgmListWindow);
    };

    Scene_SoundTest.prototype.createBgmSettingWindow = function() {
        this._bgmSettingWindow = new Window_BgmSetting(this._bgmListWindow.width, this._helpWindow.height);
        this._bgmSettingWindow.setHandler('cancel', this.activateBgmList.bind(this));
        this._bgmSettingWindow.setHandler('touchInside', this.activateBgmSetting.bind(this));
        this._bgmSettingWindow.deactivate();
        this.addWindow(this._bgmSettingWindow);
        if (SoundTestManager.isSettingEmpty()) this._bgmSettingWindow.hide();
    };

    Scene_SoundTest.prototype.playAudio = function() {
        if (this._bgmListWindow.isCurrentItemEnabled()) {
            $gameSoundTest.setNameAndPlay(this._bgmListWindow.item().fileName);
            this.activateBgmSetting();
        }
    };

    Scene_SoundTest.prototype.stopAudio = function() {
        if (this._bgmListWindow.isCurrentItemEnabled()) {
            $gameSoundTest.setNameAndPlay('');
        }
    };

    Scene_SoundTest.prototype.escapeScene = function() {
        $gameSoundTest.restoreAudio();
        this.popScene();
    };

    Scene_SoundTest.prototype.activateBgmSetting = function() {
        if (SoundTestManager.isSettingEmpty()) return;
        this._bgmListWindow.deactivate();
        this._bgmSettingWindow.activate();
        this._bgmSettingWindow.select(0);
    };

    Scene_SoundTest.prototype.activateBgmList = function() {
        this._bgmSettingWindow.deselect();
        this._bgmSettingWindow.deactivate();
        this._bgmListWindow.activate();
    };

    //=============================================================================
    // Window_Selectable
    //  サウンドテスト画面のウィンドウ共通処理です。
    //=============================================================================
    var _Window_Selectable_processTouch = Window_Selectable.prototype.processTouch;
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
        }
    };

    Window_Selectable.prototype.processShift = function() {
        this.callHandler('shift');
    };

    var _Window_Selectable_processHandling = Window_Selectable.prototype.processHandling;
    Window_Selectable.prototype.processHandling = function() {
        _Window_Selectable_processHandling.apply(this, arguments);
        if (!this._soundTestWindow)return;
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

    //=============================================================================
    // Window_BgmList
    //  BGMリストウィンドウです。
    //=============================================================================
    function Window_BgmList() {
        this.initialize.apply(this, arguments);
        this._soundTestWindow = true;
    }

    Window_BgmList.prototype = Object.create(Window_Selectable.prototype);
    Window_BgmList.prototype.constructor = Window_BgmList;

    Window_BgmList.prototype.initialize = function(x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._data = [];
        this.refresh();
        this.select(0);
    };

    Window_BgmList.prototype.maxCols = function() {
        return 1;
    };

    Window_BgmList.prototype.spacing = function() {
        return 0;
    };

    Window_BgmList.prototype.maxItems = function() {
        return this._data ? this._data.length : 1;
    };

    Window_BgmList.prototype.item = function() {
        var index = this.index();
        return this._data && index >= 0 ? this._data[index] : null;
    };

    Window_BgmList.prototype.isEnabled = function(item) {
        return item ? $gameSoundTest.isPlayAlready(item.fileName) : false;
    };

    Window_BgmList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this._data[this.index()]);
    };

    Window_BgmList.prototype.makeItemList = function() {
        this._data = $dataSoundTest.filter(function(item) {
            return item != null;
        }, this);
    };

    Window_BgmList.prototype.drawItem = function(index) {
        var item = this._data[index];
        if (item) {
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    Window_BgmList.prototype.drawItemName = function(item, x, y, width) {
        this.resetTextColor();
        this.drawText(this.isEnabled(item) ? item.displayName : '？？？', x, y, width);
    };

    Window_BgmList.prototype.updateHelp = function() {
        var item = this.item();
        this._helpWindow.setText(item ? this.getDescription(item) : '');
    };

    Window_BgmList.prototype.getDescription = function(item) {
        return this.isEnabled(item) ? '【' + item.displayName + '】\n' + item.description : '？？？';
    };

    Window_BgmList.prototype.refresh = function() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    //=============================================================================
    // Window_BgmSetting
    //  BGM設定ウィンドウです。
    //=============================================================================
    function Window_BgmSetting() {
        this.initialize.apply(this, arguments);
    }

    Window_BgmSetting.prototype = Object.create(Window_Command.prototype);
    Window_BgmSetting.prototype.constructor = Window_BgmSetting;

    Window_BgmSetting.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
        this._soundTestWindow = true;
        this.deselect();
    };

    Window_BgmSetting.prototype.windowWidth = function() {
        return 360;
    };

    Window_BgmSetting.prototype.windowHeight = function() {
        return this.fittingHeight(this.maxRows());
    };

    Window_BgmSetting.prototype.lineHeight = function() {
        return 42;
    };

    Window_BgmSetting.prototype.makeCommandList = function() {
        var volume = SoundTestManager.settingNameValues.volume;
        if (volume !== '') this.addCommand(volume, 'volume');
        var pitch  = SoundTestManager.settingNameValues.pitch;
        if (pitch  !== '') this.addCommand(pitch , 'pitch');
        var pan    = SoundTestManager.settingNameValues.pan;
        if (pan    !== '') this.addCommand(pan   , 'pan');
    };

    Window_BgmSetting.prototype.drawItem = function(index) {
        this.resetTextColor();
        var rect = this.itemRectForText(index);
        var statusWidth = this.statusWidth();
        var titleWidth = rect.width - statusWidth;
        var symbol = this.commandSymbol(index);
        var value  = this.getSettingValue(symbol);
        var unit    = SoundTestManager.settingUnitValues[symbol];
        this.drawItemGauge(index);
        this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
        this.drawText(value + unit, titleWidth, rect.y, statusWidth, 'right');
    };

    Window_BgmSetting.prototype.drawItemGauge = function(index) {
        var rect = this.itemRectForText(index);
        var symbol = this.commandSymbol(index);
        var value  = this.getSettingValue(symbol);
        var min    = SoundTestManager.settingMinValues[symbol];
        var max    = SoundTestManager.settingMaxValues[symbol];
        var rate   = (value - min) / (max - min);
        var color1 = this.mpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        this.drawGauge(rect.x, rect.y, rect.width, rate, color1, color2);
    };

    Window_BgmSetting.prototype.statusWidth = function() {
        return 120;
    };

    var _Window_BgmSetting_cursorRight = Window_BgmSetting.prototype.cursorRight;
    Window_BgmSetting.prototype.cursorRight = function(wrap) {
        _Window_BgmSetting_cursorRight.apply(this, arguments);
        this._shiftValue(this.valueOffset(), Input.isTriggered('right'));
    };

    var _Window_BgmSetting_cursorLeft = Window_BgmSetting.prototype.cursorLeft;
    Window_BgmSetting.prototype.cursorLeft = function(wrap) {
        _Window_BgmSetting_cursorLeft.apply(this, arguments);
        this._shiftValue(-this.valueOffset(), Input.isTriggered('left'));
    };

    Window_BgmSetting.prototype.processOk = function() {
        this._shiftValue(this.valueOffset(), Input.isTriggered('ok') || TouchInput.isTriggered('ok'));
    };

    Window_BgmSetting.prototype._shiftValue = function(offset, loopFlg) {
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

    Window_BgmSetting.prototype.valueOffset = function() {
        return 10;
    };

    Window_BgmSetting.prototype.changeValue = function(symbol, value) {
        var lastValue = this.getSettingValue(symbol);
        if (lastValue !== value) {
            $gameSoundTest.setBgmPropertyAndPlay(symbol, value);
            this.redrawItem(this.findSymbol(symbol));
            SoundManager.playCursor();
        }
    };

    Window_BgmSetting.prototype.getSettingValue = function(symbol) {
        return $gameSoundTest.getBgmProperty(symbol);
    };

    var paramVolume = getParamString(['音量名称','NameVolume']);
    var paramPitch  = getParamString(['ピッチ名称','NamePitch']);
    var paramPan    = getParamString(['位相名称','NamePan']);
    //=============================================================================
    // SoundTestManager
    //  サウンドテスト設定ファイルのセーブとロードを定義します。
    //=============================================================================
    function SoundTestManager() {
        throw new Error('This is a static class');
    }
    SoundTestManager.saveId  = -5684;
    SoundTestManager.settingNameValues = {volume : paramVolume, pitch : paramPitch,  pan : paramPan};
    SoundTestManager.settingMinValues  = {volume : 0,   pitch : 50,  pan : -100};
    SoundTestManager.settingMaxValues  = {volume : 100, pitch : 150, pan :  100};
    SoundTestManager.settingUnitValues = {volume : '%', pitch : '%', pan :  ''};

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

    //=============================================================================
    // Game_SoundTest
    //  サウンドテスト情報を保持するクラスです。
    //  $gameSoundTestとして作成され、専用のセーブファイルに保存されます。
    //=============================================================================
    Game_SoundTest.prototype.initialize = function () {
        this.titleCommandVisible = getParamBoolean(['タイトルに追加','AddCommandTitle']);
        this.menuCommandVisible  = getParamBoolean(['メニューに追加','AddCommandMenu']);
        this._playedList = {};
        this._prevBgm = null;
        this._prevBgs = null;
        this._playingBgm = null;
        this.resetPlayingBgm();
    };

    Game_SoundTest.prototype.refresh = function () {
        this.saveAudio();
        this.resetPlayingBgm();
        AudioManager.stopAll();
    };

    Game_SoundTest.prototype.addPlayList = function (bgm) {
        if (this._playedList[bgm.name] == null) {
            this._playedList[bgm.name] = bgm.pitch;
            return true;
        }
        return false;
    };

    Game_SoundTest.prototype.addPlayListAll = function () {
        $dataSoundTest.forEach(function(data) {
            if (data) this.addPlayList({name:data.fileName, volume:90, pitch:100, pan:0});
        }.bind(this));
    };

    Game_SoundTest.prototype.isPlayAlready = function (bgmName) {
        return !!this._playedList[bgmName];
    };

    Game_SoundTest.prototype.setNameAndPlay = function(bgmName) {
        this._playingBgm.name = bgmName;
        if (SoundTestManager.settingNameValues.pitch === '') {
            this._playingBgm.pitch = this._playedList[bgmName];
        }
        this.play();
    };

    Game_SoundTest.prototype.setBgmPropertyAndPlay = function(symbol, value) {
        this._playingBgm[symbol] = value;
        this.play();
    };

    Game_SoundTest.prototype.getBgmProperty = function(symbol) {
        return this._playingBgm[symbol];
    };

    Game_SoundTest.prototype.play = function() {
        AudioManager.playBgm(this._playingBgm);
    };

    Game_SoundTest.prototype.resetPlayingBgm = function() {
        this._playingBgm = {name:'', pan:0, pitch:100, volume:90};
    };

    Game_SoundTest.prototype.saveAudio = function() {
        this._prevBgm = AudioManager.saveBgm();
        this._prevBgs = AudioManager.saveBgs();
    };

    Game_SoundTest.prototype.restoreAudio = function() {
        AudioManager.replayBgm(this._prevBgm);
        AudioManager.replayBgs(this._prevBgs);
    };
})();



