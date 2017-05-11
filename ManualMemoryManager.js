//=============================================================================
// ManualMemoryManager.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/05/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ManualMemoryManagerPlugin
 * @author triacontane
 *
 * @help 画像ファイル名を明示的に指定して手動でキャッシュから削除します。
 * アツマール版コアスクリプト(community-1.2b)以降で動作します。
 * Debug_ReportMemory.jsを使用すると状況を監視できます。
 *
 * 以下のスクリプトを実行してください。
 *
 * スクリプト
 * ImageManager.deletePicture(file)        # ピクチャ[file]をキャッシュから削除
 * ImageManager.deleteParallax(file)       # 遠景[file]をキャッシュから削除
 * ImageManager.deleteAnimation(file, hue) # アニメ[file]をキャッシュから削除
 * ImageManager.deleteTileset(file)        # タイル[file]をキャッシュから削除
 * ImageManager.deleteBattleback1(file)    # 戦闘背景1[file]をキャッシュから削除
 * ImageManager.deleteBattleback2(file)    # 戦闘背景2[file]をキャッシュから削除
 * ImageManager.deleteBitmap(folder, file, hue) # 任意の画像をキャッシュから削除
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メモリ手動管理プラグイン
 * @author トリアコンタン
 *
 * @help 画像ファイル名を明示的に指定して手動でキャッシュから削除します。
 * アツマール版コアスクリプト(community-1.2b)以降で動作します。
 * Debug_ReportMemory.jsを使用すると状況を監視できます。
 *
 * 以下のスクリプトを実行してください。
 *
 * スクリプト
 * ImageManager.deletePicture(file)        # ピクチャ[file]をキャッシュから削除
 * ImageManager.deleteParallax(file)       # 遠景[file]をキャッシュから削除
 * ImageManager.deleteAnimation(file, hue) # アニメ[file]をキャッシュから削除
 * ImageManager.deleteTileset(file)        # タイル[file]をキャッシュから削除
 * ImageManager.deleteBattleback1(file)    # 戦闘背景1[file]をキャッシュから削除
 * ImageManager.deleteBattleback2(file)    # 戦闘背景2[file]をキャッシュから削除
 * ImageManager.deleteBitmap(folder, file, hue) # 任意の画像をキャッシュから削除
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    //=============================================================================
    // ImageManager
    //  キャッシュ削除処理を呼び出します。
    //=============================================================================
    ImageManager.deletePicture = function(filename, hue) {
        return this.deleteBitmap('img/pictures/', filename, hue);
    };

    ImageManager.deleteParallax = function(filename, hue) {
        return this.deleteBitmap('img/parallaxes/', filename, hue);
    };

    ImageManager.deleteAnimation = function(filename, hue) {
        return this.deleteBitmap('img/animations/', filename, hue);
    };

    ImageManager.deleteTileset = function(filename, hue) {
        return this.deleteBitmap('img/tilesets/', filename, hue);
    };

    ImageManager.deleteBattleback1 = function(filename, hue) {
        return this.deleteBitmap('img/battlebacks1/', filename, hue);
    };

    ImageManager.deleteBattleback2 = function(filename, hue) {
        return this.deleteBitmap('img/battlebacks2/', filename, hue);
    };

    ImageManager.deleteBitmap = function(folder, filename, hue) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var key = this._generateCacheKey(path, hue || 0);
        this._imageCache.delete(key);
    };

    //=============================================================================
    // ImageCache
    //  指定したキーの画像をキャッシュから取り除きます。
    //=============================================================================
    ImageCache.prototype.delete = function(key) {
        if (this._items[key] && !this._mustBeHeld(this._items[key])) {
            delete this._items[key];
        }
    };
})();

