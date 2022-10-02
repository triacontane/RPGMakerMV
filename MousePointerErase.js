/*=============================================================================
 MousePointerErase.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/10/02 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc マウスポインタ消去プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MousePointerErase.js
 * @author トリアコンタン
 *
 * @help MousePointerErase.js
 *　
 * ゲームウィンドウ内にマウスポインタが存在するとき
 * キーボードやパッドの入力を検知するとマウスポインタが非表示になります。
 * マウスポインタを動かすと再表示されます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Input_update = Input.update;
    Input.update      = function() {
        const oldDate = this.date;
        _Input_update.apply(this, arguments);
        if (this.date !== oldDate) {
            Graphics.setHiddenPointer(true);
        }
    };

    const _TouchInput__onMouseMove = TouchInput._onMouseMove;
    TouchInput._onMouseMove      = function(event) {
        _TouchInput__onMouseMove.apply(this, arguments);
        Graphics.setHiddenPointer(false);
    };

    Graphics.setHiddenPointer = function(value) {
        document.body.style.cursor = value ? 'none' : '';
    };
})();
