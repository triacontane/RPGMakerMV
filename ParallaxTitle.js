//=============================================================================
// ParallaxTitle.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2021/07/07 MZで動作するよう修正
// 1.2.0 2018/10/14 TemplateEvent.jsとの競合を解消
// 1.1.0 2016/11/23 遠景のスクロール速度がマップとずれていた問題を修正
//                  ニューゲーム時にスクロール位置を引き継ぐ設定を追加
//                  ニューゲーム選択時にフェードアウトしなくなる設定を追加
// 1.0.0 2016/11/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 遠景タイトルプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallaxTitle.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param ParallaxSettingMapId
 * @text 遠景設定マップID
 * @desc 指定したIDのマップの「マップ設定」の「遠景」設定をタイトル画面に適用します。
 * @default 0
 * @type number
 *
 * @param ViewForeground
 * @text 近景表示
 * @desc もともとのタイトル画面より上に表示します。霧のような演出に使えます。
 * @default false
 * @type boolean
 *
 * @param InheritScroll
 * @text スクロール引き継ぎ
 * @desc ニューゲーム時に遠景のスクロール状態を引き継ぎます。
 * @default false
 * @type boolean
 *
 * @param NoFadeout
 * @text フェードアウト無効
 * @desc ニューゲーム選択時にオーディオや画面がフェードアウトせず、シームレスにマップ画面に移行します。
 * @default false
 * @type boolean
 *
 * @help ParallaxTitle.js
 *
 * タイトル画面に追加で遠景を指定できます。
 * 遠景はマップ画面と同様に縦横にループし、自動スクロールできます。
 * 遠景はタイトル画像の背後に表示されるので、タイトル画像を指定していると
 * 隠れる場合があります。
 * また、近景として表示する機能もあります。
 *
 * 画面やオーディオをフェードアウトせずシームレスにマップに移行する機能も
 * ありますが、シーン遷移にともなう一瞬の硬直は避けられないのでご注意ください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

let $dataTitleMap = null;

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // ローカル変数
    //=============================================================================
    let localParallaxX = 0;
    let localParallaxY = 0;

    //=============================================================================
    // Game_Map
    //  タイトル遠景のスクロール状態を引き継ぎます。
    //=============================================================================
    const _Game_Map_setDisplayPos      = Game_Map.prototype.setDisplayPos;
    Game_Map.prototype.setDisplayPos = function(x, y) {
        _Game_Map_setDisplayPos.apply(this, arguments);
        this.inheritParallaxOrigin();
    };

    Game_Map.prototype.inheritParallaxOrigin = function() {
        if (!param.InheritScroll) return;
        if (localParallaxX) {
            this._parallaxX += localParallaxX;
            localParallaxX  = 0;
        }
        if (localParallaxY) {
            this._parallaxY += localParallaxY;
            localParallaxY  = 0;
        }
    };

    //=============================================================================
    // Scene_Boot
    //  遠景設定マップをロードしてグローバル変数に保持します。
    //=============================================================================
    const _Scene_Boot_create      = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _Scene_Boot_create.apply(this, arguments);
        this._parallaxMapGenerator = this.parallaxMapLoadGenerator();
        $dataMap = {};
    };

    const _Scene_Boot_isReady      = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        const isReady = _Scene_Boot_isReady.apply(this, arguments);
        return this._parallaxMapGenerator.next().done && isReady;
    };

    Scene_Boot.prototype.parallaxMapLoadGenerator = function*() {
        while (!DataManager.isMapLoaded()) {
            yield false;
        }
        DataManager.loadMapData(param.ParallaxSettingMapId);
        while (!DataManager.isMapLoaded()) {
            yield false;
        }
        $dataTitleMap = $dataMap;
        $dataMap = {};
        return true;
    };

    //=============================================================================
    // Scene_Title
    //  タイトル画面に遠景表示を追加します。
    //=============================================================================
    const _Scene_Title_createBackground      = Scene_Title.prototype.createBackground;
    Scene_Title.prototype.createBackground = function() {
        if (!param.ViewForeground) {
            this.createParallax();
        }
        _Scene_Title_createBackground.apply(this, arguments);
    };

    const _Scene_Title_createForeground      = Scene_Title.prototype.createForeground;
    Scene_Title.prototype.createForeground = function() {
        if (param.ViewForeground) {
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
        const data            = $dataTitleMap;
        this._parallaxName  = data.parallaxName || '';
        this._parallaxZero  = ImageManager.isZeroParallax(this._parallaxName);
        this._parallaxLoopX = data.parallaxLoopX;
        this._parallaxLoopY = data.parallaxLoopY;
        this._parallaxSx    = data.parallaxSx;
        this._parallaxSy    = data.parallaxSy;
        this._parallaxX     = 0;
        this._parallaxY     = 0;
    };

    const _Scene_Title_update      = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.apply(this, arguments);
        this.updateParallax();
    };

    Scene_Title.prototype.updateParallax = function() {
        if (this._parallaxLoopX) {
            this._parallaxX += this._parallaxSx / (this.getTileWidth() * 2);
        }
        if (this._parallaxLoopY) {
            this._parallaxY += this._parallaxSy / (this.getTileWidth() * 2);
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

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        if (SceneManager.isPreviousScene(Scene_Title) && param.NoFadeout) {
            this._transfer = false;
        }
        _Scene_Map_start.apply(this, arguments);
    };

    const _Scene_Title_commandNewGame      = Scene_Title.prototype.commandNewGame;
    Scene_Title.prototype.commandNewGame = function() {
        if (param.NoFadeout) {
            this._noFadeout = true;
        }
        _Scene_Title_commandNewGame.apply(this, arguments);
        this.keepParallaxOrigin();
    };

    const _Scene_Title_commandNewGameSecond      = Scene_Title.prototype.commandNewGameSecond;
    Scene_Title.prototype.commandNewGameSecond = function() {
        if (_Scene_Title_commandNewGameSecond) _Scene_Title_commandNewGameSecond.apply(this, arguments);
        this.keepParallaxOrigin();
    };

    Scene_Title.prototype.keepParallaxOrigin = function() {
        if (param.InheritScroll) {
            localParallaxX = this._parallaxX;
            localParallaxY = this._parallaxY;
        }
    };

    Scene_Title.prototype.fadeOutAll = function() {
        if (!this._noFadeout) {
            Scene_Base.prototype.fadeOutAll.apply(this, arguments);
        }
    };
})();

