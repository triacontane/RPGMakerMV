//=============================================================================
// AnimationRotation.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/04/28 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AnimationRotationPlugin
 * @author triacontane
 *
 * @param RotationVariableId
 * @desc 回転角(0-360)を取得するための変数番号
 * @default 0
 *
 * @help アニメーションを表示する際に角度を設定することができます。
 * パラメータで指定した任意の番号の変数の値が角度になります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc アニメーション角度設定プラグイン
 * @author トリアコンタン
 *
 * @param 回転角変数番号
 * @desc 回転角(0-360)を取得するための変数番号
 * @default 0
 *
 * @help アニメーションを表示する際に角度を設定することができます。
 * パラメータで指定した任意の番号の変数の値が角度になります。
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
    var pluginName    = 'AnimationRotation';

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
    var param       = {};
    param.rotationVariableId = getParamNumber(['RotationVariableId', '回転角変数番号']);

    //=============================================================================
    // Sprite_Animation
    //  アニメーションの角度を適用します。
    //=============================================================================
    var _Sprite_Animation_setup = Sprite_Animation.prototype.setup;
    Sprite_Animation.prototype.setup = function(target, animation, mirror, delay) {
        _Sprite_Animation_setup.apply(this, arguments);
        this.rotation = $gameVariables.value(param.rotationVariableId) / (180 / Math.PI);
    };
})();

