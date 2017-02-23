//=============================================================================
// DestImageCustomize.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/02/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc DestinationImageCustomizePlugin
 * @author triacontane
 *
 * @param Opacity
 * @desc 目的地画像の不透明度です。0にすると見えなくなります。
 * @default 255
 *
 * @param BlendMode
 * @desc 目的地画像の合成方法です。0:通常 1:加算 2:乗算 3:スクリーン
 * @default 1
 *
 * @param Color
 * @desc 目的地画像の表示色です。(通常:white)
 * @default
 *
 * @param OriginalImage
 * @desc 目的地画像に独自の画像を指定できます。(img/pictures)
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @help 目的地画像（マップをクリックしたときの目的地）の表示内容を
 * カスタマイズします。色や不透明度を変更したり独自画像を設定したりできます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 目的地画像カスタマイズプラグイン
 * @author トリアコンタン
 *
 * @param 不透明度
 * @desc 目的地画像の不透明度です。0にすると見えなくなります。
 * @default 255
 *
 * @param 合成方法
 * @desc 目的地画像の合成方法です。0:通常 1:加算 2:乗算 3:スクリーン
 * @default 1
 *
 * @param 表示色
 * @desc 目的地画像の表示色です。(通常:white)
 * @default
 *
 * @param 独自画像
 * @desc 目的地画像に独自の画像を指定できます。(img/pictures)
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @help 目的地画像（マップをクリックしたときの目的地）の表示内容を
 * カスタマイズします。色や不透明度を変更したり独自画像を設定したりできます。
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
    var pluginName    = 'DestImageCustomize';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param           = {};
    param.opacity       = getParamNumber(['Opacity', '不透明度']);
    param.blendMode     = getParamNumber(['BlendMode', '合成方法']);
    param.color         = getParamString(['Color', '表示色']);
    param.originalImage = getParamString(['OriginalImage', '独自画像']);

    var _Sprite_Destination_createBitmap = Sprite_Destination.prototype.createBitmap;
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

    var _Sprite_Destination_updateAnimation = Sprite_Destination.prototype.updateAnimation;
    Sprite_Destination.prototype.updateAnimation = function() {
        _Sprite_Destination_updateAnimation.apply(this, arguments);
        this.opacity *= (param.opacity / 255);
    };
})();

