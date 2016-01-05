//=============================================================================
// BugFixParallelEventAndCharacter.js
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/01/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 並列処理イベントのセーブ失敗バグ修正プラグイン
 * @author トリアコンタン
 *
 * @help 並列処理イベントで対象を「このイベント」にして
 * 「移動ルートの指定」「アニメーションの表示」「フキダシアイコンの表示」を実行中にセーブすると、
 * セーブできずファイルが消失する現象の修正
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    'use strict';

    var _Game_Interpreter_clear = Game_Interpreter.prototype.clear;
    Game_Interpreter.prototype.clear = function() {
        _Game_Interpreter_clear.call(this);
        this._characterId = 0;
    };

    Object.defineProperty(Game_Interpreter.prototype, '_character', {
        get: function() {
            return this.character(this._characterId);
        },
        set: function(character) {
            if (character == null) return;
            this._characterId = (character instanceof Game_Player ? -1 : this._eventId);
        },
        configurable: false
    });
})();
