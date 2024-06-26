/*=============================================================================
 FixLoadFailed.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2024/04/13 リトライボタンを無効にしない機能を追加
 1.0.0 2024/04/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ロード失敗エラーの挙動修正プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FixLoadFailed.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param testOnly
 * @text テストプレーのみ有効
 * @desc 本プラグインの適用範囲をテストプレーに限定します。
 * @default false
 * @type boolean
 *
 * @param openDirectly
 * @text ディレクトリを開く
 * @desc テストプレー時のみ、存在しないファイルを指定していたディレクトリを自動で開きます。
 * @default true
 * @type boolean
 *
 * @param noRetry
 * @text リトライ無効
 * @desc ロード失敗時のリトライ機能を無効化し、リトライボタンを非表示にします。
 * @default true
 * @type boolean
 *
 * @help FixLoadFailed.js
 *
 * 表示しようとした画像がなかったときに即座にエラーが発生するようになります。
 * （デフォルト仕様ではシーン遷移するタイミングでエラー発生）
 * また、ブラウザ実行以外ではほぼ意味を為さないRetry機能を無効化します。
 * Retry機能は設定により有効化できますが、リトライで表示成功した場合も
 * 画面上には画像が表示されない場合があります。
 *　
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (param.testOnly && !Utils.isOptionValid('test')) {
        return;
    }

    const _Bitmap_isReady = Bitmap.prototype.isReady;
    Bitmap.prototype.isReady = function() {
        if (this.isError()) {
            Bitmap._loadError = true;
            ImageManager.throwLoadError(this);
        }
        return _Bitmap_isReady.apply(this, arguments);
    };

    if (!param.noRetry) {
        const _SceneManager_updateScene = SceneManager.updateScene;
        SceneManager.updateScene = function() {
            _SceneManager_updateScene.apply(this, arguments);
            if (Bitmap._loadError && ImageManager.isReady()) {
                Bitmap._loadError = false;
            }
        };
    }

    const _SceneManager_catchLoadError = SceneManager.catchLoadError;
    SceneManager.catchLoadError = function(e) {
        if (param.openDirectly && Utils.isOptionValid('test')) {
            SceneManager.openResourceDirectly(e[1]);
        }
        if (param.noRetry) {
            e[2] = null;
        }
        _SceneManager_catchLoadError.apply(this, arguments);
    };

    SceneManager.openResourceDirectly = function(url) {
        const child_process= require('child_process');
        const path = require('path');
        const filePath = path.dirname(path.join(path.dirname(process.mainModule.filename), url));
        try {
            child_process.execSync('start "" ' + filePath);
        } catch (e) {
            console.error(e);
        }
    };
})();
