//=============================================================================
// CustomizeConfigItem.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.2.0 2021/12/21 項目に余白を設定できる機能を追加
// 3.1.3 2021/08/09 セーブデータをロードした際に、追加オプションの設定値がゲーム変数に反映されない問題を修正
// 3.1.2 2021/08/05 セーブがある状態で隠し項目を追加した時に上手く動作しない問題を修正
// 3.1.1 2020/10/13 Mano_InputConfig.jsと併用したとき、項目を末尾以外に追加すると表示不整合が発生する競合を修正
// 3.1.0 2020/08/20 スイッチ項目でONとOFFの表示文字列を変更できる機能を追加
// 3.0.0 2020/08/20 MZで動作するよう全面的に修正
// 2.1.0 2017/12/15 追加項目のデフォルト項目を含めた並び順を自由に設定できる機能を追加
//                  項目名称を日本語化
// 2.0.1 2017/10/15 2.0.0の修正によりスイッチ項目を有効にしたときにゲーム開始するとエラーになる問題を修正
// 2.0.0 2017/09/10 ツクールの型指定機能に対応し、各オプション項目を任意の数だけ追加できる機能を追加
// 1.2.3 2017/06/08 1.2.2の修正により起動できなくなっていた問題を修正
// 1.2.2 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.2.1 2016/12/08 1.2.0の機能追加以降、デフォルト項目で決定ボタンを押すとエラーになっていた現象を修正
// 1.2.0 2016/12/02 各項目で決定ボタンを押したときに実行されるスクリプトを設定できる機能を追加
// 1.1.1 2016/08/14 スイッチ項目、音量項目の初期値が無効になっていた問題を修正
// 1.1.0 2016/04/29 項目をクリックしたときに項目値が循環するよう修正
// 1.0.0 2016/01/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc オプション任意項目作成プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CustomizeConfigItem.js
 * @author トリアコンタン
 * @base PluginCommonBase
 *
 * @param NumberOptions
 * @text 数値項目
 * @desc 追加する数値項目のオプション項目情報です。
 * @default
 * @type struct<NumberData>[]
 *
 * @param StringOptions
 * @text 文字列項目
 * @desc 追加する文字項目のオプション項目情報です。
 * @default
 * @type struct<StringData>[]
 *
 * @param SwitchOptions
 * @text スイッチ項目
 * @desc 追加するスイッチ項目のオプション項目情報です。
 * @default
 * @type struct<BooleanData>[]
 *
 * @param VolumeOptions
 * @text 音量項目
 * @desc 追加する音量項目のオプション項目情報です。
 * @default
 * @type struct<VolumeData>[]
 *
 * @command UNLOCK
 * @text オプション任意項目の隠し解除
 * @desc 指定した項目の隠しフラグを解除します。
 *
 * @arg name
 * @text 項目名
 * @desc 対象の項目名称です。
 * @default
 *
 * @help オプション画面に任意の項目を追加します。
 * 項目の種類は、以下の四種類があります。
 * 不要な項目は値を空に設定してください。
 *
 * ・スイッチ項目：
 * ON/OFFを選択する項目です。指定した番号のスイッチと値が同期されます。
 * オプションから値を設定すれば、それがスイッチに反映され、
 * スイッチを変更すれば、オプションの値に反映されます。
 * さらに、値はセーブデータ間で共有されます。
 * 隠しフラグを設定すると、オプション画面に表示されなくなります。
 * ゲームを進めないと出現しない項目などに利用できます。
 * 隠しフラグはプラグインコマンドから解除できます。
 *
 * スクリプトは上級者向け項目です。対象にカーソルを合わせて決定ボタンを
 * 押下すると指定したJavaScriptを実行できます。
 * 主に専用の設定画面などの遷移に使用します。
 *
 * ・数値項目：
 * 数値を選択する項目です。指定した番号の変数と値が同期されます。
 * スイッチ項目で指定した内容に加えて、
 * 最小値と最大値および一回の入力で変化する値を指定します。
 *
 * ・音量項目：
 * 音量を選択する項目です。BGMボリュームなどと同じ仕様で
 * キャラクターごとのボイス音量等に使ってください。
 *
 * ・文字項目：
 * 文字を選択する項目です。指定した文字の配列から項目を選択します。
 * 選択した文字のインデックス(開始位置は0)が変数に設定されます。
 * 初期値に設定する値もインデックスです。
 *
 * 項目には余白を設定できますが、設定した場合は
 * オプションウィンドウのスクロールが無効になります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~NumberData:
 * @param Name
 * @text 項目名称
 * @desc 項目の名称です。
 * @default 数値項目1
 *
 * @param DefaultValue
 * @text 初期値
 * @desc 項目の初期値です。
 * @default 0
 * @type number
 *
 * @param VariableID
 * @text 変数番号
 * @desc 項目の設定内容が格納される変数番号です。
 * @default 0
 * @type variable
 *
 * @param HiddenFlag
 * @text 隠しフラグ
 * @desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
 * @default false
 * @type boolean
 *
 * @param Script
 * @text スクリプト
 * @desc 項目を決定したときに実行されるスクリプトです。
 * @default
 *
 * @param NumberMin
 * @text 最小値
 * @desc 項目の最小値です。
 * @default 0
 * @type number
 *
 * @param NumberMax
 * @text 最大値
 * @desc 項目の最大値です。
 * @default 100
 * @type number
 *
 * @param NumberStep
 * @text 変化値
 * @desc 項目を操作したときの数値の変化量です。
 * @default 20
 * @type number
 *
 * @param AddPosition
 * @text 追加位置
 * @desc 項目を追加する位置です。指定した項目の上に追加されます。
 * @default
 * @type select
 * @option 末尾に追加
 * @value
 * @option 常時ダッシュ
 * @value alwaysDash
 * @option コマンド記憶
 * @value commandRemember
 * @option タッチUI
 * @value touchUI
 * @option BGM 音量
 * @value bgmVolume
 * @option BGS 音量
 * @value bgsVolume
 * @option ME 音量
 * @value meVolume
 * @option SE 音量
 * @value seVolume
 *
 * @param PaddingTop
 * @text 余白
 * @desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
 * @default 0
 * @type number
 */
