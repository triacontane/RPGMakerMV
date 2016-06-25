//=============================================================================
// ThroughFailedToLoad.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @desc Not through if test play
 * @default ON
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
 * @desc テストプレーの際は通常通りエラーを発生させます。
 * @default ON
 *
 * @help 存在しない画像、音声素材が指定された場合に発生するエラーを無視します。
 * 音声の場合は何も再生されず、画像の場合は空の透明画像がセットされます。
 *
 * エラーログは通常通り出力されます。
 *
 * 動画ファイルについてはもともとエラーを発生させていないので
 * 何もしません。
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

    //=============================================================================
    // テストプレー時は無効
    //=============================================================================
    if (paramInvalidIfTest && Utils.isOptionValid('test')) return;

    //=============================================================================
    // ImageManager
    //  ロード失敗した画像ファイルを空の画像に差し替えます。
    //=============================================================================
    var _ImageManager_isReady = ImageManager.isReady;
    ImageManager.isReady      = function() {
        var result = false;
        try {
            result = _ImageManager_isReady.apply(this, arguments);
        } catch (e) {
            for (var key in this._cache) {
                if (!this._cache.hasOwnProperty(key)) continue;
                var bitmap = this._cache[key];
                if (bitmap.isError()) {
                    bitmap.eraseError();
                    this._cache[key] = new Bitmap();
                }
            }
            result = _ImageManager_isReady.apply(this, arguments);
        }
        return result;
    };

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
        this._hasError  = false;
        this._isLoading = false;
    };
})();

