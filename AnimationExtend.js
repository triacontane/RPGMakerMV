//=============================================================================
// AnimationExtend.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2023/11/21 MZで動作するよう修正
// 1.1.0 2017/08/23 アニメーションの拡大率を動的に設定できる機能を追加
// 1.0.0 2017/04/28 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc アニメーション設定拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnimationExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param rotationVariableId
 * @text 回転角変数番号
 * @desc 回転角(0-360)を取得するための変数番号
 * @default 0
 * @type variable
 *
 * @param frameVariableId
 * @text フレーム数変数番号
 * @desc アニメーションのフレーム数(1-)を取得するための変数番号。
 * デフォルトのフレーム数は「4」です。1フレーム=1/60秒
 * @default 0
 * @type variable
 *
 * @param scaleVariableId
 * @text 拡大率変数番号
 * @desc 拡大率(100%)を取得するための変数番号
 * @default 0
 * @type variable
 *
 * @help AnimationExtend.js
 *
 * MV方式のアニメーションを表示する際の角度やフレーム数を動的に変更できます。
 * パラメータで指定した番号の変数の値がそれぞれ適用されます。
 * MZで採用されたEffekseer方式のアニメーションには適用されません。
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

    //=============================================================================
    // Sprite_Animation
    //  アニメーションの角度を適用します。
    //=============================================================================
    const _Sprite_AnimationMV_setup      = Sprite_AnimationMV.prototype.setup;
    Sprite_AnimationMV.prototype.setup = function(target, animation, mirror, delay) {
        _Sprite_AnimationMV_setup.apply(this, arguments);
        const customRotation = $gameVariables.value(param.rotationVariableId);
        if (customRotation > 0) {
            this.rotation = customRotation / (180 / Math.PI);
        }
        const customScale = $gameVariables.value(param.scaleVariableId);
        if (customScale !== 0) {
            this.scale.x = customScale / 100;
            this.scale.y = customScale / 100;
        }
    };

    const _Sprite_AnimationMV_setupRate = Sprite_AnimationMV.prototype.setupRate;
    Sprite_AnimationMV.prototype.setupRate = function() {
        const customRate = $gameVariables.value(param.frameVariableId);
        if (customRate > 0) {
            this._rate = customRate;
        } else {
            _Sprite_AnimationMV_setupRate.apply(this, arguments);
        }
    };
})();

