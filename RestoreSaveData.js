//=============================================================================
// RestoreSaveData.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.0.0 2016/01/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc セーブファイル復元プラグイン
 * @author トリアコンタン
 *
 * @help 新たに任意のプラグインを導入した際に
 * 元のセーブデータがロードできなくなったとき、
 * このプラグインを適用すればロードできるかもしれません。
 * ※保証はできません。
 *
 * 既存のゲームオブジェクト（$gameSystem等）にプロパティを生やす
 * 仕様のプラグインには適用できますが、新規のオブジェクトを
 * セーブファイルに含めるようなプラグインには適用できません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';

    var iterate = function(that, handler) {
        Object.keys(that).forEach(function(key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    var _DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue = function(saveFileId) {
        var result = _DataManager_loadGameWithoutRescue.apply(this, arguments);
        if (result) {
            this.makePropertyForLoadData(new Game_System(), $gameSystem);
            this.makePropertyForLoadData(new Game_Screen(), $gameScreen);
            this.makePropertyForLoadData(new Game_Timer(), $gameTimer);
            this.makePropertyForLoadData(new Game_Switches(), $gameSwitches);
            this.makePropertyForLoadData(new Game_Variables(), $gameVariables);
            this.makePropertyForLoadData(new Game_SelfSwitches(), $gameSelfSwitches);
            this.makePropertyForLoadData(new Game_Actors(), $gameActors);
            this.makePropertyForLoadData(new Game_Party(), $gameParty);
            this.makePropertyForLoadData(new Game_Map(), $gameMap);
            this.makePropertyForLoadData(new Game_Player(), $gamePlayer);
        }
        return result;
    };

    DataManager.makePropertyForLoadData = function(newData, loadData) {
        iterate(newData, function(key, value) {
            if (!loadData.hasOwnProperty(key) && newData.hasOwnProperty(key)) {
                loadData[key] = value;
            }
        }.bind(this));
    };
})();

