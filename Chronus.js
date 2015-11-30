//=============================================================================
// Chronus.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2015/12/01 天候と時間帯をゲーム変数に格納できるよう機能追加
// 1.0.0 2015/11/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ゲーム内時間の導入プラグイン
 * @author トリアコンタン
 * 
 * @param 月ごとの日数配列
 * @desc 各月の日数の配列です。カンマ区切りで指定してください。個数は自由です。
 * @default 31,28,31,30,31,30,31,31,30,31,30,31
 *
 * @param 曜日配列
 * @desc 曜日の名称配列です。カンマ区切りで指定してください。個数は自由です。
 * @default (日),(月),(火),(水),(木),(金),(土)
 *
 * @param 自然時間加算
 * @desc 1秒ごとに加算されるゲーム時間（分単位）の値です。イベント処理中は無効です。
 * @default 5
 *
 * @param 場所移動時間加算
 * @desc 1回の場所移動で加算されるゲーム時間（分単位）の値です。
 * @default 30
 *
 * @param 戦闘時間加算(固定)
 * @desc 1回の戦闘で加算されるゲーム時間（分単位）の値です。
 * @default 30
 *
 * @param 戦闘時間加算(ターン)
 * @desc 1回の戦闘で消費したターン数ごとに加算されるゲーム時間（分単位）の値です。
 * @default 5
 *
 * @param 年のゲーム変数
 * @desc 指定した番号のゲーム変数に「年」の値が自動設定されます。
 * @default 0
 *
 * @param 月のゲーム変数
 * @desc 指定した番号のゲーム変数に「月」の値が自動設定されます。
 * @default 0
 *
 * @param 日のゲーム変数
 * @desc 指定した番号のゲーム変数に「日」の値が自動設定されます。
 * @default 0
 *
 * @param 曜日IDのゲーム変数
 * @desc 指定した番号のゲーム変数に「曜日」のIDが自動設定されます。
 * @default 0
 *
 * @param 曜日名のゲーム変数
 * @desc 指定した番号のゲーム変数に「曜日」の名称が自動設定されます。
 * ゲーム変数に文字列が入るので注意してください。
 * @default 0
 *
 * @param 時のゲーム変数
 * @desc 指定した番号のゲーム変数に「時」の値が自動設定されます。
 * @default 0
 *
 * @param 分のゲーム変数
 * @desc 指定した番号のゲーム変数に「時」の値が自動設定されます。
 * @default 0
 *
 * @param 時間帯IDのゲーム変数
 * @desc 指定した番号のゲーム変数に「時間帯」のIDが自動設定されます。
 * 0:深夜 1:早朝 2:朝 3:昼 4:夕方 5:夜
 * @default 0
 *
 * @param 天候IDのゲーム変数
 * @desc 指定した番号のゲーム変数に「天候」のIDが自動設定されます。
 * 0:なし 1:雨 2:嵐 3:雪
 * @default 0
 *
 * @param 日時フォーマット1
 * @desc マップ上の日付ウィンドウ1行目に表示される文字列です。
 * YYYY:年 MM:月 DD:日 HH24:時(24) HH:時(12) AM:午前 or 午後 MI:分 DY:曜日
 * @default YYYY年 MM月 DD日 DY
 *
 * @param 日時フォーマット2
 * @desc マップ上の日付ウィンドウ2行目に表示される文字列です。
 * YYYY:年 MM:月 DD:日 HH24:時(24) HH:時(12) AM:午前 or 午後 MI:分 DY:曜日
 * @default AMHH時 MI分
 *
 * @help ゲーム内で時刻と天候の概念を表現できるプラグインです。
 * 自動、マップ移動、戦闘で時間が経過し、時間と共に天候と色調が変化します。
 * これらの時間は調節可能で、またイベント中は時間の進行が停止します。
 * また日付や曜日も記録し、曜日の数や名称を自由に設定できます。
 * 現在日付はフォーマットに従って、画面左上に表示されます。
 *
 * 日付フォーマットには以下を利用できます。
 * YYYY:年 MM:月 DD:日 HH24:時(24) HH:時(12) AM:午前 or 午後 MI:分 DY:曜日
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  指定する値には制御文字\V[n]を使用できます。
 *  （引数の間は半角スペースで区切る）
 *
 * C_ADD_TIME [分] : 指定した値（分単位）だけ時間が経過します。
 * C_ADD_DAY [日] : 指定した値（日単位）だけ日数が経過します。
 * C_SET_TIME [時] [分] : 指定した時間に変更します。
 * C_SET_DAY [年] [月] [日] : 指定した日付に変更します。
 * C_STOP : 時間の進行を停止します。
 * C_START : 時間の進行を開始します。
 * C_SHOW : カレンダーを表示します。
 * C_HIDE : カレンダーを非表示にします。
 * C_DISABLE_TINT : 時間帯による色調の変更を禁止します。
 * C_ENABLE_TINT : 時間帯による色調の変更を許可します。
 * C_DISABLE_WEATHER : 時間経過による天候の変化を禁止します。
 * C_ENABLE_WEATHER : 時間経過による天候の変化を許可します。
 * C_SET_SNOW_LAND : 悪天候時に雪が降るようになります。
 * C_RESET_SNOW_LAND : 悪天候時に雨もしくは嵐が降るようになります。
 * C_SET_SPEED [分] : 実時間1秒あたりの時間の経過速度を設定します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  ただし、ヘッダのライセンス表示は残してください。
 */
