//=============================================================================
// ParallaxTitle.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.5.0 2025/02/25 本体v1.9.0のマップのダイアログ指定機能に対応
// 1.4.0 2024/02/12 近景と遠景を両方表示できるよう修正
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
 * @type map
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
 * 近景を表示したい場合、ローンチプラグインForeground.jsと同等のメモタグを
 * マップ設定に記述してください。(以下Foreground.jsより転記)
 *
 *  <fgName:ファイル名> 前景として使うファイル名です（拡張子なし）
 *    名前が '!'で始まる場合、遠景同様視差ゼロとなります。
 *    ファイルは img/parallaxes に置いてください
 *  <fgLoopX:数字> X座標にループするかどうか  (0:no 1:yes)。
 *    省略時は0(=no)になります。
 *  <fgLoopY:number> Y座標にループするかどうか  (0:no 1:yes)。
 *    省略時は0(=no)になります。
 *  <fgSx:数字>    X座標のスクロール速度です
 *    X座標にループしない場合は無視されます。
 *    省略時は0になります。
 *  <fgSy:数字>    Y座標のスクロール速度です
 *    Y座標にループしない場合は無視されます。
 *    省略時は0になります。
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
        this.createParallax();
        _Scene_Title_createBackground.apply(this, arguments);
    };

    const _Scene_Title_createForeground      = Scene_Title.prototype.createForeground;
    Scene_Title.prototype.createForeground = function() {
        this.createForegroundParallax();
        _Scene_Title_createForeground.apply(this, arguments);
    };

    Scene_Title.prototype.createParallax = function() {
        this._parallax = this.setupParallax($dataTitleMap);
    };

    Scene_Title.prototype.createForegroundParallax = function() {
        const data = {
            parallaxName: $dataTitleMap.meta.fgName,
            parallaxLoopX: $dataTitleMap.meta.fgLoopX,
            parallaxLoopY: $dataTitleMap.meta.fgLoopY,
            parallaxSx: $dataTitleMap.meta.fgSx,
            parallaxSy: $dataTitleMap.meta.fgSy
        };
        this._foreground = this.setupParallax(data);
    };

    Scene_Title.prototype.setupParallax = function(data) {
        const name = data.parallaxName || '';
        const sprite = new TilingSprite();
        sprite.move(0, 0, Graphics.width, Graphics.height);
        sprite.bitmap = ImageManager.loadParallax(name);
        this.addChild(sprite);
        return {
            name: name,
            zero: ImageManager.isZeroParallax(name),
            loopX: data.parallaxLoopX,
            loopY: data.parallaxLoopY,
            sx: data.parallaxSx,
            sy: data.parallaxSy,
            x: 0,
            y: 0,
            sprite: sprite
        };
    };

    const _Scene_Title_update      = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.apply(this, arguments);
        this.updateParallax(this._parallax);
        this.updateParallax(this._foreground);
    };

    Scene_Title.prototype.updateParallax = function(parallax) {
        if (parallax.loopX) {
            parallax.x += parallax.sx / (this.getTileWidth() * 2);
        }
        if (parallax.loopY) {
            parallax.y += parallax.sy / (this.getTileWidth() * 2);
        }
        const sprite = parallax.sprite;
        if (sprite.bitmap) {
            sprite.origin.x = this.parallaxOx(parallax);
            sprite.origin.y = this.parallaxOy(parallax);
        }
    };

    Scene_Title.prototype.getTileWidth = function() {
        return Game_Map.prototype.tileWidth.call(null);
    };

    Scene_Title.prototype.getHalfTileWidth = function() {
        return this.getTileWidth() / 2;
    };

    Scene_Title.prototype.parallaxOx = function(parallax) {
        if (parallax.zero) {
            return parallax.x * this.getTileWidth();
        } else if (parallax.loopX) {
            return parallax.x * this.getHalfTileWidth();
        } else {
            return 0;
        }
    };

    Scene_Title.prototype.parallaxOy = function(parallax) {
        if (parallax.zero) {
            return parallax.y * this.getTileWidth();
        } else if (parallax.loopY) {
            return parallax.y * this.getHalfTileWidth();
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
            localParallaxX = this._parallax.x;
            localParallaxY = this._parallax.y;
        }
    };

    Scene_Title.prototype.fadeOutAll = function() {
        if (!this._noFadeout) {
            Scene_Base.prototype.fadeOutAll.apply(this, arguments);
        }
    };
})();

