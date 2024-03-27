/*=============================================================================
 OptionHelp.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/27 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc オプションヘルププラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/OptionHelp.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param helpList
 * @text ヘルプリスト
 * @desc オプション画面で表示するヘルプのリストです。
 * @default ["{\"symbol\":\"alwaysDash\",\"description\":\"Shiftキーを押さなくても自動でダッシュします。\"}","{\"symbol\":\"commandRemember\",\"description\":\"戦闘中に選択したコマンドの入力内容を記憶します。\"}","{\"symbol\":\"touchUI\",\"description\":\"メニュー画面にタッチ用のボタンを表示します。\"}","{\"symbol\":\"bgmVolume\",\"description\":\"BGMの音量を調整します。\"}","{\"symbol\":\"bgsVolume\",\"description\":\"BGSの音量を調整します。\"}","{\"symbol\":\"meVolume\",\"description\":\"MEの音量を調整します。\"}","{\"symbol\":\"seVolume\",\"description\":\"SEの音量を調整します。\"}"]
 * @type struct<Help>[]
 *
 * @help OptionHelp.js
 *
 * オプション画面にヘルプウィンドウを追加し表示できます。
 * 他のプラグインによって追加された項目にヘルプを表示したい場合、
 * 追加項目のシンボルを把握する必要があります。
 *
 * デフォルト項目のシンボルは以下です。
 * alwaysDash : 常時ダッシュ
 * commandRemember : コマンド記憶
 * touchUI : タッチUI
 * bgmVolume : BGM音量
 * bgsVolume : BGS音量
 * meVolume : ME音量
 * seVolume : SE音量
 *
 * オプション任意項目作成プラグインで追加した項目のシンボルは以下です。
 * Number1 : 数値項目[1] (2以降の場合は数値を2に置き換える)
 * Boolean1 : スイッチ項目[1]
 * String1 : 文字列項目[1]
 * Volume1 : 音量項目[1]
 *
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

/*~struct~Help:
 * @param symbol
 * @text シンボル
 * @desc ヘルプ項目のシンボル文字列です。
 * @default
 * @type string
 *
 * @param description
 * @text 説明
 * @desc ヘルプ項目の説明です。
 * @default
 * @type multiline_string
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.helpList) {
        param.helpList = [];
    }

    const _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.apply(this, arguments);
        this.createHelpWindow();
        this._optionsWindow.setHelpWindow(this._helpWindow);
    };

    const _Window_Options_updateHelp = Window_Options.prototype.updateHelp;
    Window_Options.prototype.updateHelp = function() {
        _Window_Options_updateHelp.apply(this, arguments);
        const description = param.helpList.find(item => item.symbol === this.commandSymbol(this.index()));
        this._helpWindow.setText(description ? description.description : '');
    };
})();
