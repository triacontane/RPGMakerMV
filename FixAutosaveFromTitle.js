/*=============================================================================
 FixAutosaveFromTitle.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/08/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc タイトル遷移直後はオートセーブしないプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixAutosaveFromTitle.js
 * @author トリアコンタン
 *
 * @help FixAutosaveFromTitle.js
 *　
 * マップ画面からタイトル画面に戻ったあとで
 * ニューゲームやコンティニューした直後にオートセーブされる仕様を修正します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Scene_Map_shouldAutosave = Scene_Map.prototype.shouldAutosave;
    Scene_Map.prototype.shouldAutosave = function() {
        const result = _Scene_Map_shouldAutosave.apply(this, arguments);
        return result && !SceneManager.isFromTitle();
    };

    SceneManager.isFromTitle = function() {
        return this._previousClass === Scene_Title;
    }
})();
