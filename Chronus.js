//=============================================================================
// Chronus.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.5 2016/04/29 createUpperLayerによる競合対策
// 1.2.4 2016/03/13 アナログ時計を指定しないで起動した場合にエラーになる現象の修正
// 1.2.3 2016/03/10 時間帯と時間帯ごとの色調をカスタマイズできるようにユーザ書き換え領域を作成
// 1.2.2 2016/03/04 本体バージョン1.1.0の未使用素材の削除機能への対応
// 1.2.1 2016/02/25 実時間表示設定でロードするとエラーが発生する現象の修正
// 1.2.0 2016/02/14 アナログ時計の表示機能を追加
//                  現実の時間を反映させる機能の追加
// 1.1.3 2016/01/21 競合対策（YEP_MessageCore.js）
// 1.1.2 2016/01/10 カレンダーウィンドウの表示位置をカスタマイズできる機能を追加
// 1.1.1 2015/12/29 日の値に「1」を設定した場合に日付の表示がおかしくなる不具合を修正
//                  一部のコードを最適化
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
 * @desc 指定した番号のゲーム変数に「分」の値が自動設定されます。
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
 * @param カレンダー表示X座標
 * @desc カレンダーの表示 X 座標です。
 * @default 0
 *
 * @param カレンダー表示Y座標
 * @desc カレンダーの表示 Y 座標です。
 * @default 0
 *
 * @param 文字盤画像ファイル
 * @desc アナログ時計を表示する場合の文字盤画像ファイル名（拡張子は不要）です。
 * 画像は「img/pictures/」以下に保存してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 長針画像ファイル
 * @desc アナログ時計を表示する場合の長針画像ファイル名（拡張子は不要）です。
 * 画像は「img/pictures/」以下に保存してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 短針画像ファイル
 * @desc アナログ時計を表示する場合の長針画像ファイル名（拡張子は不要）です。
 * 画像は「img/pictures/」以下に保存してください。
 * @default
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 時計X座標
 * @desc アナログ時計の表示X座標です。画像の中心座標を指定してください。
 * @default 84
 *
 * @param 時計Y座標
 * @desc アナログ時計の表示Y座標です。画像の中心座標を指定してください。
 * @default 156
 *
 * @help ゲーム内で時刻と天候の概念を表現できるプラグインです。
 * 自動、マップ移動、戦闘で時間が経過し、時間と共に天候と色調が変化します。
 * これらの時間は調節可能で、またイベント中は時間の進行が停止します。
 *
 * さらに、現実の時間をゲーム中に反映させる機能もあります。
 * 設定を有効にすると現実の時間がゲーム内とリンクします。
 *
 * 日付や曜日も記録し、曜日の数や名称を自由に設定できます。
 * 現在日付はフォーマットに従って、画面左上に表示されます。
 *
 * 日付フォーマットには以下を利用できます。
 * YYYY:年 MM:月 DD:日 HH24:時(24) HH:時(12) AM:午前 or 午後 MI:分 DY:曜日
 *
 * また、規格に沿った画像を用意すればアナログ時計も表示できます。
 * 表示位置は各画像の表示可否は調整できます。
 *
 * 画像の規格は以下の通りです。
 * ・文字盤 : 任意のサイズの正方形画像
 * ・長針　 : 文字盤と同じサイズの画像で、上（0）を指している針の画像
 * ・短針　 : 文字盤と同じサイズの画像で、上（0）を指している針の画像
 *
 * ツクマテにて規格に合った時計画像をリクエストしました。
 * 使用する場合は、以下のURLより利用規約を別途確認の上、ご使用ください。
 * http://tm.lucky-duet.com/viewtopic.php?f=47&t=555&p=1615#p1615
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
 * C_SHOW_CLOCK : アナログ時計を表示します。
 * C_HIDE_CLOCK : アナログ時計を非表示にします。
 * C_SET_TIME_REAL : 時間の取得方法を実時間に変更します。
 * C_SET_TIME_VIRTUAL : 時間の取得方法をゲーム内時間に変更します。
 *
 * メモ欄詳細
 *  タイトルセットおよびマップのメモ欄に以下を入力すると、
 *  一時的に天候と色調変化を自動で無効化できます。
 *  屋内マップやイベントシーンなどで一時的に無効化したい場合に利用できます。
 *
 * <C_Tint:OFF> : 色調の変更を一時的に無効化します。
 * <C_Weather:OFF> : 天候を一時的に無効化します。
 *
 * 高度な設定
 * ソースコード中の「ユーザ書き換え領域」を参照すると以下を変更できます。
 *  時間帯の情報(朝が何時から何時まで等)
 *  時間帯ごとの色調(ただし、悪天候の場合は補正が掛かります)
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

