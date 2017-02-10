//=============================================================================
// TimeStopInMenu.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/02/11 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc TimeStopInMenuPlugin
 * @author triacontane
 *
 * @help マップ画面もしくはバトル画面以外では
 * プレー時間の加算を停止します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メニュー中時間停止プラグイン
 * @author トリアコンタン
 *
 * @help マップ画面もしくはバトル画面以外では
 * プレー時間の加算を停止します。
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

    var _SceneManager_renderScene = SceneManager.renderScene;
    SceneManager.renderScene = function() {
        var frame = Graphics.frameCount;
        _SceneManager_renderScene.apply(this, arguments);
        if (this.disableFrameCountAdd()) {
            Graphics.frameCount = frame
        }
    };

    SceneManager.disableFrameCountAdd = function() {
        return !(this._scene instanceof Scene_Map || this._scene instanceof Scene_Battle);
    };
})();

