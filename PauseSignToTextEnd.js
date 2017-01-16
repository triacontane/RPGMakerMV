//=============================================================================
// PauseSignToTextEnd.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/01/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc PauseSignToTextEndPlugin
 * @author triacontane
 *
 * @help メッセージウィンドウのポーズサインが
 * テキストの末尾に表示されるようになります。
 *
 * ただし、フキダシウィンドウプラグインが有効になっている場合は
 * そちらを優先します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ポーズサインの末尾表示プラグイン
 * @author トリアコンタン
 *
 * @help メッセージウィンドウのポーズサインが
 * テキストの末尾に表示されるようになります。
 *
 * ただし、フキダシウィンドウプラグインが有効になっている場合は
 * そちらを優先します。
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

    var _Window_Message_startPause = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(this, arguments);
        if (this.isPopup && this.isPopup()) return;
        this.setPauseSignToTextEnd();
    };

    Window_Message.prototype.setPauseSignToTextEnd = function() {
        var textState = this._textState;
        var x = this.padding + textState.x;
        var y = this.padding + textState.y + textState.height;
        this._windowPauseSignSprite.anchor.x = 0;
        this._windowPauseSignSprite.anchor.y = 1;
        this._windowPauseSignSprite.move(x, y);
    };
})();



