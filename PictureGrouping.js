/*=============================================================================
 PictureGrouping.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/11/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ピクチャのグループ化プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PictureGrouping.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command GROUPING_PICTURE
 * @text グループ化ピクチャ指定
 * @desc グループ化するピクチャファイルを指定します。リストの下が手前に表示されます。
 *
 * @arg pictureList
 * @text ピクチャリスト
 * @desc グループ化するピクチャのリストです。
 * @default []
 * @type struct<Picture>[]
 *
 * @help PictureGrouping.js
 *
 * 複数のピクチャファイルをひとつのピクチャとして表示できます。
 * 座標や拡大率、不透明度などを一括管理できます。
 *
 * プラグインコマンドからグループ化するピクチャを指定してください。
 * 表示後にピクチャを追加削除することはできません。
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

/*~struct~Picture:
 * @param FileName
 * @text ファイル名
 * @desc ピクチャのファイル名です。
 * @default
 * @dir img/pictures/
 * @type file
 *
 * @param X
 * @text X座標
 * @desc ピクチャの相対X座標です。
 * @default 0
 * @type number
 *
 * @param Y
 * @text Y座標
 * @desc ピクチャの相対Y座標です。
 * @default 0
 * @type number
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'GROUPING_PICTURE', args => {
        args.pictureList.forEach(picture => $gameScreen.addGroupingPicture(picture));
    });

    const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        if (!$gameScreen.groupingPicture()) {
            $gameScreen.clearGroupingPicture();
        }
    }

    const _Game_Screen_clear = Game_Screen.prototype.clear;
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.apply(this, arguments);
        this.clearGroupingPicture();
    };

    Game_Screen.prototype.clearGroupingPicture = function() {
        this._groupingPicture = [];
    }

    Game_Screen.prototype.groupingPicture = function() {
        return this._groupingPicture;
    };

    Game_Screen.prototype.addGroupingPicture = function(picture) {
        this._groupingPicture.push({
            fileName: picture.FileName,
            x: picture.X,
            y: picture.Y
        });
        ImageManager.loadPicture(picture.FileName);
    };

    const _Game_Screen_erasePicture = Game_Screen.prototype.erasePicture;
    Game_Screen.prototype.erasePicture = function(pictureId) {
        const realPictureId = this.realPictureId(pictureId);
        const picture = this._pictures[realPictureId];
        if (picture && picture.findGrouping()) {

        }
        _Game_Screen_erasePicture.apply(this, arguments);
    };

    const _Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function(
        name, origin, x, y, scaleX, scaleY, opacity, blendMode
    ) {
        const grouping = $gameScreen.groupingPicture();
        if (grouping.length > 0 && !name) {
            this._grouping = grouping;
            arguments[0]   = Date.now().toString();
            $gameScreen.clearGroupingPicture();
        }
        _Game_Picture_show.apply(this, arguments);
    };

    Game_Picture.prototype.findGrouping = function() {
        return this._grouping;
    };

    const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        const picture = this.picture();
        if (!picture) {
            this.destroyGrouping();
        }
        _Sprite_Picture_updateBitmap.apply(this, arguments);
    };

    const _Sprite_Picture_loadBitmap      = Sprite_Picture.prototype.loadBitmap;
    Sprite_Picture.prototype.loadBitmap = function() {
        this.destroyGrouping();
        this._grouping = this.picture().findGrouping();
        if (this._grouping) {
            this.makeGroupingBitmap().then(() => null);
        } else {
            _Sprite_Picture_loadBitmap.apply(this, arguments);
        }
    };

    Sprite_Picture.prototype.makeGroupingBitmap = async function() {
        this.bitmap = new Bitmap();
        this._groupingBitmaps = this._grouping.map(data => ImageManager.loadPicture(data.fileName));
        await this.waitForGroupingLoad();
        const width = this._grouping.reduce((prev, data) => {
            const bitmap = ImageManager.loadPicture(data.fileName);
            return Math.max(prev, bitmap.width + data.x)
        }, 1);
        const height = this._grouping.reduce((prev, data) => {
            const bitmap = ImageManager.loadPicture(data.fileName);
            return Math.max(prev, bitmap.height + data.y)
        }, 1);
        this.bitmap = new Bitmap(width, height);
        this._grouping.forEach(data => {
            const bitmap = ImageManager.loadPicture(data.fileName);
            this.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, data.x, data.y);
        });
    };

    Sprite_Picture.prototype.waitForGroupingLoad = function() {
        return new Promise(resolve => {
            this._groupingBitmaps.some(bitmap => {
                bitmap.addLoadListener(() => {
                    if (this._groupingBitmaps.every(data => data.isReady())) {
                        resolve();
                        return true;
                    } else {
                        return false;
                    }
                });
            });
        });
    };

    Sprite_Picture.prototype.destroyGrouping = function() {
        if (this.bitmap) {
            this.bitmap.destroy();
            this.bitmap = null;
        }
        if (this._grouping) {
            this._grouping = null;
            this._groupingBitmaps = null;
        }
    };
})();
