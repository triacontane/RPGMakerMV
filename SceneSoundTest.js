//=============================================================================
// SceneSoundTest.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.6.0 2024/03/24 オーディオごとにジャケット画像を表示できる機能を追加
// 2.5.0 2024/03/23 オーディオごとにデフォルトの音量、ピッチ、左右バランスを設定できる機能を追加
// 2.4.0 2023/09/17 リストウィンドウとオプションウィンドウとの切り替えをタッチ操作でできる機能を追加
// 2.3.1 2022/10/31 曲を選択していない状態でピッチなどを変更しようとするとエラーになる問題を修正
// 2.3.0 2022/10/30 ピッチと左右バランスのオプション項目について、パラメータを空にすると項目も消去されるよう修正
// 2.2.1 2022/08/19 サブフォルダに配置したオーディオが演奏できない問題を修正
// 2.2.0 2022/07/18 シークバーを非表示にできる機能を追加
// 2.1.0 2022/02/14 ヘルプウィンドウの表示内容を改行できるよう修正
//                  バー表示の上の曲名表記がファイル名になっていた問題を修正
// 2.0.0 2022/02/11 MZ用に新規で作り直し
// 1.0.0 2016/01/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc サウンドテストプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SceneSoundTest.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param categoryList
 * @text カテゴリリスト
 * @desc オーディオカテゴリの一覧です。登録件数を1件だけにするとカテゴリウィンドウは非表示になります。
 * @default []
 * @type struct<CATEGORY>[]
 *
 * @param categoryCols
 * @text カテゴリ列数
 * @desc カテゴリウィンドウの列数です。
 * @default 4
 * @type number
 *
 * @param description
 * @text 説明
 * @desc カテゴリウィンドウを選択中にヘルプウィンドウに表示される説明です。
 * @default
 * @type multiline_string
 *
 * @param commandName
 * @text コマンド名称
 * @desc タイトルやメニュー画面に表示されるコマンド名です。
 * @default サウンドテスト
 *
 * @param titleAdd
 * @text タイトルに追加
 * @desc タイトル画面にサウンドテストを追加します。無効にした場合もコマンドで後から有効にできます。全セーブデータ共通
 * @default true
 * @type boolean
 *
 * @param menuAddSwitch
 * @text メニュー追加スイッチ
 * @desc 指定した番号のスイッチがONのとき、メニュー画面にサウンドテストが追加されます。0にすると最初から追加されます。
 * @default 0
 * @type switch
 *
 * @param listWidth
 * @text リスト横幅
 * @desc 楽曲リストウィンドウの横幅です。
 * @default 320
 * @type number
 *
 * @param volume
 * @text 音量名称
 * @desc BGMの設定項目「音量」のゲーム内での名称です。
 * @default Volume
 *
 * @param pitch
 * @text ピッチ名称
 * @desc BGMの設定項目「ピッチ」のゲーム内での名称です。空欄にすると設定項目自体がなくなります。
 * @default Pitch
 *
 * @param pan
 * @text 位相名称
 * @desc BGMの設定項目「位相」のゲーム内での名称です。空欄にすると設定項目自体がなくなります。
 * @default Pan
 *
 * @param backImage
 * @text 背景画像
 * @desc サウンドテストの背景に表示する画像を選択します。
 * @default
 * @dir img/parallaxes
 * @type file
 *
 * @param autoRegister
 * @text 自動登録
 * @desc ゲーム中に演奏されたオーディオを自動登録します。
 * @default true
 * @type boolean
 *
 * @param unregisteredText
 * @text 未登録テキスト
 * @desc 未登録で演奏できない項目に代わりに表示するテキストです。
 * @default ？？？
 *
 * @param HiddenSeekBar
 * @text シークバー非表示
 * @desc 再生時間を表示するシークバーを隠します。
 * @default false
 * @type boolean
 *
 * @param ToggleOnTouch
 * @text タッチでウィンドウ切り替え
 * @desc タッチ操作でリストウィンドウとオプションウィンドウを切り替えます。
 * @default false
 * @type boolean
 *
 * @param audioAlign
 * @text オーディオ情報揃え
 * @desc オーディオ情報(曲名＋ジャケット)の揃えです。
 * @default left
 * @type select
 * @option left
 * @option center
 * @option right
 *
 * @param jacketWidth
 * @text ジャケット横幅
 * @desc ジャケット画像の横幅です。
 * @default 0
 * @type number
 *
 * @param jacketHeight
 * @text ジャケット高さ
 * @desc ジャケット画像の高さです。
 * @default 0
 * @type number
 *
 * @command OPEN
 * @text サウンドテスト画面を開く
 * @desc サウンドテスト画面を開きます。
 *
 * @command ENABLE
 * @text 有効化
 * @desc タイトル画面でサウンドテストの項目を有効化します。
 *
 * @help SceneSoundTest.js
 *
 * ゲーム中のオーディオを視聴できるサウンドテスト画面を実装します。
 * タイトル画面、メニュー画面およびプラグインコマンドから専用画面に遷移します。
 * 楽曲はパラメータで指定した条件を満たすと演奏可能になります。
 * 一度演奏可能になった楽曲を元に戻すことはできません。
 *
 * ボリュームやピッチを変更したいときは、リスト内でPageDownボタンを押下します。
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

