//=============================================================================
// BugFixLoadErrorChoiceSetup.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/03/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BugFixLoadErrorChoiceSetup
 * @author triacontane
 *
 * @help BugFixLoadErrorChoiceSetup
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 選択肢表示中のロードエラー修正プラグイン
 * @author トリアコンタン
 *
 * @help 選択肢が表示されている最中にセーブしたデータが
 * ロードできない不具合を修正
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

    //=============================================================================
    // Window_ChoiceList
    //  選択肢の表示中に並列処理で画面遷移して戻ってきた場合に発生するエラーを解消
    //=============================================================================
    var _Window_ChoiceList_maxChoiceWidth = Window_ChoiceList.prototype.maxChoiceWidth;
    Window_ChoiceList.prototype.maxChoiceWidth = function() {
        return this._windowContentsSprite ? _Window_ChoiceList_maxChoiceWidth.apply(this, arguments) : 96;
    };

    //=============================================================================
    // DataManager
    //  $gameMessageをセーブデータに含めるよう変更します。
    //=============================================================================
    var _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents.apply(this, arguments);
        contents.message = $gameMessage;
        return contents;
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.apply(this, arguments);
        if (contents.message) $gameMessage = contents.message;
    };

    var _Game_Interpreter_update = Game_Interpreter.prototype.update;
    Game_Interpreter.prototype.update = function() {
        _Game_Interpreter_update.apply(this, arguments);
        if ($gameMessage.isChoice() && !$gameMessage._choiceCallback) {
            $gameMessage.setChoiceCallback(function(n) {
                this._branch[this._indent] = n;
            }.bind(this));
        }
    };
})();

