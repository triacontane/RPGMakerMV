//=============================================================================
// BugFixWaterSurfaceLag.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/06/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc オートタイルのラグ修正プラグイン
 * @author トリアコンタン
 *
 * @help 処理落ちした際に稀に発生するオートタイルの描画ズレを解消します。
 *
 * コアスクリプトのバージョン1.1.0より高負荷時の処理落ち対策のため
 * ゲームオブジェクトの更新と実際の描画とが同期しなくなりましたが、
 * オートタイルのカウンタのインクリメントがこれに対応していませんでした。
 *
 * 本プラグインではこれを修正し、処理落ち時も適切にオートタイルが
 * 切り替わるように修正します。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  バグ修正プラグインにつき規約なしの無条件でご利用頂けます。
 */

(function() {
    'use strict';

    var _Tilemap_update = Tilemap.prototype.update;
    Tilemap.prototype.update = function() {
        _Tilemap_update.apply(this, arguments);
        this.animationCount--;
    };

    var _Tilemap_updateTransform = Tilemap.prototype.updateTransform;
    Tilemap.prototype.updateTransform = function() {
        this.animationCount++;
        _Tilemap_updateTransform.apply(this, arguments);
    };
})();