/*~struct~BooleanData:
 * @param Name
 * @text 項目名称
 * @desc 項目の名称です。
 * @default スイッチ項目1
 *
 * @param DefaultValue
 * @text 初期値
 * @desc 項目の初期値です。
 * @default false
 * @type boolean
 *
 * @param SwitchID
 * @text スイッチ番号
 * @desc 項目の設定内容が格納されるスイッチ番号です。
 * @default 0
 * @type switch
 *
 * @param OnText
 * @text ONテキスト
 * @desc スイッチがONのときにオプションウィンドウに表示されるテキストです。省略するとONになります。
 * @default
 *
 * @param OffText
 * @text OFFテキスト
 * @desc スイッチがONのときにオプションウィンドウに表示されるテキストです。省略するとOFFになります。
 * @default
 *
 * @param HiddenFlag
 * @text 隠しフラグ
 * @desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
 * @default false
 * @type boolean
 *
 * @param Script
 * @text スクリプト
 * @desc 項目を決定したときに実行されるスクリプトです。
 * @default
 *
 * @param AddPosition
 * @text 追加位置
 * @desc 項目を追加する位置です。指定した項目の上に追加されます。
 * @default
 * @type select
 * @option 末尾に追加
 * @value
 * @option 常時ダッシュ
 * @value alwaysDash
 * @option コマンド記憶
 * @value commandRemember
 * @option タッチUI
 * @value touchUI
 * @option BGM 音量
 * @value bgmVolume
 * @option BGS 音量
 * @value bgsVolume
 * @option ME 音量
 * @value meVolume
 * @option SE 音量
 * @value seVolume
 *
 * @param PaddingTop
 * @text 余白
 * @desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
 * @default 0
 * @type number
 */
