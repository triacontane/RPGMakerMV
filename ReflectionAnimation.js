/*=============================================================================
 ReflectionAnimation.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/05/24 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 反射アニメーションプラグイン
 * @author トリアコンタン
 *
 * @param animationId
 * @text アニメーション番号
 * @desc 反射時に再生するアニメーションです。
 * @default 0
 * @type animation
 *
 * @param wait
 * @text 完了までウェイト
 * @desc 反射アニメーションが完了するまで待機します。
 * @default true
 * @type boolean
 *
 * @help ReflectionAnimation.js
 *
 * 魔法反射が発生した際にアニメーションを再生します。
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

    /**
     * Set plugin command to method
     * @param commandName plugin command name
     * @param methodName execute method(Game_Interpreter)
     */
    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(param.commandPrefix + commandName, methodName);
    };

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
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

    var param = createPluginParameter('ReflectionAnimation');

    /**
     * Window_BattleLog
     * 反射時のアニメーションを再生します。
     */
    var _Window_BattleLog_displayReflection = Window_BattleLog.prototype.displayReflection;
    Window_BattleLog.prototype.displayReflection = function(target) {
        if (param.animationId > 0) {
            this.push('showAnimation', null, [target], param.animationId);
            if (param.wait) {
                this.push('waitReflectionAnimation', param.animationId)
            }
        }
        _Window_BattleLog_displayReflection.apply(this, arguments);
    };

    Window_BattleLog.prototype.waitReflectionAnimation = function(id) {
        var data = $dataAnimations[id];
        if (data) {
            this._waitCount = data.frames.length * 4;
        }
    };
})();
