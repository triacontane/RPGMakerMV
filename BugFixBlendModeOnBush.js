//=============================================================================
// BugFixBlendModeOnBush.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/09/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Bug fix of [Blend Mode] on bush
 * @author triacontane
 *
 * @help Bug fix of [Blend Mode] on bush.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 茂み属性時の合成方法バグ修正プラグイン
 * @author トリアコンタン
 *
 * @help 茂み属性のタイルに侵入したキャラクターの
 * 合成方法が反映されないバグを修正します。
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

    var _Sprite_Character_updateHalfBodySprites = Sprite_Character.prototype.updateHalfBodySprites;
    Sprite_Character.prototype.updateHalfBodySprites = function() {
        _Sprite_Character_updateHalfBodySprites.apply(this, arguments);
        if (this._bushDepth > 0) {
            this._upperBody.blendMode = this.blendMode;
            this._lowerBody.blendMode = this.blendMode;
        }
    };
})();

