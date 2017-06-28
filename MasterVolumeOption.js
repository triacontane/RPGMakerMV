//=============================================================================
// MasterVolumeOption.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2017/06/29 マスターボリュームの増減値を変更したときに計算誤差が表示される場合がある問題を修正
// 1.1.0 2017/06/26 ボリュームの変化量を変更できる機能を追加（byツミオさん）
// 1.0.0 2017/06/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MasterVolumePlugin
 * @author triacontane      (Tsumio altered a portion.)
 *
 * @param ItemName
 * @type string
 * @desc It is a setting item name displayed on Options.
 * @default Master Volume
 *
 * @param DefaultValue
 * @type number
 * @desc Default value of the master volume.
 * @default 100
 * 
 * @param OffsetValue
 * @type number
 * @desc Offset value of the all volume(including other volume).
 * @default 20
 *
 * @help Add the master volume to the option screen using the master volume API
 * added in RPG Maker version 1.5.0.
 * You can adjust the volume of all BGM / BGS / ME / SE at once.
 *
 * Of course, it can not be used on main body version 1.5.0 or earlier.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc マスターボリューム設定プラグイン
 * @author トリアコンタン     （ツミオが一部改変）
 *
 * @param 項目名称
 * @type string
 * @desc オプション画面に表示される設定項目名称です。
 * @default 全体 音量
 *
 * @param 初期値
 * @type number
 * @desc マスターボリュームの初期値です。
 * @default 100
 * 
 * @param 音量の増減量
 * @type number
 * @desc マスターボリュームと、その他全ての音量値を含めた音量の増減量です。
 * @default 20
 *
 * @help 本体バージョン1.5.0で追加されたマスターボリュームAPIを利用して
 * オプション画面にマスターボリュームを追加します。
 * BGM/BGS/ME/SE全ての音量を一括調整できます。
 *
 * 本体バージョン1.5.0以前では使用できません。
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
    var pluginName = 'MasterVolumeOption';

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

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param          = {};
    param.itemName     = getParamString(['ItemName', '項目名称']);
    param.defaultValue = getParamNumber(['DefaultValue', '初期値']);
    param.offsetValue  = getParamNumber(['OffsetValue', '音量の増減量']);//ツミオ加筆

    //=============================================================================
    // ConfigManager
    //  マスターボリュームの設定機能を追加します。
    //=============================================================================
    Object.defineProperty(ConfigManager, 'masterVolume', {
        get: function() {
            return Math.floor(AudioManager._masterVolume * 100);
        },
        set: function(value) {
            AudioManager.masterVolume = value.clamp(0, 100) / 100;
        }
    });

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData      = function() {
        var config          = _ConfigManager_makeData.apply(this, arguments);
        config.masterVolume = this.masterVolume;
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData      = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        var symbol        = 'masterVolume';
        this.masterVolume = config.hasOwnProperty(symbol) ? this.readVolume(config, symbol) : param.defaultValue;
    };

    //=============================================================================
    // Window_Options
    //  マスターボリュームの設定項目を追加します。
    //=============================================================================
    var _Window_Options_addVolumeOptions      = Window_Options.prototype.addVolumeOptions;
    Window_Options.prototype.addVolumeOptions = function() {
        this.addCommand(param.itemName, 'masterVolume');
        _Window_Options_addVolumeOptions.apply(this, arguments);
    };

    //=============================================================================
    // Window_Options
    //  バーの移動量の設定を付け加えます（ツミオ加筆）
    //=============================================================================
    var _Window_Options_volumeOffset      = Window_Options.prototype.volumeOffset;
    Window_Options.prototype.volumeOffset = function() {
        _Window_Options_volumeOffset.call(this);
        return param.offsetValue;
    };

})();

