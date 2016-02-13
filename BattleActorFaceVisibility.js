//=============================================================================
// BattleActorFaceVisibility.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.2 2016/02/13 他のプラグインと併用できるように、ウィンドウの表示位置を調整する機能を追加
//                  ウィンドウの表示順をヘルプウィンドウの下に変更
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
 * @param WindowXCustom
 * @desc Window X Position
 * @default
 *
 * @param WindowYCustom
 * @desc Window Y Position
 * @default
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
 * @param ウィンドウX座標
 * @desc ウィンドウの表示 X 座標です。省略するとデフォルト値になります。
 * @default
 *
 * @param ウィンドウY座標
 * @desc ウィンドウの表示 X 座標です。省略するとデフォルト値になります。
 * @default
 *
 * @help 戦闘中、コマンド選択ウィンドウの上に
 * 顔グラフィックが表示されるようになります。
 *
 * 顔グラフィックを任意のピクチャ画像に差し替えることも可能です。
 * アクターのデータベースのメモ欄に
 * 「<face_picture:（拡張子を除いたピクチャのファイル名）>」
 * と入力してください。制御文字「\V[n]」が利用可能です。
 *
 * 顔グラフィックを任意のエネミー画像に差し替えることも可能です。
 * アクターのデータベースのメモ欄に
 * 「<face_enemy_id:（データベース「敵キャラ」のID）>」
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
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var isParamExist = function(paramNames) {
        return getParamOther(paramNames) != null;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
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
        var length = this._windowLayer.children.length, windowIndex = 0;
        this._faceWindow = new Window_Face();
        for (var i = 0; i < length; i++) {
            if (this._windowLayer.children[i] === this._helpWindow) {
                windowIndex = i;
                break;
            }
        }
        this._windowLayer.addChildAt(this._faceWindow, windowIndex);
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
        var paramsX = ['ウィンドウX座標','WindowXCustom'];
        var x = isParamExist(paramsX) ? getParamNumber(paramsX) : 0;
        var paramsY = ['ウィンドウY座標','WindowYCustom'];
        var y = isParamExist(paramsY) ? getParamNumber(paramsY) : Graphics.boxHeight - this.fittingHeight(4) - height;
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
        if (!getParamBoolean(['WindowVisible','ウィンドウ表示'])) {
            this.opacity = 0;
            this._faceSprite.y += this.padding;
        }
    };

    Window_Face.prototype.loadImages = function() {
        $gameParty.members().forEach(function(actor) {
            var meta = actor.actor().meta;
            if (meta != null && meta.face_picture) {
                ImageManager.loadPicture(getArgString(meta.face_picture));
            } else if (meta != null && meta.face_enemy_id) {
                var enemyId = getArgNumber(meta.face_enemy_id, 1, $dataEnemies.length - 1);
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
            this.drawPicture(getArgString(meta.face_picture), ImageManager.loadPicture.bind(ImageManager));
        } else if (meta != null && meta.face_enemy_id) {
            var enemyId = getArgNumber(meta.face_enemy_id, 1, $dataEnemies.length - 1);
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