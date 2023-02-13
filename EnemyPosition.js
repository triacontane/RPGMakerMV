/*=============================================================================
 EnemyPosition.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/02/13 敵キャラの位置に制御文字が使えるよう修正
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
 * 座標に変数値を設定したいときは制御文字\v[n]が使えます。
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

    var convertEscapeCharacters = function(text) {
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            return this.actorName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            return this.partyMemberName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    var _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.apply(this, arguments);
        var data = this.enemy();
        if (data.meta.PosX) {
            this._screenX = parseInt(convertEscapeCharacters(data.meta.PosX));
        }
        if (data.meta.PosY) {
            this._screenY = parseInt(convertEscapeCharacters(data.meta.PosY));
        }
    };
})();
