//=============================================================================
// BugFixTabLostFocus.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/07/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BugFixTabLostFocusPlugin
 * @author triacontane
 *
 * @help 特定条件(※1)でタブキーを押下したときに発生するロストフォーカスによって
 * キー入力がクリアされてしまう現象を防ぎます。
 *
 * ※1 起動後、初めてタブキーを押下した場合や、マウス操作後に押下した場合など
 *
 * この現象によってタブの初回キー入力が無効になるほか、
 * 他のキーを押し続けもすべて解除されてしまいます。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc タブのロストフォーカス無効化プラグイン
 * @author トリアコンタン
 *
 * @help 特定条件(※1)でタブキーを押下したときに発生するロストフォーカスによって
 * キー入力がクリアされてしまう現象を防ぎます。
 *
 * ※1 起動後、初めてタブキーを押下した場合や、マウス操作後に押下した場合など
 *
 * この現象によってタブの初回キー入力が無効になるほか、
 * 他のキーを押し続けもすべて解除されてしまいます。
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

    var _Input_update = Input.update;
    Input.update = function() {
        _Input_update.apply(this, arguments);
        this._preventClearOnLostFocus = false;
    };

    var _Input__onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function(event) {
        _Input__onKeyDown.apply(this, arguments);
        if (event.keyCode === 9) {
            this._preventClearOnLostFocus = true;
        }
    };

    var _Input__onLostFocus = Input._onLostFocus;
    Input._onLostFocus = function() {
        if (this._preventClearOnLostFocus) {
            this._preventClearOnLostFocus = false;
            return;
        }
        _Input__onLostFocus.apply(this, arguments);
    };
})();

