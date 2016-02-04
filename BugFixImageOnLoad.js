//=============================================================================
// BugFixImageOnLoad.js
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/04 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 画像ロード遅延時のエラー修正プラグイン
 * @author トリアコンタン
 *
 * @help スプライトで画像を指定後、画像のロードが完了する前に
 * 画像の指定を解除するとエラーで強制終了する現象の修正。
 *
 * この現象は比較的サイズの大きい画像に対して以下の命令を実行すると
 * 発生する場合があります。
 * 「ピクチャの表示」
 * 「ウェイト（1フレーム）」
 * 「ピクチャの消去」
 * また、画像ロードに時間の掛かるブラウザやモバイル端末で実行する場合
 * PCでのテスト時より発生頻度が上昇します。
 *
 * 参考：バグの原因
 * Spriteクラスでbitmapを指定したときにonloadイベントがセットされる。
 * そしてイベントが実行される前にSpriteのbitmapをnullに指定した場合、
 * Spriteとbitmapの紐付けが切れる一方、bitmapはメモリ上に残り続ける。
 * その状態でロードが完了しonloadイベントが呼ばれるとnullである
 * Sprite.bitmapのプロパティを参照しようとしてエラーで終了する。
 *
 * 利用規約：
 *  バグ修正プラグインにつき規約なしの無条件でご利用頂けます。
 */

(function () {
    'use strict';

    Object.defineProperty(Sprite.prototype, '_bitmap', {
        get: function() {
            return this.__bitmap;
        },
        set: function(value) {
            if (value == null && this.__bitmap && !this.__bitmap.isReady()) {
                this.__bitmap._loadListeners = [];
            }
            this.__bitmap = value;
        },
        configurable: true
    });
})();

