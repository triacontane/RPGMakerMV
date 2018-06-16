//=============================================================================
// MessageSkip.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.11.0 2018/06/16 オート及びスキップの機能を一時的に無効化するスイッチを追加
// 1.10.1 2018/05/07 オートモードで途中に「\!」が含まれる場合の待機フレームが正しく計算されない問題を修正
// 1.10.0 2018/05/01 スキップモードとオートモードをスイッチで自動制御できる機能を追加
// 1.9.0 2018/02/18 イベント終了時にオート、スキップを解除するかどうかを任意のスイッチで判定できるように仕様変更
// 1.8.0 2018/02/16 オート待機フレーム数の計算式にウィンドウに表示した文字数を組み込める機能を追加
// 1.7.0 2017/12/12 SkipAlreadyReadMessage.jsとの連携したときに当プラグインのスキップ機能が既読スキップになるよう修正
//                  スキップピクチャの条件スイッチが0(指定なし)のときに同ピクチャが表示されない問題を修正
// 1.6.1 2017/09/21 オートモード時 改ページを伴わない入力待ちの後のメッセージを一瞬でスキップする問題を修正(by DarkPlasmaさん)
// 1.6.0 2017/08/03 キーを押している間だけスキップが有効にできる機能を追加
// 1.5.0 2017/05/27 オートおよびスキップボタンの原点指定と表示可否を変更できるスイッチの機能を追加
// 1.4.0 2017/05/26 クリックでオートおよびスキップを切り替えるボタンを追加
// 1.3.1 2017/05/13 アイコンの量を増やしたときにオートとスキップのアイコンが正常に表示されない問題を修正
// 1.3.0 2017/05/05 スキップ中はメッセージのウェイトを無視するよう修正
// 1.2.0 2017/04/29 並列実行のイベントでも通常イベントが実行中でなければスキップを解除するよう修正
//                  キーコードの「右」と「上」が逆になっていた問題を修正
//                  オート待機フレームを制御文字を使って動的に変更できる機能を追加
// 1.1.0 2016/12/14 並列処理イベントが実行されている場合にスキップが効かなくなる問題を修正
// 1.0.1 2016/02/15 モバイル端末での動作が遅くなる不具合を修正
// 1.0.0 2016/01/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MessageSkipPlugin
 * @author triacontane
 *
 * @param SkipKey
 * @desc メッセージスキップに該当するキー
 * (キーのアルファベット/shift/control/tab)
 * @default S
 * @type select
 * @option shift
 * @option control
 * @option tab
 * @option S
 *
 * @param AutoKey
 * @desc メッセージオートに該当するキー
 * (キーのアルファベット/shift/control/tab)
 * @default A
 * @type select
 * @option shift
 * @option control
 * @option tab
 * @option A
 *
 * @param SkipSwitchId
 * @desc 指定した番号のスイッチがONになっている場合は常にスキップします。
 * @default 0
 * @type switch
 *
 * @param AutoSwitchIId
 * @desc 指定した番号のスイッチがONになっている場合は常にオートします。スキップが優先されます。
 * @default 0
 * @type switch
 *
 * @param SkipIcon
 * @desc メッセージスキップ中にウィンドウ右下に表示されるアイコン
 * @default 140
 * @type number
 *
 * @param AutoIcon
 * @desc メッセージオート中にウィンドウ右下に表示されるアイコン
 * @default 75
 * @type number
 *
 * @param PressingSkip
 * @desc スキップの判定が指定のキーを押している間のみになります。
 * @default false
 * @type boolean
 *
 * @param AutoWaitFrame
 * @desc オートモードが有効の場合にメッセージを表示しておくフレーム数。制御文字\v[n]および計算式が指定できます。
 * @default 100 + textSize * 10
 *
 * @param ResetOnEndSwitch
 * @desc 指定した番号のスイッチがONのとき、イベント終了時にスキップ、オート状態を解除します。0の場合は常に解除します。
 * @default 0
 * @type switch
 *
 * @param SkipPicture
 * @desc ウィンドウ内に表示するスキップピクチャのファイル名です。クリックするとスキップモードになります。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param PictureAnchor
 * @desc スキップ、オートの各ピクチャボタン座標の原点です。（0:左上、1:右上、2:左下、3:右下）
 * @default 0
 * @type select
 * @option 0
 * @option 1
 * @option 2
 * @option 3
 *
 * @param PictureSwitchId
 * @desc 指定した番号のスイッチがONのときのみスキップ、オートの各ピクチャボタンを表示します。0の場合は無条件で表示します。
 * @default 0
 * @type switch
 *
 * @param SkipPictureX
 * @desc ウィンドウ内に表示するスキップピクチャのX座標です。
 * @default 500
 * @type number
 *
 * @param SkipPictureY
 * @desc ウィンドウ内に表示するスキップピクチャのY座標です。
 * @default 0
 * @type number
 *
 * @param AutoPicture
 * @desc ウィンドウ内に表示するオートピクチャのファイル名です。クリックするとオートモードになります。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param AutoPictureX
 * @desc ウィンドウ内に表示するオートピクチャのX座標です。
 * @default 750
 * @type number
 *
 * @param AutoPictureY
 * @desc ウィンドウ内に表示するオートピクチャのY座標です。
 * @default 0
 * @type number
 *
 * @param InvalidSwitchId
 * @desc 指定したスイッチがONのときプラグインの全機能が無効になります。
 * @default 0
 * @type switch
 *
 * @help メッセージウィンドウでメッセージのスキップやオートモードの切替ができます。
 * イベントが終了すると自働でスキップやオートモードは解除されます。
 * 並列実行イベントは、通常イベントが実行中でない場合のみ解除されます。
 * 明示的に解除したい場合は、以下のスクリプトを実行してください。
 *
 * $gameMessage.clearSkipInfo();
 *
 * ・SkipAlreadyReadMessage.jsとの連携
 * SkipAlreadyReadMessage.js（奏ねこま様作）と併用したときに
 * 当プラグインのスキップ機能は「既読スキップ」機能になります。
 * http://makonet.sakura.ne.jp/rpg_tkool/
 *
 * ・パラメータ「オート待機フレーム」を設定するとオートモード時の待機フレームを変更できます。
 * 制御文字\v[n]のほか、JavaScript計算式が使えます。
 * さらにtextSizeで表示文字数を計算式に組み込むことができます。
 *
 * 指定例：
 * 100 + textSize * 10
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */

