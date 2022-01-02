/*=============================================================================
 ChangeDamageColor.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2022/01/02 プラグインを無効にするスイッチを追加
 1.0.0 2021/04/03 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ChangeDamageColorPlugin
 * @target MZ
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChangeDamageColor.js
 * @author triacontane
 *
 * @param HpDamageColor
 * @default
 * @type combo
 * @option #ffffff
 * @option white
 * @option rgba(255,255,255,1.0)
 *
 * @param HpRecoverColor
 * @default
 * @type combo
 * @option #b9ffb5
 * @option white
 * @option rgba(255,255,255,1.0)
 *
 * @param MpDamageColor
 * @default
 * @type combo
 * @option #ffff90
 * @option white
 * @option rgba(255,255,255,1.0)
 *
 * @param MpRecoverColor
 * @default
 * @type combo
 * @option #b9ffb5
 * @option white
 * @option rgba(255,255,255,1.0)
 *
 * @param InvalidSwitch
 * @desc Invalid switch
 * @default 0
 * @type switch
 *
 * @help ChangeDamageColor.js
 *
 * Changes the text color for damage or recovery.
 * Specify the new text color from the parameters.
 * You can use the CSS color scheme for the text color.
 *
 * The base plugin "PluginCommonBase.js" is required to use this plugin.
 * The "PluginCommonBase.js" is here.
 * (MZ install path)dlc/BasicResources/plugins/official/PluginCommonBase.js
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ダメージカラー変更プラグイン
 * @target MZ
 * @base PluginCommonBase
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChangeDamageColor.js
 * @author トリアコンタン
 *
 * @param HpDamageColor
 * @text HPダメージ文字色
 * @desc HPダメージの文字色です。
 * @default
 * @type combo
 * @option #ffffff
 * @option white
 * @option rgba(255,255,255,1.0)
 *
 * @param HpRecoverColor
 * @text HP回復文字色
 * @desc HP回復の文字色です。
 * @default
 * @type combo
 * @option #b9ffb5
 * @option white
 * @option rgba(255,255,255,1.0)
 *
 * @param MpDamageColor
 * @text MPダメージ文字色
 * @desc MPダメージの文字色です。
 * @default
 * @type combo
 * @option #ffff90
 * @option white
 * @option rgba(255,255,255,1.0)
 *
 * @param MpRecoverColor
 * @text MP回復文字色
 * @desc MP回復の文字色です。
 * @default
 * @type combo
 * @option #b9ffb5
 * @option white
 * @option rgba(255,255,255,1.0)
 *
 * @param InvalidSwitch
 * @text 無効スイッチ
 * @desc 指定したスイッチが有効になるとプラグインの機能が無効になります。
 * @default 0
 * @type switch
 *
 * @help ChangeDamageColor.js
 *
 * ダメージもしくは回復時の文字色を変更します。
 * パラメータから変更後の文字色を指定してください。
 * 文字色にはCSSの色指定方式が使えます。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    const customColorTypes = [
        param.HpDamageColor,
        param.HpRecoverColor,
        param.MpDamageColor,
        param.MpRecoverColor
    ];

    const _ColorManager_damageColor = ColorManager.damageColor;
    ColorManager.damageColor = function(colorType) {
        if (customColorTypes[colorType] && !$gameSwitches.value(param.InvalidSwitch)) {
            return customColorTypes[colorType];
        } else {
            return _ColorManager_damageColor.apply(this, arguments);
        }
    };
})();
