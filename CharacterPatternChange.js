/*=============================================================================
 CharacterPatternChange.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2018/10/14 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc CharacterPatternChangePlugin
 * @author triacontane
 *
 * @param player
 * @desc プレイヤーのアニメーションパターンを「1 - 2 - 3」に変更します。
 * @default true
 * @type boolean
 *
 * @param event
 * @desc イベントのアニメーションパターンを「1 - 2 - 3」に変更します。
 * @default false
 * @type boolean
 *
 * @param follower
 * @desc フォロワーのアニメーションパターンを「1 - 2 - 3」に変更します。
 * @default true
 * @type boolean
 *
 * @help CharacterPatternChange.js
 *
 * キャラクターのアニメーションパターンを「1 - 2 - 3 - 2」から
 * 「1 - 2 - 3」に変更します。
 *
 * 現状のバージョンでは複雑なパターン変更には対応していません。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc キャラクターパターン変更プラグイン
 * @author トリアコンタン
 *
 * @param player
 * @text プレイヤー
 * @desc プレイヤーのアニメーションパターンを「1 - 2 - 3」に変更します。
 * @default true
 * @type boolean
 *
 * @param event
 * @text イベント
 * @desc イベントのアニメーションパターンを「1 - 2 - 3」に変更します。
 * @default false
 * @type boolean
 *
 * @param follower
 * @text フォロワー
 * @desc フォロワーのアニメーションパターンを「1 - 2 - 3」に変更します。
 * @default true
 * @type boolean
 *
 * @help CharacterPatternChange.js
 *
 * キャラクターのアニメーションパターンを「1 - 2 - 3 - 2」から
 * 「1 - 2 - 3」に変更します。
 *
 * 現状のバージョンでは複雑なパターン変更には対応していません。
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

    var param = createPluginParameter('CharacterPatternChange');

    Game_CharacterBase._simplePattern = 3;

    var _Game_Player_maxPattern = Game_Player.prototype.maxPattern;
    Game_Player.prototype.maxPattern = function() {
        return param.player ? Game_CharacterBase._simplePattern : _Game_Player_maxPattern.apply(this, arguments);
    };

    var _Game_Follower_maxPattern = Game_Follower.prototype.maxPattern;
    Game_Follower.prototype.maxPattern = function() {
        return param.follower ? Game_CharacterBase._simplePattern : _Game_Follower_maxPattern.apply(this, arguments);
    };

    var _Game_Event_maxPattern = Game_Event.prototype.maxPattern;
    Game_Event.prototype.maxPattern = function() {
        return param.event ? Game_CharacterBase._simplePattern : _Game_Event_maxPattern.apply(this, arguments);
    };
})();
