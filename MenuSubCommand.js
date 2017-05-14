//=============================================================================
// MenuSubCommand.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/05/14 デフォルトのオプションとゲーム終了コマンドを削除できる機能を追加
//                  カンマ(,)を含むスクリプトを正しく実行できない問題を修正
// 1.0.3 2017/04/09 サブコマンドマップから戻ってきたときにイベント位置を復元できるよう修正
// 1.0.2 2017/04/08 サブコマンドマップから戻ってきたときにフォロワー位置を復元できるよう修正
// 1.0.1 2017/04/08 サブコマンドマップから戻ってきたタイミングでセーブしたときにロード時の位置がサブコマンドマップに
//                  なってしまう問題を修正
//                  戦闘リトライプラグインと併用したときにリトライ中は、マップ移動するメニューを使用禁止に設定
// 1.0.0 2017/04/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MenuSubCommandPlugin
 * @author triacontane
 *
 * @param SubCommand1
 * @desc Name,ParentName,HiddenSwitchID,DisableSwitchID,SubCommandScript,TargetMapId,MemberSelect
 * @default Item,Parent1,100,200,this.commandItem(),0,OFF
 *
 * @param SubCommand2
 * @desc Name,ParentName,HiddenSwitchID,DisableSwitchID,SubCommandScript,TargetMapId,MemberSelect
 * @default Skill,Parent1,100,200,SceneManager.push(Scene_Skill),0,ON
 *
 * @param SubCommand3
 * @desc Name,ParentName,HiddenSwitchID,DisableSwitchID,SubCommandScript,TargetMapId,MemberSelect
 * @default Option,Parent2,100,200,SceneManager.push(Scene_Options),0,OFF
 *
 * @param SubCommand4
 * @desc Name,ParentName,HiddenSwitchID,DisableSwitchID,SubCommandScript,TargetMapId,MemberSelect
 * @default Status,Parent2,100,200,SceneManager.push(Scene_Status),0,ON
 *
 * @param SubCommand5
 * @desc Name,ParentName,HiddenSwitchID,DisableSwitchID,SubCommandScript,TargetMapId,MemberSelect
 * @default SubCommand5,Parent3,100,200,,0,OFF
 *
 * @param SubCommand6
 * @desc Name,ParentName,HiddenSwitchID,DisableSwitchID,SubCommandScript,TargetMapId,MemberSelect
 * @default SubCommand6,Parent3,100,200,,0,ON
 *
 * @param SubCommand7
 * @desc Name,ParentName,HiddenSwitchID,DisableSwitchID,SubCommandScript,TargetMapId,MemberSelect
 * @default SubCommand7,Parent3,100,200,,0,OFF
 *
 * @param SubCommand8
 * @desc Name,ParentName,HiddenSwitchID,DisableSwitchID,SubCommandScript,TargetMapId,MemberSelect
 * @default SubCommand8,Parent3,100,200,,0,ON
 *
 * @param CommandPosition
 * @desc サブコマンド群を追加する位置です。
 * 0:並び替えの下 1:オプションの下 2:セーブの下 3:ゲーム終了の下
 * @default 0
 *
 * @param SubMenuWidth
 * @desc サブメニューを表示するウィンドウの横幅です。指定しない場合デフォルト値「240」が適用されます。
 * @default 0
 *
 * @param SelectActorIdVariable
 * @desc サブメニュー用マップに移動する際に選択していたアクターのIDを格納する変数番号です。
 * @default 0
 *
 * @param WindowSkin
 * @desc サブコマンド用のウィンドウに専用のスキンを設定します。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param HideOption
 * @desc メインメニューからオプションを消去します。
 * @default OFF
 *
 * @param HideGameEnd
 * @desc メインメニューからゲーム終了を消去します。
 * @default OFF
 *
 * @help メインメニュー画面に任意の名前のコマンドおよび
 * ツリー表示されるサブコマンドを追加できます。
 * サブコマンドを実行（決定）すると、任意のスクリプトが実行されるか、
 * もしくは指定したマップに移動します。（両方も可能）
 *
 * 指定したマップへの移動は主にイベントによる自作メニューを
 * 組み込むために使用します。
 * また、通常の縦レイアウトとメニュー画面はもちろん、
 * プラグインによる横レイアウトのメニュー画面にも対応しています。
 *
 * プラグインパラメータを以下の通りカンマ区切りで指定してください。
 *
 * ・指定例
 * アイテム,親コマンド1,100,200,this.commandItem(),0,OFF
 *
 * ◆項目名◆　　　　◆説明◆
 * 名称　　　　　　：サブコマンドに表示される任意のコマンド名称
 * 親名称　　　　　：メインコマンドに表示される親となる任意のコマンド名称
 * 非表示スイッチID：ONのときコマンドが非表示になるスイッチID
 * 禁止スイッチID　：ONのときコマンドが使用禁止になるスイッチID
 * 実行スクリプト　：コマンドを決定したときに実行されるスクリプト
 * 移動先マップID　：コマンドを決定したときに移動するマップID
 * メンバー選択有無：コマンド実行前に対象メンバーを選択します(ON/OFF)
 *
 * 実行スクリプトは、主にスクリプトで組まれた別画面に遷移する場合に
 * 使用します。もちろん他のプラグインで追加された画面にも遷移可能です。
 *
 * マップ移動機能は、主に移動先のマップでイベントによる自作メニューや
 * 自作システムの実行を想定しています。戻る際は再度メニューを開いてください。
 * 元々メニューを開いていた場所は、別途保存しているので意識する必要はありません。
 *
 * メンバー選択してマップ移動する際に選択したアクターIDを変数に保存できます。
 *
 * サブコマンドが全て非表示だった場合、親項目自体も非表示になります。
 * 同じく全て使用禁止だった場合、親項目自体も使用禁止になります。
 *
 * サブコマンドがひとつしかない場合、サブコマンドウィンドウは表示されず
 * 親コマンドを選択した時点でサブコマンドを実行します。
 *
 * サブコマンドウィンドウのフォントサイズ等、一部の高度な設定は
 * 「ユーザ設定領域」に直接記述されています。必要に応じて改変可能です。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メニュー画面のサブコマンドプラグイン
 * @author トリアコンタン
 *
 * @param サブコマンド1
 * @desc 名称,親名称,非表示スイッチID,使用禁止スイッチID,実行スクリプト,移動先マップID,メンバー選択有無
 * @default アイテム,親コマンド1,100,200,this.commandItem(),0,OFF
 *
 * @param サブコマンド2
 * @desc 名称,親名称,非表示スイッチID,使用禁止スイッチID,実行スクリプト,移動先マップID,メンバー選択有無
 * @default スキル,親コマンド1,100,200,SceneManager.push(Scene_Skill),0,ON
 *
 * @param サブコマンド3
 * @desc 名称,親名称,非表示スイッチID,使用禁止スイッチID,実行スクリプト,移動先マップID,メンバー選択有無
 * @default オプション,親コマンド2,100,200,SceneManager.push(Scene_Options),0,OFF
 *
 * @param サブコマンド4
 * @desc 名称,親名称,非表示スイッチID,使用禁止スイッチID,実行スクリプト,移動先マップID,メンバー選択有無
 * @default ステータス,親コマンド2,100,200,SceneManager.push(Scene_Status),0,ON
 *
 * @param サブコマンド5
 * @desc 名称,親名称,非表示スイッチID,使用禁止スイッチID,実行スクリプト,移動先マップID,メンバー選択有無
 * @default サブコマンド5,親コマンド3,100,200,,0,OFF
 *
 * @param サブコマンド6
 * @desc 名称,親名称,非表示スイッチID,使用禁止スイッチID,実行スクリプト,移動先マップID,メンバー選択有無
 * @default サブコマンド6,親コマンド3,100,200,,0,ON
 *
 * @param サブコマンド7
 * @desc 名称,親名称,非表示スイッチID,使用禁止スイッチID,実行スクリプト,移動先マップID,メンバー選択有無
 * @default サブコマンド7,親コマンド3,100,200,,0,OFF
 *
 * @param サブコマンド8
 * @desc 名称,親名称,非表示スイッチID,使用禁止スイッチID,実行スクリプト,移動先マップID,メンバー選択有無
 * @default サブコマンド8,親コマンド3,100,200,,0,ON
 *
 * @param コマンド追加位置
 * @desc サブコマンド群を追加する位置です。
 * 0:並び替えの下 1:オプションの下 2:セーブの下 3:ゲーム終了の下
 * @default 0
 *
 * @param サブメニュー横幅
 * @desc サブメニューを表示するウィンドウの横幅です。指定しない場合デフォルト値「240」が適用されます。
 * @default 0
 *
 * @param 選択アクターID変数
 * @desc サブメニュー用マップに移動する際に選択していたアクターのIDを格納する変数番号です。
 * @default 0
 *
 * @param ウィンドウスキン
 * @desc サブコマンド用のウィンドウに専用のスキンを設定します。
 * @default
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param オプション消去
 * @desc メインメニューからオプションを消去します。
 * @default OFF
 *
 * @param ゲーム終了消去
 * @desc メインメニューからゲーム終了を消去します。
 * @default OFF
 *
 * @help メインメニュー画面に任意の名前のコマンドおよび
 * ツリー表示されるサブコマンドを追加できます。
 * サブコマンドを実行（決定）すると、任意のスクリプトが実行されるか、
 * もしくは指定したマップに移動します。（両方も可能）
 *
 * 指定したマップへの移動は主にイベントによる自作メニューを
 * 組み込むために使用します。
 * また、通常の縦レイアウトとメニュー画面はもちろん、
 * プラグインによる横レイアウトのメニュー画面にも対応しています。
 *
 * プラグインパラメータを以下の通りカンマ区切りで指定してください。
 *
 * ・指定例
 * アイテム,親コマンド1,100,200,this.commandItem(),0,OFF
 *
 * ◆項目名◆　　　　◆説明◆
 * 名称　　　　　　：サブコマンドに表示される任意のコマンド名称
 * 親名称　　　　　：メインコマンドに表示される親となる任意のコマンド名称
 * 非表示スイッチID：ONのときコマンドが非表示になるスイッチID
 * 禁止スイッチID　：ONのときコマンドが使用禁止になるスイッチID
 * 実行スクリプト　：コマンドを決定したときに実行されるスクリプト
 * 移動先マップID　：コマンドを決定したときに移動するマップID
 * メンバー選択有無：コマンド実行前に対象メンバーを選択します(ON/OFF)
 *
 * 実行スクリプトは、主にスクリプトで組まれた別画面に遷移する場合に
 * 使用します。もちろん他のプラグインで追加された画面にも遷移可能です。
 *
 * マップ移動機能は、主に移動先のマップでイベントによる自作メニューや
 * 自作システムの実行を想定しています。戻る際は再度メニューを開いてください。
 * 元々メニューを開いていた場所は、別途保存しているので意識する必要はありません。
 *
 * メンバー選択してマップ移動する際に選択したアクターIDを変数に保存できます。
 *
 * サブコマンドが全て非表示だった場合、親項目自体も非表示になります。
 * 同じく全て使用禁止だった場合、親項目自体も使用禁止になります。
 *
 * サブコマンドがひとつしかない場合、サブコマンドウィンドウは表示されず
 * 親コマンドを選択した時点でサブコマンドを実行します。
 *
 * サブコマンドウィンドウのフォントサイズ等、一部の高度な設定は
 * 「ユーザ設定領域」に直接記述されています。必要に応じて改変可能です。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    //=============================================================================
    // ユーザ設定領域　開始
    //=============================================================================
    var userSetting = {
        /**
         * サブコマンドウィンドウに関する設定です
         */
        subCommandWindow: {
            adjustX : 0,
            adjustY : 0,
            fontSize: null,
            padding : null,
        },
        /**
         * サブマップ移動時に自働でプレイヤーを透明にします。
         */
        autoTransparent : true
    };
    //=============================================================================
    // ユーザ設定領域　終了
    //=============================================================================
    var pluginName = 'MenuSubCommand';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON';
    };

    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamArrayString = function(paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    };

    var getParamNumber = function(paramNames, min, max) {
        const value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameActors.actor(parseInt(arguments[1])) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameParty.members()[parseInt(arguments[1]) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    var getArgBoolean = function(arg) {
        return arg.toUpperCase() === 'ON';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    const param       = {};
    param.subCommands = [];
    for (var i = 1; i < Infinity; i++) {
        var commandParams = getParamArrayString(['SubCommand' + i, 'サブコマンド' + i]);
        if (commandParams.length > 1) {
            param.subCommands.push(commandParams);
        } else {
            break;
        }
    }
    param.commandPosition       = getParamNumber(['CommandPosition', 'コマンド追加位置']);
    param.subMenuWidth          = getParamNumber(['SubMenuWidth', 'サブメニュー横幅']);
    param.selectActorIdVariable = getParamNumber(['SelectActorIdVariable', '選択アクターID変数']);
    param.windowSkin            = getParamString(['WindowSkin', 'ウィンドウスキン']);
    param.hideOption            = getParamBoolean(['HideOption', 'オプション消去']);
    param.hideGameEnd           = getParamBoolean(['HideGameEnd', 'ゲーム終了消去']);

    //=============================================================================
    // Game_Temp
    //  メニューコマンド情報を構築して保持します。
    //=============================================================================
    var _Game_Temp_initialize      = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this.createMenuCommands();
    };

    Game_Temp.prototype.createMenuCommands = function() {
        this._menuParentCommands = new Map();
        param.subCommands.forEach(function(commands) {
            this.createMenuCommand(commands);
        }, this);
    };

    Game_Temp.prototype.createMenuCommand = function(commands) {
        var parentName = commands[1];
        if (!this._menuParentCommands.has(parentName)) {
            this._menuParentCommands.set(parentName, []);
        }
        var parent = this._menuParentCommands.get(parentName);
        parent.push(new Game_MenuSubCommand(commands));
    };

    Game_Temp.prototype.iterateMenuParents = function(callBackFunc, thisArg) {
        this._menuParentCommands.forEach(callBackFunc, thisArg);
    };

    Game_Temp.prototype.getSubMenuCommands = function(parentName) {
        return this._menuParentCommands.get(parentName);
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
        this.setDirection(this._originalDirection)
    };

    //=============================================================================
    // Game_Player
    //  サブコマンドマップへ移動します。
    //=============================================================================
    Game_Player.prototype.reserveTransferToSubCommandMap = function(subCommandMapId) {
        this.saveOriginalMap();
        this.reserveTransfer(subCommandMapId, 0, 0, 0, 2);
        if (userSetting.autoTransparent) {
            this.setTransparent(true);
        }
    };

    Game_Player.prototype.reserveTransferToOriginalMap = function() {
        DataManager.loadMapData(this._originalMapId);
        this.reserveTransfer(this._originalMapId, this._originalX, this._originalY, this._originalDirection, 2);
        if (userSetting.autoTransparent) {
            this.setTransparent(this._originalTransparent);
        }
        this._originalMapId             = 0;
        this._transferringToOriginalMap = true;
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

    var _Game_Player_performTransfer      = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _Game_Player_performTransfer.apply(this, arguments);
        if (this.isTransferringToOriginalMap()) {
            this.restorePosition();
            this._transferringToOriginalMap = false;
        }
    };

    Game_Player.prototype.savePosition = function() {
        Game_CharacterBase.prototype.savePosition.call(this, arguments);
        this._followers.forEach(function(follower) {
            follower.savePosition();
        });
        $gameMap.saveAllEventPosition();
    };

    Game_Player.prototype.restorePosition = function() {
        Game_CharacterBase.prototype.restorePosition.call(this, arguments);
        this._followers.forEach(function(follower) {
            follower.restorePosition();
        });
        $gameMap.restoreAllEventPosition();
    };

    //=============================================================================
    // Game_Map
    //  すべてのイベントの位置を保存します。
    //=============================================================================
    Game_Map.prototype.saveAllEventPosition = function() {
        this._eventPositions = [];
        this.events().forEach(function(event) {
            var position                          = {};
            position.x                            = event.x;
            position.y                            = event.y;
            position.direction                    = event.direction();
            this._eventPositions[event.eventId()] = position;
        }, this);
    };

    Game_Map.prototype.restoreAllEventPosition = function() {
        this.events().forEach(function(event) {
            var position = this._eventPositions[event.eventId()];
            if (position) {
                event.locate(position.x, position.y);
                event.setDirection(position.direction);
            }
        }, this);
        this._eventPositions = [];
    };

    //=============================================================================
    // Game_Party
    //  無効なアクター設定時のエラーを回避します。
    //=============================================================================
    var _Game_Party_setMenuActor      = Game_Party.prototype.setMenuActor;
    Game_Party.prototype.setMenuActor = function(actor) {
        if (!actor) return;
        _Game_Party_setMenuActor.apply(this, arguments);
    };

    //=============================================================================
    // AudioManager
    //  システム効果音を消音します。
    //=============================================================================
    AudioManager.stopStaticSe = function() {
        this._staticBuffers.forEach(function(buffer) {
            buffer.stop();
        });
        this._staticBuffers = [];
    };

    //=============================================================================
    // SceneManager
    //  メニュー用マップではキャプチャを無効にします。
    //=============================================================================
    var _SceneManager_snapForBackground = SceneManager.snapForBackground;
    SceneManager.snapForBackground      = function() {
        if ($gamePlayer.isInSubCommandMap()) return;
        _SceneManager_snapForBackground.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Map
    //  自作ゲーム用マップ遷移の場合、一部演出を無効化します。
    //=============================================================================
    var _Scene_Map_callMenu      = Scene_Map.prototype.callMenu;
    Scene_Map.prototype.callMenu = function() {
        _Scene_Map_callMenu.apply(this, arguments);
        if ($gamePlayer.isInSubCommandMap()) {
            AudioManager.stopStaticSe();
            SoundManager.playCancel();
        }
    };

    var _Scene_Map_onMapLoaded      = Scene_Map.prototype.onMapLoaded;
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
    var _Scene_Menu_create      = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.apply(this, arguments);
        this.loadSubCommandWindowSkin();
        if ($gamePlayer.isInSubCommandMap()) {
            $gamePlayer.reserveTransferToOriginalMap();
        }
    };

    Scene_Menu.prototype.loadSubCommandWindowSkin = function() {
        if (param.windowSkin) {
            ImageManager.loadSystem(param.windowSkin);
        }
    };

    var _Scene_Menu_isReady      = Scene_Menu.prototype.isReady;
    Scene_Menu.prototype.isReady = function() {
        return _Scene_Menu_isReady.apply(this, arguments) &&
            (!$gamePlayer.isTransferringToOriginalMap() || DataManager.isMapLoaded());
    };

    var _Scene_Menu_start      = Scene_Menu.prototype.start;
    Scene_Menu.prototype.start = function() {
        _Scene_Menu_start.apply(this, arguments);
        if ($gamePlayer.isTransferringToOriginalMap()) {
            $gamePlayer.performTransfer();
        }
    };

    var _Scene_Menu_createCommandWindow      = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.apply(this, arguments);
        $gameTemp.iterateMenuParents(function(subCommands, parentName) {
            this._commandWindow.setHandler('parent' + parentName, this.commandParent.bind(this));
        }, this);
    };

    Scene_Menu.prototype.commandParent = function() {
        var parentName  = this._commandWindow.currentExt();
        var subCommands = $gameTemp.getSubMenuCommands(parentName);
        if (subCommands.length === 1) {
            this.onSubCommandOk(subCommands[0]);
        } else {
            this.createSubMenuCommandWindow(parentName);
        }
    };

    Scene_Menu.prototype.createSubMenuCommandWindow = function(parentName) {
        this._subMenuWindow = new Window_MenuSubCommand(this.x, this.y, parentName);
        this._subMenuWindow.updatePlacement(this._commandWindow);
        this._subMenuWindow.setHandler('ok', this.onSubCommandOk.bind(this));
        this._subMenuWindow.setHandler('cancel', this.onSubCommandCancel.bind(this));
        this.addChild(this._subMenuWindow);
    };

    Scene_Menu.prototype.removeSubMenuCommandWindow = function() {
        if (this._subMenuWindow) {
            this.removeChild(this._subMenuWindow);
        }
        this._subMenuWindow = null;
    };

    Scene_Menu.prototype.onSubCommandOk = function(subCommand) {
        this._subCommand = (this._subMenuWindow ? this._subMenuWindow.currentExt() : subCommand);
        if (this._subCommand.isNeedSelectMember()) {
            this._statusWindow.selectLast();
            this._statusWindow.activate();
            this._statusWindow.setHandler('ok', this.executeSubCommand.bind(this));
            this._statusWindow.setHandler('cancel', this.onPersonalCancel.bind(this));
            this.removeSubMenuCommandWindow();
        } else {
            this.executeSubCommand();
        }
    };

    Scene_Menu.prototype.onSubCommandCancel = function() {
        this.removeSubMenuCommandWindow();
        this._commandWindow.activate();
    };

    Scene_Menu.prototype.executeSubCommand = function() {
        this.executeSubScript();
        this.moveSubCommandMap();
        if (!SceneManager.isSceneChanging()) {
            this.onSubCommandCancel();
            this._statusWindow.deselect();
        }
    };

    Scene_Menu.prototype.executeSubScript = function() {
        var script = this._subCommand.getSelectionScript();
        if (!script) return;
        try {
            eval(script);
        } catch (e) {
            SoundManager.playBuzzer();
            console.error(`実行スクリプトエラー[${script}] メッセージ[${e.message}]`);
        }
    };

    Scene_Menu.prototype.moveSubCommandMap = function() {
        var mapId = this._subCommand.getMoveTargetMap();
        if (mapId <= 0) return;
        $gamePlayer.reserveTransferToSubCommandMap(mapId);
        if (param.selectActorIdVariable && this._subCommand.isNeedSelectMember()) {
            $gameVariables.setValue(param.selectActorIdVariable, this._statusWindow.getSelectedActorId());
        }
        SceneManager.pop();
    };

    //=============================================================================
    // Window_MenuCommand
    //  サブコマンドを追加します。
    //=============================================================================
    var _Window_MenuCommand_initCommandPosition = Window_MenuCommand.initCommandPosition;
    Window_MenuCommand.initCommandPosition      = function() {
        if ($gamePlayer.isInSubCommandMap()) return;
        _Window_MenuCommand_initCommandPosition.apply(this, arguments);
    };

    var _Window_MenuCommand_addOriginalCommands      = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.apply(this, arguments);
        if (param.commandPosition === 0) this.makeSubCommandList();
    };

    var _Window_MenuCommand_addOptionsCommand      = Window_MenuCommand.prototype.addOptionsCommand;
    Window_MenuCommand.prototype.addOptionsCommand = function() {
        _Window_MenuCommand_addOptionsCommand.apply(this, arguments);
        if (param.commandPosition === 1) this.makeSubCommandList();
    };

    var _Window_MenuCommand_addSaveCommand      = Window_MenuCommand.prototype.addSaveCommand;
    Window_MenuCommand.prototype.addSaveCommand = function() {
        _Window_MenuCommand_addSaveCommand.apply(this, arguments);
        if (param.commandPosition === 2) this.makeSubCommandList();
    };

    var _Window_MenuCommand_addGameEndCommand      = Window_MenuCommand.prototype.addGameEndCommand;
    Window_MenuCommand.prototype.addGameEndCommand = function() {
        if (this.needsCommand('gameEnd')) {
            _Window_MenuCommand_addGameEndCommand.apply(this, arguments);
        }
        if (param.commandPosition === 3) this.makeSubCommandList();
    };

    var _Window_MenuCommand_needsCommand = Window_MenuCommand.prototype.needsCommand;
    Window_MenuCommand.prototype.needsCommand = function(name) {
        var need = _Window_MenuCommand_needsCommand.apply(this, arguments);
        if (name === 'options' && param.hideOption) {
            return false;
        }
        if (name === 'gameEnd' && param.hideGameEnd) {
            return false;
        }
        return need;
    };

    Window_MenuCommand.prototype.makeSubCommandList = function() {
        $gameTemp.iterateMenuParents(function(subCommands, parentName) {
            this._subCommands = subCommands;
            if (this.checkSubCommands('isVisible')) {
                this.addCommand(parentName, 'parent' + parentName, this.checkSubCommands('isEnable'), parentName);
            }
        }, this);
    };

    Window_MenuCommand.prototype.checkSubCommands = function(methodName) {
        return this._subCommands.some(function(subCommand) {
            return subCommand[methodName]();
        });
    };

    Window_MenuCommand.prototype.calculateSubCommandX = function(width) {
        var x = (this.isHorizontalMenu() ? this._cursorRect.x : this.x + this.width);
        x += userSetting.subCommandWindow.adjustX;
        return x.clamp(0, Graphics.boxWidth - width);
    };

    Window_MenuCommand.prototype.calculateSubCommandY = function(height) {
        var y = (this.isHorizontalMenu() ? this.y + this.height : this._cursorRect.y);
        y += userSetting.subCommandWindow.adjustY;
        return y.clamp(0, Graphics.boxHeight - height);
    };

    Window_MenuCommand.prototype.isHorizontalMenu = function() {
        return this.maxCols() >= this.maxPageRows();
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

    Window_MenuSubCommand.prototype.initialize = function(x, y, parentName) {
        this._parentName = parentName;
        Window_Command.prototype.initialize.call(this, x, y);
    };

    Window_MenuSubCommand.prototype.makeCommandList = function() {
        var subMenus = $gameTemp.getSubMenuCommands(this._parentName);
        subMenus.forEach(function(subMenu) {
            if (subMenu.isVisible()) {
                this.addCommand(subMenu.getName(), 'ok', subMenu.isEnable(), subMenu);
            }
        }, this);
    };

    Window_MenuSubCommand.prototype.windowWidth = function() {
        return param.subMenuWidth || Window_Command.prototype.windowWidth.call(this);
    };

    Window_MenuSubCommand.prototype.lineHeight = function() {
        if (userSetting.subCommandWindow.fontSize) {
            return userSetting.subCommandWindow.fontSize + 8;
        } else {
            return Window_Command.prototype.lineHeight.call(this);
        }
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

    //=============================================================================
    // Game_MenuSubCommand
    //  サブコマンドを扱うクラスです。
    //=============================================================================
    class Game_MenuSubCommand {
        constructor(params) {
            var length            = params.length;
            this._name            = params[0];
            this._hiddenSwitchId  = params[2];
            this._disableSwitchId = params[3];
            this._targetScript    = params.slice(4, length - 2).join(',');
            this._targetMapId     = params[length - 2];
            this._memberSelect    = getArgBoolean(params[length - 1]);
        }

        getName() {
            return this._name;
        }

        isVisible() {
            return !$gameSwitches.value(this.convert(this._hiddenSwitchId, true));
        }

        isEnable() {
            return !$gameSwitches.value(this.convert(this._disableSwitchId, true)) &&
                !(SceneManager.isSceneRetry && SceneManager.isSceneRetry() && this.getMoveTargetMap() > 0);
        }

        isNeedSelectMember() {
            return !!this._memberSelect;
        }

        getSelectionScript() {
            return this.convert(this._targetScript, false);
        }

        getMoveTargetMap() {
            return this.convert(this._targetMapId, true);
        }

        convert(text, isNumber) {
            var convertText = convertEscapeCharacters(text);
            return isNumber ? parseInt(convertText) : convertText;
        }
    }
})();

