//=============================================================================
// InitialState.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2022/01/07 MZで動作するよう修正
// 1.1.0 2018/07/08 複数の初期ステートを設定できる機能を追加
// 1.0.1 2017/02/07 端末依存の記述を削除
// 1.0.0 2017/01/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 初期ステートプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/InitialState.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help InitialState.js
 *
 * 敵キャラに初期状態でステートを付与します。
 * 敵キャラのメモ欄に以下の通り記述してください。
 *
 * <初期ステート:3>   # 戦闘開始時にステートID[3]が自動で付与されます。
 * <InitialState:3> # 同上
 *
 * 複数のステートを設定したい場合は、カンマ区切りでIDを指定してください。
 * 例：<InitialState:3,4,5>
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';

    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.apply(this, arguments);
        this.setupInitialState();
    };

    Game_Enemy.prototype.setupInitialState = function() {
        const stateList = PluginManagerEx.findMetaValue(this.enemy(), ['初期ステート', 'InitialState']);
        if (!stateList) {
            return;
        }
        String(stateList).split(',').forEach(state => this.addState(parseInt(state)));
    };
})();


