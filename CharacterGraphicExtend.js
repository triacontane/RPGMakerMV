//=============================================================================
// CharacterGraphicExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2016/01/21 競合対策（YEP_MessageCore.js）
// 1.1.0 2016/01/11 キャラクターに回転角を設定する機能を追加
//                  移動ルートの指定のスクリプトから、回転角、拡大率、位置調整ができる機能を追加
// 1.0.0 2016/01/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc キャラクターグラフィック表示拡張プラグイン
 * @author トリアコンタン
 *
 * @help イベントのグラフィック表示方法を拡張して多彩な表現を可能にします。
 * イベントのメモ欄に所定の書式で記入してください。
 * 項目の間はカンマで区切ってください。引数には文章の表示と同じ制御文字が使用できます。
 * また、ページ数に「A」と入力すると全てのページが対象になります。
 *
 * <CGピクチャ:（ページ数）,（ファイル名）>
 * 指定したページが有効になった場合のグラフィックをピクチャ画像から取得します。
 * 拡張子は不要です。歩行アニメ待機アニメは無効化されます。
 *
 * 例：<CGピクチャ:1,Test> or <CGPicture:1,Test>
 *
 * <CG敵キャラ:（ページ数）,（ファイル名）>
 * 指定したページが有効になった場合のグラフィックを敵キャラ画像から取得します。
 * 拡張子は不要です。歩行アニメ待機アニメは無効化されます。
 *
 * 例：<CG敵キャラ:1,Bat> or <CGEnemy:1,Bat>
 *
 * <CGアイコン:（ページ数）,（インデックス）>
 * 指定したページが有効になった場合のグラフィックをアイコン画像から取得します。
 * 歩行アニメ待機アニメは無効化されます。
 *
 * 例：<CGアイコン:1,128> or <CGIcon:1,128>
 *
 * <CGフェイス:（ページ数）,（ファイル名）（インデックス）>
 * 指定したページが有効になった場合のグラフィックをフェイス画像から取得します。
 * 歩行アニメ待機アニメは無効化されます。
 *
 * 例：<CGフェイス:1,Actor1,4> or <CGFace:1,Actor1,4>
 *
 * <CGタイル:（ページ数）,（横幅）,（高さ）>
 * 指定したページが有効になった場合のグラフィックをタイルマップ画像から取得します。
 * 横幅と高さを指定して本棚やベッドが一つのイベントで表現できます。
 * イベントの画像選択から一番左上のタイルを選択してください。
 *
 * 例：<CGタイル:1,2,2> or <CGTile:1,2,2>
 *
 * <CGシフト:（ページ数）,（X座標）,（Y座標）>
 * 指定したページが有効になった場合のグラフィック表示位置を
 * 指定したピクセル分ずらして表示します。
 *
 * 例：<CGシフト:1,16,-16> or <CGShift:1,16,-16>
 *
 * <CGプライオリティ:（ページ数）,（プライオリティ）>
 * 指定したページが有効になった場合の表示優先度を設定します。
 * 1～9までの値を設定できます。
 *
 * 例：<CGプライオリティ:1,6> or <CGPriority:1,6>
 *
 * ※それぞれのプライオリティの値
 * 0 : 下層タイル
 * 1 : 通常キャラの下
 * 3 : 通常キャラと同じ
 * 4 : 上層タイル
 * 5 : 通常キャラの上
 * 6 : 飛行船の影
 * 7 : フキダシ
 * 8 : アニメーション
 * 9 : マップタッチの行き先（白く光るヤツ）
 *
 * <CG合成方法:（ページ数）,（合成方法）>
 * 指定したページが有効になった場合のグラフィックの合成方法を設定します。
 * 0:通常 1:加算 2:減算
 *
 * 例：<CG合成方法:1,2> or <CGBlendType:1,2>
 *
 * <CG拡大率:（ページ数）,（X拡大率）（Y拡大率）>
 * 指定したページが有効になった場合のグラフィックの拡大率を設定します。
 * 負の値を設定すると画像が反転します。
 *
 * 例：<CG拡大率:1,100,-100> or <CGScale:1,100,-100>
 *
 * <CG回転角:（ページ数）,（回転角）>
 * 指定したページが有効になった場合のグラフィックの回転角を設定します。
 * 回転の中心は、キャラクターの足下になります。0～360の範囲内で設定してください。
 *
 * 例：<CG回転角:1,180> or <CGAngle:1,180>
 *
 * 〇スクリプト（高度な設定。移動ルートの指定からスクリプトで実行）
 *
 * ・拡大率の設定
 * this.setScale(（X座標）,（Y座標）);
 * 例：this.setScale(100, 100);
 *
 * ・回転角の設定
 * this.setAngle(（回転角）);
 * 例：this.setAngle(180);
 *
 * ・ピクセル単位位置の設定
 * this.shiftPosition(（X座標）,（Y座標）);
 * 例：this.shiftPosition(24, 24);
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

    var getArgArrayString = function (args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getArgString = function (args, upperFlg) {
        args = convertEscapeCharacters(args);
        return upperFlg ? args.toUpperCase() : args;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameActors.actor(parseInt(arguments[1])) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1]) >= 1 ? $gameParty.members()[parseInt(arguments[1]) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.apply(this, arguments);
        this.clearCgInfo();
    };

    Game_CharacterBase.prototype.clearCgInfo = function() {
        this._customResource  = null;
        this._graphicColumns  = 1;
        this._graphicRows     = 1;
        this._additionalX     = 0;
        this._additionalY     = 0;
        this._customPriority  = -1;
        this._scaleX          = 100;
        this._scaleY          = 100;
        this._tileBlockWidth  = 1;
        this._tileBlockHeight = 1;
        this._angle           = 0;
        this.setBlendMode(0);
    };

    Game_CharacterBase.prototype.customResource = function() {
        return this._customResource;
    };

    Game_CharacterBase.prototype.graphicColumns = function() {
        return this._graphicColumns;
    };

    Game_CharacterBase.prototype.graphicRows = function() {
        return this._graphicRows;
    };

    Game_CharacterBase.prototype.scaleX = function() {
        return this._scaleX;
    };

    Game_CharacterBase.prototype.scaleY = function() {
        return this._scaleY;
    };

    Game_CharacterBase.prototype.setScale = function(x, y) {
        this._scaleX = x;
        this._scaleY = y;
    };

    Game_CharacterBase.prototype.angle = function() {
        return this._angle;
    };

    Game_CharacterBase.prototype.setAngle = function(angle) {
        this._angle = angle;
    };

    Game_CharacterBase.prototype.shiftPosition = function(x, y) {
        this._additionalX = x;
        this._additionalY = y;
    };

    Game_CharacterBase.prototype.tileBlockWidth = function() {
        return this._tileBlockWidth;
    };

    Game_CharacterBase.prototype.tileBlockHeight = function() {
        return this._tileBlockHeight;
    };

    Game_CharacterBase.prototype.pos = function(x, y) {
        return (this._x - this.tileBlockWidth() / 2 <= x && this._x + this.tileBlockWidth() / 2 >= x) && this._y === y;
    };

    Game_Event.prototype.getMetaCg = function(names) {
        if (!Array.isArray(names)) names = [names];
        var params = null;
        names.forEach(function(name) {
            if (!params || params[0] === '') params = getArgArrayString(this.event().meta['CG' + name]);
        }.bind(this));
        return params.length > 1 && (getArgNumber(params[0]) === this._pageIndex + 1 || params[0].toUpperCase() === 'A') ?
            params : null;
    };

    var _Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        this.clearCgInfo();
        _Game_Event_setupPageSettings.apply(this, arguments);
        var cgParams = this.getMetaCg(['シフト', 'Shift']);
        if (cgParams) {
            this._additionalX = getArgNumber(cgParams[1]);
            this._additionalY = getArgNumber(cgParams[2]);
        }
        cgParams = this.getMetaCg(['プライオリティ', 'Priority']);
        if (cgParams) {
            this._customPriority = getArgNumber(cgParams[1], 0, 10);
        }
        cgParams = this.getMetaCg(['合成方法', 'BlendType']);
        if (cgParams) {
            switch (cgParams[1]) {
                case '1' :
                case '加算':
                    this.setBlendMode(1);
                    break;
                case '2' :
                case '減算':
                    this.setBlendMode(2);
                    break;
                default:
                    this.setBlendMode(0);
            }
        }
        cgParams = this.getMetaCg(['拡大率', 'Scale']);
        if (cgParams) {
            this._scaleX = getArgNumber(cgParams[1]);
            this._scaleY = getArgNumber(cgParams[2]);
        }
        cgParams = this.getMetaCg(['回転角', 'Angle']);
        if (cgParams) {
            this._angle = getArgNumber(cgParams[1], 0, 360);
        }
    };

    var _Game_Event_setTileImage = Game_Event.prototype.setTileImage;
    Game_Event.prototype.setTileImage = function(tileId) {
        _Game_Event_setTileImage.apply(this, arguments);
        var cgParams = this.getMetaCg(['タイル', 'Tile']);
        if (cgParams) {
            this._tileBlockWidth  = getArgNumber(cgParams[1]);
            this._tileBlockHeight = getArgNumber(cgParams[2]);
        }
    };

    var _Game_Event_setImage = Game_Event.prototype.setImage;
    Game_Event.prototype.setImage = function(characterName, characterIndex) {
        var cgParams = this.getMetaCg(['ピクチャ', 'Picture']);
        if (cgParams) {
            this._customResource = 'Picture';
            this._graphicColumns = 1;
            this._graphicRows    = 1;
            arguments[0]         = cgParams[1];
        }
        cgParams = this.getMetaCg(['敵キャラ', 'Enemy']);
        if (cgParams) {
            this._customResource = 'Enemy';
            this._graphicColumns = 1;
            this._graphicRows    = 1;
            arguments[0]         = cgParams[1];
        }
        cgParams = this.getMetaCg(['アイコン', 'Icon']);
        if (cgParams) {
            this._customResource = 'System';
            this._graphicColumns = 16;
            this._graphicRows    = 20;
            arguments[0]         = 'IconSet';
            arguments[1]         = getArgNumber(cgParams[1], 0, 16 * 20 -1);
        }
        cgParams = this.getMetaCg(['フェイス', 'Face']);
        if (cgParams) {
            this._customResource = 'Face';
            this._graphicColumns = 4;
            this._graphicRows    = 2;
            arguments[0]         = cgParams[1];
            arguments[1]         = getArgNumber(cgParams[2], 0, 4 * 2 - 1);
        }
        _Game_Event_setImage.apply(this, arguments);
    };

    var _Game_CharacterBase_screenX = Game_CharacterBase.prototype.screenX;
    Game_CharacterBase.prototype.screenX = function() {
        return _Game_CharacterBase_screenX.apply(this, arguments) + this._additionalX;
    };

    var _Game_CharacterBase_screenY = Game_CharacterBase.prototype.screenY;
    Game_CharacterBase.prototype.screenY = function() {
        return _Game_CharacterBase_screenY.apply(this, arguments) + this._additionalY;
    };

    var _Game_CharacterBase_screenZ = Game_CharacterBase.prototype.screenZ;
    Game_CharacterBase.prototype.screenZ = function() {
        return this._customPriority > 0 ? this._customPriority : _Game_CharacterBase_screenZ.apply(this, arguments);
    };

    var _Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
    Sprite_Character.prototype.updateBitmap = function() {
        if (this.isImageChanged()) this._customResource = this._character.customResource();
        _Sprite_Character_updateBitmap.apply(this, arguments);
        this.updateExtend();
    };

    Sprite_Character.prototype.updateExtend = function() {
        this.scale.x = this._character.scaleX() / 100;
        this.scale.y = this._character.scaleY() / 100;
        var angle = this._character.angle() * Math.PI / 180;
        if (this.rotation !== angle) this.rotation = angle;
    };

    var _Sprite_Character_setFrame = Sprite_Character.prototype.setFrame;
    Sprite_Character.prototype.setFrame = function(sx, sy, pw, ph) {
        _Sprite_Character_setFrame.call(this, sx, sy,
            pw * this._character.tileBlockWidth(), ph * this._character.tileBlockHeight());
    };

    var _Sprite_Character_isImageChanged = Sprite_Character.prototype.isImageChanged;
    Sprite_Character.prototype.isImageChanged = function() {
        return _Sprite_Character_isImageChanged.apply(this, arguments) ||
            this._customResource !== this._character.customResource();
    };

    var _Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
    Sprite_Character.prototype.setCharacterBitmap = function() {
        if (this._customResource) {
            this.bitmap = ImageManager['load' + this._customResource](this._characterName);
        } else {
            _Sprite_Character_setCharacterBitmap.apply(this, arguments);
        }
    };

    var _Sprite_Character_characterBlockX = Sprite_Character.prototype.characterBlockX;
    Sprite_Character.prototype.characterBlockX = function() {
        if (this._customResource) {
            return this._characterIndex % this._character.graphicColumns();
        } else {
            return _Sprite_Character_characterBlockX.apply(this, arguments);
        }
    };

    var _Sprite_Character_characterBlockY = Sprite_Character.prototype.characterBlockY;
    Sprite_Character.prototype.characterBlockY = function() {
        if (this._customResource) {
            return Math.floor(this._characterIndex / this._character.graphicColumns());
        } else {
            return _Sprite_Character_characterBlockY.apply(this, arguments);
        }
    };

    var _Sprite_Character_patternWidth = Sprite_Character.prototype.patternWidth;
    Sprite_Character.prototype.patternWidth = function() {
        if (this._customResource) {
            return this.bitmap.width / this._character.graphicColumns();
        } else {
            return _Sprite_Character_patternWidth.apply(this, arguments);
        }
    };

    var _Sprite_Character_patternHeight = Sprite_Character.prototype.patternHeight;
    Sprite_Character.prototype.patternHeight = function() {
        if (this._customResource) {
            return this.bitmap.height / this._character.graphicRows();
        } else {
            return _Sprite_Character_patternHeight.apply(this, arguments);
        }
    };

    var _Sprite_Character_characterPatternX = Sprite_Character.prototype.characterPatternX;
    Sprite_Character.prototype.characterPatternX = function() {
        if (this._customResource) {
            return 0;
        } else {
            return _Sprite_Character_characterPatternX.apply(this, arguments);
        }
    };

    var _Sprite_Character_characterPatternY = Sprite_Character.prototype.characterPatternY;
    Sprite_Character.prototype.characterPatternY = function() {
        if (this._customResource) {
            return 0;
        } else {
            return _Sprite_Character_characterPatternY.apply(this, arguments);
        }
    };
})();