(function () {

    //=============================================================================
    // PluginManager
    //  多言語とnullに対応したパラメータの取得を行います。
    //  このコードは自動生成され、全てのプラグインで同じものが使用されます。
    //=============================================================================
    PluginManager.getParamString = function (pluginName, paramEngName, paramJpgName) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        return value == null ? '' : value;
    };

    PluginManager.getParamNumber = function (pluginName, paramEngName, paramJpgName, min, max) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        if (arguments.length <= 3) min = -Infinity;
        if (arguments.length <= 4) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    PluginManager.getParamBoolean = function (pluginName, paramEngName, paramJpgName) {
        var value = this.getParamOther(pluginName, paramEngName, paramJpgName);
        return (value || '').toUpperCase() == 'ON';
    };

    PluginManager.getParamArrayString = function (pluginName, paramEngName, paramJpgName) {
        var value = this.getParamString(pluginName, paramEngName, paramJpgName);
        return (value || '').split(',');
    };

    PluginManager.getParamArrayNumber = function (pluginName, paramEngName, paramJpgName) {
        var values = PluginManager.getParamArrayString(pluginName, paramEngName, paramJpgName);
        for (var i = 0; i < values.length; i++) {
            values[i] = parseInt(values[i], 10) || 0;
        }
        return values;
    };

    PluginManager.getParamOther = function (pluginName, paramEngName, paramJpgName) {
        var value = this.parameters(pluginName)[paramEngName];
        if (value == null) value = this.parameters(pluginName)[paramJpgName];
        return value;
    };

    PluginManager.getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    PluginManager.checkCommandName = function (command, value) {
        return this.getCommandName(command) === value;
    };

    PluginManager.getArgString = function (index, args) {
        return PluginManager.convertEscapeCharacters(args[index]);
    };

    PluginManager.getArgNumber = function (index, args, min, max) {
        if (arguments.length <= 2) min = -Infinity;
        if (arguments.length <= 3) max = Infinity;
        return (parseInt(PluginManager.convertEscapeCharacters(args[index]), 10) || 0).clamp(min, max);
    };

    PluginManager.convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            return this.actorName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            return this.partyMemberName(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[C_ADD_TIME]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        switch (PluginManager.getCommandName(command)) {
            case 'C_ADD_TIME' :
                $gameSystem.chronus().addTime(PluginManager.getArgNumber(0, args, 0, 99999));
                break;
            case 'C_ADD_DAY' :
                $gameSystem.chronus().addDay(PluginManager.getArgNumber(0, args, 0, 99999));
                break;
            case 'C_SET_TIME' :
                var hour = PluginManager.getArgNumber(0, args, 0, 23);
                var minute = PluginManager.getArgNumber(1, args, 0, 59);
                $gameSystem.chronus().setTime(hour, minute);
                break;
            case 'C_SET_DAY' :
                var year = PluginManager.getArgNumber(0, args, 1, 5000);
                var month = PluginManager.getArgNumber(1, args, 1, $gameSystem.chronus().getMonthOfYear());
                var day = PluginManager.getArgNumber(2, args, 1, $gameSystem.chronus().getDaysOfMonth(month));
                $gameSystem.chronus().setDay(year, month, day);
                break;
            case 'C_STOP' :
                $gameSystem.chronus().stop();
                break;
            case 'C_START' :
                $gameSystem.chronus().start();
                break;
            case 'C_SHOW' :
                $gameSystem.chronus().showCalendar();
                break;
            case 'C_HIDE' :
                $gameSystem.chronus().hideCalendar();
                break;
            case 'C_DISABLE_TINT':
                $gameSystem.chronus().disableTint();
                break;
            case 'C_ENABLE_TINT':
                $gameSystem.chronus().enableTint();
                break;
            case 'C_DISABLE_WEATHER':
                $gameSystem.chronus().disableWeather();
                break;
            case 'C_ENABLE_WEATHER':
                $gameSystem.chronus().enableWeather();
                break;
            case 'C_SET_SNOW_LAND':
                $gameSystem.chronus().setSnowLand();
                break;
            case 'C_RESET_SNOW_LAND':
                $gameSystem.chronus().resetSnowLand();
                break;
            case 'C_SET_SPEED':
                $gameSystem.chronus()._timeAutoAdd = PluginManager.getArgNumber(0, args, 0, 99);
                break;
        }
    };

    var _Game_Interpreter_command236 = Game_Interpreter.prototype.command236;
    Game_Interpreter.prototype.command236 = function() {
        var result = _Game_Interpreter_command236.call(this);
        if (!$gameParty.inBattle()) {
            $gameSystem.chronus()._weatherType = Game_Chronus.weatherTypes.indexOf(this._params[0]);
            $gameSystem.chronus()._weatherPower = this._params[1];
            $gameSystem.chronus().refreshTint(true);
        }
        return result;
    };

    //=============================================================================
    // Game_System
    //  ゲーム内時間を扱うクラス「Game_Chronus」を追加定義します。
    //=============================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._chronus = new Game_Chronus();
    };

    Game_System.prototype.chronus = function() {
        return this._chronus;
    };

    Game_System.prototype.onBattleEnd = function() {
        this._chronus.onBattleEnd();
    };

    //=============================================================================
    // Game_Map
    //  マップ及びタイルセットから、色調変化無効フラグを取得します。
    //=============================================================================
    Game_Map.prototype.isDisableTint = function() {
        var chronusTnit = false;
        if ($dataMap.data.length === 0) return false;
        chronusTnit = $dataMap.meta.chronusTnit;
        if (chronusTnit != null) return chronusTnit === 'OFF';
        chronusTnit = $dataTilesets[$dataMap.tilesetId].meta.chronusTnit;
        if (chronusTnit != null) return chronusTnit === 'OFF';
        return false;
    };

    Game_Map.prototype.isDisableWeather = function() {
        var chronusWeather = false;
        if ($dataMap.data.length === 0) return false;
        chronusWeather = $dataMap.meta.chronusWeather;
        if (chronusWeather != null) return chronusWeather === 'OFF';
        chronusWeather = $dataTilesets[$dataMap.tilesetId].meta.chronusWeather;
        if (chronusWeather != null) return chronusWeather === 'OFF';
        return false;
    };

    //=============================================================================
    // Game_Player
    //  場所移動時の時間経過を追加定義します。
    //=============================================================================
    var _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _Game_Player_performTransfer.call(this);
        $gameSystem.chronus().transfer();
    };

    //=============================================================================
    // Scene_Map
    //  Game_Chronusの更新を追加定義します。
    //=============================================================================
    var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        $gameSystem.chronus().refreshTint(true);
        $gameSystem.chronus().refreshWeather(true);
        _Scene_Map_onMapLoaded.call(this);
    };

    var _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function() {
        _Scene_Map_updateMain.call(this);
        $gameSystem.chronus().update();
    };

    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createChronusWindow();
    };

    Scene_Map.prototype.createChronusWindow = function() {
        this._chronusWindow = new Window_Chronus();
        this.addWindow(this._chronusWindow);
    };

    //=============================================================================
    // BattleManager
    //  戦闘終了時のゲーム内時間経過処理を追加定義します。
    //=============================================================================
    var _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        $gameSystem.onBattleEnd();
        _BattleManager_endBattle.call(this, result);
    };

    //=============================================================================
    // Window_Chronus
    //  ゲーム内時間情報を描画するウィンドウです。
    //=============================================================================
    function Window_Chronus() {
        this.initialize.apply(this, arguments);
    }

    Window_Chronus.prototype = Object.create(Window_Base.prototype);
    Window_Chronus.prototype.constructor = Window_Chronus;

    Window_Chronus.prototype.initialize = function() {
        var bitmap = new Bitmap();
        var pad = 8;
        var width = Math.max(bitmap.measureTextWidth(this.chronus().getDateFormat(1))
            , bitmap.measureTextWidth(this.chronus().getDateFormat(2)));
        Window_Base.prototype.initialize.call(this, 0, 0, width + pad * 2, 28 * 2 + pad * 2);
        this.padding = pad;
        this.contents = new Bitmap(this.width - this.padding * 2, this.height - this.padding * 2);
        this.refresh();
    };

    Window_Chronus.prototype.refresh = function() {
        this.contents.clear();
        this.contents.drawText(this.chronus().getDateFormat(1),
            0, 0, this.contents.width, this.contents.fontSize, 'left');
        this.contents.drawText(this.chronus().getDateFormat(2),
            0, this.contents.fontSize, this.contents.width, this.contents.fontSize, 'left');
        this.chronus()._demandRefresh = false;
    };

    Window_Chronus.prototype.update = function() {
        if (this.chronus().isShowingCalendar()) {
            this.show();
            if (this.chronus()._demandRefresh) this.refresh();
        } else {
            this.hide();
        }
    };

    Window_Chronus.prototype.chronus = function() {
        return $gameSystem.chronus();
    };
})();

