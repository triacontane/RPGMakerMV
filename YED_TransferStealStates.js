//=============================================================================
// YED_TransferStealStates.js
// 1.0.1 2016/10/08 アイテムを使用するとエラーになる現象の修正 by Triacontane
// ----------------------------------------------------------------------------
/*:
 * Yami Engine Delta - Transfer and Steal States
 *
 * @plugindesc Allows creating skills that can transfer and/or steal
 * states to/from target.
 * @author Yami Engine Delta [Dr.Yami]
 *
 * @help
 * There is no Configuration and Plugin Command.
 *
 * ============================================================================
 *
 * Skill
 * To allow skill to steal certain states, use the following notetag with
 * X is/are states ID:
 *   <steal allow: X, X, X, ...>
 *
 * To allow skill to transfer certain states, use the following notetag with
 * X is/are states ID:
 *   <transfer allow: X, X, X, ...>
 *
 * To allow skill to steal states, use the following notetag with N is
 * number of states, X is priority order:
 *   <steal N states: X>
 *
 * To allow skill to transfer states, use the following notetag with N is
 * number of states, X is priority order:
 *   <transfer N states: X>
 *
 *
 * Priority order:
 *
 * -------------------------------------------------------------------------
 * high priority
 * low priority
 * last states
 * random
 * -------------------------------------------------------------------------
 *
 * ============================================================================
 */
/*:ja
 * Yami Engine Delta - Transfer and Steal States
 *
 * @plugindesc ステート受け渡しのスキル作成が可能になります。
 * @author Yami Engine Delta [Dr.Yami]
 *
 * @help
 * このプラグインには、コンフィグやプラグインコマンドはありません。
 *
 * ============================================================================
 *
 * Skill
 * 特定のステートを盗むスキルを作成できるようになります。
 * XにはステートIDを記入してください。
 *   <steal allow: X, X, X, ...>
 *
 * 特定のステートを移植するスキルを作成できるようになります。
 * XにはステートIDを記入してください。
 *   <transfer allow: X, X, X, ...>
 *
 * ルールに従ってステートを盗むスキルを作成できるようになります。
 * Nにはステートの番号、Xには優先順位を記入してください。
 *   <steal N states: X>
 *
 * ルールに沿ってステートを移植するスキルを作成できるようになります。
 * Nにはステートの番号、Xには優先順位を記入してください。:
 *   <transfer N states: X>
 *
 *
 * 優先順位:
 * -------------------------------------------------------------------------
 * high priority - 高優先度
 * low priority - 低優先度
 * last states - 最低優先度
 * random - ランダム
 * -------------------------------------------------------------------------
 *
 * ============================================================================
 */


/**
 * @namespace TransferStealStates
 * @memberof YED
 */

var YED = YED || {};

// init TransferStealStates module
YED.TransferStealStates = {};

/* globals YED: false */

(function($TransferStealStates) {
    /**
     * Enum for RegExp, used to notetags
     *
     * @readonly
     * @enum {RegExp}
     * @memberof YED.TransferStealStates
     */
    var Regexp = {
        /**
         * Allows states to be stolen
         */
        STEAL_ALLOW: /<steal allow:[ ]*(.+)>/i,

        /**
         * Allows states to be transfered
         */
        TRANSFER_ALLOW: /<transfer allow:[ ]*(.+)>/i,

        /**
         * Steal (n) states with different priority
         */
        STEAL_STATES: /<steal (\d+) (?:states|state):[ ]*(.+)>/i,

        /**
         * Transfer (n) states with different priority
         */
        TRANSFER_STATES: /<transfer (\d+) (?:states|state):[ ]*(.+)>/i
    };

    $TransferStealStates.Regexp = Regexp;
}(YED.TransferStealStates));

/* globals YED: false */

