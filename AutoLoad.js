//=============================================================================
// AutoLoad.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.0 2019/11/25 コミュニティ版コアスクリプト1.6以降のオートセーブ機能との競合を解消
//                  タイトル画面をスキップせず、コンティニュー選択時にオートロードする機能を追加
//                  パラメータ仕様変更
// 1.2.4 2018/09/16 LoadPoint.jsとの競合を解消
// 1.2.3 2018/08/30 MadeWithMv.jsとの競合を解消
// 1.2.2 2018/01/10 マップ画面を使った独自のタイトルでセーブ時のピクチャが表示されていた問題を修正
// 1.2.1 2016/09/18 YEP_EquipCore.jsとの競合を解消
// 1.2.0 2016/09/17 マップ画面を使った独自のタイトル画面が作成できる機能を追加
// 1.1.1 2016/09/16 完全スキップがONかつセーブデータが存在しない場合にゲームを開始できない問題を修正
// 1.1.0 2016/09/16 ゲーム終了やタイトルに戻るの場合もタイトル画面をスキップできる機能を追加
// 1.0.0 2016/05/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Auto load plugin
 * @author triacontane
 *
 * @param PlaySe
 * @desc セーブ成功時にシステム効果音を演奏します。
 * @default true
 * @type boolean
 *
 * @param TileSkipPolicy
 * @desc タイトル画面のスキップ仕様です。
 * @default 1
 * @type select
 * @option None
 * @value 0
 * @option Normal Skip
 * @value 1
 * @option Completely Skip
 * @value 2
 *
 * @param TitleMapID
 * @desc 独自にタイトル画面用のマップを作成する場合に指定するマップIDです。
 * @default 0
 * @type number
 *
 * @help 以下の機能でタイトル画面の仕様を変更します。
 * マップ画面を使ったオリジナルタイトル画面などが作れます。
 *
 * １．セーブファイルが存在する場合、タイトル画面をスキップします。
 *
 * ２．セーブ画面を経由せずに最後にアクセスしたセーブファイルに
 * 直接セーブするプラグインコマンドを提供します。
 *
 * ３．設定次第で通常のタイトル画面を完全にスキップできます。
 * 「タイトルに戻る」場合もニューゲームか最新のセーブファイルを
 * ロードするようになります。
 *
 * ４．特定のマップをオリジナルタイトル画面として定義できます。
 * マップや遠景などを使って独自のタイトル画面を演出できます。
 * 以下の手順を踏んでください。
 *
 * ４－１．「タイトルマップID」にタイトル用マップのマップIDを設定する。
 * ４－２．タイトル用マップのイベントでタイトル処理を実装する。
 * ４－３．プラグインコマンド「AL_MOVE_LAST_SAVEPOINT」で最後セーブ地点に移動する。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * AL_オートセーブ         # 最後にアクセスしたセーブIDにセーブします。
 * AL_AUTO_SAVE            # 同上
 * AL_最終セーブ地点へ移動 # 最後にセーブした場所へ移動します。
 * AL_MOVE_LAST_SAVEPOINT  # 同上
 * AL_初期位置へ移動       # データベース上のパーティの初期位置へ移動します。
 * AL_MOVE_INITIAL_POINT   # 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc タイトル画面仕様変更プラグイン
 * @author トリアコンタン
 *
 * @param 効果音演奏
 * @desc オートセーブ成功時にシステム効果音を演奏します。
 * @default true
 * @type boolean
 *
 * @param タイトルスキップポリシー
 * @desc タイトル画面のスキップ仕様です。
 * @default 1
 * @type select
 * @option スキップなし(コンティニューを選択するとオートロード)
 * @value 0
 * @option 通常スキップ(起動時のみスキップ)
 * @value 1
 * @option 完全スキップ(タイトルに戻った場合もスキップ)
 * @value 2
 *
 * @param タイトルマップID
 * @desc 独自にタイトル画面用のマップを作成する場合に指定するマップIDです。
 * @default 0
 * @type number
 *
 * @help 以下の機能でタイトル画面の仕様を変更します。
 * マップ画面を使ったオリジナルタイトル画面などが作れます。
 *
 * １．セーブファイルが存在する場合、タイトル画面をスキップします。
 *
 * ２．セーブ画面を経由せずに最後にアクセスしたセーブファイルに
 * 直接セーブするプラグインコマンドを提供します。
 *
 * ３．設定次第で通常のタイトル画面を完全にスキップできます。
 * 「タイトルに戻る」場合もニューゲームか最新のセーブファイルを
 * ロードするようになります。
 *
 * ４．特定のマップをオリジナルタイトル画面として定義できます。
 * マップや遠景などを使って独自のタイトル画面を演出できます。
 * 以下の手順を踏んでください。
 *
 * ４－１．「タイトルマップID」にタイトル用マップのマップIDを設定する。
 * ４－２．タイトル用マップのイベントでタイトル処理を実装する。
 * ４－３．プラグインコマンド「AL_MOVE_LAST_SAVEPOINT」で最後セーブ地点に移動する。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * AL_オートセーブ         # 最後にアクセスしたセーブIDにセーブします。
 * AL_AUTO_SAVE            # 同上
 * AL_最終セーブ地点へ移動 # 最後にセーブした場所へ移動します。
 * AL_MOVE_LAST_SAVEPOINT  # 同上
 * AL_初期位置へ移動       # データベース上のパーティの初期位置へ移動します。
 * AL_MOVE_INITIAL_POINT   # 同上
 *
 * MadeWithMv.jsと併用するときは、このプラグインを下に配置してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'AutoLoad';
    var metaTagPrefix = 'AL';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramPlaySe         = getParamBoolean(['PlaySe', '効果音演奏']);
    var paramTitleMapId     = getParamNumber(['TitleMapID', 'タイトルマップID'], 0);
    var paramTileSkipPolicy = getParamNumber(['TileSkipPolicy', 'タイトルスキップポリシー'], 0, 2);

    var $gameScreenBack = null;

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var commandPrefix = new RegExp('^' + metaTagPrefix);
        if (!command.match(commandPrefix)) return;
        this.pluginCommandAutoLoad(command.replace(commandPrefix, ''), args);
    };

    Game_Interpreter.prototype.pluginCommandAutoLoad = function(command) {
        switch (getCommandName(command)) {
            case '_オートセーブ' :
            case '_AUTO_SAVE' :
                this._index++;
                $gameSystem.saveLastAccess();
                this._index--;
                break;
            case '_初期位置へ移動' :
            case '_MOVE_INITIAL_POINT' :
                $gamePlayer.moveInitialPoint();
                this.setWaitMode('transfer');
                break;
            case '_最終セーブ地点へ移動' :
            case '_MOVE_LAST_SAVEPOINT' :
                $gamePlayer.moveLastSavePoint();
                this.setWaitMode('transfer');
                break;
        }
    };

    //=============================================================================
    // Game_System
    //  自動セーブ処理を追加定義します。
    //=============================================================================
    Game_System.prototype.saveLastAccess = function() {
        this.onBeforeSave();
        var result = DataManager.saveLastAccessGame();
        if (result && paramPlaySe) {
            SoundManager.playSave();
        }
    };

    var _Game_System_onBeforeSave      = Game_System.prototype.onBeforeSave;
    Game_System.prototype.onBeforeSave = function() {
        _Game_System_onBeforeSave.apply(this, arguments);
        $gamePlayer.setLastSavePoint();
    };

    //=============================================================================
    // Game_Player
    //  セーブ時点での状態を保持します。
    //=============================================================================
    Game_Player.prototype.setLastSavePoint = function() {
        this._lastSaveMapId       = $gameMap.mapId();
        this._lastSaveX           = this.x;
        this._lastSaveY           = this.y;
        this._lastSaveTransparent = this.isTransparent();
    };

    Game_Player.prototype.moveLastSavePoint = function() {
        if (this.isExistLastSavePoint()) {
            this.setTransparent(this._lastSaveTransparent);
            this.reserveTransfer(this._lastSaveMapId, this._lastSaveX, this._lastSaveY, this.direction(), 0);
            this._requestLoad = true;
        }
        if ($gamePlayer.moveLoadPoint) {
            $gamePlayer.moveLoadPoint();
        }
    };

    var _Game_Player_clearTransferInfo = Game_Player.prototype.clearTransferInfo;
    Game_Player.prototype.clearTransferInfo = function() {
        _Game_Player_clearTransferInfo.apply(this, arguments);
        if (this._requestLoad) {
            $gameSystem.onAfterLoad();
            $gameScreen = $gameScreenBack;
            $gameScreen.startFadeIn(1);
            this._requestLoad = false;
        }
    };

    Game_Player.prototype.moveInitialPoint = function() {
        $gamePlayer.reserveTransfer($dataSystem.startMapId,
            $dataSystem.startX, $dataSystem.startY, this.direction(), 0);
        this.setTransparent($dataSystem.optTransparent);
    };

    Game_Player.prototype.isExistLastSavePoint = function() {
        return !!this._lastSaveMapId;
    };

    //=============================================================================
    // DataManager
    //  自動セーブ処理を追加定義します。
    //=============================================================================
    var _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        if (this.processEquipNotetags1 !== undefined) {
            Yanfly._loaded_YEP_EquipCore = false;
        }
        _DataManager_loadDatabase.apply(this, arguments);
    };

    DataManager.saveLastAccessGame = function() {
        var saveFileId = this.lastAccessedSavefileId();
        var result     = this.saveGame(saveFileId);
        if (result) StorageManager.cleanBackup(saveFileId);
        return result;
    };

    DataManager.autoLoadGame = function() {
        var saveFileId = this.latestSavefileId();
        var result     = false;
        if (this.isAnySavefileExists()) {
            result = this.loadGame(saveFileId);
        }
        return result;
    };

    //=============================================================================
    // Scene_Boot
    //  タイトル画面をとばしてマップ画面に遷移します。
    //=============================================================================
    var _Scene_Boot_start      = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        if (this.isTitleSkip()) {
            this.goToAutoLoad();
        }
    };

    Scene_Boot.prototype.isTitleSkip = function() {
        return !DataManager.isBattleTest() && !DataManager.isEventTest() &&
            typeof Scene_Splash === 'undefined' && paramTileSkipPolicy !== 0;
    };

    Scene_Boot.prototype.goToAutoLoad = function() {
        var result = this.applyAutoLoad();
        if (!result && (paramTileSkipPolicy === 2 || paramTitleMapId > 0)) {
            this.goToNewGame();
        }
        if (paramTitleMapId > 0) {
            $gamePlayer.reserveTransfer(paramTitleMapId, 0, 0);
            $gamePlayer.setTransparent(true);
        }
    };

    Scene_Boot.prototype.goToNewGame = function() {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    };

    Scene_Base.prototype.applyAutoLoad = function() {
        var result = DataManager.autoLoadGame();
        if (result) {
            Scene_Load.prototype.reloadMapIfUpdated.call(this);
            SceneManager.goto(Scene_Map);
            if (!paramTitleMapId) {
                $gameSystem.onAfterLoad();
            } else {
                $gameScreenBack = $gameScreen;
                $gameScreen = new Game_Screen();
            }
            if ($gamePlayer.moveLoadPoint) {
                $gamePlayer.moveLoadPoint();
            }
        }
        return result;
    };

    //=============================================================================
    // Scene_Title
    //  完全スキップの場合にScene_Bootで上書きします。
    //=============================================================================
    if (paramTileSkipPolicy === 2 || paramTitleMapId > 0) {
        Scene_Title = Scene_Boot;
    }

    var _Scene_Title_commandContinue = Scene_Title.prototype.commandContinue;
    Scene_Title.prototype.commandContinue = function() {
        _Scene_Title_commandContinue.apply(this, arguments);
        this.fadeOutAll();
        this._requestAutoLoad = true;
    };

    var _Scene_Title_terminate = Scene_Title.prototype.terminate;
    Scene_Title.prototype.terminate = function() {
        _Scene_Title_terminate.apply(this, arguments);
        if (this._requestAutoLoad) {
            this.applyAutoLoad();
        }
    };

    if (typeof Scene_Splash !== 'undefined') {
        Scene_Splash.prototype.goToAutoLoad = Scene_Boot.prototype.goToAutoLoad;
        Scene_Splash.prototype.goToNewGame = Scene_Boot.prototype.goToNewGame;

        var _Scene_Splash_gotoTitleOrTest = Scene_Splash.prototype.gotoTitleOrTest;
        Scene_Splash.prototype.gotoTitleOrTest = function() {
            _Scene_Splash_gotoTitleOrTest.apply(this, arguments);
            if (SceneManager.isNextScene(Scene_Title)) {
                this.goToAutoLoad();
            }
        };
    }
})();

