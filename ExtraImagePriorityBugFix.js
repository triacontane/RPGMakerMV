/*=============================================================================
 ExtraImagePriorityBugFix.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/09/21 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ExtraImageの優先度バグ修正パッチ
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ExtraImagePriorityBugFix.js
 * @author トリアコンタン
 * @base ExtraImage
 * @orderAfter ExtraImage
 *
 * @help ExtraImagePriorityBugFix.js
 *
 * ExtraImage.jsで画像の表示優先度の設定が
 * 正常に機能しない問題を修正します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Scene_Base_start    = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.apply(this, arguments);
        let windowLayerIndex = this._windowLayer ? this.getChildIndex(this._windowLayer) : 0;
        this._extraImages.forEach(sprite => {
            switch (sprite._data.Priority) {
                case 0:
                    this.addChild(sprite);
                    break;
                case 1:
                    this.addChildAt(sprite, windowLayerIndex);
                    windowLayerIndex++;
                    break;
                default:
                    this.addChildAt(sprite, 0);
            }
        });
    };
})();
