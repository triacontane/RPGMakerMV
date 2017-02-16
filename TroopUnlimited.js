//=============================================================================
// TroopUnlimited.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/02/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc TroopUnlimitedPlugin
 * @author triacontane
 *
 * @help エディタ上の最大値である8体を超える数の敵キャラを
 * 一度に出現させることができるようになります。
 *
 * 追加はグループ単位で行います。
 *
 * 敵グループの「名前」に以下の内容を含めてください。
 * \add[3] # 本来の敵キャラに追加してID[3]の「敵グループ」に
 * 指定された敵キャラが初期配置で追加されます。
 *
 * さらに追加したい場合はその分だけ\add[n]を記述してください。
 *
 * 追加されるのは敵キャラのみです。バトルイベント等には
 * 影響を与えません。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 敵グループ限界突破プラグイン
 * @author トリアコンタン
 *
 * @help エディタ上の最大値である8体を超える数の敵キャラを
 * 一度に出現させることができるようになります。
 *
 * 追加はグループ単位で行います。
 *
 * 敵グループの「名前」に以下の内容を含めてください。
 * \add[3] # 本来の敵キャラに追加してID[3]の「敵グループ」に
 * 指定された敵キャラが初期配置で追加されます。
 *
 * さらに追加したい場合はその分だけ\add[n]を記述してください。
 *
 * 追加されるのは敵キャラのみです。バトルイベント等には
 * 影響を与えません。
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

    //=============================================================================
    // Game_Troop
    //  グループ外の敵キャラを読み込みます。
    //=============================================================================
    var _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        this.makeAdditionalEnemies(troopId);
        _Game_Troop_setup.apply(this, arguments);
        if (this.isExistAdditionalEnemies()) {
            this.concatAdditionalEnemies();
        }
    };

    Game_Troop.prototype.makeAdditionalEnemies = function(troopId) {
        this._troopId = troopId;
        var troopName = this.troop().name;
        this._additionalEnemies = [];
        troopName.replace(/\\ADD\[(\d+)\]/gi, function() {
            _Game_Troop_setup.call(this, parseInt(arguments[1]));
            this._additionalEnemies = this._additionalEnemies.concat(this._enemies);
        }.bind(this));
    };

    Game_Troop.prototype.concatAdditionalEnemies = function() {
        this._enemies = this._enemies.concat(this._additionalEnemies);
        this.remakeUniqueNames();
    };

    Game_Troop.prototype.remakeUniqueNames = function() {
        this.members().forEach(function(enemy) {
            var name = enemy.originalName();
            delete this._namesCount[name];
            enemy.setLetter('');
        }, this);
        this.makeUniqueNames();
    };

    Game_Troop.prototype.isExistAdditionalEnemies = function() {
        return this._additionalEnemies.length > 0;
    };
})();

