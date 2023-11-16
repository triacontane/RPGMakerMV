//=============================================================================
// PictureCallCommon.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.6.0 2023/11/16 プラグインコマンドを「ピクチャの操作拡張プラグイン」が提供する一括指定機能に対応させました。
// 1.5.1 2023/06/12 ピクチャイベント解除時に指定した番号以外の番号のピクチャイベントも一緒に解除される可能性がある問題を修正
// 1.5.0 2023/04/22 ピクチャイベントを発生させる際、透過部分に反応するかどうかを設定できる機能を追加
// 1.4.0 2022/10/22 DTextPicture.jsと組み合わせたとき、フレームウィンドウをクリックイベントの範囲に含めるよう変更
// 1.3.1 2022/05/19 ヘルプ微修正
// 1.3.0 2022/04/14 ピクチャクリック時に変数を操作する機能および任意スクリプトを実行する機能を追加
// 1.2.2 2021/11/07 異なるピクチャのトリガーを同一フレームで同時に満たした場合、すべてのタッチ処理が実行されるよう修正
// 1.2.1 2021/10/08 トリガー種別がマウスが重なった場合のとき無効スイッチ中に条件を満たしていると、無効スイッチがOFFになった瞬間にイベントが発生してしまう問題を修正
// 1.2.0 2021/05/20 APNGピクチャプラグインと組み合わせたときにAPNGピクチャをボタン化できるよう修正（ただし透過色は考慮されない）
// 1.1.2 2021/04/08 トリガー「マウスをピクチャ内で移動した場合」がマウスを押していないと反応しない問題を修正
// 1.1.1 2020/12/21 スクリプト$gameScreen.showPictureを使って未キャッシュのピクチャを表示しようとすると画像が表示されなくなる問題を修正
//                  セーブデータロード時にエラーになる問題を修正
// 1.1.0 2020/12/20 イベントごとに無効スイッチを指定できる機能を追加
// 1.0.0 2020/12/17 MZ版として新規作成
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ピクチャのボタン化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PictureCallCommon.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param PictureIdVariable
 * @text ピクチャ番号の変数
 * @desc 最後にイベントが発生したピクチャ番号を格納する変数IDです。
 * @default 0
 * @type variable
 *
 * @param InvalidSwitchId
 * @text 無効スイッチ
 * @desc 指定した番号のスイッチがONになっている場合、すべてのピクチャイベントが無効になります。
 * @default 0
 * @type switch
 * 
 * @param FlickDistance
 * @text フリック有効距離
 * @desc フリック判定が有効になる距離(ピクセル数)です。
 * @default 60
 * @type number
 * 
 * @param FlickTimeVariable
 * @text フリック時間の変数
 * @desc フリック判定が有効になるまでに掛かったフレーム数を格納する変数IDです。この値が小さいほど速いフリックです。
 * @default 0
 * @type variable
 *
 * @param FlickDegreeVariable
 * @text フリック角度の変数
 * @desc フリック判定が有効になったときのフリック方向を度数法で格納する変数IDです。
 * @default 0
 * @type variable
 *
 * @command ADD_PICTURE_EVENT
 * @text ピクチャイベント登録
 * @desc ピクチャ操作で発生するイベントを登録します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 操作対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @arg commonEventId
 * @text コモンイベント番号
 * @desc イベント発生時に呼び出すコモンイベントです。
 * @default 0
 * @type common_event
 *
 * @arg switchId
 * @text スイッチ番号
 * @desc イベント発生時にONになるスイッチです。
 * @default 0
 * @type switch
 *
 * @arg variableId
 * @text 変数番号
 * @desc イベント発生時に値が加減される変数です。
 * @default 0
 * @type variable
 *
 * @arg operationType
 * @parent variableId
 * @text 操作種別
 * @desc イベント発生時に指定した変数の操作種別です。
 * @default 0
 * @type select
 * @option 代入
 * @value 0
 * @option 加算
 * @value 1
 * @option 減算
 * @value 2
 * @option 乗算
 * @value 3
 * @option 除算
 * @value 4
 * @option 剰余
 * @value 5
 *
 * @arg operand
 * @parent variableId
 * @text オペランド
 * @desc イベント発生時に指定した変数の操作値です。
 * @default 0
 * @type number
 * @min -99999999
 *
 * @arg script
 * @text スクリプト
 * @desc イベント発生時に実行されるスクリプトです。
 * @type multiline_string
 *
 * @arg buttonBind
 * @text ボタンバインド
 * @desc イベント発生時に押したことになるボタンです。
 * @default
 * @type combo
 * @option ok
 * @option shift
 * @option control
 * @option escape
 * @option left
 * @option up
 * @option right
 * @option down
 * @option pageup
 * @option pagedown
 *
 * @arg triggerType
 * @text トリガー種別
 * @desc トリガーとなるマウス、タッチ操作の種別です。
 * @default 1
 * @type select
 * @option 1:クリックした場合
 * @value 1
 * @option 2:右クリックした場合
 * @value 2
 * @option 3:長押しした場合
 * @value 3
 * @option 4:マウスをピクチャに重ねた場合
 * @value 4
 * @option 5:マウスをピクチャから放した場合
 * @value 5
 * @option 6:クリックを解放（リリース）した場合
 * @value 6
 * @option 7:クリックした場合（かつ長押しの際の繰り返しを考慮）
 * @value 7
 * @option 8:クリックしている間ずっと
 * @value 8
 * @option 9:ホイールクリックした場合（PCの場合のみ有効）
 * @value 9
 * @option 10:ダブルクリックした場合
 * @value 10
 * @option 11:マウスをピクチャ内で移動した場合
 * @value 11
 * @option 12:マウスを押しつつピクチャ内で移動した場合
 * @value 12
 * @option 13:フリック(マウス押下状態で指定距離以上動かす)した場合
 * @value 13
 *
 * @arg invalidSwitchId
 * @text 無効スイッチ
 * @desc 指定した番号のスイッチがONになっている場合、ピクチャイベントが無効になります。
 * @default 0
 * @type switch
 *
 * @command SET_PICTURE_PREFERENCE
 * @text ピクチャ設定
 * @desc　ピクチャイベントの設定を変更します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 変更対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @arg includeOpacityZero
 * @text 透過部分も含む
 * @desc ピクチャの透明部分にも反応するかどうかです。
 * @default false
 * @type boolean
 *
 * @command REMOVE_PICTURE_EVENT
 * @text ピクチャイベント解除
 * @desc 登録したピクチャイベントを解除します。
 *
 * @arg pictureId
 * @text ピクチャ番号
 * @desc 操作対象のピクチャ番号です。
 * @default 1
 * @type number
 *
 * @help PictureCallCommon.js
 *
 * ピクチャに対する様々なマウス操作に反応してコモンイベント実行や
 * スイッチ制御ができます。（これをピクチャイベントと呼びます）
 * 一度登録したピクチャイベントはピクチャを消去しても有効です。
 * 解除は専用のプラグインコマンドから可能です。
 *
 * 各マウス操作について、ピクチャの透明部分には反応しません。
 *
 * ピクチャイベントはマップ画面でも戦闘画面でも
 * 他のイベントや状況の制限を受けずに速やかに並列実行されます。
 * また、ピクチャイベントが発生した瞬間のフレームでは他のクリック処理は
 * 無効となりタッチによるマップ移動やメッセージ送り等は行われません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'ADD_PICTURE_EVENT', args => {
        if ($gameScreen.iteratePictures) {
            $gameScreen.iteratePictures($gameScreen.addPictureEvent, [args.pictureId, args.triggerType, args]);
        } else {
            $gameScreen.addPictureEvent(args.pictureId, args.triggerType, args);
        }
    });

    PluginManagerEx.registerCommand(script, 'REMOVE_PICTURE_EVENT', args => {
        if ($gameScreen.iteratePictures) {
            $gameScreen.iteratePictures($gameScreen.removePictureEvent, [args.pictureId]);
        } else {
            $gameScreen.removePictureEvent(args.pictureId);
        }
    });

    PluginManagerEx.registerCommand(script, 'SET_PICTURE_PREFERENCE', args => {
        if ($gameScreen.iteratePictures) {
            $gameScreen.iteratePictures($gameScreen.setPicturePreference, [args.pictureId, args]);
        } else {
            $gameScreen.setPicturePreference(args.pictureId, args);
        }
    });

    //=============================================================================
    // Game_System
    //  ロード時にピクチャ関連メンバを初期化します。
    //=============================================================================
    const _Game_System_onAfterLoad    = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        $gameScreen.initPictureEventMap();
    };

    //=============================================================================
    // Game_Screen
    //  ピクチャに対応するコモンイベント呼び出し用のID配列を追加定義します。
    //=============================================================================
    const _Game_Screen_initialize    = Game_Screen.prototype.initialize;
    Game_Screen.prototype.initialize = function() {
        _Game_Screen_initialize.apply(this, arguments);
        this.initPictureEventMap();
    };

    Game_Screen.prototype.initPictureEventMap = function() {
        if (!this._pictureEventMap) {
            this._pictureEventMap = new Game_PictureEventMap();
        }
    };

    Game_Screen.prototype.addPictureEvent = function(pictureId, trigger, param) {
        const realPictureId = this.realPictureId(pictureId);
        this._pictureEventMap.append(realPictureId, trigger, param);
    };

    Game_Screen.prototype.removePictureEvent = function(pictureId, trigger = null) {
        const realPictureId = this.realPictureId(pictureId);
        if (trigger === null) {
            this._pictureEventMap.removeById(realPictureId);
        } else {
            this._pictureEventMap.remove(realPictureId, trigger);
        }
    };

    Game_Screen.prototype.findPictureEvent = function(pictureId, trigger) {
        const realPictureId = this.realPictureId(pictureId);
        return this._pictureEventMap.find(realPictureId, trigger);
    };

    Game_Screen.prototype.setPicturePreference = function(pictureId, param) {
        const realPictureId = this.realPictureId(pictureId);
        this._pictureEventMap.setPreference(realPictureId, param);
    };

    Game_Screen.prototype.getPicturePreference = function(pictureId) {
        const realPictureId = this.realPictureId(pictureId);
        return this._pictureEventMap.getPreference(realPictureId);
    }

    Game_Screen.prototype.disConvertPositionX = function(x) {
        const unshiftX = x - this.zoomX() * (1 - this.zoomScale());
        return Math.round(unshiftX / this.zoomScale());
    };

    Game_Screen.prototype.disConvertPositionY = function(y) {
        const unshiftY = y - this.zoomY() * (1 - this.zoomScale());
        return Math.round(unshiftY / this.zoomScale());
    };

    Game_Troop.prototype.setupDynamicCommon      = Game_Map.prototype.setupDynamicCommon;
    Game_Troop.prototype.setupDynamicInterpreter = Game_Map.prototype.setupDynamicInterpreter;

    const _Game_Troop_setup    = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.apply(this, arguments);
        if (!this._dynamicEvents) {
            this._dynamicEvents = [];
        }
    };

    Game_Troop.prototype.updateDynamicEvents = function() {
        this._dynamicEvents.forEach(interpreter => interpreter.update());
    };

    if (!Scene_Battle.prototype.hasOwnProperty('updateDynamicEvents')) {
        const _Scene_Battle_updateBattleProcess    = Scene_Battle.prototype.updateBattleProcess;
        Scene_Battle.prototype.updateBattleProcess = function() {
            _Scene_Battle_updateBattleProcess.apply(this, arguments);
            this.updateDynamicEvents();
        };

        Scene_Battle.prototype.updateDynamicEvents = function() {
            $gameTroop.updateDynamicEvents();
        };
    }

    /**
     * Game_PictureEventMap
     * ピクチャイベントの登録状態を管理するマップです。
     */
    class Game_PictureEventMap {
        constructor() {
            this._map = {}
            this._preference = {};
        }

        append(pictureId, trigger, option) {
            this._map[this.generateKey(pictureId, trigger)] = option;
        }

        find(pictureId, trigger) {
            return this._map[this.generateKey(pictureId, trigger)];
        }

        remove(pictureId, trigger) {
            delete this._map[this.generateKey(pictureId, trigger)];
        }

        removeById(pictureId) {
            const regExp = new RegExp(`^${pictureId}\:`);
            Object.keys(this._map).forEach(key => {
                if (key.match(regExp)) {
                    delete this._map[key];
                }
            });
        }

        generateKey(pictureId, trigger) {
            return `${pictureId}:${trigger}`;
        }

        setPreference(pictureId, option) {
            this._preference[pictureId] = option;
        }

        getPreference(pictureId) {
            return this._preference[pictureId];
        }
    }
    window.Game_PictureEventMap = Game_PictureEventMap;

    //=============================================================================
    // Sprite_Picture
    //  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
    //=============================================================================
    const _Sprite_Picture_initialize    = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        _Sprite_Picture_initialize.call(this, pictureId);
        this._touch = new PictureTouch(this, pictureId);
    };

    const _Sprite_update            = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_update.apply(this, arguments);
        if (this.picture() && this._touch && !$gameSwitches.value(param.InvalidSwitchId)) {
            this._touch.update();
        }
    };

    const _Spriteset_Base_update = Spriteset_Base.prototype.update;
    Spriteset_Base.prototype.update = function() {
        _Spriteset_Base_update.apply(this, arguments);
        TouchInput.suppressIfNeed();
    };

    /**
     * PictureTouch
     * ピクチャのタッチ状態を管理します。
     */
    class PictureTouch {
        constructor(picture, id) {
            this._picture      = picture;
            this._pictureId    = id;
            this._handlers     = [];
            this._handlers[1]  = () => this.isTouchEvent(TouchInput.isTriggered);
            this._handlers[2]  = () => this.isTouchEvent(TouchInput.isCancelled);
            this._handlers[3]  = () => this.isTouchEvent(TouchInput.isLongPressed);
            this._handlers[4]  = () => this._onMouse;
            this._handlers[5]  = () => this._outMouse;
            this._handlers[6]  = () => this.isTouchEvent(TouchInput.isReleased);
            this._handlers[7]  = () => this.isTouchEvent(TouchInput.isRepeated);
            this._handlers[8]  = () => this.isTouchEvent(TouchInput.isPressed);
            this._handlers[9]  = () => this.isTouchEvent(TouchInput.isWheelTriggered);
            this._handlers[10] = () => this.isTouchEvent(TouchInput.isDoubleTriggered);
            this._handlers[11] = () => this.isTouchEvent(TouchInput.isHovered);
            this._handlers[12] = () => this.isTouchEvent(TouchInput.isMoved);
            this._handlers[13] = () => this._flick;
            this._onMouse      = false;
            this._outMouse     = false;
            this._wasOnMouse   = false;
            this._flick        = false;
            this._interpreter  = new Game_Interpreter();
        }

        update() {
            this.updateFlick();
            this.updatePictureTouch();
            this.updateMouseMove();
        }

        updatePictureTouch() {
            if (SceneManager.isNextScene(Scene_Battle)) {
                return;
            }
            this._handlers.forEach((handler, trigger) => {
                if (this.isValidTrigger(handler, trigger)) {
                    const eventData = this.findPictureEvent(this._pictureId, trigger);
                    this.fireTouchEvent(eventData, trigger);
                }
            });
        }

        updateMouseMove() {
            if (this.isOnPicturePos()) {
                if (!this._wasOnMouse) {
                    this._outMouse   = false;
                    this._onMouse    = true;
                    this._wasOnMouse = true;
                }
            } else if (this._wasOnMouse) {
                this._outMouse   = true;
                this._wasOnMouse = false;
                this._onMouse    = false;
            }
        }

        updateFlick() {
            this._flick = false;
            const data  = TouchInput.createFlickData();
            if (!data) {
                return;
            }
            if (data.distance >= param.FlickDistance && this.isOnPicturePos(data.start.x, data.start.y)) {
                this._flick = true;
                if (param.FlickTimeVariable) {
                    $gameVariables.setValue(param.FlickTimeVariable, data.time);
                }
                if (param.FlickDegreeVariable) {
                    $gameVariables.setValue(param.FlickDegreeVariable, data.degree);
                }
            }
        }

        isValidTrigger(handler, trigger) {
            const eventData = this.findPictureEvent(this._pictureId, trigger);
            return  eventData && !$gameSwitches.value(eventData.invalidSwitchId) &&
                handler && handler.call(this);
        }

        findPictureEvent(pictureId, trigger) {
            return $gameScreen.findPictureEvent(pictureId, trigger);
        }

        fireTouchEvent(eventData, trigger) {
            TouchInput.requestSuppress();
            if (trigger === 3) {
                TouchInput._pressedTime = -60;
            }
            if (trigger === 4) {
                this._onMouse = false;
            }
            if (trigger === 5) {
                this._outMouse = false;
            }
            this.applyTouchEvent(eventData);
        }

        applyTouchEvent(eventData) {
            if (eventData.switchId) {
                $gameSwitches.setValue(eventData.switchId, true);
            }
            if (eventData.variableId) {
                this._interpreter.operateVariable(eventData.variableId, eventData.operationType, eventData.operand);
            }
            if (eventData.script) {
                try {
                    eval(eventData.script);
                } catch (e) {
                    console.error('Error Script:' + eventData.script);
                    PluginManagerEx.throwError(e.message, script);
                }
            }
            if (eventData.buttonBind) {
                Input.bindKeyState(eventData.buttonBind);
            }
            if (eventData.commonEventId) {
                if ($gameParty.inBattle()) {
                    $gameTroop.setupDynamicCommon(eventData.commonEventId);
                } else {
                    $gameMap.setupDynamicCommon(eventData.commonEventId);
                }
            }
            if (param.PictureIdVariable > 0) {
                $gameVariables.setValue(param.PictureIdVariable, this._pictureId);
            }
        }

        isOnPicturePos(x = TouchInput.x, y = TouchInput.y) {
            const pic = this._picture;
            if (!pic.bitmap || !pic.bitmap.isReady() || pic.scale.x === 0 || pic.scale.y === 0) {
                return false;
            }
            if (this.isTouchPosInFrameWindow(x, y)) {
                return true;
            }
            const dx  = this.getTouchScreenX(x) - pic.x;
            const dy  = this.getTouchScreenY(y) - pic.y;
            const sin = Math.sin(-pic.rotation);
            const cos = Math.cos(-pic.rotation);
            const bx = Math.floor(dx * cos + dy * -sin) / pic.scale.x + pic.anchor.x * pic.width;
            const by = Math.floor(dx * sin + dy * cos) / pic.scale.y + pic.anchor.y * pic.height;
            const preference = $gameScreen.getPicturePreference(this._pictureId);
            if (pic._apngSprite || preference?.includeOpacityZero) {
                return bx >= 0 && by >= 0 && bx <= pic.bitmap.width && by <= pic.bitmap.height;
            }
            return pic.bitmap.getAlphaPixel(bx, by) !== 0;
        }

        // for DTextPicture.js
        isTouchPosInFrameWindow(x, y) {
            if (!this._picture._frameWindow) {
                return false;
            }
            const frame = this._picture._frameWindow;
            const sx    = this.getTouchScreenX(x);
            const sy    = this.getTouchScreenY(y);
            return frame.x <= sx && frame.x + frame.width >= sx &&
                frame.y <= sy && frame.y + frame.height >= sy;
        }

        isTouchEvent(triggerFunc) {
            return triggerFunc.call(TouchInput) && this.isOnPicturePos();
        }

        getTouchScreenX(x) {
            return $gameScreen.disConvertPositionX(x);
        }

        getTouchScreenY(y) {
            return $gameScreen.disConvertPositionY(y);
        }
    }

    //=============================================================================
    // Input
    //  ピクチャクリックをキー入力に紐付けます。
    //=============================================================================
    Input._bindKeyStateFrames = new Map();
    Input.bindKeyState        = function(name) {
        this._currentState[name] = true;
        this._bindKeyStateFrames.set(name, 5);
    };

    const _Input_update = Input.update;
    Input.update        = function() {
        _Input_update.apply(this, arguments);
        this._updateBindKeyState();
    };

    Input._updateBindKeyState = function() {
        this._bindKeyStateFrames.forEach(function(frame, keyName) {
            frame--;
            if (frame === 0 || !this._currentState[keyName]) {
                this._currentState[keyName] = false;
                this._bindKeyStateFrames.delete(keyName);
            } else {
                this._bindKeyStateFrames.set(keyName, frame);
            }
        }, this);
    };

    //=============================================================================
    // TouchInput
    //  ホイールクリック、ダブルクリック等を実装
    //=============================================================================
    const _TouchInput__createNewState = TouchInput._createNewState;
    TouchInput._createNewState        = function() {
        const state           = _TouchInput__createNewState.apply(this, arguments);
        state.wheelTriggered  = false;
        state.doubleTriggered = false;
        return state;
    };

    TouchInput.requestSuppress = function() {
        this._requestSuppress = true;
    };

    TouchInput.suppressIfNeed = function() {
        if (this._requestSuppress) {
            this._currentState = this._createNewState();
            this._requestSuppress = false;
        }
    };

    TouchInput.isWheelTriggered = function() {
        return this._currentState.wheelTriggered;
    };

    TouchInput.isDoubleTriggered = function() {
        return this._currentState.doubleTriggered;
    };

    TouchInput.createFlickData = function() {
        if (!this.isPressed()) {
            return null;
        }
        const data    = {}
        const dx      = this._x - this._triggerX;
        const dy      = this._y - this._triggerY;
        data.distance = Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
        data.time     = this._pressedTime;
        data.degree   = Math.round((Math.atan2(dy, -dx) + Math.PI) * 180 / Math.PI);
        data.start    = new Point(this._triggerX, this._triggerY);
        data.end      = new Point(this._x, this._y);
        return data;
    };

    const _TouchInput_onMiddleButtonDown = TouchInput._onMiddleButtonDown;
    TouchInput._onMiddleButtonDown       = function(event) {
        _TouchInput_onMiddleButtonDown.apply(this, arguments);
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._newState.wheelTriggered = true;
        }
    };

    const _TouchInput_onTrigger = TouchInput._onTrigger;
    TouchInput._onTrigger       = function(x, y) {
        const prevDate = this._date;
        _TouchInput_onTrigger.apply(this, arguments);
        if (this._date - prevDate < 300) {
            this._newState.doubleTriggered = true;
        }
    };
})();
