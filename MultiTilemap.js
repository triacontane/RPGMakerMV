//=============================================================================
// MultiTilemap.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2015/11/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 複数タイルマップイベント作成プラグイン
 * @author トリアコンタン
 * @version 1.00 2015/11/03 初版
 * 
 * @help 複数のタイルマップを一つのイベントで表現できるようになります。
 * 本棚やベッドなどをイベントとして作成する際に有効です。
 *
 * 使用方法：イベントのnoteを以下の通り指定してください。
 *  \w2\h2 (w:横のタイル数 h:縦のタイル数)
 * エディタ上でタイルマップを指定する際は、
 * 「一番左上のタイルマップ」を指定してください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {

    //=============================================================================
    // Sprite_Character
    //  イベントの横幅と高さを適用させます。
    //=============================================================================
    Sprite_Character.prototype.setFrame = function(sx, sy, pw, ph) {
        Sprite.prototype.setFrame.call(this, sx, sy, pw * this._character._width, ph * this._character._height);
    };

    //=============================================================================
    // Game_CharacterBase
    //  キャラクターの横幅と高さを 1 で設定します。
    //  衝突とイベント起動判定に使う位置情報取得処理を書き換えます。
    //=============================================================================
    var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.call(this);
        this._width  = 1;
        this._height = 1;
    };

    Game_CharacterBase.prototype.pos = function(x, y) {
        return (this._x - this._width / 2 <= x && this._x + this._width / 2 >= x) && (this._y === y);
    };

    //=============================================================================
    // Game_Event
    //  イベントから note を取得して横幅と高さを設定します。
    //=============================================================================
    var _Game_Event_refresh = Game_Event.prototype.refresh;
    Game_Event.prototype.refresh = function() {
        _Game_Event_refresh.call(this);
        var width = 1;
        var height = 1;
        if (this._tileId > 0) {
            var note = this.event().note;
            if (note) {
                note.toUpperCase().replace(/\\W(\d+)/, function() {width  = parseInt(arguments[1], 10)});
                note.toUpperCase().replace(/\\H(\d+)/, function() {height = parseInt(arguments[1], 10)});
            }
        }
        this._width = width;
        this._height = height;
    };
})();