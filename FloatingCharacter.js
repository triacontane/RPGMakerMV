//=============================================================================
// FloatingCharacter.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.2 2016/07/31 パラメータ名の変換ミス修正(敷居値→閾値)
//                  隊列歩行時のフォロワーの高度がデフォルト値で固定になっていた問題の修正
// 1.1.1 2016/04/06 本プラグインを適用していないセーブデータをロードしたときも、正しく動作するよう修正
// 1.1.0 2016/04/03 一定以上の高度の場合のみ通行可能になる地形タグとリージョンを指定できる機能を追加
//                  着地可能な場合のみ着地する機能を追加、指定されたキャラクターが浮遊中かどうかの判定を追加
// 1.0.2 2016/03/31 隊列歩行でない場合のフォロワーや画像が指定されていないイベントでも影が表示される不具合を修正
// 1.0.1 2016/03/31 浮遊中に強制的に待機アニメが設定される仕様を撤廃
// 1.0.0 2016/03/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Floating character plugin
 * @author triacontane
 *
 * @param TerrainTags
 * @desc 浮遊時に通行可能になる地形タグです。カンマ区切りで指定
 * 例：1,2,3
 * @default
 *
 * @param RegionId
 * @desc 浮遊時に通行可能になるリージョンです。カンマ区切りで指定
 * 例：1,2,3
 * @default
 *
 * @param HighestTerrainTags
 * @desc 一定高度以上を浮遊時に通行可能になる地形タグです。
 * 例：1,2,3
 * @default
 *
 * @param HighestRegionId
 * @desc 一定高度以上を浮遊時に通行可能になるリージョンです。
 * 例：1,2,3
 * @default
 *
 * @param HighestThreshold
 * @desc 一定高度以上の条件となる敷居値です。
 * @default 48
 *
 * @help キャラクターを浮遊させます。
 * 浮遊中は以下の効果があります。
 *
 * 指定した地形タグ(複数)を通行可能にします。
 * 指定したリージョン(複数)を通行可能にします。
 * タイルの梯子属性、茂み属性、ダメージ床属性を無効にします。
 *
 * Script
 * 「移動ルートの指定」の「スクリプト」から以下を実行します。
 *
 * this.float([ウェイトフラグ], [高度(省略時はタイルサイズの半分)]);
 *  キャラクターを[高度]のピクセル分、浮遊させます。
 *  [ウェイトフラグ]に[true]を設定すると、浮遊完了まで次の命令に移行しません。
 *  例：this.float(true, 48);
 *
 * this.landing([ウェイトフラグ]);
 *  キャラクターを着地させます。
 *  [ウェイトフラグ]に[true]を設定すると、着地完了まで次の命令に移行しません。
 *  例：this.landing(true);
 *
 * this.landingIfOk([ウェイトフラグ]);
 *  着地可能な地形の場合、キャラクターを着地させます。
 *  着地可能かどうかは、飛行船が着地可能かどうかの条件と同一です。
 *  [ウェイトフラグ]に[true]を設定すると、着地完了まで次の命令に移行しません。
 *  例：this.landingIfOk(true);
 *
 * Script
 * 「条件分岐」の「スクリプト」から以下を実行します。
 *
 * this.isFloating([キャラクターID]);
 *  指定したキャラクターが浮遊中の場合に、分岐を実行します。
 *  キャラクターIDは以下の通り指定してください。
 *
 *  -1   : プレイヤー
 *  0    : 実行中のイベント
 *  1... : 指定したIDのイベント
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
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
 * @param 高度通行地形タグ
 * @desc 一定高度以上を浮遊時に通行可能になる地形タグです。
 * 例：1,2,3
 * @default
 *
 * @param 高度通行リージョン
 * @desc 一定高度以上を浮遊時に通行可能になるリージョンです。
 * 例：1,2,3
 * @default
 *
 * @param 高度閾値
 * @desc 一定高度以上の条件となる閾値です。
 * @default 48
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
 *  [ウェイトフラグ]に[true]を設定すると、浮遊完了まで次の命令に移行しません。
 *  例：this.float(true, 48);
 *
 * this.landing([ウェイトフラグ]);
 *  キャラクターを着地させます。
 *  [ウェイトフラグ]に[true]を設定すると、着地完了まで次の命令に移行しません。
 *  例：this.landing(true);
 *
 * this.landingIfOk([ウェイトフラグ]);
 *  着地可能な地形の場合、キャラクターを着地させます。
 *  着地可能かどうかは、飛行船が着地可能かどうかの条件と同一です。
 *  [ウェイトフラグ]に[true]を設定すると、着地完了まで次の命令に移行しません。
 *  例：this.landingIfOk(true);
 *
 * スクリプト
 * 「条件分岐」の「スクリプト」から以下を実行します。
 *
 * this.isFloating([キャラクターID]);
 *  指定したキャラクターが浮遊中の場合に、分岐を実行します。
 *  キャラクターIDは以下の通り指定してください。
 *
 *  -1   : プレイヤー
 *  0    : 実行中のイベント
 *  1... : 指定したIDのイベント
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

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
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
        for (var i = 0; i < values.length; i++) {
            if (!isNaN(parseInt(values[i], 10))) {
                values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
            } else {
                values.splice(i--, 1);
            }
        }
        return values;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramTerrainTags         = getParamArrayNumber(['通行可能地形タグ', 'TerrainTags']);
    var paramRegionId            = getParamArrayNumber(['通行可能リージョン', 'RegionId']);
    var paramHighestTerrainTags  = getParamArrayNumber(['高度通行地形タグ', 'HighestTerrainTags']);
    var paramHighestRegionId     = getParamArrayNumber(['高度通行リージョン', 'HighestRegionId']);
    var paramHighestThreshold    = getParamNumber(['高度閾値', 'HighestThreshold']);

    //=============================================================================
    // Game_Interpreter
    //  キャラクターの浮遊判定を追加定義します。
    //=============================================================================
    Game_Interpreter.prototype.isFloating = function(characterId) {
        var character = this.character(characterId);
        if (character !== null) {
            return character.isFloating();
        } else {
            return false;
        }
    };

    //=============================================================================
    // Game_CharacterBase
    //  キャラクターの浮遊関連情報を追加定義します。
    //=============================================================================
    var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.apply(this, arguments);
        this.initFloatingInfo();
    };
    Game_CharacterBase.prototype.isLowest      = Game_Vehicle.prototype.isLowest;
    Game_CharacterBase.prototype.isHighest     = Game_Vehicle.prototype.isHighest;
    Game_CharacterBase.prototype.shadowOpacity = Game_Vehicle.prototype.shadowOpacity;

    Game_CharacterBase.prototype.initFloatingInfo = function() {
        this._altitude           = 0;
        this._altitudeAnimeCount = 0;
        this._maxAltitude        = 0;
        this._needFloat          = false;
    };

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
            if (this._altitude >= paramHighestThreshold) {
                if (paramHighestRegionId.some(function(id) {
                        return id === $gameMap.regionId(x2, y2);
                    }.bind(this))) return true;
                if (paramHighestTerrainTags.some(function(id) {
                        return id === $gameMap.terrainTag(x2, y2);
                    }.bind(this))) return true;
            }
        }
        return _Game_CharacterBase_isMapPassable.apply(this, arguments);
    };

    var _Game_CharacterBase_screenY = Game_CharacterBase.prototype.screenY;
    Game_CharacterBase.prototype.screenY = function() {
        return _Game_CharacterBase_screenY.apply(this, arguments) +
            (this.isFloating() ? Math.floor(Math.sin(this._altitudeAnimeCount / 16) * 3) - this._altitude : 0);
    };

    var _Game_CharacterBase_screenZ = Game_CharacterBase.prototype.screenZ;
    Game_CharacterBase.prototype.screenZ = function() {
        return _Game_CharacterBase_screenZ.apply(this, arguments) +
            (this._altitude >= $gameMap.tileHeight() ? 1 : 0);
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
        if (!this.hasOwnProperty('_altitude') || isNaN(this._altitude)) {
            this.initFloatingInfo();
        }
        if (!max) max = $gameMap.tileHeight() / 2;
        this._needFloat   = true;
        this._maxAltitude = max;
        if (waitFlg) this._waitCount = Math.max(this.maxAltitude() - this._altitude, 0);
    };

    Game_Player.prototype.float = function(waitFlg, max) {
        Game_CharacterBase.prototype.float.apply(this, arguments);
        this.followers().forEach(function(follower) {
            follower.float(waitFlg, max);
            follower._altitude = -follower._memberIndex * 4;
        }.bind(this));
    };

    Game_CharacterBase.prototype.landing = function(waitFlg) {
        this._needFloat = false;
        if (waitFlg) this._waitCount = this.maxAltitude();
    };

    Game_CharacterBase.prototype.landingIfOk = function(waitFlg) {
        if ($gameMap.isAirshipLandOk(this.x, this.y)) this.landing(waitFlg);
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
        if (this._floatingPrev !== this.isFloating()) {
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

