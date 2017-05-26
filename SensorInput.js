//=============================================================================
// SensorInput.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.0.0 2016/02/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Plugin That ...
 * @author triacontane
 *
 * @param param
 * @desc parameter description
 * @default default value
 *
 * @help Plugin That ...
 *
 * Plugin Command
 *  XXXXX [XXX]
 *  ex1：XXXXX 1
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc センサー情報取得プラグイン
 * @author トリアコンタン
 *
 * @param Y軸傾き変数
 * @desc Y軸方向のデバイスの傾き度合いを格納する変数番号
 * @default
 *
 * @param X軸傾き変数
 * @desc X軸方向のデバイスの傾き度合いを格納する変数番号
 * @default
 *
 * @param Z軸傾き変数
 * @desc Z軸方向のデバイスの傾き度合いを格納する変数番号
 * @default
 *
 * @param 傾き絶対値取得
 * @desc ONにすると傾きの度合いを絶対値で取得します。
 * OFFにするとニュートラルポジションからの相対値で取得します。
 * @default OFF
 *
 * @param X軸加速度変数
 * @desc X軸方向のデバイスの加速度を格納する変数番号
 * @default
 *
 * @param Y軸加速度変数
 * @desc Y軸方向のデバイスの加速度を格納する変数番号
 * @default
 *
 * @param Z軸加速度変数
 * @desc Z軸方向のデバイスの加速度を格納する変数番号
 * @default
 *
 * @help モバイル端末のハードウェアに搭載されたセンサーの情報を取得して
 * 指定したゲーム変数に格納します。
 *
 * 方向センサー
 * 端末の傾き状態を3軸で取得して変数に格納します。
 * 絶対指定と、ニュートラルポジションからの相対指定の双方が可能です。
 *
 * 加速度センサー
 * 端末の加速度を3軸で取得して変数に格納します。
 *
 * 照度センサー
 * 端末の周囲の明るさを取得して変数に格納します。
 *
 * 近接センサー
 * 端末の付近にある物体を検知して結果を変数に格納します。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （引数の間は半角スペースで区切る）
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  ただし、ヘッダのライセンス表示は残してください。
 */

function SensorInput() {
    throw new Error('This is a static class');
}

