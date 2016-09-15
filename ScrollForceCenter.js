//=============================================================================
// ScrollForceCenter.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/09/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ScrollForceCenterPlugin
 * @author triacontane
 *
 * @help マップ画面でマップサイズにかかわらずプレイヤーが常に画面中央に
 * 配置されるようになります。
 * マップの外側が画面内に入る場合、真っ黒の状態で表示されます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SFC禁止予約         # 強制中央スクロールが禁止され通常スクロールになります。
 * SFC_DISABLE_RESERVE # 同上
 * SFC許可予約         # 再度、強制中央スクロールが許可されます。
 * SFC_ENABLE_RESERVE  # 同上
 *
 * 上記の設定はすぐには反映されず、次回場所移動後から有効になります。
 *
 * またマップ設定のメモ欄に以下の通り記述すると、マップ単位で強制中央スクロールの
 * 禁止/許可を制御できます。この設定はプラグインコマンドより優先されます。
 * <SFC禁止>     # 対象マップで強制中央スクロールが禁止されます。
 * <SFC_Disable> # 同上
 * <SFC許可>     # 対象マップで強制中央スクロールが許可されます。
 * <SFC_Enable>  # 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 強制中央スクロールプラグイン
 * @author トリアコンタン
 *
 * @help マップ画面でマップサイズにかかわらずプレイヤーが常に画面中央に
 * 配置されるようになります。
 * マップの外側が画面内に入る場合、真っ黒の状態で表示されます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SFC禁止予約         # 強制中央スクロールが禁止され通常スクロールになります。
 * SFC_DISABLE_RESERVE # 同上
 * SFC許可予約         # 再度、強制中央スクロールが許可されます。
 * SFC_ENABLE_RESERVE  # 同上
 *
 * 上記の設定はすぐには反映されず、次回場所移動後から有効になります。
 *
 * またマップ設定のメモ欄に以下の通り記述すると、マップ単位で強制中央スクロールの
 * 禁止/許可を制御できます。この設定はプラグインコマンドより優先されます。
 * <SFC禁止>     # 対象マップで強制中央スクロールが禁止されます。
 * <SFC_Disable> # 同上
 * <SFC許可>     # 対象マップで強制中央スクロールが許可されます。
 * <SFC_Enable>  # 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var metaTagPrefix = 'SFC';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
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
            this.pluginCommandScrollForceCenter(command.replace(metaTagPrefix, ''), args);
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

    Game_Interpreter.prototype.pluginCommandScrollForceCenter = function(command) {
        switch (getCommandName(command)) {
            case '禁止予約' :
            case '_DISABLE_RESERVE':
                $gameMap.setDisableForceCenterReserve(true);
                break;
            case '許可予約' :
            case '_ENABLE_RESERVE':
                $gameMap.setDisableForceCenterReserve(false);
                break;

        }
    };

    var _Game_Player_updateScroll      = Game_Player.prototype.updateScroll;
    Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
        _Game_Player_updateScroll.apply(this, arguments);
        if ($gameMap.isForceCenter()) {
            var x1 = lastScrolledX;
            var y1 = lastScrolledY;
            var x2 = this.scrolledX();
            var y2 = this.scrolledY();
            if (y2 > y1 && y2 <= this.centerY()) {
                $gameMap.scrollDown(y2 - y1);
            }
            if (x2 < x1 && x2 >= this.centerX()) {
                $gameMap.scrollLeft(x1 - x2);
            }
            if (x2 > x1 && x2 <= this.centerX()) {
                $gameMap.scrollRight(x2 - x1);
            }
            if (y2 < y1 && y2 >= this.centerY()) {
                $gameMap.scrollUp(y1 - y2);
            }
        }
    };

    var _Game_Map_initialize = Game_Map.prototype.initialize;
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.apply(this, arguments);
        this._disableForceCenter        = false;
        this._disableForceCenterReserve = false;
    };

    var _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        this.refreshDisableForceCenter();
        _Game_Map_setup.apply(this, arguments);
    };

    Game_Map.prototype.isForceCenter = function() {
        return !this._disableForceCenter;
    };

    Game_Map.prototype.setDisableForceCenterReserve = function(value) {
        this._disableForceCenterReserve = !!value;
    };

    Game_Map.prototype.refreshDisableForceCenter = function() {
        var disableForceCenter;
        if (getMetaValues($dataMap, ['禁止', '_Disable'])) {
            disableForceCenter = true;
        } else if (getMetaValues($dataMap, ['許可', '_Enable'])) {
            disableForceCenter = false;
        } else {
            disableForceCenter = this._disableForceCenterReserve;
        }
        this._disableForceCenter = disableForceCenter;
    };


    var _Game_Map_setDisplayPos = Game_Map.prototype.setDisplayPos;
    Game_Map.prototype.setDisplayPos = function(x, y) {
        _Game_Map_setDisplayPos.apply(this, arguments);
        if (this.isForceCenterHorizontal()) {
            this._displayX = x;
            this._parallaxX = this._displayX;
        }
        if (this.isForceCenterVertical()) {
            this._displayY = y;
            this._parallaxY = this._displayY;
        }
    };

    Game_Map.prototype.isForceCenterVertical = function() {
        return !this.isLoopVertical() && this.isForceCenter();
    };

    Game_Map.prototype.isForceCenterHorizontal = function() {
        return !this.isLoopHorizontal() && this.isForceCenter();
    };

    var _Game_Map_scrollDown = Game_Map.prototype.scrollDown;
    Game_Map.prototype.scrollDown = function(distance) {
        var forceCenterDisplayY = this._displayY + distance;
        _Game_Map_scrollDown.apply(this, arguments);
        if (this.isForceCenterVertical()) {
            this._displayY = forceCenterDisplayY;
        }
    };

    var _Game_Map_scrollLeft      = Game_Map.prototype.scrollLeft;
    Game_Map.prototype.scrollLeft = function(distance) {
        var forceCenterDisplayX = this._displayX - distance;
        _Game_Map_scrollLeft.apply(this, arguments);
        if (this.isForceCenterHorizontal()) {
            this._displayX = forceCenterDisplayX;
        }
    };

    var _Game_Map_scrollRight      = Game_Map.prototype.scrollRight;
    Game_Map.prototype.scrollRight = function(distance) {
        var forceCenterDisplayX = this._displayX + distance;
        _Game_Map_scrollRight.apply(this, arguments);
        if (this.isForceCenterHorizontal()) {
            this._displayX = forceCenterDisplayX;
        }
    };

    var _Game_Map_scrollUp = Game_Map.prototype.scrollUp;
    Game_Map.prototype.scrollUp = function(distance) {
        var forceCenterDisplayY = this._displayY - distance;
        _Game_Map_scrollUp.apply(this, arguments);
        if (this.isForceCenterVertical()) {
            this._displayY = forceCenterDisplayY;
        }
    };
})();

