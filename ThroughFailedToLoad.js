//=============================================================================
// ThroughFailedToLoad.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.4.1 2022/12/30 画像のエラー無視が、ピクチャの表示など限られたケースでしか機能していなかった問題を修正
// 2.4.0 2021/06/07 MZ版としてリファクタリング
// 2.3.1 2017/10/30 アニメーション画像に対するエラーが無視が無効になっていた問題を修正
// 2.3.0 2017/10/29 音声ファイルと画像ファイルのいずれかのみ無視する機能を追加
// 2.2.0 2017/06/18 本体v1.5.0で機能しなくなる問題を修正
// 2.1.1 2017/03/11 通常版1.3.5でエラーになる問題を修正
// 2.1.0 2017/03/11 本体v1.3.5(コミュニティ版)で機能しなくなる問題を修正
// 2.0.0 2016/08/05 本体v1.3.0対応（1.2.0では使えなくなります）
// 1.0.0 2016/06/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ロード失敗エラーのすり抜けプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ThroughFailedToLoad.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param InvalidIfTest
 * @text テストプレー時無効
 * @desc テストプレー時は本プラグインの機能が無効になります。
 * @default true
 * @type boolean
 *
 * @param InvalidIfWeb
 * @text Web版で無効
 * @desc Web版実行時は本プラグインの機能が無効になります。
 * @default false
 * @type boolean
 *
 * @param ThroughType
 * @text 無視種別
 * @desc 無視する素材の種別です。
 * @default 3
 * @type select
 * @option 音声のみ
 * @value 1
 * @option 画像のみ
 * @value 2
 * @option 全て
 * @value 3
 *
 * @help 存在しない画像、音声素材が指定された場合に発生するエラーを無視します。
 * 音声の場合は何も再生されず、画像の場合は空の透明画像がセットされます。
 *
 * エラーログは通常通り出力されます。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // プラグイン無効条件の判定
    //=============================================================================
    if (param.InvalidIfTest && Utils.isOptionValid('test')) {
        return;
    } else if (param.InvalidIfWeb && !Utils.isNwjs()) {
        return;
    }

    if (param.ThroughType !== 1) {
        //=============================================================================
        // Bitmap
        //  エラー発生用のフラグをキャンセルします。
        //=============================================================================
        const _Bitmap_isReady = Bitmap.prototype.isReady;
        Bitmap.prototype.isReady = function() {
            if (this.isError()) {
                this.eraseError();
            }
            return _Bitmap_isReady.apply(this, arguments);
        };

        const _Bitmap_decode = Bitmap.prototype.decode;
        Bitmap.prototype.decode = function(){
            _Bitmap_decode.apply(this, arguments);
            if (this._loadingState === 'requesting') {
                this._image.addEventListener('error', this._onError.bind(this));
            }
        };

        Bitmap.prototype.eraseError = function() {
            this._loadingState = 'loaded';
        };

        ImageManager.throwLoadError = function(bitmap) {
            bitmap.eraseError();
        };
    }

    if (param.ThroughType !== 2) {
        //=============================================================================
        // AudioManager
        //  エラーチェック処理を無視します。
        //=============================================================================
        AudioManager.checkErrors = function() {};
    }
})();

