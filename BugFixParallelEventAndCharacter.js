//=============================================================================
// BugFixParallelEventAndCharacter.js
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/01/06 他のイベントを対象に動作指定しても「このイベント」が対象になってしまうバグを修正
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
 *  バグ修正プラグインにつき規約なしの無条件でご利用頂けます。
 */
(function () {
    'use strict';

    Object.defineProperty(Game_Interpreter.prototype, '_character', {
        get: function() {
            return this.character(this._characterId);
        },
        set: function(character) {
            this._characterId = character instanceof Game_Event ? this._characterId = character._eventId :
                character instanceof Game_Player ? -1 : null;
        }
    });
})();
