//=============================================================================
// BugFixTabLostFocus.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2018/03/17 ヘルプの記述を微修正
// 1.1.0 2018/03/17 実装方法をシンプルに変更
// 1.0.0 2017/07/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BugFixTabLostFocusPlugin
 * @author triacontane
 *
 * @help 特定条件(※1)でタブキーを押下したときに発生する
 * ロストフォーカスイベントを無効化します。
 * この現象はGame.exeでのみ発生します。
 *
 * ※1 起動後、初めてタブキーを押下した場合や、マウス操作後に押下した場合など
 *
 * このプラグインによって以下の現象が解消されます。
 * ・タブの初回キー入力が無効になる
 * ・タブ入力時、他のキーの押下状態がすべて解除される
 * ・一度でもTabキーを押下した後で、別のキーを押し続けたまま
 * 　ロストフォーカスすると対象キーを押し続けたままになってしまう
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc タブのロストフォーカス無効化プラグイン
 * @author トリアコンタン
 *
 * @help 特定条件(※1)でタブキーを押下したときに発生する
 * ロストフォーカスイベントを無効化します。
 * この現象はGame.exeでのみ発生します。
 *
 * ※1 起動後、初めてタブキーを押下した場合や、マウス操作後に押下した場合など
 *
 * このプラグインによって以下の現象が解消されます。
 * ・タブの初回キー入力が無効になる
 * ・タブ入力時、他のキーの押下状態がすべて解除される
 * ・一度でもTabキーを押下した後で、別のキーを押し続けたまま
 * 　ロストフォーカスすると対象キーを押し続けたままになってしまう
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

    var _Input__shouldPreventDefault = Input._shouldPreventDefault;
    Input._shouldPreventDefault = function(keyCode) {
        return _Input__shouldPreventDefault.apply(this, arguments) || keyCode === 9; // Tab
    };
})();

