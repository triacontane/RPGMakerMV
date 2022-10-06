//=============================================================================
// MenuCommonEvent.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.5.1 2022/10/06 メニュー画面のサブコマンドプラグインとの定義順の制約アノテーションを追加
// 1.5.0 2022/09/17 ピクチャのボタン化プラグインで指定したコモンイベントがメニュー画面中で実行されるよう仕様変更
// 1.4.2 2021/11/17 画面遷移時に通常イベントと同様のキャッシュ処理を追加
// 1.4.1 2021/09/01 最新版のSceneCustomMenu.jsと併用できるよう修正
// 1.4.0 2021/03/24 MZで実行できるよう修正
// 1.3.7 2020/08/28 1.3.6の修正方法が間違っていた問題を修正
// 1.3.6 2020/08/27 DWindow.jsと組み合わせたときにコモンイベントが存在するメニューで動的ウィンドウが作成されてしまう競合を修正
// 1.3.5 2020/05/09 MOG_Weather_EX.jsと併用したときに発生するエラーを解消
// 1.3.4 2020/03/21 SceneCustomMenu.jsに合わせた微修正
// 1.3.3 2020/03/17 Canvasモード時、マップの色調変更がウィンドウに反映されていた問題を修正
// 1.3.2 2019/01/23 1.3.1の修正でGUI画面デザインプラグインと共存できなくなっていた問題を修正
// 1.3.1 2019/01/18 他のプラグインと連携しやすいように一部の実装を変更
// 1.3.0 2018/09/23 対象イベントの並列実行を停止するコマンドを追加
// 1.2.0 2017/12/24 公式ガチャプラグインと連携できるよう修正
// 1.1.3 2017/12/02 NobleMushroom.jsとの競合を解消
// 1.1.2 2017/11/18 コモンイベントを一切指定しない状態でメニューを開くとエラーになる現象を修正
// 1.1.1 2017/11/05 ヘルプとダウンロード先を追記
// 1.1.0 2017/11/05 タイマー有効化機能などいくつかの機能を追加
// 1.0.0 2017/11/04 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc メニュー内コモンイベントプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MenuCommonEvent.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderBefore MenuSubCommand
 * @author トリアコンタン
 *
 * @param commonEventInfo
 * @text コモンイベント情報
 * @desc 各画面で実行するコモンイベントの情報です。
 * @default
 * @type struct<CommonEventInfo>[]
 *
 * @param maxMenuPicture
 * @text ピクチャ表示最大数
 * @desc メニュー画面で表示するピクチャの最大数です。
 * @default 10
 * @type number
 * @min 1
 * @max 100
 *
 * @param saveInterpreterIndex
 * @text 実行位置を記憶
 * @desc イベントの実行位置を記憶して別画面から戻ってきたときに記憶した位置から再開します。
 * @default false
 * @type boolean
 *
 * @param activateTimer
 * @text タイマー有効化
 * @desc メニュー画面中でもタイマーを表示し、かつタイマーを進めます。
 * @default false
 * @type boolean
 *
 * @command CHANGE_WINDOW_CONTROL
 * @text ウィンドウ操作禁止の変更
 * @desc イベント実行中にアクティブなウィンドウを操作できるかどうかを変更します。
 *
 * @arg disable
 * @text 禁止
 * @desc 有効にした場合、イベント実行中にアクティブなウィンドウを操作できなくなります。
 * @default true
 * @type boolean
 *
 * @command STOP_EVENT
 * @text イベント停止
 * @desc 実行中のメニューコモンイベントを中断します。
 *
 * @help MenuCommonEvent.js
 *
 * メニュー系の画面でコモンイベントを並列実行できます。
 * メッセージやピクチャ、変数の操作などのコマンド(※)が実行可能です。
 * コモンイベントは各画面につきひとつだけ指定できます。
 * イベントは並列実行されるので必要なくなった場合はスイッチや
 * プラグインコマンドから停止します。
 *
 * ※ 移動ルートの設定などキャラクターを対象にする一部コマンドは動作しません。
 * また、プラグインによって追加されたスクリプトやコマンドは正しく動作しない
 * 可能性があります。
 *
 * スクリプト詳細
 *  イベントコマンド「スクリプト」「変数の操作」から実行。
 *
 * // ウィンドウオブジェクトを取得
 * this.getSceneWindow(windowName);
 * 指定した名前のウィンドウオブジェクトを返します。
 * プロパティの取得や設定が可能です。上級者向け機能です。
 * 主要画面のウィンドウ名は以下の通りです。
 *
 * ・メインメニュー
 * commandWindow   コマンドウィンドウ
 * statusWindow    ステータスウィンドウ
 * goldWindow      お金ウィンドウ
 *
 * ・アイテム画面
 * categoryWindow  アイテムカテゴリウィンドウ
 * itemWindow      アイテムウィンドウ
 * actorWindow     アクター選択ウィンドウ
 *
 * ・スキル画面
 * skillTypeWindow スキルタイプウィンドウ
 * statusWindow    ステータスウィンドウ
 * itemWindow      スキルウィンドウ
 * actorWindow     アクター選択ウィンドウ
 *
 * ・装備画面
 * helpWindow      ヘルプウィンドウ
 * commandWindow   コマンドウィンドウ
 * slotWindow      スロットウィンドウ
 * statusWindow    ステータスウィンドウ
 * itemWindow      装備品ウィンドウ
 *
 * ・ステータス画面
 * statusWindow    ステータスウィンドウ
 *
 * // ウィンドウアクティブ判定
 * this.isWindowActive(windowName);
 * 指定した名前のウィンドウがアクティブなときにtrueを返します。
 * ウィンドウの指定例は上と同じです。
 *
 * // ウィンドウインデックス取得
 * this.getSceneWindowIndex();
 * 現在アクティブなウィンドウのインデックスを取得します。先頭は0です。
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

