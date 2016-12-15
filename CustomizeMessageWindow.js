//=============================================================================
// CustomizeMessageWindow.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/12/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc CustomizeMessageWindowPlugin
 * @author triacontane
 *
 * @help 顔グラフィックがメッセージウィンドウの
 * 右側に表示されるようになります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * Plugin Command
 *  XXXXX [XXX]
 *  ex1：XXXXX 1
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 顔グラフィック表示位置変更プラグイン
 * @author トリアコンタン
 *
 * @help 顔グラフィックがメッセージウィンドウの
 * 右側に表示されるようになります。
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

    Window_Message.prototype.drawMessageFace = function() {
        this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), this.contentsWidth() - Window_Base._faceWidth, 0);
    };

    Window_Message.prototype.newLineX = function() {
        return 0;
    };
})();