/*:ja
 * @plugindesc メッセージスキッププラグイン
 * @author トリアコンタン
 *
 * @param スキップキー
 * @desc メッセージスキップに該当するキー
 * (キーのアルファベット/shift/control/tab)
 * @default S
 * @type select
 * @option shift
 * @option control
 * @option tab
 * @option S
 *
 * @param オートキー
 * @desc メッセージオートに該当するキー
 * (キーのアルファベット/shift/control/tab)
 * @default A
 * @type select
 * @option shift
 * @option control
 * @option tab
 * @option A
 *
 * @param スキップスイッチ
 * @desc 指定した番号のスイッチがONになっている場合は常にスキップします。
 * @default 0
 * @type switch
 *
 * @param オートスイッチ
 * @desc 指定した番号のスイッチがONになっている場合は常にオートします。スキップが優先されます。
 * @default 0
 * @type switch
 *
 * @param スキップアイコン
 * @desc メッセージスキップ中にウィンドウ右下に表示されるアイコン
 * @default 140
 * @type number
 *
 * @param オートアイコン
 * @desc メッセージオート中にウィンドウ右下に表示されるアイコン
 * @default 75
 * @type number
 *
 * @param 押し続けスキップ
 * @desc スキップの判定が指定のキーを押している間のみになります。
 * @default false
 * @type boolean
 *
 * @param オート待機フレーム
 * @desc オートモードが有効の場合にメッセージを表示しておくフレーム数。制御文字\v[n]および計算式が指定できます。
 * @default 100 + textSize * 10
 *
 * @param 終了解除スイッチID
 * @desc 指定した番号のスイッチがONのとき、イベント終了時にスキップ、オート状態を解除します。0の場合は常に解除します。
 * @default 0
 * @type switch
 *
 * @param スキップピクチャ
 * @desc ウィンドウ内に表示するスキップピクチャのファイル名です。クリックするとスキップモードになります。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param ボタン原点
 * @desc スキップ、オートの各ピクチャボタン座標の原点です。（0:左上、1:右上、2:左下、3:右下）
 * @default 0
 * @type select
 * @option 0
 * @option 1
 * @option 2
 * @option 3
 *
 * @param ボタン表示スイッチID
 * @desc 指定した番号のスイッチがONのときのみスキップ、オートの各ピクチャボタンを表示します。0の場合は無条件で表示します。
 * @default 0
 * @type switch
 *
 * @param スキップピクチャX
 * @desc ウィンドウ内に表示するスキップピクチャのX座標です。
 * @default 500
 * @type number
 *
 * @param スキップピクチャY
 * @desc ウィンドウ内に表示するスキップピクチャのY座標です。
 * @default 0
 * @type number
 *
 * @param オートピクチャ
 * @desc ウィンドウ内に表示するオートピクチャのファイル名です。クリックするとオートモードになります。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param オートピクチャX
 * @desc ウィンドウ内に表示するオートピクチャのX座標です。
 * @default 750
 * @type number
 *
 * @param オートピクチャY
 * @desc ウィンドウ内に表示するオートピクチャのY座標です。
 * @default 0
 * @type number
 *
 * @param 無効化スイッチ
 * @desc 指定したスイッチがONのときプラグインの全機能が無効になります。
 * @default 0
 * @type switch
 *
 * @help メッセージウィンドウでメッセージのスキップやオートモードの切替ができます。
 * イベントが終了すると自働でスキップやオートモードは解除されます。
 * 並列実行イベントは、通常イベントが実行中でない場合のみ解除されます。
 * 明示的に解除したい場合は、以下のスクリプトを実行してください。
 *
 * $gameMessage.clearSkipInfo();
 *
 * ・SkipAlreadyReadMessage.jsとの連携
 * SkipAlreadyReadMessage.js（奏ねこま様作）と併用したときに
 * 当プラグインのスキップ機能は「既読スキップ」機能になります。
 * http://makonet.sakura.ne.jp/rpg_tkool/
 *
 * ・パラメータ「オート待機フレーム」を設定するとオートモード時の待機フレームを変更できます。
 * 制御文字\v[n]のほか、JavaScript計算式が使えます。
 * さらにtextSizeで表示文字数を計算式に組み込むことができます。
 *
 * 指定例：
 * 100 + textSize * 10
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/**
 * メッセージボタンスプライト
 * @constructor
 */
