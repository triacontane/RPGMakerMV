/*=============================================================================
 AnimationCellSize.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/02/09 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アニメーションのセルサイズ変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnimationCellSize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param imageList
 * @text 画像リスト
 * @desc サイズを変更したいアニメーション画像のリストです。
 * @default []
 * @type struct<CellSize>[]
 *
 * @help AnimationCellSize.js
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

/*~struct~CellSize:
 * @param animation
 * @text アニメーション画像
 * @desc セルサイズを変更したいアニメーションファイルです。
 * @default
 * @dir img/animation
 * @type file
 *
 * @param size
 * @text セルサイズ
 * @desc 変更したいセルサイズです。
 * @default 192
 * @type number
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.imageList) {
        param.imageList = [];
    }

    const _Sprite_AnimationMV_loadBitmaps = Sprite_AnimationMV.prototype.loadBitmaps;
    Sprite_AnimationMV.prototype.loadBitmaps = function() {
        _Sprite_AnimationMV_loadBitmaps.apply(this, arguments);
        const name1 = this._animation.animation1Name;
        const name2 = this._animation.animation2Name;
        this._size1 = param.imageList.find(item => item.animation === name1)?.size;
        this._size2 = param.imageList.find(item => item.animation === name2)?.size;
    };

    const _Sprite_AnimationMV_updateCellSprite = Sprite_AnimationMV.prototype.updateCellSprite;
    Sprite_AnimationMV.prototype.updateCellSprite = function(sprite, cell) {
        if (!this._size1 && !this._size2) {
            _Sprite_AnimationMV_updateCellSprite.apply(this, arguments);
            return;
        }
        const pattern = cell[0];
        if (pattern >= 0) {
            const size = (pattern < 100 ? this._size1 : this._size2) || 192;
            const sx = (pattern % 5) * size;
            const sy = Math.floor((pattern % 100) / 5) * size;
            const mirror = this._mirror;
            sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
            sprite.setHue(pattern < 100 ? this._hue1 : this._hue2);
            sprite.setFrame(sx, sy, size, size);
            sprite.x = cell[1];
            sprite.y = cell[2];
            sprite.rotation = (cell[4] * Math.PI) / 180;
            sprite.scale.x = cell[3] / 100;

            if (cell[5]) {
                sprite.scale.x *= -1;
            }
            if (mirror) {
                sprite.x *= -1;
                sprite.rotation *= -1;
                sprite.scale.x *= -1;
            }

            sprite.scale.y = cell[3] / 100;
            sprite.opacity = cell[6];
            sprite.blendMode = cell[7];
            sprite.visible = true;
        } else {
            sprite.visible = false;
        }
    };
})();