//=============================================================================
// Game_Chronus
//  時の流れを扱うクラスです。このクラスはGame_Systemクラスで生成されます。
//  セーブデータの保存対象のためグローバル領域に定義します。
//=============================================================================
function Game_Chronus() {
    this.initialize.apply(this, arguments);
}

Game_Chronus.prototype             = Object.create(Game_Chronus.prototype);
Game_Chronus.prototype.constructor = Game_Chronus;
Game_Chronus.pluginName = 'Chronus';
Game_Chronus.weatherTypes = ['none', 'rain', 'storm', 'snow'];

Game_Chronus.prototype.initialize = function () {
    this._timeMeter       = 0;            // 一日の中での時間経過（分単位）60 * 24
    this._dayMeter        = 0;            // ゲーム開始からの累計日数
    this._timeAutoAdd     = PluginManager.getParamNumber(Game_Chronus.pluginName, null, '自然時間加算', 0, 99);
    this._timeTransferAdd = PluginManager.getParamNumber(Game_Chronus.pluginName, null, '場所移動時間加算', 0);
    this._timeBattleAdd   = PluginManager.getParamNumber(Game_Chronus.pluginName, null, '戦闘時間加算(固定)', 0);
    this._timeTurnAdd     = PluginManager.getParamNumber(Game_Chronus.pluginName, null, '戦闘時間加算(ターン)', 0);
    this._weekNames       = PluginManager.getParamArrayString(Game_Chronus.pluginName, null, '曜日配列');
    this._daysOfMonth     = PluginManager.getParamArrayNumber(Game_Chronus.pluginName, null, '月ごとの日数配列');
    this._stop            = true;         // 停止フラグ（全ての加算に対して有効。ただし手動による加算は例外）
    this._disableTint     = false;        // 色調変更禁止フラグ
    this._calendarVisible = false;        // カレンダー表示フラグ
    this._disableWeather  = false;        // 天候制御禁止フラグ
    this._weatherType     = 0;            // 天候タイプ(0:なし 1:雨 2:嵐 :3雪)
    this._weatherPower    = 0;            // 天候の強さ
    this._weatherCounter  = 0;            // 同一天候の維持時間
    this._weatherSnowLand = false;        // 降雪地帯フラグ
    this._datetime        = null;
    this._demandRefresh   = false;
    this._prevHour        = -1;
};