function Sprite_MessageButton() {
    this.initialize.apply(this, arguments);
}

/**
 * アイコン描画用スプライト
 * @constructor
 */
function Sprite_Frame() {
    this.initialize.apply(this, arguments);
}

(function() {
    'use strict';
    var pluginName = 'MessageSkip';

    var getParamString = function(paramNames, upperFlg) {
        var value = getParamOther(paramNames);
        return value === null ? '' : upperFlg ? value.toUpperCase() : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON' || value.toUpperCase() === 'TRUE';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    Number.prototype.times = function(handler) {
        var i = 0;
        while (i < this) handler.call(this, i++);
    };

    Input.keyCodeReverseMapper = {
        a        : 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71,
        h        : 72, i: 73, j: 74, k: 75, l: 76, m: 77, n: 78,
        o        : 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85,
        v        : 86, w: 87, x: 88, y: 89, z: 90,
        backspace: 8, tab: 9, enter: 13, shift: 16, ctrl: 17, alt: 18, pause: 19, esc: 27, space: 32,
        page_up  : 33, page_down: 34, end: 35, home: 36, left: 37, right: 39, up: 38, down: 40, insert: 45, delete: 46
    };
    (9).times(function(i) {
        Input.keyCodeReverseMapper[i] = i + 48;
    });
    (12).times(function(i) {
        Input.keyCodeReverseMapper['f' + (i + 1)] = i + 112;
    });

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var skipKeyName = getParamString(['SkipKey', 'スキップキー']).toLowerCase();
    var skipKeyCode = Input.keyCodeReverseMapper[skipKeyName];
    var autoKeyName = getParamString(['AutoKey', 'オートキー']).toLowerCase();
    var autoKeyCode = Input.keyCodeReverseMapper[autoKeyName];
    if (skipKeyCode) {
        if (!Input.keyMapper[skipKeyCode]) {
            Input.keyMapper[skipKeyCode] = 'messageSkip';
        } else {
            skipKeyName = Input.keyMapper[skipKeyCode];
        }
    }
    if (autoKeyCode) {
        if (!Input.keyMapper[autoKeyCode]) {
            Input.keyMapper[autoKeyCode] = 'messageAuto';
        } else {
            autoKeyName = Input.keyMapper[autoKeyCode];
        }
    }
    var paramSkipPicture     = getParamString(['SkipPicture', 'スキップピクチャ']);
    var paramSkipPictureX    = getParamNumber(['SkipPictureX', 'スキップピクチャX']);
    var paramSkipPictureY    = getParamNumber(['SkipPictureY', 'スキップピクチャY']);
    var paramAutoPicture     = getParamString(['AutoPicture', 'オートピクチャ']);
    var paramAutoPictureX    = getParamNumber(['AutoPictureX', 'オートピクチャX']);
    var paramAutoPictureY    = getParamNumber(['AutoPictureY', 'オートピクチャY']);
    var paramPictureAnchor   = getParamNumber(['PictureAnchor', 'ボタン原点']);
    var paramPictureSwitchId = getParamNumber(['PictureSwitchId', 'ボタン表示スイッチID'], 0);
    var paramPressingSkip    = getParamBoolean(['PressingSkip', '押し続けスキップ']);
    var paramSkipSwitchId    = getParamNumber(['SkipSwitchId', 'スキップスイッチ'], 0);
    var paramAutoSwitchIId   = getParamNumber(['AutoSwitchIId', 'オートスイッチ'], 0);
    var paramInvalidSwitchId = getParamNumber(['InvalidSwitchId', '無効化スイッチ'], 0);

    //=============================================================================
    // Game_Message
    //  メッセージスキップ情報を保持します。
    //=============================================================================
    var _Game_Message_initialize      = Game_Message.prototype.initialize;
    Game_Message.prototype.initialize = function() {
        _Game_Message_initialize.apply(this, arguments);
        this.clearSkipInfo();
        this._autoClearSkipSwitch = getParamNumber(['ResetOnEndSwitch', '終了解除スイッチID']);
    };

    Game_Message.prototype.toggleSkip = function() {
        this.setSkipFlg(!this._skipFlg);
    };

    Game_Message.prototype.toggleAuto = function() {
        this.setAutoFlg(!this._autoFlg);
    };

    Game_Message.prototype.skipFlg = function() {
        return this._skipFlg;
    };

    Game_Message.prototype.autoFlg = function() {
        return this._autoFlg;
    };

    Game_Message.prototype.setSkipFlg = function(value) {
        this._skipFlg = value;
        if (this._skipFlg) this._autoFlg = false;
    };

    Game_Message.prototype.setAutoFlg = function(value) {
        if (!this._skipFlg) {
            this._autoFlg = value;
        }
    };

    Game_Message.prototype.clearSkipInfo = function() {
        this._skipFlg = false;
        this._autoFlg = false;
    };

    Game_Message.prototype.terminateEvent = function() {
        if (!this._autoClearSkipSwitch || $gameSwitches.value(this._autoClearSkipSwitch)) {
            this.clearSkipInfo();
        }
    };

    //=============================================================================
    // Game_Interpreter
    //  マップイベント終了時にメッセージスキップフラグを初期化します。
    //=============================================================================
    var _Game_Interpreter_terminate      = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        _Game_Interpreter_terminate.apply(this, arguments);
        if (this.isNeedClearSkip()) {
            $gameMessage.terminateEvent();
        }
    };

    Game_Interpreter.prototype.isNeedClearSkip = function() {
        return ($gameMap.isMapInterpreterOf(this) || !$gameMap.isEventRunning()) && this._depth === 0;
    };

    //=============================================================================
    // Game_Map
    //  指定されたインタプリタがマップイベントかどうかを返します。
    //=============================================================================
    Game_Map.prototype.isMapInterpreterOf = function(interpreter) {
        return this._interpreter === interpreter;
    };

    //=============================================================================
    // Window_Message
    //  メッセージスキップ状態を描画します。
    //=============================================================================
    var _Window_Message_initialize      = Window_Message.prototype.initialize;
    Window_Message.prototype.initialize = function() {
        _Window_Message_initialize.apply(this, arguments);
        this.createSpriteFrame();
        this.createSpriteSkipButton();
        this.createSpriteAutoButton();
    };

    Window_Message.prototype.createSpriteFrame = function() {
        this._icon   = new Sprite_Frame(ImageManager.loadSystem('IconSet'), -1);
        this._icon.x = this.width - this._icon.width;
        this._icon.y = this.height - this._icon.height;
        this.addChild(this._icon);
    };

    Window_Message.prototype.createSpriteSkipButton = function() {
        if (!paramSkipPicture) return;
        this._skipButton = new Sprite_MessageButton(paramSkipPicture);
        this.addChild(this._skipButton);
    };

    Window_Message.prototype.createSpriteAutoButton = function() {
        if (!paramAutoPicture) return;
        this._autoButton = new Sprite_MessageButton(paramAutoPicture);
        this.addChild(this._autoButton);
    };

    Window_Message.prototype.getRelativeButtonX = function(originalX) {
        if (paramPictureAnchor === 1 || paramPictureAnchor === 3) {
            originalX += this.width;
        }
        return originalX;
    };

    Window_Message.prototype.getRelativeButtonY = function(originalY) {
        if (paramPictureAnchor === 2 || paramPictureAnchor === 3) {
            originalY += this.height;
        }
        return originalY;
    };

    var _Window_Message_startMessage      = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.apply(this, arguments);
        this.initializeMessageAutoCount();
    };

    Window_Message.prototype.initializeMessageAutoCount = function() {
        var textSize = 0;
        if (this._textState) {
            var index = this._textState.index;
            var text  = this._textState.text;
            while (text[index] && !(text[index] === '\x1b' && text[index + 1] === '!')) {
                index++;
            }
            // use in eval
            textSize = index - this._textState.index;
        }
        var paramValue         = convertEscapeCharacters(getParamString(['AutoWaitFrame', 'オート待機フレーム'])) || 1;
        this._messageAutoCount = eval(paramValue);
    };

    var _Window_Message_update      = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        this.updateAutoIcon();
        return _Window_Message_update.apply(this, arguments);
    };

    var _Window_Message_updatePlacement      = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.apply(this, arguments);
        if (this._skipButton) {
            this.updateSkipButtonPlacement();
        }
        if (this._autoButton) {
            this.updateAutoButtonPlacement();
        }
    };

    Window_Message.prototype.updateSkipButtonPlacement = function() {
        var x = this.getRelativeButtonX(paramSkipPictureX);
        var y = this.getRelativeButtonY(paramSkipPictureY);
        this._skipButton.move(x, y);
    };

    Window_Message.prototype.updateAutoButtonPlacement = function() {
        var x = this.getRelativeButtonX(paramAutoPictureX);
        var y = this.getRelativeButtonY(paramAutoPictureY);
        this._autoButton.move(x, y);
    };

    Window_Message.prototype.updateAutoIcon = function() {
        if (this.messageSkip() && this.openness === 255) {
            this._icon.refresh(getParamNumber(['SkipIcon', 'スキップアイコン']));
            this._icon.flashSpeed = 16;
            this._icon.flash      = true;
        } else if (this.messageAuto() && this.openness === 255) {
            this._icon.refresh(getParamNumber(['AutoIcon', 'オートアイコン']));
            this._icon.flashSpeed = 2;
            this._icon.flash      = true;
        } else {
            this._icon.refresh(0);
            this._icon.flash = false;
        }
    };

    var _Window_Message_updateWait      = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        this.updateSkipAuto();
        if (this.messageSkip()) {
            this._waitCount = 0;
        }
        return _Window_Message_updateWait.apply(this, arguments);
    };

    Window_Message.prototype.updateSkipAuto = function() {
        if (this.isClosed()) return;
        if (this.isAnySubWindowActive()) {
            $gameMessage.clearSkipInfo();
        } else {
            this.setSkipAutoFlagByTrigger();
            this.setSkipAutoFlagBySwitch();
        }
        this.updateSkipForSkipAlreadyReadMessage();
    };

    Window_Message.prototype.setSkipAutoFlagByTrigger = function() {
        if (!paramPressingSkip && this.isTriggeredMessageSkip()) {
            $gameMessage.toggleSkip();
        } else if (this.isTriggeredMessageAuto()) {
            $gameMessage.toggleAuto();
        } else if (paramPressingSkip) {
            $gameMessage.setSkipFlg(this.isPressedMessageSkip());
        }
    };

    Window_Message.prototype.setSkipAutoFlagBySwitch = function() {
        if (paramInvalidSwitchId > 0 && $gameSwitches.value(paramInvalidSwitchId)) {
            $gameMessage.setSkipFlg(false);
            $gameMessage.setAutoFlg(false);
            return;
        }
        if (paramSkipSwitchId > 0) {
            $gameMessage.setSkipFlg($gameSwitches.value(paramSkipSwitchId));
        }
        if (paramAutoSwitchIId > 0) {
            $gameMessage.setAutoFlg($gameSwitches.value(paramAutoSwitchIId));
        }
    };

    // for SkipAlreadyReadMessage.js
    Window_Message.prototype.updateSkipForSkipAlreadyReadMessage = function() {
        var pluginName = 'SkipAlreadyReadMessage';
        if ($gameMessage[pluginName] && !$gameMessage[pluginName].already_read) {
            $gameMessage.setSkipFlg(false);
        }
    };

    Window_Message.prototype.messageAuto = function() {
        return $gameMessage.autoFlg();
    };

    Window_Message.prototype.messageSkip = function() {
        return $gameMessage.skipFlg();
    };

    var _Window_Message_updateInput      = Window_Message.prototype.updateInput;
    Window_Message.prototype.updateInput = function() {
        if (this.messageAuto() && this._messageAutoCount > 0 && this.visible) this._messageAutoCount--;
        return _Window_Message_updateInput.apply(this, arguments);
    };

    Window_Message.prototype.isTriggeredMessageSkip = function() {
        return Input.isTriggered('messageSkip') || Input.isTriggered(skipKeyName) || this.isTriggeredMessageSkipButton(false);
    };

    Window_Message.prototype.isPressedMessageSkip = function() {
        return Input.isPressed('messageSkip') || Input.isPressed(skipKeyName) || this.isTriggeredMessageSkipButton(true);
    };

    Window_Message.prototype.isTriggeredMessageSkipButton = function(pressed) {
        return this._skipButton &&
            this._skipButton.isTriggered(this.canvasToLocalX(TouchInput.x), this.canvasToLocalY(TouchInput.y), pressed);
    };

    Window_Message.prototype.isTriggeredMessageAuto = function() {
        return Input.isTriggered('messageAuto') || Input.isTriggered(autoKeyName) || this.isTriggeredMessageAutoButton();
    };

    Window_Message.prototype.isTriggeredMessageAutoButton = function() {
        return this._autoButton &&
            this._autoButton.isTriggered(this.canvasToLocalX(TouchInput.x), this.canvasToLocalY(TouchInput.y));
    };

    var _Window_Message_isTriggered      = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        if (this.isTriggeredMessageSkipButton() || this.isTriggeredMessageAutoButton()) {
            return false;
        }
        if (this.messageAuto() && this._messageAutoCount <= 0) {
            this.initializeMessageAutoCount();
            return true;
        }
        return _Window_Message_isTriggered.apply(this, arguments) || this.messageSkip();
    };

    var _Window_Message_startPause      = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(this, arguments);
        if (this.messageSkip()) this.startWait(2);
    };

    //=============================================================================
    // Sprite_MessageButton
    //  メッセージボタン描画用スプライトです。
    //=============================================================================
    Sprite_MessageButton.prototype             = Object.create(Sprite.prototype);
    Sprite_MessageButton.prototype.constructor = Sprite_MessageButton;

    Sprite_MessageButton.prototype.initialize = function(fileName) {
        Sprite.prototype.initialize.call(this);
        this.bitmap   = ImageManager.loadPicture(fileName);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.visible  = false;
    };

    Sprite_MessageButton.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateOpacity();
        this.updateVisibility();
    };

    Sprite_MessageButton.prototype.updateOpacity = function() {
        this.opacity = this.parent.openness;
    };

    Sprite_MessageButton.prototype.updateVisibility = function() {
        if (paramInvalidSwitchId > 0 && $gameSwitches.value(paramInvalidSwitchId)) {
            this.visible = false;
            return;
        }
        this.visible = (!paramPictureSwitchId || $gameSwitches.value(paramPictureSwitchId));
    };

    Sprite_MessageButton.prototype.isTriggered = function(targetX, targetY, pressed) {
        var realX       = targetX + this._frame.width * this.anchor.x;
        var realY       = targetY + this._frame.height * this.anchor.y;
        var triggeredOk = (pressed ? TouchInput.isPressed() : TouchInput.isTriggered());
        return triggeredOk && this.isInSprite(realX, realY);
    };

    Sprite_MessageButton.prototype.isInSprite = function(targetX, targetY) {
        return this.x <= targetX && this.x + this._frame.width >= targetX &&
            this.y <= targetY && this.y + this._frame.height >= targetY;
    };

    //=============================================================================
    // Sprite_Frame
    //  アイコン描画用スプライトです。
    //=============================================================================
    Sprite_Frame.prototype             = Object.create(Sprite.prototype);
    Sprite_Frame.prototype.constructor = Sprite_Frame;

    Sprite_Frame.prototype.initialize = function(bitmap, index) {
        Sprite.prototype.initialize.call(this);
        bitmap.addLoadListener(function() {
            this._column = Math.floor(bitmap.width / Window_Base._iconWidth);
            this._row    = Math.floor(bitmap.height / Window_Base._iconHeight);
        }.bind(this));
        this.bitmap      = bitmap;
        this.anchor.x    = 0.5;
        this.anchor.y    = 0.5;
        this.flash       = false;
        this.flashSpeed  = 2;
        this._flashAlpha = 0;
        this.refresh(index ? index : 0);
    };

    Sprite_Frame.prototype.refresh = function(index) {
        if (!this.bitmap.isReady()) return;
        var w = Window_Base._iconWidth;
        var h = Window_Base._iconHeight;
        this.setFrame((index % this._column) * w, Math.floor(index / this._column) * h, w, h);
    };

    Sprite_Frame.prototype.update = function() {
        if (this.flash) {
            if (this._flashAlpha <= -64) this._flashAlpha = 192;
            this.setBlendColor([255, 255, 255, this._flashAlpha]);
            this._flashAlpha -= this.flashSpeed;
        }
    };
})();

