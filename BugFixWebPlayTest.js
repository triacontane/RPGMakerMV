//=============================================================================
// BugFixWebPlayTest.js
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Web実行のテストプレー防止プラグイン
 * @author トリアコンタン
 *
 * @help Web実行時にURLに?testと入力して実行することで
 * 誰でもテストプレーできてしまう問題を修正
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  バグ修正プラグインにつき規約なしの無条件でご利用頂けます。
 */

(function () {
    'use strict';

    var _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this._isPlaytest = Utils.isOptionValid('test') && Utils.isNwjs();
    };
})();
