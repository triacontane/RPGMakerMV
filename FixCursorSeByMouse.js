/*=============================================================================
 FixCursorSeByMouse.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2019/07/10 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc FixCursorSeByMousePlugin
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author triacontane
 *
 * @help FixSelectSeByMouse.js
 *
 * マウス操作時、ウィンドウを選択した後も同じウィンドウがアクティブになるケースで
 * 余計なカーソルSEが演奏されないようにします。
 *
 * 上記現象は、アクターコマンドウィンドウで「防御」を選択した場合などで発生します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc マウス操作時のカーソルSE修正プラグイン
 * @target MZ @url https://github.com/triacontane/RPGMakerMV/tree/mz_master @author トリアコンタン
 *
 * @help FixSelectSeByMouse.js
 *
 * マウス操作時、ウィンドウを選択した後も同じウィンドウがアクティブになるケースで
 * 余計なカーソルSEが演奏されないようにします。
 *
 * 上記現象は、アクターコマンドウィンドウで「防御」を選択した場合などで発生します。
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

    var _Window_Selectable_onTouch = Window_Selectable.prototype.onTouch;
    Window_Selectable.prototype.onTouch = function(triggered) {
        this._processOk = false;
        _Window_Selectable_onTouch.apply(this, arguments);
        if (this._processOk) {
            SoundManager.stopCursor();
        }
        this._processOk = false;
    };

    var _Window_Selectable_processOk = Window_Selectable.prototype.processOk;
    Window_Selectable.prototype.processOk = function() {
        _Window_Selectable_processOk.apply(this, arguments);
        this._processOk = true;
        TouchInput.clear();
    };

    SoundManager.stopSystemSound = function(n) {
        if ($dataSystem) {
            AudioManager.stopStaticSe($dataSystem.sounds[n]);
        }
    };

    SoundManager.stopCursor = function() {
        this.stopSystemSound(0);
    };

    AudioManager.stopStaticSe = function(se) {
        if (!se.name) {
            return;
        }
        for (var i = 0; i < this._staticBuffers.length; i++) {
            var buffer = this._staticBuffers[i];
            if (buffer._reservedSeName === se.name) {
                buffer.stop();
                this.updateSeParameters(buffer, se);
                break;
            }
        }
    };
})();
