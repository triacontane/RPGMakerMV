/*=============================================================================
 BugFixMoviePlayError.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2018/06/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc BugFixMoviePlayErrorPlugin
 * @author triacontane
 *
 * @help BugFixMoviePlayError.js
 *
 * コアスクリプトのバージョンが1.6.1以降でイベントコマンド「ムービーの再生」を
 * 実行するとムービーによっては正常に再生できない場合がある問題を修正します。
 *
 * この現象はローカル実行(Game.exe)でのみ発生します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ムービー再生エラー修正プラグイン
 * @author トリアコンタン
 *
 * @help BugFixMoviePlayError.js
 *
 * コアスクリプトのバージョンが1.6.1以降でイベントコマンド「ムービーの再生」を
 * 実行するとムービーによっては正常に再生できない場合がある問題を修正します。
 *
 * この現象はローカル実行(Game.exe)でのみ発生します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
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

    var _Graphics_initialize = Graphics.initialize;
    Graphics.initialize = function(width, height, type) {
        _Graphics_initialize.apply(this, arguments);
        if (Utils.isNwjs()) {
            this._videoUnlocked = !Utils.isMobileDevice();
        }
    };
})();
