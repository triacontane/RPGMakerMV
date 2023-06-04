//=============================================================================
// ItemCommonParallel.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2023/06/04 MZ向けに一部仕様を変更して再作成
// 1.0.1 2017/08/09 コモンイベントを呼び出さないアイテムを使用するとエラーが発生する問題を修正
// 1.0.0 2017/07/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc アイテムコモンイベントの並列化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemCommonParallel.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help ItemCommonParallel.js
 *
 * アイテム使用などでメニュー画面からコモンイベントを呼び出したときに
 * 対象のトリガーが「並列処理」の場合は、並列処理として実行します。
 * トリガーに指定したスイッチがONになるわけではなく、
 * 指定したコモンイベントが1回だけ並列処理で実行されます。
 *
 * イベント実行中にメニュー画面からアイテムコモンを実行した場合などに
 * 即座にイベントが実行されるようになります。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';

    //=============================================================================
    // Game_Temp
    //  コモンイベント呼び出し要求時に対象が並列処理だった場合は対象スイッチを自動でONにする
    //=============================================================================
    const _Game_Temp_reserveCommonEvent = Game_Temp.prototype.reserveCommonEvent;
    Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
        _Game_Temp_reserveCommonEvent.apply(this, arguments);
        if (SceneManager.isInItemBase()) {
            this.reserveParallelCommonEvent();
        }
    };

    Game_Temp.prototype.reserveParallelCommonEvent = function() {
        const event = this.retrieveParallelCommonEvent();
        if (event) {
            $gameMap.setupDynamicCommon(event.id);
            this._callParallelCommonEvent = true;
        }
    };

    Game_Temp.prototype.retrieveParallelCommonEvent = function() {
        const event = $dataCommonEvents[this._commonEventQueue[this._commonEventQueue.length - 1]];
        if (event && event.trigger === 2) {
            return this.retrieveCommonEvent();
        } else {
            return null;
        }
    };

    const _Game_Temp_isCommonEventReserved = Game_Temp.prototype.isCommonEventReserved;
    Game_Temp.prototype.isCommonEventReserved = function() {
        const result = _Game_Temp_isCommonEventReserved.apply(this, arguments);
        if (this._callParallelCommonEvent) {
            this._callParallelCommonEvent = false;
            return true;
        } else {
            return result;
        }
    };

    //=============================================================================
    // SceneManager
    //  現在の画面がアイテム画面かどうかを返す
    //=============================================================================
    SceneManager.isInItemBase = function() {
        return this._scene instanceof Scene_ItemBase;
    };
})();

