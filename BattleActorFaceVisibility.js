//=============================================================================
// BattleActorFaceVisibility.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.5.0 2017/05/21 敵キャラ選択中にウィンドウを非表示にする機能と、味方選択中に表示対象を選択中のアクターに変更する機能を追加
// 1.4.1 2017/01/21 ステートアイコンの並び順が逆になっていた不具合を修正
// 1.4.0 2016/12/31 ウィンドウ透過機能を追加
// 1.3.1 2016/11/25 割合の指定に100%を指定できるよう修正
// 1.3.0 2016/11/24 現在のHPの割合によって表示するグラフィックを変更する機能を追加
// 1.2.0 2016/08/08 顔グラフィック以外を表示したときに縮小するかどうかを選択するパラメータを追加
// 1.1.3 2016/04/16 戦闘中にメンバーが入れ替わった場合にエラーが発生する場合がある問題を修正
// 1.1.2 2016/02/13 他のプラグインと併用できるように、ウィンドウの表示位置を調整する機能を追加
//                  ウィンドウの表示順をヘルプウィンドウの下に変更
// 1.1.1 2015/12/28 任意のエネミーグラフィック画像を指摘できる機能を追加
//                  ウィンドウを非表示にする機能を追加
// 1.1.0 2015/12/27 顔グラフィックの代わりに任意のピクチャ画像を指定できる機能を追加
// 1.0.1 2015/11/19 サイドビューでも表示されるように仕様変更
// 1.0.0 2015/11/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
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
 * @param Reduction
 * @desc Reduction picture or enemy image(ON/OFF)
 * @default ON
 *
 * @param ThroughWindow
 * @desc Window through if overlap windows(ON/OFF)
 * @default OFF
 *
 * @param HideWhenSelectEnemy
 * @desc 敵キャラを選択中はグラフィックを非表示にします。
 * @default OFF
 *
 * @param ShowWhenSelectActor
 * @desc 味方キャラを選択中は（行動入力中の対象ではなく）選択している対象を表示します。
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
 * @param ウィンドウX座標
 * @desc ウィンドウの表示 X 座標です。省略するとデフォルト値になります。
 * @default
 *
 * @param ウィンドウY座標
 * @desc ウィンドウの表示 X 座標です。省略するとデフォルト値になります。
 * @default
 *
 * @param 縮小表示
 * @desc ピクチャ及び敵キャラ画像をウィンドウサイズに合わせて縮小表示します。(ON/OFF)
 * @default ON
 *
 * @param 敵選択中は非表示
 * @desc 敵キャラを選択中はグラフィックを非表示にします。
 * @default OFF
 *
 * @param 味方選択中は対象表示
 * @desc 味方キャラを選択中は（行動入力中の対象ではなく）選択している対象を表示します。
 * @default ON
 *
 * @param ウィンドウ透過
 * @desc ウィンドウが重なったときに透過表示します。(ON/OFF)
 * スキルウィンドウの裏側に顔グラフィックが表示されます。
 * @default OFF
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
 * さらに、追加機能として現在のアクターのHPにより表示する顔グラフィックを
 * 変化させることができます。指定可能な値は10%単位で、データベースに
 * 別のアクターを作成して、そこにメモ欄を記述することで実現できます。
 *
 * <face_actor_hp80:5> # HPが80%以下の場合アクターID[5]のグラフィックを適用
 * <face_actor_hp30:6> # HPが30%以下の場合アクターID[6]のグラフィックを適用
 *
 * 特定のステートが有効になっている場合に、表示する顔グラフィックを
 * 変化させることもできます。同じく別のアクターを作成する必要があります。
 *
 * <face_actor_state5:7> # ステート[5]が有効ならアクターID[7]のグラフィックを適用
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
    var pluginName = 'BattleActorFaceVisibility';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var convertEscapeCharacters = function(text) {
        if (text === null || text === undefined) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var isParamExist = function(paramNames) {
        return getParamOther(paramNames) !== null;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = {};
    param.hideWhenSelectEnemy = getParamBoolean(['HideWhenSelectEnemy', '敵選択中は非表示']);
    param.showWhenSelectActor = getParamBoolean(['ShowWhenSelectActor', '味方選択中は対象表示']);

    //=============================================================================
    // Game_Actor
    //  顔グラフィック表示用のアクターデータを返します。
    //=============================================================================
    Game_Actor.prototype.getFaceActorData = function() {
        return this.getFaceActorDataForState() || this.getFaceActorDataForHpRate() || this;
    };

    Game_Actor.prototype.getFaceActorDataForHpRate = function() {
        var metaObject = this.actor().meta;
        for (var i = 1; i <= 10; i++) {
            var customActorId = metaObject['face_actor_hp' + String(i * 10)];
            if (customActorId && this.hpRate() <= (i / 10)) {
                return $gameActors.actor(customActorId);
            }
        }
        return null;
    };

    Game_Actor.prototype.getFaceActorDataForState = function() {
        var metaObject = this.actor().meta;
        var stateActor = null;
        this.getSortedStates().some(function(stateId) {
            var customActorId = metaObject['face_actor_state' + String(stateId)];
            if (customActorId) {
                stateActor = $gameActors.actor(customActorId);
                return true;
            }
            return false;
        });
        return stateActor;
    };

    Game_Actor.prototype.getSortedStates = function() {
        return this._states.clone().sort(this.compareOrderStateIdPriority.bind(this));
    };

    Game_Actor.prototype.compareOrderStateIdPriority = function(stateIdA, stateIdB) {
        return $dataStates[stateIdB].priority - $dataStates[stateIdA].priority;
    };

    //=============================================================================
    // Scene_Battle
    //  顔グラフィックを表示するウィンドウを追加します。
    //=============================================================================
    var _Scene_Battle_createAllWindows      = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        this.createFaceWindow();
    };

    Scene_Battle.prototype.createFaceWindow = function() {
        var length       = this._windowLayer.children.length, windowIndex = 0;
        this._faceWindow = new Window_Face();
        for (var i = 0; i < length; i++) {
            if (this._windowLayer.children[i] === this._helpWindow) {
                windowIndex = i;
                break;
            }
        }
        this._faceWindow.setEnemyWindow(this._enemyWindow);
        this._faceWindow.setActorWindow(this._actorWindow);
        this._windowLayer.addChildAt(this._faceWindow, windowIndex);
    };

    //=============================================================================
    // Window_Face
    //  顔グラフィックを表示するだけのウィンドウです。
    //=============================================================================
    function Window_Face() {
        this.initialize.apply(this, arguments);
    }

    Window_Face.prototype             = Object.create(Window_Base.prototype);
    Window_Face.prototype.constructor = Window_Face;

    Window_Face.prototype.initialize = function() {
        var width   = 192;
        var height  = Window_Base._faceHeight + this.standardPadding() * 2;
        var paramsX = ['ウィンドウX座標', 'WindowXCustom'];
        var x       = isParamExist(paramsX) ? getParamNumber(paramsX) : 0;
        var paramsY = ['ウィンドウY座標', 'WindowYCustom'];
        var y       = isParamExist(paramsY) ? getParamNumber(paramsY) : Graphics.boxHeight - this.fittingHeight(4) - height;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.hide();
        this.createFaceSprite();
        this.setWindowVisible();
        this._actorId = 0;
    };

    Window_Face.prototype.createFaceSprite = function() {
        var sprite       = new Sprite();
        sprite.x         = this.width / 2;
        sprite.y         = this.height / 2;
        sprite.anchor.x  = 0.5;
        sprite.anchor.y  = 0.5;
        this._faceSprite = sprite;
        this.addChild(this._faceSprite);
    };

    Window_Face.prototype.setEnemyWindow = function(enemyWindow) {
        this._enemyWindow = enemyWindow;
    };

    Window_Face.prototype.setActorWindow = function(actorWindow) {
        this._actorWindow = actorWindow;
    };

    Window_Face.prototype.setWindowVisible = function() {
        if (!getParamBoolean(['WindowVisible', 'ウィンドウ表示'])) {
            this.opacity = 0;
            this._faceSprite.y += this.padding;
        }
    };

    Window_Face.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.updateImage();
        this.updateVisibility();
    };

    Window_Face.prototype.updateImage = function() {
        var actor = this.getRealActor();
        if (actor && this._actorId !== actor.actorId()) {
            this.drawActorFace(actor);
        }
        this._actorId = actor ? actor.actorId() : 0;
    };

    Window_Face.prototype.updateVisibility = function() {
        var visibility = this.isVisible();
        if (visibility !== this.visible) {
            if (visibility) {
                this.show();
            } else {
                this.hide();
            }
        }
    };

    Window_Face.prototype.isVisible = function() {
        return this._actorId !== 0 && !(param.hideWhenSelectEnemy && this._enemyWindow.visible);
    };

    Window_Face.prototype.getRealActor = function() {
        var useActorWindow = this._actorWindow.visible && param.showWhenSelectActor;
        var actor = useActorWindow ? this._actorWindow.actor() : BattleManager.actor();
        return actor ? actor.getFaceActorData() : null;
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
        bitmap.addLoadListener(function() {
            var scale;
            if (getParamBoolean(['縮小表示', 'Reduction'])) {
                scale = Math.min(Window_Base._faceWidth / bitmap.width, Window_Base._faceHeight / bitmap.height, 1.0);
            } else {
                scale = 1.0;
            }
            this._faceSprite.scale.x = scale;
            this._faceSprite.scale.y = scale;
            this._faceSprite.bitmap  = bitmap;
        }.bind(this));
    };

    Window_Face.prototype.drawFace = function(actor) {
        var bitmap = ImageManager.loadFace(actor.faceName());
        bitmap.addLoadListener(function() {
            this._faceSprite.scale.x = 1.0;
            this._faceSprite.scale.y = 1.0;
            this._faceSprite.bitmap  = bitmap;
            var sx                   = actor.faceIndex() % 4 * Window_Base._faceWidth;
            var sy                   = Math.floor(actor.faceIndex() / 4) * Window_Base._faceHeight;
            this._faceSprite.setFrame(sx, sy, Window_Base._faceWidth, Window_Base._faceHeight);
        }.bind(this));
    };

    //=============================================================================
    // ウィンドウを透過して重なり合ったときの表示を自然にします。
    //=============================================================================
    if (getParamBoolean(['ThroughWindow', 'ウィンドウ透過']) && !WindowLayer.throughWindow) {
        WindowLayer.throughWindow = true;
        //=============================================================================
        //  WindowLayer
        //   ウィンドウのマスク処理を除去します。
        //=============================================================================
        WindowLayer.prototype._maskWindow = function(window) {};

        WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {};
    }
})();