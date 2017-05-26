//=============================================================================
// RelativeTouchPad.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.2 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.1.1 2017/05/10 乗り物中にダッシュが有効になっていた現象を修正
// 1.1.0 2017/03/01 数値入力ウィンドウのボタンを常に表示するよう変更
//                  ダッシュ禁止の場合はダッシュできないよう変更
// 1.0.3 2016/04/29 createUpperLayerによる競合対策
// 1.0.2 2016/03/04 本体バージョン1.1.0の未使用素材の削除機能への対応
// 1.0.1 2016/02/21 一般公開用に設定項目を追加
// 1.0.0 2016/02/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc もどきぷにコンプラグイン
 * @author トリアコンタン
 * 
 * @param タッチ有効領域
 * @desc タッチ移動可能な有効領域をピクセル単位で指定します。
 * @default 0,0,816,624
 *
 * @param パッド画像ファイル
 * @desc パッド画像のファイル名（拡張子は不要）です。
 * 画像は「img/pictures/」以下に保存してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param アロー画像ファイル
 * @desc アロー画像ファイル名（拡張子は不要）です。
 * 画像は「img/pictures/」以下に保存してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param パッド画像不透明度
 * @desc パッド画像の不透明度（0...255）です。
 * @default 255
 * 
 * @help マップタッチ移動の代わりにタッチを開始した位置からの
 * 相対座標をもとにプレイヤーを移動します。
 * 傾きの大きさによって「その場で方向転換」「歩行」「ダッシュ」と
 * 変化します。
 * オプションの「常時ダッシュ」が有効な場合は「歩行」は行いません。
 *
 * パッド画像ファイルとアロー画像ファイルに任意のピクチャを
 * 指定することができます。指定しなかった場合は動的に作成された
 * 画像が使用されます。
 *
 * 画像の規格は以下の通りです。
 * ・パッド : 任意のサイズの正方形画像（円形が望ましい）
 * ・アロー : パッドと同じサイズの画像で、上を指していることが分かる画像
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function Game_Relative_Pad() {
    this.initialize.apply(this, arguments);
}
/* 設定項目 */
/* 相対タッチ移動を禁止します。 */
Game_Relative_Pad.disable              = false;
/* 通常のマップタッチ移動を禁止します。 */
Game_Relative_Pad.mapTouchDisable      = true;
/* 歩行せずその場方向転換になる圏内です。 */
Game_Relative_Pad.distanceNear         = 24;
/* ダッシュせず歩行になる圏内です。 */
Game_Relative_Pad.distanceFar          = 144;

