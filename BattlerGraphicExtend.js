//=============================================================================
// BattlerGraphicExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2016/10/02 メモ欄の適用範囲をステートから特徴を有するデータベース項目に拡張しました。
// 1.1.3 2016/08/27 YEP_X_ActSeqPack2.jsとの競合を解消
// 1.1.2 2016/08/27 消滅エフェクトが機能しない競合を抑えるために条件を一部変更
// 1.1.1 2016/08/07 YEP_AutoPassiveStates.jsとの競合を解消
// 1.1.0 2016/07/01 バトラーを指定した色で点滅させる機能を追加
// 1.0.2 2016/06/29 YEP_X_AnimatedSVEnemies.jsとの間で発生していた競合を解消
// 1.0.1 2016/06/17 敵を倒したときにグラフィックが消滅しない不具合を修正
//                  武器グラフィックにも不透明度と合成方法を適用するよう修正
// 1.0.0 2016/06/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Battler graphic extend
 * @author triacontane
 *
 * @help 戦闘中のバトラー画像の表現方法を拡張します。
 * 宙に浮かせたり、色調やサイズを変えたり、多彩な表現が可能です。
 *
 * 特徴を有するデータベースのメモ欄に以下の通り記述してください。
 *
 * バトラーを浮遊させます。この設定はアクターのみ有効です。
 * <BGEAltitude:n> n:Altitude(pixel)
 *
 * バトラーの不透明度を設定します。
 * <BGEOpacity:n> n:Opacity(0..256)
 *
 * バトラーの色調を設定します。各要素を数値で指定します。
 * <BGETone:r,g,b,g> r:赤 g:緑 b:青(-255..255) g:グレー(0..255)
 * 例:<BGETone:255,255,255,128>
 *
 * バトラーをゆるやかに点滅させます。各要素を数値で指定します。
 * この処理はやや重いのでモバイル実行の場合は注意してください。
 * <BGEFlash:r,g,b,a> r:赤 g:緑 b:青 a:強さ(0..255)
 * 例:<BGEFlash:255,0,0,128>
 *
 * フラッシュ間隔を変更したい場合（小さいほど速く点滅し、標準は15です）
 * <BGEFlashInterval:f> f:フレーム数
 * 例:<BGEFlashInterval:30>
 *
 * バトラーの合成方法を設定します。
 * <BGEBlendMode:n> n:0[通常] n:1[加算] n:2[乗算] n:3[スクリーン]
 *
 * バトラーの拡大率を設定します。
 * <BGEScaleX:n> n:Scale(100%)
 * <BGEScaleY:n> n:Scale(100%)
 * 例:<BGEScaleY:150>
 *
 * バトラーのモーション速度を設定します。
 * この設定はアクターのみ有効です。
 * <BGEMotionRate:n> n:Rate(100%)
 * 例:<BGEMotionRate:150>
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc バトラーグラフィック表示拡張プラグイン
 * @author トリアコンタン
 *
 * @help 戦闘中のバトラー画像の表現方法を拡張します。
 * 宙に浮かせたり、色調やサイズを変えたり、多彩な表現が可能です。
 *
 * 特徴を有するデータベースのメモ欄に以下の通り記述してください。
 *
 * バトラーを浮遊させます。この設定はアクターのみ有効です。
 * <BGE高度:n> n:高度(ピクセル)
 * 例:<BGE高度:32>
 *
 * バトラーの不透明度を設定します。
 * <BGE不透明度:n> n:不透明度(0..256)
 * 例：<BGE不透明度:128>
 *
 * バトラーの色調を設定します。各要素を数値で指定します。
 * <BGE色調:r,g,b,g> r:赤 g:緑 b:青(-255..255) g:グレー(0..255)
 * 例:<BGE色調:255,255,255,128>
 *
 * バトラーをゆるやかに点滅させます。各要素を数値で指定します。
 * この処理はやや重いのでモバイル実行の場合は注意してください。
 * <BGEフラッシュ:r,g,b,a> r:赤 g:緑 b:青 a:強さ(0..255)
 * 例:<BGEフラッシュ:255,0,0,128>
 *
 * フラッシュ間隔を変更したい場合（小さいほど速く点滅し、標準は15です）
 * <BGEフラッシュ間隔:f> f:フレーム数
 * 例:<BGEフラッシュ間隔:30>
 *
 * バトラーの合成方法を設定します。
 * <BGE合成方法:n> n:0[通常] n:1[加算] n:2[乗算] n:3[スクリーン]
 * 例:<BGE合成方法:2>
 *
 * バトラーの拡大率を設定します。
 * <BGE拡大率X:n> n:拡大率(100%)
 * <BGE拡大率Y:n> n:拡大率(100%)
 * 例:<BGE拡大率Y:150>
 *
 * バトラーのモーション速度を設定します。
 * この設定はアクターのみ有効です。
 * <BGEモーション倍率:n> n:倍率(100%)
 * 例:<BGEモーション倍率:150>
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
    var metaTagPrefix = 'BGE';

    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getArgArrayNumber = function(args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
        var windowLayer = SceneManager._scene._windowLayer;
        if (windowLayer) {
            var result = windowLayer.children[0].convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
    };

    //=============================================================================
    // Game_BattlerBase
    //  浮遊処理を追加定義します。
    //=============================================================================
    var _Game_BattlerBase_initMembers      = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.apply(this, arguments);
        this._opacity        = 255;
        this._tone           = null;
        this._scaleX         = 100;
        this._scaleY         = 100;
        this._blendMode      = 0;
        this._motionRate     = 100;
        this._refreshExecute = false;
        this.initFloatingInfo();
        this.refreshGraphicInfo();
    };

    var _Game_BattlerBase_refresh      = Game_BattlerBase.prototype.refresh;
    Game_BattlerBase.prototype.refresh = function() {
        _Game_BattlerBase_refresh.apply(this, arguments);
        this.refreshGraphicInfo();
    };

    var _Game_BattlerBase_addNewState      = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        _Game_BattlerBase_addNewState.apply(this, arguments);
        this.refreshGraphicInfo();
    };

    var _Game_BattlerBase_eraseState      = Game_BattlerBase.prototype.eraseState;
    Game_BattlerBase.prototype.eraseState = function(stateId) {
        _Game_BattlerBase_eraseState.apply(this, arguments);
        this.refreshGraphicInfo();
    };

    var _Game_BattlerBase_clearStates      = Game_BattlerBase.prototype.clearStates;
    Game_BattlerBase.prototype.clearStates = function() {
        _Game_BattlerBase_clearStates.apply(this, arguments);
        this.refreshGraphicInfo();
    };

    Game_BattlerBase.prototype.isRefreshExecuted = function() {
        return this._refreshExecute;
    };

    Game_BattlerBase.prototype.getStateMetaValuesForBge = function(names) {
        var priority = -1;
        var result   = null;
        this.traitObjects().forEach(function(traitObject) {
            if (priority <= (traitObject.priority || 0)) {
                var metaValue = getMetaValues(traitObject, names);
                if (metaValue) {
                    result   = metaValue;
                    priority = traitObject.priority || 0;
                }
            }
        }, this);
        return result;
    };

    Game_BattlerBase.prototype.initFloatingInfo = function() {
        this._altitude           = 0;
        this._altitudeAnimeCount = 0;
        this._maxAltitude        = 0;
        this._needFloat          = false;
    };

    Game_BattlerBase.prototype.refreshGraphicInfo = function() {
        if (!this._actorId && !this._enemyId) return;
        this.refreshFloating();
        this.refreshOpacity();
        this.refreshScaleX();
        this.refreshScaleY();
        this.refreshTone();
        this.refreshBlendMode();
        this.refreshMotionRate();
        this.refreshBlendColor();
        this._refreshExecute = true;
    };

    Game_BattlerBase.prototype.refreshFloating = function() {
        var result = this.getStateMetaValuesForBge(['高度', 'Altitude']);
        if (!result) {
            if (this.isFloatingBattler()) this.landingBattler();
            return;
        }
        var altitude = getArgNumber(result, 0);
        if (altitude > this.maxAltitude()) {
            this.floatBattler(altitude);
        }
    };

    Game_BattlerBase.prototype.refreshOpacity = function() {
        var result    = this.getStateMetaValuesForBge(['不透明度', 'Opacity']);
        this._opacity = result ? getArgNumber(result, 0) : 255;
    };

    Game_BattlerBase.prototype.refreshScaleX = function() {
        var result   = this.getStateMetaValuesForBge(['拡大率X', 'ScaleX']);
        this._scaleX = result ? getArgNumber(result, 0) : 100;
    };

    Game_BattlerBase.prototype.refreshScaleY = function() {
        var result   = this.getStateMetaValuesForBge(['拡大率Y', 'ScaleY']);
        this._scaleY = result ? getArgNumber(result, 0) : 100;
    };

    Game_BattlerBase.prototype.refreshBlendMode = function() {
        var result      = this.getStateMetaValuesForBge(['合成方法', 'BlendMode']);
        this._blendMode = result ? getArgNumber(result, 0) : 0;
    };

    Game_BattlerBase.prototype.refreshMotionRate = function() {
        var result       = this.getStateMetaValuesForBge(['モーション倍率', 'MotionRate']);
        this._motionRate = result ? getArgNumber(result, 0) : 100;
    };

    Game_BattlerBase.prototype.refreshTone = function() {
        var result = this.getStateMetaValuesForBge(['色調', 'Tone']);
        this._tone = result ? getArgArrayNumber(result) : [0, 0, 0, 0];
    };

    Game_BattlerBase.prototype.refreshBlendColor = function() {
        var result               = this.getStateMetaValuesForBge(['フラッシュ', 'Flash']);
        this._blendColor         = result ? getArgArrayNumber(result) : [0, 0, 0, 0];
        result                   = this.getStateMetaValuesForBge(['フラッシュ間隔', 'FlashInterval']);
        this._blendColorInterval = result ? getArgNumber(result) : 15;
    };

    Game_BattlerBase.prototype.getAltitude = function() {
        return this.isFloatingBattler() ? Math.floor(Math.sin(this._altitudeAnimeCount / 16) * 5) - this._altitude : 0;
    };

    Game_BattlerBase.prototype.getOpacity = function() {
        return this._opacity;
    };

    Game_BattlerBase.prototype.getScaleX = function() {
        return this._scaleX / 100;
    };

    Game_BattlerBase.prototype.getScaleY = function() {
        return this._scaleY / 100;
    };

    Game_BattlerBase.prototype.getTone = function() {
        return this._tone;
    };

    Game_BattlerBase.prototype.getBlendColor = function() {
        return this._blendColor;
    };

    Game_BattlerBase.prototype.getBlendColorInterval = function() {
        return this._blendColorInterval;
    };

    Game_BattlerBase.prototype.getBlendMode = function() {
        return this._blendMode;
    };

    Game_BattlerBase.prototype.getMotionRate = function() {
        return this._motionRate / 100;
    };

    Game_BattlerBase.prototype.isFloatingBattler = function() {
        return this._altitude > 0;
    };

    Game_BattlerBase.prototype.isNeedFloat = function() {
        return this._needFloat;
    };

    Game_BattlerBase.prototype.maxAltitude = function() {
        return this._maxAltitude;
    };

    Game_BattlerBase.prototype.floatBattler = function(max) {
        if (!this.hasOwnProperty('_altitude') || isNaN(this._altitude)) {
            this.initFloatingInfo();
        }
        this._needFloat   = true;
        this._maxAltitude = max;
    };

    Game_BattlerBase.prototype.landingBattler = function() {
        this._needFloat   = false;
        this._maxAltitude = 0;
    };

    Game_BattlerBase.prototype.updateFloating = function() {
        this._floatingPrev = this.isFloatingBattler();
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
    };

    Game_BattlerBase.prototype.isHighest = function() {
        return this._altitude >= this.maxAltitude();
    };

    //=============================================================================
    // Sprite_Battler
    //  ステートによるエフェクトを反映させます。
    //=============================================================================
    var _Sprite_Battler_initMembers      = Sprite_Battler.prototype.initMembers;
    Sprite_Battler.prototype.initMembers = function() {
        _Sprite_Battler_initMembers.apply(this, arguments);
        this._frameCount     = 0;
        this._prevBlendColor = null;
    };

    var _Sprite_Battler_update      = Sprite_Battler.prototype.update;
    Sprite_Battler.prototype.update = function() {
        if (this._battler) {
            this.updateProperty();
        }
        _Sprite_Battler_update.apply(this, arguments);
    };

    Sprite_Battler.prototype.updateProperty = function() {
        var battler = this._battler;
        if (!battler.isRefreshExecuted()) {
            battler.refreshGraphicInfo();
        }
        battler.updateFloating();
        if (!this.isNeedDeadEffect()) {
            this.updateOpacityForBge();
            this.updateTone();
            this.updateBlendMode();
            this.updateBlendColor();
        }
        this.updateScale();
    };

    Sprite_Battler.prototype.updateScale = function() {
        var battler  = this._battler;
        this.scale.x = battler.getScaleX();
        this.scale.y = battler.getScaleY();
    };

    Sprite_Battler.prototype.updateOpacityForBge = function() {
        var sprite     = this.getMainSprite();
        sprite.opacity = this._battler.getOpacity();
    };

    Sprite_Battler.prototype.updateTone = function() {
        var sprite = this.getMainSprite();
        sprite.setColorTone(this._battler.getTone());
    };

    Sprite_Battler.prototype.updateBlendMode = function() {
        var sprite       = this.getMainSprite();
        sprite.blendMode = this._battler.getBlendMode();
    };

    Sprite_Battler.prototype.updateBlendColor = function() {
        var sprite = this.getMainSprite();
        var color  = this._battler.getBlendColor();
        if (!color.equals(this._prevBlendColor)) {
            this._prevBlendColor = color;
            this._frameCount     = 0;
        }
        var realBlendColor = color.clone();
        var interval       = this._battler.getBlendColorInterval();
        realBlendColor[3]  = color[3] / 2 + Math.floor(color[3] * (Math.sin(this._frameCount / interval) + 1) / 4);
        if (!Utils.isMobileDevice() || this._frameCount % 8 === 0) {
            sprite.setBlendColor(realBlendColor);
        }
        this._frameCount++;
    };

    Sprite_Battler.prototype.getMainSprite = function() {
        return this;
    };

    Sprite_Battler.prototype.isNeedDeadEffect = function() {
        return false;
    };

    //=============================================================================
    // Sprite_Actor
    //  ステートによるエフェクトを反映させます。
    //=============================================================================
    Sprite_Actor.prototype.getMainSprite = function() {
        return this._mainSprite;
    };

    var _Sprite_Actor_updatePosition = Sprite_Actor.prototype.hasOwnProperty('updatePosition') ?
        Sprite_Actor.prototype.updatePosition : null;
    Sprite_Actor.prototype.updatePosition = function() {
        if (_Sprite_Actor_updatePosition) {
            _Sprite_Actor_updatePosition.apply(this, arguments);
        } else {
            Sprite_Battler.prototype.updatePosition.call(this);
        }
        var altitude         = this._battler.getAltitude();
        this._mainSprite.y   = altitude;
        this._weaponSprite.y = altitude;
    };

    Sprite_Actor.prototype.updateOpacity = function() {
        Sprite_Battler.prototype.updateOpacity.call(this);
        this._weaponSprite.opacity = this._battler.getOpacity();
    };

    Sprite_Actor.prototype.updateBlendMode = function() {
        Sprite_Battler.prototype.updateBlendMode.call(this);
        this._weaponSprite.blendMode = this._battler.getBlendMode();
    };

    var _Sprite_Actor_motionSpeed      = Sprite_Actor.prototype.motionSpeed;
    Sprite_Actor.prototype.motionSpeed = function() {
        return _Sprite_Actor_motionSpeed.apply(this, arguments) / (this._battler ? this._battler.getMotionRate() : 1);
    };

    //=============================================================================
    // Sprite_Enemy
    //  ステートによるエフェクトを反映させます。
    //=============================================================================
    Sprite_Enemy.prototype.updateScale = function() {
        Sprite_Battler.prototype.updateScale.call(this);
        var battler = this._battler;
        this.children.forEach(function(sprite) {
            sprite.scale.x = 1 / battler.getScaleX();
            sprite.scale.y = 1 / battler.getScaleY();
        });
    };

    Sprite_Enemy.prototype.isNeedDeadEffect = function() {
        return !this._appeared;
    };
})();

