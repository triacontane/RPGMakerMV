/*=============================================================================
 BugfixWindowWithBlend.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/10/14 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ウィンドウ開閉時に白い物体が映り込むことがある問題の修正パッチ
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BugfixWindowWithBlend.js
 * @author トリアコンタン
 *
 * @help BugfixWindowWithBlend.js
 *　
 * 特定の条件下でウィンドウ開閉時に白い物体が映り込む問題を修正します。
 * 以下の手順で再現する問題です。
 * 1. ピクチャを合成方法『通常』以外で表示
 * 2. 選択肢の表示を背景『透明』で表示
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Window_drawShape = Window.prototype.drawShape;
    Window.prototype.drawShape = function(graphics) {
        if (this.opacity === 0) {
            return;
        }
        _Window_drawShape.apply(this, arguments);
    };
})();
