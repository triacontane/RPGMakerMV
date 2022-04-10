/*=============================================================================
 StateEffect.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/04/10 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ステートエフェクトプラグイン
 * @author トリアコンタン
 *
 * @help StateEffect.js
 *
 * ステートが有効になったとき、対象者に指定スキルの使用効果を適用します。
 * 継続的な効果ではなく有効になった瞬間にだけ発現する効果を表現できます。
 *
 * ステートが有効になったときにスキル[3]のダメージと効果を
 * 対象者に適用します。
 * <StateEffect:3>
 * <ステート効果:3>
 *
 * 使用効果以外のスキル内容(ダメージやアニメーション等)は参照されません。
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
     * Get database meta information.
     * @param object Database item
     * @param name Meta name
     * @returns {String} meta value
     */
    var getMetaValue = function(object, name) {
        return object.meta.hasOwnProperty(name) ? convertEscapeCharacters(object.meta[name]) : null;
    };

    /**
     * Get database meta information.(for multi language)
     * @param object Database item
     * @param names Meta name array (for multi language)
     * @returns {String} meta value
     */
    var getMetaValues = function(object, names) {
        var metaValue;
        names.some(function(name) {
            metaValue = getMetaValue(object, name);
            return metaValue !== null;
        });
        return metaValue;
    };

    /**
     * Convert escape characters.(require any window object)
     * @param text Target text
     * @returns {String} Converted text
     */
    var convertEscapeCharacters = function(text) {
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
    };

    var _Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
    Game_BattlerBase.prototype.addNewState = function(stateId) {
        _Game_BattlerBase_addNewState.apply(this, arguments);
        var skillId = getMetaValues($dataStates[stateId] || {}, ['ステート効果', 'StateEffect']);
        if (skillId) {
            this.applyStateEffect(parseInt(skillId));
        }
    };

    Game_BattlerBase.prototype.applyStateEffect = function(skillId) {
        if (!$dataSkills[skillId]) {
            return;
        }
        var action = new Game_Action(this);
        action.setSkill(skillId);
        action.applyStateEffect(this);
    };

    Game_Action.prototype.applyStateEffect = function(target) {
        this.item().effects.forEach(function(effect) {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyGlobal();
    };
})();
