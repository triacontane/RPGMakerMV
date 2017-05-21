//=============================================================================
// TargetByFormation.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/05/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc TargetByFormationPlugin
 * @author triacontane
 *
 * @param ChangeRate
 * @desc 隊列一人分の狙われ率変動倍率です。4人パーティで50にすると先頭の狙われ率は最後尾の2.5倍になります。
 * @default 50
 *
 * @help パーティの並び順によって狙われ率が変動します。
 * 前にいるプレイヤーほど狙われやすくなります。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 並び順による狙われ率変動プラグイン
 * @author トリアコンタン
 *
 * @param 変動倍率
 * @desc 隊列一人分の狙われ率変動倍率です。4人パーティで50にすると先頭の狙われ率は最後尾の2.5倍になります。
 * @default 50
 *
 * @help パーティの並び順によって狙われ率が変動します。
 * 前にいるプレイヤーほど狙われやすくなります。
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
    var pluginName    = 'TargetByFormation';

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
    param.changeRate = getParamNumber(['ChangeRate', '変動倍率']);

    Object.defineProperty(Game_BattlerBase.prototype, 'tgr', {
        get: function() {
            return this.sparam(0) * this.getTargetAdjustment();
        },
        configurable: true
    });

    Game_BattlerBase.prototype.getTargetAdjustment = function() {
        var descendingIndex = this.friendsUnit().members().length - this.index() - 1;
        return 1 + (descendingIndex * param.changeRate / 100);
    };
})();

