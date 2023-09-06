//=============================================================================
// CommonInterceptor.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2023/09/07 割り込みコモンを並列処理扱いで実行できる機能を追加
// 1.0.3 2022/10/09 リファクタリング
// 1.0.2 2020/09/04 ロードコモンが正常に呼ばれていなかった問題を修正
// 1.0.1 2020/08/23 MZ用にヘルプを修正
// 1.0.0 2016/01/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 割り込みコモンイベントプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CommonInterceptor.js
 * @author トリアコンタン
 *
 * @param newGameCommon
 * @text ニューゲームコモン
 * @desc ニューゲーム時に呼ばれるコモンイベントID
 * @default 0
 * @type common_event
 *
 * @param loadCommon
 * @text ロードコモン
 * @desc ロード完了時に呼ばれるコモンイベントID
 * @default 0
 * @type common_event
 *
 * @param menuCommon
 * @text メニューコモン
 * @desc メニュー画面を閉じた時に呼ばれるコモンイベントID
 * @default 0
 * @type common_event
 *
 * @param parallel
 * @text 並列処理
 * @desc 割り込みコモンを並列処理で実行する場合はONにしてください。
 * @default false
 * @type boolean
 *
 * @help CommonInterceptor.js
 *
 * 以下のタイミングでコモンイベントを呼び出します。
 * ・ニューゲーム時
 * ・ロード完了時
 * ・メニュー終了時
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    DataManager._interceptorType = null;
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.apply(this, arguments);
        this._interceptorType = 'newGameCommon';
    };

    const _DataManager_loadGame = DataManager.loadGame;
    DataManager.loadGame = function(savefileId) {
        return _DataManager_loadGame.apply(this, arguments).then(()=> {
            this._interceptorType = 'loadCommon';
        })
    };

    const _Scene_Menu_terminate = Scene_Menu.prototype.terminate;
    Scene_Menu.prototype.terminate = function() {
        _Scene_Menu_terminate.apply(this, arguments);
        DataManager._interceptorType = 'menuCommon';
    };

    //=============================================================================
    // Game_Map
    //  条件を満たした場合のコモンイベント呼び出し処理を追加定義します。
    //=============================================================================
    const _Game_Map_setupStartingEvent = Game_Map.prototype.setupStartingEvent;
    Game_Map.prototype.setupStartingEvent = function() {
        const result = _Game_Map_setupStartingEvent.apply(this, arguments);
        if (!param.parallel) {
            return result || this.setupInterceptorCommonEvent();
        } else {
            return result;
        }
    };

    const _Game_Map_updateInterpreter = Game_Map.prototype.updateInterpreter;
    Game_Map.prototype.updateInterpreter = function() {
        _Game_Map_updateInterpreter.apply(this, arguments);
        if (param.parallel) {
            this.setupInterceptorCommonEventParallel();
        }
    };

    Game_Map.prototype.setupInterceptorCommonEventParallel = function() {
        const commonId = param[DataManager._interceptorType];
        if (commonId) {
            this.setupDynamicCommon(commonId);
            DataManager._interceptorType = null;
        }
    };

    Game_Map.prototype.setupInterceptorCommonEvent = function() {
        if (!DataManager._interceptorType) {
            return false;
        }
        const commonId = param[DataManager._interceptorType];
        const event    = $dataCommonEvents[commonId];
        if (commonId > 0 && !this.isEventRunning() && event) {
            this._interpreter.setup(event.list);
            DataManager._interceptorType = null;
            return true;
        }
        return false;
    };
})();

