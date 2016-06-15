//=============================================================================
// MenuBarAddition.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2016/06/15 1.0.1の修正が正しく行われていなかったので再修正
// 1.0.1 2016/06/14 YEP_CoreEngine.jsと併用したときにウィンドウ高さ補正が効かなくなる問題を修正
// 1.0.0 2016/06/04 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc メニューバー追加プラグイン
 * @author トリアコンタン
 *
 * @param 伸縮モード切り替え
 * @desc 伸縮モード切り替え(F3)を追加します。(ON/OFF)
 * @default ON
 *
 * @param 全画面モード切り替え
 * @desc 全画面モード切り替え(F4)を追加します。(ON/OFF)
 * @default ON
 *
 * @param リロード切り替え
 * @desc リロード(F5)を追加します。(ON/OFF)
 * @default ON
 *
 * @param 伸縮モード名称
 * @desc 伸縮モード切り替えコマンドの表示名です。
 * @default 伸縮モード切り替え
 *
 * @param 全画面モード名称
 * @desc 全画面モード切り替えコマンドの表示名です。
 * @default 全画面モード切り替え
 *
 * @param リロード名称
 * @desc リロードコマンドの表示名です。
 * @default リロード
 *
 * @param マップ画面のみ有効
 * @desc カスタムコマンドがマップ画面でのみ有効になります。(ON/OFF)
 * @default ON
 *
 * @param ウィンドウ高さ加算値
 * @desc メニューバー追加によって加算されるウィンドウの高さです。通常は20を指定してください。
 * @default 20
 *
 * @param クリックメニュー
 * @desc クリックメニューからコマンドを実行できます。(-1;無効 0:左 1:ホイール 2:右)
 * @default 2
 *
 * @param コマンド名称1
 * @desc メニューバーに表示されるコマンドの名称です。
 * @default
 *
 * @param コマンドスイッチ1
 * @desc メニューバーの項目を追加したときにONになるスイッチ番号です。
 * @default
 *
 * @param コマンドキー1
 * @desc コマンドのショートカットキーです。(F1～F12)
 * @default
 *
 * @param コマンド名称2
 * @desc メニューバーに表示されるコマンドの名称です。
 * @default
 *
 * @param コマンドスイッチ2
 * @desc メニューバーの項目を追加したときにONになるスイッチ番号です。
 * @default
 *
 * @param コマンドキー2
 * @desc コマンドのショートカットキーです。(F1～F12)
 * @default
 *
 * @param コマンド名称3
 * @desc メニューバーに表示されるコマンドの名称です。
 * @default
 *
 * @param コマンドスイッチ3
 * @desc メニューバーの項目を追加したときにONになるスイッチ番号です。
 * @default
 *
 * @param コマンドキー3
 * @desc コマンドのショートカットキーです。(F1～F12)
 * @default
 *
 * @param コマンド名称4
 * @desc メニューバーに表示されるコマンドの名称です。
 * @default
 *
 * @param コマンドスイッチ4
 * @desc メニューバーの項目を追加したときにONになるスイッチ番号です。
 * @default
 *
 * @param コマンドキー4
 * @desc コマンドのショートカットキーです。(F1～F12)
 * @default
 *
 * @help 画面上にメニューバーを追加します。
 * デフォルト機能(F3, F4, F5)のほか、任意の項目を4つまで追加できます。
 * クリックすると指定されたスイッチをONにできます。
 *
 * また、マウスクリック(右クリック等)からメニューバーと同様の
 * コンテキストメニューを呼び出せます。
 *
 * 注意！
 * このプラグインはローカル実行時のみ動作します。
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
    var pluginName = 'MenuBarAddition';
    // ローカル環境以外では動作しない
    if (!Utils.isNwjs()) {
        console.log(pluginName + 'is valid only Nw.js!');
        return;
    }

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramCommandF3     = getParamBoolean(['CommandF3', '伸縮モード切り替え']);
    var paramCommandF4     = getParamBoolean(['CommandF4', '全画面モード切り替え']);
    var paramCommandF5     = getParamBoolean(['CommandF5', 'リロード切り替え']);
    var paramClickMenu     = getParamNumber(['ClickMenu', 'クリックメニュー'], -1);
    var paramMapOnly       = getParamBoolean(['MapOnly', 'マップ画面のみ有効']);
    var paramWindowHeight  = getParamNumber(['WindowHeight', 'ウィンドウ高さ加算値'], 0);
    var paramCommandF3Name = getParamString(['CommandF3Name', '伸縮モード名称']);
    var paramCommandF4Name = getParamString(['CommandF4Name', '全画面モード名称']);
    var paramCommandF5Name = getParamString(['CommandF5Name', 'リロード名称']);

    var paramCustomCommands = [];
    for (var i = 1; i < 5; i++) {
        var name               = getParamString(['CommandName' + i, 'コマンド名称' + i]);
        paramCustomCommands[i] = {
            name : name,
            param: getParamNumber(['CommandSwitch' + i, 'コマンドスイッチ' + i], 1),
            key  : getParamString(['CommandKey' + i, 'コマンドキー' + i]),
            code : 101,
            valid: !!name,
            order: i
        };
    }

    //=============================================================================
    // ローカル変数
    //=============================================================================
    var localIsAddMenuBar = false;

    Input.functionReverseMapper = {
        F1 : 112,
        F2 : 113,
        F3 : 114,
        F4 : 115,
        F5 : 116,
        F6 : 117,
        F7 : 118,
        F8 : 119,
        F9 : 120,
        F10: 121,
        F11: 122,
        F12: 123
    };

    //=============================================================================
    // Graphics
    //  プライベートメソッドにアクセスします。
    //=============================================================================
    Graphics.switchFullScreenForMenuBarAddition = function() {
        this._switchFullScreen();
    };

    Graphics.switchStretchModeForMenuBarAddition = function() {
        this._switchStretchMode();
    };

    //=============================================================================
    // SceneManager
    //  メニューバーを追加定義します。
    //=============================================================================
    SceneManager.normalMenuCommands = [
        {code: 102, key: 'F3', valid: paramCommandF3, name: paramCommandF3Name, order: 0},
        {code: 103, key: 'F4', valid: paramCommandF4, name: paramCommandF4Name, order: 0},
        {code: 104, key: 'F5', valid: paramCommandF5, name: paramCommandF5Name, order: 0}
    ];

    var _SceneManager_initNwjs = SceneManager.initNwjs;
    SceneManager.initNwjs      = function() {
        _SceneManager_initNwjs.apply(this, arguments);
        this._menuCommands = this.getAllMenuCommands();
        this.initClickMenu();
        this.initMenuBar();
    };

    SceneManager.initMenuBar = function() {
        var gui = require('nw.gui');
        var win = gui.Window.get();
        if (!win.menu) {
            localIsAddMenuBar = true;
        }
        var menuBar = new gui.Menu({type: 'menubar'});
        if (process.platform === 'darwin') {
            menuBar.createMacBuiltin('Game', option);
        }
        this.addMenuItem(menuBar);
        win.menu = menuBar;
    };

    var _SceneManager_run = SceneManager.run;
    SceneManager.run      = function(sceneClass) {
        _SceneManager_run.apply(this, arguments);
        var gui = require('nw.gui');
        var win = gui.Window.get();
        if (localIsAddMenuBar) {
            win.y -= paramWindowHeight;
            win.height += paramWindowHeight;
        }
    };

    SceneManager.initClickMenu = function() {
        var gui         = require('nw.gui');
        this._clickMenu = new gui.Menu();
        this.addMenuItem(this._clickMenu);
        document.addEventListener('mousedown', function(event) {
            if (event.button === paramClickMenu) {
                this._clickMenu.popup(event.pageX, event.pageY);
            }
        }.bind(this));
    };

    SceneManager.executeMenuCommand = function(code, param) {
        var command = this['executeMenuCommand' + code];
        if (command) command.call(SceneManager, param);
    };

    SceneManager.executeMenuCommand101 = function(param) {
        if (!paramMapOnly || this.isCurrentScene(Scene_Map)) {
            $gameSwitches.setValue(param, true);
        }
    };

    SceneManager.executeMenuCommand102 = function() {
        Graphics.switchStretchModeForMenuBarAddition();
    };

    SceneManager.executeMenuCommand103 = function() {
        Graphics.switchFullScreenForMenuBarAddition();
    };

    SceneManager.executeMenuCommand104 = function() {
        location.reload();
    };

    SceneManager.isCurrentScene = function(sceneClass) {
        return this._scene && this._scene.constructor === sceneClass;
    };

    SceneManager.addMenuItem = function(menu) {
        var gui = require('nw.gui');
        this._menuCommands.forEach(function(commandInfo) {
            if (!commandInfo.valid) return;
            var menuItem   = new gui.MenuItem(
                {label: commandInfo.name + (commandInfo.key ? '(' + commandInfo.key + ')' : '')}
            );
            menuItem.click = function() {
                SceneManager.executeMenuCommand(commandInfo.code, commandInfo.param);
            };
            menu.append(menuItem);
        });
    };

    SceneManager.getAllMenuCommands = function() {
        var commands = this.normalMenuCommands.concat(paramCustomCommands);
        return commands.sort(function(a, b) {
            if (a.key && b.key) {
                return Input.functionReverseMapper[a.key] - Input.functionReverseMapper[b.key];
            } else if (a.key || b.key) {
                return a.key ? -1 : 1;
            } else {
                return a.order - b.order;
            }
        });
    };

    var _SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown      = function(event) {
        _SceneManager_onKeyDown.apply(this, arguments);
        this.onKeyDownForMenuBarAddition(event);
    };

    SceneManager.onKeyDownForMenuBarAddition = function(event) {
        paramCustomCommands.some(function(commandInfo) {
            if (Input.functionReverseMapper[commandInfo.key] === event.keyCode) {
                this.executeMenuCommand(commandInfo.code, commandInfo.param);
                return true;
            }
            return false;
        }.bind(this));
    };
})();

