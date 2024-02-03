/*=============================================================================
 GameEndCustomize.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/02/03 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ゲーム終了カスタマイズプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/GameEndCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param load
 * @text ロード項目名
 * @desc ロードの項目名です。
 * @default ロード
 *
 * @param shutdown
 * @text シャットダウン項目名
 * @desc シャットダウンの項目名です。
 * @default シャットダウン
 *
 * @param itemNumber
 * @text 項目数
 * @desc ゲーム終了ウィンドウの項目数です。指定しなかった場合、並び順で指定した項目数になります。競合などで指定する場合のみ使用します。
 * @type number
 * @default 0
 *
 * @param orderList
 * @text 並び順
 * @desc ゲーム終了ウィンドウの項目の並び順です。不要な項目は削除してください。
 * @type select[]
 * @default ["toTitle","cancel"]
 * @option タイトルに戻る
 * @value toTitle
 * @option やめる
 * @value cancel
 * @option ロード
 * @value load
 * @option シャットダウン
 * @value shutdown
 *
 * @help GameEndCustomize.js
 *
 * ゲーム終了画面をカスタマイズします。
 * 以下の項目が追加可能になります
 * ・ロード
 * ・シャットダウン
 *
 * 以下の項目が消去可能になります。
 * ・タイトルに戻る
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

function Scene_Terminate() {
    this.initialize.apply(this, arguments);
}

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.orderList) {
        param.orderList = [];
    }

    const _Window_GameEnd_makeCommandList = Window_GameEnd.prototype.makeCommandList;
    Window_GameEnd.prototype.makeCommandList = function() {
        _Window_GameEnd_makeCommandList.apply(this, arguments);
        this.removeCommand('toTitle');
        this.removeCommand('cancel');
        this.addCustomCommand();
    };

    Window_GameEnd.prototype.removeCommand = function(symbol) {
        const index = this.findSymbol(symbol);
        if (index >= 0) {
            this._list.splice(index, 1);
        }
    };

    Window_GameEnd.prototype.addCustomCommand = function() {
        param.orderList.forEach(symbol => {
            this.addCommand(this.findCommandName(symbol), symbol, true);
        });
    };

    Window_GameEnd.prototype.findCommandName = function(symbol) {
        switch (symbol) {
            case 'toTitle':
                return TextManager.toTitle;
            case 'cancel':
                return TextManager.cancel;
            case 'load':
                return param.load;
            case 'shutdown':
                return param.shutdown;
        }
    };

    const _Scene_GameEnd_createCommandWindow = Scene_GameEnd.prototype.createCommandWindow;
    Scene_GameEnd.prototype.createCommandWindow = function() {
        _Scene_GameEnd_createCommandWindow.apply(this, arguments);
        this._commandWindow.setHandler('load', this.commandLoad.bind(this));
        this._commandWindow.setHandler('shutdown', this.commandShutdown.bind(this));
    };

    Scene_GameEnd.prototype.commandLoad = function() {
        this._commandWindow.close();
        SceneManager.push(Scene_Load);
    };

    Scene_GameEnd.prototype.commandShutdown = function() {
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Terminate);
    };

    const _Scene_GameEnd_commandWindowRect = Scene_GameEnd.prototype.commandWindowRect;
    Scene_GameEnd.prototype.commandWindowRect = function() {
        const rect = _Scene_GameEnd_commandWindowRect.apply(this, arguments);
        rect.height = this.calcWindowHeight(param.itemNumber || param.orderList.length, true);
        rect.y = (Graphics.boxHeight - rect.height) / 2;
        return rect;
    };

    //=============================================================================
    // Scene_Terminate
    //  ゲームを終了します。
    //=============================================================================
    Scene_Terminate.prototype = Object.create(Scene_Base.prototype);
    Scene_Terminate.prototype.constructor = Scene_Terminate;

    Scene_Terminate.prototype.start = function() {
        SceneManager.terminate();
    };
})();