/*~struct~StringData:
 * @param Name
 * @text 項目名称
 * @desc 項目の名称です。
 * @default 文字列項目1
 *
 * @param DefaultValue
 * @text 初期値
 * @desc 項目の初期値です。インデックスの数値を指定します。
 * @default 0
 * @type number
 *
 * @param VariableID
 * @text 変数番号
 * @desc 項目の設定内容が格納される変数番号です。
 * @default 0
 * @type variable
 *
 * @param HiddenFlag
 * @text 隠しフラグ
 * @desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
 * @default false
 * @type boolean
 *
 * @param Script
 * @text スクリプト
 * @desc 項目を決定したときに実行されるスクリプトです。
 * @default
 *
 * @param StringItems
 * @text 内容の配列
 * @desc 項目の設定内容の配列です。
 * @default
 * @type string[]
 *
 * @param AddPosition
 * @text 追加位置
 * @desc 項目を追加する位置です。指定した項目の上に追加されます。
 * @default
 * @type select
 * @option 末尾に追加
 * @value
 * @option 常時ダッシュ
 * @value alwaysDash
 * @option コマンド記憶
 * @value commandRemember
 * @option タッチUI
 * @value touchUI
 * @option BGM 音量
 * @value bgmVolume
 * @option BGS 音量
 * @value bgsVolume
 * @option ME 音量
 * @value meVolume
 * @option SE 音量
 * @value seVolume
 *
 * @param PaddingTop
 * @text 余白
 * @desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
 * @default 0
 * @type number
 */
/*~struct~VolumeData:
 * @param Name
 * @text 項目名称
 * @desc 項目の名称です。
 * @default 音量項目1
 *
 * @param DefaultValue
 * @text 初期値
 * @desc 項目の初期値です。
 * @default 0
 * @type number
 *
 * @param VariableID
 * @text 変数番号
 * @desc 項目の設定内容が格納される変数番号です。
 * @default 0
 * @type variable
 *
 * @param HiddenFlag
 * @text 隠しフラグ
 * @desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
 * @default false
 * @type boolean
 *
 * @param Script
 * @text スクリプト
 * @desc 項目を決定したときに実行されるスクリプトです。
 * @default
 *
 * @param AddPosition
 * @text 追加位置
 * @desc 項目を追加する位置です。指定した項目の上に追加されます。
 * @default
 * @type select
 * @option 末尾に追加
 * @value
 * @option 常時ダッシュ
 * @value alwaysDash
 * @option コマンド記憶
 * @value commandRemember
 * @option タッチUI
 * @value touchUI
 * @option BGM 音量
 * @value bgmVolume
 * @option BGS 音量
 * @value bgsVolume
 * @option ME 音量
 * @value meVolume
 * @option SE 音量
 * @value seVolume
 *
 * @param PaddingTop
 * @text 余白
 * @desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
 * @default 0
 * @type number
 */

