//=============================================================================
// DestImageCustomize.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2021/08/05 MZ向けにリファクタリング
// 1.0.0 2017/02/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 目的地画像カスタマイズプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DestImageCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param opacity
 * @text 不透明度
 * @desc 目的地画像の不透明度です。0にすると見えなくなります。
 * @default 255
 *
 * @param blendMode
 * @text 合成方法
 * @desc 目的地画像の合成方法です。
 * @default 1
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 乗算
 * @value 2
 * @option スクリーン
 * @value 3
 * @option 減算
 * @value 28
 *
 * @param color
 * @text 表示色
 * @desc 目的地画像の表示色です。独自画像を設定した場合は無効です。(通常:white)
 * @default white
 *
 * @param originalImage
 * @text 独自画像
 * @desc 目的地画像に独自の画像を指定できます。(img/pictures)
 * @default
 * @dir img/pictures/
 * @type file
 *
 * @help 目的地画像（マップをクリックしたときの目的地）の表示内容を
 * カスタマイズします。色や不透明度を変更したり独自画像を設定したりできます。
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Sprite_Destination_createBitmap = Sprite_Destination.prototype.createBitmap;
    Sprite_Destination.prototype.createBitmap = function() {
        _Sprite_Destination_createBitmap.apply(this, arguments);
        if (param.originalImage) {
            this.createOriginalBitmap();
        } else if (param.color) {
            this.bitmap.fillAll(param.color);
        }
        this.blendMode = param.blendMode;
    };

    Sprite_Destination.prototype.createOriginalBitmap = function() {
        this.bitmap = ImageManager.loadPicture(param.originalImage);
    };

    const _Sprite_Destination_updateAnimation = Sprite_Destination.prototype.updateAnimation;
    Sprite_Destination.prototype.updateAnimation = function() {
        _Sprite_Destination_updateAnimation.apply(this, arguments);
        this.opacity *= (param.opacity / 255);
    };
})();