(function () {
    var pluginName = 'SensorInput';

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    /**
     * Math.truncate
     *
     * @static
     */
    Math.truncate = function(originalValue) {
        var sign = originalValue < 0 ? -1 : 1;
        return Math.floor(Math.abs(originalValue)) * sign;
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandSensorInput(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandSensorInput = function(command, args) {
        switch (getCommandName(command)) {
            case 'XXXXX' :
                break;
        }
    };

    var paramOrientationZ = getParamNumber(['Z軸傾き変数', 'OrientationZ'], 0, 5000);
    var paramOrientationY = getParamNumber(['Y軸傾き変数', 'OrientationY'], 0, 5000);
    var paramOrientationX = getParamNumber(['X軸傾き変数', 'OrientationX'], 0, 5000);
    var paramMotionZ = getParamNumber(['Z軸加速度変数', 'MotionZ'], 0, 5000);
    var paramMotionY = getParamNumber(['Y軸加速度変数', 'MotionY'], 0, 5000);
    var paramMotionX = getParamNumber(['X軸加速度変数', 'MotionX'], 0, 5000);

    //=============================================================================
    // SceneManager
    //  センサー情報取得モジュールを初期化および更新します。
    //=============================================================================
    var _SceneManager_initInput = SceneManager.initInput;
    SceneManager.initInput = function() {
        _SceneManager_initInput.apply(this, arguments);
        SensorInput.initialize();
    };

    var _SceneManager_updateInputData = SceneManager.updateInputData;
    SceneManager.updateInputData = function() {
        _SceneManager_updateInputData.apply(this, arguments);
        SensorInput.update();
    };

    //=============================================================================
    // Window_Selectable
    //  センサー情報取得モジュールを更新します。
    //=============================================================================
    var _Window_Selectable_updateInputData = Window_Selectable.prototype.updateInputData;
    Window_Selectable.prototype.updateInputData = function() {
        _Window_Selectable_updateInputData.apply(this, arguments);
        SensorInput.update();
    };

    //=============================================================================
    // Scene_Boot
    //  ゲーム開始直後にニュートラルポジションを更新します。
    //=============================================================================
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        SensorInput.refreshNeutralOrientation();
    };

    //=============================================================================
    // SensorInput
    //  センサー情報を取得するモジュールです。
    //=============================================================================
    SensorInput.initialize = function() {
        this.clear();
        this._setupEventHandlers();
    };
    SensorInput.inputValid = false;

    SensorInput.clear = function() {
        this._orientationAbsolute = getParamBoolean(['傾き絶対値取得', 'OrientationAbsolute']);
        this._orientationAlpha    = 0;
        this._orientationBeta     = 0;
        this._orientationGamma    = 0;
        this._neutralAlpha        = 0;
        this._neutralBeta         = 0;
        this._neutralGamma        = 0;
        this._motionAlpha         = 0;
        this._motionBeta          = 0;
        this._motionGamma         = 0;
        this._sensitive           = 0.1;
        this._sensorStates        = {};
        this._changedStates       = {};
    };

    SensorInput.update = function() {
        this.updateVariables();
        if (SensorInput.inputValid) {
            this.updateInput();
        }
    };

    /** @private */
    SensorInput.updateVariables = function() {
        if (!$gameVariables) return;
        $gameVariables._data[paramOrientationZ] = this.getOrientationAlpha();
        $gameVariables._data[paramOrientationX] = this.getOrientationBeta();
        $gameVariables._data[paramOrientationY] = this.getOrientationGamma();
        $gameVariables._data[paramMotionZ] = this.getMotionAlpha();
        $gameVariables._data[paramMotionY] = this.getMotionBeta();
        $gameVariables._data[paramMotionX] = this.getMotionGamma();
    };

    /** @private */
    SensorInput.updateInput = function() {
        this._changedStates = {};
        var beta = this.getOrientationBeta(false);
        this.setState('left' , beta >= 2);
        this.setState('right', beta <= -2);
        var gamma = this.getOrientationGamma(false);
        this.setState('up' , gamma >= 2);
        this.setState('down', gamma <= -2);
        Input.updateSensor(this._changedStates);
    };

    Input.updateSensor = function(sensorState) {
        iterate(sensorState, function (key, value) {
            this._currentState[key] = value;
        }.bind(this));
    };

    /** @private */
    SensorInput.getState = function(name) {
        return !!this._sensorStates[name];
    };

    /** @private */
    SensorInput.setState = function(name, value) {
        value = !!value;
        if (this.getState(name) !== value) {
            this._sensorStates[name] = value;
            this._changedStates[name] = value;
        }
    };

    SensorInput.setSensitive = function(value) {
        this._sensitive = value.clamp(0, 10000);
    };

    SensorInput.getOrientationAlpha = function(absoluteFlg) {
        return this._getOrientationCommon(this._orientationAlpha, this._neutralAlpha, absoluteFlg);
    };

    SensorInput.getOrientationBeta = function(absoluteFlg) {
        return this._getOrientationCommon(this._orientationBeta, this._neutralBeta, absoluteFlg);
    };

    SensorInput.getOrientationGamma = function(absoluteFlg) {
        return this._getOrientationCommon(this._orientationGamma, this._neutralGamma, absoluteFlg);
    };

    /** @private */
    SensorInput._getOrientationCommon = function(absolute, neutral, absoluteFlg) {
        if (absoluteFlg === undefined) absoluteFlg = this._orientationAbsolute;
        var value = (absolute - (absoluteFlg ? 0 : neutral)) * this._sensitive;
        return Math.truncate(value);
    };

    SensorInput.refreshNeutralOrientation = function() {
        this._neutralAlpha    = this._orientationAlpha;
        this._neutralBeta     = this._orientationBeta;
        this._neutralGamma    = this._orientationGamma;
    };

    SensorInput.getMotionAlpha = function() {
        return this._getMotionCommon(this._motionAlpha);
    };

    SensorInput.getMotionBeta = function() {
        return this._getMotionCommon(this._motionBeta);
    };

    SensorInput.getMotionGamma = function() {
        return this._getMotionCommon(this._motionGamma);
    };

    /** @private */
    SensorInput._getMotionCommon = function(motion) {
        return Math.truncate(motion * this._sensitive);
    };

    /** @private */
    SensorInput._setupEventHandlers = function() {
        window.addEventListener('deviceorientation', this._onDeviceOrientation.bind(this), true);
        window.addEventListener('devicemotion', this._onDeviceMotion.bind(this), true);
    };

    /** @private */
    SensorInput._onDeviceOrientation = function(event) {
        this._orientationAlpha    = event.alpha;
        this._orientationBeta     = event.beta;
        this._orientationGamma    = event.gamma;
    };

    /** @private */
    SensorInput._onDeviceMotion = function(event) {
        this._motionAlpha = event.rotationRate.alpha;
        this._motionBeta  = event.rotationRate.beta;
        this._motionGamma = event.rotationRate.gamma;
    };
})();
