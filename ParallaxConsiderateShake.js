/*=============================================================================
 ParallaxConsiderateShake.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/11/26 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 遠景のシェイク考慮プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParallaxConsiderateShake.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param validZeroParallax
 * @text 視差ゼロ遠景にも適用
 * @desc 本プラグインの効果を視差ゼロ遠景にも適用します。周囲48ピクセルぶんの余白が必要になるので有効にする場合は注意してください。
 * @default false
 * @type boolean
 *
 * @help ParallaxConsiderateShake.js
 *　
 * 遠景付きのマップで画面のシェイクを実行したとき
 * 両端に黒い部分が見えてしまう現象を修正します。
 *
 * 具体的には遠景の大きさを周囲48ピクセルぶん広くとります。
 * 視差ゼロ遠景を使っている場合は、パラメータから有効可否を
 * 選択してください。
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    Spriteset_Map._shakeMargin = 48;

    Spriteset_Map.prototype.updateParallaxMargin = function() {
        if ($gameMap._parallaxZero && !param.validZeroParallax) {
            this._parallax.move(0, 0, Graphics.width, Graphics.height);
        } else {
            const m = Spriteset_Map._shakeMargin;
            this._parallax.move(-m, -m, Graphics.width + m * 2, Graphics.height + m * 2);
        }
    };

    const _Spriteset_Map_updateParallax = Spriteset_Map.prototype.updateParallax;
    Spriteset_Map.prototype.updateParallax = function() {
        if (this._parallaxName !== $gameMap.parallaxName()) {
            this.updateParallaxMargin();
        }
        _Spriteset_Map_updateParallax.apply(this, arguments);
    };
})();
