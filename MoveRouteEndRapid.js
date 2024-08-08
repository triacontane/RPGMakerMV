/*=============================================================================
 MoveRouteEndRapid.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/08/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 移動ルート終了時のウェイトスキッププラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MoveRouteEndRapid.js
 * @author トリアコンタン
 *
 * @help MoveRouteEndRapid.js
 *
 * 移動ルート設定において、ルート終了時に1フレーム待機する処理をスキップします。
 * 連続して移動ルート設定したときに待機が発生せずスムーズに次の移動に移行します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_Character_advanceMoveRouteIndex = Game_Character.prototype.advanceMoveRouteIndex;
    Game_Character.prototype.advanceMoveRouteIndex = function() {
        _Game_Character_advanceMoveRouteIndex.apply(this, arguments);
        const command = this._moveRoute.list[this._moveRouteIndex];
        if (command && command.code === Game_Character.ROUTE_END) {
            this.processRouteEnd();
        }
    };
})();
