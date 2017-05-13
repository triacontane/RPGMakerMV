//=============================================================================
// BugFixTileWrong.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/05/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BugFixTileWrongPlugin
 * @author triacontane
 *
 * @help 配置してないはずのタイルが突然表示されることがある問題を解消します。
 * 具体的には場所移動前のマップのタイルセットの情報の一部が不正に
 * 引き継がれてしまう問題に対応します。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc タイルの不正表示解消プラグイン
 * @author トリアコンタン
 *
 * @help 配置してないはずのタイルが突然表示されることがある問題を解消します。
 * 具体的には場所移動前のマップのタイルセットの情報の一部が不正に
 * 引き継がれてしまう問題に対応します。
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
    // TileRenderer
    //  クリア用のテクスチャを作成します。
    //=============================================================================
    var TileRenderer                  = PIXI.WebGLRenderer.__plugins.tile;
    TileRenderer._clearTexture        = null;
    var _TileRenderer_initBounds      = TileRenderer.prototype.initBounds;
    TileRenderer.prototype.initBounds = function() {
        _TileRenderer_initBounds.apply(this, arguments);
        var clearTexture           = document.createElement('canvas');
        clearTexture.width         = 1024;
        clearTexture.height        = 1024;
        TileRenderer._clearTexture = clearTexture;
    };

    PIXI.glCore.GLTexture.prototype._hackSubImage = function(sprite) {
        this.bind();
        var gl = this.gl;
        var x  = sprite.position.x;
        var y  = sprite.position.y;
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, this.format, this.type, TileRenderer._clearTexture);
        var baseTex = sprite.texture.baseTexture;
        gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, this.format, this.type, baseTex.source);
    };
})();

