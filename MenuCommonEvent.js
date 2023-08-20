//=============================================================================
// MenuCommonEvent.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.1 2023/08/20 クラス名取得関数の実装を変更
// 1.4.0 2021/02/06 ピクチャなどの画像をウィンドウの背後に表示できる設定を追加
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
 * @plugindesc MenuCommonEventPlugin
 * @author triacontane
 *
 * @param CommonEventInfo
 * @desc 各画面で実行するコモンイベントの情報です。
 * @default
 * @type struct<CommonEventInfo>[]
 *
 * @param MaxMenuPicture
 * @desc メニュー画面で表示するピクチャの最大数です。
 * @default 10
 * @type number
 * @min 1
 * @max 100
 *
 * @param SaveInterpreterIndex
 * @desc イベントの実行位置を記憶して別画面から戻ってきたときに記憶した位置から再開します。
 * @default false
 * @type boolean
 *
 * @param ActivateTimer
 * @desc メニュー画面中でもタイマーを表示し、かつタイマーを進めます。
 * @default false
 * @type boolean
 *
 * @param PictureUnderWindow
 * @desc ピクチャなどの画像要素をウィンドウの背後に表示します。
 * @default false
 * @type boolean
 *
 * @param CommandPrefix
 * @desc プラグインコマンドおよびメモ欄の接頭辞です。コマンドやメモ欄が他プラグインと被る場合に指定してください。
 * @default
 *
 * @help MenuCommonEvent.js
 *
 * メニュー画面やプラグインで追加した画面(※1)でコモンイベントを並列実行できます。
 * メッセージやピクチャ、変数の操作などが各イベントコマンド(※2)が実行可能です。
 * コモンイベントは各画面につきひとつ実行できます。
 *
 * ※1 メニュー系の画面であれば利用できます。
 * サウンドテストプラグインや用語辞典プラグインとの連携は確認済みです。
 *
 * ※2 移動ルートの設定などキャラクターを対象にする一部コマンドは動作しません。
 * また、プラグインによって追加されたスクリプトやコマンドは正しく動作しない
 * 可能性があります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * ウィンドウ操作禁止      # メニュー画面のウィンドウ操作を禁止します。
 * DISABLE_WINDOW_CONTROL  # 同上
 * ウィンドウ操作許可      # 禁止したメニュー画面のウィンドウ操作を許可します。
 * ENABLE_WINDOW_CONTROL   # 同上
 *
 * プラグインコメント名が他のプラグインと被っている場合はパラメータの
 * 「コマンド接頭辞」に値を設定してください。
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
 * // 選択中のアクターオブジェクト取得
 * $gameParty.menuActor();
 * 装備画面やステータス画面で選択中のアクターの情報を取得します。
 * 上級者向けスクリプトです。(※1)
 *
 * // 選択中のアクターID取得
 * $gameParty.menuActor().actorId();
 * 装備画面やステータス画面で選択中のアクターIDを取得します。
 *
 * ※1 既存のコアスクリプトですが、有用に使えるため記載しています。
 *
 * // 用語辞典の表示内容更新
 * this.refreshGlossary();
 * 用語辞典プラグインにおいて用語の表示内容を最新にします。
 * 同プラグインと連携した場合に使用します。
 *
 * 〇他のプラグインとの連携
 * ピクチャのボタン化プラグイン（PictureCallCommon.js）と併用する場合
 * コマンドは「P_CALL_CE」ではなく「P_CALL_SWITCH」を使ってください。
 *
 * プラグインURL
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MenuCommonEvent.js
 *
 * ヘルプURL
 * https://github.com/triacontane/RPGMakerMV/blob/master/ReadMe/MenuCommonEvent.md
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~CommonEventInfo:
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
 *
 * @param CommonEventId
 * @desc 画面で並列実行するコモンイベントのIDです。トリガーを並列実行にする必要はなく、スイッチも参照されません。
 * @default 1
 * @type common_event
 *
 */
