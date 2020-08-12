/*=============================================================================
 SwapNewGameAndContinue.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/05/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ニューゲーム、コンティニュー順序入れ替えプラグイン
 * @target MZ @author トリアコンタン
 *
 * @help SwapNewGameAndContinue.js
 *
 * タイトル画面でニューゲームとコンティニューの順序を入れ替えます。
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

    var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.apply(this, arguments);
        this.swapNewGameAndContinue();
    };

    Window_TitleCommand.prototype.swapNewGameAndContinue = function() {
        var list = this._list;
        var newGameCommand = list.filter(function(command) {
            return command.symbol === 'newGame';
        })[0];
        var continueCommand = list.filter(function(command) {
            return command.symbol === 'continue';
        })[0];
        if (newGameCommand && continueCommand) {
            var newGameIndex = list.indexOf(newGameCommand);
            var continueIndex = list.indexOf(continueCommand);
            list[continueIndex] = newGameCommand;
            list[newGameIndex] = continueCommand;
        }
    };
})();