/*~struct~CommonEventInfo:ja
 *
 * @param SceneName
 * @desc コモンイベント実行対象の画面です。独自に追加した画面を対象にする場合はクラス名を直接入力してください。
 * @type select
 * @default
 * @option メインメニュー
 * @value Scene_Menu
 * @option アイテム
 * @value Scene_Item
 * @option スキル
 * @value Scene_Skill
 * @option 装備
 * @value Scene_Equip
 * @option ステータス
 * @value Scene_Status
 * @option オプション
 * @value Scene_Options
 * @option セーブ
 * @value Scene_Save
 * @option ロード
 * @value Scene_Load
 * @option ゲーム終了
 * @value Scene_End
 * @option ショップ
 * @value Scene_Shop
 * @option 名前入力
 * @value Scene_Name
 * @option デバッグ
 * @value Scene_Debug
 * @option サウンドテスト
 * @value Scene_SoundTest
 * @option 用語辞典
 * @value Scene_Glossary
 * @option 公式ガチャ
 * @value Scene_Gacha
 *
 * @param CommonEventId
 * @desc 画面で並列実行するコモンイベントのIDです。トリガーを並列実行にする必要はなく、スイッチも参照されません。
 * @default 1
 * @type common_event
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'CHANGE_WINDOW_CONTROL', args => {
        $gameTemp.setDisableWindowControl(args.disable);
    });

    PluginManagerEx.registerCommand(script, 'STOP_EVENT', function() {
        this._menuCommonStop = true;
    });

    Game_Interpreter.prototype.isWindowActive = function(windowName) {
        const sceneWindow = this.getSceneWindow(windowName);
        return sceneWindow ? sceneWindow.active : false;
    };

    Game_Interpreter.prototype.getSceneWindow = function(windowName) {
        return SceneManager.getSceneWindow('_' + windowName);
    };

    Game_Interpreter.prototype.getSceneWindowIndex = function() {
        let index = -1;
        SceneManager.getSceneWindowList().some(function(sceneWindow) {
            if (sceneWindow instanceof Window_Selectable && sceneWindow.active) {
                index = sceneWindow.index();
                return true;
            } else {
                return false;
            }
        });
        return index;
    };

    Game_Interpreter.prototype.refreshGlossary = function() {
        const glossaryWindow = this.getSceneWindow('glossaryWindow');
        if (glossaryWindow.visible) {
            const glossaryListWindow = this.getSceneWindow('glossaryListWindow');
            glossaryWindow.refresh(glossaryListWindow.item());
        }
    };

    Game_Interpreter.prototype.execStopEvent = function() {
        this._menuCommonStop = true;
    };

    Game_Interpreter.prototype.isMenuCommonStop = function() {
        return this._menuCommonStop;
    };

    //=============================================================================
    // Game_Temp
    //  メニューコモンイベントを作成、更新します。
    //=============================================================================
    const _Game_Temp_initialize      = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this._menuCommonEvent = {};
        this.clearSceneInformation();
    };

    Game_Temp.prototype.setupMenuCommonEvent = function(commonEventId, sceneName, sceneIndex) {
        this._sceneName  = sceneName;
        this._sceneIndex = sceneIndex;
        if (param.saveInterpreterIndex && this.isExistSameCommonEvent(commonEventId)) {
            return this._menuCommonEvent[sceneName];
        }
        return this._menuCommonEvent[sceneName] = this.createMenuCommonEvent(commonEventId);
    };

    Game_Temp.prototype.createMenuCommonEvent = function(commonEventId) {
        if (commonEventId > 0) {
            const commonEvent = new Game_MenuCommonEvent(commonEventId);
            if (commonEvent.event()) {
                return commonEvent;
            }
        }
        return null;
    };

    Game_Temp.prototype.isExistSameCommonEvent = function(commonEventId) {
        const commonEvent = this._menuCommonEvent[this._sceneName];
        return commonEvent && commonEvent.isSameEvent(commonEventId);
    };

    Game_Temp.prototype.setDisableWindowControl = function(value) {
        this._disableWindowControl = value;
    };

    Game_Temp.prototype.isDisableWindowControl = function() {
        return !!this._disableWindowControl;
    };

    Game_Temp.prototype.getSceneIndex = function() {
        return this._sceneIndex;
    };

    Game_Temp.prototype.isInMenu = function() {
        return this.getSceneIndex() >= 0;
    };

    Game_Temp.prototype.clearSceneInformation = function() {
        this._sceneIndex = -1;
        this._sceneName  = '';
    };

    //=============================================================================
    // Game_Screen
    //  シーンごとにピクチャを管理できるようにします。
    //=============================================================================
    if (param.maxMenuPicture > 0) {
        const _Game_Screen_realPictureId      = Game_Screen.prototype.realPictureId;
        Game_Screen.prototype.realPictureId = function(pictureId) {
            const sceneIndex = $gameTemp.getSceneIndex();
            if (sceneIndex >= 0) {
                return pictureId + this.maxMapPictures() * 2 + sceneIndex * this.maxPictures();
            } else {
                return _Game_Screen_realPictureId.apply(this, arguments);
            }
        };

        const _Game_Screen_maxPictures      = Game_Screen.prototype.maxPictures;
        Game_Screen.prototype.maxPictures = function() {
            return $gameTemp.isInMenu() ? param.maxMenuPicture : _Game_Screen_maxPictures.apply(this, arguments);
        };

        Game_Screen.prototype.maxMapPictures = function() {
            return _Game_Screen_maxPictures.apply(this, arguments);
        };
    }

    //=============================================================================
    // Game_MenuCommonEvent
    //  メニューコモンイベントを扱うクラスです。
    //=============================================================================
    function Game_MenuCommonEvent() {
        this.initialize.apply(this, arguments);
    }

    Game_MenuCommonEvent.prototype             = Object.create(Game_CommonEvent.prototype);
    Game_MenuCommonEvent.prototype.constructor = Game_MenuCommonEvent;

    const _Game_MenuCommonEvent_initialize = Game_MenuCommonEvent.prototype.initialize;
    Game_MenuCommonEvent.prototype.initialize = function(commonEventId) {
        _Game_MenuCommonEvent_initialize.apply(this, arguments);
        this._interpreter.setup(this.list());
        this._interpreter.loadImages();
    };

    Game_MenuCommonEvent.prototype.isActive = function() {
        return true;
    };

    Game_MenuCommonEvent.prototype.isSameEvent = function(commonEventId) {
        return this._commonEventId === commonEventId;
    };

    const _Game_MenuCommonEvent_update      = Game_MenuCommonEvent.prototype.update;
    Game_MenuCommonEvent.prototype.update = function() {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                $gameTemp.setDisableWindowControl(false);
            }
            if (this._interpreter.isMenuCommonStop()) {
                return;
            }
        }
        _Game_MenuCommonEvent_update.apply(this, arguments);
    };

    //=============================================================================
    // Scene_MenuBase
    //  メニューコモンイベントを実行します。
    //=============================================================================
    const _Scene_MenuBase_create      = Scene_MenuBase.prototype.create;
    Scene_MenuBase.prototype.create = function() {
        _Scene_MenuBase_create.apply(this, arguments);
        this.createCommonEvent();
    };

    Scene_MenuBase.prototype.createCommonEvent = function() {
        this.setupCommonEvent();
        if (!this.hasCommonEvent()) {
            return;
        }
        this.createSpriteset();
        if (!this._messageWindow) {
            this.createAllMessageWindow();
        }
    };

    Scene_MenuBase.prototype.hasCommonEvent = function() {
        return !!this._commonEvent;
    };

    Scene_MenuBase.prototype.createAllMessageWindow = function() {
        this._messageWindowAdd = true;
        this.createMessageWindowLayer();
        Scene_Message.prototype.createMessageWindow.call(this);
        Scene_Message.prototype.createScrollTextWindow.call(this);
        Scene_Message.prototype.createGoldWindow.call(this);
        Scene_Message.prototype.createNameBoxWindow.call(this);
        Scene_Message.prototype.createChoiceListWindow.call(this);
        Scene_Message.prototype.createNumberInputWindow.call(this);
        Scene_Message.prototype.createEventItemWindow.call(this);
        Scene_Message.prototype.associateWindows.call(this);
        this._messageWindowAdd = false;
    };

    const _Scene_MenuBase_addWindow = Scene_MenuBase.prototype.addWindow;
    Scene_MenuBase.prototype.addWindow = function(window) {
        if (this._messageWindowAdd) {
            this._messageWindowLayer.addChild(window);
        } else {
            _Scene_MenuBase_addWindow.apply(this, arguments);
        }
    };

    Scene_MenuBase.prototype.createMessageWindowLayer = function() {
        this._messageWindowLayer = new WindowLayer();
        this._messageWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
        this._messageWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
        this.addChild(this._messageWindowLayer);
    };

    Scene_MenuBase.prototype.messageWindowRect = function() {
        return Scene_Message.prototype.messageWindowRect.call(this);
    }

    Scene_MenuBase.prototype.scrollTextWindowRect = function() {
        return Scene_Message.prototype.scrollTextWindowRect.call(this);
    }

    Scene_MenuBase.prototype.goldWindowRect = function() {
        return Scene_Message.prototype.goldWindowRect.call(this);
    }

    Scene_MenuBase.prototype.eventItemWindowRect = function() {
        return Scene_Message.prototype.eventItemWindowRect.call(this);
    }

    Scene_MenuBase.prototype.changeParentMessageWindow = function() {
        const windows = [this._messageWindow, this._scrollTextWindow,
            this._goldWindow, this._nameBoxWindow, this._choiceListWindow,
            this._numberInputWindow, this._eventItemWindow];
        windows.forEach(win => this.addChild(this._windowLayer.removeChild(win)));
    };

    // Resolve conflict for NobleMushroom.js
    Scene_MenuBase.prototype.changeImplementationWindowMessage  = Scene_Map.prototype.changeImplementationWindowMessage;
    Scene_MenuBase.prototype.restoreImplementationWindowMessage = Scene_Map.prototype.restoreImplementationWindowMessage;
    Scene_MenuBase.prototype.onPause                            = Scene_Map.prototype.onPause;
    Scene_MenuBase.prototype.offPause                           = Scene_Map.prototype.offPause;
    Scene_MenuBase._stopWindow = false;

    Scene_MenuBase.prototype.createSpriteset = function() {
        this._spriteset = new Spriteset_Menu();
        this.addChild(this._spriteset);
    };

    Scene_MenuBase.prototype.setupCommonEvent = function() {
        const commonEventItem = this.getCommonEventData();
        const commonEventId   = commonEventItem ? parseInt(commonEventItem['CommonEventId']) : 0;
        const sceneIndex      = param.commonEventInfo.indexOf(commonEventItem);
        this._commonEvent   = $gameTemp.setupMenuCommonEvent(commonEventId, this._sceneName, sceneIndex);
    };

    Scene_MenuBase.prototype.getCommonEventData = function() {
        this._sceneName = PluginManagerEx.findClassName(this);
        return param.commonEventInfo.filter(function(data) {
            return data['SceneName'] === this._sceneName;
        }, this)[0];
    };

    const _Scene_MenuBase_updateChildren      = Scene_MenuBase.prototype.updateChildren;
    Scene_MenuBase.prototype.updateChildren = function() {
        Scene_MenuBase._stopWindow = this.hasCommonEvent() && this.isNeedStopWindow();
        _Scene_MenuBase_updateChildren.apply(this, arguments);
    };

    Scene_MenuBase.prototype.isNeedStopWindow = function() {
        return $gameTemp.isDisableWindowControl() || $gameMessage.isBusy();
    };

    Scene_MenuBase.prototype.updateCommonEvent = function() {
        if (!this.hasCommonEvent()) {
            return;
        }
        this._commonEvent.update();
        $gameScreen.update();
        if (param.activateTimer) {
            $gameTimer.update(true);
        }
        $gameMap._dynamicEvents.forEach(interpreter => interpreter.update());
        this.checkGameover();
    };

    //=============================================================================
    // Scene_Base
    //  メニューコモンイベントを更新します。
    //=============================================================================
    const _Scene_Base_update      = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        this.updateCommonEvent();
        _Scene_Base_update.apply(this, arguments);
    };

    Scene_Base.prototype.updateCommonEvent = function() {
        // do nothing
    };

    const _Scene_Base_terminate      = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        _Scene_Base_terminate.apply(this, arguments);
        if ($gameTemp) {
            $gameTemp.clearSceneInformation();
        }
    };

    //=============================================================================
    // Spriteset_Menu
    //  メニュー画面用のスプライトセットです。
    //=============================================================================
    function Spriteset_Menu() {
        this.initialize.apply(this, arguments);
    }

    Spriteset_Menu.prototype             = Object.create(Spriteset_Base.prototype);
    Spriteset_Menu.prototype.constructor = Spriteset_Menu;

    const _Spriteset_Menu_createBaseSprite      = Spriteset_Menu.prototype.createBaseSprite;
    Spriteset_Menu.prototype.createBaseSprite = function() {
        _Spriteset_Menu_createBaseSprite.apply(this, arguments);
        this._blackScreen.opacity = 0;
    };

    const _Spriteset_Menu_createTimer      = Spriteset_Menu.prototype.createTimer;
    Spriteset_Menu.prototype.createTimer = function() {
        if (param.activateTimer) {
            _Spriteset_Menu_createTimer.apply(this, arguments);
        }
    };

    Spriteset_Menu.prototype.createDynamicWindow = function() {};

    Spriteset_Menu.prototype.createToneChanger = function() {};

    Spriteset_Menu.prototype.updateToneChanger = function() {};

    Spriteset_Menu.prototype.reloadWeatherEX = function() {};

    //=============================================================================
    // SceneManager
    //  ウィンドウオブジェクトを取得します。
    //=============================================================================
    SceneManager.getSceneWindow = function(windowName) {
        const sceneWindow = this._scene[windowName];
        return sceneWindow instanceof Window ? sceneWindow : null;
    };

    SceneManager.getSceneWindowList = function() {
        const windowList = [];
        for (const sceneWindow in this._scene) {
            if (this._scene.hasOwnProperty(sceneWindow) && this._scene[sceneWindow] instanceof Window) {
                windowList.push(this._scene[sceneWindow]);
            }
        }
        return windowList;
    };

    //=============================================================================
    // Window_Selectable
    //  必要な場合にウィンドウの状態更新を停止します。
    //=============================================================================
    const _Window_Selectable_update = Window_Selectable.prototype.update;
    Window_Selectable.prototype.update = function() {
        if (Scene_MenuBase._stopWindow && this.isStopWindow()) {
            return;
        }
        _Window_Selectable_update.apply(this, arguments);
    };

    Window_Selectable.prototype.isStopWindow = function() {
        return !this._messageWindow;
    };
})();