/*:ja
 * @plugindesc メニュー内コモンイベントプラグイン
 * @author トリアコンタン
 *
 * @param コモンイベント情報
 * @desc 各画面で実行するコモンイベントの情報です。
 * @default
 * @type struct<CommonEventInfo>[]
 *
 * @param ピクチャ表示最大数
 * @desc メニュー画面で表示するピクチャの最大数です。
 * @default 10
 * @type number
 * @min 1
 * @max 100
 *
 * @param 実行位置を記憶
 * @desc イベントの実行位置を記憶して別画面から戻ってきたときに記憶した位置から再開します。
 * @default false
 * @type boolean
 *
 * @param タイマー有効化
 * @desc メニュー画面中でもタイマーを表示し、かつタイマーを進めます。
 * @default false
 * @type boolean
 *
 * @param 画像をウィンドウ背後に配置
 * @desc ピクチャなどの画像要素をウィンドウの背後に表示します。
 * @default false
 * @type boolean
 *
 * @param コマンド接頭辞
 * @desc プラグインコマンドおよびメモ欄の接頭辞です。コマンドやメモ欄が他プラグインと被る場合に指定してください。
 * @default
 *
 * @help MenuCommonEvent.js
 *
 * メニュー画面やプラグインで追加した画面(※1)でコモンイベントを並列実行できます。
 * メッセージやピクチャ、変数の操作などが各イベントコマンド(※2)が実行可能です。
 * コモンイベントは各画面につきひとつ実行できます。
 *
 * ※1 メニュー系の画面であれば利用できます。
 * サウンドテストプラグインや用語辞典プラグインとの連携は確認済みです。
 *
 * ※2 移動ルートの設定などキャラクターを対象にする一部コマンドは動作しません。
 * また、プラグインによって追加されたスクリプトやコマンドは正しく動作しない
 * 可能性があります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * ウィンドウ操作禁止      # メニュー画面のウィンドウ操作を禁止します。
 * DISABLE_WINDOW_CONTROL  # 同上
 * ウィンドウ操作許可      # 禁止したメニュー画面のウィンドウ操作を許可します。
 * ENABLE_WINDOW_CONTROL   # 同上
 * イベントの実行停止      # イベントの並列実行を停止します。画面遷移して戻ると再実行されます。
 * STOP_EVENT              # 同上
 *
 * プラグインコメント名が他のプラグインと被っている場合はパラメータの
 * 「コマンド接頭辞」に値を設定してください。
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
 * // 選択中のアクターオブジェクト取得
 * $gameParty.menuActor();
 * 装備画面やステータス画面で選択中のアクターの情報を取得します。
 * 上級者向けスクリプトです。(※1)
 *
 * // 選択中のアクターID取得
 * $gameParty.menuActor().actorId();
 * 装備画面やステータス画面で選択中のアクターIDを取得します。
 *
 * ※1 既存のコアスクリプトですが、有用に使えるため記載しています。
 *
 * // 用語辞典の表示内容更新
 * this.refreshGlossary();
 * 用語辞典プラグインにおいて用語の表示内容を最新にします。
 * 同プラグインと連携した場合に使用します。
 *
 * 〇他のプラグインとの連携
 * ピクチャのボタン化プラグイン（PictureCallCommon.js）と併用する場合
 * コマンドは「P_CALL_CE」ではなく「P_CALL_SWITCH」を使ってください。
 *
 * プラグインURL
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MenuCommonEvent.js
 *
 * ヘルプURL
 * https://github.com/triacontane/RPGMakerMV/blob/master/ReadMe/MenuCommonEvent.md
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

(function() {
    'use strict';
    var pluginName = 'MenuCommonEvent';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name !== undefined) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'TRUE';
    };

    var getParamArrayJson = function(paramNames, defaultValue) {
        var value = getParamString(paramNames) || null;
        try {
            value = JSON.parse(value);
            if (value === null) {
                value = defaultValue;
            } else {
                value = value.map(function(valueData) {
                    return JSON.parse(valueData);
                });
            }
        } catch (e) {
            alert('!!!Plugin param is wrong.!!!\nPlugin:.js\nName:[]\nValue:');
            value = defaultValue;
        }
        return value;
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    var convertAllArguments = function(args) {
        return args.map(function(arg) {
            return convertEscapeCharacters(arg);
        });
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(param.commandPrefix + commandName, methodName);
    };

    var getClassName = function(object) {
        var define = object.constructor.toString();
        if (define.match(/^class/)) {
            return define.replace(/class\s+(.*?)\s+[\s\S]*/m, '$1');
        }
        return define.replace(/function\s+(.*?)\s*\([\s\S]*/m, '$1');
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                  = {};
    param.commonEventInfo      = getParamArrayJson(['CommonEventInfo', 'コモンイベント情報'], []);
    param.commandPrefix        = getParamString(['CommandPrefix', 'コマンド接頭辞']);
    param.maxMenuPicture       = getParamNumber(['MaxMenuPicture', 'ピクチャ表示最大数'], 1);
    param.saveInterpreterIndex = getParamBoolean(['SaveInterpreterIndex', '実行位置を記憶']);
    param.activateTimer        = getParamBoolean(['ActivateTimer', 'タイマー有効化']);
    param.pictureUnderWindow   = getParamBoolean(['PictureUnderWindow', '画像をウィンドウ背後に配置']);

    var pluginCommandMap = new Map();
    setPluginCommand('ウィンドウ操作禁止', 'execDisableWindowControl');
    setPluginCommand('DISABLE_WINDOW_CONTROL', 'execDisableWindowControl');
    setPluginCommand('ウィンドウ操作許可', 'execEnableWindowControl');
    setPluginCommand('ENABLE_WINDOW_CONTROL', 'execEnableWindowControl');
    setPluginCommand('イベントの実行停止', 'execStopEvent');
    setPluginCommand('STOP_EVENT', 'execStopEvent');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertAllArguments(args));
        }
    };

    Game_Interpreter.prototype.execDisableWindowControl = function() {
        $gameTemp.setDisableWindowControl(true);
    };

    Game_Interpreter.prototype.execEnableWindowControl = function() {
        $gameTemp.setDisableWindowControl(false);
    };

    Game_Interpreter.prototype.isWindowActive = function(windowName) {
        var sceneWindow = this.getSceneWindow(windowName);
        return sceneWindow ? sceneWindow.active : false;
    };

    Game_Interpreter.prototype.getSceneWindow = function(windowName) {
        return SceneManager.getSceneWindow('_' + windowName);
    };

    Game_Interpreter.prototype.getSceneWindowIndex = function() {
        var index = -1;
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
        var glossaryWindow = this.getSceneWindow('glossaryWindow');
        if (glossaryWindow.visible) {
            var glossaryListWindow = this.getSceneWindow('glossaryListWindow');
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
    var _Game_Temp_initialize      = Game_Temp.prototype.initialize;
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
            var commonEvent = new Game_MenuCommonEvent(commonEventId);
            if (commonEvent.event()) {
                return commonEvent;
            }
        }
        return null;
    };

    Game_Temp.prototype.isExistSameCommonEvent = function(commonEventId) {
        var commonEvent = this._menuCommonEvent[this._sceneName];
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
        var _Game_Screen_realPictureId      = Game_Screen.prototype.realPictureId;
        Game_Screen.prototype.realPictureId = function(pictureId) {
            var sceneIndex = $gameTemp.getSceneIndex();
            if (sceneIndex >= 0) {
                return pictureId + this.maxMapPictures() * 2 + sceneIndex * this.maxPictures();
            } else {
                return _Game_Screen_realPictureId.apply(this, arguments);
            }
        };

        var _Game_Screen_maxPictures      = Game_Screen.prototype.maxPictures;
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

    Game_MenuCommonEvent.prototype.isActive = function() {
        return true;
    };

    Game_MenuCommonEvent.prototype.isSameEvent = function(commonEventId) {
        return this._commonEventId === commonEventId;
    };

    var _Game_MenuCommonEvent_update      = Game_MenuCommonEvent.prototype.update;
    Game_MenuCommonEvent.prototype.update = function() {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter.execEnableWindowControl();
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
    var _Scene_MenuBase_create      = Scene_MenuBase.prototype.create;
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
        if (param.pictureUnderWindow) {
            this.addChildAt(this._spriteset, this.children.indexOf(this._windowLayer));
        }
        if (!this._messageWindow) {
            this.createMessageWindow();
        }
        if (!this._scrollTextWindow) {
            this.createScrollTextWindow();
        }
        this.changeParentMessageWindow();
    };

    var _Scene_MenuBase_start = Scene_MenuBase.prototype.start;
    Scene_MenuBase.prototype.start = function() {
        _Scene_MenuBase_start.apply(this, arguments);
        if (this.hasCommonEvent()) {
            this.addChild(this._messageWindow);
            this.addChild(this._scrollTextWindow);
            this._messageWindow.subWindows().forEach(function(win) {
                this.addChild(win);
            }, this);
        }
    };

    Scene_MenuBase.prototype.hasCommonEvent = function() {
        return !!this._commonEvent;
    };

    Scene_MenuBase.prototype.createMessageWindow = function() {
        Scene_Map.prototype.createMessageWindow.call(this);
    };

    Scene_MenuBase.prototype.createScrollTextWindow = function() {
        Scene_Map.prototype.createScrollTextWindow.call(this);
    };

    Scene_MenuBase.prototype.changeParentMessageWindow = function() {
        this.addChild(this._windowLayer.removeChild(this._messageWindow));
        this.addChild(this._windowLayer.removeChild(this._scrollTextWindow));
        this._messageWindow.subWindows().forEach(function(win) {
            this.addChild(this._windowLayer.removeChild(win));
        }, this);
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
        var commonEventItem = this.getCommonEventData();
        var commonEventId   = commonEventItem ? parseInt(commonEventItem['CommonEventId']) : 0;
        var sceneIndex      = param.commonEventInfo.indexOf(commonEventItem);
        this._commonEvent   = $gameTemp.setupMenuCommonEvent(commonEventId, this._sceneName, sceneIndex);
    };

    Scene_MenuBase.prototype.getCommonEventData = function() {
        this._sceneName = getClassName(this);
        return param.commonEventInfo.filter(function(data) {
            return data['SceneName'] === this._sceneName;
        }, this)[0];
    };

    var _Scene_MenuBase_updateChildren      = Scene_MenuBase.prototype.updateChildren;
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
        this.checkGameover();
        this.updateTouchPicturesIfNeed();
    };

    /**
     * updateTouchPicturesIfNeed
     * for PictureCallCommon.js
     */
    Scene_MenuBase.prototype.updateTouchPicturesIfNeed = function() {
        if (this.updateTouchPictures && param.maxMenuPicture > 0) {
            this.updateTouchPictures();
        }
    };

    //=============================================================================
    // Scene_Base
    //  メニューコモンイベントを更新します。
    //=============================================================================
    var _Scene_Base_update      = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        this.updateCommonEvent();
        _Scene_Base_update.apply(this, arguments);
    };

    Scene_Base.prototype.updateCommonEvent = function() {
        // do nothing
    };

    var _Scene_Base_terminate      = Scene_Base.prototype.terminate;
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

    var _Spriteset_Menu_createBaseSprite      = Spriteset_Menu.prototype.createBaseSprite;
    Spriteset_Menu.prototype.createBaseSprite = function() {
        _Spriteset_Menu_createBaseSprite.apply(this, arguments);
        this._blackScreen.opacity = 0;
    };

    var _Spriteset_Menu_createTimer      = Spriteset_Menu.prototype.createTimer;
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
        var sceneWindow = this._scene[windowName];
        return sceneWindow instanceof Window ? sceneWindow : null;
    };

    SceneManager.getSceneWindowList = function() {
        var windowList = [];
        for (var sceneWindow in this._scene) {
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
    var _Window_Selectable_update = Window_Selectable.prototype.update;
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
