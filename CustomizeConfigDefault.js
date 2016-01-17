//=============================================================================
// CustomizeConfigDefault.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2016/01/17 競合対策
// 1.0.1 2015/11/01 既存コードの再定義方法を修正（内容に変化なし）
// 1.0.0 2015/11/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Optionsデフォルト値設定プラグイン
 * @author トリアコンタン
 *
 * @param alwaysDash
 * @desc 常にダッシュする。（Shiftキーを押している場合のみ歩行）ON:true OFF:false
 * @default OFF
 *
 * @param commandRemember
 * @desc 選択したコマンドを記憶する。ON:true OFF:false
 * @default OFF
 *
 * @param bgmVolume
 * @desc BGMの音量。0-100
 * @default 100
 *
 * @param bgsVolume
 * @desc BGSの音量。0-100
 * @default 100
 *
 * @param meVolume
 * @desc MEの音量。0-100
 * @default 100
 *
 * @param seVolume
 * @desc SEの音量。0-100
 * @default 100
 *
 * @help Optionsで設定可能な項目のデフォルト値を、指定した値に変更します。
 * 例えば、初回からalwaysDashをONにしておけば
 * プレイヤーが設定を変更する手間を省くことができます。
 * この処理はconfig.rpgsaveが未作成の場合にのみ実行されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    var pluginName = 'CustomizeConfigDefault';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // ConfigManager
    //  それぞれの項目に初期値を与えます。
    //=============================================================================
    var _ConfigManagerApplyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManagerApplyData.apply(this, arguments);
        if (config.alwaysDash == null)      this.alwaysDash      = getParamBoolean('alwaysDash');
        if (config.commandRemember == null) this.commandRemember = getParamBoolean('commandRemember');
        if (config.bgmVolume == null)       this.bgmVolume       = getParamNumber('bgmVolume', 0, 100);
        if (config.bgsVolume == null)       this.bgsVolume       = getParamNumber('bgsVolume', 0, 100);
        if (config.meVolume == null)        this.meVolume        = getParamNumber('meVolume', 0, 100);
        if (config.seVolume == null)        this.seVolume        = getParamNumber('seVolume', 0, 100);
    };
})();