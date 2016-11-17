//=============================================================================
// BigEnemy.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/11/17 YEP_CoreEngine.jsで画面サイズを変更すると、位置の不整合が起きる現象に対応
// 1.0.0 2016/10/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BigEnemyPlugin
 * @author triacontane
 *
 * @help フロントビューで巨大モンスターを表示可能にするプラグインです。
 * 具体的にはY座標を強制的に画面の下端に設定します。
 *
 * 敵キャラのメモ欄を以下の通り設定してください。
 * <BE有効>
 * <BEValid>
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 巨大モンスタープラグイン
 * @author トリアコンタン
 *
 * @help フロントビューで巨大モンスターを表示可能にするプラグインです。
 * 具体的には画像の下端が画面の下端に強制的に合わせられます。
 *
 * 敵キャラのメモ欄を以下の通り設定してください。
 * <BE有効>
 * <BEValid>
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
    var metaTagPrefix = 'BE';

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
    // Game_Enemy
    //  巨大モンスター判定を行います。
    //=============================================================================
    Game_Enemy.prototype.isBigEnemy = function() {
        return getMetaValues(this.enemy(), ['有効', 'Valid']);
    };

    //=============================================================================
    // Sprite_Enemy
    //  必要に応じて敵キャラの位置を調整します。
    //=============================================================================
    var _Sprite_Enemy_loadBitmap = Sprite_Enemy.prototype.loadBitmap;
    Sprite_Enemy.prototype.loadBitmap = function(name, hue) {
        _Sprite_Enemy_loadBitmap.apply(this, arguments);
        if (this._enemy.isBigEnemy()) {
            this.bitmap.addLoadListener(this.adjustAnchorForBigEnemy.bind(this));
        }
    };

    Sprite_Enemy.prototype.adjustAnchorForBigEnemy = function() {
        if (this.bitmap.height) {
            this.anchor.y = 1.0 - ((Graphics.boxHeight - this._homeY) / this.bitmap.height);
        }
    };
})();

