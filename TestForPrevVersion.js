//=============================================================================
// TestForPrevVersion.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * 本体バージョン1.6.0以降を使用している場合でも、コアスクリプトの
 * バージョンをあげることなくテストプレーできるようになります。
 * ただし、そのままだとテストプレー開始時にダイアログが出てしまい
 * テストプレーできないので以下の対応が別途必要です。
 *
 * rpg_core.jsをテキストエディタ等で開いて「Utils.RPGMAKER_VERSION」で検索して
 * 以下の通り内容を書き換えます。
 *
 * ・変更前(バージョン1.5.1の場合)
 * Utils.RPGMAKER_VERSION = "1.5.1";
 *
 * ・変更後
 * Utils.RPGMAKER_VERSION = "1.6.0";
 *
 * ※書き換える際は事前にバックアップを作成し、自己責任で実施してください。
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
 * 本体バージョン1.6.0以降を使用している場合でも、コアスクリプトの
 * バージョンをあげることなくテストプレーできるようになります。
 * ただし、そのままだとテストプレー開始時にダイアログが出てしまい
 * テストプレーできないので以下の対応が別途必要です。
 *
 * rpg_core.jsをテキストエディタ等で開いて「Utils.RPGMAKER_VERSION」で検索して
 * 以下の通り内容を書き換えます。
 *
 * ・変更前(バージョン1.5.1の場合)
 * Utils.RPGMAKER_VERSION = "1.5.1";
 *
 * ・変更後
 * Utils.RPGMAKER_VERSION = "1.6.0";
 *
 * ※書き換える際は事前にバックアップを作成し、自己責任で実施してください。
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
