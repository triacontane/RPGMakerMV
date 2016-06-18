//=============================================================================
// CharacterGraphicManager.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/05/17 タクポンさん依頼版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 歩行グラフィック表示管理プラグイン
 * @author トリアコンタン
 *
 * @help アクターの歩行グラフィックを動的に変更します。
 * 立ち絵表示管理プラグインと組み合わせて使用してください。
 *
 * ・アクターのメモ欄に以下の通り記述すると、条件に応じて歩行グラフィックが変化します。
 * // 耐久度が50%(10%単位で指定可)を下回ったら「aaa.png」のインデックス「1」が表示されます。
 * <CGM耐久50:aaa,1>
 *
 * // 数値のみを指定するとファイルはそのままでインデックスだけを変更します。
 * <CGM耐久50:1>
 *
 * ・ステートのメモ欄に以下の通り記述すると、条件に応じて歩行グラフィックが変化します。
 * // 対象のステートが有効な場合「bbb.png」のインデックス「1」が表示されます。
 * <CGMノーマル:bbb,1>
 *
 * // 耐久度が50%(10%単位で指定可)を下回ったら「ccc.png」のインデックス「1」が表示されます。
 * <CGM耐久50:ccc,1>
 *
 * ファイル名とインデックスの間は「,」(半角カンマ)で区切ってください。
 * また、キャラクターグラフィックのインデックスは以下の通りです。
 * 0 1 2 3
 * 4 5 6 7
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
    var pluginName    = 'CharacterGraphicManager';
    var metaTagPrefix = 'CGM';

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharactersAndEval(arg, false);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
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
        return evalFlg ? eval(text) : text;
    };

    //=============================================================================
    // Game_Actor
    //  歩行グラフィックを動的に変更します。
    //=============================================================================
    var _Game_Actor_characterName = Game_Actor.prototype.characterName;
    Game_Actor.prototype.characterName = function() {
        return this._dynamicCharacerName !== undefined ?
            this._dynamicCharacerName : _Game_Actor_characterName.apply(this, arguments);
    };

    var _Game_Actor_characterIndex = Game_Actor.prototype.characterIndex;
    Game_Actor.prototype.characterIndex = function() {
        return this._dynamicCharacerIndex !== undefined ?
            this._dynamicCharacerIndex : _Game_Actor_characterIndex.apply(this, arguments);
    };

    Game_Actor.prototype.updateDynamicCharacterInfo = function() {
        this._dynamicCharacerName  = undefined;
        this._dynamicCharacerIndex = undefined;
        var characterInfo = this.getDynamicCharacterInfo();
        if (characterInfo) {
            var characterData = characterInfo.split(',');
            if (characterData.length > 1) {
                this._dynamicCharacerName = characterData.shift();
            }
            this._dynamicCharacerIndex = getArgNumber(characterData.shift(), 0, 7);
        }
    };

    Game_Actor.prototype.getDynamicCharacterInfo = function() {
        var characterInfo = this.getCgState();
        if (characterInfo) return characterInfo;
        characterInfo = this.getCgCloth();
        if (characterInfo) return characterInfo;
        return null;
    };

    Game_Actor.prototype.getCgName = function(name, data) {
        if (!data) data = this.getData();
        var pictureName = getMetaValue(data, name);
        return pictureName ? getArgString(pictureName) : null;
    };

    Game_Actor.prototype.getCgCloth = function(data) {
        for (var i = 0; i < 10; i++) {
            var characterName = this.getCgName('耐久' + String(i * 10), data);
            if (characterName && this.getClothHp && this.getClothHp() <= i * 10) return characterName;
        }
        return null;
    };

    Game_Actor.prototype.getCgState = function() {
        this.sortStates();
        var states = this.states(), characterName = null;
        for (var i = 0, n = states.length; i < n; i++) {
            characterName = this.getCgCloth(states[i]);
            if (characterName) return characterName;
            characterName = this.getCgName('ノーマル', states[i]);
            if (characterName) return characterName;
        }
        return null;
    };

    Game_Battler.prototype.getData = function() {
        return null;
    };

    Game_Actor.prototype.getData = function() {
        return this.actor();
    };

    Game_Enemy.prototype.getData = function() {
        return this.enemy();
    };

    //=============================================================================
    // Game_Player
    //  動的歩行グラフィックを適用します。
    //=============================================================================
    var _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.apply(this, arguments);
        if(this.canMove()) this.updateDynamicGraphic();
    };

    Game_Player.prototype.updateDynamicGraphic = function() {
        var actor = $gameParty.leader();
        if (!actor) return;
        actor.updateDynamicCharacterInfo();
        if (this._characterName !== actor.characterName() || this._characterIndex !== actor.characterIndex()) {
            this.refresh();
        }
    };

    //=============================================================================
    // Sprite_Character
    //  画像切り替え時のチラつきを防止します。
    //=============================================================================
    var _Sprite_Character_characterBlockX = Sprite_Character.prototype.characterBlockX;
    Sprite_Character.prototype.characterBlockX = function() {
        var x = _Sprite_Character_characterBlockX.apply(this, arguments);
        if (this._prevIndex !== undefined) {
            return this._prevIndex % 4 * 3;
        }
        return x;
    };

    var _Sprite_Character_characterBlockY = Sprite_Character.prototype.characterBlockY;
    Sprite_Character.prototype.characterBlockY = function() {
        var y = _Sprite_Character_characterBlockY.apply(this, arguments);
        if (this._prevIndex !== undefined) {
            return Math.floor(this._prevIndex / 4) * 4;
        }
        return y;
    };

    var _Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
    Sprite_Character.prototype.updateBitmap = function() {
        var prevBitmap = this.bitmap ? this.bitmap : null;
        var prevIndex  = this._characterIndex;
        _Sprite_Character_updateBitmap.apply(this, arguments);
        if (this._tileId <= 0 && !this.bitmap.isReady() && prevBitmap) {
            var bitmap = this.bitmap;
            this._prevIndex = prevIndex;
            bitmap.addLoadListener(function () {
                this.bitmap = bitmap;
                this._prevIndex = undefined;
            }.bind(this));
            this.bitmap = prevBitmap;
        }
    };
})();

