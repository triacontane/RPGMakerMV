/*=============================================================================
 CharacterPatternChange.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2018/10/14 アニメーションパターンの変更有無をスイッチで切り替える機能を追加
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
 * @param validSwitchPlayer
 * @desc プレイヤーのパターンが変更されるためのスイッチIDです。0にすると常に有効となります。
 * @default 0
 * @type switch
 *
 * @param validSwitchEvent
 * @desc イベントのパターンが変更されるためのスイッチIDです。0にすると常に有効となります。
 * @default 0
 * @type switch
 *
 * @param validSwitchFollower
 * @desc フォロワーのパターンが変更されるためのスイッチIDです。0にすると常に有効となります。
 * @default 0
 * @type switch
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
 * @param validSwitchPlayer
 * @text プレイヤー有効スイッチ
 * @desc プレイヤーのパターンが変更されるためのスイッチIDです。0にすると常に有効となります。
 * @default 0
 * @type switch
 *
 * @param validSwitchEvent
 * @text イベント有効スイッチ
 * @desc イベントのパターンが変更されるためのスイッチIDです。0にすると常に有効となります。
 * @default 0
 * @type switch
 *
 * @param validSwitchFollower
 * @text フォロワー有効スイッチ
 * @desc フォロワーのパターンが変更されるためのスイッチIDです。0にすると常に有効となります。
 * @default 0
 * @type switch
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

    /**
     * Game_CharacterBase
     */
    Game_CharacterBase._simplePattern = 3;
    var _Game_CharacterBase_maxPattern = Game_CharacterBase.prototype.maxPattern;
    Game_CharacterBase.prototype.maxPattern = function() {
        return this.isValidChangePattern() ? Game_CharacterBase._simplePattern : _Game_CharacterBase_maxPattern.apply(this, arguments);
    };

    Game_CharacterBase.prototype.isValidChangePattern = function() {
        return this.isValidChangePatternParam() && this.isValidChangePatternSwitch();
    };

    Game_CharacterBase.prototype.isValidChangePatternParam = function() {
        return false;
    };

    Game_CharacterBase.prototype.isValidChangePatternSwitch = function() {
        var id = this.getValidChangeSwitchId();
        return id === 0 || $gameSwitches.value(id);
    };

    Game_CharacterBase.prototype.getValidChangeSwitchId = function() {
        return 0;
    };

    /**
     * Game_Player
     */
    Game_Player.prototype.isValidChangePatternParam = function() {
        return param.player;
    };

    Game_Player.prototype.getValidChangeSwitchId = function() {
        return param.validSwitchPlayer;
    };

    /**
     * Game_Follower
     */
    Game_Follower.prototype.isValidChangePatternParam = function() {
        return param.follower;
    };

    Game_Follower.prototype.getValidChangeSwitchId = function() {
        return param.validSwitchFollower;
    };

    /**
     * Game_Event
     */
    Game_Event.prototype.isValidChangePatternParam = function() {
        return param.event;
    };

    Game_Event.prototype.getValidChangeSwitchId = function() {
        return param.validSwitchEvent;
    };
})();
