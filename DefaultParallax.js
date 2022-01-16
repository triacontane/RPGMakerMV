/*=============================================================================
 DefaultParallax.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/01/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc デフォルト遠景プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DefaultParallax.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param parallaxName
 * @text 遠景ファイル名
 * @desc デフォルト遠景として表示するファイル名です。
 * @default
 * @type file
 * @dir img/parallaxes
 *
 * @param parallaxLoopX
 * @text 横方向にループ
 * @desc デフォルト遠景が横方向にループします。
 * @default false
 * @type boolean
 *
 * @param parallaxSx
 * @text 横方向スクロール
 * @desc デフォルト遠景の横方向の自動スクロール速度です。
 * @default 0
 * @type number
 * @min -32
 * @max 32
 *
 * @param parallaxLoopY
 * @text 縦方向にループ
 * @desc デフォルト遠景が縦方向にループします。
 * @default false
 * @type boolean
 *
 * @param parallaxSy
 * @text 縦方向スクロール
 * @desc デフォルト遠景の縦方向の自動スクロール速度です。
 * @default 0
 * @type number
 * @min -32
 * @max 32
 *
 * @help DefaultParallax.js
 *
 * 全てのマップにデフォルト遠景を指定できます。
 * マップ設定で個別に遠景を指定した場合は、そちらが有効です。
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Map_setupParallax = Game_Map.prototype.setupParallax;
    Game_Map.prototype.setupParallax = function() {
        _Game_Map_setupParallax.apply(this, arguments);
        if (!this._parallaxName) {
            this._parallaxName = param.parallaxName || '';
            this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
            this._parallaxLoopX = param.parallaxLoopX;
            this._parallaxLoopY = param.parallaxLoopY;
            this._parallaxSx = param.parallaxSx;
            this._parallaxSy = param.parallaxSy;
        }
    };
})();
