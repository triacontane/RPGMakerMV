//=============================================================================
// StateChangeIfRemove.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/04 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ステート変化プラグイン
 * @author トリアコンタン
 *
 * @help ステート解除のタイミングで別のステートに差し替えます。
 * ステートのメモ欄に以下の書式で入力してください。
 *
 * メモ欄書式
 * <SC歩数で変更:（ステートID）>
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    'use strict';
    var pluginName = 'StateChangeIfRemove';

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        return window ? window.convertEscapeCharacters(text) : text;
    };

    var _Game_Actor_updateStateSteps = Game_Actor.prototype.updateStateSteps;
    Game_Actor.prototype.updateStateSteps = function(state) {
        _Game_Actor_updateStateSteps.apply(this, arguments);
        var index = this._states.indexOf(state.id);
        if (index < 0) {
            this._changedStates ? this._changedStates.push(state.id) : this._changedStates = [state.id];
            var newStateId = $dataStates[state.id].meta['SC歩数で変更'];
            if (newStateId != null) {
                this._result.removedStates.pop();
                this.addState(getArgNumber(newStateId, 1));
            }
        }
    };
})();

