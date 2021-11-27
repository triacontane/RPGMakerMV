/*=============================================================================
 SaveImageAllMember.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2021/11/27 フェイスグラフィックの全員表示に対応(フェイスグラフィックへの変更機能は実装していません)
 1.0.0 2021/11/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc セーブ画像の全メンバー表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SaveImageAllMember.js
 * @author トリアコンタン
 *
 * @help SaveImageAllMember.js
 *
 * セーブファイルのキャラクター画像を全メンバーに変更します。
 * （デフォルト仕様ではバトルメンバーのみ）
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';

    Game_Party.prototype.charactersForSavefile = function() {
        return this.allMembers().map(function(actor) {
            return [actor.characterName(), actor.characterIndex()];
        });
    };

    Game_Party.prototype.facesForSavefile = function() {
        return this.allMembers().map(function(actor) {
            return [actor.faceName(), actor.faceIndex()];
        });
    };
})();