Game_Chronus.prototype.update = function () {
    this.updateEffect();
    if (this.isStop() || $gameMap.isEventRunning()) {
        this._datetime = null;
        return;
    }
    if (this._datetime == null) this._datetime = Date.now();
    if (this._datetime + 1000 <= Date.now()) {
        this._datetime = Date.now();
        this.addTime();
    }
};

Game_Chronus.prototype.updateEffect = function () {
    var hour = this.getHour();
    if (this._prevHour !== hour) {
        this.controlWeather(false);
        this.refreshTint(false);
        this._prevHour = this.getHour();
    }
};

Game_Chronus.prototype.refreshTint = function (swift) {
    this.isEnableTint() ? this.setTint(this.getTimeZone(), swift) : $gameScreen.clearTone();
};

Game_Chronus.prototype.setTint = function (timezone, swift) {
    var tone = null;
    switch (timezone) {
        case 0:
            tone = [-102, -102, -68, 102];
            break;
        case 1:
            tone = [-68, -68, 0, 0];
            break;
        case 2:
            tone = [0, 0, 0, 0];
            break;
        case 3:
            tone = [34, 34, 34, 0];
            break;
        case 4:
            tone = [68, -34, -34, 0];
            break;
        case 5:
            tone = [-68, -68, 0, 68];
            break;
    }
    if (this.getWeatherTypeId() !== 0) {
        tone[0] > 0 ? tone[0] /= 7 : tone[0] -= 14;
        tone[1] > 0 ? tone[1] /= 7 : tone[1] -= 14;
        tone[2] > 0 ? tone[2] /= 7 : tone[1] -= 14;
        tone[3] === 0 ? tone[3] = 68 : tone[3] += 14;
    }
    $gameScreen.startTint(tone, swift ? 0 : Math.floor(60 * 5 / (this._timeAutoAdd / 10)));
};

