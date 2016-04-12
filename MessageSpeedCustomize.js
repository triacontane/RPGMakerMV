//=============================================================================
// MessageSpeedCustomize.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/04/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Message speed customize
 * @author triacontane
 *
 * @param VariableSpeed
 * @desc Variable number of Message speed
 * @default 1
 *
 * @help Customize for message speed
 * 0    : Rapid
 * 1    : Normal
 * 2... : Slowly
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メッセージ速度調整プラグイン
 * @author トリアコンタン
 *
 * @param 表示速度変数
 * @desc メッセージ表示速度を格納する変数の番号
 * @default 1
 *
 * @help メッセージ表示速度を調整します。
 * パラメータで指定した番号の変数に対して以下の値を代入してください。
 * 0     : 瞬間表示
 * 1     : 通常と同様の表示速度
 * 2以上 : 指定したフレーム間隔で一文字を表示します。
 * 
 * ※大きければ大きいほどゆっくりと表示されます。
 *
 * ※公開中の「オプション任意項目作成プラグイン」と組み合わせれば
 * 対象の変数をオプション画面から操作できます。
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
    var pluginName = 'MessageSpeedCustomize';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramVariableSpeed  = getParamNumber(['VariableSpeed', '表示速度変数'], 1, 5000);

    var _Window_Message_updateMessage = Window_Message.prototype.updateMessage;
    Window_Message.prototype.updateMessage = function() {
        var speed = $gameVariables.value(paramVariableSpeed);
        if (this._textState) {
            if (speed <= 0) {
                this._showFast = true;
            } else {
                this._waitCount = speed - 1;
            }
        }
        return _Window_Message_updateMessage.apply(this, arguments);
    };
})();

