//=============================================================================
// CounterExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/11/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc CounterExtendPlugin
 * @author triacontane
 *
 * @help 魔法攻撃を受けた場合もカウンターが発動するようになります。
 * 特徴を有するメモ欄に以下の通り入力してください。
 *
 * <CE_魔法反撃>      # 魔法攻撃を受けた場合も反撃します。
 * <CE_MagicCounter>  # 同上
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc カウンター拡張プラグイン
 * @author トリアコンタン
 *
 * @help 魔法攻撃を受けた場合もカウンターが発動するようになります。
 * 特徴を有するメモ欄に以下の通り入力してください。
 *
 * <CE_魔法反撃>      # 魔法攻撃を受けた場合も反撃します。
 * <CE_MagicCounter>  # 同上
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
    var metaTagPrefix = 'CE_';

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    //=============================================================================
    // Game_BattlerBase
    //  行動制約が有効なステートデータを取得します。
    //=============================================================================
    Game_BattlerBase.prototype.isValidMagicCounter = function() {
        return this.traitObjects().some(function(traitObject) {
            return getMetaValues(traitObject, ['魔法反撃', 'MagicCounter']);
        });
    };

    //=============================================================================
    // Game_Action
    //  魔法反撃を可能にします。
    //=============================================================================
    var _Game_Action_itemCnt = Game_Action.prototype.itemCnt;
    Game_Action.prototype.itemCnt = function(target) {
        var cnt = _Game_Action_itemCnt.apply(this, arguments);
        if (cnt > 0) return cnt;
        if (target.isValidMagicCounter() && this.isMagical() && target.canMove()) {
            return target.cnt;
        } else {
            return 0;
        }
    };
})();

