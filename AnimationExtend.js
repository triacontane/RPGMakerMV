//=============================================================================
// AnimationExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/08/23 アニメーションの拡大率を動的に設定できる機能を追加
// 1.0.0 2017/04/28 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AnimationExtendPlugin
 * @author triacontane
 *
 * @param RotationVariableId
 * @desc 回転角(0-360)を取得するための変数番号
 * @default 0
 * @type variable
 *
 * @param FrameVariableId
 * @desc アニメーションのフレーム数(1-)を取得するための変数番号
 * @default 0
 * @type variable
 *
 * @param ScaleVariableId
 * @desc 拡大率(100%)を取得するための変数番号
 * @default 0
 * @type variable
 *
 * @help AnimationExtend.js
 *
 * アニメーションを表示する際の角度やフレーム数を動的に変更できます。
 * パラメータで指定した番号の変数の値がそれぞれ適用されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc アニメーション設定拡張プラグイン
 * @author トリアコンタン
 *
 * @param 回転角変数番号
 * @desc 回転角(0-360)を取得するための変数番号
 * @default 0
 * @type variable
 *
 * @param フレーム数変数番号
 * @desc アニメーションのフレーム数(1-)を取得するための変数番号。
 * デフォルトのフレーム数は「4」です。1フレーム=1/60秒
 * @default 0
 * @type variable
 *
 * @param 拡大率変数番号
 * @desc 拡大率(100%)を取得するための変数番号
 * @default 0
 * @type variable
 *
 * @help AnimationExtend.js
 *
 * アニメーションを表示する際の角度やフレーム数を動的に変更できます。
 * パラメータで指定した番号の変数の値がそれぞれ適用されます。
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
    var pluginName = 'AnimationExtend';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                = {};
    param.rotationVariableId = getParamNumber(['RotationVariableId', '回転角変数番号']);
    param.frameVariableId    = getParamNumber(['FrameVariableId', 'フレーム数変数番号']);
    param.scaleVariableId    = getParamNumber(['ScaleVariableId', '拡大率変数番号']);

    //=============================================================================
    // Sprite_Animation
    //  アニメーションの角度を適用します。
    //=============================================================================
    var _Sprite_Animation_setup      = Sprite_Animation.prototype.setup;
    Sprite_Animation.prototype.setup = function(target, animation, mirror, delay) {
        _Sprite_Animation_setup.apply(this, arguments);
        var customRotation = $gameVariables.value(param.rotationVariableId);
        if (customRotation > 0) {
            this.rotation = customRotation / (180 / Math.PI);
        }
        var customScale = $gameVariables.value(param.scaleVariableId);
        if (customScale !== 0) {
            this.scale.x = customScale / 100;
            this.scale.y = customScale / 100;
        }
    };

    var _Sprite_Animation_setupRate = Sprite_Animation.prototype.setupRate;
    Sprite_Animation.prototype.setupRate = function() {
        var customRate = $gameVariables.value(param.frameVariableId);
        if (customRate > 0) {
            this._rate = customRate;
        } else {
            _Sprite_Animation_setupRate.apply(this, arguments);
        }
    };
})();

