//=============================================================================
// CustomizeConfigDefault.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.3 2016/06/22 多言語対応
// 1.0.2 2016/01/17 競合対策
// 1.0.1 2015/11/01 既存コードの再定義方法を修正（内容に変化なし）
// 1.0.0 2015/11/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Setting default value for Options
 * @author triacontane
 *
 * @param AlwaysDash
 * @desc Always dash(ON/OFF)
 * @default OFF
 *
 * @param CommandRemember
 * @desc Command remember(ON/OFF)
 * @default OFF
 *
 * @param BgmVolume
 * @desc BGM Volume(0-100)
 * @default 100
 *
 * @param BgsVolume
 * @desc BGS Volume(0-100)
 * @default 100
 *
 * @param MeVolume
 * @desc ME Volume(0-100)
 * @default 100
 *
 * @param SeVolume
 * @desc SE Volume(0-100)
 * @default 100
 *
 * @help Setting default value for Options.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc オプションデフォルト値設定プラグイン
 * @author トリアコンタン
 *
 * @param 常時ダッシュ
 * @desc 常にダッシュする。（Shiftキーを押している場合のみ歩行）(ON/OFF)
 * @default OFF
 *
 * @param コマンド記憶
 * @desc 選択したコマンドを記憶する。(ON/OFF)
 * @default OFF
 *
 * @param BGM音量
 * @desc BGMの音量。0-100
 * @default 100
 *
 * @param BGS音量
 * @desc BGSの音量。0-100
 * @default 100
 *
 * @param ME音量
 * @desc MEの音量。0-100
 * @default 100
 *
 * @param SE音量
 * @desc SEの音量。0-100
 * @default 100
 *
 * @help オプション画面で設定可能な項目のデフォルト値を指定した値に変更します。
 * 例えば、初回から常時ダッシュをONにしておけば
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
(function() {
    var pluginName = 'CustomizeConfigDefault';

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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramAlwaysDash      = getParamBoolean(['AlwaysDash', '常時ダッシュ']);
    var paramCommandRemember = getParamBoolean(['CommandRemember', 'コマンド記憶']);
    var paramBgmVolume       = getParamNumber(['BgmVolume', 'BGM音量'], 0, 100);
    var paramBgsVolume       = getParamNumber(['BgsVolume', 'BGS音量'], 0, 100);
    var paramMeVolume        = getParamNumber(['MeVolume', 'ME音量'], 0, 100);
    var paramSeVolume        = getParamNumber(['SeVolume', 'SE音量'], 0, 100);

    //=============================================================================
    // ConfigManager
    //  それぞれの項目に初期値を与えます。
    //=============================================================================
    var _ConfigManagerApplyData = ConfigManager.applyData;
    ConfigManager.applyData     = function(config) {
        _ConfigManagerApplyData.apply(this, arguments);
        if (config.alwaysDash == null)      this.alwaysDash = paramAlwaysDash;
        if (config.commandRemember == null) this.commandRemember = paramCommandRemember;
        if (config.bgmVolume == null)       this.bgmVolume = paramBgmVolume;
        if (config.bgsVolume == null)       this.bgsVolume = paramBgsVolume;
        if (config.meVolume == null)        this.meVolume = paramMeVolume;
        if (config.seVolume == null)        this.seVolume = paramSeVolume;
    };
})();