/*~struct~CATEGORY:
 *
 * @param name
 * @text カテゴリ名称
 * @desc カテゴリウィンドウに表示されるカテゴリ名称です。
 * @default
 *
 * @param audioList
 * @text オーディオリスト
 * @desc リストウィンドウに表示される曲の一覧です。
 * @default []
 * @type struct<AUDIO>[]
 *
 */

/*~struct~AUDIO:
 *
 * @param audioFile
 * @text オーディオファイル
 * @desc 演奏するオーディオファイルのパスです。ダイアログから選択します。
 * @default
 * @type file
 * @dir audio
 *
 * @param name
 * @text 曲名
 * @desc 画面に表示される曲名です。空にするとオーディオファイル名が表示されます。
 * @default
 *
 * @param description
 * @text 説明
 * @desc ヘルプウィンドウに表示される曲の説明です。
 * @default
 * @type multiline_string
 *
 * @param condSwitch
 * @text 登録条件(スイッチ)
 * @desc 指定したスイッチがONになると曲が登録されます。本パラメータ設定前にすでにスイッチがONになっていた場合は無効です。
 * @default 0
 * @type switch
 *
 * @param defaultRegistered
 * @text デフォルトで登録済み
 * @desc 最初から登録済みで演奏可能な状態になります。
 * @default false
 * @type boolean
 *
 * @param volume
 * @text 音量
 * @desc 演奏時のデフォルト音量です。指定がなければ、もともと演奏していた音量が引き継がれます。
 * @default
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc 演奏時のデフォルトピッチです。指定がなければ、もともと演奏していたピッチが引き継がれます。
 * @default
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 位相(左右バランス)
 * @desc 演奏時のデフォルト位相です。指定がなければ、もともと演奏していた位相が引き継がれます。
 * @default
 * @type number
 * @min -100
 * @max 100
 *
 * @param jacket
 * @text ジャケット画像
 * @desc ジャケット画像です。使用する場合、パラメータのジャケットサイズを別途指定してください。
 * @default
 * @type file
 * @dir img/pictures
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.categoryList) {
        param.categoryList = [];
    }

    PluginManagerEx.registerCommand(script, 'OPEN', args => {
        SceneManager.push(Scene_SoundTest);
    });

    PluginManagerEx.registerCommand(script, 'ENABLE', args => {
        soundTestIo.enableTitle();
    });

    /**
     * SoundTestファイルのIOを扱います
     */
    class SoundTestIo {
        makeData() {
            const data = {}
            data.audioAchievement = this._audioAchievement;
            data.titleAdd = this._titleAdd;
            return data;
        }

        applyData(data) {
            if (data.audioAchievement) {
                this._audioAchievement = data.audioAchievement;
            } else {
                this._audioAchievement = [];
            }
            this._titleAdd = data.titleAdd || false;
        }

        isTitleValid() {
            return this._titleAdd || param.titleAdd;
        }

        isMenuValid() {
            return !param.menuAddSwitch || $gameSwitches.value(param.menuAddSwitch);
        }

        enableTitle() {
            this._titleAdd = true;
            this.save();
        }

        save() {
            StorageManager.saveObject(this._getFileSymbol(), this.makeData());
        }

        load() {
            this.applyData({});
            StorageManager.loadObject(this._getFileSymbol())
                .then(data => this.applyData(data || {}))
                .catch(() => 0)
                .then(() => {
                    this._isLoaded = true;
                    return 0;
                })
                .catch(() => 0);
        }

        _getFileSymbol() {
            return 'soundTest';
        }

        isLoaded() {
            return this._isLoaded;
        }

        registerBySwitch(switchId) {
            this.iterateAudio(audio => {
                if (audio.condSwitch === switchId) {
                    this.addAudioAchievement(audio.audioFile);
                }
            });
        }

        registerByPlay(type, name) {
            if (!param.autoRegister) {
                return;
            }
            const file = `${type}/${name}`;
            this.iterateAudio(audio => {
                if (audio.audioFile === file) {
                    this.addAudioAchievement(audio.audioFile);
                }
            });
        }

        iterateAudio(callBack) {
            param.categoryList.forEach(category => {
                if (category.audioList) {
                    category.audioList.forEach(audio => callBack.call(this, audio))
                }
            })
        }

        addAudioAchievement(path) {
            if (!this.hasAudioAchievement(path)) {
                this._audioAchievement.push(path);
                this.save();
            }
        }

        hasAudioAchievement(path) {
            return this._audioAchievement.includes(path);
        }
    }
    const soundTestIo = new SoundTestIo();

    const _Scene_Boot_loadPlayerData = Scene_Boot.prototype.loadPlayerData;
    Scene_Boot.prototype.loadPlayerData = function() {
        _Scene_Boot_loadPlayerData.apply(this, arguments);
        soundTestIo.load();
    };

    const _Scene_Boot_isPlayerDataLoaded = Scene_Boot.prototype.isPlayerDataLoaded;
    Scene_Boot.prototype.isPlayerDataLoaded = function() {
        return _Scene_Boot_isPlayerDataLoaded.apply(this, arguments) && soundTestIo.isLoaded();
    };

    const _Scene_Title_createCommandWindow    = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);
        if (soundTestIo.isTitleValid()) {
            this._commandWindow.setHandler("soundTest", this.commandSoundTest.bind(this));
        }
    };

    Scene_Title.prototype.commandSoundTest = function() {
        this._commandWindow.close();
        SceneManager.push(Scene_SoundTest);
    };

    const _Window_TitleCommand_makeCommandList    = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.call(this);
        if (soundTestIo.isTitleValid()) {
            this.addCommand(param.commandName, 'soundTest');
            this.height = this.fittingHeight(this._list.length);
            this.createContents();
            this.updatePlacement();
        }
    };

    Window_TitleCommand.prototype.updatePlacement = function() {
        const addSize = this._list.length - 3;
        if (addSize > 0) {
            this.y -= addSize * this.itemHeight() / 2;
        }
    };

    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.apply(this, arguments);
        if (soundTestIo.isMenuValid()) {
            this._commandWindow.setHandler("soundTest", this.commandSoundTest.bind(this));
        }
    };

    Scene_Menu.prototype.commandSoundTest = function() {
        SceneManager.push(Scene_SoundTest);
    };

    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.apply(this, arguments);
        if (soundTestIo.isMenuValid()) {
            this.addCommand(param.commandName, 'soundTest');
        }
    };

    /**
     * Scene_SoundTest
     */
    class Scene_SoundTest extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();
            if (this.isUseCategory()) {
                this.createCategoryWindow();
            }
            this.createListWindow();
            this.createOptionWindow();
            this.createAudioWindow();
        }

        update() {
            super.update();
            if (TouchInput.isTriggered() && param.ToggleOnTouch) {
                this.updateTouch();
            }
        }

        updateTouch() {
            if (this._optionWindow.hitIndex() >= 0) {
                this.onPageDown();
            }
            if (this._listWindow.hitIndex() >= 0) {
                this.onPageUp();
            }
        }

        needsPageButtons() {
            return true;
        }

        createPageButtons() {
            super.createPageButtons();
            this._pageupButton.setClickHandler(this.onPageUp.bind(this));
            this._pagedownButton.setClickHandler(this.onPageDown.bind(this));
        }

        start() {
            super.start();
            this._audioPath = '';
            BattleManager.saveBgmAndBgs();
            AudioManager.stopBgm();
            AudioManager.stopBgs();
        }

        terminate() {
            super.terminate();
            BattleManager.replayBgmAndBgs();
        }

        createBackground() {
            if (param.backImage) {
                this._panorama = new TilingSprite();
                this._panorama.move(0, 0, Graphics.width, Graphics.height);
                this._panorama.bitmap = ImageManager.loadParallax(param.backImage);
                this.addChild(this._panorama);
            } else {
                super.createBackground();
            }
        }

        createCategoryWindow() {
            this._categoryWindow = new Window_SoundCategory(this.categoryWindowRect());
            this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
            this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
            this._categoryWindow.setHelpWindow(this._helpWindow);
            this._categoryWindow.activate();
            this.addWindow(this._categoryWindow);
        }

        onCategoryOk() {
            this._categoryWindow.deactivate();
            this.setupList(this._categoryWindow.index());
        }

        categoryWindowRect() {
            const wx = 0;
            const wy = this.mainAreaTop();
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(Math.ceil(param.categoryList.length / param.categoryCols), true);
            return new Rectangle(wx, wy, ww, wh);
        }

        setupList(category) {
            this._listWindow.setCategory(category);
            if (category !== null) {
                this._listWindow.select(0);
                this._listWindow.activate();
            } else {
                this._listWindow.select(-1);
                this._listWindow.deactivate();
            }
        }

        createListWindow() {
            this._listWindow = new Window_SoundList(this.listWindowRect());
            this._listWindow.setHandler("ok", this.onListOk.bind(this));
            this._listWindow.setHandler("cancel", this.onListCancel.bind(this));
            this._listWindow.setHandler("pagedown", this.onPageDown.bind(this, true));
            this._listWindow.setHelpWindow(this._helpWindow);
            if (!this._categoryWindow) {
                this.setupList(0);
            }
            this.addWindow(this._listWindow);
        }

        onListOk() {
            this._audioPath = this._listWindow.findFilePath();
            this._audioName  = this._listWindow.findItemText();
            this._listWindow.activate();
            this.setOptionValues();
            this.play();
        }

        setOptionValues() {
            const audio = this._optionWindow.getAudio();
            const item = this._listWindow.item();
            if (item.volume) {
                audio.volume = item.volume;
            }
            if (item.pitch) {
                audio.pitch = item.pitch;
            }
            if (item.pan) {
                audio.pan = item.pan;
            }
            this._optionWindow.refresh();
        }

        onListCancel() {
            if (this._categoryWindow) {
                this._categoryWindow.activate();
                this.setupList(null);
            } else {
                this.popScene();
            }
        }

        onPageDown(force = false) {
            if (force || this._listWindow.active) {
                SoundManager.playCursor();
                this._optionWindow.activate();
                this._listWindow.deactivate();
            }
        }

        onPageUp(force = false) {
            if (force || this._optionWindow.active) {
                SoundManager.playCursor();
                this.onOptionCancel();
            }
        }

        listWindowRect() {
            const wx = 0;
            const wy = this._categoryWindow ? this._categoryWindow.y + this._categoryWindow.height : this.mainAreaTop();
            const ww = param.listWidth;
            const wh = this.mainAreaHeight() - (this._categoryWindow ? this._categoryWindow.height : 0);
            return new Rectangle(wx, wy, ww, wh);
        }

        createOptionWindow() {
            this._optionWindow = new Window_AudioConfig(this.optionWindowRect());
            this._optionWindow.setHandler("cancel", this.onOptionCancel.bind(this));
            this._optionWindow.setHandler("pageup", this.onPageUp.bind(this, true));
            this._optionWindow.setHandler("change", this.play.bind(this));
            this._optionWindow.deactivate();
            this.addWindow(this._optionWindow);
        }

        onOptionCancel() {
            this._listWindow.activate();
            this._optionWindow.deactivate();
        }

        optionWindowRect() {
            const wx = param.listWidth;
            const wy = this._listWindow.y;
            const ww = Graphics.boxWidth - param.listWidth;
            const wh = this.calcWindowHeight(this.optionWindowLines(), true);
            return new Rectangle(wx, wy, ww, wh);
        }

        optionWindowLines() {
            let lines = 1;
            if (param.pitch) {
                lines++;
            }
            if (param.pan) {
                lines++;
            }
            return lines;
        }

        createAudioWindow() {
            this._audioWindow = new Window_Audio(this.audioWindowRect());
            this.addWindow(this._audioWindow);
        }

        audioWindowRect() {
            const wx = this._optionWindow.x;
            const wy = this._optionWindow.y + this._optionWindow.height;
            const ww = this._optionWindow.width;
            let wh = this.calcWindowHeight(param.HiddenSeekBar ? 1 : 2, false);
            if (param.jacketHeight > 0) {
                wh += param.jacketHeight;
            }
            return new Rectangle(wx, wy, ww, wh);
        }

        play() {
            if (!this._audioPath) {
                return;
            }
            const audio = this._optionWindow.getAudio();
            audio.name = this._audioPath.slice(1).join('/');
            audio.type = this._audioPath[0];
            const buffer = AudioManager.playForSoundTest(audio);
            this._audioWindow.setup(buffer, this._audioName, this._listWindow.item().jacket);
        }

        isUseCategory() {
            return param.categoryList.length > 1;
        }
    }
    window.Scene_SoundTest = Scene_SoundTest;

    /**
     * Window_SoundList
     */
    class Window_SoundList extends Window_ItemList {
        constructor(rectangle) {
            super(rectangle);
            this._category = null;
        }

        maxCols() {
            return 1;
        }

        makeItemList() {
            const categoryData = param.categoryList[this._category];
            if (categoryData) {
                this._data = categoryData.audioList || [];
            } else {
                this._data = [];
            }
        }

        drawItem(index) {
            const rect = this.itemLineRect(index);
            const item = this.itemAt(index);
            if (item) {
                this.changePaintOpacity(this.isEnabled(item));
                this.drawText(this.findItemText(index), rect.x, rect.y, rect.width);
            }
        }

        findItemText(index = this.index()) {
            const item = this.itemAt(index);
            return this.isEnabled(item) ? item.name || this.findFileName(index) : param.unregisteredText;
        }

        findFilePath(index = this.index()) {
            const item = this.itemAt(index);
            return item ? item.audioFile.split('/') : [];
        }

        findFileName(index = this.index()) {
            const path = this.findFilePath(index);
            return path[path.length - 1] || '';
        }

        isEnabled(item) {
            if (!item) {
                return false;
            } else if (item.defaultRegistered) {
                return true;
            } else if (item.condSwitch || param.autoRegister) {
                return soundTestIo.hasAudioAchievement(item.audioFile);
            } else {
                return true;
            }
        }

        updateHelp() {
            if (this.isCurrentItemEnabled()) {
                super.updateHelp();
            } else {
                this._helpWindow.setText(param.unregisteredText);
            }
        }
    }

    /**
     * Window_SoundCategory
     */
    class Window_SoundCategory extends Window_HorzCommand {
        constructor(rectangle) {
            super(rectangle);
        }

        maxCols() {
            return param.categoryCols;
        }

        makeCommandList() {
            param.categoryList.forEach((category, index) => this.addCommand(category.name, `category:${index}`));
        }

        updateHelp() {
            this._helpWindow.setText(param.description);
        }
    }

    /**
     * Window_AudioConfig
     */
    class Window_AudioConfig extends Window_Options {
        constructor(rectangle) {
            super(rectangle);
        }

        findMin(symbol) {
            const min = {
                volume: 0, pitch: 50, pan: -100
            }
            return min[symbol];
        }

        findMax(symbol) {
            const max = {
                volume: 100, pitch: 150, pan: 100
            }
            return max[symbol];
        }

        makeCommandList() {
            if (!this._audio) {
                this._audio = {
                    name: '', volume: 90, pitch: 100, pan: 0
                }
            }
            this.addCommand(param.volume, 'volume');
            if (param.pitch) {
                this.addCommand(param.pitch, 'pitch');
            }
            if (param.pan) {
                this.addCommand(param.pan, 'pan');
            }
        }

        changeVolume(symbol, forward, wrap) {
            const lastValue = this.getConfigValue(symbol);
            const offset = this.volumeOffset();
            const value = lastValue + (forward ? offset : -offset);
            const min = this.findMin(symbol);
            const max = this.findMax(symbol);
            if (value > max && wrap) {
                this.changeValue(symbol, min);
            } else {
                this.changeValue(symbol, value.clamp(min, max));
            }
        }

        getAudio() {
            return this._audio;
        }

        isVolumeSymbol() {
            return true;
        }

        volumeOffset() {
            return 10;
        }

        getConfigValue(symbol) {
            return this._audio[symbol];
        }

        setConfigValue(symbol, value) {
            this._audio[symbol] = value;
            this.callHandler('change');
        }
    }

    /**
     * Window_Audio
     */
    class Window_Audio extends Window_StatusBase {
        constructor(rectangle) {
            super(rectangle);
            this.setup(null, '');
        }

        setup(webAudio, name, jacket) {
            this._audioName = name;
            this._jacket = jacket;
            if (!param.HiddenSeekBar) {
                this.placeSeekGauge(webAudio, 0, this.lineHeight());
            }
            this.refresh();
        }

        placeSeekGauge(webAudio, x, y) {
            const sprite = this.createInnerSprite('key', Sprite_AudioSeek);
            sprite.setup(webAudio);
            sprite.move(x, y);
            sprite.show();
            this._seekSprite = sprite;
        }

        refresh() {
            this.contents.clear();
            this.drawText(this._audioName, 0, 0, this.innerWidth, param.audioAlign || 'left');
            if (this._jacket) {
                this.drawJacket();
            }
        }

        drawJacket() {
            const bitmap = ImageManager.loadPicture(this._jacket);
            const position = this.findJacketPosition();
            bitmap.addLoadListener(() => {
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height,
                    position.x, position.y, param.jacketWidth, param.jacketHeight);
            });
        }

        findJacketPosition() {
            const position = {
                x: 0, y: 0
            }
            if (param.audioAlign === 'right') {
                position.x = this.innerWidth - param.jacketWidth;
            } else if (param.audioAlign === 'center') {
                position.x = (this.innerWidth - param.jacketWidth) / 2;
            }
            position.y = this.lineHeight() + (this._seekSprite ? this._seekSprite.height : 0);
            return position;
        }
    }

    /**
     * Sprite_AudioSeek
     */
    class Sprite_AudioSeek extends Sprite_Gauge {
        setup(webAudio) {
            super.setup(null, 'time');
            this._webAudio = webAudio;
        }

        currentValue() {
            if (!this._webAudio) {
                return 0;
            } else {
                return WebAudio._currentTime() - this._webAudio._startTime;
            }
        }

        smoothness() {
            return 1;
        }

        currentMaxValue() {
            if (!this._webAudio) {
                return 1;
            } else {
                return this._webAudio._totalTime / this._webAudio._pitch;
            }
        }

        isValid() {
            return !!this._webAudio && !!this._webAudio._totalTime;
        }

        bitmapWidth() {
            return Graphics.boxWidth - param.listWidth - 16;
        }

        updateFlashing() {}
    }

    const _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
        _Game_Switches_setValue.apply(this, arguments);
        soundTestIo.registerBySwitch(switchId);
    };

    const AUDIO_TYPE = {
        BGM: 'bgm',
        BGS: 'bgs',
        ME: 'me',
        SE: 'se'
    }

    AudioManager.playForSoundTest = function(audio) {
        const path = `${audio.type}/${audio.name}`;
        if (this._prevSoundTest !== path) {
            this.stopAll();
        }
        let buffer = null;
        switch (audio.type) {
            case AUDIO_TYPE.BGM:
                this.playBgm(audio);
                buffer = this._bgmBuffer;
                break;
            case AUDIO_TYPE.BGS:
                this.playBgs(audio);
                buffer = this._bgsBuffer;
                break;
            case AUDIO_TYPE.ME:
                this.playMe(audio);
                buffer = this._meBuffer;
                break;
            case AUDIO_TYPE.SE:
                this.playSe(audio);
                buffer = this._seBuffers[0];
                break;
        }
        this._prevSoundTest = path;
        return buffer;
    };

    const _AudioManager_playBgm = AudioManager.playBgm;
    AudioManager.playBgm = function(bgm, pos) {
        _AudioManager_playBgm.apply(this, arguments);
        soundTestIo.registerByPlay(AUDIO_TYPE.BGM, bgm.name);
    };

    const _AudioManager_playBgs = AudioManager.playBgs;
    AudioManager.playBgs = function(bgs, pos) {
        _AudioManager_playBgs.apply(this, arguments);
        soundTestIo.registerByPlay(AUDIO_TYPE.BGS, bgs.name);
    };

    const _AudioManager_playMe = AudioManager.playMe;
    AudioManager.playMe = function(me) {
        _AudioManager_playMe.apply(this, arguments);
        soundTestIo.registerByPlay(AUDIO_TYPE.ME, me.name);
    };

    const _AudioManager_playSe = AudioManager.playSe;
    AudioManager.playSe = function(se) {
        _AudioManager_playSe.apply(this, arguments);
        soundTestIo.registerByPlay(AUDIO_TYPE.SE, se.name);
    };
})();
