//=============================================================================
// CustomizeConfigDefault.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
    var parameters = PluginManager.parameters('CustomizeConfigDefault');

    //=============================================================================
    // ConfigManager
    //  それぞれの項目に初期値を与えます。
    //=============================================================================
    var _ConfigManagerApplyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        if (config["alwaysDash"] === undefined) {
            this.alwaysDash = (parameters['alwaysDash'] === "ON");
            this.commandRemember = (parameters['commandRemember'] === "ON");
            this.bgmVolume = parseInt(parameters['bgmVolume'], 10).clamp(0, 100) || 0;
            this.bgsVolume = parseInt(parameters['bgsVolume'], 10).clamp(0, 100) || 0;
            this.meVolume = parseInt(parameters['meVolume'], 10).clamp(0, 100) || 0;
            this.seVolume = parseInt(parameters['seVolume'], 10).clamp(0, 100) || 0;
        } else {
            _ConfigManagerApplyData.call(this, config);
        }
    };
})();