(function () {
    var pluginName = 'RelativeTouchPad';

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
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var getDiagonalInt = function(x, y) {
        return Math.floor(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    };

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    //=============================================================================
    // Input
    //  キー入力情報を送信する処理を追加定義します。
    //=============================================================================
    Input.submitKey = function(keyName) {
        this._currentState[keyName] = true;
        this._submitState[keyName] = Graphics.frameCount;
    };

    var _Input_clear = Input.clear;
    Input.clear = function() {
        _Input_clear.apply(this, arguments);
        this._submitState = {};
    };

    var _Input_update = Input.update;
    Input.update = function() {
        this._suppressSubmit();
        _Input_update.apply(this, arguments);
        this._date = 0;
    };

    Input._suppressSubmit = function() {
        iterate(this._submitState, function (keyName, frameCount) {
            if (frameCount + 1 < Graphics.frameCount) {
                this._currentState[keyName] = false;
                delete this._submitState[keyName];
            }
        }.bind(this));
    };

    //=============================================================================
    // Game_Temp
    //  Game_RelativeTouchPadのインスタンスを作成します。
    //=============================================================================
    var _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.apply(this, arguments);
        this._relativeTouchPad = new Game_Relative_Pad();
    };

    Game_Temp.prototype.getRelativeTouchPad = function() {
        return this._relativeTouchPad;
    };

    //=============================================================================
    // Game_Player
    //  Game_RelativeTouchPadによる移動を追加定義します。
    //=============================================================================
    var _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        this.getMovePad().update();
        _Game_Player_update.apply(this, arguments);
    };

    var _Game_Player_getInputDirection = Game_Player.prototype.getInputDirection;
    Game_Player.prototype.getInputDirection = function() {
        return _Game_Player_getInputDirection.apply(this, arguments) || this.getMovePad().getDir();
    };

    var _Game_Player_executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function(direction) {
        var movePad = this.getMovePad();
        if (movePad.isActive() && movePad.isDistanceNear()) {
            var turnDir = movePad.getDir4();
            if (turnDir !== 0) this.setDirection(turnDir);
        } else {
            if (direction % 2 === 0) {
                _Game_Player_executeMove.apply(this, arguments);
            } else if (direction !== 5) {
                this.executeDiagonalMove(direction);
            }
        }
    };

    Game_Player.prototype.executeDiagonalMove = function(d) {
        var horizon  = d / 3 <=  1 ? d + 3 : d - 3;
        var vertical = d % 3 === 0 ? d - 1 : d + 1;
        var x2 = $gameMap.roundXWithDirection(this.x, horizon);
        var y2 = $gameMap.roundYWithDirection(this.y, vertical);
        if (this.isCollidedWithCharacters(x2, this.y) || this.isCollidedWithCharacters(this.x, y2)) {
            return;
        }
        this.moveDiagonally(horizon, vertical);
        if (!this.isMovementSucceeded()) {
            this.moveStraight(horizon);
        }
        if (!this.isMovementSucceeded()) {
            this.moveStraight(vertical);
        }
    };

    var _Game_Player_updateDashing = Game_Player.prototype.updateDashing;
    Game_Player.prototype.updateDashing = function() {
        _Game_Player_updateDashing.apply(this, arguments);
        if (this.getMovePad().isActive() && !$gameMap.isDashDisabled() && !this.isInVehicle()) {
            this._dashing = this.getMovePad().isDistanceFar() || ConfigManager.alwaysDash;
        }
    };

    Game_Player.prototype.getMovePad = function() {
        return $gameTemp.getRelativeTouchPad();
    };

    //=============================================================================
    // Scene_Map
    //  マップタッチ移動を禁止します。
    //=============================================================================
    var _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function() {
        return _Scene_Map_isMapTouchOk.apply(this, arguments) && !Game_Relative_Pad.mapTouchDisable;
    };

    var paramTouchableRect = getParamArrayNumber(['タッチ有効領域', 'TouchableRect'], 0);
    //=============================================================================
    // Game_Relative_Pad
    //  相対タッチパッドを定義します。
    //  $gameTempで作成され、セーブデータには保存されません。
    //=============================================================================
    Game_Relative_Pad.prototype.constructor = Game_Relative_Pad;

    Game_Relative_Pad.prototype.initialize = function() {
        this.initMember();
    };

    Game_Relative_Pad.prototype.initMember = function() {
        this._x            = 0;
        this._y            = 0;
        this._radian       = 0;
        this._dir4         = 0;
        this._dir8         = 0;
        this._diagonalMove = true;
        this.resetNeutral();
    };

    Game_Relative_Pad.prototype.update = function() {
        this._x = TouchInput.x;
        this._y = TouchInput.y;
        if(!this.isActive()) this.updateNonActive();
        if(this.isActive()) this.updateActive();
    };

    Game_Relative_Pad.prototype.updateNonActive = function() {
        if (!Game_Relative_Pad.disable && $gamePlayer.canMove() &&
            TouchInput.isTriggered() && this._inTouchableRect()) {
            this.setNeutral();
        }
    };

    Game_Relative_Pad.prototype.updateActive = function() {
        if (!$gamePlayer.canMove() || !TouchInput.isPressed() || !this._inTouchableRect()) {
            this.initMember();
            if ($gamePlayer.canMove()) this.submitOk();
        } else {
            this._radian = Math.atan2(this.getDeltaY(), this.getDeltaX()) * -1 + Math.PI;
            this._dir4   = this._calculateDir4();
            this._dir8   = this._calculateDir8();
        }
    };

    Game_Relative_Pad.prototype.submitOk = function() {
        Input.submitKey('ok');
    };

    Game_Relative_Pad.prototype.setNeutral = function() {
        this._neutralX = this._x;
        this._neutralY = this._y;
    };

    Game_Relative_Pad.prototype.resetNeutral = function() {
        this._neutralX = null;
        this._neutralY = null;
    };

    Game_Relative_Pad.prototype.isActive = function() {
        return this._neutralX !== null && this._neutralY !== null;
    };

    Game_Relative_Pad.prototype.getRotation = function() {
        return -this._radian + Math.PI / 2;
    };

    Game_Relative_Pad.prototype.getDir = function() {
        return this._diagonalMove ? this._dir8 : this._dir4;
    };

    Game_Relative_Pad.prototype.getDir4 = function() {
        return this._dir4;
    };

    /** @private */
    Game_Relative_Pad.prototype._calculateDir4 = function() {
        var pi4d = Math.PI / 4;
        if (this.isDistanceZero())                                  return 0;
        if (this._radian <   pi4d     || this._radian >=  pi4d * 7) return 6;
        if (this._radian >=  pi4d     && this._radian <   pi4d * 3) return 8;
        if (this._radian >=  pi4d * 3 && this._radian <   pi4d * 5) return 4;
        if (this._radian >=  pi4d * 5 && this._radian <   pi4d * 7) return 2;
    };

    /** @private */
    Game_Relative_Pad.prototype._calculateDir8 = function() {
        var pi8d = Math.PI / 8;
        if (this.isDistanceZero())                                    return 0;
        if (this._radian <   pi8d      || this._radian >=  pi8d * 15) return 6;
        if (this._radian >=  pi8d      && this._radian <   pi8d * 3)  return 9;
        if (this._radian >=  pi8d * 3  && this._radian <   pi8d * 5)  return 8;
        if (this._radian >=  pi8d * 5  && this._radian <   pi8d * 7)  return 7;
        if (this._radian >=  pi8d * 7  && this._radian <   pi8d * 9)  return 4;
        if (this._radian >=  pi8d * 9  && this._radian <   pi8d * 11) return 1;
        if (this._radian >=  pi8d * 11 && this._radian <   pi8d * 13) return 2;
        if (this._radian >=  pi8d * 13 && this._radian <   pi8d * 15) return 3;
    };

    Game_Relative_Pad.prototype.getDeltaX = function() {
        return this._neutralX - this._x;
    };

    Game_Relative_Pad.prototype.getDeltaY = function() {
        return this._neutralY - this._y;
    };

    Game_Relative_Pad.prototype.getDistanceX = function() {
        return Math.abs(this.getDeltaX());
    };

    Game_Relative_Pad.prototype.getDistanceY = function() {
        return Math.abs(this.getDeltaY());
    };

    Game_Relative_Pad.prototype.getNeutralX = function() {
        return this._neutralX;
    };

    Game_Relative_Pad.prototype.getNeutralY = function() {
        return this._neutralY;
    };

    Game_Relative_Pad.prototype.getDistance = function() {
        return getDiagonalInt(this.getDistanceX(), this.getDistanceY());
    };

    Game_Relative_Pad.prototype.isDistanceZero = function() {
        return this.getDistance() === 0;
    };

    Game_Relative_Pad.prototype.isDistanceNear = function() {
        return this.getDistance() < Game_Relative_Pad.distanceNear;
    };

    Game_Relative_Pad.prototype.isDistanceFar = function() {
        return this.getDistance() > Game_Relative_Pad.distanceFar;
    };

    /** @private */
    Game_Relative_Pad.prototype._inTouchableRect = function() {
        return this._x >= paramTouchableRect[0] && this._x <= paramTouchableRect[2] &&
            this._y >= paramTouchableRect[1] && this._y <= paramTouchableRect[3];
    };

    //=============================================================================
    // Spriteset_Map
    //  相対タッチパッドの画像を追加定義します。
    //=============================================================================
    var _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function() {
        _Spriteset_Base_createUpperLayer.apply(this, arguments);
        if (this instanceof Spriteset_Map) this.createRelativePad();
    };

    Spriteset_Map.prototype.createRelativePad = function() {
        this._relativePadSprite = new Sprite_Relative_Pad();
        this.addChild(this._relativePadSprite);
    };

    //=============================================================================
    // Sprite_Relative_Pad
    //  相対タッチパッドのスプライトです。
    //=============================================================================
    function Sprite_Relative_Pad() {
        this.initialize.apply(this, arguments);
    }

    Sprite_Relative_Pad.prototype = Object.create(Sprite.prototype);
    Sprite_Relative_Pad.prototype.constructor = Sprite_Relative_Pad;
    Sprite_Relative_Pad.padImage   = null;
    Sprite_Relative_Pad.arrorImage = null;

    var _Sprite_Relative_Pad_initialize = Sprite_Relative_Pad.prototype.initialize;
    Sprite_Relative_Pad.prototype.initialize = function() {
        _Sprite_Relative_Pad_initialize.apply(this, arguments);
        this.anchor.x   = 0.5;
        this.anchor.y   = 0.5;
        this.opacity    = 0;
        var fileName    = getParamString(['パッド画像ファイル', 'ImageNamePad']);
        this.bitmap     = this.loadPictureOrEmpty(fileName, this.makeImagePad.bind(this));
        this._padActive = false;
        this._arrowDiagonal = 0;
        this.createTouchArrowSprite();
        this.update();
    };

    Sprite_Relative_Pad.prototype.createTouchArrowSprite = function() {
        var fileName      = getParamString(['アロー画像ファイル', 'ImageNameArrow']), sprite = new Sprite();
        sprite.anchor.x   = 0.5;
        sprite.anchor.y   = 0.5;
        sprite.bitmap     = this.loadPictureOrEmpty(fileName, this.makeArrowPad.bind(this));
        this._arrowSprite = sprite;
        this.addChild(this._arrowSprite);
    };

    Sprite_Relative_Pad.prototype.loadPictureOrEmpty = function(fileName, makeImageHandler) {
        return fileName ? ImageManager.loadPicture(fileName) : makeImageHandler();
    };

    Sprite_Relative_Pad.prototype.makeImagePad = function() {
        if (!Sprite_Relative_Pad.padImage) {
            var bitmap = new Bitmap(96, 96), size = bitmap.width / 2;
            bitmap.drawCircle(size, size, size, 'rgba(255,255,255,0.5)');
            Sprite_Relative_Pad.padImage = bitmap;
        }
        return Sprite_Relative_Pad.padImage;
    };

    Sprite_Relative_Pad.prototype.makeArrowPad = function() {
        if (!Sprite_Relative_Pad.arrorImage) {
            var bitmap = new Bitmap(96, 96), width = 24, size = bitmap.width / 2;
            bitmap.drawCircle(size, width / 2, width / 2, 'rgba(128,128,128,1.0)');
            Sprite_Relative_Pad.arrorImage = bitmap;
        }
        return Sprite_Relative_Pad.arrorImage;
    };

    Sprite_Relative_Pad.prototype.refresh = function() {
        this._arrowDiagonal = getDiagonalInt(this._arrowSprite.width / 4, this._arrowSprite.height / 4);
        this.opacity = getParamNumber(['パッド画像不透明度', 'PadOpacity'], 0, 255);
        this.scale.x = 1.0;
        this.scale.y = 1.0;
        this.visible = true;
        this._padActive = true;
    };

    Sprite_Relative_Pad.prototype.update = function() {
        if (!this.getMovePad().isActive()) {
            if (this.opacity > 0) {
                this.updateFadeout();
                this._padActive = false;
            } else {
                this.visible = false;
            }
        } else {
            if (!this._padActive) this.refresh();
            this.updatePlacement();
            this.updateArrowSprite();
        }
    };

    Sprite_Relative_Pad.prototype.updatePlacement = function() {
        this.x = this.getMovePad().getNeutralX();
        this.y = this.getMovePad().getNeutralY();
    };

    Sprite_Relative_Pad.prototype.updateArrowSprite = function() {
        if (this.getMovePad().isDistanceZero()) {
            this._arrowSprite.visible  = false;
        } else {
            this._arrowSprite.visible  = true;
            this._arrowSprite.rotation = this.getMovePad().getRotation();
            var scale                  = this.getMovePad().getDistance() / this._arrowDiagonal;
            this._arrowSprite.scale.x = scale;
            this._arrowSprite.scale.y = scale;
            this._arrowSprite.opacity = Math.min(255, 255 / (scale / 1.5));
        }
    };

    Sprite_Relative_Pad.prototype.updateFadeout = function() {
        this.opacity -= 36;
        this.scale.x += 0.02;
        this.scale.y += 0.02;
    };

    Sprite_Relative_Pad.prototype.getMovePad = function() {
        return $gameTemp.getRelativeTouchPad();
    };
})();