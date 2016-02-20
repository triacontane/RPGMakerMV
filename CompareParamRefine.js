//=============================================================================
// CompareParamRefine.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 装備購入時の性能比較改善プラグイン
 * @author トリアコンタン
 *
 * @help 装備購入時の武器と防具の性能比較を
 * 攻撃力や防御力ではなくパラメータの総和で行います。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var propName = 'AllSumOfNumber';

    var checkTypeNumber = function(value) {
        return checkType(value, 'Number');
    };

    var checkType = function(value, typeName) {
        return Object.prototype.toString.call(value).slice(8, -1) === typeName;
    };

    if (!Array.prototype.hasOwnProperty(propName)) {
        Object.defineProperty(Array.prototype, propName, {
            get : function () {
                var result = 0;
                for (var i = 0, n = this.length; i < n; i++) {
                    if (checkTypeNumber(this[i])) result += this[i];
                }
                return result;
            }
        });
    }

    Window_ShopStatus.prototype.paramId = function() {
        return propName;
    };
})();