(function($TransferStealStates, $Regexp) {
    /**
     * Contains utility tools for module.
     *
     * @namespace Utils
     * @memberof YED.TransferStealStates
     */
    var Utils = {};

    /**
     * Process notetag function.
     * Should be called with DataManager as current object.
     *
     * @function processNotetag
     * @memberof YED.TransferStealStates.Utils
     */
    Utils.processNotetags = function() {
        var group = $dataSkills,    // shorten group name
            obj,
            notedata,
            line;

        for (var i = 1; i < group.length; i++) {
            obj = group[i];
            notedata = obj.note.split(/[\r\n]+/);

            Utils._processProperties.call(this, obj);
            Utils._processMethods.call(this, obj);

            for (var n = 0; n < notedata.length; n++) {
                line = notedata[n];
                Utils._processNotetag.call(this, obj, line);
            }
        }
    };

    /**
     * Add new properties into object.
     *
     * @function _processProperties
     * @memberof YED.TransferStealStates.Utils
     * @param  {Object} obj Data object
     * @private
     */
    Utils._processProperties = function(obj) {
        obj._stealAllow = [];
        obj._transferAllow = [];

        obj._stealStates = [0, 'random'];
        obj._transferStates = [0, 'random'];
    };

    /**
     * Add new methods into object.
     *
     * @function _processMethods
     * @memberof YED.TransferStealStates.Utils
     * @param  {Object} obj Data object
     * @private
     */
    Utils._processMethods = function(obj) {
        obj.getAllowStealStates = Utils.getAllowStealStates;
        obj.getAllowTransferStates = Utils.getAllowTransferStates;

        obj.getStealStates = Utils.getStealStates;
        obj.getTransferStates = Utils.getTransferStates;
    };

    /**
     * Process notetag for object.
     *
     * @function _processNotetag
     * @memberof YED.TransferStealStates.Utils
     * @param  {Object} obj Data object
     * @param  {String} notetag Notetag
     * @private
     */
    Utils._processNotetag = function(obj, notetag) {
        var match,
            ids;

        match = notetag.match($Regexp.STEAL_ALLOW);
        if (match) {
            ids = match[1].match(/\d+/g);

            if (ids) {
                obj._stealAllow = ids.map(function(id) {
                    return Number(id);
                });
            }
        }

        match = notetag.match($Regexp.TRANSFER_ALLOW);
        if (match) {
            ids = match[1].match(/\d+/g);
            if (ids) {
                obj._transferAllow = ids.map(function(id) {
                    return Number(id);
                });
            }
        }

        match = notetag.match($Regexp.STEAL_STATES);
        if (match) {
            obj._stealStates[0] = Number(match[1]);
            obj._stealStates[1] = match[2].toLowerCase();
        }

        match = notetag.match($Regexp.TRANSFER_STATES);
        if (match) {
            obj._transferStates[0] = Number(match[1]);
            obj._transferStates[1] = match[2].toLowerCase();
        }
    };

    /**
     * Get stealable states IDs.
     * Should be attached to skill object.
     *
     * @function getAllowStealStates
     * @memberof YED.TransferStealStates.Utils
     * @return {Number[]} States ID
     */
    Utils.getAllowStealStates = function() {
        return this._stealAllow;
    };

    /**
     * Get transferable states IDs.
     * Should be attached to skill object.
     *
     * @function getAllowTransferStates
     * @memberof YED.TransferStealStates.Utils
     * @return {Number[]} States ID
     */
    Utils.getAllowTransferStates = function() {
        return this._transferAllow;
    };

    /**
     * Get skill steal states information.
     * Should be attached to skill object.
     *
     * @function getStealStates
     * @memberof YED.TransferStealStates.Utils
     * @return {[Number, String]} Steal Information
     */
    Utils.getStealStates = function() {
        return this._stealStates;
    };

    /**
     * Get skill transfer states information.
     * Should be attached to skill object.
     *
     * @function getTransferStates
     * @memberof YED.TransferStealStates.Utils
     * @return {[Number, String]} Steal Information
     */
    Utils.getTransferStates = function() {
        return this._transferStates;
    };

    $TransferStealStates.Utils = Utils;
}(YED.TransferStealStates, YED.TransferStealStates.Regexp));

/* globals YED: false */

/**
 * Pre-processes and notetag parsing
 */
