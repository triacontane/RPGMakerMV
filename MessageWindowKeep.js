/*=============================================================================
 MessageWindowKeep.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2022/07/18 MV版を作成
 1.0.0 2022/01/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc メッセージウィンドウの維持プラグイン
 * @author トリアコンタン
 *
 * @param keepSwitch
 * @text 維持スイッチ番号
 * @desc 指定したスイッチがONのあいだ、メッセージウィンドウを閉じずに残します。
 * @default 1
 * @type switch
 *
 * @help MessageWindowKeep.js
 *
 * 指定したスイッチがONのあいだ、メッセージウィンドウを閉じずに残します。
 * スイッチがOFFになると閉じられます。
 * その他、メニュー画面の開閉でも閉じるので基本的にはイベント中に制御します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('MessageWindowKeep');

    var _Window_Message_checkToNotClose = Window_Message.prototype.checkToNotClose;
    Window_Message.prototype.checkToNotClose = function() {
        _Window_Message_checkToNotClose.apply(this, arguments);
        if (!this.doesContinue() && this.isOpen()) {
            this.close();
        }
    };

    var _Window_Message_doesContinue = Window_Message.prototype.doesContinue;
    Window_Message.prototype.doesContinue = function() {
        const result = _Window_Message_doesContinue.apply(this, arguments);
        return result || $gameSwitches.value(param.keepSwitch);
    };
})();
