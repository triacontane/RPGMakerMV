/*=============================================================================
 VirtualButtonCommand.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/10/22 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 仮想ボタンコマンドプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/VirtualButtonCommand.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command PRESS
 * @text 仮想ボタン押下
 * @desc 指定したボタンを押したことにします。
 *
 * @arg buttonName
 * @text ボタン名
 * @desc ボタン名です。
 * @default ok
 * @type select
 * @option 決定
 * @value ok
 * @option キャンセル
 * @value escape
 * @option シフト
 * @value shift
 * @option コントロール
 * @value control
 * @option タブ
 * @value tab
 * @option ページアップ
 * @value pageup
 * @option ページダウン
 * @value pagedown
 * @option 左
 * @value left
 * @option 上
 * @value up
 * @option 右
 * @value right
 * @option 下
 * @value down
 * @option デバッグ
 * @value debug
 *
 * @help VirtualButtonCommand.js
 *
 * 任意のボタンを押したことにするプラグインコマンドを提供します。
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

(() => {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'PRESS', args => {
        Input.virtualClick(args.buttonName);
    });

    const _Input_isPressed = Input.isPressed;
    Input.isPressed = function(keyName) {
        const result = _Input_isPressed.apply(this, arguments);
        return result || this._latestButton === keyName;
    };
})();
