//=============================================================================
// ParallaxLayerMap.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2017/11/19 MOG_ChronoEngine.js等との競合を解消
// 1.1.0 2017/09/20 ヘルプにサンプルマップの旨を記載
// 1.1.0 2017/09/14 合成方法や不透明度の初期値を設定できるメモ欄を追加
// 1.0.0 2017/08/20 初版
// 0.9.0 2017/08/19 プロトタイプ版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ParallaxLayerMapPlugin
 * @author triacontane
 *
 * @help ParallaxLayerMap.js
 *
 * 複数のレイヤーを使った多層一枚絵マップを作成可能にします。
 * イベントでレイヤーを作成するので、レイヤー数は無制限です。
 *
 * イベントを作成してメモ欄を以下の通り記述すると、指定した画像がマップに表示され、
 * かつイベント位置とは無関係に画像の左上がマップの左上に合わせられます。
 *
 * <PLM:file>        # 「img/parallaxes/file」を一枚絵として表示します。
 * <PLM_Blend:1>     # 合成方法の初期値を「加算」にします。
 * <PLM合成:1>       # 同上
 * <PLM_Opacity:128> # 不透明度の初期値を「128」にします。
 * <PLM不透明度:128> # 同上
 *
 * イベント内の「画像」「オプション」項目は無視されますが、その他の項目は
 * 通常のイベントと同じように機能します。
 *
 * 合成方法や不透明度などを後から変更したい場合は、自律移動で指定するか
 * 以下の「キャラクターグラフィック表示拡張プラグイン」と併用してください。
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CharacterGraphicExtend.js
 *
 * スクリプト（「移動ルートの設定」から実行）
 * this.shiftPosition(10, 20); # 表示位置をX[10] Y[20]ずらします。
 *
 * 注意！
 * 当プラグインはマップのループには対応していません。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 当プラグインで使用できるサンプルマップをどらぴか様よりご提供いただきました。
 * この場を借りて御礼申し上げます。
 *
 * 以下のURLから「Download」ボタンでダウンロードできます。
 * クレジット表記なしでご自由にお使い頂けるご許可を頂いています。
 * https://github.com/triacontane/RPGMakerMV/blob/master/Sample/sample_parallax.zip
 *
 * PIKA's GAME GALLERY
 * https://mashimarohb252d6.wixsite.com/pikasgame
 *
 * @noteParam PLM
 * @noteRequire 1
 * @noteDir img/parallaxes
 * @noteType file
 * @noteData events
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 多層レイヤー一枚絵マッププラグイン
 * @author トリアコンタン
 *
 * @help ParallaxLayerMap.js
 *
 * 複数のレイヤーを使った多層一枚絵マップを作成可能にします。
 * イベントでレイヤーを作成するので、レイヤー数は無制限です。
 *
 * イベントを作成してメモ欄を以下の通り記述すると、指定した画像がマップに表示され、
 * かつイベント位置とは無関係に画像の左上がマップの左上に合わせられます。
 *
 * <PLM:file>        # 「img/parallaxes/file」を一枚絵として表示します。
 * <PLM_Blend:1>     # 合成方法の初期値を「加算」にします。
 * <PLM合成:1>       # 同上
 * <PLM_Opacity:128> # 不透明度の初期値を「128」にします。
 * <PLM不透明度:128> # 同上
 *
 * イベント内の「画像」「オプション」項目は無視されますが、その他の項目は
 * 通常のイベントと同じように機能します。
 *
 * 合成方法や不透明度などを後から変更したい場合は、自律移動で指定するか
 * 以下の「キャラクターグラフィック表示拡張プラグイン」と併用してください。
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CharacterGraphicExtend.js
 *
 * スクリプト（「移動ルートの設定」から実行）
 * this.shiftPosition(10, 20); # 表示位置をX[10] Y[20]ずらします。
 *
 * 注意！
 * 当プラグインはマップのループには対応していません。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 当プラグインで使用できるサンプルマップをどらぴか様よりご提供いただきました。
 * この場を借りて御礼申し上げます。
 *
 * 以下のURLから「Download」ボタンでダウンロードできます。
 * クレジット表記なしでご自由にお使い頂けるご許可を頂いています。
 * https://github.com/triacontane/RPGMakerMV/blob/master/Sample/sample_parallax.zip
 *
 * PIKA's GAME GALLERY
 * https://mashimarohb252d6.wixsite.com/pikasgame
 *
 * @noteParam PLM
 * @noteRequire 1
 * @noteDir img/parallaxes
 * @noteType file
 * @noteData events
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var metaTagPrefix = 'PLM';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        if (!object || !object.meta) {
            return undefined;
        }
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
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
    // Game_Map
    //  画面上のピクセル座標を返します。
    //=============================================================================
    Game_Map.prototype.displayPixelX = function() {
        return this.displayX() * this.tileWidth();
    };

    Game_Map.prototype.displayPixelY = function() {
        return this.displayY() * this.tileHeight();
    };

    //=============================================================================
    // Game_Character
    //  マップレイヤー名を取得します。
    //=============================================================================
    Game_CharacterBase.prototype.getMapLayerName = function() {
        return this._mapLayerName;
    };

    Game_CharacterBase.prototype.isMapLayer = function() {
        return !!this._mapLayerName;
    };

    var _Game_CharacterBase_isNearTheScreen = Game_CharacterBase.prototype.isNearTheScreen;
    Game_CharacterBase.prototype.isNearTheScreen = function() {
        return this.isMapLayer() || _Game_CharacterBase_isNearTheScreen.apply(this, arguments);
    };

    Game_CharacterBase.prototype.shiftPosition = function(x, y) {
        this._additionalX = x;
        this._additionalY = y;
    };

    Game_CharacterBase.prototype.existPage = function() {
        return false;
    };

    //=============================================================================
    // Game_Event
    //  レイヤーイベントに関する機能を実装します。
    //=============================================================================
    var _Game_Event_initialize      = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        this._mapLayerName = getMetaValue(this.getOriginalEvent(), '') || null;
        if (this._mapLayerName) {
            this.initBlendMode();
            this.initOpacity();
        }
    };

    Game_Event.prototype.initBlendMode = function() {
        var blendMode = getMetaValues(this.getOriginalEvent(), ['_Blend', '合成']);
        if (blendMode) {
            this._blendMode = parseInt(blendMode);
        }
    };

    Game_Event.prototype.initOpacity = function() {
        var blendMode = getMetaValues(this.getOriginalEvent(), ['_Opacity', '不透明度']);
        if (blendMode) {
            this._opacity = parseInt(blendMode);
        }
    };

    // Resolve conflict for TemplateEvent
    Game_Event.prototype.getOriginalEvent = function() {
        return $dataMap.events[this._eventId];
    };

    Game_Event.prototype.existPage = function() {
        return this._pageIndex >= 0;
    };

    Game_Event.prototype.getLayerX = function() {
        return (this._additionalX || 0) - $gameMap.displayPixelX();
    };

    Game_Event.prototype.getLayerY = function() {
        return (this._additionalY || 0) - $gameMap.displayPixelY();
    };

    //=============================================================================
    // Spriteset_Map
    //  キャラクタースプライトをマップレイヤースプライトに差し替えます。
    //=============================================================================
    var _Spriteset_Map_createCharacters      = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        _Spriteset_Map_createCharacters.apply(this, arguments);
        var layerSprites = this._characterSprites.filter(function(sprite) {
            return sprite.isLayer && sprite.isLayer();
        });
        layerSprites.forEach(function(oldSprite) {
            this.replaceLayerSprite(oldSprite);
        }, this);
    };

    Spriteset_Map.prototype.replaceLayerSprite = function(oldSprite) {
        var deleteIndex = this._characterSprites.indexOf(oldSprite);
        if (deleteIndex >= 0) {
            this._characterSprites.splice(deleteIndex, 1);
        }
        this._tilemap.removeChild(oldSprite);
        var newSprite = new Sprite_MapLayer(oldSprite.getCharacter());
        this._tilemap.addChild(newSprite);
    };

    //=============================================================================
    // Sprite_Character
    //  マップレイヤー判定を追加します。
    //=============================================================================
    var _Sprite_Character_character         = Sprite_Character.prototype.setCharacter;
    Sprite_Character.prototype.setCharacter = function(character) {
        _Sprite_Character_character.apply(this, arguments);
        this._layerName = character.getMapLayerName();
    };

    Sprite_Character.prototype.getCharacter = function() {
        return this._character;
    };

    Sprite_Character.prototype.isLayer = function() {
        return !!this._layerName;
    };

    //=============================================================================
    // Sprite_MapLayer
    //  マップレイヤーを扱うクラスです。
    //=============================================================================
    function Sprite_MapLayer() {
        this.initialize.apply(this, arguments);
    }

    Sprite_MapLayer.prototype             = Object.create(Sprite_Character.prototype);
    Sprite_MapLayer.prototype.constructor = Sprite_MapLayer;

    Sprite_MapLayer.prototype.setCharacter = function(character) {
        Sprite_Character.prototype.setCharacter.apply(this, arguments);
        this.loadLayerBitmap();
    };

    Sprite_MapLayer.prototype.initMembers = function() {
        Sprite_Character.prototype.initMembers.apply(this, arguments);
        this.anchor.x = 0;
        this.anchor.y = 0;
    };

    Sprite_MapLayer.prototype.loadLayerBitmap = function() {
        this.bitmap = ImageManager.loadParallax(this._layerName, 0);
    };

    Sprite_MapLayer.prototype.updateVisibility = function() {
        Sprite_Character.prototype.updateVisibility.apply(this, arguments);
        if (!this._character.existPage()) {
            this.visible = false;
        }
    };

    Sprite_MapLayer.prototype.updatePosition = function() {
        this.x = this._character.getLayerX();
        this.y = this._character.getLayerY();
        this.z = this._character.screenZ();
    };

    Sprite_MapLayer.prototype.updateBitmap = function() {
        // do nothing
    };

    Sprite_MapLayer.prototype.updateFrame = function() {
        // do nothing
    };
})();

