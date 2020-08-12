//=============================================================================
// HiddenLevel.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/04/04 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc HiddenLevelPlugin
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author triacontane
 *
 * @help HiddenLevel.js
 *
 * ステータスウィンドウからレベルと経験値表示を
 * 消去します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc レベル隠蔽プラグイン
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author トリアコンタン
 *
 * @help HiddenLevel.js
 *
 * ステータスウィンドウからレベルと経験値表示を
 * 消去します。
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

    Window_Base.prototype.drawActorLevel = function(actor, x, y) {

    };

    Window_Status.prototype.drawBasicInfo = function(x, y) {
        var lineHeight = this.lineHeight();
        var width = this.contents.width - x - this.standardPadding();
        this.drawActorIcons(this._actor, x, y + lineHeight);
        this.drawActorHp(this._actor, x, y + lineHeight * 2, width);
        this.drawActorMp(this._actor, x, y + lineHeight * 3, width);
    };

    Window_Status.prototype.drawExpInfo = function(x, y) {

    };
})();