Game_Chronus.prototype.controlWeather = function (force) {
    if (!force && Math.random() * 10 > this._weatherCounter - 7) {
        this._weatherCounter++;
    } else {
        this._weatherCounter = 0;
        if (Math.random() * 10 > 7) {
            this._weatherType  = this.isSnowLand() ? 3 : Math.random() * 10 > 6 ? 2 : 1;
            this._weatherPower = Math.floor(Math.random() * 10);
        } else {
            this._weatherType  = 0;
            this._weatherPower = 0;
        }
    }
    this.refreshWeather(false);
};

Game_Chronus.prototype.refreshWeather = function (swift) {
    this.isEnableWeather() ? this.setWeather(swift) : $gameScreen.changeWeather(0, 0, 0);
};

Game_Chronus.prototype.setWeather = function (swift) {
    $gameScreen.changeWeather(this.getWeatherType(), this._weatherPower,
        swift ? 0 : Math.floor(60 * 5 / (this._timeAutoAdd / 10)));
};

Game_Chronus.prototype.disableTint = function () {
    this._disableTint = true;
    this.refreshTint(true);
};

Game_Chronus.prototype.enableTint = function () {
    this._disableTint = false;
    this.refreshTint(true);
};

Game_Chronus.prototype.isEnableTint = function () {
    return !this._disableTint && !$gameMap.isDisableTint();
};

Game_Chronus.prototype.disableWeather = function () {
    this._disableWeather = true;
    this.refreshWeather(true);
};

Game_Chronus.prototype.enableWeather = function () {
    this._disableWeather = false;
    this.refreshWeather(true);
};

