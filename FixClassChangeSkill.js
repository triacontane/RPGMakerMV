/*=============================================================================
 FixClassChangeSkill.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2020/03/14 スキル習得を無効にできるスイッチを追加
 1.0.0 2020/03/14 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc FixClassChangeSkillPlugin
 * @author triacontane
 *
 * @param invalidSwitchId
 * @desc When the switch is ON, the plug-in function is disabled and skill acquisition is disabled.
 * @default 0
 * @type switch
 *
 * @help FixClassChangeSkill.js
 *
 * When the event command "Change occupation" is performed
 * Acquire the skills that the new profession can acquire by yourself.
 * If you hold the level, you will learn to the level you forgot,
 * If you don't hold it, you will acquire the skills that can be acquired at level 1.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 職業の変更によるスキル習得プラグイン
 * @author トリアコンタン
 *
 * @param invalidSwitchId
 * @text 無効スイッチ
 * @desc スイッチがONのときプラグインの機能が無効になり、スキル習得が無効になります。
 * @default 0
 * @type switch
 *
 * @help FixClassChangeSkill.js
 *
 * イベントコマンド『職業の変更』を行ったとき
 * 変更先の職業が習得できるスキルを自働で習得します。
 *
 * レベルを保持した場合は、現在レベルまでのスキルを習得し、
 * 保持しなかった場合はレベル1で習得できるスキルを習得します。
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

    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };
    var param = createPluginParameter('FixClassChangeSkill');

    var _Game_Actor_changeClass = Game_Actor.prototype.changeClass;
    Game_Actor.prototype.changeClass = function(classId, keepExp) {
        _Game_Actor_changeClass.apply(this, arguments);
        if ($gameSwitches.value(param.invalidSwitchId)) {
            return;
        }
        this.currentClass().learnings.forEach(function(learning) {
            if (learning.level <= this._level) {
                this.learnSkill(learning.skillId);
            }
        }, this);
    };
})();
