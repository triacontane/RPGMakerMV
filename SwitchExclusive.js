/*=============================================================================
 SwitchExclusive.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/03/05 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 排他的スイッチプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SwitchExclusive.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param switchGroupList
 * @text 排他的スイッチリスト
 * @desc 排他的スイッチ群のリストです。
 * @default []
 * @type struct<SwitchGroup>[]
 *
 * @help SwitchExclusive.js
 *
 * 指定したスイッチ群で二つ以上のスイッチが同時にONにならないよう自動制御します。
 * スイッチ群のなかのいずれかのスイッチがONになったとき、
 * その他のスイッチは自動ｆｒOFFになります。
 * すべてのスイッチがOFFになることは許容します。
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

/*~struct~SwitchGroup:
 * @param label
 * @text ラベル
 * @desc スイッチグループのラベルです。特に利用用途はないのでわかりやすい名称を付けてください。
 * @default
 * @type multiline_string
 *
 * @param switches
 * @text スイッチグループ
 * @desc 排他的スイッチのリストです。ここのグループ内のスイッチは同時に二つ以上ONになりません。
 * @default []
 * @type switch[]
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.switchGroupList) {
        param.switchGroupList = [];
    }
    const switchMap = new Map();
    param.switchGroupList.forEach(group => {
        group.switches.forEach(id => {
            if (!switchMap.has(id)) {
                switchMap.set(id, new Set());
            }
            group.switches.filter(s => s !== id).forEach(s => switchMap.get(id).add(s));
        });
    });

    const _Game_Switches_setValue = Game_Switches.prototype.setValue;
    Game_Switches.prototype.setValue = function(switchId, value) {
        _Game_Switches_setValue.apply(this, arguments);
        if (value && switchMap.has(switchId)) {
            switchMap.get(switchId).forEach(id => this.setValue(id, false));
        }
    }
})();
