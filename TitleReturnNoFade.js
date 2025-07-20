/*=============================================================================
 TitleReturnNoFade.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/07/20 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc タイトル遷移時にフェードしないプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TitleReturnNoFade.js
 * @author トリアコンタン
 *
 * @help TitleReturnNoFade.js
 *
 * オプション画面やロード画面からタイトル画面に戻ったときに
 * 暗転してからのフェードインをせずに速やかにタイトル画面を表示します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.apply(this, arguments);
        if (SceneManager.isPreviousScene(Scene_Options) ||
            SceneManager.isPreviousScene(Scene_Load)) {
            this.clearFade();
        }
    };

    Scene_Title.prototype.clearFade = function() {
        this._fadeSign = 0;
        this._fadeDuration = 0;
        this._fadeWhite = 0;
        this._fadeOpacity = 0;
        this.updateColorFilter();
    };
})();
