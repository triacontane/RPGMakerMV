//=============================================================================
// PerformanceRefine.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2017/08/20 最新のMW.jsで動作するよう修正
// 1.2.1 2017/03/11 コミュニティ版で動作しない問題を修正
// 1.2.0 2017/01/21 1フレーム中に実行したイベントの総数をログ出力する機能を追加
// 1.1.0 2017/01/09 ローカル環境以外でも動作するよう修正
//                  実行中のイベントの更新時間を出力できる機能を追加
// 1.0.1 2016/10/05 セーブが失敗する不具合を修正
// 1.0.0 2016/10/02 初版
// 0.0.1 2016/09/19 作成途中
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
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
 * @param 表示閾値
 * @desc 指定した値より小さいログは出力されません。
 * @default 0.1
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
 * @param イベント更新出力
 * @desc 実行中のイベントの処理時間を表示します。
 * @default ON
 *
 * @param イベント細分出力
 * @desc 実行中のイベントの処理時間を表示します。イベントの深さが1以上の場合も表示します。
 * @default OFF
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
 * ３．イベント処理時間ログ
 * 実行されているイベントごとの処理時間を計測できます。
 * 特に並列実行について、処理が重くなっているイベントを特定することができます。
 *
 * また、CTRLキーを押すと、そのフレーム中に実行したイベントコマンドの数を
 * ログ出力することができます。
 * この値が2000を超えている場合は、組み方を見直すことを推奨します。
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
    const pluginName = 'PerformanceRefine';

    const getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (let i = 0; i < paramNames.length; i++) {
            const name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    const getParamNumber = function(paramNames, min, max) {
        const value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    const getParamBoolean = function(paramNames) {
        const value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    const getParamFloat = function(paramNames, min, max) {
        const value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseFloat(value) || 0).clamp(min, max);
    };

    const getClassName = function(object) {
        return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    const paramUpdateLogInterval  = getParamNumber(['UpdateLogInterval', '更新ログ出力間隔']);
    const paramOtherLogInterval   = getParamNumber(['OtherLogInterval', 'その他ログ出力間隔']);
    const paramUpdateLogWarnLimit = getParamFloat(['UpdateLogWarnLimit', '更新ログ警告閾値']);
    const paramOtherLogWarnLimit  = getParamFloat(['OtherLogWarnLimit', 'その他ログ警告閾値']);
    const paramOutputFrame        = getParamBoolean(['OutputFrame', 'フレームで表示']);
    const paramOutputOnlyWarn     = getParamBoolean(['OutputOnlyWarn', '警告ログのみ表示']);
    const paramDecimalDigit       = getParamNumber(['DecimalDigit', '小数部分桁数']);
    const paramUpdateLogSeparate  = getParamBoolean(['UpdateLogSeparate', 'フレーム更新分割']);
    const paramOutputMethodName   = getParamBoolean(['OutputMethodName', 'メソッド名出力']);
    const paramInvalidCapture     = getParamBoolean(['InvalidCapture', 'キャプチャ作成無効']);
    const paramInvalidTint        = getParamBoolean(['InvalidTint', '色調変更無効']);
    const paramInvalidFlash       = getParamBoolean(['InvalidFlash', 'フラッシュ無効']);
    const paramInvalidHue         = getParamBoolean(['InvalidHue', '色相変更無効']);
    const paramOutputEvent        = getParamBoolean(['OutputEvent', 'イベント更新出力']);
    const paramOutputEventSub     = getParamBoolean(['OutputEventSub', 'イベント細分出力']);
    const paramInfoLimit          = getParamFloat(['InfoLimit', '表示閾値']);

    //=============================================================================
    // JsExtensions
    //=============================================================================
    Object.defineProperty(String.prototype, 'padSuffix', {
        value: function(length, c) {
            let s = this;
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
        const _ImageManager_loadBitmap = ImageManager.loadBitmap;
        ImageManager.loadBitmap        = function(folder, filename, hue, smooth) {
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
    const _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize        = function() {
        _SceneManager_initialize.apply(this, arguments);
        this.showDevTools();
    };

    SceneManager._averageTimes        = {};
    SceneManager.calculatePerformance = function(callBack, processName, interval, updateFlg) {
        if (!window.performance) {
            return callBack();
        }
        const averageInfo = this._getAverageInfo(processName);
        const beforeTime  = performance.now();
        const result      = callBack();
        const processTime = performance.now() - beforeTime;
        const count       = averageInfo.count;
        averageInfo.value = (averageInfo.value * count + processTime) / (count + 1);
        averageInfo.count++;
        if (interval && Graphics.frameCount % interval === interval - 1) {
            this._outputPerformance(processName, averageInfo, updateFlg);
        }
        return result;
    };

    SceneManager._outputPerformance = function(processName, averageInfo, updateFlg) {
        const unit     = Math.pow(10, paramDecimalDigit);
        const logValue = Math.round((averageInfo.value * (paramOutputFrame ? 60 / 1000 : 1)) * unit) / unit;
        if (logValue < paramInfoLimit) {
            return;
        }
        const logMethod = this._getPerformanceLogType(logValue, updateFlg);
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
        const _SceneManager_updateInputData = SceneManager.updateInputData;
        SceneManager.updateInputData        = function() {
            const methodName = paramOutputMethodName ? 'SceneManager.updateInputData()' : 'インプット更新';
            this.calculatePerformance(_SceneManager_updateInputData.bind(this), methodName,
                paramUpdateLogInterval, true);
        };

        const _SceneManager_updateScene = SceneManager.updateScene;
        SceneManager.updateScene        = function() {
            const methodName = paramOutputMethodName ? 'SceneManager.updateScene()' : 'ゲーム状態更新';
            this.calculatePerformance(_SceneManager_updateScene.bind(this), methodName,
                paramUpdateLogInterval, true);
        };

        const _SceneManager_renderScene = SceneManager.renderScene;
        SceneManager.renderScene        = function() {
            const methodName = paramOutputMethodName ? 'SceneManager.renderScene()' : '画面描画処理';
            this.calculatePerformance(_SceneManager_renderScene.bind(this), methodName,
                paramUpdateLogInterval, true);
        };
    } else {
        const _SceneManager_updateMain = SceneManager.updateMain;
        SceneManager.updateMain        = function() {
            const methodName = paramOutputMethodName ? 'SceneManager.updateMain()' : 'フレーム更新全体';
            this.calculatePerformance(_SceneManager_updateMain.bind(this),
                methodName, paramUpdateLogInterval, true);
        };
    }

    if (paramOutputEvent) {
        //=============================================================================
        // Game_Interpreter
        //  計測対象のメソッドです。
        //=============================================================================
        const _Game_Interpreter_update    = Game_Interpreter.prototype.update;
        Game_Interpreter.prototype.update = function() {
            if (this.isOutputEvent()) {
                const methodName = (paramOutputMethodName ? getClassName(this) + '.update()' : 'イベント更新') + this.getProcessNumber();
                SceneManager.calculatePerformance(_Game_Interpreter_update.bind(this),
                    methodName, paramUpdateLogInterval, true);
            } else {
                _Game_Interpreter_update.apply(this, arguments);
            }
        };

        const _Game_Interpreter_setupReservedCommonEvent    = Game_Interpreter.prototype.setupReservedCommonEvent;
        Game_Interpreter.prototype.setupReservedCommonEvent = function() {
            if ($gameTemp.isCommonEventReserved()) {
                this.setCommonEventId($gameTemp._commonEventId);
            }
            return _Game_Interpreter_setupReservedCommonEvent.apply(this, arguments);
        };

        const _Game_Interpreter_command117    = Game_Interpreter.prototype.command117;
        Game_Interpreter.prototype.command117 = function() {
            const result = _Game_Interpreter_command117.apply(this, arguments);
            if (this._childInterpreter) {
                this._childInterpreter.setCommonEventId(this._params[0]);
            }
            return result;
        };

        Game_Interpreter.prototype.getProcessNumber = function() {
            if (this._commonEventId) {
                return ` Common Event ID:${this._commonEventId}`;
            } else {
                return ` Map ID:${this._mapId} Event ID:${this._eventId}`;
            }
        };

        Game_Interpreter.prototype.isOutputEvent = function() {
            return this.isRunning() && (paramOutputEventSub || this._depth === 0);
        };

        Game_Interpreter.prototype.setCommonEventId = function(id) {
            this._commonEventId = id;
        };

        const _Game_CommonEvent_refresh    = Game_CommonEvent.prototype.refresh;
        Game_CommonEvent.prototype.refresh = function() {
            _Game_CommonEvent_refresh.apply(this, arguments);
            if (this._interpreter) {
                this._interpreter.setCommonEventId(this._commonEventId);
            }
        };
    }

    const _Game_Interpreter_executeCommand    = Game_Interpreter.prototype.executeCommand;
    Game_Interpreter.prototype.executeCommand = function() {
        const command = this.currentCommand();
        if (!$gameParty.inBattle() && command && command.code !== 0) {
            $gameMap.countUpParallelCommand();
        }
        return _Game_Interpreter_executeCommand.apply(this, arguments);
    };

    const _Game_Map_updateEvents = Game_Map.prototype.updateEvents;
    Game_Map.prototype.updateEvents = function() {
        if (Input.isTriggered('control')) {
            this._isCommandCount = true;
            this._parallelCommandCount = 0;
        }
        _Game_Map_updateEvents.apply(this, arguments);
        if (this._isCommandCount) {
            console.log(`1frameあたりのイベント命令実行回数[${this._parallelCommandCount}]回`);
            this._isCommandCount = false;
            this._parallelCommandCount = 0;
        }
    };

    Game_Map.prototype.countUpParallelCommand = function() {
        if (this._isCommandCount) {
            this._parallelCommandCount++;
        }
    };

    const _SceneManager_changeScene = SceneManager.changeScene;
    SceneManager.changeScene        = function() {
        if (this.isSceneChanging() && !this.isCurrentSceneBusy() && this._nextScene) {
            const methodName = (paramOutputMethodName ? 'SceneManager.changeScene() to ' : 'シーン遷移 to ') +
                getClassName(this._nextScene);
            this.calculatePerformance(_SceneManager_changeScene.bind(this), methodName, paramOtherLogInterval, false);
        } else {
            _SceneManager_changeScene.apply(this, arguments);
        }
    };

    const _SceneManager_snapForBackground = SceneManager.snapForBackground;
    SceneManager.snapForBackground        = function() {
        const methodName = paramOutputMethodName ? 'SceneManager.snapForBackground()' : '背景キャプチャ作成';
        this.calculatePerformance(_SceneManager_snapForBackground.bind(this),
            methodName, paramOtherLogInterval, false);
    };

    SceneManager.showDevTools = function() {
        if (!Utils.isNwjs()) return;
        const nwWin = require('nw.gui').Window.get();
        if (!nwWin.isDevToolsOpen || !nwWin.isDevToolsOpen()) {
            const devTool = nwWin.showDevTools();
            if (devTool) {
                devTool.moveTo(0, 0);
                devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
                nwWin.focus();
            }
        }
    };

    //=============================================================================
    // Scene_Map
    //  計測対象のメソッドです。
    //=============================================================================
    const _Scene_Map_createDisplayObjects    = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        const methodName = paramOutputMethodName ? getClassName(this) + '.createDisplayObjects()' :
            'マップ表示オブジェクト作成';
        SceneManager.calculatePerformance(_Scene_Map_createDisplayObjects.bind(this),
            methodName, paramOtherLogInterval, false);
    };

    //=============================================================================
    // Game_Player
    //  計測対象のメソッドです。
    //=============================================================================
    const _Game_Player_performTransfer    = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        const methodName = paramOutputMethodName ? getClassName(this) + '.createDisplayObjects()' : '場所移動';
        SceneManager.calculatePerformance(_Game_Player_performTransfer.bind(this),
            methodName, paramOtherLogInterval, false);
    };

    //=============================================================================
    // DataManager
    //  計測対象のメソッドです。
    //=============================================================================
    const _DataManager_saveGame = DataManager.saveGame;
    DataManager.saveGame        = function(savefileId) {
        const methodName = paramOutputMethodName ? 'DataManager.saveGame()' : 'データセーブ';
        return SceneManager.calculatePerformance(_DataManager_saveGame.bind(this, savefileId),
            methodName, paramOtherLogInterval, false);
    };
})();

