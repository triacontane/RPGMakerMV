//=============================================================================
// InitialState.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2022/08/21 すべての敵キャラに適用できる初期ステートをパラメータで指定できる機能を追加
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
 * @param stateList
 * @text ステートリスト
 * @desc すべての敵キャラに適用する初期ステートのリストです。
 * @default []
 * @type struct<STATE>[]
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

/*~struct~STATE:
 *
 * @param stateId
 * @text ステートID
 * @desc 適用する初期ステートのIDです。
 * @default 1
 * @type state
 *
 * @param switchId
 * @text 条件スイッチ
 * @desc 初期ステートの適用条件スイッチです。0を指定すると常に適用します。
 * @default 0
 * @type switch
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.stateList) {
        param.stateList = [];
    }

    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.apply(this, arguments);
        this.setupAllInitialState();
        this.setupInitialState();
    };

    Game_Enemy.prototype.setupInitialState = function() {
        const stateList = PluginManagerEx.findMetaValue(this.enemy(), ['初期ステート', 'InitialState']);
        if (!stateList) {
            return;
        }
        String(stateList).split(',').forEach(state => this.addState(parseInt(state)));
    };

    Game_Enemy.prototype.setupAllInitialState = function() {
        param.stateList
            .filter(state => !state.switchId || $gameSwitches.value(state.switchId))
            .forEach(state => this.addState(state.stateId));
    };
})();


