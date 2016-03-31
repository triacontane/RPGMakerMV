//=============================================================================
// FloatingCharacter.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2016/03/31 隊列歩行でない場合のフォロワーや画像が指定されていないイベントでも影が表示される不具合を修正
// 1.0.1 2016/03/31 浮遊中に強制的に待機アニメが設定される仕様を撤廃
// 1.0.0 2016/03/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc キャラクターの浮遊プラグイン
 * @author トリアコンタン
 *
 * @param 通行可能地形タグ
 * @desc 浮遊時に通行可能になる地形タグです。カンマ区切りで指定
 * 例：1,2,3
 * @default
 *
 * @param 通行可能リージョン
 * @desc 浮遊時に通行可能になるリージョンです。カンマ区切りで指定
 * 例：1,2,3
 * @default
 *
 * @help キャラクターを浮遊させます。
 * 浮遊中は以下の効果があります。
 *
 * 指定した地形タグ(複数)を通行可能にします。
 * 指定したリージョン(複数)を通行可能にします。
 * タイルの梯子属性、茂み属性、ダメージ床属性を無効にします。
 *
 * スクリプト
 * 「移動ルートの指定」の「スクリプト」から以下を実行します。
 *
 * this.float([ウェイトフラグ], [高度(省略時はタイルサイズの半分)]);
 *  キャラクターを[高度]のピクセル分、浮遊させます。
 *  [ウェイトフラグ]に[true]を設定すると、浮遊中は次の命令に移行しません。
 *  例：this.float(true, 48);
 *
 * this.landing([ウェイトフラグ]);
 *  キャラクターを着地させます。
 *  [ウェイトフラグ]に[true]を設定すると、浮遊中は次の命令に移行しません。
 *  例：this.landing(true);
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'FloatingCharacter';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamArrayString = function (paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getParamArrayNumber = function (paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var paramTerrainTags = getParamArrayNumber(['通行可能地形タグ', 'TerrainTags']);
    var paramRegionId    = getParamArrayNumber(['通行可能リージョン', 'RegionId']);

    //=============================================================================
    // Game_CharacterBase
    //  キャラクターの浮遊関連情報を追加定義します。
    //=============================================================================
    var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.apply(this, arguments);
        this._altitude           = 0;
        this._altitudeAnimeCount = 0;
        this._maxAltitude        = 0;
        this._needFloat          = false;
    };
    Game_CharacterBase.prototype.isLowest      = Game_Vehicle.prototype.isLowest;
    Game_CharacterBase.prototype.isHighest     = Game_Vehicle.prototype.isHighest;
    Game_CharacterBase.prototype.shadowOpacity = Game_Vehicle.prototype.shadowOpacity;

    var _Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable;
    Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
        if (this.isNeedFloat()) {
            var x2 = $gameMap.roundXWithDirection(x, d);
            var y2 = $gameMap.roundYWithDirection(y, d);
            if (paramRegionId.some(function(id) {
                return id === $gameMap.regionId(x2, y2);
            }.bind(this))) return true;
            if (paramTerrainTags.some(function(id) {
                return id === $gameMap.terrainTag(x2, y2);
            }.bind(this))) return true;
        }
        return _Game_CharacterBase_isMapPassable.apply(this, arguments);
    };

    var _Game_CharacterBase_screenY = Game_CharacterBase.prototype.screenY;
    Game_CharacterBase.prototype.screenY = function() {
        return _Game_CharacterBase_screenY.apply(this, arguments) +
            (this.isFloating() ? Math.floor(Math.sin(this._altitudeAnimeCount / 16) * 3) - this._altitude : 0);
    };

    Game_CharacterBase.prototype.screenShadowY = function() {
        return _Game_CharacterBase_screenY.apply(this, arguments) - this.screenY();
    };

    var _Game_CharacterBase_isOnLadder = Game_CharacterBase.prototype.isOnLadder;
    Game_CharacterBase.prototype.isOnLadder = function() {
        return this.isFloating() ? false : _Game_CharacterBase_isOnLadder.apply(this, arguments);
    };

    var _Game_CharacterBase_isOnBush = Game_CharacterBase.prototype.isOnBush;
    Game_CharacterBase.prototype.isOnBush = function() {
        return this.isFloating() ? false : _Game_CharacterBase_isOnBush.apply(this, arguments);
    };

    var _Game_Player_isOnDamageFloor = Game_Player.prototype.isOnDamageFloor;
    Game_Player.prototype.isOnDamageFloor = function() {
        return this.isFloating() ? false : _Game_Player_isOnDamageFloor.apply(this, arguments);
    };

    Game_CharacterBase.prototype.maxAltitude = function() {
        return this._maxAltitude;
    };

    Game_CharacterBase.prototype.isFloating = function() {
        return this._altitude > 0;
    };

    Game_CharacterBase.prototype.isShadowVisible = function() {
        return this.isFloating() && (this._characterName || this._tileId);
    };

    Game_CharacterBase.prototype.isNeedFloat = function() {
        return this._needFloat;
    };

    Game_CharacterBase.prototype.float = function(waitFlg, max) {
        if (!max) max = $gameMap.tileHeight() / 2;
        this._needFloat   = true;
        this._maxAltitude = max;
        if (waitFlg) this._waitCount = Math.max(this.maxAltitude() - this._altitude, 0);
    };

    Game_Player.prototype.float = function(max) {
        Game_CharacterBase.prototype.float.apply(this, arguments);
        this.followers().forEach(function(follower) {
            follower.float(max);
            follower._altitude = -follower._memberIndex * 4;
        }.bind(this));
    };

    Game_CharacterBase.prototype.landing = function(waitFlg) {
        this._needFloat = false;
        if (waitFlg) this._waitCount = this.maxAltitude();
    };

    Game_Player.prototype.landing = function() {
        Game_CharacterBase.prototype.landing.apply(this, arguments);
        this.followers().forEach(function(follower) {
            follower.landing();
        }.bind(this));
    };

    var _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        _Game_CharacterBase_update.apply(this, arguments);
        this.updateFloating();
    };

    Game_CharacterBase.prototype.updateFloating = function() {
        this._floatingPrev = this.isFloating();
        if (this.isNeedFloat()) {
            if (this.isHighest()) {
                this._altitudeAnimeCount++;
            }
            this._altitude = Math.min(this._altitude + 1, this.maxAltitude());
        } else {
            if (this.isHighest()) {
                this._altitudeAnimeCount = 0;
            }
            this._altitude = Math.max(this._altitude - 1, 0);
        }
        if (this._floatingPrev != this.isFloating()) {
            this.refreshBushDepth();
        }
    };

    Game_Vehicle.prototype.updateFloating = function() {};
    Game_Vehicle.prototype.isFloating = function() {
        return false;
    };

    //=============================================================================
    // Game_CharacterBase
    //  キャラクターの浮遊関連情報を追加定義します。
    //=============================================================================
    var _Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
    Sprite_Character.prototype.initMembers = function() {
        _Sprite_Character_initMembers.apply(this, arguments);
        this._shadowSprite = null;
    };

    var _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.apply(this, arguments);
        this.updateFloating();
    };

    Sprite_Character.prototype.updateFloating = function() {
        if (this._character.isShadowVisible()) {
            if (!this._shadowSprite) this.createShadow();
            this._shadowSprite.y = this._character.screenShadowY();
            this._shadowSprite.opacity = this._character.shadowOpacity();
        } else {
            if (this._shadowSprite) this.disposeShadow();
        }
    };

    Sprite_Character.prototype.createShadow = function() {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow1');
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 1;
        this.addChild(this._shadowSprite);
    };

    Sprite_Character.prototype.disposeShadow = function() {
        this.removeChild(this._shadowSprite);
        this._shadowSprite = null;
    };
})();