function Game_Chronus() {
    this.initialize.apply(this, arguments);
}

(function () {
    'use strict';
    //=============================================================================
    // ユーザ書き換え領域 - 開始 -
    //=============================================================================
    var settings = {
        /* timeZone:時間帯 */
        timeZone:[
            /* name:時間帯名称 start:開始時刻 end:終了時刻 timeId:時間帯ID */
            {name:'深夜', start:0,  end:4,  timeId:0},
            {name:'早朝', start:5,  end:6,  timeId:1},
            {name:'朝',   start:7,  end:11, timeId:2},
            {name:'昼',   start:12, end:16, timeId:3},
            {name:'夕方', start:17, end:18, timeId:4},
            {name:'夜',   start:19, end:21, timeId:5},
            {name:'深夜', start:22, end:24, timeId:0},
        ],
        /* timeTone:時間帯ごとの色調 */
        timeTone:[
            /* timeId:時間帯ID value:色調[赤(-255...255),緑(-255...255),青(-255...255),グレー(0...255)] */
            {timeId:0, value:[-102, -102, -68, 102]},
            {timeId:1, value:[-68, -68, 0, 0]},
            {timeId:2, value:[0, 0, 0, 0]},
            {timeId:3, value:[34, 34, 34, 0]},
            {timeId:4, value:[68, -34, -34, 0]},
            {timeId:5, value:[-68, -68, 0, 68]},
        ]
    };
    //=============================================================================
    // ユーザ書き換え領域 - 終了 -
    //=============================================================================
    var pluginName = 'Chronus';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var isParamExist = function(paramNames) {
        return getParamOther(paramNames) != null;
    };

    var getParamArrayString = function (paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getParamArrayNumber = function (paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return parseIntStrict(convertEscapeCharacters(arg)).clamp(min, max);
    };

    var parseIntStrict = function(value, errorMessage) {
        var result = parseInt(value, 10);
        if (isNaN(result)) throw Error('指定した値[' + value + ']が数値ではありません。' + errorMessage);
        return result;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.apply(this, arguments);
        $gameSystem.onLoad();
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンド[C_ADD_TIME]などを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandChronus(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                var devTool = window.showDevTools();
                devTool.moveTo(0, 0);
                devTool.resizeTo(Graphics.width, Graphics.height);
                window.focus();
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandChronus = function (command, args) {

        switch (getCommandName(command)) {
            case 'C_ADD_TIME' :
                $gameSystem.chronus().addTime(getArgNumber(args[0], 0, 99999));
                break;
            case 'C_ADD_DAY' :
                $gameSystem.chronus().addDay(getArgNumber(args[0], 0, 99999));
                break;
            case 'C_SET_TIME' :
                var hour = getArgNumber(args[0], 0, 23);
                var minute = getArgNumber(args[1], 0, 59);
                $gameSystem.chronus().setTime(hour, minute);
                break;
            case 'C_SET_DAY' :
                var year = getArgNumber(args[0], 1, 5000);
                var month = getArgNumber(args[1], 1, $gameSystem.chronus().getMonthOfYear());
                var day = getArgNumber(args[2], 1, $gameSystem.chronus().getDaysOfMonth(month));
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
                $gameSystem.chronus().setTimeAutoAdd(getArgNumber(args[0], 0, 99));
                break;
            case 'C_SHOW_CLOCK':
                $gameSystem.chronus().showClock();
                break;
            case 'C_HIDE_CLOCK':
                $gameSystem.chronus().hideClock();
                break;
            case 'C_SET_TIME_REAL':
                $gameSystem.chronus().setTimeReal();
                break;
            case 'C_SET_TIME_VIRTUAL':
                $gameSystem.chronus().setTimeVirtual();
                break;
        }
    };

    var _Game_Interpreter_command236 = Game_Interpreter.prototype.command236;
    Game_Interpreter.prototype.command236 = function() {
        var result = _Game_Interpreter_command236.call(this);
        if (!$gameParty.inBattle()) {
            $gameSystem.chronus().setWeatherType(Game_Chronus.weatherTypes.indexOf(this._params[0]));
            $gameSystem.chronus().setWeatherPower(this._params[1]);
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
        this.chronus().onBattleEnd();
    };

    var _Game_System_onLoad = Game_System.prototype.onLoad;
    Game_System.prototype.onLoad = function() {
        if (_Game_System_onLoad) _Game_System_onLoad.apply(this, arguments);
        if (!this.chronus()) this._chronus = new Game_Chronus();
        this._chronus.onLoad();
    };

    //=============================================================================
    // Game_Map
    //  マップ及びタイルセットから、色調変化無効フラグを取得します。
    //=============================================================================
    Game_Map.prototype.isDisableTint = function() {
        return this.isChronicleMetaInfo('Tint');
    };

    Game_Map.prototype.isDisableWeather = function() {
        return this.isChronicleMetaInfo('Weather');
    };

    Game_Map.prototype.isChronicleMetaInfo = function(tagName) {
        if (Utils.isOptionValid('etest') || Utils.isOptionValid('btest')) return false;
        var value = $dataMap.meta['chronus' + tagName];
        if (value != null) return value === 'OFF';
        value = $dataMap.meta['C_' + tagName];
        if (value != null) return value === 'OFF';
        value = $dataTilesets[$dataMap.tilesetId].meta['chronus' + tagName];
        if (value != null) return value === 'OFF';
        value = $dataTilesets[$dataMap.tilesetId].meta['C_' + tagName];
        if (value != null) return value === 'OFF';
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
        _Scene_Map_onMapLoaded.apply(this, arguments);
    };

    var _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function() {
        _Scene_Map_updateMain.apply(this, arguments);
        $gameSystem.chronus().update();
    };

    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        this.createChronusWindow();
        _Scene_Map_createAllWindows.apply(this, arguments);
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

    var _Window_Chronus_initialize = Window_Chronus.prototype.initialize;
    Window_Chronus.prototype.initialize = function() {
        var bitmap = new Bitmap();
        var pad = 8;
        var width = Math.max(bitmap.measureTextWidth(this.chronus().getDateFormat(1)),
            bitmap.measureTextWidth(this.chronus().getDateFormat(2)));
        _Window_Chronus_initialize.call(this, 0, 0, width + pad * 2, 28 * 2 + pad * 2);
        this.padding = pad;
        this.contents = new Bitmap(this.width - this.padding * 2, this.height - this.padding * 2);
        this.x = getParamNumber('カレンダー表示X座標');
        this.y = getParamNumber('カレンダー表示Y座標');
        this.refresh();
    };

    Window_Chronus.prototype.refresh = function() {
        this.contents.clear();
        this.contents.drawText(this.chronus().getDateFormat(1),
            0, 0, this.contents.width, this.contents.fontSize, 'left');
        this.contents.drawText(this.chronus().getDateFormat(2),
            0, this.contents.fontSize, this.contents.width, this.contents.fontSize, 'left');
    };

    Window_Chronus.prototype.update = function() {
        if (this.chronus().isShowingCalendar()) {
            this.show();
            if (this.chronus().isNeedRefresh()) this.refresh();
        } else {
            this.hide();
        }
    };

    Window_Chronus.prototype.chronus = function() {
        return $gameSystem.chronus();
    };

    //=============================================================================
    // Sprite_Chronicle_Clock
    //  アナログ時計表示スプライトクラスです。
    //=============================================================================
    function Sprite_Chronicle_Clock() {
        this.initialize.apply(this, arguments);
    }

    Sprite_Chronicle_Clock.prototype = Object.create(Sprite.prototype);
    Sprite_Chronicle_Clock.prototype.constructor = Sprite_Chronicle_Clock;

    var _Sprite_Chronicle_Clock_initialize = Sprite_Chronicle_Clock.prototype.initialize;
    Sprite_Chronicle_Clock.prototype.initialize = function() {
        _Sprite_Chronicle_Clock_initialize.apply(this, arguments);
        this.x = getParamNumber('時計X座標');
        this.y = getParamNumber('時計Y座標');
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.bitmap = ImageManager.loadPicture(getParamString('文字盤画像ファイル'));
        this.createHourHandSprite();
        this.createMinuteHandSprite();
    };

    Sprite_Chronicle_Clock.prototype.createHourHandSprite = function() {
        var handName = getParamString('短針画像ファイル'), handSprite = new Sprite();
        handSprite.anchor.x = 0.5;
        handSprite.anchor.y = 0.5;
        handSprite.bitmap = handName ? ImageManager.loadPicture(handName) : ImageManager.loadEmptyBitmap();
        handSprite.visible = !!handName;
        this.hourHandSprite = handSprite;
        this.addChild(this.hourHandSprite);
    };

    Sprite_Chronicle_Clock.prototype.createMinuteHandSprite = function() {
        var handName = getParamString('長針画像ファイル'), handSprite = new Sprite();
        handSprite.anchor.x = 0.5;
        handSprite.anchor.y = 0.5;
        handSprite.bitmap = handName ? ImageManager.loadPicture(handName) : ImageManager.loadEmptyBitmap();
        handSprite.visible = !!handName;
        this.minuteHandSprite = handSprite;
        this.addChild(this.minuteHandSprite);
    };

    Sprite_Chronicle_Clock.prototype.update = function() {
        this.visible = this.chronus().isShowingClock();
        if (this.visible && !this.chronus().isTimeStop()) {
            this.updateHourHand();
            this.updateMinuteHand();
        }
    };

    Sprite_Chronicle_Clock.prototype.updateHourHand = function() {
        if (!this.hourHandSprite.visible) return;
        this.hourHandSprite.rotation = this.chronus().getRotationHourHand();
    };

    Sprite_Chronicle_Clock.prototype.updateMinuteHand = function() {
        if (!this.minuteHandSprite.visible) return;
        this.minuteHandSprite.rotation = this.chronus().getRotationMinuteHand();
    };

    Sprite_Chronicle_Clock.prototype.chronus = function() {
        return $gameSystem.chronus();
    };

    //=============================================================================
    // Spriteset_Map
    //  アナログ時計の画像を追加定義します。
    //=============================================================================
    var _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function() {
        _Spriteset_Base_createUpperLayer.apply(this, arguments);
        if (this instanceof Spriteset_Map) this.createClockSprite();
    };

    Spriteset_Map.prototype.createClockSprite = function() {
        if (isParamExist('文字盤画像ファイル')) {
            this._clockSprite = new Sprite_Chronicle_Clock();
            this.addChild(this._clockSprite);
        }
    };

    //=============================================================================
    // Game_Chronus
    //  時の流れを扱うクラスです。このクラスはGame_Systemクラスで生成されます。
    //  セーブデータの保存対象のためグローバル領域に定義します。
    //=============================================================================
    Game_Chronus.prototype             = Object.create(Game_Chronus.prototype);
    Game_Chronus.prototype.constructor = Game_Chronus;
    Game_Chronus.weatherTypes          = ['none', 'rain', 'storm', 'snow'];

    Game_Chronus.prototype.initialize = function () {
        this._timeMeter       = 0;            // 一日の中での時間経過（分単位）60 * 24
        this._dayMeter        = 0;            // ゲーム開始からの累計日数
        this._stop            = true;         // 停止フラグ（全ての加算に対して有効。ただし手動による加算は例外）
        this._disableTint     = false;        // 色調変更禁止フラグ
        this._calendarVisible = false;        // カレンダー表示フラグ
        this._disableWeather  = false;        // 天候制御禁止フラグ
        this._weatherType     = 0;            // 天候タイプ(0:なし 1:雨 2:嵐 :3雪)
        this._weatherPower    = 0;            // 天候の強さ
        this._weatherCounter  = 0;            // 同一天候の維持時間
        this._weatherSnowLand = false;        // 降雪地帯フラグ
        this._clockVisible    = false;        // アナログ時計表示フラグ
        this._realTime        = false;        // 実時間フラグ
        this._frameCount      = 0;
        this._demandRefresh   = false;
        this._prevHour        = -1;
        this._nowDate         = null;
        this._timeAutoAdd     = getParamNumber('自然時間加算', 0, 99);
        this._timeTransferAdd = getParamNumber('場所移動時間加算', 0);
        this._timeBattleAdd   = getParamNumber('戦闘時間加算(固定)', 0);
        this._timeTurnAdd     = getParamNumber('戦闘時間加算(ターン)', 0);
        this._weekNames       = getParamArrayString('曜日配列');
        this._daysOfMonth     = getParamArrayNumber('月ごとの日数配列');
        this.onLoad();
    };

    Game_Chronus.prototype.onLoad = function () {
        this._nowDate = new Date();
        if (!this._frameCount) this._frameCount = 0;
    };

    Game_Chronus.prototype.update = function () {
        this.updateEffect();
        if (this.isTimeStop()) return;
        this._frameCount++;
        if (this._frameCount >= 60) {
            if (this.isRealTime()) this._nowDate.setTime(Date.now());
            this.addTime();
        }
    };

    Game_Chronus.prototype.isRealTime = function () {
        return !!this._realTime;
    };

    Game_Chronus.prototype.isTimeStop = function() {
        return this.isStop() || $gameMap.isEventRunning();
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

    Game_Chronus.prototype.setTint = function (timeId, swift) {
        var tone = [0, 0, 0, 0];
        settings.timeTone.forEach(function(toneInfo) {
            if (toneInfo.timeId === timeId) {
                tone = toneInfo.value.clone();
                if (tone.length < 4) throw new Error('色調の値が不正です。:' + tone);
            }
        }.bind(this));
        if (this.getWeatherTypeId() !== 0) {
            tone[0] > 0 ? tone[0] /= 7 : tone[0] -= 14;
            tone[1] > 0 ? tone[1] /= 7 : tone[1] -= 14;
            tone[2] > 0 ? tone[2] /= 7 : tone[1] -= 14;
            tone[3] === 0 ? tone[3] = 68 : tone[3] += 14;
        }
        $gameScreen.startTint(tone, swift ? 0 : this.getEffectDuration());
    };

    Game_Chronus.prototype.setWeatherType = function(value) {
        this._weatherType = value.clamp(0, Game_Chronus.weatherTypes.length - 1);
    };

    Game_Chronus.prototype.setWeatherPower = function(value) {
        this._weatherPower = value.clamp(0, 10);
    };

    Game_Chronus.prototype.setTimeAutoAdd = function(value) {
        this._timeAutoAdd = value.clamp(0, 99);
    };

    Game_Chronus.prototype.controlWeather = function (force) {
        if (!force && Math.random() * 10 > this._weatherCounter - 7) {
            this._weatherCounter++;
        } else {
            this._weatherCounter = 0;
            if (Math.random() * 10 > 7) {
                this.setWeatherType(this.isSnowLand() ? 3 : Math.random() * 10 > 6 ? 2 : 1);
                this.setWeatherPower(Math.floor(Math.random() * 10));
            } else {
                this.setWeatherType(0);
                this.setWeatherPower(0);
            }
        }
        this.refreshWeather(false);
    };

    Game_Chronus.prototype.refreshWeather = function (swift) {
        this.isEnableWeather() ? this.setScreenWeather(swift) : $gameScreen.changeWeather(0, 0, 0);
    };

    Game_Chronus.prototype.setScreenWeather = function (swift) {
        $gameScreen.changeWeather(this.getWeatherType(), this._weatherPower, swift ? 0 : this.getEffectDuration());
    };

    Game_Chronus.prototype.getEffectDuration = function () {
        return this.isRealTime() ? 600 : Math.floor(60 * 5 / (this._timeAutoAdd / 10));
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

    Game_Chronus.prototype.setTimeReal = function () {
        this._realTime = true;
    };

    Game_Chronus.prototype.setTimeVirtual = function () {
        this._realTime = false;
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

    Game_Chronus.prototype.showClock = function () {
        this._clockVisible = true;
    };

    Game_Chronus.prototype.hideClock = function () {
        this._clockVisible = false;
    };

    Game_Chronus.prototype.isShowingClock = function () {
        return this._clockVisible;
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
        var newDay = (year - 1) * this.getDaysOfYear();
        for (var i = 0; i < month - 1; i++) {
            newDay += this._daysOfMonth[i];
        }
        newDay += day - 1;
        this._dayMeter = newDay;
        this.demandRefresh(true);
    };

    Game_Chronus.prototype.demandRefresh = function (effectRefreshFlg) {
        this._demandRefresh = true;
        this._frameCount = 0;
        this.setGameVariable();
        if (effectRefreshFlg) {
            this.refreshTint(true);
            this.controlWeather(true);
        }
    };

    Game_Chronus.prototype.isNeedRefresh = function() {
        var needRefresh = this._demandRefresh;
        this._demandRefresh = false;
        return needRefresh;
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
        var index = getParamNumber(paramName, 0, 5000);
        if (index !== 0) $gameVariables.setValue(index, value);
    };

    Game_Chronus.prototype.getMonthOfYear = function () {
        return this._daysOfMonth.length;
    };

    Game_Chronus.prototype.getWeekName = function () {
        return this._weekNames[this.getWeekIndex()];
    };

    Game_Chronus.prototype.getWeekIndex = function () {
        return this.isRealTime() ? this._nowDate.getDay() : this._dayMeter % this.getDaysOfWeek();
    };

    Game_Chronus.prototype.getYear = function () {
        return this.isRealTime() ? this._nowDate.getFullYear() : Math.floor(this._dayMeter / this.getDaysOfYear()) + 1;
    };

    Game_Chronus.prototype.getMonth = function () {
        if (this.isRealTime()) return this._nowDate.getMonth() + 1;
        var days = this._dayMeter % this.getDaysOfYear();
        for (var i = 0; i < this._daysOfMonth.length; i++) {
            days -= this._daysOfMonth[i];
            if (days < 0) return i + 1;
        }
        return null;
    };

    Game_Chronus.prototype.getDay = function () {
        if (this.isRealTime()) return this._nowDate.getDate();
        var days = this._dayMeter % this.getDaysOfYear();
        for (var i = 0; i < this._daysOfMonth.length; i++) {
            if (days < this._daysOfMonth[i]) return days + 1;
            days -= this._daysOfMonth[i];
        }
        return null;
    };

    Game_Chronus.prototype.getHour = function () {
        return this.isRealTime() ? this._nowDate.getHours() : Math.floor(this._timeMeter / 60);
    };

    Game_Chronus.prototype.getMinute = function () {
        return this.isRealTime() ? this._nowDate.getMinutes() : this._timeMeter % 60;
    };

    Game_Chronus.prototype.getDateFormat = function(index) {
        var format = getParamString('日時フォーマット' + String(index));
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
        var timeId = 0;
        settings.timeZone.forEach(function(zoneInfo) {
            if (this.isHourInRange(zoneInfo.start, zoneInfo.end)) timeId = zoneInfo.timeId;
        }.bind(this));
        return timeId;
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

    Game_Chronus.prototype.getAnalogueHour = function() {
        return this.getHour() + (this.getAnalogueMinute() / 60);
    };

    Game_Chronus.prototype.getAnalogueMinute = function() {
        return this.getMinute() + (this.isRealTime() ? 0 : this._frameCount / 60 * this._timeAutoAdd);
    };

    Game_Chronus.prototype.getRotationHourHand = function() {
        return (this.getAnalogueHour() % 12) * (360 / 12) * Math.PI / 180;
    };

    Game_Chronus.prototype.getRotationMinuteHand = function() {
        return this.getAnalogueMinute() * (360 / 60) * Math.PI / 180;
    };
})();