Game_Chronus.prototype.isEnableWeather = function () {
    return !this._disableWeather && !$gameMap.isDisableWeather();
};

Game_Chronus.prototype.setSnowLand = function () {
    this._weatherSnowLand = true;
    this.refreshWeather(true);
};

Game_Chronus.prototype.resetSnowLand = function () {
    this._weatherSnowLand = false;
    this.refreshWeather(true);
};

Game_Chronus.prototype.isSnowLand = function () {
    return this._weatherSnowLand;
};

Game_Chronus.prototype.onBattleEnd = function () {
    if (this.isStop()) return;
    this.addTime(this._timeBattleAdd + this._timeTurnAdd * $gameTroop.turnCount());
};

Game_Chronus.prototype.transfer = function () {
    if (this.isStop()) return;
    this.addTime(this._timeTransferAdd);
};

Game_Chronus.prototype.stop = function () {
    this._stop = true;
};

Game_Chronus.prototype.start = function () {
    this._stop = false;
};

Game_Chronus.prototype.isStop = function () {
    return this._stop;
};

Game_Chronus.prototype.showCalendar = function () {
    this._calendarVisible = true;
};

Game_Chronus.prototype.hideCalendar = function () {
    this._calendarVisible = false;
};

Game_Chronus.prototype.isShowingCalendar = function () {
    return this._calendarVisible;
};

Game_Chronus.prototype.isSnowLand = function () {
    return this._weatherSnowLand;
};

Game_Chronus.prototype.addTime = function (value) {
    if (arguments.length === 0) value = this._timeAutoAdd;
    this._timeMeter += value;
    while (this._timeMeter >= 60 * 24) {
        this.addDay();
        this._timeMeter -= 60 * 24;
    }
    this.demandRefresh(false);
};

Game_Chronus.prototype.setTime = function (hour, minute) {
    var time = hour * 60 + minute;
    if (this._timeMeter > time) this.addDay();
    this._timeMeter = time;
    this.demandRefresh(true);

};

Game_Chronus.prototype.addDay = function (value) {
    if (arguments.length === 0) value = 1;
    this._dayMeter += value;
    this.demandRefresh(false);
};

Game_Chronus.prototype.setDay = function (year, month, day) {
    var newDay = 0;
    newDay += (year - 1) * this.getDaysOfYear();
    for (var i = 0; i < month - 1; i++) {
        newDay += this._daysOfMonth[i];
    }
    newDay += day - 1;
    this._dayMeter = newDay;
    this.demandRefresh(true);
};

Game_Chronus.prototype.demandRefresh = function (effectRefreshFlg) {
    this._demandRefresh = true;
    this.setGameVariable();
    if (effectRefreshFlg) {
        this.refreshTint(true);
        this.controlWeather(true);
    }
};

Game_Chronus.prototype.getDaysOfWeek = function () {
    return this._weekNames.length;
};

Game_Chronus.prototype.getDaysOfMonth = function (month) {
    return this._daysOfMonth[month - 1];
};

Game_Chronus.prototype.getDaysOfYear = function () {
    var result = 0;
    this._daysOfMonth.forEach(function(days) {result += days});
    return result;
};

Game_Chronus.prototype.setGameVariable = function () {
    this.setGameVariableSub('年のゲーム変数', this.getYear());
    this.setGameVariableSub('月のゲーム変数', this.getMonth());
    this.setGameVariableSub('日のゲーム変数', this.getDay());
    this.setGameVariableSub('曜日IDのゲーム変数', this.getWeekIndex());
    this.setGameVariableSub('曜日名のゲーム変数', this.getWeekName());
    this.setGameVariableSub('時のゲーム変数', this.getHour());
    this.setGameVariableSub('分のゲーム変数', this.getMinute());
    this.setGameVariableSub('時間帯IDのゲーム変数', this.getTimeZone());
    this.setGameVariableSub('天候IDのゲーム変数', this.getWeatherTypeId());
};

