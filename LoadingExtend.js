//=============================================================================
// LoadingExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/06/04 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc LoadingExtendPlugin
 * @author triacontane
 *
 * @param ImageColumn
 * @desc system/Loading.pngをスプライトシート化する場合の横方向のセル数です。
 * @default 1
 *
 * @param ImageRow
 * @desc system/Loading.pngをスプライトシート化する場合の縦方向のセル数です。
 * @default 1
 *
 * @param ShowingType
 * @desc ローディング画像の表示タイプです。(0通常、1:ランダム、2:アニメーション)
 * @default 0
 *
 * @param AnimationInterval
 * @desc 表示タイプが「アニメーション」の場合は表示間隔です。
 * @default 30
 *
 * @param XPosition
 * @desc ローディング画像の表示位置X座標です。中心位置を指定します。制御文字が使えます。
 * @default
 *
 * @param YPosition
 * @desc ローディング画像の表示位置Y座標です。中心位置を指定します。制御文字が使えます。
 * @default
 *
 * @param WaitingFrames
 * @desc ロード開始から画像表示までの待機フレーム数です。
 * @default 20
 *
 * @param NoFlashing
 * @desc ローディング画像が点滅しなくなります。
 * @default OFF
 *
 * @help ロード中画像「Now Loading」の表示方法を以下の通り拡張します。
 *
 * ・表示方法拡張（Loading.pngを縦横に分割して表示(スプライトシート形式)します）
 * ランダム表示　　　：複数の画像からランダムで選択して表示します。
 * アニメーション表示：画像を順番にアニメーション表示します。
 *
 * ・表示位置調整
 * 表示座標（中心点を指定）を調整することができます。
 *
 * ・その他
 * 画像の点滅を無効化したりロード中画像が表示されるまでのフレーム数を
 * 指定したりできます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ロード中画像拡張プラグイン
 * @author トリアコンタン
 *
 * @param イメージ列数
 * @desc system/Loading.pngをスプライトシート化する場合の横方向のセル数です。
 * @default 1
 *
 * @param イメージ行数
 * @desc system/Loading.pngをスプライトシート化する場合の縦方向のセル数です。
 * @default 1
 *
 * @param 表示タイプ
 * @desc ローディング画像の表示タイプです。(0通常、1:ランダム、2:アニメーション)
 * @default 0
 *
 * @param アニメーション間隔
 * @desc 表示タイプが「アニメーション」の場合は表示間隔です。
 * @default 30
 *
 * @param 表示位置X座標
 * @desc ローディング画像の表示位置X座標です。中心位置を指定します。制御文字が使えます。
 * @default
 *
 * @param 表示位置Y座標
 * @desc ローディング画像の表示位置Y座標です。中心位置を指定します。制御文字が使えます。
 * @default
 *
 * @param 待機フレーム数
 * @desc ロード開始から画像表示までの待機フレーム数です。
 * @default 20
 *
 * @param 点滅なし
 * @desc ローディング画像が点滅しなくなります。
 * @default OFF
 *
 * @help ロード中画像「Now Loading」の表示方法を以下の通り拡張します。
 *
 * ・表示方法拡張（Loading.pngを縦横に分割して表示(スプライトシート形式)します）
 * ランダム表示　　　：複数の画像からランダムで選択して表示します。
 * アニメーション表示：画像を順番にアニメーション表示します。
 *
 * ・表示位置調整
 * 表示座標（中心点を指定）を調整することができます。
 *
 * ・その他
 * 画像の点滅を無効化したりロード中画像が表示されるまでのフレーム数を
 * 指定したりできます。
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
    var pluginName = 'LoadingExtend';

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

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON';
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg)) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param               = {};
    param.imageColumn       = getParamNumber(['ImageColumn', 'イメージ列数'], 1);
    param.imageRow          = getParamNumber(['ImageRow', 'イメージ行数'], 1);
    param.showingType       = getParamNumber(['ShowingType', '表示タイプ'], 0);
    param.animationInterval = getParamNumber(['AnimationInterval', 'アニメーション間隔'], 0);
    param.xPosition         = getParamString(['XPosition', '表示位置X座標']);
    param.yPosition         = getParamString(['YPosition', '表示位置Y座標']);
    param.waitingFrames     = getParamNumber(['WaitingFrames', '待機フレーム数'], 1) || 20;
    param.noFlashing        = getParamBoolean(['NoFlashing', '点滅なし']);

    //=============================================================================
    // Graphics
    //  ロードディング画像の表示仕様を拡張します。
    //=============================================================================
    var _Graphics_initialize = Graphics.initialize;
    Graphics.initialize      = function(width, height, type) {
        _Graphics_initialize.apply(this, arguments);
        this._loadingPattern = 0;
    };

    var _Graphics_startLoading = Graphics.startLoading;
    Graphics.startLoading      = function() {
        _Graphics_startLoading.apply(this, arguments);
        if (param.showingType === 1) {
            this._loadingPattern = Math.randomInt(this._getLoadingImageAllCount());
        }
    };

    var _Graphics_updateLoading = Graphics.updateLoading;
    Graphics.updateLoading      = function() {
        _Graphics_updateLoading.apply(this, arguments);
        if (param.showingType === 2 && (this._loadingCount + 1) % param.animationInterval === 0) {
            this._loadingPattern = (this._loadingPattern + 1) % this._getLoadingImageAllCount();
        }
    };

    Graphics._getLoadingImageAllCount = function() {
        return param.imageColumn * param.imageRow;
    };

    Graphics._getLoadingImageWidth = function() {
        return this._loadingImage.width / param.imageColumn;
    };

    Graphics._getLoadingImageHeight = function() {
        return this._loadingImage.height / param.imageRow;
    };

    Graphics._getLoadingImageX = function() {
        return (this._loadingPattern % param.imageColumn) * this._getLoadingImageWidth();
    };

    Graphics._getLoadingImageY = function() {
        return Math.floor(this._loadingPattern / param.imageColumn) * this._getLoadingImageHeight();
    };

    Graphics._paintUpperCanvas = function() {
        this._clearUpperCanvas();
        if (this._loadingImage && this._loadingCount >= param.waitingFrames) {
            var context = this._upperCanvas.getContext('2d');
            var dw      = this._getLoadingImageWidth();
            var dh      = this._getLoadingImageHeight();
            var dx      = (param.xPosition !== '' ? getArgNumber(param.xPosition) : this._width / 2) - dw / 2;
            var dy      = (param.yPosition !== '' ? getArgNumber(param.yPosition) : this._height / 2) - dh / 2;
            context.save();
            if (!param.noFlashing) {
                context.globalAlpha = ((this._loadingCount - 20) / 30).clamp(0, 1);
            }
            var sx = this._getLoadingImageX();
            var sy = this._getLoadingImageY();
            context.drawImage(this._loadingImage, sx, sy, dw, dh, dx, dy, dw, dh);
            context.restore();
        }
    };
})();

