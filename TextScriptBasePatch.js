/*=============================================================================
 TextScriptBasePatch.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/01/18 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc TextScriptBaseパッチ
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TextScriptBasePatch.js
 * @base TextScriptBase
 * @orderAfter TextScriptBase
 * @author トリアコンタン
 *
 * @help TextScriptBasePatch.js
 *
 * TextScriptBase.jsにてパラメータのテキストに制御文字\v[n] \c[n]等が
 * 使えない問題の対策パッチです。
 */

(() => {
    'use strict';

    const _Game_System_getTextBase = Game_System.prototype.getTextBase;
    Game_System.prototype.getTextBase = function(id) {
        let text = _Game_System_getTextBase.apply(this, arguments);
        text = text.replace(/\\/g, "\x1b");
        text = text.replace(/\x1b\x1b/g, "\\");
        return text;
    };
})();
