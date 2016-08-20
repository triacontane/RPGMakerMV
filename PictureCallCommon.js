//=============================================================================
// PictureCallCommon.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.0 2016/08/20 ピクチャごとに透明色を考慮するかどうかを設定できる機能を追加
//                  プラグインを適用していないセーブデータをロードした場合に発生するエラーを修正
// 1.3.5 2016/04/20 リファクタリングによりピクチャの優先順位が逆転していたのをもとに戻した
// 1.3.4 2016/04/08 ピクチャが隣接する状態でマウスオーバーとマウスアウトが正しく機能しない場合がある問題を修正
// 1.3.3 2016/03/19 トリガー条件を満たした場合に以後のタッチ処理を抑制するパラメータを追加
// 1.3.2 2016/02/28 処理の負荷を少し軽減
// 1.3.1 2016/02/21 トリガーにマウスを押したまま移動を追加
// 1.3.0 2016/01/24 ピクチャをなでなでする機能を追加
//                  トリガーにマウスムーブを追加
//                  ピクチャが回転しているときに正しく位置を補足できるよう修正
// 1.2.1 2016/01/21 呼び出すコモンイベントの上限を100から1000（DB上の最大値）に修正
//                  競合対策（YEP_MessageCore.js）
// 1.2.0 2016/01/14 ホイールクリック、ダブルクリックなどトリガーを10種類に拡充
// 1.1.3 2016/01/02 競合対策（TDDP_BindPicturesToMap.js）
// 1.1.2 2015/12/20 長押しイベント発生時に1秒間のインターバルを設定するよう仕様変更
// 1.1.1 2015/12/10 ピクチャを消去後にマウスオーバーするとエラーになる現象を修正
// 1.1.0 2015/11/23 コモンイベントを呼び出した対象のピクチャ番号を特定する機能を追加
//                  設定で透明色を考慮する機能を追加
//                  トリガーとして「右クリック」や「長押し」を追加
// 1.0.0 2015/11/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc ピクチャのボタン化プラグイン
 * @author トリアコンタン
 *
 * @param 透明色を考慮
 * @desc クリックされた箇所が透明色だった場合は、クリックを無効にする。
 * @default OFF
 *
 * @param ピクチャ番号の変数番号
 * @desc コモンイベント呼び出し時にピクチャ番号を格納するゲーム変数の番号。
 * @default 0
 *
 * @param ポインタX座標の変数番号
 * @desc マウスカーソルもしくはタッチした位置のX座標を常に格納するゲーム変数の番号
 * @default 0
 *
 * @param ポインタY座標の変数番号
 * @desc マウスカーソルもしくはタッチした位置のY座標を常に格納するゲーム変数の番号
 * @default 0
 *
 * @param タッチ操作抑制
 * @desc トリガー条件を満たした際にタッチ情報をクリアします。(ON/OFF)
 * 他のタッチ操作と動作が重複する場合にONにします。
 * @default OFF
 *
 * @help ピクチャをクリックすると、指定したコモンイベントが
 * 呼び出されるようになるプラグインコマンドを提供します。
 * このプラグインを利用すれば、JavaScriptの知識がなくても
 * 誰でも簡単にクリックやタッチを主体にしたゲームを作れます。
 *
 * 注意！
 * 一度関連づけたピクチャとコモンイベントはピクチャを消去しても有効です。
 * ピクチャが存在しなければどこをクリックしても反応しませんが、
 * 同じ番号で再度、ピクチャの表示を行うと反応するようになります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （引数の間は半角スペースで区切る）
 *
 *  ピクチャのボタン化 or
 *  P_CALL_CE [ピクチャ番号] [コモンイベントID] [トリガー] [透明色を考慮]:
 *      ピクチャの領域内でトリガー条件を満たした場合に呼び出されるコモンイベントを関連づけます。
 *  　　トリガーは以下の通りです。(省略すると 1 になります)
 *      1  : クリックした場合
 *      2  : 右クリックした場合
 *      3  : 長押しした場合
 *      4  : マウスをピクチャに重ねた場合
 *      5  : マウスをピクチャから放した場合
 *      6  : クリックを解放（リリース）した場合
 *      7  : クリックした場合（かつ長押しの際の繰り返しを考慮）
 *      8  : クリックしている間ずっと
 *      9  : ホイールクリックした場合（PCの場合のみ有効）
 *      10 : ダブルクリックした場合
 *      11 : マウスをピクチャ内で移動した場合
 *      12 : マウスを押しつつピクチャ内で移動した場合
 *
 *      透明色を考慮のパラメータ(ON/OFF)を指定するとピクチャごとに透明色を考慮するかを
 *      設定できます。何も設定しないとプラグインパラメータの設定が適用されます。(従来の仕様)
 *
 *  例：P_CALL_CE 1 3 7 ON
 *  　：ピクチャのボタン化 \v[1] \v[2] \v[3] OFF
 *
 *  ピクチャのボタン化解除 or
 *  P_CALL_CE_REMOVE [ピクチャ番号] :
 *      ピクチャとコモンイベントの関連づけを解除します。
 *      全てのトリガーが削除対象です。
 *
 *  例：P_CALL_CE_REMOVE 1
 *  　：ピクチャのボタン化解除 \v[1]
 *
 *  ピクチャのなでなで設定 or
 *  P_STROKE [ピクチャ番号] [変数番号]
 *  　　指定したピクチャの上でマウスやタッチを動かすと、
 *  　　速さに応じた値が指定した変数に値が加算されるようになります。
 *  　　この設定はピクチャを差し替えたり、一時的に非表示にしても有効です。
 *  　　10秒でだいたい1000くらいまで溜まります。
 *
 *  例：P_STROKE 1 2
 *  　：ピクチャのなでなで設定 \v[1] \v[2] \v[3]
 *
 *  ピクチャのなでなで解除 or
 *  P_STROKE_REMOVE [ピクチャ番号]
 *  　　指定したピクチャのなでなで設定を解除します。
 *
 *  例：P_STROKE_REMOVE 1
 *  　：ピクチャのなでなで解除 \v[1]
 *
 *  ピクチャのポインタ化 or
 *  P_POINTER [ピクチャ番号]
 *  　　指定したピクチャがタッチ座標を自動で追従するようになります。
 *  　　タッチしていないと自動で非表示になります。
 *
 *  例：P_POINTER 1
 *  　：ピクチャのポインタ化 \v[1]
 *
 *  ピクチャのポインタ化解除 or
 *  P_POINTER_REMOVE [ピクチャ番号]
 *  　　指定したピクチャのポインタ化を解除します。
 *
 *  例：P_POINTER_REMOVE 1
 *  　：ピクチャのポインタ化解除 \v[1]
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
/*:
 * @plugindesc Clickable picture plugin
 * @author triacontane
 *
 * @param TransparentConsideration
 * @desc if click position is transparent, click is disabled.
 * @default OFF
 *
 * @param GameVariablePictureNum
 * @desc Game variable number that stores the picture number when common event called.
 * @default 0
 *
 * @param GameVariableTouchX
 * @desc Game variable number that stores touch x position
 * @default 0
 *
 * @param GameVariableTouchY
 * @desc Game variable number that stores touch y position
 * @default 0
 *
 * @param SuppressTouch
 * @desc Suppress touch event for others(ON/OFF)
 * @default OFF
 * 
 * @help When clicked picture, call common event.
 *
 * Plugin Command
 *
 *  P_CALL_CE [Picture number] [Common event ID] [Trigger] [TransparentConsideration]:
 *      When picture was clicked, assign common event id.
 *  　　Trigger are As below(if omit, It is specified to 1)
 *      1  : Left click
 *      2  : Right click
 *      3  : Long click
 *      4  : Mouse over
 *      5  : Mouse out
 *      6  : Mouse release
 *      7  : Mouse repeat click
 *      8  : Mouse press
 *      9  : Wheel click
 *      10 : Double click
 *      11 : Mouse move
 *      12 : Mouse move and press
 *
 *  P_CALL_CE_REMOVE [Picture number] :
 *      break relation from picture to common event.
 *
 *  This plugin is released under the MIT License.
 */
