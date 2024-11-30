/*=============================================================================
 ChoiceWindowInMessage.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.0 2024/11/30 5つ以上の選択肢があるときはスクロール表示するよう仕様変更
 1.1.0 2024/11/26 MZ対応版を作成
 1.0.2 2019/02/19 選択肢のみ表示するとき、ウィンドウ位置をスクリプトで変えられるよう調整
 1.0.1 2019/02/18 顔グラフィックを表示した場合、選択肢のカーソル位置がずれる問題を修正
 1.0.0 2019/02/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 選択肢のメッセージ内部表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChoiceWindowInMessage.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help ChoiceWindowInMessage.js
 *
 * イベントコマンドの「選択肢」のウィンドウが
 * メッセージウィンドウの内部に表示されるようになります。
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

    /**
     * Game_Message
     * メッセージおよび選択肢の行数を返します。
     */
    Game_Message.prototype.messageLines = function() {
        return this._texts.length;
    };

    Game_Message.prototype.choiceLines = function() {
        return this._choices.length;
    };

    Game_Message.prototype.setBaseWindowLine = function(value) {
        this._baseLine = value;
    };

    Game_Message.prototype.getBaseWindowLine = function() {
        return this._baseLine;
    };

    Game_Message.prototype.isOutInnerMessage = function(addLines) {
        const messageLines = this.messageLines();
        return messageLines > 0 && messageLines + addLines > this.getBaseWindowLine();
    };

    /**
     * Game_Interpreter
     * 文章の表示後に選択肢と数値入力が来た場合の挙動を変更します。
     */
    const _Game_Interpreter_setupChoices = Game_Interpreter.prototype.setupChoices;
    Game_Interpreter.prototype.setupChoices = function(params) {
        if ($gameMessage.isOutInnerMessage(params[0].length)) {
            this._index--;
            return;
        }
        _Game_Interpreter_setupChoices.apply(this, arguments);
    };

    /**
     * Window_Message
     * テキストの高さを返します。
     */
    const _Window_Message_initialize = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function() {
        _Window_Message_initialize.apply(this, arguments);
        $gameMessage.setBaseWindowLine(this.numVisibleRows());
    };

    const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.apply(this, arguments);
        $gameMessage.setBaseWindowLine(this.numVisibleRows());
    };

    Window_Message.prototype.getTextHeight = function() {
        return this._textState ? this._textState.y + this._textState.height : 0;
    };

    const _Window_Message_doesContinue = Window_Message.prototype.doesContinue;
    Window_Message.prototype.doesContinue = function() {
        return _Window_Message_doesContinue.apply(this, arguments) || $gameMessage.isChoice();
    };

    Window_Message.prototype.openForChoice = function() {
        if (!this._textState) {
            this.contents.clear();
        }
        $gameMessage.setPositionType(this._positionType);
        this.updatePlacement();
        this._nameBoxWindow.updatePlacement();
        this.open();
    };

    Window_Message.prototype.numVisibleRows = function() {
        return 4;
    };

    Window_Message.prototype.newLineXForLeft = function() {
        const faceExists = $gameMessage.faceName() !== "";
        const faceWidth = ImageManager.faceWidth;
        const spacing = 20;
        return faceExists ? faceWidth + spacing : 4;
    };

    /**
     * Window_ChoiceList
     * 選択肢をメッセージウィンドウに含めます。
     */
    const _Window_ChoiceList_initialize = Window_ChoiceList.prototype.initialize;
    Window_ChoiceList.prototype.initialize = function() {
        _Window_ChoiceList_initialize.apply(this, arguments);
        this._isWindow = false;
    };

    const _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function() {
        this._messageWindow.openForChoice();
        _Window_ChoiceList_start.apply(this, arguments);
    };

    const _Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {
        _Window_ChoiceList_updatePlacement.apply(this, arguments);
        this.x = this._messageWindow.x;
        const textHeight = this._messageWindow.getTextHeight();
        this.y = this._messageWindow.y + textHeight - (textHeight > 4 ? 4 : 0);
    };

    const _Window_ChoiceList_windowWidth = Window_ChoiceList.prototype.windowWidth;
    Window_ChoiceList.prototype.windowWidth = function() {
        _Window_ChoiceList_windowWidth.apply(this, arguments);
        return this._messageWindow.width;
    };

    const _Window_ChoiceList_maxLines = Window_ChoiceList.prototype.maxLines;
    Window_ChoiceList.prototype.maxLines = function() {
        const lines = _Window_ChoiceList_maxLines.apply(this, arguments);
        return this._messageWindow ? this._messageWindow.numVisibleRows() : lines;
    };

    const _Window_ChoiceList_updateBackground = Window_ChoiceList.prototype.updateBackground;
    Window_ChoiceList.prototype.updateBackground = function() {
        _Window_ChoiceList_updateBackground.apply(this, arguments);
        this.opacity = 0;
    };

    const _Window_ChoiceList_itemRect = Window_ChoiceList.prototype.itemRect;
    Window_ChoiceList.prototype.itemRect = function(index) {
        const rect = _Window_ChoiceList_itemRect.apply(this, arguments);
        if (!this._messageWindow) {
            return rect;
        }
        const newLineX = this._messageWindow.newLineXForLeft();
        rect.x += newLineX;
        rect.width -= newLineX;
        return rect;
    };

    const _Window_ChoiceList_itemHeight = Window_ChoiceList.prototype.itemHeight;
    Window_ChoiceList.prototype.itemHeight = function() {
        return _Window_ChoiceList_itemHeight.apply(this, arguments) - 4;
    };

    const _Window_ChoiceList_placeCancelButton = Window_ChoiceList.prototype.placeCancelButton;
    Window_ChoiceList.prototype.placeCancelButton = function() {
        _Window_ChoiceList_placeCancelButton.apply(this, arguments);
        if (this._cancelButton) {
            const button = this._cancelButton;
            const message = this._messageWindow;
            button.x = -this.x + message.x + message.width - button.width - 4;
            if (message.y + message.height >= Graphics.boxHeight / 2) {
                button.y = -this.y + message.y - button.height - 4;
            } else {
                button.y = -this.y + message.y + message.height + 4;
            }
        }
    };
})();
