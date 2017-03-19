//=============================================================================
// RetryBattle.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2017/03/20 本体v1.3.4以降で、リトライ後のメニュー画面でコモンイベントアイテムが実行できていた問題を修正
// 1.1.0 2016/07/26 リトライ後のメニュー画面でコモンイベントを実行するアイテム・スキルを実行すると正常に動作しない問題を修正
//                  リトライ後のメニュー画面でゲーム終了を選択できないように修正
//                  リトライ回数をカウントして、スクリプトから取得できる機能を追加
// 1.0.0 2016/07/26 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc RetryBattlePlugin
 * @author triacontane
 *
 * @param RetryNormalEnemy
 * @desc 雑魚敵でゲームオーバーになったあとにリトライできます。
 * @default ON
 *
 * @param RetryBossEnemy
 * @desc ボス敵でゲームオーバーになったあとにリトライできます。
 * @default ON
 *
 * @param CommandRetry
 * @desc ゲームオーバー画面で表示する「リトライする」ためのコマンド文字列です。
 * @default リトライ
 *
 * @param CommandLoad
 * @desc ゲームオーバー画面で表示する「ロード画面に移行する」ためのコマンド文字列です。
 * @default ロード
 *
 * @param CommandTitle
 * @desc ゲームオーバー画面で表示する「タイトル画面に移行する」ためのコマンド文字列です。
 * @default タイトルへ
 *
 * @param WindowY
 * @desc リトライウィンドウの表示Y座標です。
 * @default 464
 *
 * @param ShowMenu
 * @desc リトライ選択後、戦闘開始前にメニュー画面を表示します。
 * @default ON
 *
 * @param Message
 * @desc ウィンドウの上部にメッセージを表示します。
 * @default \c[2]あなたは死にました。\c[0]
 *
 * @param MessageY
 * @desc メッセージの表示Y座標です。
 * @default 360
 *
 * @param FontSize
 * @desc メッセージのフォントサイズです。
 * @default 32
 *
 * @help 戦闘でゲームオーバーになったあとのゲームオーバー画面でリトライ可能になります。
 * 雑魚敵とボス敵とでリトライ可能かどうかを分けることができます。
 * リトライを選択すると一度だけメニュー画面を開いた後で、再戦することができます。
 * メニュー画面ではセーブ及びコモンイベントを実行するアイテム、スキルの使用ができません。
 *
 * 雑魚敵かボス敵かは以下の通り判定されます。
 *
 * ・雑魚敵
 * ランダムエンカウントか「戦闘の処理」で「ランダムエンカウントと同じ」を選択
 *
 * ・ボス敵
 * 上記以外
 *
 * さらにオマケ機能として、戦闘中に実行すると強制的に戦闘を最初からやり直す
 * プラグインコマンドを提供します。有名RPGの某魔法が再現できます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * RB_リトライ禁止  # 一時的にリトライを禁止します。
 * RB_RETRY_DISABLE # 同上
 * RB_リトライ許可  # リトライを再度許可します。
 * RB_RETRY_ENABLE  # 同上
 * RB_強制リトライ  # 戦闘中に使用すると強制的にリトライします。
 * RB_FORCE_RETRY   # 同上
 *
 * スクリプト詳細
 *  イベントコマンド「変数の操作」から実行
 * $gameSystem.getRetryCount(); # リトライ回数を取得して変数に保持します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 戦闘リトライプラグイン
 * @author トリアコンタン
 *
 * @param 雑魚敵でリトライ可能
 * @desc 雑魚敵でゲームオーバーになったあとにリトライできます。
 * @default ON
 *
 * @param ボス敵でリトライ可能
 * @desc ボス敵でゲームオーバーになったあとにリトライできます。
 * @default ON
 *
 * @param コマンドリトライ
 * @desc ゲームオーバー画面で表示する「リトライする」ためのコマンド文字列です。
 * @default リトライ
 *
 * @param コマンドロード
 * @desc ゲームオーバー画面で表示する「ロード画面に移行する」ためのコマンド文字列です。
 * @default ロード
 *
 * @param コマンドタイトル
 * @desc ゲームオーバー画面で表示する「タイトル画面に移行する」ためのコマンド文字列です。
 * @default タイトルへ
 *
 * @param ウィンドウY座標
 * @desc リトライウィンドウの表示Y座標です。
 * @default 448
 *
 * @param メニュー画面を表示
 * @desc リトライ選択後、戦闘開始前にメニュー画面を表示します。
 * @default ON
 *
 * @param メッセージ
 * @desc ウィンドウの上部にメッセージを表示します。
 * @default \i[1]\c[2]あなたは死にました\c[0]\i[1]
 *
 * @param メッセージY座標
 * @desc メッセージの表示Y座標です。
 * @default 360
 *
 * @param フォントサイズ
 * @desc メッセージのフォントサイズです。
 * @default 32
 *
 * @help 戦闘でゲームオーバーになったあとのゲームオーバー画面でリトライ可能になります。
 * 雑魚敵とボス敵とでリトライ可能かどうかを分けることができます。
 * リトライを選択すると一度だけメニュー画面を開いた後で、再戦することができます。
 * メニュー画面ではセーブ及びコモンイベントを実行するアイテム、スキルの使用ができません。
 *
 * 雑魚敵かボス敵かは以下の通り判定されます。
 *
 * ・雑魚敵
 * ランダムエンカウントか「戦闘の処理」で「ランダムエンカウントと同じ」を選択
 *
 * ・ボス敵
 * 上記以外
 *
 * さらにオマケ機能として、戦闘中に実行すると強制的に戦闘を最初からやり直す
 * プラグインコマンドを提供します。有名RPGの某魔法が再現できます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * RB_リトライ禁止  # 一時的にリトライを禁止します。
 * RB_RETRY_DISABLE # 同上
 * RB_リトライ許可  # リトライを再度許可します。
 * RB_RETRY_ENABLE  # 同上
 * RB_強制リトライ  # 戦闘中に使用すると強制的にリトライします。
 * RB_FORCE_RETRY   # 同上
 *
 * スクリプト詳細
 *  イベントコマンド「変数の操作」から実行
 * $gameSystem.getRetryCount(); # リトライ回数を取得して変数に保持します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'RetryBattle';
    var metaTagPrefix = 'RB_';

    var getCommandName = function(command) {
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramRetryNormalEnemy = getParamBoolean(['RetryNormalEnemy', '雑魚敵でリトライ可能']);
    var paramRetryBossEnemy   = getParamBoolean(['RetryBossEnemy', 'ボス敵でリトライ可能']);
    var paramCommandRetry     = getParamString(['CommandRetry', 'コマンドリトライ']);
    var paramCommandLoad      = getParamString(['CommandLoad', 'コマンドロード']);
    var paramCommandTitle     = getParamString(['CommandTitle', 'コマンドタイトル']);
    var paramWindowY          = getParamNumber(['WindowY', 'ウィンドウY座標']);
    var paramShowMenu         = getParamBoolean(['ShowMenu', 'メニュー画面を表示']);
    var paramMessage          = getParamString(['Message', 'メッセージ']);
    var paramMessageY         = getParamNumber(['MessageY', 'メッセージY座標']);
    var paramFontSize         = getParamNumber(['FontSize', 'フォントサイズ']);

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
            this.pluginCommandRetryBattle(command.replace(commandPrefix, ''), args);
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

    Game_Interpreter.prototype.pluginCommandRetryBattle = function(command) {
        switch (getCommandName(command)) {
            case '強制リトライ' :
            case 'FORCE_RETRY' :
                if ($gameParty.inBattle()) SceneManager.push(Scene_BattleReturn);
                break;
            case 'リトライ禁止' :
            case 'RETRY_DISABLE' :
                $gameSystem.setRetryDisable(true);
                break;
            case 'リトライ許可' :
            case 'RETRY_ENABLE' :
                $gameSystem.setRetryDisable(false);
                break;
        }
    };

    var _Game_Interpreter_command353      = Game_Interpreter.prototype.command353;
    Game_Interpreter.prototype.command353 = function() {
        var result = _Game_Interpreter_command353.apply(this, arguments);
        BattleManager.goToGameover();
        return result;
    };

    var _Game_Interpreter_command301      = Game_Interpreter.prototype.command301;
    Game_Interpreter.prototype.command301 = function() {
        var result = _Game_Interpreter_command301.apply(this, arguments);
        if (!$gameParty.inBattle()) {
            BattleManager.setBossBattle(this._params[0] <= 1);
        }
        return result;
    };

    //=============================================================================
    // Game_Player
    //  雑魚敵の設定処理をします。
    //=============================================================================
    var _Game_Player_executeEncounter      = Game_Player.prototype.executeEncounter;
    Game_Player.prototype.executeEncounter = function() {
        var result = _Game_Player_executeEncounter.apply(this, arguments);
        if (result) {
            BattleManager.setBossBattle(false);
        }
        return result;
    };

    //=============================================================================
    // Game_System
    //  リトライ禁止フラグを管理します。
    //=============================================================================
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._retryDisable = false;
        this._retryCount   = 0;
    };

    Game_System.prototype.setRetryDisable = function(value) {
        this._retryDisable = !!value;
    };

    Game_System.prototype.isRetryDisable = function() {
        return this._retryDisable;
    };

    Game_System.prototype.addRetryCount = function() {
        this._retryCount = this.getRetryCount() + 1;
    };

    Game_System.prototype.getRetryCount = function() {
        return this._retryCount || 0;
    };

    //=============================================================================
    // Game_BattlerBase
    //  リトライ時はコモンイベント使用を含むアイテムを使用禁止にします。
    //=============================================================================
    var _Game_BattlerBase_meetsUsableItemConditions        = Game_BattlerBase.prototype.meetsUsableItemConditions;
    Game_BattlerBase.prototype.meetsUsableItemConditions = function(item) {
        return _Game_BattlerBase_meetsUsableItemConditions.apply(this, arguments) &&
            this.meetsUsableItemConditionsForRetry(item);
    };

    Game_BattlerBase.prototype.meetsUsableItemConditionsForRetry = function(item) {
        return !(SceneManager.isSceneRetry() && this.isCommonEventItemOf(item));
    };

    Game_BattlerBase.prototype.isCommonEventItemOf = function(item) {
        return item.effects.some(function(effect) {
            return effect.code === Game_Action.EFFECT_COMMON_EVENT;
        });
    };

    //=============================================================================
    // Game_Actor
    //  リトライ時はコモンイベント使用を含むアイテムを使用禁止にします。
    //=============================================================================
    var _Game_Actor_meetsUsableItemConditions = Game_Actor.prototype.meetsUsableItemConditions;
    Game_Actor.prototype.meetsUsableItemConditions = function(item) {
        return _Game_Actor_meetsUsableItemConditions.apply(this, arguments) &&
            this.meetsUsableItemConditionsForRetry(item);
    };

    //=============================================================================
    // BattleManager
    //  リトライ関連処理を追加定義します。
    //=============================================================================
    BattleManager.setupRetry = function() {
        SoundManager.playBattleStart();
        $gameTemp.clearCommonEvent();
        $gameTroop.setup($gameTroop.troop().id);
        $gameSystem.addRetryCount();
    };

    BattleManager.setBossBattle = function(value) {
        this._bossBattle = !!value;
    };

    var _BattleManager_startBattle = BattleManager.startBattle;
    BattleManager.startBattle      = function() {
        DataManager.saveGameForRetry();
        _BattleManager_startBattle.apply(this, arguments);
    };

    var _BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
    BattleManager.updateBattleEnd      = function() {
        _BattleManager_updateBattleEnd.apply(this, arguments);
        this.goToGameover();
    };

    BattleManager.goToGameover = function() {
        if (SceneManager.isNextScene(Scene_Gameover)) {
            Scene_Gameover.firstShow = true;
            SceneManager.push(Scene_Gameover);
        }
    };

    BattleManager.canRetry = function() {
        return !$gameSystem.isRetryDisable() && this.checkBattleType() && paramCommandRetry && DataManager.hasRetryData();
    };

    BattleManager.checkBattleType = function() {
        return (paramRetryNormalEnemy && !this._bossBattle) || (paramRetryBossEnemy && this._bossBattle);
    };

    //=============================================================================
    // DataManager
    //  リトライ用データのセーブとロードを行います。
    //=============================================================================
    DataManager.saveGameForRetry = function() {
        var json = JsonEx.stringify(this.makeSaveContents());
        if (json.length >= 200000) {
            console.warn('Save data too big!');
        }
        this._retryData = LZString.compressToBase64(json);
    };

    DataManager.hasRetryData = function() {
        return !!this._retryData;
    };

    DataManager.loadGameForRetry = function() {
        if (this._retryData) {
            var json = LZString.decompressFromBase64(this._retryData);
            this.extractSaveContents(JsonEx.parse(json));
        }
    };

    //=============================================================================
    // SceneManager
    //  リトライ中かどうかの判定を行います。
    //=============================================================================
    SceneManager.isSceneRetry = function() {
        return this._stack.some(function(scene) {
            return scene === Scene_Gameover;
        });
    };

    //=============================================================================
    // Window_MenuCommand
    //  リトライ用のメニューでセーブを禁止します。
    //=============================================================================
    var _Window_MenuCommand_isSaveEnabled      = Window_MenuCommand.prototype.isSaveEnabled;
    Window_MenuCommand.prototype.isSaveEnabled = function() {
        return _Window_MenuCommand_isSaveEnabled.apply(this, arguments) && !SceneManager.isSceneRetry();
    };

    var _Window_MenuCommand_isGameEndEnabled      = Window_MenuCommand.prototype.isGameEndEnabled;
    Window_MenuCommand.prototype.isGameEndEnabled = function() {
        return _Window_MenuCommand_isGameEndEnabled.apply(this, arguments) && !SceneManager.isSceneRetry();
    };

    //=============================================================================
    // Scene_Gameover
    //  リトライ用データのセーブとロードを行います。
    //=============================================================================
    Scene_Gameover.firstShow = false;

    var _Scene_Gameover_create      = Scene_Gameover.prototype.create;
    Scene_Gameover.prototype.create = function() {
        _Scene_Gameover_create.apply(this, arguments);
        this.createWindowLayer();
        this.createForeground();
        this.createRetryWindow();
    };

    var _Scene_Gameover_start      = Scene_Gameover.prototype.start;
    Scene_Gameover.prototype.start = function() {
        _Scene_Gameover_start.apply(this, arguments);
        if (!Scene_Gameover.firstShow) {
            if (SceneManager.isPreviousScene(Scene_Menu)) {
                this.executeRetry(1);
            }
            if (SceneManager.isPreviousScene(Scene_Load)) {
                this.startFadeIn(this.fadeSpeed(), false);
            }
        }
        Scene_Gameover.firstShow = false;
    };

    var _Scene_Gameover_stop      = Scene_Gameover.prototype.stop;
    Scene_Gameover.prototype.stop = function() {
        if (!SceneManager.isNextScene(Scene_Load) && !SceneManager.isNextScene(Scene_Menu)) {
            _Scene_Gameover_stop.apply(this, arguments);
        } else {
            Scene_Base.prototype.stop.call(this);
        }
    };

    var _Scene_Gameover_terminate      = Scene_Gameover.prototype.terminate;
    Scene_Gameover.prototype.terminate = function() {
        if (!SceneManager.isNextScene(Scene_Load) && !SceneManager.isNextScene(Scene_Menu)) {
            _Scene_Gameover_terminate.apply(this, arguments);
        } else {
            Scene_Base.prototype.terminate.call(this);
        }
    };

    var _Scene_Gameover_playGameoverMusic      = Scene_Gameover.prototype.playGameoverMusic;
    Scene_Gameover.prototype.playGameoverMusic = function() {
        if (!SceneManager.isPreviousScene(Scene_Load)) {
            _Scene_Gameover_playGameoverMusic.apply(this, arguments);
        }
    };

    Scene_Gameover.prototype.createRetryWindow = function() {
        this._retryWindow = new Window_RetryCommand();
        this._retryWindow.setHandler('retry', this.commandRetry.bind(this));
        this._retryWindow.setHandler('load', this.commandLoad.bind(this));
        this._retryWindow.setHandler('title', this.commandTitle.bind(this));
        this.addWindow(this._retryWindow);
    };

    Scene_Gameover.prototype.createForeground = function() {
        this._messageWindow                   = new Window_Base(0, 0, 0, 0);
        this._messageWindow.opacity           = 0;
        this._messageWindow.contents.fontSize = paramFontSize;
        this.addWindow(this._messageWindow);
        if (paramMessage) {
            this.drawMessage();
        }
    };

    Scene_Gameover.prototype.drawMessage = function() {
        var padding = this._messageWindow.padding;
        var width   = this._messageWindow.drawTextEx(paramMessage, 0, 0) + padding * 2;
        var height  = paramFontSize + 8 + padding * 2;
        var x       = Graphics.boxWidth / 2 - width / 2;
        this._messageWindow.move(x, paramMessageY, width, height);
        this._messageWindow.createContents();
        this._messageWindow.drawTextEx(paramMessage, 0, 0);
    };

    Scene_Gameover.prototype.commandRetry = function() {
        DataManager.loadGameForRetry();
        if (paramShowMenu) {
            SceneManager.push(Scene_Menu);
        } else {
            this._retryWindow.close();
            this.executeRetry(this.fadeSpeed());
        }
    };

    Scene_Gameover.prototype.commandLoad = function() {
        this._retryWindow.close();
        SceneManager.push(Scene_Load);
    };

    Scene_Gameover.prototype.commandTitle = function() {
        this._retryWindow.close();
        this.gotoTitle();
    };

    Scene_Gameover.prototype.executeRetry = function(fade) {
        BattleManager.setupRetry();
        this.popScene();
        this.startFadeOut(fade, true);
    };

    Scene_Gameover.prototype.update = function() {
        if (!this.isBusy()) {
            this._retryWindow.open();
        }
        Scene_Base.prototype.update.call(this);
    };

    Scene_Gameover.prototype.isBusy = function() {
        return this._retryWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
    };

    //=============================================================================
    // Scene_Base
    //  リトライ状態からの再ゲームオーバーを禁止します。
    //=============================================================================
    var _Scene_Base_checkGameover      = Scene_Base.prototype.checkGameover;
    Scene_Base.prototype.checkGameover = function() {
        return !SceneManager.isSceneRetry() && _Scene_Base_checkGameover.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Load
    //  ロード時にゲームオーバーMEを止めます。
    //=============================================================================
    var _Scene_Load_onLoadSuccess      = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function() {
        if (SceneManager.isSceneRetry()) {
            AudioManager.stopAll();
        }
        _Scene_Load_onLoadSuccess.apply(this, arguments);
    };

    //=============================================================================
    // Scene_BattleReturn
    //  そのまま戦闘画面に戻ります。
    //=============================================================================
    function Scene_BattleReturn() {
        this.initialize.apply(this, arguments);
    }

    Scene_BattleReturn.prototype             = Object.create(Scene_Gameover.prototype);
    Scene_BattleReturn.prototype.constructor = Scene_BattleReturn;

    Scene_BattleReturn.prototype.create = function() {
    };

    Scene_BattleReturn.prototype.start = function() {
        this.executeRetry(this.fadeSpeed());
    };

    Scene_BattleReturn.prototype.isBusy = function() {
        return Scene_Base.prototype.isBusy.call(this);
    };

    //=============================================================================
    // Window_RetryCommand
    //  リトライ用コマンドウィンドウです。
    //=============================================================================
    function Window_RetryCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_RetryCommand.prototype             = Object.create(Window_Command.prototype);
    Window_RetryCommand.prototype.constructor = Window_RetryCommand;

    Window_RetryCommand.prototype.initialize = function() {
        Window_Command.prototype.initialize.call(this, 0, 0);
        this.updatePlacement();
        this.openness = 0;
    };

    Window_RetryCommand.prototype.windowWidth = function() {
        return 180;
    };

    Window_RetryCommand.prototype.updatePlacement = function() {
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = paramWindowY;
    };

    Window_RetryCommand.prototype.makeCommandList = function() {
        if (BattleManager.canRetry()) this.addCommand(paramCommandRetry, 'retry');
        if (paramCommandLoad) this.addCommand(paramCommandLoad, 'load');
        this.addCommand(paramCommandTitle, 'title');
    };
})();

