//=============================================================================
// CommonInterceptor.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/01/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 割り込みコモンイベントプラグイン
 * @author トリアコンタン
 *
 * @param ニューゲームコモン
 * @desc ニューゲーム時に呼ばれるコモンイベントID
 * @default
 *
 * @param ロードコモン
 * @desc ロード完了時に呼ばれるコモンイベントID
 * @default
 *
 * @param メニューコモン
 * @desc メニュー画面を閉じた時に呼ばれるコモンイベントID
 * @default
 *
 * @help 指定したタイミングでコモンイベントを呼び出します。
 *
 * ・ニューゲーム時
 * ・ロード完了時
 * ・メニュー終了時
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    'use strict';
    var pluginName = 'CommonInterceptor';
    var paramNames = ['', 'ニューゲームコモン', 'ロードコモン', 'メニューコモン'];

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamNumber = function (paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this._interceptorType = 0;
    };

    Object.defineProperty(Game_Temp.prototype, 'interceptorType', {
        get: function() {
            return this._interceptorType;
        },
        set: function(value) {
            this._interceptorType = value.clamp(0, 3);
        },
        configurable: false
    });

    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.apply(this, arguments);
        $gameTemp.interceptorType = 1;
    };

    var _DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue = function(savefileId) {
        if (_DataManager_loadGameWithoutRescue.apply(this, arguments)) {
            $gameTemp.interceptorType = 2;
            return true;
        }
        return false;
    };

    var _Scene_Menu_terminate = Scene_Menu.prototype.terminate;
    Scene_Menu.prototype.terminate = function() {
        _Scene_Menu_terminate.apply(this, arguments);
        $gameTemp.interceptorType = 3;
    };
    //=============================================================================
    // Game_Map
    //  条件を満たした場合のコモンイベント呼び出し処理を追加定義します。
    //=============================================================================
    var _Game_Map_setupStartingEvent = Game_Map.prototype.setupStartingEvent;
    Game_Map.prototype.setupStartingEvent = function() {
        var result = _Game_Map_setupStartingEvent.apply(this, arguments);
        return result || this.setupInterceptorCommonEvent();
    };

    Game_Map.prototype.setupInterceptorCommonEvent = function() {
        var commonId = getParamNumber(paramNames[$gameTemp.interceptorType]);
        var event    = $dataCommonEvents[commonId];
        var result   = false;
        if (commonId > 0 && !this.isEventRunning() && event) {
            this._interpreter.setup(event.list);
            $gameTemp.interceptorType = 0;
            result = true;
        }
        return result;
    };
})();

