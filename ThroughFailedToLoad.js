//=============================================================================
// ThroughFailedToLoad.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.2.0 2017/06/18 本体v1.5.0で機能しなくなる問題を修正
// 2.1.1 2017/03/11 通常版1.3.5でエラーになる問題を修正
// 2.1.0 2017/03/11 本体v1.3.5(コミュニティ版)で機能しなくなる問題を修正
// 2.0.0 2016/08/05 本体v1.3.0対応（1.2.0では使えなくなります）
// 1.0.0 2016/06/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Through Failed to load
 * @author triacontane
 *
 * @param InvalidIfTest
 * @desc Not through if test play.
 * @default ON
 *
 * @param InvalidIfWeb
 * @desc Not through if Web mode.
 * @default OFF
 *
 * @help Through error of Failed to load.
 * Image not found, Audio not found.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ロード失敗エラーのすり抜けプラグイン
 * @author トリアコンタン
 *
 * @param テストプレー時無効
 * @desc テストプレー時は本プラグインの機能が無効になります。
 * @default ON
 *
 * @param Web版で無効
 * @desc Web版実行時は本プラグインの機能が無効になります。
 * @default OFF
 *
 * @help 存在しない画像、音声素材が指定された場合に発生するエラーを無視します。
 * 音声の場合は何も再生されず、画像の場合は空の透明画像がセットされます。
 *
 * エラーログは通常通り出力されます。
 *
 * 本体v1.5.0より正式に実装されたロード失敗時に3回までリロードする機能については
 * 当プラグインの機能と競合するため、無効化されます。
 *
 * フォント、データベースまたはプラグインで追加されたファイルの読み込みに
 * 失敗した場合は、通常通りエラーが発生します。
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
    var pluginName = 'ThroughFailedToLoad';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramInvalidIfTest = getParamBoolean(['InvalidIfTest', 'テストプレー時無効']);
    var paramInvalidIfWeb  = getParamBoolean(['InvalidIfWeb', 'Web版で無効']);

    //=============================================================================
    // テストプレー時は無効
    //=============================================================================
    if (paramInvalidIfTest && Utils.isOptionValid('test')) return;
    if (paramInvalidIfWeb && !Utils.isNwjs()) return;

    var _ImageManager_isReady = ImageManager.isReady;
    if (typeof ResourceHandler !== 'undefined') {
        //=============================================================================
        // ImageManager
        //  ロード失敗した画像ファイルを空の画像に差し替えます。
        //=============================================================================
        ImageManager.isReady = function() {
            this._imageCache.eraseBitmapError();
            return _ImageManager_isReady.apply(this, arguments);
        };

        //=============================================================================
        // ImageCache
        //  ロード失敗した画像ファイルを空の画像に差し替えます。
        //=============================================================================
        ImageCache.prototype.eraseBitmapError = function() {
            var items = this._items;
            Object.keys(items).forEach(function(key) {
                var bitmap = items[key].bitmap;
                if (bitmap.isError()) {
                    bitmap.eraseError();
                    items[key].bitmap = new Bitmap();
                }
            });
        };

        //=============================================================================
        // ResourceHandler
        //  リトライ機能の仕様を変更します。
        //=============================================================================
        ResourceHandler.createLoader      = function(url, retryMethod, resignMethod, retryInterval) {
            return null;
        };

        var _Graphics__playVideo = Graphics._playVideo;
        Graphics._playVideo      = function(src) {
            _Graphics__playVideo.apply(this, arguments);
            this._video.onerror = this._videoLoader || this._onVideoError.bind(this);
        };
    } else {
        //=============================================================================
        // ImageManager
        //  ロード失敗した画像ファイルを空の画像に差し替えます。
        //=============================================================================
        ImageManager.isReady = function() {
            var result = false;
            try {
                result = _ImageManager_isReady.apply(this, arguments);
            } catch (e) {
                for (var key in this.cache._inner) {
                    if (!this.cache._inner.hasOwnProperty(key)) continue;
                    var bitmap = this.cache._inner[key].item;
                    if (bitmap.isError()) {
                        bitmap.eraseError();
                        this.cache.setItem(key, new Bitmap());
                    }
                }
                result = _ImageManager_isReady.apply(this, arguments);
            }
            return result;
        };
    }

    //=============================================================================
    // AudioManager
    //  エラーチェック処理を無視します。
    //=============================================================================
    AudioManager.checkErrors = function() {};

    //=============================================================================
    // Bitmap
    //  エラー発生用のフラグをキャンセルします。
    //=============================================================================
    Bitmap.prototype.eraseError = function() {
        this._hasError     = false;
        this._isLoading    = false;
        this._loadingState = 'loaded';
    };
})();

