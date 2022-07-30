/*=============================================================================
 BalloonSpeedCustomize.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/07/30 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc フキダシ速度変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BalloonSppedCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param speedVariable
 * @text フキダシ速度変数
 * @desc フキダシのアニメ速度が指定した変数値になります。0だった場合はデフォルト値(8)になります。小さい値の方が速いです。
 * @default 0
 * @type variable
 *
 * @param waitVariable
 * @text フキダシ待機変数
 * @desc フキダシの待機フレームが指定した変数値になります。0だった場合はデフォルト値(12)になります。
 * @default 0
 * @type variable
 *
 * @help BalloonSpeedCustomize.js
 *
 * フキダシのアニメーション速度および待機フレーム数を調整できます。
 * プラグインパラメータから変数番号を指定すれば、その番号の変数値が
 * 速度や待機フレームになります。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Sprite_Balloon_speed = Sprite_Balloon.prototype.speed;
    Sprite_Balloon.prototype.speed = function() {
        const speed = _Sprite_Balloon_speed.apply(this, arguments);
        return $gameVariables.value(param.speedVariable) || speed;
    };

    const _Sprite_Balloon_waitTime = Sprite_Balloon.prototype.waitTime;
    Sprite_Balloon.prototype.waitTime = function() {
        const waitTime = _Sprite_Balloon_waitTime.apply(this, arguments);
        return $gameVariables.value(param.waitVariable) || waitTime;
    };
})();
