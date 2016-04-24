//=============================================================================
// MapDrawSprite.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/04/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 図形描画プラグイン
 * @author トリアコンタン
 *
 * @param パラメータ
 * @desc パラメータ説明
 * @default デフォルト値
 *
 * @help プラグイン説明が未入力です。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
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

    var _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function() {
        _Spriteset_Base_createUpperLayer.apply(this, arguments);
        if (this instanceof Spriteset_Map) {
            this.createDrawSprite();
        }
    };

    Spriteset_Map.prototype.createDrawSprite = function() {
        var sprite = new Sprite();
        sprite.bitmap = this.makeDrawBitmap();
        this.addChild(sprite);
    };

    Spriteset_Map.prototype.createDrawSprite = function() {
        var sprite = new Sprite();
        var bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
        // 円を描きます。Bitmapクラスのメソッドはツクールのcore.jsで定義されています。
        bitmap.drawCircle(100, 100, 100, 'rgba(255,255,255,0.5)');
        // 線を描きます。こちらはHTML5のメソッドを直接使用しています。
        var context = bitmap._context;
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(Graphics.boxWidth / 2, Graphics.boxHeight);
        context.lineTo(Graphics.boxWidth, Graphics.boxHeight / 2);
        context.lineTo(0, 0);
        context.stroke();
        sprite.bitmap = bitmap;
        SceneManager._scene.addChild(sprite);
    };

    Spriteset_Map.prototype.makeDrawBitmap = function() {
        var bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
        // 円を描きます。Bitmapクラスのメソッドはツクールのcore.jsで定義されています。
        bitmap.drawCircle(100, 100, 100, 'rgba(255,255,255,0.5)');
        // 線を描きます。こちらはHTML5のメソッドを直接使用しています。
        var context = bitmap._context;
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(Graphics.boxWidth / 2, Graphics.boxHeight);
        context.lineTo(Graphics.boxWidth, Graphics.boxHeight / 2);
        context.lineTo(0, 0);
        context.stroke();
        return bitmap;
    };
})();

