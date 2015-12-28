//=============================================================================
// BattleActorFaceVisibility.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2015/12/28 任意のエネミーグラフィック画像を指摘できる機能を追加
//                  ウィンドウを非表示にする機能を追加
// 1.1.0 2015/12/27 顔グラフィックの代わりに任意のピクチャ画像を指定できる機能を追加
// 1.0.1 2015/11/19 サイドビューでも表示されるように仕様変更
// 1.0.0 2015/11/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Plugin that to visualize face graphic in battle
 * @author triacontane
 *
 * @param WindowVisible
 * @desc Window visible flg(ON/OFF)
 * @default ON
 *
 * @help Plugin that to visualize face graphic in battle
 * This plugin is released under the MIT License.
 *
 * No plugin command
 */
/*:ja
 * @plugindesc 戦闘中顔グラフィック表示プラグイン
 * @author トリアコンタン
 *
 * @param ウィンドウ表示
 * @desc 背景ウィンドウの表示フラグです。(ON/OFF)
 * @default ON
 *
 * @help 戦闘中、コマンド選択ウィンドウの上に
 * 顔グラフィックが表示されるようになります。
 *
 * 顔グラフィックを任意のピクチャ画像に差し替えることも可能です。
 * アクターのデータベースのメモ欄に「<face_picture:（拡張子を除いたピクチャのファイル名）>」
 * と入力してください。制御文字「\V[n]」が利用可能です。
 *
 * 顔グラフィックを任意のエネミー画像に差し替えることも可能です。
 * アクターのデータベースのメモ欄に「<face_enemy_id:（データベース「敵キャラ」のID）>」
 * と入力してください。制御文字「\V[n]」が利用可能です。
 *
 * 顔グラフィックより大きいピクチャを指定すると自動で同じサイズに縮小されます。
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
    var pluginName = 'BattleActorFaceVisibility';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(window));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(window));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var n = parseInt(arguments[1]);
            var actor = n >= 1 ? $gameActors.actor(n) : null;
            return actor ? actor.name() : '';
        }.bind(window));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var n = parseInt(arguments[1]);
            var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
            return actor ? actor.name() : '';
        }.bind(window));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var parseIntStrict = function(value, errorMessage) {
        var result = parseInt(value, 10);
        if (isNaN(result)) throw Error('指定した値[' + value + ']が数値ではありません。' + errorMessage);
        return result;
    };

    //=============================================================================
    // Scene_Battle
    //  顔グラフィックを表示するウィンドウを追加します。
    //=============================================================================
    var _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        this.createFaceWindow();
    };

    Scene_Battle.prototype.createFaceWindow = function() {
        this._faceWindow = new Window_Face();
        this.addWindow(this._faceWindow);
        // 表示順入れ替え
        this._windowLayer.removeChild(this._skillWindow);
        this.addWindow(this._skillWindow);
        this._windowLayer.removeChild(this._itemWindow);
        this.addWindow(this._itemWindow);
    };

    //=============================================================================
    // Window_Face
    //  顔グラフィックを表示するだけのウィンドウです。
    //=============================================================================
    function Window_Face() {
        this.initialize.apply(this, arguments);
    }

    Window_Face.prototype = Object.create(Window_Base.prototype);
    Window_Face.prototype.constructor = Window_Face;

    Window_Face.prototype.initialize = function() {
        var width  = 192;
        var height = Window_Base._faceHeight + this.standardPadding() * 2;
        var x = 0;
        var y = Graphics.boxHeight - this.fittingHeight(4) - height;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.hide();
        this.loadImages();  // 非同期処理のためあらかじめロードしておく
        this.createFaceSprite();
        this.setWindowVisible();
        this._actorId = 0;
    };

    Window_Face.prototype.createFaceSprite = function() {
        var sprite = new Sprite();
        sprite.x        = this.width / 2;
        sprite.y        = this.height / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        this._faceSprite = sprite;
        this.addChild(this._faceSprite);
    };

    Window_Face.prototype.setWindowVisible = function() {
        var visible = getParamBoolean(['WindowVisible','ウィンドウ表示'], 0, 255);
        if (!visible) {
            this.opacity = 0;
            this._faceSprite.y += this.padding;
        }
    };

    Window_Face.prototype.loadImages = function() {
        $gameParty.members().forEach(function(actor) {
            var meta = actor.actor().meta;
            if (meta != null && meta.face_picture) {
                ImageManager.loadPicture(convertEscapeCharacters(meta.face_picture));
            } else if (meta != null && meta.face_enemy_id) {
                var enemyId = parseInt(
                    convertEscapeCharacters(meta.face_enemy_id), 10).clamp(1, $dataEnemies.length - 1);
                ImageManager.loadEnemy($dataEnemies[enemyId].battlerName);
            } else {
                ImageManager.loadFace(actor.faceName());
            }
        }, this);
    };

    Window_Face.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        var actor = BattleManager.actor();
        if (actor && this._actorId != actor.actorId()) {
            this.drawActorFace(actor);
            this._actorId = actor.actorId();
            this.show();
        }
        if (actor == null && this._actorId != 0) {
            this._actorId = 0;
            this.hide();
        }
    };

    Window_Face.prototype.drawActorFace = function(actor) {
        var meta = actor.actor().meta;
        if (meta != null && meta.face_picture) {
            this.drawPicture(meta.face_picture, ImageManager.loadPicture.bind(ImageManager));
        } else if (meta != null && meta.face_enemy_id) {
            var enemyId = parseInt(
                convertEscapeCharacters(meta.face_enemy_id), 10).clamp(1, $dataEnemies.length - 1);
            this.drawPicture($dataEnemies[enemyId].battlerName, ImageManager.loadEnemy.bind(ImageManager));
        } else {
            this.drawFace(actor);
        }
    };

    Window_Face.prototype.drawPicture = function(fileName, loadHandler) {
        var bitmap = loadHandler(fileName);
        if (bitmap.isReady()) {
            var scale = Math.min(Window_Base._faceWidth / bitmap.width, Window_Base._faceHeight / bitmap.height, 1.0);
            this._faceSprite.scale.x = scale;
            this._faceSprite.scale.y = scale;
            this._faceSprite.bitmap  = bitmap;
        } else {
            throw new Error('何らかの原因で画像' + fileName + 'のロードに失敗しました。');
        }
    };

    Window_Face.prototype.drawFace = function(actor) {
        var bitmap = ImageManager.loadFace(actor.faceName());
        if (bitmap.isReady()) {
            this._faceSprite.scale.x = 1.0;
            this._faceSprite.scale.y = 1.0;
            this._faceSprite.bitmap  = bitmap;
            var sx = actor.faceIndex() % 4 * Window_Base._faceWidth;
            var sy = Math.floor(actor.faceIndex() / 4) * Window_Base._faceHeight;
            this._faceSprite.setFrame(sx, sy, Window_Base._faceWidth, Window_Base._faceHeight);
        } else {
            throw new Error('何らかの原因で画像' + actor.faceName() + 'のロードに失敗しました。');
        }
    };
})();