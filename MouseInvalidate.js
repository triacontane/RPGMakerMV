/*=============================================================================
 MouseInvalidate.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2025/06/16 指定したスイッチがONの時のみマウスやタッチ操作を無効化する機能を追加
 1.0.0 2022/07/07 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc タッチ操作無効化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MouseInvalidate.js
 * @author トリアコンタン
 *
 * @param switchId
 * @text 無効化スイッチID
 * @desc 指定した場合、スイッチがONの時のみマウスやタッチ操作を無効化します。
 * @default 0
 * @type switch
 *
 * @help MouseInvalidate.js
 *　
 * ゲーム中の全ての局面でマウスやタッチ操作を完全に無効化します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    const switchId = param.switchId;

    const _TouchInput_update = TouchInput.update;
    TouchInput.update = function() {
        if (this.isTouchInvalid()) {
            if (this._wasValid) {
                this.clear();
                this._wasValid = false;
            }
            return;
        }
        this._wasValid = true;
        _TouchInput_update.apply(this, arguments);
    };

    TouchInput.isTouchInvalid = function() {
        return !switchId || $gameSwitches?.value(switchId);
    };
})();
