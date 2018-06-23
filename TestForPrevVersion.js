//=============================================================================
// TestForPrevVersion.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2018/06/23 本体バージョン1.6.1に合わせて不要なヘルプの記述を削除
// 1.0.0 2018/02/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc TestForPrevVersionPlugin
 * @author triacontane
 *
 * @help TestForPrevVersion.js
 *
 * 本体バージョン1.6.1以降を使用している場合でも、コアスクリプトの
 * バージョンをあげることなくテストプレーできるようになります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 前バージョン用テストプレープラグイン
 * @author トリアコンタン
 *
 * @help TestForPrevVersion.js
 *
 * 本体バージョン1.6.1以降を使用している場合でも、コアスクリプトの
 * バージョンをあげることなくテストプレーできるようになります。
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

    var _Utils_isOptionValid = Utils.isOptionValid;
    Utils.isOptionValid = function(name) {
        if (this.isNwjs() && nw.App.argv.length > 0 && nw.App.argv[0].split('&').contains(name)) {
            return true;
        } else {
            return _Utils_isOptionValid.apply(this, arguments);
        }
    };
})();
