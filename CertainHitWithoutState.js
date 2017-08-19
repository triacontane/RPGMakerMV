//=============================================================================
// CertainHitWithoutState.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/08/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc CertainHitWithoutStatePlugin
 * @author triacontane
 *
 * @help CertainHitWithoutState.js
 *
 * 命中タイプ「必中」がステート付与に影響しなくなります。
 * 元々の仕様で「必中」スキルはステート有効度を無視して強制的に付与しますが、
 * この仕様を変更し「必中」でもステート有効度によっては付与されなくなります。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 必中のステート付与への影響防止プラグイン
 * @author トリアコンタン
 *
 * @help CertainHitWithoutState.js
 *
 * 命中タイプ「必中」がステート付与に影響しなくなります。
 * 元々の仕様で「必中」スキルはステート有効度を無視して強制的に付与しますが、
 * この仕様を変更し「必中」でもステート有効度によっては付与されなくなります。
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

    var _Game_Action_itemEffectAddNormalState = Game_Action.prototype.itemEffectAddNormalState;
    Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
        this._supplessCertainHit = true;
        _Game_Action_itemEffectAddNormalState.apply(this, arguments);
        this._supplessCertainHit = false;
    };

    var _Game_Action_isCertainHit = Game_Action.prototype.isCertainHit;
    Game_Action.prototype.isCertainHit = function() {
        return _Game_Action_isCertainHit.apply(this, arguments) && !this._supplessCertainHit;
    };
})();