Game_Chronus.prototype.setGameVariableSub = function (paramName, value) {
    var index = PluginManager.getParamNumber(Game_Chronus.pluginName, null, paramName, 0, 5000);
    if (index !== 0) $gameVariables.setValue(index, value);
};

Game_Chronus.prototype.getMonthOfYear = function () {
    return this._daysOfMonth.length;
};

Game_Chronus.prototype.getWeekName = function () {
    return this._weekNames[this.getWeekIndex()];
};

Game_Chronus.prototype.getWeekIndex = function () {
    return this._dayMeter % this.getDaysOfWeek();
};

Game_Chronus.prototype.getYear = function () {
    return Math.floor(this._dayMeter / this.getDaysOfYear()) + 1;
};

Game_Chronus.prototype.getMonth = function () {
    var days = this._dayMeter % this.getDaysOfYear();
    for (var i = 0; i < this._daysOfMonth.length; i++) {
        days -= this._daysOfMonth[i];
        if (days <= 0) return i + 1;
    }
    return null;
};

Game_Chronus.prototype.getDay = function () {
    var days = this._dayMeter % this.getDaysOfYear();
    for (var i = 0; i < this._daysOfMonth.length; i++) {
        if (days <= this._daysOfMonth[i]) return days + 1;
        days -= this._daysOfMonth[i];
    }
    return null;
};

Game_Chronus.prototype.getHour = function () {
    return Math.floor(this._timeMeter / 60);
};

Game_Chronus.prototype.getMinute = function () {
    return this._timeMeter % 60;
};

Game_Chronus.prototype.getDateFormat = function(index) {
    var format = PluginManager.getParamString(Game_Chronus.pluginName, null, '日時フォーマット' + String(index));
    format = format.replace(/DY/gi, function() {
        return this.getWeekName();
    }.bind(this));
    format = format.replace(/(Y+)/gi, function() {
        return this.getValuePadding(this.getYear(), arguments[1].length);
    }.bind(this));
    format = format.replace(/MM/gi, function() {
        return this.getValuePadding(this.getMonth(), String(this.getMonthOfYear()).length);
    }.bind(this));
    format = format.replace(/DD/gi, function() {
        return this.getValuePadding(this.getDay(),
            String(this.getDaysOfMonth(this.getMonth())).length);
    }.bind(this));
    format = format.replace(/HH24/gi, function() {
        return this.getValuePadding(this.getHour(), 2);
    }.bind(this));
    format = format.replace(/HH/gi, function() {
        return this.getValuePadding(this.getHour() % 12, 2);
    }.bind(this));
    format = format.replace(/AM/gi, function() {
        return Math.floor(this.getHour() / 12) === 0 ?
            $gameSystem.isJapanese() ? '午前' : 'Morning  ' :
            $gameSystem.isJapanese() ? '午後' : 'Afternoon';
    }.bind(this));
    format = format.replace(/MI/gi, function() {
        return this.getValuePadding(this.getMinute(), 2);
    }.bind(this));
    return format;
};

Game_Chronus.prototype.getTimeZone = function () {
    return this.isHourInRange(0, 4)   ? 0 :
           this.isHourInRange(5, 6)   ? 1 :
           this.isHourInRange(7, 11)  ? 2 :
           this.isHourInRange(12, 16) ? 3 :
           this.isHourInRange(17, 18) ? 4 :
           this.isHourInRange(19, 21) ? 5 :
           this.isHourInRange(22, 24) ? 0 : null;
};

Game_Chronus.prototype.getWeatherTypeId = function () {
    return this._weatherType;
};

Game_Chronus.prototype.getWeatherType = function () {
    return Game_Chronus.weatherTypes[this.getWeatherTypeId()];
};

Game_Chronus.prototype.getValuePadding = function(value, digit, padChar) {
    if (arguments.length === 2) padChar = '0';
    var result = "";
    for (var i = 0; i < digit; i++) result += padChar;
    result += value;
    return result.substr(-digit);
};

Game_Chronus.prototype.isHourInRange = function(min, max) {
    var hour = this.getHour();
    return hour >= min && hour <= max;
};
