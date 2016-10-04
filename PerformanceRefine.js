//=============================================================================
// PerformanceRefine.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/10/05 セーブが失敗する不具合を修正
// 1.0.0 2016/10/02 初版
// 0.0.1 2016/09/19 作成途中
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:ja
 * @plugindesc パフォーマンス計測プラグイン
 * @author トリアコンタン
 *
 * @param 更新ログ出力間隔
 * @desc 更新ログの出力間隔です。この回数内の平均値をログとして出力します。0を指定すると出力されません。
 * @default 300
 *
 * @param その他ログ出力間隔
 * @desc 更新ログ以外のログの出力間隔です。この回数内の平均値をログとして出力します。0を指定すると出力されません。
 * @default 1
 *
 * @param 更新ログ警告閾値
 * @desc 更新ログの出力値がこの値を超えると警告ログ(左側に注意表示)になります。
 * @default 1.0
 *
 * @param その他ログ警告閾値
 * @desc 更新ログ以外の出力値がこの値を超えると警告ログ(左側に注意表示)になります。
 * @default 100.0
 *
 * @param フレームで表示
 * @desc ONの場合フレームで表示され、OFFの場合ミリ秒で表示されます。(ON/OFF)
 * @default OFF
 *
 * @param 警告ログのみ表示
 * @desc ログの出力内容が「警告」扱いの場合のみ出力します。(ON/OFF)
 * @default OFF
 *
 * @param 小数部分桁数
 * @desc 出力される数値の小数点以下の桁数です。
 * @default 2
 *
 * @param フレーム更新分割
 * @desc 更新ログを「入力情報更新」「データ更新」「描画更新」の3つの処理ごとに分割して表示します。
 * @default ON
 *
 * @param メソッド名出力
 * @desc ONにすると正確なメソッド名が、OFFだと処理の概要が日本語で出力されます。(ON/OFF)
 * @default OFF
 *
 * @param キャプチャ作成無効
 * @desc キャプチャ作成を無効にします。キャプチャ作成はメニュー画面などを開いた際に使われます。(ON/OFF)
 * @default OFF
 *
 * @param 色調変更無効
 * @desc ビットマップに対する色調変更を無効にします。色調変更はウィンドウカラーの変更で使われます。(ON/OFF)
 * @default OFF
 *
 * @param フラッシュ無効
 * @desc スプライトに対するフラッシュを無効にします。フラッシュはアニメーション表示などで使われます。(ON/OFF)
 * @default OFF
 *
 * @param 色相変更無効
 * @desc ビットマップに対する色相変更を無効にします。色相変更は敵キャラやアニメーション表示で使われます。(ON/OFF)
 * @default OFF
 *
 * @help 処理に掛かる時間を計測してログに出力します。
 * 正確な結果を計測するため、このプラグインは一番下に配置してください。
 * （このプラグインより下に配置されたプラグインの処理内容が
 * 　計測時間から漏れる可能性があります）
 * ログが出力されるタイミングは主に2通りです。
 *
 * １．フレーム更新ログ
 * 1フレームに掛かる時間を計測します。出力内容は指定された間隔ごとの平均値です。
 * また、ゲーム更新と描画の時間を分けて出力することも可能です。
 * 平均値が指定された閾値を超える場合、警告ログになります。
 * 頻繁に警告ログが出力されなければ、概ね快適なプレーであるといえます。
 *
 * ２．その他ログ
 * 同期実行され、かつ時間の掛かる以下の処理の時間を計測します。
 * ・シーン遷移時
 * ・マップオブジェクト作成時
 * ・キャプチャ取得時
 * ・セーブ実行時
 *
 * 結果が指定された閾値を超える場合、警告ログになります。
 * 頻繁に警告ログが出力されなければ、概ね快適なプレーであるといえます。
 *
 * パフォーマンス改善の手掛かりにしてください。
 * テストプレー時以外も動作しますが、製品版には付属しないことを推奨します。
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
    var pluginName = 'PerformanceRefine';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
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

    var getParamFloat = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseFloat(value) || 0).clamp(min, max);
    };

    var getClassName = function(object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramUpdateLogInterval  = getParamNumber(['UpdateLogInterval', '更新ログ出力間隔']);
    var paramOtherLogInterval   = getParamNumber(['OtherLogInterval', 'その他ログ出力間隔']);
    var paramUpdateLogWarnLimit = getParamFloat(['UpdateLogWarnLimit', '更新ログ警告閾値']);
    var paramOtherLogWarnLimit  = getParamFloat(['OtherLogWarnLimit', 'その他ログ警告閾値']);
    var paramOutputFrame        = getParamBoolean(['OutputFrame', 'フレームで表示']);
    var paramOutputOnlyWarn     = getParamBoolean(['OutputOnlyWarn', '警告ログのみ表示']);
    var paramDecimalDigit       = getParamNumber(['DecimalDigit', '小数部分桁数']);
    var paramUpdateLogSeparate  = getParamBoolean(['UpdateLogSeparate', 'フレーム更新分割']);
    var paramOutputMethodName   = getParamBoolean(['OutputMethodName', 'メソッド名出力']);
    var paramInvalidCapture     = getParamBoolean(['InvalidCapture', 'キャプチャ作成無効']);
    var paramInvalidTint        = getParamBoolean(['InvalidTint', '色調変更無効']);
    var paramInvalidFlash       = getParamBoolean(['InvalidFlash', 'フラッシュ無効']);
    var paramInvalidHue         = getParamBoolean(['InvalidHue', '色相変更無効']);

    //=============================================================================
    // JsExtensions
    //=============================================================================
    Object.defineProperty(String.prototype, 'padSuffix', {
        value: function(length, c) {
            var s = this;
            while (s.length < length) {
                s = s + c;
            }
            return s;
        }
    });

    //=============================================================================
    //  一部の画面効果を無効化してパフォーマンスの違いを確認します。
    //=============================================================================
    if (paramInvalidFlash) {
        Sprite.prototype.setBlendColor = function(color) {};
    }

    if (paramInvalidTint) {
        Bitmap.prototype.adjustTone = function(r, g, b) {};
    }

    if (paramInvalidHue) {
        var _ImageManager_loadBitmap = ImageManager.loadBitmap;
        ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
            arguments[2] = 0;
            _ImageManager_loadBitmap.apply(this, arguments);
        };

        Bitmap.prototype.rotateHue = function(offset) {};
    }

    if (paramInvalidCapture) {
        SceneManager.snapForBackground = function() {};
    }

    //=============================================================================
    // SceneManager
    //  処理時間を計測して結果を出力します。
    //=============================================================================
    var _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize      = function() {
        _SceneManager_initialize.apply(this, arguments);
        this.showDevTools();
    };

    SceneManager._averageTimes        = {};
    SceneManager.calculatePerformance = function(callBack, processName, interval, updateFlg) {
        if (!window.performance) {
            return callBack();
        }
        var averageInfo   = this._getAverageInfo(processName);
        var beforeTime    = this._getTimeInMs();
        var result        = callBack();
        var processTime   = this._getTimeInMs() - beforeTime;
        var count         = averageInfo.count;
        averageInfo.value = (averageInfo.value * count + processTime) / (count + 1);
        averageInfo.count++;
        if (interval && Graphics.frameCount % interval === interval - 1) {
            this._outputPerformance(processName, averageInfo, updateFlg);
        }
        return result;
    };

    SceneManager._outputPerformance = function(processName, averageInfo, updateFlg) {
        var unit      = Math.pow(10, paramDecimalDigit);
        var logValue  = Math.round((averageInfo.value * (paramOutputFrame ? 60 / 1000 : 1)) * unit) / unit;
        var logMethod = this._getPerformanceLogType(logValue, updateFlg);
        if (logMethod !== 'log' || !paramOutputOnlyWarn) {
            console[logMethod](this._getPerformanceLogValue(logValue) + processName);
        }
        averageInfo.value = 0;
        averageInfo.count = 0;
    };

    SceneManager._getPerformanceLogValue = function(value) {
        return (value + (paramOutputFrame ? 'Frames' : 'MS')).padSuffix(10 + paramDecimalDigit, ' ');
    };

    SceneManager._getPerformanceLogType = function(frame, updateFlg) {
        return frame > (updateFlg ? paramUpdateLogWarnLimit : paramOtherLogWarnLimit) ? 'warn' : 'log';
    };

    SceneManager._getAverageInfo = function(processName) {
        if (!this._averageTimes.hasOwnProperty(processName)) {
            this._averageTimes[processName] = {count: 0, value: 0};
        }
        return this._averageTimes[processName];
    };

    if (paramUpdateLogSeparate) {
        var _SceneManager_updateInputData = SceneManager.updateInputData;
        SceneManager.updateInputData      = function() {
            var methodName = paramOutputMethodName ? 'SceneManager.updateInputData()' : '入力データ更新';
            this.calculatePerformance(_SceneManager_updateInputData.bind(this), methodName,
                paramUpdateLogInterval, true);
        };

        var _SceneManager_updateScene = SceneManager.updateScene;
        SceneManager.updateScene      = function() {
            var methodName = paramOutputMethodName ? 'SceneManager.updateScene()' : 'ゲーム内容更新';
            this.calculatePerformance(_SceneManager_updateScene.bind(this), methodName,
                paramUpdateLogInterval, true);
        };

        var _SceneManager_renderScene = SceneManager.renderScene;
        SceneManager.renderScene      = function() {
            var methodName = paramOutputMethodName ? 'SceneManager.renderScene()' : '描画状態更新';
            this.calculatePerformance(_SceneManager_renderScene.bind(this), methodName,
                paramUpdateLogInterval, true);
        };
    } else {
        var _SceneManager_updateMain = SceneManager.updateMain;
        SceneManager.updateMain      = function() {
            var methodName = paramOutputMethodName ? 'SceneManager.updateMain()' : 'フレーム更新';
            this.calculatePerformance(_SceneManager_updateMain.bind(this),
                methodName, paramUpdateLogInterval, true);
        };
    }

    var _SceneManager_changeScene = SceneManager.changeScene;
    SceneManager.changeScene      = function() {
        if (this.isSceneChanging() && !this.isCurrentSceneBusy() && this._nextScene) {
            var methodName = (paramOutputMethodName ? 'SceneManager.changeScene() to ' : 'シーン遷移 to ') +
                getClassName(this._nextScene);
            this.calculatePerformance(_SceneManager_changeScene.bind(this), methodName, paramOtherLogInterval, false);
        } else {
            _SceneManager_changeScene.apply(this, arguments);
        }
    };

    var _SceneManager_snapForBackground = SceneManager.snapForBackground;
    SceneManager.snapForBackground      = function() {
        var methodName = paramOutputMethodName ? 'SceneManager.snapForBackground()' : '背景キャプチャ作成';
        this.calculatePerformance(_SceneManager_snapForBackground.bind(this),
            methodName, paramOtherLogInterval, false);
    };

    SceneManager.showDevTools = function() {
        var nwWin = require('nw.gui').Window.get();
        if (!nwWin.isDevToolsOpen()) {
            var devTool = nwWin.showDevTools();
            devTool.moveTo(0, 0);
            devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
            nwWin.focus();
        }
    };

    //=============================================================================
    // Scene_Map
    //  計測対象のメソッドです。
    //=============================================================================
    var _Scene_Map_createDisplayObjects      = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        var methodName = paramOutputMethodName ? getClassName(this) + '.createDisplayObjects()' :
            'マップ表示オブジェクト作成';
        SceneManager.calculatePerformance(_Scene_Map_createDisplayObjects.bind(this),
            methodName, paramOtherLogInterval, false);
    };

    //=============================================================================
    // DataManager
    //  計測対象のメソッドです。
    //=============================================================================
    var _DataManager_saveGame = DataManager.saveGame;
    DataManager.saveGame      = function(savefileId) {
        var methodName = paramOutputMethodName ? 'DataManager.saveGame()' : 'データセーブ';
        return SceneManager.calculatePerformance(_DataManager_saveGame.bind(this, savefileId),
            methodName, paramOtherLogInterval, false);
    };
})();

