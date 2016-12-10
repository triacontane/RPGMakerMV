//=============================================================================
// LoadPoint.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2016/12/10 ロードした際に、ロード元でイベントが実行中だった場合に続きが実行されてしまう現象を修正
// 1.0.1 2016/10/30 少しリファクタリング
// 1.0.0 2016/10/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc LoadPointPlugin
 * @author triacontane
 *
 * @param MapIDVariable
 * @desc ロード地点のマップIDを記憶する変数番号です。
 * @default 0
 *
 * @param MapXVariable
 * @desc ロード地点のX座標を記憶する変数番号です。
 * @default 0
 *
 * @param MapYVariable
 * @desc ロード地点のY座標を記憶する変数番号です。
 * @default 0
 *
 * @param DirectionVariable
 * @desc ロード地点のプレイヤーの向きを記憶する変数番号です。
 * @default 0
 *
 * @help コンティニュー時に、セーブした場所ではなく
 * あらかじめ記憶しておいたロード地点から再開します。
 *
 * プラグインパラメータで指定したマップID、X座標、Y座標、向きを記憶する
 * 変数にロードポイント情報を記憶します。
 * 設定はイベントから行うか、あるいは現在位置を記憶するコマンドを使用します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * LP_無効化         # 一時的にプラグインの機能を無効化します。
 * LP_INVALID        # 同上
 * LP_有効化         # 無効化した機能を元に戻します。
 * LP_VALID          # 同上
 * LP_現在位置を設定 # プレイヤーの現在位置を各変数に保存します。
 * LP_SET_POINT      # 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ロード地点設定プラグイン
 * @author トリアコンタン
 *
 * @param マップID変数
 * @desc ロード地点のマップIDを記憶する変数番号です。
 * @default 0
 *
 * @param X座標変数
 * @desc ロード地点のX座標を記憶する変数番号です。
 * @default 0
 *
 * @param Y座標変数
 * @desc ロード地点のY座標を記憶する変数番号です。
 * @default 0
 *
 * @param 向き変数
 * @desc ロード地点のプレイヤーの向きを記憶する変数番号です。
 * @default 0
 *
 * @help コンティニュー時に、セーブした場所ではなく
 * あらかじめ記憶しておいたロード地点から再開します。
 *
 * プラグインパラメータで指定したマップID、X座標、Y座標、向きを記憶する
 * 変数にロードポイント情報を記憶します。
 * 設定はイベントから行うか、あるいは現在位置を記憶するコマンドを使用します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * LP_無効化         # 一時的にプラグインの機能を無効化します。
 * LP_INVALID        # 同上
 * LP_有効化         # 無効化した機能を元に戻します。
 * LP_VALID          # 同上
 * LP_現在位置を設定 # プレイヤーの現在位置を各変数に保存します。
 * LP_SET_POINT      # 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'LoadPoint';
    var metaTagPrefix = 'LP_';

    var getCommandName = function(command) {
        var realCommand = (command || '').toUpperCase();
        return realCommand.replace(new RegExp('^' + metaTagPrefix), '');
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
    var paramMapIdVariable     = getParamNumber(['MapIDVariable', 'マップID変数'], 1);
    var paramMapXVariable      = getParamNumber(['MapXVariable', 'X座標変数'], 1);
    var paramMapYVariable      = getParamNumber(['MapYVariable', 'Y座標変数'], 1);
    var paramDirectionVariable = getParamNumber(['DirectionVariable', '向き変数'], 1);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        this.executePluginCommandLoadPoint(command, args);
    };

    Game_Interpreter.prototype.executePluginCommandLoadPoint = function(command) {
        switch (getCommandName(command)) {
            case '無効化' :
            case 'INVALID':
                $gameSystem.setLoadPointDisable(true);
                break;
            case '有効化' :
            case 'VALID':
                $gameSystem.setLoadPointDisable(false);
                break;
            case '現在位置を設定' :
            case 'SET_POINT':
                $gameVariables.setLoadPoint();
                break;
        }
    };

    //=============================================================================
    // Game_System
    //  ロードポイントの有効/無効を設定します。
    //=============================================================================
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._loadPointDisable = false;
    };

    Game_System.prototype.setLoadPointDisable = function(value) {
        this._loadPointDisable = value;
    };

    Game_System.prototype.isLoadPointDisable = function() {
        return !!this._loadPointDisable;
    };

    //=============================================================================
    // Game_Map
    //  ロード時に実行していたイベントを中断します。
    //=============================================================================
    Game_Map.prototype.abortInterpreter = function() {
        if (this.isEventRunning()) {
            this._interpreter.command115();
        }
    };

    //=============================================================================
    // Game_Variables
    //  現在位置をロードポイントとして記憶します。
    //=============================================================================
    Game_Variables.prototype.setLoadPoint = function() {
        this.setValue(paramMapIdVariable, $gameMap.mapId());
        this.setValue(paramMapXVariable, $gamePlayer.x);
        this.setValue(paramMapYVariable, $gamePlayer.y);
        this.setValue(paramDirectionVariable, $gamePlayer.direction());
    };

    //=============================================================================
    // Game_Player
    //  ロードポイントに移動する処理を追加定義します。
    //=============================================================================
    Game_Player.prototype.moveLoadPoint = function() {
        if ($gameSystem.isLoadPointDisable()) return;
        var mapId = $gameVariables.value(paramMapIdVariable);
        var x     = $gameVariables.value(paramMapXVariable);
        var y     = $gameVariables.value(paramMapYVariable);
        var d     = $gameVariables.value(paramDirectionVariable);
        this.reserveTransfer(mapId, x, y, d);
        if ($gameMap.mapId() !== mapId) {
            this.requestMapReload();
        }
        $gameMap.abortInterpreter();
    };

    //=============================================================================
    // Scene_Load
    //  ロード成功時にロードポイントに移動します。
    //=============================================================================
    var _Scene_Load_onLoadSuccess      = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function() {
        _Scene_Load_onLoadSuccess.apply(this, arguments);
        $gamePlayer.moveLoadPoint();
    };
})();