(function() {
    'use strict';
    var pluginName = 'PictureCallCommon';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
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

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON';
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    if (!Object.prototype.hasOwnProperty('iterate')) {
        Object.defineProperty(Object.prototype, 'iterate', {
            value: function(handler) {
                Object.keys(this).forEach(function(key, index) {
                    handler.call(this, key, this[key], index);
                }, this);
            }
        });
    }

    //=============================================================================
    // パラメータの取得とバリデーション
    //=============================================================================
    var paramGameVariableTouchX       = getParamNumber(['GameVariableTouchX', 'ポインタX座標の変数番号'], 0, 5000);
    var paramGameVariableTouchY       = getParamNumber(['GameVariableTouchY', 'ポインタY座標の変数番号'], 0, 5000);
    var paramGameVariablePictNum      = getParamNumber(['GameVariablePictureNum', 'ピクチャ番号の変数番号'], 0, 5000);
    var paramTransparentConsideration = getParamBoolean(['TransparentConsideration', '透明色を考慮']);
    var paramSuppressTouch            = getParamBoolean(['SuppressTouch', 'タッチ操作抑制']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[P_CALL_CE]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        var pictureId, commonId, trigger, variableNum, transparent;
        switch (getCommandName(command)) {
            case 'P_CALL_CE' :
            case 'ピクチャのボタン化':
                pictureId   = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                commonId    = getArgNumber(args[1], 1, $dataCommonEvents.length - 1);
                trigger     = getArgNumber(args[2], 1, 12);
                transparent = (args.length > 3 ? getArgBoolean(args[3]) : null);
                $gameScreen.setPictureCallCommon(pictureId, commonId, trigger, transparent);
                break;
            case 'P_CALL_CE_REMOVE' :
            case 'ピクチャのボタン化解除':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.setPictureRemoveCommon(pictureId);
                break;
            case 'P_STROKE' :
            case 'ピクチャのなでなで設定':
                pictureId   = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                variableNum = getArgNumber(args[1], 1, $dataSystem.variables.length - 1);
                $gameScreen.setPictureStroke(pictureId, variableNum);
                break;
            case 'P_STROKE_REMOVE' :
            case 'ピクチャのなでなで解除':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.removePictureStroke(pictureId);
                break;
            case 'P_POINTER' :
            case 'ピクチャのポインタ化':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.setPicturePointer(pictureId);
                break;
            case 'P_POINTER_REMOVE' :
            case 'ピクチャのポインタ化解除':
                pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
                $gameScreen.removePicturePointer(pictureId);
                break;
        }
    };

    //=============================================================================
    // Game_Temp
    //  呼び出し予定のコモンイベントIDのフィールドを追加定義します。
    //=============================================================================
    var _Game_Temp_initialize      = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this.clearPictureCallInfo();
    };

    Game_Temp.prototype.clearPictureCallInfo = function() {
        this.setPictureCallInfo(0, 0);
    };

    Game_Temp.prototype.setPictureCallInfo = function(pictureCommonId, pictureNum) {
        this._pictureCommonId = pictureCommonId;
        this._pictureNum      = pictureNum;
    };

    Game_Temp.prototype.pictureCommonId = function() {
        return this._pictureCommonId;
    };

    Game_Temp.prototype.pictureNum = function() {
        return this._pictureNum;
    };

    //=============================================================================
    // Game_Map
    //  ピクチャがタッチされたときのコモンイベント呼び出し処理を追加定義します。
    //=============================================================================
    var _Game_Map_setupStartingEvent      = Game_Map.prototype.setupStartingEvent;
    Game_Map.prototype.setupStartingEvent = function() {
        var result = _Game_Map_setupStartingEvent.call(this);
        return result || this.setupPictureCommonEvent();
    };

    Game_Map.prototype.setupPictureCommonEvent = function() {
        var commonId = $gameTemp._pictureCommonId;
        var event    = $dataCommonEvents[commonId];
        var result   = false;
        if (commonId > 0 && !this.isEventRunning() && event) {
            if (paramGameVariablePictNum)
                $gameVariables._data[paramGameVariablePictNum] = $gameTemp.pictureNum();
            this._interpreter.setup(event.list);
            result = true;
        }
        $gameTemp.clearPictureCallInfo();
        return result;
    };

    //=============================================================================
    // Game_Troop
    //  ピクチャがタッチされたときのコモンイベント呼び出し処理を追加定義します。
    //=============================================================================
    Game_Troop.prototype.setupPictureCommonEvent = function() {
        var commonId = $gameTemp.pictureCommonId();
        var event    = $dataCommonEvents[commonId];
        if (commonId > 0 && !this.isEventRunning() && event) {
            if (paramGameVariablePictNum)
                $gameVariables._data[paramGameVariablePictNum] = $gameTemp.pictureNum();
            this._interpreter.setup(event.list);
        }
        $gameTemp.clearPictureCallInfo();
    };

    //=============================================================================
    // Game_Screen
    //  ピクチャに対応するコモンイベント呼び出し用のID配列を追加定義します。
    //=============================================================================
    var _Game_Screen_initialize      = Game_Screen.prototype.initialize;
    Game_Screen.prototype.initialize = function() {
        _Game_Screen_initialize.apply(this, arguments);
        this.initPictureArray();
    };

    Game_Screen.prototype.initPictureArray = function() {
        this._pictureCidArray = [];
        this._pictureSidArray = [];
        this._picturePidArray = [];
        this._pictureTransparentArray = [];
    };

    Game_Screen.prototype.isPreparePictureArray = function() {
        return !!this._pictureCidArray && !!this._pictureSidArray && !!this._picturePidArray;
    };

    var _Game_Screen_update      = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function() {
        _Game_Screen_update.apply(this, arguments);
        this.updatePointer();
    };

    Game_Screen.prototype.updatePointer = function() {
        if (paramGameVariableTouchX)
            $gameVariables._data[paramGameVariableTouchX] = TouchInput.x;
        if (paramGameVariableTouchY)
            $gameVariables._data[paramGameVariableTouchY] = TouchInput.y;
    };

    Game_Screen.prototype.setPictureCallCommon = function(pictureId, commonId, trigger, transparent) {
        var realPictureId = this.realPictureId(pictureId);
        if (this._pictureCidArray[realPictureId] == null) this._pictureCidArray[realPictureId] = [];
        this._pictureCidArray[realPictureId][trigger] = commonId;
        this._pictureTransparentArray[realPictureId] = transparent;
    };

    Game_Screen.prototype.setPictureRemoveCommon = function(pictureId) {
        var realPictureId                    = this.realPictureId(pictureId);
        this._pictureCidArray[realPictureId] = [];
    };

    Game_Screen.prototype.setPictureStroke = function(pictureId, variableNum) {
        var realPictureId                    = this.realPictureId(pictureId);
        this._pictureSidArray[realPictureId] = variableNum;
    };

    Game_Screen.prototype.removePictureStroke = function(pictureId) {
        var realPictureId                    = this.realPictureId(pictureId);
        this._pictureSidArray[realPictureId] = null;
    };

    Game_Screen.prototype.setPicturePointer = function(pictureId) {
        var realPictureId                    = this.realPictureId(pictureId);
        this._picturePidArray[realPictureId] = true;
    };

    Game_Screen.prototype.removePicturePointer = function(pictureId) {
        var realPictureId                    = this.realPictureId(pictureId);
        this._picturePidArray[realPictureId] = null;
    };

    Game_Screen.prototype.getPictureCid = function(pictureId) {
        var realPictureId = this.realPictureId(pictureId);
        if (!this.isPreparePictureArray()) this.initPictureArray();
        return this._pictureCidArray[realPictureId];
    };

    Game_Screen.prototype.getPictureSid = function(pictureId) {
        var realPictureId = this.realPictureId(pictureId);
        if (!this.isPreparePictureArray()) this.initPictureArray();
        return this._pictureSidArray[realPictureId];
    };

    Game_Screen.prototype.getPicturePid = function(pictureId) {
        var realPictureId = this.realPictureId(pictureId);
        if (!this.isPreparePictureArray()) this.initPictureArray();
        return this._picturePidArray[realPictureId];
    };

    Game_Screen.prototype.getPictureTransparent = function(pictureId) {
        var realPictureId = this.realPictureId(pictureId);
        if (!this.isPreparePictureArray()) this.initPictureArray();
        return this._pictureTransparentArray[realPictureId];
    };

    //=============================================================================
    // Scene_Map
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    var _Scene_Map_update      = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        if (!$gameMap.isEventRunning()) this.updateTouchPictures();
        _Scene_Map_update.apply(this, arguments);
    };

    Scene_Map.prototype.updateTouchPictures = function() {
        this._spriteset.callTouchPictures();
    };

    //=============================================================================
    // Scene_Battle
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    var _Scene_Battle_update      = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        this.updateTouchPictures();
        $gameTroop.setupPictureCommonEvent();
        _Scene_Battle_update.apply(this, arguments);
    };

    Scene_Battle.prototype.updateTouchPictures = function() {
        this._spriteset.callTouchPictures();
    };

    //=============================================================================
    // Spriteset_Base
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    Spriteset_Base.prototype.callTouchPictures = function() {
        var containerChildren = this._pictureContainer.children;
        if (!Array.isArray(containerChildren)) {
            this._pictureContainer.iterate(function(property) {
                if (this._pictureContainer[property].hasOwnProperty('children')) {
                    containerChildren = this._pictureContainer[property].children;
                    this._callTouchPicturesSub(containerChildren);
                }
            }.bind(this));
        } else {
            this._callTouchPicturesSub(containerChildren);
        }
    };

    Spriteset_Base.prototype._callTouchPicturesSub = function(containerChildren) {
        for (var i = containerChildren.length - 1; i >= 0; i--) {
            var picture = containerChildren[i];
            if (typeof picture.callTouch === 'function') picture.callTouch();
            if ($gameTemp.pictureCommonId() > 0) break;
        }
    };

    //=============================================================================
    // Sprite_Picture
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    var _Sprite_Picture_initialize      = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        _Sprite_Picture_initialize.call(this, pictureId);
        this._triggerHandler     = [];
        this._triggerHandler[1]  = this.isTriggered;
        this._triggerHandler[2]  = this.isCancelled;
        this._triggerHandler[3]  = this.isLongPressed;
        this._triggerHandler[4]  = this.isOnFocus;
        this._triggerHandler[5]  = this.isOutFocus;
        this._triggerHandler[6]  = this.isReleased;
        this._triggerHandler[7]  = this.isRepeated;
        this._triggerHandler[8]  = this.isPressed;
        this._triggerHandler[9]  = this.isWheelTriggered;
        this._triggerHandler[10] = this.isDoubleTriggered;
        this._triggerHandler[11] = this.isMoved;
        this._triggerHandler[12] = this.isMovedAndPressed;
        this._onMouse            = false;
        this._outMouse           = false;
        this._wasOnMouse         = false;
    };

    var _Sprite_update              = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_update.apply(this, arguments);
        this.updateMouseMove();
        this.updateStroke();
        this.updatePointer();
    };

    Sprite_Picture.prototype.updateMouseMove = function() {
        if (this.isTouchable() && this.isTouchPosInRect() && !this.isTransparent()) {
            if (!this._wasOnMouse) {
                this._onMouse    = true;
                this._wasOnMouse = true;
            }
        } else {
            if (this._wasOnMouse) {
                this._outMouse   = true;
                this._wasOnMouse = false;
            }
        }
    };

    Sprite_Picture.prototype.updateStroke = function() {
        var strokeNum = $gameScreen.getPictureSid(this._pictureId);
        if (strokeNum > 0 && TouchInput.isPressed()) {
            var value = $gameVariables.value(strokeNum);
            $gameVariables.setValue(strokeNum, value + TouchInput.pressedDistance);
        }
    };

    Sprite_Picture.prototype.updatePointer = function() {
        var strokeNum = $gameScreen.getPicturePid(this._pictureId);
        if (strokeNum > 0) {
            this.opacity  = TouchInput.isPressed() ? 255 : 0;
            this.x        = TouchInput.x;
            this.y        = TouchInput.y;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    };

    Sprite_Picture.prototype.callTouch = function() {
        var commandIds = $gameScreen.getPictureCid(this._pictureId);
        if (!commandIds) return;
        for (var i = 0, n = this._triggerHandler.length; i < n; i++) {
            var handler = this._triggerHandler[i];
            if (handler && commandIds[i] && handler.call(this) && (i === 5 || i === 4 || !this.isTransparent())) {
                if (paramSuppressTouch) TouchInput.suppressEvents();
                if (i === 3) TouchInput._pressedTime = -60;
                if (i === 4) this._onMouse = false;
                if (i === 5) this._outMouse = false;
                $gameTemp.setPictureCallInfo(commandIds[i], this._pictureId);
            }
        }
    };

    Sprite_Picture.prototype.isTransparent = function() {
        if (!this.isValidTransparent()) return false;
        var dx  = TouchInput.x - this.x;
        var dy  = TouchInput.y - this.y;
        var sin = Math.sin(-this.rotation);
        var cos = Math.cos(-this.rotation);
        var bx  = Math.floor(dx * cos + dy * -sin) / this.scale.x + this.anchor.x * this.width;
        var by  = Math.floor(dx * sin + dy * cos) / this.scale.y + this.anchor.y * this.height;
        return this.bitmap.getAlphaPixel(bx, by) === 0;
    };

    Sprite_Picture.prototype.isValidTransparent = function() {
        var transparent = $gameScreen.getPictureTransparent(this._pictureId);
        return transparent !== null ? transparent : paramTransparentConsideration;
    };

    Sprite_Picture.prototype.screenWidth = function() {
        return (this.width || 0) * this.scale.x;
    };

    Sprite_Picture.prototype.screenHeight = function() {
        return (this.height || 0) * this.scale.y;
    };

    Sprite_Picture.prototype.screenX = function() {
        return (this.x || 0) - this.anchor.x * this.screenWidth();
    };

    Sprite_Picture.prototype.screenY = function() {
        return (this.y || 0) - this.anchor.y * this.screenHeight();
    };

    Sprite_Picture.prototype.minX = function() {
        return Math.min(this.screenX(), this.screenX() + this.screenWidth());
    };

    Sprite_Picture.prototype.minY = function() {
        return Math.min(this.screenY(), this.screenY() + this.screenHeight());
    };

    Sprite_Picture.prototype.maxX = function() {
        return Math.max(this.screenX(), this.screenX() + this.screenWidth());
    };

    Sprite_Picture.prototype.maxY = function() {
        return Math.max(this.screenY(), this.screenY() + this.screenHeight());
    };

    Sprite_Picture.prototype.isTouchPosInRect = function() {
        var dx  = TouchInput.x - this.x;
        var dy  = TouchInput.y - this.y;
        var sin = Math.sin(-this.rotation);
        var cos = Math.cos(-this.rotation);
        var rx  = this.x + Math.floor(dx * cos + dy * -sin);
        var ry  = this.y + Math.floor(dx * sin + dy * cos);
        return (rx >= this.minX() && rx <= this.maxX() &&
        ry >= this.minY() && ry <= this.maxY());
    };

    Sprite_Picture.prototype.isTouchable = function() {
        return this.bitmap && this.visible && this.scale.x !== 0 && this.scale.y !== 0;
    };

    Sprite_Picture.prototype.isTriggered = function() {
        return this.isTouchEvent(TouchInput.isTriggered);
    };

    Sprite_Picture.prototype.isCancelled = function() {
        return this.isTouchEvent(TouchInput.isCancelled);
    };

    Sprite_Picture.prototype.isLongPressed = function() {
        return this.isTouchEvent(TouchInput.isLongPressed);
    };

    Sprite_Picture.prototype.isPressed = function() {
        return this.isTouchEvent(TouchInput.isPressed);
    };

    Sprite_Picture.prototype.isReleased = function() {
        return this.isTouchEvent(TouchInput.isReleased);
    };

    Sprite_Picture.prototype.isRepeated = function() {
        return this.isTouchEvent(TouchInput.isRepeated);
    };

    Sprite_Picture.prototype.isOnFocus = function() {
        return this._onMouse;
    };

    Sprite_Picture.prototype.isOutFocus = function() {
        return this._outMouse;
    };

    Sprite_Picture.prototype.isMoved = function() {
        return this.isTouchEvent(TouchInput.isMoved);
    };

    Sprite_Picture.prototype.isMovedAndPressed = function() {
        return this.isTouchEvent(TouchInput.isMoved) && TouchInput.isPressed();
    };

    Sprite_Picture.prototype.isWheelTriggered = function() {
        return this.isTouchEvent(TouchInput.isWheelTriggered);
    };

    Sprite_Picture.prototype.isDoubleTriggered = function() {
        return this.isTouchEvent(TouchInput.isDoubleTriggered);
    };

    Sprite_Picture.prototype.isTouchEvent = function(triggerFunc) {
        return this.isTouchable() && triggerFunc.call(TouchInput) && this.isTouchPosInRect();
    };

    //=============================================================================
    // TouchInput
    //  ホイールクリック、ダブルクリック等を実装
    //=============================================================================
    TouchInput.keyDoubleClickInterval = 300;
    TouchInput._pressedDistance       = 0;
    TouchInput._prevX                 = -1;
    TouchInput._prevY                 = -1;

    Object.defineProperty(TouchInput, 'pressedDistance', {
        get         : function() {
            return this._pressedDistance;
        },
        configurable: true
    });

    TouchInput.suppressEvents = function() {
        this._triggered       = false;
        this._cancelled       = false;
        this._released        = false;
        this._wheelTriggered  = false;
        this._doubleTriggered = false;
    };

    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };

    var _TouchInput_clear = TouchInput.clear;
    TouchInput.clear      = function() {
        _TouchInput_clear.apply(this, arguments);
        this._events.wheelTriggered  = false;
        this._events.doubleTriggered = false;
    };

    var _TouchInput_update = TouchInput.update;
    TouchInput.update      = function() {
        _TouchInput_update.apply(this, arguments);
        this._wheelTriggered         = this._events.wheelTriggered;
        this._doubleTriggered        = this._events.doubleTriggered;
        this._events.wheelTriggered  = false;
        this._events.doubleTriggered = false;
    };

    TouchInput.isWheelTriggered = function() {
        return this._wheelTriggered;
    };

    TouchInput.isDoubleTriggered = function() {
        return this._doubleTriggered;
    };

    var _TouchInput_onMiddleButtonDown = TouchInput._onMiddleButtonDown;
    TouchInput._onMiddleButtonDown     = function(event) {
        _TouchInput_onMiddleButtonDown.apply(this, arguments);
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._onWheelTrigger(x, y);
        }
    };

    TouchInput._onWheelTrigger = function(x, y) {
        this._events.wheelTriggered = true;
        this._x                     = x;
        this._y                     = y;
    };

    var _TouchInput_onTrigger = TouchInput._onTrigger;
    TouchInput._onTrigger     = function(x, y) {
        if (this._date && Date.now() - this._date < this.keyDoubleClickInterval)
            this._events.doubleTriggered = true;
        this._pressedDistance = 0;
        this._prevX           = x;
        this._prevY           = y;
        _TouchInput_onTrigger.apply(this, arguments);
    };

    var _TouchInput_onMove = TouchInput._onMove;
    TouchInput._onMove     = function(x, y) {
        if (this.isPressed()) this._pressedDistance = Math.abs(this._prevX - x) + Math.abs(this._prevY - y);
        this._prevX = x;
        this._prevY = y;
        _TouchInput_onMove.apply(this, arguments);
    };

    var _TouchInput_onRelease = TouchInput._onRelease;
    TouchInput._onRelease     = function(x, y) {
        this._pressedDistance = 0;
        this._prevX           = x;
        this._prevY           = y;
        _TouchInput_onRelease.apply(this, arguments);
    };
})();