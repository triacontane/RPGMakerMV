/*=============================================================================
 RecoveryOverLimit.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/04/26 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc RecoveryOverLimitPlugin
 * @author triacontane
 *
 * @param OverLimitHpColor
 * @desc This is the color of the text when the HP has over limit.
 * @default 0
 * @type number
 * @min 0
 * @max 20
 *
 * @help RecoveryOverLimit.js
 *
 * You can create an active passive skill that allows you to
 * recover more HP than your original maximum.
 * Specify the following in the notes field of the database or
 * skill, item that has the feature.
 * <RecoveryOverLimit:50> // recover more than 50% of maximum HP.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 回復限界突破プラグイン
 * @author トリアコンタン
 *
 * @param OverLimitHpColor
 * @text 限界突破HP文字色
 * @desc HPが限界突破しているときの文字色です。システムカラー(\c[n])から選択します。
 * @default 0
 * @type number
 * @min 0
 * @max 20
 *
 * @help RecoveryOverLimit.js
 *
 * 本来の最大HPを超えてHP回復できるアクティブ・パッシブスキルを作成できます。
 * 対象データベース(※)のメモ欄に以下を指定します。
 * <回復限界突破:50>       // 最大HPを50%超えて回復できます。
 * <RecoveryOverLimit:50> // 同上
 *
 * ※アクター、職業、スキル、アイテム、武器、防具、敵キャラ、ステート
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

    var param = createPluginParameter('RecoveryOverLimit');

    /**
     * Game_BattlerBase
     * 回復限界突破時にHPの上限を引き上げます。
     */
    var _Game_BattlerBase_hpRate = Game_BattlerBase.prototype.hpRate;
    Game_BattlerBase.prototype.hpRate = function() {
        return Math.min(_Game_BattlerBase_hpRate.apply(this, arguments), 1.0);
    };

    Game_BattlerBase.prototype.isHpOverLimit = function() {
        return this.hp > this.mhp;
    };

    Game_BattlerBase.prototype.findRecoveryOverLimitRate = function(skill) {
        var rate = 0;
        var traitObjects = this.traitObjects();
        traitObjects.push(skill);
        traitObjects.forEach(function(traitObj) {
            var meta = getMetaValues(traitObj,['RecoveryOverLimit', '回復限界突破']);
            if (meta) {
                rate = Math.max(rate, parseInt(convertEscapeCharacters(meta)));
            }
        });
        return rate;
    };

    Game_BattlerBase.prototype.setOverLimitMaxHp = function(rate) {
        if (rate > 0) {
            this._overLimitMaxHp = this.mhp * (rate + 100) / 100;
        }
    };

    var _Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;
    Game_BattlerBase.prototype.refresh = function() {
        var realHp = this.findOverLimitHp();
        _Game_BattlerBase_refresh.apply(this, arguments);
        if (realHp > 0) {
            this._hp = realHp;
        }
    };

    Game_BattlerBase.prototype.findOverLimitHp = function() {
        if (!$gameParty.inBattle() || this.mhp >= this._overLimitMaxHp) {
            this._overLimitMaxHp = 0;
            return 0;
        } else {
            var hp = Math.min(this._overLimitMaxHp, this._hp);
            this._overLimitMaxHp = hp;
            return hp;
        }
    };

    /**
     * Game_Action
     * 回復限界突破スキルを使用した場合に限界突破HPを設定します。
     */
    var _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        target.setOverLimitMaxHp(this.findRecoveryOverLimitRate(value));
        _Game_Action_executeHpDamage.apply(this, arguments);
    };

    Game_Action.prototype.findRecoveryOverLimitRate = function(damageValue) {
        if (damageValue >= 0) {
            return 0;
        }
        var subject = this.subject();
        return subject ? subject.findRecoveryOverLimitRate(this.item()) : 0;
    };

    /**
     * Window_Base
     * HP限界突破時の文字色を取得します。
     */
    var _Window_Base_hpColor = Window_Base.prototype.hpColor;
    Window_Base.prototype.hpColor = function(actor) {
        if (param.OverLimitHpColor && actor.isHpOverLimit()) {
            return this.textColor(param.OverLimitHpColor);
        } else {
            return _Window_Base_hpColor.apply(this, arguments);
        }
    };
})();
