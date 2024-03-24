/*=============================================================================
 ShopInvalidateSeal.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/03/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ショップ画面での装備封印無効化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ShopStatusInvalidateSeal.js
 * @author トリアコンタン
 *
 * @help ShopInvalidateSeal.js
 *
 * ショップ画面においてアクターの装備封印を無効化します。
 * 封印された装備でもステータス差分を確認できるようになります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_BattlerBase_isEquipTypeSealed = Game_BattlerBase.prototype.isEquipTypeSealed;
    Game_BattlerBase.prototype.isEquipTypeSealed = function(etypeId) {
        const result = _Game_BattlerBase_isEquipTypeSealed.apply(this, arguments);
        if (SceneManager._scene instanceof Scene_Shop) {
            return false;
        } else {
            return result;
        }
    };
})();
