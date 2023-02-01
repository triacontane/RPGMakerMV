/*=============================================================================
 FixEventAfterTransfer.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/02/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 場所移動後のイベント取得修正プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixEventAfterTransfer.js
 * @author トリアコンタン
 *
 * @help FixEventAfterTransfer.js
 *
 * イベント中に場所移動したあとで『移動ルートの指定』などキャラクターを指定する
 * イベントコマンドを実行すると無視されてしまうデフォルトの仕様を変更して、
 * 動かせるようにします。
 * 動作対象は移動後のマップの指定したIDのイベントです。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    const _Game_Interpreter_character = Game_Interpreter.prototype.character;
    Game_Interpreter.prototype.character = function(param) {
        const character = _Game_Interpreter_character.apply(this, arguments);
        if (character === null && !this.isOnCurrentMap() && !$gameParty.inBattle()) {
            return $gameMap.event(param > 0 ? param : this._eventId);
        } else {
            return character;
        }
    };
})();