(function() {
    'use strict';
    var script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'UNLOCK', function(args) {
        ConfigManager.customParamUnlock(args.name);
    });

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = PluginManagerEx.createParameter(script);
    if (!param.NumberOptions) {
        param.NumberOptions = [];
    }
    if (!param.StringOptions) {
        param.StringOptions = [];
    }
    if (!param.SwitchOptions) {
        param.SwitchOptions = [];
    }
    if (!param.VolumeOptions) {
        param.VolumeOptions = [];
    }

    var localOptionWindowIndex = 0;

    //=============================================================================
    // ConfigManager
    //  追加項目の設定値や初期値を管理します。
    //=============================================================================
    ConfigManager.customParams   = null;
    ConfigManager.hiddenInfo     = {};
    ConfigManager._symbolNumber  = 'Number';
    ConfigManager._symbolBoolean = 'Boolean';
    ConfigManager._symbolString  = 'String';
    ConfigManager._symbolVolume  = 'Volume';

    ConfigManager.getCustomParams = function() {
        if (this.customParams) {
            return this.customParams;
        }
        this.customParams = {};
        param.NumberOptions.forEach(function(optionItem, index) {
            this.makeNumberOption(optionItem, index);
        }, this);
        param.StringOptions.forEach(function(optionItem, index) {
            this.makeStringOption(optionItem, index);
        }, this);
        param.SwitchOptions.forEach(function(optionItem, index) {
            this.makeSwitchOption(optionItem, index);
        }, this);
        param.VolumeOptions.forEach(function(optionItem, index) {
            this.makeVolumeOption(optionItem, index);
        }, this);
        return this.customParams;
    };

    ConfigManager.makeNumberOption = function(optionItem, index) {
        var data    = this.makeCommonOption(optionItem, index, this._symbolNumber);
        data.min    = optionItem.NumberMin;
        data.max    = optionItem.NumberMax;
        data.offset = optionItem.NumberStep;
        this.pushOptionData(data);
    };

    ConfigManager.makeStringOption = function(optionItem, index) {
        var data    = this.makeCommonOption(optionItem, index, this._symbolString);
        data.values = optionItem.StringItems || ['no item'];
        data.min    = 0;
        data.max    = data.values.length - 1;
        this.pushOptionData(data);
    };

    ConfigManager.makeSwitchOption = function(optionItem, index) {
        var data       = this.makeCommonOption(optionItem, index, this._symbolBoolean);
        data.variable  = optionItem.SwitchID;
        data.onText    = optionItem.OnText;
        data.offText   = optionItem.OffText;
        this.pushOptionData(data);
    };

    ConfigManager.makeVolumeOption = function(optionItem, index) {
        var data = this.makeCommonOption(optionItem, index, this._symbolVolume);
        this.pushOptionData(data);
    };

    ConfigManager.makeCommonOption = function(optionItem, index, type) {
        var data       = {};
        data.symbol    = `${type}${index + 1}`;
        data.name      = optionItem.Name;
        data.hidden    = optionItem.HiddenFlag;
        data.script    = optionItem.Script;
        data.initValue = optionItem.DefaultValue;
        data.variable  = optionItem.VariableID || 0;
        data.addPotion = optionItem.AddPosition;
        data.padding   = optionItem.PaddingTop;
        return data;
    };

    ConfigManager.pushOptionData = function(data) {
        this.customParams[data.symbol] = data;
    };

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData      = function() {
        var config        = _ConfigManager_makeData.apply(this, arguments);
        config.hiddenInfo = {};
        iterate(this.getCustomParams(), function(symbol) {
            config[symbol]            = this[symbol];
            config.hiddenInfo[symbol] = this.hiddenInfo[symbol];
        }.bind(this));
        return config;
    };

    var _ConfigManager_load = ConfigManager.load;
    ConfigManager.load = function() {
        this.applyData({});
        _ConfigManager_load.apply(this, arguments);
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData      = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        iterate(this.getCustomParams(), function(symbol, item) {
            if (symbol.contains(this._symbolBoolean)) {
                this[symbol] = this.readFlagCustom(config, symbol, item);
            } else if (symbol.contains(this._symbolVolume)) {
                this[symbol] = this.readVolumeCustom(config, symbol, item);
            } else {
                this[symbol] = this.readOther(config, symbol, item);
            }
            if (config.hiddenInfo && config.hiddenInfo.hasOwnProperty(symbol)) {
                this.hiddenInfo[symbol] = config.hiddenInfo[symbol];
            } else {
                this.hiddenInfo[symbol] = item.hidden;
            }
        }.bind(this));
    };

    ConfigManager.customParamUnlock = function(name) {
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.name === name) this.hiddenInfo[symbol] = false;
        }.bind(this));
        this.save();
    };

    ConfigManager.readOther = function(config, name, item) {
        var value = config[name];
        if (value !== undefined) {
            return Number(value).clamp(item.min, item.max);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.readFlagCustom = function(config, name, item) {
        if (config[name] !== undefined) {
            return this.readFlag(config, name);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.readVolumeCustom = function(config, name, item) {
        if (config[name] !== undefined) {
            return this.readVolume(config, name);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.exportCustomParams = function() {
        if (!$gameVariables || !$gameSwitches) return;
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.variable > 0) {
                if (symbol.contains(this._symbolBoolean)) {
                    $gameSwitches.setValue(item.variable, !!this[symbol]);
                } else {
                    $gameVariables.setValue(item.variable, this[symbol]);
                }
            }
        }.bind(this));
    };

    ConfigManager.importCustomParams = function() {
        if (!$gameVariables || !$gameSwitches) return;
        iterate(this.getCustomParams(), function(symbol, item) {
            if (item.variable > 0) {
                if (symbol.contains(this._symbolBoolean)) {
                    this[symbol] = $gameSwitches.value(item.variable);
                } else if (symbol.contains(this._symbolVolume)) {
                    this[symbol] = $gameVariables.value(item.variable).clamp(0, 100);
                } else {
                    this[symbol] = $gameVariables.value(item.variable).clamp(item.min, item.max);
                }
            }
        }.bind(this));
    };

    var _ConfigManager_save = ConfigManager.save;
    ConfigManager.save      = function() {
        _ConfigManager_save.apply(this, arguments);
        this.exportCustomParams();
    };

    //=============================================================================
    // Game_Map
    //  リフレッシュ時にオプション値を同期します。
    //=============================================================================
    var _Game_Map_refresh      = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function() {
        _Game_Map_refresh.apply(this, arguments);
        ConfigManager.importCustomParams();
    };

    //=============================================================================
    // DataManager
    //  セーブ時とロード時にオプション値を同期します。
    //=============================================================================
    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame      = function() {
        _DataManager_setupNewGame.apply(this, arguments);
        ConfigManager.exportCustomParams();
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.apply(this, arguments);
        ConfigManager.exportCustomParams();
    };

    var _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    Scene_Options.prototype.maxCommands = function() {
        return _Scene_Options_maxCommands.apply(this, arguments) +
            param.NumberOptions.length + param.StringOptions.length +
            param.SwitchOptions.length + param.VolumeOptions.length;
    };

    var _Scene_Options_maxVisibleCommands = Scene_Options.prototype.maxVisibleCommands;
    Scene_Options.prototype.maxVisibleCommands = function() {
        var result = _Scene_Options_maxVisibleCommands.apply(this, arguments);
        return this.findPaddingHeight() > 0 ? Infinity : result;
    };

    var _Scene_Options_optionsWindowRect = Scene_Options.prototype.optionsWindowRect;
    Scene_Options.prototype.optionsWindowRect = function() {
        var rect = _Scene_Options_optionsWindowRect.apply(this, arguments);
        rect.height += this.findPaddingHeight();
        return rect;
    };

    Scene_Options.prototype.findPaddingHeight = function() {
        var params = ConfigManager.getCustomParams();
        return Object.keys(params).reduce(function (prev, key) {
            return prev + (params[key].padding || 0);
        }, 0);
    };

    //=============================================================================
    // Window_Options
    //  追加項目を描画します。
    //=============================================================================
    var _Window_Options_initialize      = Window_Options.prototype.initialize;
    Window_Options.prototype.initialize = function() {
        this._customParams = ConfigManager.getCustomParams();
        _Window_Options_initialize.apply(this, arguments);
        this.select(localOptionWindowIndex);
        localOptionWindowIndex = 0;
    };

    var _Window_Options_itemRect = Window_Options.prototype.itemRect;
    Window_Options.prototype.itemRect = function(index) {
        var rect = _Window_Options_itemRect.apply(this, arguments);
        rect.y += this.findPaddingHeight(index);
        return rect;
    };

    Window_Options.prototype.findPaddingHeight = function(index) {
        return this._list.reduce(function(prev, item, itemIndex) {
            return prev + (itemIndex <= index && item.ext ? item.ext : 0);
        }, 0);
    };

    var _Window_Options_makeCommandList      = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.apply(this, arguments);
        this.addCustomOptions();
    };

    Window_Options.prototype.addCustomOptions = function() {
        iterate(this._customParams, function(key, item) {
            if (!ConfigManager.hiddenInfo[key]) {
                this.addCommand(item.name, key, undefined, item.padding);
                if (item.addPotion) {
                    this.shiftCustomOptions(item.addPotion);
                }
            }
        }.bind(this));
    };

    Window_Options.prototype.shiftCustomOptions = function(addPotion) {
        var targetCommand = this._list.filter(function(command) {
            return command.symbol === addPotion;
        })[0];
        if (!targetCommand) {
            return;
        }
        var targetIndex = this._list.indexOf(targetCommand);
        var newCommand = this._list.pop();
        this.addIndexForManoInputConfig(targetIndex);
        this._list.splice(targetIndex, 0, newCommand);
    };

    Window_Options.prototype.addIndexForManoInputConfig = function(index) {
        if (this._gamepadOptionIndex > index) {
            this._gamepadOptionIndex += 1;
        }
        if (this._keyboardConfigIndex > index) {
            this._keyboardConfigIndex += 1;
        }
    };

    var _Window_Options_statusText      = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var result = _Window_Options_statusText.apply(this, arguments);
        var symbol = this.commandSymbol(index);
        var value  = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            result = this.numberStatusText(value);
        } else if (this.isStringSymbol(symbol)) {
            result = this.stringStatusText(value, symbol);
        } else if (this.isBooleanSymbol(symbol)) {
            result = this.booleanCustomStatusText(value, symbol);
        }
        return result;
    };

    Window_Options.prototype.isNumberSymbol = function(symbol) {
        return symbol.contains(ConfigManager._symbolNumber);
    };

    Window_Options.prototype.isStringSymbol = function(symbol) {
        return symbol.contains(ConfigManager._symbolString);
    };

    Window_Options.prototype.isBooleanSymbol = function(symbol) {
        return symbol.contains(ConfigManager._symbolBoolean);
    };

    Window_Options.prototype.isCustomSymbol = function(symbol) {
        return !!this._customParams[symbol];
    };

    Window_Options.prototype.numberStatusText = function(value) {
        return value;
    };

    Window_Options.prototype.stringStatusText = function(value, symbol) {
        return this._customParams[symbol].values[value];
    };

    Window_Options.prototype.booleanCustomStatusText = function(value, symbol) {
        var data = this._customParams[symbol];
        var property = value ? 'onText' : 'offText';
        if (data && data[property]) {
            return data[property];
        } else {
            return this.booleanStatusText(value);
        }
    };

    var _Window_Options_processOk      = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        if (!this._shiftValue(1, true)) _Window_Options_processOk.apply(this, arguments);
        this.execScript();
    };

    var _Window_Options_cursorRight      = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        if (!this._shiftValue(1, false)) _Window_Options_cursorRight.apply(this, arguments);
    };

    var _Window_Options_cursorLeft      = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        if (!this._shiftValue(-1, false)) _Window_Options_cursorLeft.apply(this, arguments);
    };

    Window_Options.prototype._shiftValue = function(sign, loopFlg) {
        var symbol = this.commandSymbol(this.index());
        var value  = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            value += this.numberOffset(symbol) * sign;
            this.changeValue(symbol, this._clampValue(value, symbol, loopFlg));
            return true;
        }
        if (this.isStringSymbol(symbol)) {
            value += sign;
            this.changeValue(symbol, this._clampValue(value, symbol, loopFlg));
            return true;
        }
        return false;
    };

    Window_Options.prototype.execScript = function() {
        var symbol = this.commandSymbol(this.index());
        if (!this.isCustomSymbol(symbol)) return;
        var script = this._customParams[symbol].script;
        if (script) eval(script);
        localOptionWindowIndex = this.index();
    };

    Window_Options.prototype._clampValue = function(value, symbol, loopFlg) {
        var maxValue = this._customParams[symbol].max;
        var minValue = this._customParams[symbol].min;
        if (loopFlg) {
            if (value > maxValue) value = minValue;
            if (value < minValue) value = maxValue;
        }
        return value.clamp(this._customParams[symbol].min, this._customParams[symbol].max);
    };

    Window_Options.prototype.numberOffset = function(symbol) {
        var value = this._customParams[symbol].offset;
        if (Input.isPressed('shift')) value *= 10;
        return value;
    };
})();

