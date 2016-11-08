//=============================================================================
// ParallaxTitle.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/11/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc PanoramaTitlePlugin
 * @author triacontane
 *
 * @param ParallaxSettingMapId
 * @desc 指定したIDのマップの「マップ設定」の「遠景」設定をタイトル画面に適用します。
 * @default 0
 *
 * @param ViewForeground
 * @desc もともとのタイトル画面より上に表示します。霧のような演出に使えます。
 * @default OFF
 *
 * @help タイトル画面に追加で遠景を指定できます。
 * 遠景はマップ画面と同様に縦横にループし、自動スクロールできます。
 * また、近景として表示する機能もあります。
 * 指定する場合は必要に応じて、通常のタイトル画像を指定しないか
 * あるいは透過色を付けてください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 遠景タイトルプラグイン
 * @author トリアコンタン
 *
 * @param 遠景設定マップID
 * @desc 指定したIDのマップの「マップ設定」の「遠景」設定をタイトル画面に適用します。
 * @default 0
 *
 * @param 近景表示
 * @desc もともとのタイトル画面より上に表示します。霧のような演出に使えます。
 * @default OFF
 *
 * @help タイトル画面に追加で遠景を指定できます。
 * 遠景はマップ画面と同様に縦横にループし、自動スクロールできます。
 * また、近景として表示する機能もあります。
 * 指定する場合は必要に応じて、通常のタイトル画像を指定しないか
 * あるいは透過色を付けてください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

var $dataTitleMap = null;

(function() {
    'use strict';
    var pluginName = 'ParallaxTitle';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramParallaxSettingMapId = getParamNumber(['ParallaxSettingMapId', '遠景設定マップID'], 0);
    var paramViewForeground       = getParamBoolean(['ViewForeground', '近景表示']);

    //=============================================================================
    // Scene_Boot
    //  遠景設定マップをロードしてグローバル変数に保持します。
    //=============================================================================
    var _Scene_Boot_create      = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _Scene_Boot_create.apply(this, arguments);
        DataManager.loadMapData(paramParallaxSettingMapId);
    };

    var _Scene_Boot_isReady      = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        if (!this._parallaxMapLoaded && DataManager.isMapLoaded()) {
            this.onParallaxMapLoaded();
            this._parallaxMapLoaded = true;
        }
        return this._parallaxMapLoaded && _Scene_Boot_isReady.apply(this, arguments);
    };

    Scene_Boot.prototype.onParallaxMapLoaded = function() {
        $dataTitleMap = $dataMap;
    };

    //=============================================================================
    // Scene_Title
    //  タイトル画面に遠景表示を追加します。
    //=============================================================================
    var _Scene_Title_createBackground      = Scene_Title.prototype.createBackground;
    Scene_Title.prototype.createBackground = function() {
        if (!paramViewForeground) {
            this.createParallax();
        }
        _Scene_Title_createBackground.apply(this, arguments);
    };

    var _Scene_Title_createForeground = Scene_Title.prototype.createForeground;
    Scene_Title.prototype.createForeground = function() {
        if (paramViewForeground) {
            this.createParallax();
        }
        _Scene_Title_createForeground.apply(this, arguments);
    };

    Scene_Title.prototype.createParallax = function() {
        this.setupParallax();
        this._parallax = new TilingSprite();
        this._parallax.move(0, 0, Graphics.width, Graphics.height);
        this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
        this.addChild(this._parallax);
    };

    Scene_Title.prototype.setupParallax = function() {
        var data            = $dataTitleMap;
        this._parallaxName  = data.parallaxName || '';
        this._parallaxZero  = ImageManager.isZeroParallax(this._parallaxName);
        this._parallaxLoopX = data.parallaxLoopX;
        this._parallaxLoopY = data.parallaxLoopY;
        this._parallaxSx    = data.parallaxSx;
        this._parallaxSy    = data.parallaxSy;
        this._parallaxX     = 0;
        this._parallaxY     = 0;
    };

    var _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.apply(this, arguments);
        this.updateParallax();
    };

    Scene_Title.prototype.updateParallax = function() {
        if (this._parallaxLoopX) {
            this._parallaxX += this._parallaxSx / this.getHalfTileWidth();
        }
        if (this._parallaxLoopY) {
            this._parallaxY += this._parallaxSy / this.getHalfTileWidth();
        }
        if (this._parallax.bitmap) {
            this._parallax.origin.x = this.parallaxOx();
            this._parallax.origin.y = this.parallaxOy();
        }
    };

    Scene_Title.prototype.getTileWidth = function() {
        return Game_Map.prototype.tileWidth.call(null);
    };

    Scene_Title.prototype.getHalfTileWidth = function() {
        return this.getTileWidth() / 2;
    };

    Scene_Title.prototype.parallaxOx = function() {
        if (this._parallaxZero) {
            return this._parallaxX * this.getTileWidth();
        } else if (this._parallaxLoopX) {
            return this._parallaxX * this.getHalfTileWidth();
        } else {
            return 0;
        }
    };

    Scene_Title.prototype.parallaxOy = function() {
        if (this._parallaxZero) {
            return this._parallaxY * this.getTileWidth();
        } else if (this._parallaxLoopY) {
            return this._parallaxY * this.getHalfTileWidth();
        } else {
            return 0;
        }
    };
})();

