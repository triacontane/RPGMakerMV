//=============================================================================
// ScreenRotation.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/01/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ScreenRotationPlugin
 * @author triacontane
 *
 * @param ThroughWindow
 * @desc ウィンドウが重なったときに透過表示します。(ON/OFF)
 * 複数のウィンドウ表示中に画面を回転させる場合に表示がおかしくなった場合のみONにしてください。
 * @default OFF
 *
 * @help 画面を自由に回転させることができます。
 * プラグインコマンドから実行してください。速さと対象角度を指定可能です。
 *
 * 回転時は、画面外のキャラクターグラフィックを一時的に非表示にします。
 *
 * 注意！
 * Canvasモードで実行中に回転をずっと続けているとパフォーマンスが低下します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * ・画面の回転を開始します。速さと角度(360度単位)を設定できます。
 * 　角度を設定しなかった場合、ずっと回転を続けます。
 * SR_回転開始 2 90       # 速さ[2]で画面を[90]度回転させます。
 * SR_START_ROTATION 2 90 # 同上
 * SR_回転停止            # 現在の角度で回転を停止します。
 * SR_STOP_ROTATION       # 同上
 * SR_回転リセット        # 回転状態を即座にリセットします。
 * SR_RESET_ROTATION      # 同上
 *
 * ・おまけ機能で画面をズームさせることができます。
 * 　フレーム数を[0]に設定すると、即座に指定した拡大率になります。
 * SR_ズーム開始 300 60 # [60]フレームかけて拡大率を[300]%にします。
 * SR_START_ZOOM 300 60 # 同上
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 画面回転プラグイン
 * @author トリアコンタン
 *
 * @param ウィンドウ透過
 * @desc ウィンドウが重なったときに透過表示します。(ON/OFF)
 * 複数のウィンドウ表示中に画面を回転させる場合に表示がおかしくなった場合のみONにしてください。
 * @default OFF
 *
 * @help 画面を自由に回転させることができます。
 * プラグインコマンドから実行してください。速さと対象角度を指定可能です。
 *
 * 回転時は、画面外のキャラクターグラフィックを一時的に非表示にします。
 *
 * 注意！
 * Canvasモードで実行中に回転をずっと続けているとパフォーマンスが低下します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * ・画面の回転を開始します。速さと角度(360度単位)を設定できます。
 * 　角度を設定しなかった場合、ずっと回転を続けます。
 * SR_回転開始 2 90       # 速さ[2]で画面を[90]度回転させます。
 * SR_START_ROTATION 2 90 # 同上
 * SR_回転停止            # 現在の角度で回転を停止します。
 * SR_STOP_ROTATION       # 同上
 * SR_回転リセット        # 回転状態を即座にリセットします。
 * SR_RESET_ROTATION      # 同上
 *
 * ・おまけ機能で画面をズームさせることができます。
 * 　フレーム数を[0]に設定すると、即座に指定した拡大率になります。
 * SR_ズーム開始 300 60 # [60]フレームかけて拡大率を[300]%にします。
 * SR_START_ZOOM 300 60 # 同上
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'ScreenRotation';
    var metaTagPrefix = 'SR_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON';
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var convertAllArguments = function(args) {
        for (var i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param     = {};
    param.throughWindow = getParamBoolean(['ThroughWindow', 'ウィンドウ透過']);

    var pluginCommandMap = new Map();
    setPluginCommand('回転開始', 'execStartRotation');
    setPluginCommand('START_ROTATION', 'execStartRotation');
    setPluginCommand('回転停止', 'execStopRotation');
    setPluginCommand('STOP_ROTATION', 'execStopRotation');
    setPluginCommand('回転リセット', 'execResetRotation');
    setPluginCommand('RESET_ROTATION', 'execResetRotation');
    setPluginCommand('ズーム開始', 'execStartZoom');
    setPluginCommand('START_ZOOM', 'execStartZoom');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand    = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertAllArguments(args));
        }
    };

    Game_Interpreter.prototype.execStartRotation = function(args) {
        $gameScreen.startRotation(getArgNumber(args[0]), args.length > 1 ? getArgNumber(args[1], 0) : undefined);
    };

    Game_Interpreter.prototype.execStopRotation = function() {
        $gameScreen.stopRotation();
    };

    Game_Interpreter.prototype.execResetRotation = function() {
        $gameScreen.startRotation(0, 0);
    };

    Game_Interpreter.prototype.execStartZoom = function(args) {
        var scale = getArgNumber(args[0]);
        var duration = getArgNumber(args[1], 0);
        var x = args.length > 2 ? getArgNumber(args[2]) : SceneManager._screenWidth / 2;
        var y = args.length > 3 ? getArgNumber(args[3]) : SceneManager._screenHeight / 2;
        if (duration > 0) {
            $gameScreen.startZoom(x, y, scale / 100, duration);
        } else {
            $gameScreen.setZoom(x, y, scale / 100);
        }
    };

    //=============================================================================
    // Game_Map
    //  指定した座標が画面内かどうかを返します。
    //=============================================================================
    Game_Map.prototype.isInnerScreenPosition = function(x, y) {
        var ax = this.adjustX(x);
        var ay = this.adjustY(y);
        return ax >= -1 && ay >= -1 && ax < this.screenTileX() + 1 && ay < this.screenTileY() + 1;
    };

    //=============================================================================
    // Game_CharacterBase
    //  指定した座標が画面内かどうかを返します。
    //=============================================================================
    Game_CharacterBase.prototype.hideIfOuterScreen = function() {
        this._hiddenOuterScreen = !$gameMap.isInnerScreenPosition(this.x, this.y);
    };

    Game_CharacterBase.prototype.showIfOuterScreen = function() {
        this._hiddenOuterScreen = false;
    };

    var _Game_CharacterBase_isTransparent    = Game_CharacterBase.prototype.isTransparent;
    Game_CharacterBase.prototype.isTransparent = function() {
        return _Game_CharacterBase_isTransparent.apply(this, arguments) || this._hiddenOuterScreen;
    };

    //=============================================================================
    // Game_Screen
    //  画面を回転させます。
    //=============================================================================
    var _Game_Screen_clear    = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.apply(this, arguments);
        this.clearRotation();
    };

    Game_Screen.prototype.clearRotation = function() {
        this._angle         = undefined;
        this._rotationSpeed = 0;
        this._angleTarget   = 0;
    };

    Game_Screen.prototype.setAngle = function(angle) {
        this._angle         = angle || 0;
        this._rotationSpeed = 0;
        this._angleTarget   = 0;
        this.updateCharacterHide();
    };

    Game_Screen.prototype.startRotation = function(speed, angleTarget) {
        if (speed === 0) {
            this.setAngle(angleTarget);
            return;
        }
        this._rotationSpeed = speed;
        this._angle         = this._angle || 0;
        this._angleTarget   = angleTarget;
    };

    var _Game_Screen_onBattleStart = Game_Screen.prototype.onBattleStart;
    Game_Screen.prototype.onBattleStart = function() {
        _Game_Screen_onBattleStart.apply(this, arguments);
        this.clearRotation();
    };

    var _Game_Screen_update    = Game_Screen.prototype.update;
    Game_Screen.prototype.update = function() {
        _Game_Screen_update.apply(this, arguments);
        this.updateRotation();
    };

    Game_Screen.prototype.updateRotation = function() {
        if (this._rotationSpeed !== 0) {
            this._angle += this._rotationSpeed;
            if (this.isNeedStopRotation()) {
                this._angle = this._angleTarget;
                this.stopRotation();
            }
        }
        if (this._angle !== undefined) {
            SceneManager.rotateScene(this._angle);
            this.updateCharacterHide();
        }
    };

    Game_Screen.prototype.isNeedStopRotation = function() {
        return (this._angle >= this._angleTarget && this._rotationSpeed > 0) ||
            (this._angle <= this._angleTarget && this._rotationSpeed < 0);
    };

    Game_Screen.prototype.updateCharacterHide = function() {
        if (this.isValidRotation()) {
            this.iterateAllCharacters(Game_CharacterBase.prototype.hideIfOuterScreen);
            this._hideCharacterIfOuterScreen = true;
        } else if (this._hideCharacterIfOuterScreen) {
            this.iterateAllCharacters(Game_CharacterBase.prototype.showIfOuterScreen);
            this._hideCharacterIfOuterScreen = false;
        }
    };

    Game_Screen.prototype.iterateAllCharacters = function(callBackFund, args) {
        var characters = $gameMap.events().concat($gamePlayer);
        characters.forEach(function(character) {
            callBackFund.apply(character, args);
        });
    };

    Game_Screen.prototype.stopRotation = function() {
        this._rotationSpeed = 0;
    };

    Game_Screen.prototype.isValidRotation = function() {
        return this._angle % 180 !== 0;
    };

    //=============================================================================
    // SceneManager
    //  画面の回転処理を実装します。
    //=============================================================================
    SceneManager.rotateScene = function(angle) {
        var radian = angle * Math.PI / 180;
        this._scene.rotate(radian, this._screenWidth / 2, this._screenHeight / 2);
    };

    //=============================================================================
    // Scene_Base
    //  画面の回転処理を実装します。
    //=============================================================================
    Scene_Base.prototype.rotate = function(radian, ox, oy) {
        if (this.rotation === radian) return;
        var sin     = Math.sin(-radian);
        var cos     = Math.cos(-radian);
        this.rotation = radian;
        this.x        = Math.floor(ox * -cos + oy * -sin) + ox;
        this.y        = Math.floor(ox * sin + oy * -cos) + oy;
    };

    //=============================================================================
    // ウィンドウを透過して重なり合ったときの表示を自然にします。
    //=============================================================================
    if (param.throughWindow && !WindowLayer.throughWindow) {
        WindowLayer.throughWindow = true;
        //=============================================================================
        //  WindowLayer
        //   ウィンドウのマスク処理を除去します。
        //=============================================================================
        WindowLayer.prototype._maskWindow = function(window) {};

        WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {};
    }
})();

