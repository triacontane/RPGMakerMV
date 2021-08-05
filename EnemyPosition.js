/*=============================================================================
 EnemyPosition.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/08/05 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 敵キャラの位置設定プラグイン
 * @author トリアコンタン
 *
 * @help EnemyPosition.js
 *
 * 敵キャラの表示位置をメモ欄から直接指定できます。
 * 敵キャラのメモ欄に以下の通り指定してください。
 *
 * 敵キャラの表示座標を[100:200]に指定
 * <PosX:100>
 * <PosY:200>
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

    var _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.apply(this, arguments);
        var data = this.enemy();
        if (data.meta.PosX) {
            this._screenX = parseInt(data.meta.PosX);
        }
        if (data.meta.PosY) {
            this._screenY = parseInt(data.meta.PosY);
        }
    };
})();
