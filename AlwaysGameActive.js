/*=============================================================================
 AlwaysGameActive.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/01/26 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 常時ゲームアクティブプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AlwaysGameActive.js
 * @author トリアコンタン
 *
 * @help AlwaysGameActive.js
 *　
 * ウィンドウからフォーカスが外れたときにゲームが停止するMZの仕様を廃止し
 * フォーカスが外れてもゲームが動き続けるようになります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    SceneManager.isGameActive = function() {
        return true;
    };
})();
