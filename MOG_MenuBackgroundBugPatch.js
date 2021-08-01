/*=============================================================================
 MOG_MenuBackgroundBugPatch.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/08/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc MOG_MenuBackgroundバグパッチ
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MOG_MenuBackgroundBugPatch.js
 * @orderAfter MOG_MenuBackground
 * @author トリアコンタン
 *
 * @help MOG_MenuBackgroundBugPatch.js
 *　
 * MOG_MenuBackground.jsにおいて[Disable Scenes]に指定した
 * 画面を開こうとするとエラーになる問題を修正します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Scene_MenuBase_updateMenuBackground = Scene_MenuBase.prototype.updateMenuBackground;
    Scene_MenuBase.prototype.updateMenuBackground = function() {
        if (!(this._backgroundSprite instanceof TilingSprite)) {
            return;
        }
        _Scene_MenuBase_updateMenuBackground.apply(this, arguments);
    };
})();
