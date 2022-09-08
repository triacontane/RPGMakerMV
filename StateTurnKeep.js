/*=============================================================================
 StateTurnKeep.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/09/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ステート残りターン維持プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/StateTurnKeep.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param outOfTargets
 * @text 対象外ステート
 * @desc 残りターン数維持の対象外となるステートです。ここで指定したステートは通常仕様通りに初期化されます。
 * @default []
 * @type state[]
 *
 * @help StateTurnKeep.js
 *
 * ステートを重ね掛けしたとき、残りターン数を初期化せず
 * 維持するよう仕様変更します。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.outOfTargets) {
        param.outOfTargets = [];
    }

    const _Game_BattlerBase_resetStateCounts = Game_BattlerBase.prototype.resetStateCounts;
    Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
        const prevTurn = this._stateTurns[stateId];
        _Game_BattlerBase_resetStateCounts.apply(this, arguments);
        if (prevTurn && !param.outOfTargets.includes(stateId)) {
            this._stateTurns[stateId] = prevTurn;
        }
    };
})();
