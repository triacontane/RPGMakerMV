//=============================================================================
// NobleMushroom.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 DOWANGO Co., Ltd
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2016/09/20 画面サイズ変更およびモバイル用の画面サイズ設定を追加
// 1.0.0 2016/08/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ビジュアルノベルプラグイン
 * @author トリアコンタン
 *
 * @param 表示タイプ初期値
 * @desc メッセージ表示タイプの初期値です。(0:通常 1:ノベル)
 * @default 1
 *
 * @param タイトル表示タイプ
 * @desc タイトル画面のコマンドウィンドウの表示方法です。(0:通常 1:ノベル)
 * @default 1
 *
 * @param コマンド単位ウェイト
 * @desc イベントコマンド「文章の表示」ひとつごとに続く文章の表示を待機します。(ON/OFF)
 * @default ON
 *
 * @param 表示速度変数
 * @desc メッセージ表示速度を格納する変数の番号です。変数の値が1文字描画ごとに待機するフレーム数です。
 * @default 1
 *
 * @param 表示速度初期値
 * @desc 表示速度変数に格納されるメッセージ表示速度の初期値です。
 * @default 1
 *
 * @param クリック瞬間表示
 * @desc 文章の表示中に決定ボタンや左クリックで文章を瞬間表示します。(ON/OFF)
 * @default ON
 *
 * @param 自動改行
 * @desc 文章がウィンドウ枠に収まらない場合に自動で改行します。(ON/OFF)
 * @default ON
 *
 * @param 相対フォントサイズ
 * @desc ノベルウィンドウのフォントサイズです。デフォルトフォントサイズからの相対値で指定します。
 * @default 6
 *
 * @param 明朝体表示
 * @desc デバイスに明朝体系フォントがインストールされていれば優先的に使用します。(ON/OFF)
 * @default ON
 *
 * @param ゴシック体表示
 * @desc デバイスにゴシック体系フォントがインストールされていれば優先的に使用します。(ON/OFF)
 * @default OFF
 *
 * @param 選択肢接頭辞
 * @desc 選択肢の接頭辞です。(0:使用しない 1:アルファベット 2:数字)
 * @default 0
 *
 * @param 画面横サイズ
 * @desc 横方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 *
 * @param 画面縦サイズ
 * @desc 縦方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 *
 * @param モバイル画面横サイズ
 * @desc スマホ等を使用した場合の横方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 *
 * @param モバイル画面縦サイズ
 * @desc スマホ等を使用した場合の縦方向の画面サイズです。0を指定すると変更しません。
 * @default 0
 *
 * @param モバイルモード
 * @desc PC上でもモバイルモードで実行します。主にテスト用に使用するオプションですが音が鳴らない制約があります。
 * @default OFF
 *
 * @help RPGツクールMVでサウンドノベルを手軽に作成するためのベースプラグインです。
 * 適用すると、メッセージウィンドウの表示が画面全体になり
 * 表示したメッセージが消去されず画面に蓄積されるようになります。
 *
 * また、本プラグインを適用するとオートセーブされるようになります。
 * セーブされるタイミングは以下の通りです。
 *
 * ・ノベルウィンドウに蓄積されているメッセージが切り替わったとき
 * ・場所移動した直後
 *
 * タイトル画面でコンティニューを選択すると自動でオートセーブがロードされます。
 * 現在のバージョンでは、セーブはオートセーブのみの仕様となります。
 *
 * 制御文字詳細
 *  文章中に含めることで効果を発揮します。
 * \UL    # 文章の入力待ちウェイトを即解除してイベント命令を次に進めます。
 * \WC    # ウィンドウを閉じます。この段階でオートセーブされます。
 * \MS[n] # 文字の表示スピードを一時的に「n」フレームに変更します。
 *
 * プラグインコマンド概要
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * NM_タイプ変更 1    # メッセージの表示タイプを変更します。(設定は場所移動後に反映)
 * NM_CHANGE_TYPE 1   # 同上
 * NM_再ウェイト      # 制御文字[\UL]で解除した入力待ちを再度有効にします。
 * NM_RE_WAIT         # 同上
 * NM_閉じる          # ウィンドウを明示的に閉じます。
 * NM_CLOSE           # 同上
 * NM_設定固定        # ウィンドウの表示設定を現在の設定で固定します。
 *                      固定された状態では以後の文章の表示での設定は無視されます。
 * NM_SETTING_FIXED   # 同上
 * NM_設定固定解除    # ウィンドウの表示設定固定を元に戻します。
 * NM_SETTING_RELEASE # 同上
 * NM_名前入力 1      # アクターID[1]の名前を入力するポップアップを表示します。
 * NM_INPUT_NAME 1    # 同上
 *
 * プラグインコマンド詳細
 *
 * ・NM_タイプ変更 or NM_CHANGE_TYPE
 * メッセージを表示タイプを変更します。タイプには以下が存在します。
 *
 * 0:通常のメッセージ表示です。
 * 1:ノベルメッセージ表示です。メッセージが画面全体に表示され、蓄積されます。
 *   選択肢や数値入力なども合わせて表示方法が自動調整されます。
 *
 * 設定変更は場所移動するまで反映されないので注意してください。
 *
 * ・NM_設定固定 or NM_SETTING_FIXED
 * ウィンドウの設定を現在のもので固定します。対象は以下の通りです。
 *
 * 1. 顔グラフィックの設定
 * 2. タイプ(ウィンドウ、暗くする、透明)
 * 3. 位置(上　中　下)
 *
 * 固定している限り、文章の表示での設定は無視されます。
 * 再度有効にする場合は、NM_設定固定解除を実行してください。
 *
 * ・NM_名前入力 or NM_INPUT_NAME
 * 専用の画面を使わない簡易版の名前入力の処理です。
 * 第二引数に文字列を指定すると、ダイアログに指定した説明が表示されます。
 * 入力値を空欄にする、もしくはキャンセルした場合、名前は変更されません。
 * (例)
 * NM_名前入力 1 名前を入力してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'NobleMushroom';
    var metaTagPrefix = 'NM_';
    var setting       = {
        unlockCode      : 'UL',
        windowCloseCode : 'WC',
        messageSpeedCode: 'MS',
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramInitialViewType    = getParamNumber(['InitialViewType', '表示タイプ初期値'], 0);
    var paramTitleViewType      = getParamNumber(['TitleViewType', 'タイトル表示タイプ'], 0);
    var paramVariableSpeed      = getParamNumber(['VariableSpeed', '表示速度変数'], 1, 5000);
    var paramRapidShowClick     = getParamBoolean(['RapidShowClick', 'クリック瞬間表示']);
    var paramInitialSpeed       = getParamNumber(['InitialSpeed', '表示速度初期値'], 0);
    var paramWaitByCommand      = getParamBoolean(['WaitByCommand', 'コマンド単位ウェイト']);
    var paramAutoWordWrap       = getParamBoolean(['AutoWordWrap', '自動改行']);
    var paramRelativeFontSize   = getParamNumber(['RelativeFontSize', '相対フォントサイズ'], 1, 5000);
    var paramViewMincho         = getParamBoolean(['ViewMincho', '明朝体表示']);
    var paramViewGothic         = getParamBoolean(['ViewGothic', 'ゴシック体表示']);
    var paramSelectionPrefix    = getParamNumber(['SelectionPrefix', '選択肢接頭辞'], 0, 2);
    var paramScreenWidth        = getParamNumber(['ScreenWidth', '画面横サイズ'], 0);
    var paramScreenHeight       = getParamNumber(['ScreenHeight', '画面縦サイズ'], 0);
    var paramScreenWidthMobile  = getParamNumber(['ScreenWidthMobile', 'モバイル画面横サイズ'], 0);
    var paramScreenHeightMobile = getParamNumber(['ScreenHeightMobile', 'モバイル画面縦サイズ'], 0);
    var paramMobileMode         = getParamBoolean(['MobileMode', 'モバイルモード']);

    //=============================================================================
    // インタフェースの定義
    //=============================================================================
    var _InterfaceWindow_Message      = Window_Message;
    var _InterfaceWindow_TitleCommand = Window_TitleCommand;
    var _InterfaceWindow_ChoiceList   = Window_ChoiceList;
    var _InterfaceWindow_NumberInput  = Window_NumberInput;

    //=============================================================================
    // Utils
    //  文字列の挿入処理
    //=============================================================================
    Utils.spliceString = function(originalString, index, howMany, addString) {
        if (howMany < 0) howMany = 0;
        return (originalString.slice(0, index) + addString + originalString.slice(index + howMany));
    };

    var _Utils_isMobileDevice = Utils.isMobileDevice;
    Utils.isMobileDevice = function() {
        return paramMobileMode || _Utils_isMobileDevice.apply(this, arguments);
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix))) return;
        try {
            this.pluginCommandBlueMushroom(command.replace(metaTagPrefix, ''), args);
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

    Game_Interpreter.prototype.pluginCommandBlueMushroom = function(command, args) {
        switch (getCommandName(command)) {
            case '再ウェイト' :
            case 'RE_WAIT' :
                if ($gameMessage.isBusy()) this.setWaitMode('message');
                break;
            case 'タイプ変更' :
            case 'CHANGE_TYPE' :
                $gameSystem.changeMessageType(getArgNumber(args[0], 0));
                break;
            case '閉じる' :
            case 'CLOSE' :
                $gameMessage.setCloseForce(true);
                break;
            case '設定固定' :
            case 'SETTING_FIXED' :
                $gameSystem.setMessageSettingFixed(true);
                break;
            case '設定固定解除' :
            case 'SETTING_RELEASE' :
                $gameSystem.setMessageSettingFixed(false);
                break;
            case '名前入力' :
            case 'INPUT_NAME' :
                $gameMessage.popupNameInputPrompt(getArgNumber(args[0], 1), getArgString(args[1]));
                break;
        }
    };

    var _Game_Interpreter_command101      = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setInterpreter(this);
        }
        _Game_Interpreter_command101.apply(this, arguments);
    };

    //=============================================================================
    // Game_System
    //  全画面ウィンドウの有効フラグを管理します。
    //=============================================================================
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._messageViewType = paramInitialViewType;
        this._messageSetting  = null;
    };

    Game_System.prototype.getMessageType = function() {
        return this._messageViewType;
    };

    Game_System.prototype.changeMessageType = function(value) {
        this._messageViewType = value.clamp(0, 1);
    };

    Game_System.prototype.setMessageSettingFixed = function(value) {
        if (!value) {
            this._messageSetting = null;
            return;
        }
        var newMes      = new Game_Message();
        var originalMes = $gameMessage;
        newMes.setFaceImage(originalMes.prevFaceName, originalMes.prevFaceIndex);
        newMes.setBackground(originalMes.prevBackGroudType);
        newMes.setPositionType(originalMes.prevPositionType);
        this._messageSetting = newMes;
    };

    Game_System.prototype.getMessageSetting = function() {
        return this._messageSetting;
    };

    Game_System.prototype.executeAutoSave = function() {
        this.onBeforeSave();
        var result = DataManager.saveGameAuto();
        if (!result) {
            console.error('Auto save failed for any reasons.');
        }
    };

    //=============================================================================
    // Game_Message
    //  ウェイト解除処理を追加定義します。
    //=============================================================================
    var _Game_Message_clear      = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        this.prevFaceName      = this._faceName;
        this.prevFaceIndex     = this._faceIndex;
        this.prevBackGroudType = this._background;
        this.prevPositionType  = this._positionType;
        _Game_Message_clear.apply(this, arguments);
        this._interpreter = null;
        this._closeForce  = false;
    };

    Game_Message.prototype.setInterpreter = function(interpreter) {
        this._interpreter = interpreter;
    };

    Game_Message.prototype.setWaitMode = function(value) {
        if (this._interpreter) {
            this._interpreter.setWaitMode(value);
        }
    };

    Game_Message.prototype.setNoWait = function() {
        if (this._texts.length > 0) {
            this._texts[this._texts.length - 1] += '\\^';
        }
    };

    Game_Message.prototype.setCloseForce = function(value) {
        this._closeForce = !!value;
    };

    Game_Message.prototype.isCloseForce = function() {
        return this._closeForce;
    };

    var _Game_Message_faceName      = Game_Message.prototype.faceName;
    Game_Message.prototype.faceName = function() {
        return _Game_Message_faceName.apply($gameSystem.getMessageSetting() || this, arguments);
    };

    var _Game_Message_faceIndex      = Game_Message.prototype.faceIndex;
    Game_Message.prototype.faceIndex = function() {
        return _Game_Message_faceIndex.apply($gameSystem.getMessageSetting() || this, arguments);
    };

    var _Game_Message_background      = Game_Message.prototype.background;
    Game_Message.prototype.background = function() {
        return _Game_Message_background.apply($gameSystem.getMessageSetting() || this, arguments);
    };

    var _Game_Message_positionType      = Game_Message.prototype.positionType;
    Game_Message.prototype.positionType = function() {
        return _Game_Message_positionType.apply($gameSystem.getMessageSetting() || this, arguments);
    };

    Game_Message.prototype.popupNameInputPrompt = function(actorId, message) {
        var actor        = $gameActors.actor(actorId);
        var defaultValue = actor ? actor.name() : '';
        var result       = window.prompt(message || '', defaultValue);
        if (Utils.isNwjs()) {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            win.focus();
            Input.clear();
        }
        if (result) actor.setName(result);
    };

    //=============================================================================
    // SceneManager
    //  画面サイズを再設定します。
    //=============================================================================
    var _SceneManager_initGraphics = SceneManager.initGraphics;
    SceneManager.initGraphics      = function() {
        this.setScreenSize();
        _SceneManager_initGraphics.apply(this, arguments);
    };

    SceneManager.setScreenSize = function() {
        var width, height;
        if (Utils.isMobileDevice()) {
            width  = paramScreenWidthMobile || paramScreenWidth;
            height = paramScreenHeightMobile || paramScreenHeight;
        } else {
            width  = paramScreenWidth;
            height = paramScreenHeight;
        }
        this._screenWidth  = width || this._screenWidth;
        this._screenHeight = height || this._screenHeight;
        this._boxWidth     = width || this._boxWidth;
        this._boxHeight    = height || this._boxHeight;
        if (width || height) {
            var dw = this._screenWidth - window.innerWidth;
            var dh = this._screenHeight - window.innerHeight;
            window.moveBy(-dw / 2, -dh / 2);
            window.resizeBy(dw, dh);
        }
    };

    //=============================================================================
    // DataManager
    //  オートセーブを追加定義します。
    //=============================================================================
    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects      = function() {
        _DataManager_createGameObjects.apply(this, arguments);
        $gameVariables.setValue(paramVariableSpeed, paramInitialSpeed);
    };

    DataManager.getAutoSaveNumber = function() {
        return this.maxSavefiles() + 1;
    };

    DataManager.saveGameAuto = function() {
        return this.saveGame(this.getAutoSaveNumber());
    };

    DataManager.loadGameAuto = function() {
        return this.loadGame(this.getAutoSaveNumber());
    };

    //=============================================================================
    // Scene_Map
    //  フラグによってメッセージウィンドウのクラスを変更します。
    //=============================================================================
    var _Scene_Map_createMessageWindow      = Scene_Map.prototype.createMessageWindow;
    Scene_Map.prototype.createMessageWindow = function() {
        this.changeImplementationWindowMessage($gameSystem.getMessageType());
        _Scene_Map_createMessageWindow.apply(this, arguments);
        this.restoreImplementationWindowMessage();
    };

    Scene_Map.prototype.changeImplementationWindowMessage = function(type) {
        var classWindow_Message, classWindow_ChoiceList, classWindow_NumberInput;
        switch (type) {
            case 1 :
                classWindow_Message     = Window_NovelMessage;
                classWindow_ChoiceList  = Window_NovelChoiceList;
                classWindow_NumberInput = Window_NovelNumberInput;
                break;
            default :
                classWindow_Message     = _InterfaceWindow_Message;
                classWindow_ChoiceList  = _InterfaceWindow_ChoiceList;
                classWindow_NumberInput = _InterfaceWindow_NumberInput;
        }
        Window_Message     = classWindow_Message;
        Window_ChoiceList  = classWindow_ChoiceList;
        Window_NumberInput = classWindow_NumberInput;
    };

    Scene_Map.prototype.restoreImplementationWindowMessage = function() {
        Window_Message     = _InterfaceWindow_Message;
        Window_ChoiceList  = _InterfaceWindow_ChoiceList;
        Window_NumberInput = _InterfaceWindow_NumberInput;
    };

    var _Scene_Map_start      = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.apply(this, arguments);
        $gameSystem.executeAutoSave();
    };

    //=============================================================================
    // Scene_Title
    //  フラグによってコマンドウィンドウのクラスを変更します。
    //=============================================================================
    var _Scene_Title_createCommandWindow      = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        this.changeImplementationWindowCommand(paramTitleViewType);
        _Scene_Title_createCommandWindow.apply(this, arguments);
        this.restoreImplementationWindowCommand();
    };

    Scene_Title.prototype.changeImplementationWindowCommand = function(type) {
        var classWindow_TitleCommand;
        switch (type) {
            case 1 :
                classWindow_TitleCommand = Window_NovelTitleCommand;
                break;
            default :
                classWindow_TitleCommand = _InterfaceWindow_TitleCommand;
        }
        Window_TitleCommand = classWindow_TitleCommand;
    };

    Scene_Title.prototype.restoreImplementationWindowCommand = function() {
        Window_TitleCommand = _InterfaceWindow_TitleCommand;
    };

    Scene_Title.prototype.commandContinue = function() {
        this.fadeOutAll();
        SceneManager.push(Scene_AutoLoad);
    };

    //=============================================================================
    // Scene_AutoLoad
    //  オートロード画面を追加定義します。
    //=============================================================================
    function Scene_AutoLoad() {
        this.initialize.apply(this, arguments);
    }

    Scene_AutoLoad.prototype             = Object.create(Scene_Load.prototype);
    Scene_AutoLoad.prototype.constructor = Scene_AutoLoad;

    Scene_AutoLoad.prototype.create = function() {
    };

    Scene_AutoLoad.prototype.start = function() {
        this.executeAutoLoad();
    };

    Scene_AutoLoad.prototype.onLoadSuccess = function() {
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    };

    Scene_AutoLoad.prototype.executeAutoLoad = function() {
        if (DataManager.loadGameAuto()) {
            this.onLoadSuccess();
        } else {
            this.onLoadFailure();
        }
    };

    //=============================================================================
    // Window_Message
    //  ノベルメッセージ表示用のクラスです。
    //=============================================================================
    var _Window_Message_updateWait      = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        if (paramRapidShowClick && this._textState && this.isTriggered()) {
            this._showAll = true;
        }
        return _Window_Message_updateWait.apply(this, arguments);
    };

    var _Window_Message_updateMessage      = Window_Message.prototype.updateMessage;
    Window_Message.prototype.updateMessage = function() {
        var speed = this.getMessageSpeed();
        if (this._textState && !this._lineShowFast) {
            if (speed <= 0 || this._showAll) {
                this._showFast = true;
            } else {
                this._waitCount = speed - 1;
            }
        }
        return _Window_Message_updateMessage.apply(this, arguments);
    };

    Window_Message.prototype.getMessageSpeed = function() {
        return this._tempMessageSpeed !== null ? this._tempMessageSpeed : $gameVariables.value(paramVariableSpeed);
    };

    Window_Message.prototype.setTempMessageSpeed = function(speed) {
        if (speed >= 0) {
            this._tempMessageSpeed = speed;
            if (speed > 0) this._showFast = false;
        } else {
            this._tempMessageSpeed = null;
        }
    };

    var _Window_Message_clearFlags      = Window_Message.prototype.clearFlags;
    Window_Message.prototype.clearFlags = function() {
        _Window_Message_clearFlags.apply(this, arguments);
        this._windowClosing    = false;
        this._showAll          = false;
        this._tempMessageSpeed = null;
    };

    var _Window_Message_processEscapeCharacter      = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        if (code === '>') this._waitCount = 0;
        switch (code) {
            case setting.unlockCode:
                $gameMessage.setWaitMode('');
                break;
            case setting.windowCloseCode:
                if (this.isNovelWindow()) this.setWindowClosing();
                break;
            case setting.messageSpeedCode:
                this.setTempMessageSpeed(this.obtainEscapeParam(textState));
                break;
            default:
                _Window_Message_processEscapeCharacter.apply(this, arguments);
        }
    };

    Window_Message.prototype.isNovelWindow = function() {
        return false;
    };

    //=============================================================================
    // Window_NovelMessage
    //  ノベルメッセージ表示用のクラスです。
    //=============================================================================
    function Window_NovelMessage() {
        this.initialize.apply(this, arguments);
    }

    Window_NovelMessage.prototype             = Object.create(Window_Message.prototype);
    Window_NovelMessage.prototype.constructor = Window_Message;

    Window_NovelMessage.fontFaceMincho = 'ヒラギノ明朝 ProN W3, Hiragino Mincho ProN, ＭＳ Ｐ明朝, MS PMincho';
    Window_NovelMessage.fontFaceGothic = 'ヒラギノゴシック ProN W3, Hiragino Gothic ProN, ＭＳ Ｐゴシック, MS PGothic';

    Window_NovelMessage.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_NovelMessage.prototype.windowHeight = function() {
        return Graphics.boxHeight;
    };

    Window_NovelMessage.prototype.standardFontSize = function() {
        return Window_Base.prototype.standardFontSize.apply(this, arguments) + paramRelativeFontSize;
    };

    Window_NovelMessage.prototype.standardFontFace = function() {
        var fontFace = '';
        if (paramViewMincho) fontFace += Window_NovelMessage.fontFaceMincho;
        if (paramViewGothic) fontFace += Window_NovelMessage.fontFaceGothic;
        return fontFace + ',' + Window_Base.prototype.standardFontFace.call(this);
    };

    Window_NovelMessage.prototype.startInput = function() {
        var result = _InterfaceWindow_Message.prototype.startInput.apply(this, arguments);
        if (result) {
            if (!this.isOpen() || !this._textState) {
                this.contents.clear();
                this.open();
            }
        } else {
            this.startClose();
        }
        return result;
    };

    Window_NovelMessage.prototype.startClose = function() {
        if ($gameMessage.isCloseForce()) {
            $gameMessage.setCloseForce(false);
            this.closeForce();
        }
    };

    Window_NovelMessage.prototype.startMessage = function() {
        if (!paramWaitByCommand) {
            $gameMessage.setNoWait();
        }
        if (!this._prevTextState) {
            _InterfaceWindow_Message.prototype.startMessage.apply(this, arguments);
        } else {
            this._textState      = this._prevTextState;
            this._textState.text = this.convertEscapeCharacters($gameMessage.allText());
            this._textState.top  = this._textState.y;
            this.processNewLine(this._textState);
            this._textState.index = 0;
            this.resetFontSettings();
            this.clearFlags();
            this.loadMessageFace();
            this.open();
        }
    };

    Window_NovelMessage.prototype.newPage = function(textState) {
        textState.top = 0;
        textState.y   = 0;
        _InterfaceWindow_Message.prototype.newPage.apply(this, arguments);
    };

    Window_NovelMessage.prototype.onEndOfText = function() {
        this.dumpMessage();
        $gameMessage.setFaceImage('', 0);
        _InterfaceWindow_Message.prototype.onEndOfText.apply(this, arguments);
    };

    Window_NovelMessage.prototype.dumpMessage = function() {
        this._prevTextState = (!this._windowClosing ? this._textState : null);
    };

    Window_NovelMessage.prototype.startPause = function() {
        _InterfaceWindow_Message.prototype.startPause.apply(this, arguments);
        var position = this._signPositionNewLine ? this._signPositionNewLine : this.getPauseSignSpritePosition();
        this.setPauseSignSpritePosition(position);
    };

    Window_NovelMessage.prototype.setPauseSignSpritePosition = function(position) {
        var signSprite = this._windowPauseSignSprite;
        signSprite.x   = position.x;
        signSprite.y   = position.y;
        signSprite.setBlendColor(this._windowClosing || this._signPositionNewLine ? [255, 0, 0, 128] : [0, 0, 0, 0]);
    };

    Window_NovelMessage.prototype.getPauseSignSpritePosition = function() {
        var signSprite = this._windowPauseSignSprite;
        var x          = this._textState.x + this.padding + (signSprite.width * signSprite.anchor.x);
        var y          = this._textState.y + this._textState.height + this.padding;
        return {x: x, y: y};
    };

    Window_NovelMessage.prototype.terminateMessage = function() {
        _InterfaceWindow_Message.prototype.terminateMessage.apply(this, arguments);
        if (!this._windowClosing) {
            this.open();
        } else {
            $gameSystem.executeAutoSave();
        }
    };

    Window_NovelMessage.prototype.processNormalCharacter = function(textState) {
        _InterfaceWindow_Message.prototype.processNormalCharacter.apply(this, arguments);
        if (paramAutoWordWrap) this.processAutoWordWrap(textState);
    };

    Window_NovelMessage.prototype.processNewLine = function(textState) {
        textState.left            = this.newLineX();
        this._signPositionNewLine = this.getPauseSignSpritePosition();
        _InterfaceWindow_Message.prototype.processNewLine.apply(this, arguments);
        this._signPositionNewLine = null;
    };

    Window_NovelMessage.prototype.newLineX = function() {
        var x = _InterfaceWindow_Message.prototype.newLineX.apply(this, arguments);
        return (this._textState.y - this._textState.top >= Window_Base._faceHeight) ? 0 : x;
    };

    Window_NovelMessage.prototype.processAutoWordWrap = function(textState) {
        var c         = textState.text[textState.index];
        var textNextX = textState.x + (c ? this.textWidth(c) : 0);
        if (textNextX > this.contents.width) {
            textState.index--;
            this.processNewLine(textState);
        }
    };

    Window_NovelMessage.prototype.drawMessageFace = function() {
        if (!this._prevTextState) {
            _InterfaceWindow_Message.prototype.drawMessageFace.apply(this, arguments);
        } else {
            this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, this._textState.y);
        }
    };

    Window_NovelMessage.prototype.getNovelChoiceTop = function() {
        if (this._textState) {
            return this._textState.y + this._textState.height + this.padding;
        } else {
            return 0;
        }
    };

    Window_NovelMessage.prototype.clearDumpMessage = function() {
        this.setWindowClosing();
        this.dumpMessage();
    };

    Window_NovelMessage.prototype.setWindowClosing = function() {
        this._windowClosing = true;
    };

    Window_NovelMessage.prototype.closeForce = function() {
        $gameSystem.executeAutoSave();
        this.clearDumpMessage();
        this.close();
    };

    Window_NovelMessage.prototype.isNovelWindow = function() {
        return true;
    };

    //=============================================================================
    // Window_NovelChoiceList
    //  ノベルウィンドウ用のコマンド表示クラスです。
    //=============================================================================
    function Window_NovelChoiceList() {
        this.initialize.apply(this, arguments);
    }

    Window_NovelChoiceList._prefixAlphabet = ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. ', 'H. '];
    Window_NovelChoiceList._prefixNumber   = ['1. ', '2. ', '3. ', '4. ', '5. ', '6. ', '7. ', '8. '];

    Window_NovelChoiceList.prototype             = Object.create(Window_ChoiceList.prototype);
    Window_NovelChoiceList.prototype.constructor = Window_NovelChoiceList;

    Window_NovelChoiceList.prototype.updatePlacement = function() {
        var y = this._messageWindow.getNovelChoiceTop();
        this.move(0, y, this.windowWidth(), this.windowHeight());
    };

    Window_NovelChoiceList.prototype.standardFontSize    = Window_NovelMessage.prototype.standardFontSize;
    Window_NovelChoiceList.prototype.standardFontFace    = Window_NovelMessage.prototype.standardFontFace;
    Window_NovelChoiceList.prototype.processAutoWordWrap = Window_NovelMessage.prototype.processAutoWordWrap;

    Window_NovelChoiceList.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_NovelChoiceList.prototype.windowHeight = function() {
        return Graphics.boxHeight;
    };

    Window_NovelChoiceList.prototype.contentsHeight = function() {
        return this.getAllTextHeight() || Window_Base.prototype.contentsHeight.apply(this, arguments);
    };

    Window_NovelChoiceList.prototype.numVisibleRows = function() {
        return $gameMessage.choices().length;
    };

    Window_NovelChoiceList.prototype.updateBackground = function() {
        this.setBackgroundType(2);
    };

    Window_NovelChoiceList.prototype.makeCommandList = function() {
        _InterfaceWindow_ChoiceList.prototype.makeCommandList.apply(this, arguments);
        this._textHieghts = [];
        for (var i = 0, n = this._list.length; i < n; i++) {
            this._textHieghts[i] = this.drawItem(i) + 8;
        }
    };

    Window_NovelChoiceList.prototype.commandName = function(index) {
        var prefix = '';
        switch (paramSelectionPrefix) {
            case 1:
                prefix = Window_NovelChoiceList._prefixAlphabet[index];
                break;
            case 2:
                prefix = Window_NovelChoiceList._prefixNumber[index];
                break;
        }
        return prefix + Window_Command.prototype.commandName.apply(this, arguments);
    };

    Window_NovelChoiceList.prototype.getAllTextHeight = function() {
        return this._textHieghts.reduce(function(preValue, value) {
            return preValue + value;
        }, 0);
    };

    Window_NovelChoiceList.prototype.itemRect = function(index) {
        var rect = _InterfaceWindow_ChoiceList.prototype.itemRect.apply(this, arguments);
        rect.y   = 0;
        for (var i = 0; i < index; i++) {
            rect.y += this._textHieghts[i];
        }
        rect.height = this._textHieghts[index];
        return rect;
    };

    Window_NovelChoiceList.prototype.drawItem = function(index) {
        var rect         = this.itemRectForText(index);
        var textState    = {index: 0, x: rect.x, y: rect.y, left: rect.x};
        textState.text   = this.convertEscapeCharacters(this.commandName(index));
        textState.height = this.calcTextHeight(textState, false);
        this.resetFontSettings();
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
            this.processAutoWordWrap(textState);
        }
        return textState.y + textState.height - rect.y;
    };

    Window_NovelChoiceList.prototype.callOkHandler = function() {
        this._messageWindow.clearDumpMessage();
        _InterfaceWindow_ChoiceList.prototype.callOkHandler.apply(this, arguments);
    };

    Window_NovelChoiceList.prototype.textPadding = function() {
        return 24;
    };

    //=============================================================================
    // Window_NovelChoiceList
    //  ノベルウィンドウ用のコマンド表示クラスです。
    //=============================================================================
    function Window_NovelNumberInput() {
        this.initialize.apply(this, arguments);
    }

    Window_NovelNumberInput.prototype             = Object.create(Window_NumberInput.prototype);
    Window_NovelNumberInput.prototype.constructor = Window_NovelNumberInput;

    Window_NovelNumberInput.prototype.standardFontSize = Window_NovelMessage.prototype.standardFontSize;
    Window_NovelNumberInput.prototype.standardFontFace = Window_NovelMessage.prototype.standardFontFace;

    Window_NovelNumberInput.prototype.updatePlacement = function() {
        var y = this._messageWindow.getNovelChoiceTop();
        var x = Graphics.boxWidth / 2 - this.windowWidth() / 2;
        this.move(x, y, this.windowWidth(), this.windowHeight());
        this.updateBackground();
    };

    Window_NovelNumberInput.prototype.processOk = function() {
        this._messageWindow.clearDumpMessage();
        _InterfaceWindow_NumberInput.prototype.processOk.apply(this, arguments);
    };

    Window_NovelNumberInput.prototype.updateBackground = function() {
        this.setBackgroundType(2);
    };

    //=============================================================================
    // Window_NovelTitleCommand
    //  ノベルゲーム風のタイトルコマンドウィンドウです。
    //=============================================================================
    function Window_NovelTitleCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_NovelTitleCommand.prototype             = Object.create(Window_TitleCommand.prototype);
    Window_NovelTitleCommand.prototype.constructor = Window_NovelTitleCommand;

    Window_NovelTitleCommand.prototype.maxCols = function() {
        return this.maxItems();
    };

    Window_NovelTitleCommand.prototype.windowWidth = function() {
        return Graphics.boxWidth - 64;
    };

    Window_NovelTitleCommand.prototype.updatePlacement = function() {
        _InterfaceWindow_TitleCommand.prototype.updatePlacement.apply(this, arguments);
        this.setBackgroundType(1);
    };

    Window_NovelTitleCommand.prototype.standardFontSize = Window_NovelMessage.prototype.standardFontSize;
    Window_NovelTitleCommand.prototype.standardFontFace = Window_NovelMessage.prototype.standardFontFace;

    //=============================================================================
    // ウィンドウを透過して重なり合ったときの表示を自然にします。
    //=============================================================================
    if (!WindowLayer.throughWindow) {
        WindowLayer.throughWindow = true;
        //=============================================================================
        //  WindowLayer
        //   ウィンドウのマスク処理を除去します。
        //=============================================================================
        WindowLayer.prototype._maskWindow            = function(window) {};
        WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {};
    }
})();

