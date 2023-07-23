//=============================================================================
// MasterVolumeOption.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.1 2023/07/23 コマンド数変更のパラメータを廃止
// 1.2.0 2023/07/20 MZで動作するよう修正
// 1.1.2 2018/01/15 RPGアツマールのマスターボリューム調整機能と競合する旨をヘルプに追記
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
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MasterVolumeOption.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author Triacontane
 *
 * @param itemName
 * @type string
 * @desc It is a setting item name displayed on Options.
 * @default Master Volume
 *
 * @param defaultValue
 * @type number
 * @desc Default value of the master volume.
 * @default 100
 *
 * @param offsetValue
 * @type number
 * @desc Offset value of the all volume(including other volume).
 * @default 20
 *
 * @help MasterVolumeOption.js
 * 
 * Add the master volume to the option screen.
 * You can adjust the volume of all BGM / BGS / ME / SE at once.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc マスターボリューム設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MasterVolumeOption.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param itemName
 * @text 項目名称
 * @type string
 * @desc オプション画面に表示される設定項目名称です。
 * @default マスター音量
 *
 * @param defaultValue
 * @text 初期値
 * @type number
 * @desc マスターボリュームの初期値です。
 * @default 100
 *
 * @param offsetValue
 * @text 音量の増減量
 * @type number
 * @desc マスターボリュームと、その他全ての音量値を含めた音量の増減量です。
 * @default 20
 *
 * @help MasterVolumeOption.js
 * 
 * オプション画面にマスターボリュームを追加します。
 * BGM/BGS/ME/SE全ての音量を一括調整できます。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // ConfigManager
    //  マスターボリュームの設定機能を追加します。
    //=============================================================================
    Object.defineProperty(ConfigManager, 'masterVolume', {
        get: function() {
            return Math.floor(WebAudio._masterVolume * 100);
        },
        set: function(value) {
            WebAudio.setMasterVolume(value.clamp(0, 100) / 100);
        }
    });

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData      = function() {
        const config          = _ConfigManager_makeData.apply(this, arguments);
        config.masterVolume = this.masterVolume;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData      = function(config) {
        _ConfigManager_applyData.apply(this, arguments);
        const symbol        = 'masterVolume';
        this.masterVolume = config.hasOwnProperty(symbol) ? this.readVolume(config, symbol) : param.defaultValue;
    };

    //=============================================================================
    // Window_Options
    //  マスターボリュームの設定項目を追加します。
    //=============================================================================
    const _Window_Options_addVolumeOptions      = Window_Options.prototype.addVolumeOptions;
    Window_Options.prototype.addVolumeOptions = function() {
        this.addCommand(param.itemName, 'masterVolume');
        _Window_Options_addVolumeOptions.apply(this, arguments);
    };

    //=============================================================================
    // Window_Options
    //  バーの移動量の設定を付け加えます（ツミオ加筆）
    //=============================================================================
    const _Window_Options_volumeOffset      = Window_Options.prototype.volumeOffset;
    Window_Options.prototype.volumeOffset = function() {
        _Window_Options_volumeOffset.call(this);
        return param.offsetValue;
    };

    const _Scene_Options_maxCommands = Scene_Options.prototype.maxCommands;
    Scene_Options.prototype.maxCommands = function() {
        return _Scene_Options_maxCommands.apply(this, arguments) + 1;
    };
})();

