//=============================================================================
// MenuSubCommand.js
// ----------------------------------------------------------------------------
// (C) 2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 4.1.0 2022/06/13 サブウィンドウを透過しない設定を追加、サブウィンドウの開閉にアニメーションを付ける設定を追加
// 4.0.2 2022/06/10 コマンド選択時に消去：OFF、メンバー選択あり：ON、親がひとつしかないサブコマンドを選択するとエラーになる現象を修正
// 4.0.1 2022/05/20 コマンドのデフォルト揃えが中央揃えになっていたので、プラグイン側もデフォルトを中央揃えに変更
// 4.0.0 2022/02/11 サブメニューの表示位置のパラメータ仕様を変更し、ウィンドウの好きな位置に追加できるよう修正
// 3.1.0 2021/12/09 サブメニューで選択したアクターのIDをマップ遷移時以外でも設定するよう変更
// 3.0.1 2020/10/15 スクリプトに凡例追加
// 3.0.0 2020/10/10 MZ向けに全面リファクタリング
// 2.7.3 2020/08/18 イベントの一時消去後にサブコマンドマップに移動して戻ってきたときに消去状態が復元されるよう修正
// 2.7.2 2020/04/03 2.5.0で適用したMOG_SceneMenu.jsとの競合解消と、2.0.1で適用したMOG_MenuCursor.jsとの競合解消を両立できるよう修正
// 2.7.1 2020/03/13 Window_MenuCommandの初期化で引数を渡し忘れていたのを修正
// 2.7.0 2019/10/25 メニューマップと通常マップのピクチャの表示状態を別々に管理できる機能を追加
// 2.6.1 2019/10/12 2.6.0の修正で、メニューを開いたあと一度もサブコマンドを開かずにメニューを閉じるとエラーになる問題を修正
//                  その他軽微な不具合の修正
// 2.6.0 2019/09/16 サブコマンドのスクリプト実行後、マップに戻る機能を追加
//                  MOG_MenuBackground.jsとの競合を解消
//                  サブコマンドをキャンセル後、スキルや装備コマンドを選択して戻ると、再度サブコマンドにフォーカスする問題を修正
//                  サブコマンドの座標固定値設定で、XかYいずれかひとつの値を設定していると設定が有効になるよう仕様変更
// 2.5.2 2019/09/08 2.0.1で対策して、2.5.0で何らかの理由で元に戻した競合対策を再度有効化
// 2.5.1 2019/07/11 FixCursorSeByMouse.jsとの競合対策のためメソッド名を変更
// 2.5.0 2018/11/25 サブメニューの絶対座標と揃えを設定できる機能を追加
//                  MOG_SceneMenu.jsとの競合を解消
// 2.4.1 2018/11/24 用語辞典プラグインと連携する方法をヘルプに記載
// 2.4.0 2018/09/26 サブコマンドを逐次消去するオプションを追加
// 2.3.0 2018/09/26 サブコマンドを横並べにするオプションを追加
// 2.2.1 2018/01/28 サブコマンドを選択後メニューに戻って通常コマンドを選択し、さらにメニューに戻ったときに最初のサブコマンドが展開される問題を修正
// 2.2.0 2018/01/07 同名の親コマンドを指定できる機能を追加
// 2.1.0 2017/12/24 対象メンバーを選択するサブコマンド選択時にメニューコマンドをその名前に置き換える処理を追加
//                  メニューへ戻った際に対象メンバー選択やサブコマンド選択に戻るように変更
// 2.0.1 2017/11/19 MOG_MenuCursor.jsとの併用時、カーソルがサブコマンドの下に隠れてしまう競合の解消
// 2.0.0 2017/09/04 メニューコマンドやサブコマンドを好きなだけ追加できるようパラメータの仕様を変更
// 1.1.0 2017/05/14 デフォルトのオプションとゲーム終了コマンドを削除できる機能を追加
//                  カンマ(,)を含むスクリプトを正しく実行できない問題を修正
// 1.0.3 2017/04/09 サブコマンドマップから戻ってきたときにイベント位置を復元できるよう修正
// 1.0.2 2017/04/08 サブコマンドマップから戻ってきたときにフォロワー位置を復元できるよう修正
// 1.0.1 2017/04/08 サブコマンドマップから戻ってきたタイミングでセーブしたときにロード時の位置がサブコマンドマップに
//                  なってしまう問題を修正
//                  戦闘リトライプラグインと併用したときにリトライ中は、マップ移動するメニューを使用禁止に設定
// 1.0.0 2017/04/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc メニュー画面のサブコマンドプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MenuSubCommand.js
 * @author トリアコンタン
 * @base PluginCommonBase
 *
 * @param subCommands
 * @text サブコマンド
 * @desc サブコマンド情報です。
 * @default
 * @type struct<SubCommand>[]
 *
 * @param commandPosition
 * @text コマンド追加位置
 * @desc サブコマンド群を追加する位置です。0を指定すると、ウィンドウの先頭に追加されます。
 * @default 0
 * @type number
 *
 * @param subMenuWidth
 * @text サブメニュー横幅
 * @desc サブメニューを表示するウィンドウの横幅です。指定しない場合デフォルト値「240」が適用されます。
 * @default 0
 * @type number
 *
 * @param selectActorIdVariable
 * @text 選択アクターID変数
 * @desc サブコマンドからアクターを選択したとき、そのアクターのIDを格納する変数番号です。
 * @default 0
 * @type variable
 *
 * @param windowSkin
 * @text ウィンドウスキン
 * @desc サブコマンド用のウィンドウに専用のスキンを設定します。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param hideOption
 * @text オプション消去
 * @desc メインメニューからオプションを消去します。
 * @default false
 * @type boolean
 *
 * @param hideGameEnd
 * @text ゲーム終了消去
 * @desc メインメニューからゲーム終了を消去します。
 * @default false
 * @type boolean
 *
 * @param horizontalSubMenu
 * @text 横並び
 * @desc サブメニューのコマンドを横に並べます。
 * @default false
 * @type boolean
 *
 * @param clearSubMenuOneByObe
 * @text コマンド選択時に消去
 * @desc サブコマンドを選択したタイミングでウィンドウを消去します。
 * @default true
 * @type boolean
 *
 * @param subMenuX
 * @text サブメニューX座標
 * @desc 指定するとサブコマンドのX座標が固定値になります。
 * @default 0
 * @type number
 *
 * @param subMenuY
 * @text サブメニューY座標
 * @desc 指定するとサブコマンドのY座標が固定値になります。
 * @default 0
 * @type number
 *
 * @param adjustX
 * @text サブメニューX座標補正
 * @desc サブコマンドのX座標を指定した値だけ補正します。
 * @default 0
 * @type number
 * @min -9999
 *
 * @param adjustY
 * @text サブメニューY座標補正
 * @desc サブコマンドのY座標を指定した値だけ補正します。
 * @default 0
 * @type number
 * @min -9999
 *
 * @param subMenuAlign
 * @text サブメニュー揃え
 * @desc サブコマンドの揃えを設定します。
 * @default
 * @type select
 * @option 左揃え
 * @value left
 * @option 中央揃え(デフォルト)
 * @value center
 * @option 右揃え
 * @value right
 *
 * @param overlapOther
 * @text 他ウィンドウに重ねる
 * @desc サブメニューウィンドウを透過し、背後のウィンドウが見えるようにします。
 * @type boolean
 * @default true
 *
 * @param openAnimation
 * @text 開閉アニメ表示
 * @desc サブメニューウィンドウを表示するとき開閉アニメーションを表示します。
 * @type boolean
 * @default false
 *
 * @param anotherPicInMenuMap
 * @text メニューピクチャ別管理
 * @desc メニューマップと通常マップのピクチャの表示状態を別々に管理します。
 * @default false
 * @type boolean
 *
 * @param autoTransparent
 * @text 自動で透明化
 * @desc サブマップ移動時に自働でプレイヤーを透明にします。
 * @default true
 * @type boolean
 *
 * @help MenuSubCommand.js
 *
 * メインメニュー画面に任意の名前のコマンドおよび
 * ツリー表示されるサブコマンドを好きなだけ追加できます。
 * サブコマンドを実行（決定）すると、任意のスクリプトが実行されるか、
 * もしくは指定したマップに移動します。（両方も可能）
 *
 * スクリプトは、主にスクリプトで組まれた別画面に遷移する場合に使用します。
 * もちろん他のプラグインで追加された画面にも遷移可能です。
 * マップ移動は主にイベントによる自作メニュー画面に遷移する場合に使用します。
 * 自作メニュー画面から戻る際は、再度メニューを開いてください。
 * 元々メニューを開いていた場所は別途保存しているので意識する必要はありません。
 *
 * また、通常の縦レイアウトとメニュー画面はもちろん、
 * プラグインによる横レイアウトのメニュー画面にも対応しています。
 *
 * サブコマンドが全て非表示だった場合、親項目自体も非表示になります。
 * 同じく全て使用禁止だった場合、親項目自体も使用禁止になります。
 *
 * サブコマンドがひとつしかない場合、サブコマンドウィンドウは表示されず
 * 親コマンドを選択した時点でサブコマンドを実行します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~SubCommand:
 *
 * @param CommandId
 * @text コマンドID
 * @desc サブコマンドの識別番号。この番号と名称とでコマンドがまとめられます。通常は全て0で問題ありません。
 * @default 0
 *
 * @param Name
 * @text コマンド名称
 * @desc サブコマンドとして表示される名称
 * @default サブコマンド1
 *
 * @param ParentName
 * @text 親名称
 * @desc メインコマンドに表示されるサブコマンドの親名称。同一の名称の親を持つサブコマンドは一つに纏められます。
 * @default 親コマンド1
 *
 * @param HiddenSwitchId
 * @text 非表示スイッチ番号
 * @desc ONのときコマンドが非表示になるスイッチID
 * @default 0
 * @type switch
 *
 * @param DisableSwitchId
 * @text 使用禁止スイッチ番号
 * @desc ONのときコマンドが使用禁止になるスイッチID
 * @default 0
 * @type switch
 *
 * @param Script
 * @text スクリプト
 * @desc コマンドを決定したときに実行されるスクリプト
 * @default
 * @type combo
 * @option this.commandItem(); // アイテム画面を開く
 * @option this.commandSave(); // セーブ画面を開く
 * @option this.commandOptions(); // オプション画面を開く
 * @option this.commandGlossary(1); // 用語辞典を呼ぶ(用語辞典プラグイン使用時)
 * @option $gameSwitches.setValue(1, true); // スイッチ[1]をONにする
 * @option $gameVariables.setValue(1, 10); // 変数[1]に[10]を代入する
 * @option $gameTemp.reserveCommonEvent(1); // マップに戻った後でコモンイベント[1]を呼ぶ
 *
 * @param ReturnMap
 * @text マップに戻るかどうか
 * @desc スクリプト実行後にマップに戻ります。
 * @default false
 * @type boolean
 *
 * @param MapId
 * @text 遷移先マップID
 * @desc コマンドを決定したときに移動するマップID
 * @default 0
 *
 * @param SelectMember
 * @text メンバー選択あり
 * @desc コマンド実行前に対象メンバーを選択するかどうか
 * @default false
 * @type boolean
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.subCommands) {
        param.subCommands = [];
    }

    //=============================================================================
    // Game_Temp
    //  メニューコマンド情報を構築して保持します。
    //=============================================================================
    const _Game_Temp_initialize      = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this.createMenuCommands();
    };

    Game_Temp.prototype.createMenuCommands = function() {
        this._menuParentCommands = new Map();
        param.subCommands.forEach(function(commands) {
            this.createMenuCommand(commands);
        }, this);
        /* 最後に選択したサブコマンド */
        this._lastSubCommand = {
            parent: null,
            index : 0
        };
    };

    Game_Temp.prototype.createMenuCommand = function(commands) {
        const parentName = commands.ParentName + commands.CommandId;
        if (!this._menuParentCommands.has(parentName)) {
            this._menuParentCommands.set(parentName, []);
        }
        const parent = this._menuParentCommands.get(parentName);
        parent.push(new Game_MenuSubCommand(commands));
    };

    Game_Temp.prototype.iterateMenuParents = function(callBackFunc, thisArg) {
        this._menuParentCommands.forEach(callBackFunc, thisArg);
    };

    Game_Temp.prototype.getSubMenuCommands = function(parentName) {
        return this._menuParentCommands.get(parentName);
    };

    /**
     * 最後に選択したサブコマンドを取得する
     */
    Game_Temp.prototype.getLastSubCommand = function() {
        return this._lastSubCommand;
    };

    Game_Temp.prototype.setLastSubCommandParent = function(parentName) {
        this._lastSubCommand.parent = parentName;
    };

    Game_Temp.prototype.setLastSubCommandIndex = function(index) {
        this._lastSubCommand.index = index;
    };

    /**
     * 最後に選択したサブコマンドをリセットする
     */
    Game_Temp.prototype.resetLastSubCommand = function() {
        this._lastSubCommand = {
            parent: null,
            index : 0
        };
    };

    //=============================================================================
    // Game_CharacterBase
    //  サブコマンドマップへ移動します。
    //=============================================================================
    Game_CharacterBase.prototype.savePosition = function() {
        this._originalX         = this.x;
        this._originalY         = this.y;
        this._originalDirection = this.direction();
    };

    Game_CharacterBase.prototype.restorePosition = function() {
        this.locate(this._originalX, this._originalY);
        this.setDirection(this._originalDirection);
    };

    //=============================================================================
    // Game_Player
    //  サブコマンドマップへ移動します。
    //=============================================================================
    Game_Player.prototype.reserveTransferToSubCommandMap = function(subCommandMapId) {
        this.saveOriginalMap();
        this.reserveTransfer(subCommandMapId, 0, 0, 0, 2);
        if (param.autoTransparent) {
            this.setTransparent(true);
            this._followers.data().forEach(follower => follower.setTransparent(true));
        }
        if (param.anotherPicInMenuMap) {
            $gameScreen.setupMenuMapPictures();
        }
        this._originalMapData = $dataMap;
    };

    Game_Player.prototype.reserveTransferToOriginalMap = function() {
        $dataMap = this._originalMapData;
        this.reserveTransfer(this._originalMapId, this._originalX, this._originalY, this._originalDirection, 2);
        if (param.autoTransparent) {
            this.setTransparent(this._originalTransparent);
            this._followers.data().forEach(follower => follower.setTransparent(this._originalTransparent));
        }
        this._originalMapId             = 0;
        this._transferringToOriginalMap = true;
        if (param.anotherPicInMenuMap) {
            $gameScreen.restoreNormalMapPictures();
        }
    };

    Game_Player.prototype.isInSubCommandMap = function() {
        return this._originalMapId > 0;
    };

    Game_Player.prototype.isTransferringToOriginalMap = function() {
        return this._transferringToOriginalMap;
    };

    Game_Player.prototype.saveOriginalMap = function() {
        this._originalMapId       = $gameMap.mapId();
        this._originalTransparent = this._transparent;
        this.savePosition();
    };

    const _Game_Player_performTransfer      = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _Game_Player_performTransfer.apply(this, arguments);
        if (this.isTransferringToOriginalMap()) {
            this.restorePosition();
            this._transferringToOriginalMap = false;
        }
    };

    Game_Player.prototype.savePosition = function() {
        Game_CharacterBase.prototype.savePosition.call(this, arguments);
        this._followers.data().forEach(follower => follower.savePosition());
        $gameMap.saveAllEventPosition();
    };

    Game_Player.prototype.restorePosition = function() {
        Game_CharacterBase.prototype.restorePosition.call(this, arguments);
        this._followers.data().forEach(follower => follower.restorePosition());
        $gameMap.restoreAllEventPosition();
    };

    //=============================================================================
    // Game_Map
    //  すべてのイベントの位置を保存します。
    //=============================================================================
    Game_Map.prototype.saveAllEventPosition = function() {
        this._eventPositions = [];
        this._eventErases = [];
        this.events().forEach(function(event) {
            const position                          = {};
            position.x                            = event.x;
            position.y                            = event.y;
            position.direction                    = event.direction();
            this._eventPositions[event.eventId()] = position;
            this._eventErases[event.eventId()]    = event._erased;
        }, this);
    };

    Game_Map.prototype.restoreAllEventPosition = function() {
        this.events().forEach(function(event) {
            const position = this._eventPositions[event.eventId()];
            if (position) {
                event.locate(position.x, position.y);
                event.setDirection(position.direction);
            }
            const erase = this._eventErases[event.eventId()];
            if (erase) {
                event.erase();
            }
        }, this);
        this._eventPositions = [];
    };

    //=============================================================================
    // Game_Party
    //  無効なアクター設定時のエラーを回避します。
    //=============================================================================
    const _Game_Party_setMenuActor      = Game_Party.prototype.setMenuActor;
    Game_Party.prototype.setMenuActor = function(actor) {
        if (!actor) return;
        _Game_Party_setMenuActor.apply(this, arguments);
    };

    Game_Screen.prototype.setupMenuMapPictures = function() {
        this._normalMapPictures = this._pictures;
        this.clearPictures();
    };

    Game_Screen.prototype.restoreNormalMapPictures = function() {
        if (this._normalMapPictures) {
            this._pictures = this._normalMapPictures;
        }
        this._normalMapPictures = null;
    };

    //=============================================================================
    // AudioManager
    //  システム効果音を消音します。
    //=============================================================================
    AudioManager.stopAllStaticSe = function() {
        this._staticBuffers.forEach(function(buffer) {
            buffer.stop();
        });
        this._staticBuffers = [];
    };

    //=============================================================================
    // SceneManager
    //  メニュー用マップではキャプチャを無効にします。
    //=============================================================================
    const _SceneManager_snapForBackground = SceneManager.snapForBackground;
    SceneManager.snapForBackground      = function() {
        if ($gamePlayer.isInSubCommandMap()) return;
        _SceneManager_snapForBackground.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Map
    //  自作ゲーム用マップ遷移の場合、一部演出を無効化します。
    //=============================================================================
    const _Scene_Map_callMenu      = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function() {
        _Scene_Map_callMenu.apply(this, arguments);
        if ($gamePlayer.isInSubCommandMap()) {
            AudioManager.stopAllStaticSe();
            SoundManager.playCancel();
        }
    };

    const _Scene_Map_onMapLoaded      = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.apply(this, arguments);
        if ($gamePlayer.isInSubCommandMap()) {
            this._transfer = false;
        }
    };

    //=============================================================================
    // Scene_Menu
    //  メインメニューにコマンドを追加します。
    //=============================================================================
    const _Scene_Menu_create      = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.apply(this, arguments);
        this.loadSubCommandWindowSkin();
        if ($gamePlayer.isInSubCommandMap()) {
            $gamePlayer.reserveTransferToOriginalMap();
        }
        if (this._isSubCommandOkAfterCreate) {
            this.onSubCommandOk();
        }
    };

    Scene_Menu.prototype.loadSubCommandWindowSkin = function() {
        if (param.windowSkin) {
            ImageManager.loadSystem(param.windowSkin);
        }
    };

    const _Scene_Menu_isReady      = Scene_Menu.prototype.isReady;
    Scene_Menu.prototype.isReady = function() {
        return _Scene_Menu_isReady.apply(this, arguments) &&
            (!$gamePlayer.isTransferringToOriginalMap() || DataManager.isMapLoaded());
    };

    const _Scene_Menu_start      = Scene_Menu.prototype.start;
    Scene_Menu.prototype.start = function() {
        _Scene_Menu_start.apply(this, arguments);
        if ($gamePlayer.isTransferringToOriginalMap()) {
            $gamePlayer.performTransfer();
        }
    };

    const _Scene_Menu_createCommandWindow      = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.apply(this, arguments);
        $gameTemp.iterateMenuParents((subCommands, parentName) => {
            this._commandWindow.setHandler('parent' + parentName, this.commandParent.bind(this));
        });
        this._commandWindow.rightInputMode = this.isRightInputMode();
        this.selectLastCommand();
    };

    Scene_Menu.prototype.commandParent = function() {
        const parentName  = this._commandWindow.currentExt();
        const subCommands = $gameTemp.getSubMenuCommands(parentName);
        $gameTemp.setLastSubCommandParent(parentName);
        if (subCommands.length === 1) {
            this.onSubCommandOk(subCommands[0]);
        } else {
            if (!param.clearSubMenuOneByObe && this._subMenuWindow) {
                this._subMenuWindow.activate();
            } else {
                this.createSubMenuCommandWindow(parentName);
            }
        }
    };

    Scene_Menu.prototype.createSubMenuCommandWindow = function(parentName) {
        this._subMenuWindow = new Window_MenuSubCommand(this.createSubCommandRect(), parentName);
        this._subMenuWindow.updatePlacement(this._commandWindow);
        this._subMenuWindow.setHandler('ok', this.onSubCommandOk.bind(this));
        this._subMenuWindow.setHandler('cancel', this.onSubCommandCancel.bind(this));
        // for MOG_MenuBackground.js
        if (typeof this._subMenuWindow.updateBackgroundOpacity === 'function') {
            this._subMenuWindow.updateBackgroundOpacity();
        }
        this.addWindow(this._subMenuWindow);
        if (this._subMenuClosing) {
            this._windowLayer.removeChild(this._subMenuClosing);
            this._subMenuClosing = null;
        }
    };

    Scene_Menu.prototype.createSubCommandRect = function() {
        return new Rectangle(this.x, this.y, 1, 1);
    };

    Scene_Menu.prototype.removeSubMenuCommandWindow = function() {
        if (this._subMenuWindow) {
            if (param.openAnimation) {
                this._subMenuWindow.close();
                this._subMenuClosing = this._subMenuWindow;
            } else {
                this._windowLayer.removeChild(this._subMenuWindow);
            }
        }
        this._subMenuWindow = null;
    };

    Scene_Menu.prototype.onSubCommandOk = function(subCommand) {
        this._subCommand = (this._subMenuWindow ? this._subMenuWindow.currentExt() : subCommand);
        $gameTemp.setLastSubCommandIndex(this._subMenuWindow ? this._subMenuWindow.index() : 0);
        if (this._subCommand.isNeedSelectMember()) {
            if (this._subMenuWindow) {
                this._commandWindow.maskCommand(this._subCommand.getName());
                if (param.clearSubMenuOneByObe) {
                    this.removeSubMenuCommandWindow();
                } else {
                    this._subMenuWindow.deactivate();
                }
            }
            this._statusWindow.selectLast();
            this._statusWindow.activate();
            this._statusWindow.setHandler('ok', this.executeSubCommand.bind(this));
            this._statusWindow.setHandler('cancel', this.onPersonalCancel.bind(this));
        } else {
            this.executeSubCommand();
        }
    };

    Scene_Menu.prototype.onSubCommandCancel = function() {
        this.removeSubMenuCommandWindow();
        $gameTemp.resetLastSubCommand();
        this._commandWindow.activate();
    };

    const _Scene_Menu_onPersonalCancel      = Scene_Menu.prototype.onPersonalCancel;
    Scene_Menu.prototype.onPersonalCancel = function() {
        _Scene_Menu_onPersonalCancel.apply(this);
        this._commandWindow.maskOff();
        this.selectLastCommand();
    };

    Scene_Menu.prototype.selectLastCommand = function() {
        const lastSubCommand = $gameTemp.getLastSubCommand();
        if (lastSubCommand.parent) {
            this._commandWindow.selectSymbol('parent' + lastSubCommand.parent);
            const subCommands = $gameTemp.getSubMenuCommands(lastSubCommand.parent);
            if (subCommands.length !== 1) {
                this.commandParent();
                this._commandWindow.deactivate();
                this._subMenuWindow.select(lastSubCommand.index);
                /* 別シーンからキャラ選択に戻った時 */
                const subCommand = subCommands[lastSubCommand.index];
                if (subCommand.isNeedSelectMember()) {
                    this._isSubCommandOkAfterCreate = true;
                }
            }
        }
        $gameTemp.resetLastSubCommand();
    };

    Scene_Menu.prototype.executeSubCommand = function() {
        this.executeSubScript();
        this.moveSubCommandMap();
        if (param.selectActorIdVariable && this._subCommand.isNeedSelectMember()) {
            $gameVariables.setValue(param.selectActorIdVariable, this._statusWindow.getSelectedActorId());
        }
        if (!SceneManager.isSceneChanging()) {
            this.onSubCommandCancel();
            this._statusWindow.deselect();
            this._commandWindow.maskOff();
        } else {
            this._subCommandSelected = true;
        }
    };

    Scene_Menu.prototype.executeSubScript = function() {
        const script = this._subCommand.getSelectionScript();
        if (!script) return;
        try {
            eval(script);
        } catch (e) {
            SoundManager.playBuzzer();
            console.error(`実行スクリプトエラー[${script}] メッセージ[${e.message}]`);
        }
        if (this._subCommand.isReturnMap()) {
            SceneManager.pop();
        }
    };

    Scene_Menu.prototype.moveSubCommandMap = function() {
        const mapId = this._subCommand.getMoveTargetMap();
        if (mapId <= 0) {
            return;
        }
        $gamePlayer.reserveTransferToSubCommandMap(mapId);
        SceneManager.pop();
    };

    const _Scene_Menu_terminate      = Scene_Menu.prototype.terminate;
    Scene_Menu.prototype.terminate = function() {
        _Scene_Menu_terminate.apply(this, arguments);
        if (this._subCommand && this._subCommand.getMoveTargetMap() <= 0) {
            $gameTemp.resetLastSubCommand();
        }
    };

    const _Scene_Menu_createField      = Scene_Menu.prototype.createField;
    Scene_Menu.prototype.createField = function() {
        _Scene_Menu_createField.apply(this, arguments);
        if (this._subMenuWindow) {
            this.addChild(this._subMenuWindow);
        }
    };

    //=============================================================================
    // Window_MenuCommand
    //  サブコマンドを追加します。
    //=============================================================================
    const _Window_MenuCommand_initialize          = Window_MenuCommand.prototype.initialize;
    Window_MenuCommand.prototype.initialize     = function() {
        this._maskedName = {};
        this.rightInputMode = true;
        _Window_MenuCommand_initialize.apply(this, arguments);
    };

    const _Window_MenuCommand_initCommandPosition = Window_MenuCommand.initCommandPosition;
    Window_MenuCommand.initCommandPosition      = function() {
        if ($gamePlayer.isInSubCommandMap()) return;
        _Window_MenuCommand_initCommandPosition.apply(this, arguments);
    };

    const _Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
    Window_MenuCommand.prototype.makeCommandList = function() {
        _Window_MenuCommand_makeCommandList.apply(this, arguments);
        this.makeSubCommandList();
    };

    const _Window_MenuCommand_addGameEndCommand      = Window_MenuCommand.prototype.addGameEndCommand;
    Window_MenuCommand.prototype.addGameEndCommand = function() {
        if (this.needsCommand('gameEnd')) {
            _Window_MenuCommand_addGameEndCommand.apply(this, arguments);
        }
    };

    const _Window_MenuCommand_needsCommand      = Window_MenuCommand.prototype.needsCommand;
    Window_MenuCommand.prototype.needsCommand = function(name) {
        const need = _Window_MenuCommand_needsCommand.apply(this, arguments);
        if (name === 'options' && param.hideOption) {
            return false;
        }
        if (name === 'gameEnd' && param.hideGameEnd) {
            return false;
        }
        return need;
    };

    Window_MenuCommand.prototype.makeSubCommandList = function() {
        let addCount = 0;
        $gameTemp.iterateMenuParents((subCommands, parentName) => {
            this._subCommands = subCommands;
            if (this.checkSubCommands('isVisible')) {
                const commandName = this._maskedName[parentName] ? this._maskedName[parentName] : subCommands[0].getParentName();
                this.addCommand(commandName, 'parent' + parentName, this.checkSubCommands('isEnable'), parentName);
                const command = this._list.pop();
                this._list.splice(param.commandPosition + addCount, 0, command);
                addCount++;
            }
        });
    };

    Window_MenuCommand.prototype.checkSubCommands = function(methodName) {
        return this._subCommands.some(function(subCommand) {
            return subCommand[methodName]();
        });
    };

    Window_MenuCommand.prototype.calculateSubCommandX = function(width) {
        if (param.subMenuX) {
            return param.subMenuX;
        }
        let x = this.x;
        if (this.isHorizontalMenu()) {
            x += this._cursorRect.x;
        } else {
            x += this.rightInputMode ? -width : this.width;
        }
        x += param.adjustX || 0;
        return x.clamp(0, $dataSystem.advanced.uiAreaWidth - width);
    };

    Window_MenuCommand.prototype.calculateSubCommandY = function(height) {
        if (param.subMenuY) {
            return param.subMenuY;
        }
        let y = this.y;
        if (this.isHorizontalMenu()) {
            y += this.height;
        } else {
            y += this._cursorRect.y;
        }
        y += param.adjustY || 0;
        return y.clamp(0, $dataSystem.advanced.uiAreaHeight - height);
    };

    Window_MenuCommand.prototype.isHorizontalMenu = function() {
        return this.maxCols() >= this.maxPageRows();
    };

    Window_MenuCommand.prototype.maskCommand = function(maskName) {
        this._maskedName                                 = {};
        this._maskedName[this.commandName(this.index())] = maskName;
        this.refresh();
    };

    Window_MenuCommand.prototype.maskOff = function() {
        this._maskedName = {};
        this.refresh();
    };

    //=============================================================================
    // Window_MenuStatus
    //  選択しているアクターのIDを取得します。
    //=============================================================================
    Window_MenuStatus.prototype.getSelectedActorId = function() {
        return $gameParty.members()[this._index].actorId();
    };

    //=============================================================================
    // Window_MenuSubCommand
    //  サブコマンドウィンドウのクラスです。
    //=============================================================================
    function Window_MenuSubCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_MenuSubCommand.prototype             = Object.create(Window_Command.prototype);
    Window_MenuSubCommand.prototype.constructor = Window_MenuSubCommand;

    Window_MenuSubCommand.prototype.initialize = function(rectangle, parentName) {
        this._parentName = parentName;
        Window_Command.prototype.initialize.call(this, rectangle);
        if (param.overlapOther) {
            this._isWindow = false;
        }
        if (param.openAnimation) {
            this._openness = 0;
            this.open();
        }
    };

    Window_MenuSubCommand.prototype.makeCommandList = function() {
        const subMenus = $gameTemp.getSubMenuCommands(this._parentName);
        subMenus.forEach(subMenu => {
            if (subMenu.isVisible()) {
                this.addCommand(subMenu.getName(), 'ok', subMenu.isEnable(), subMenu);
            }
        });
        this.width = this.windowWidth();
        this.height = this.fittingHeight(this.numVisibleRows());
        this.createContents();
    };

    Window_MenuSubCommand.prototype.numVisibleRows = function() {
        return param.horizontalSubMenu ? 1 : this.maxItems();
    };

    Window_MenuSubCommand.prototype.maxCols = function() {
        return param.horizontalSubMenu ? this.maxItems() : 1;
    };

    Window_MenuSubCommand.prototype.windowWidth = function() {
        return param.subMenuWidth || 240;
    };

    Window_MenuSubCommand.prototype.updatePlacement = function(commandWindow) {
        this.x = commandWindow.calculateSubCommandX(this.width);
        this.y = commandWindow.calculateSubCommandY(this.height);
    };

    Window_MenuSubCommand.prototype.standardFontSize = function() {
        return userSetting.subCommandWindow.fontSize || Window_Command.prototype.standardFontSize.call(this);
    };

    Window_MenuSubCommand.prototype.standardPadding = function() {
        return userSetting.subCommandWindow.padding || Window_Command.prototype.standardPadding.call(this);
    };

    Window_MenuSubCommand.prototype.loadWindowskin = function() {
        if (param.windowSkin) {
            this.windowskin = ImageManager.loadSystem(param.windowSkin);
        } else {
            Window_Command.prototype.loadWindowskin.call(this);
        }
    };

    const _Window_MenuSubCommand_itemTextAlign      = Window_MenuSubCommand.prototype.itemTextAlign;
    Window_MenuSubCommand.prototype.itemTextAlign = function() {
        return param.subMenuAlign || _Window_MenuSubCommand_itemTextAlign.apply(this, arguments);
    };

    //=============================================================================
    // Game_MenuSubCommand
    //  サブコマンドを扱うクラスです。
    //=============================================================================
    class Game_MenuSubCommand {
        constructor(subCommandData) {
            this._data = subCommandData;
        }

        getName() {
            return this._data.Name;
        }

        getParentName() {
            return this._data.ParentName;
        }

        isReturnMap() {
            return (!this.getMoveTargetMap()) && this._data.ReturnMap;
        }

        isVisible() {
            return !$gameSwitches.value(this._data.HiddenSwitchId);
        }

        isEnable() {
            return !$gameSwitches.value(this._data.DisableSwitchId) &&
                !(SceneManager.isSceneRetry && SceneManager.isSceneRetry() && this.getMoveTargetMap() > 0);
        }

        isNeedSelectMember() {
            return this._data.SelectMember;
        }

        getSelectionScript() {
            return this._data.Script;
        }

        getMoveTargetMap() {
            return this._data.MapId;
        }
    }
})();