(function($Utils) {
    /**
     * Aliasing methods
     */
    var _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;

    /**
     * Extending: Scene_Boot.prototype.start
     *
     * Add notetags processing for module.
     */
    DataManager.isDatabaseLoaded = function() {
        var loaded = _DataManager_isDatabaseLoaded.call(this);

        if (!loaded) {
            return false;
        }

        $Utils.processNotetags.call(DataManager);

        return true;
    };
}(YED.TransferStealStates.Utils));

/* globals YED: false */

(function() {
    /**
     * Aliasing methods
     */
    var _Game_Action_testApply
        = Game_Action.prototype.testApply;
    var _Game_Action_applyItemUserEffect
        = Game_Action.prototype.applyItemUserEffect;

    /**
     * Get target states in order.
     *
     * @function external:Game_Action#getOrderedStates
     */
    Game_Action.prototype.getOrderedStates = function(target, order) {
        var states = target.states();

        if (order === 'low priority'
            || order === 'lower priority'
            || order === 'low') {
            states = states.reverse();
        }

        if (order === 'high priority'
            || order === 'higher priority'
            || order === 'high') {
            states = states; // default is high priority sort
        }

        if (order === 'random') {
            states = states.sort(function() {
                return Math.pow(-1, Math.floor(Math.random() * 10));
            });
        }

        if (order === 'last states'
            || order === 'last state'
            || order === 'last states') {
            states = target.result().addedStateObjects().reverse();
        }

        return states;
    };

    /**
     * Get stealable and transferrable states of skill.
     *
     * @function external:Game_Action#getTransferStealStates
     */
    Game_Action.prototype.getTransferStealStates = function(target, type) {
        var result  = [],
            item    = this.item(),
            subject = this.subject(),
            states,
            allows, info;

        if (this.isItem()) return result;

        if (type.toLowerCase() === 'steal') {
            allows = item.getAllowStealStates();
            info   = item.getStealStates();
            states = this.getOrderedStates(target, info[1]);
        }

        if (type.toLowerCase() === 'transfer') {
            allows = item.getAllowTransferStates();
            info   = item.getTransferStates();
            states = this.getOrderedStates(subject, info[1]);
        }

        for (var i = 0; i < states.length; i++) {
            if (allows.indexOf(states[i].id) < 0) {
                continue;
            }

            result.push(states[i].id);

            if (result.size >= info[0]) {
                break;
            }
        }

        return result;
    };

    /**
     * Effect for stealing states.
     *
     * @function external:Game_Action#itemEffectStealStates
     */
    Game_Action.prototype.itemEffectStealStates = function(target) {
        var result = target.result(),
            item   = this.item(),
            statesId = this.getTransferStealStates(target, 'steal'),
            subject = this.subject();

        if (!result.isHit()) {
            return false;
        }

        if (statesId.length === 0) {
            return false;
        }

        this.makeSuccess(target);

        for (var i = 0; i < statesId.length; i++) {
            subject.addState(statesId[i]);
            target.removeState(statesId[i]);
        }
    };

    /**
     * Effect for transferring states.
     *
     * @function external:Game_Action#itemEffectTransferStates
     */
    Game_Action.prototype.itemEffectTransferStates = function(target) {
        var result = target.result(),
            item   = this.item(),
            statesId = this.getTransferStealStates(target, 'transfer'),
            subject = this.subject();

        if (!result.isHit()) {
            return false;
        }

        if (statesId.length === 0) {
            return false;
        }

        console.log(statesId);

        this.makeSuccess(target);

        for (var i = 0; i < statesId.length; i++) {
            subject.removeState(statesId[i]);
            target.addState(statesId[i]);
        }
    };

    /**
     * Extending: Game_Action.prototype.testApply
     *
     * Add validate skill effect for transfer and steal states.
     */
    Game_Action.prototype.testApply = function(target) {
        if (this.getTransferStealStates(target, 'steal').length > 0) {
            return true;
        }

        if (this.getTransferStealStates(target, 'transfer').length > 0) {
            return true;
        }

        return _Game_Action_testApply.call(this, target);
    };

    /**
     * Extending: Game_Action.prototype.applyItemUserEffect
     *
     * Add transfer and steal states effect.
     */
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.call(this, target);

        this.itemEffectStealStates(target);
        this.itemEffectTransferStates(target);
    };
}());
