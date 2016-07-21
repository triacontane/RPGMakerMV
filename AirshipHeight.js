//=============================================================================
// AirshipHeight.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/07/20 変数番号をパラメータで指定できるよう変更(by triacontane)
// 1.0.0 2016/05/13 初版
//=============================================================================

/*:
 * @plugindesc 飛行船の浮上の高さの変更
 * @author s.f.
 *
 * @param 変数番号
 * @desc 飛行船の高さを取得するための変数番号
 * @default 20
 *
 * @help 飛行船の浮上する高さを変更します
 *
 * 指定した変数の値が
 * 飛行船の高さとなります。
 *
 * このプラグインにはプラグインコマンドはありません。
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 */

(function() {
    'use strict';
    var pluginName    = 'AirshipHeight';

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
   // var paramVariableNumber = getParamNumber(['VariableNumber', '変数番号'], 1);

  Game_Vehicle.prototype.maxAltitude = function() {
    var paramVariableNumber = getParamNumber(['VariableNumber', '変数番号'], 1);
    return $gameVariables.value(paramVariableNumber);
  };

Game_Vehicle.prototype.updateAirshipAltitude = function() {
    if (this._driving && !this.isHighest()) {
        this._altitude++;
    }
    if (!this._driving && !this.isLowest()) {
        this._altitude--;
    }
    
    if(this._altitude > this.maxAltitude()){
      this._altitude = this.maxAltitude();
    }

};


})();




