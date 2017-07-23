//=============================================================================
// MessageActorFace.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/07/24 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc MessageActorFacePlugin
 * @author triacontane
 *
 * @param ActorIdVariable
 * @desc アクターIDを取得するための変数番号です。
 * @default 0
 * @type variable
 *
 * @help 文章の表示をする際にアクターのフェイスグラフィックを
 * 簡単に指定できるようになります。
 *
 * パラメータ「ActorIdVariable」で指定した変数に値が入っている場合
 * その値のIDのアクターのフェイスグラフィックがメッセージウィンドウに
 * 指定されます。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メッセージのアクターフェイス表示プラグイン
 * @author トリアコンタン
 *
 * @param アクターID変数番号
 * @desc アクターIDを取得するための変数番号です。
 * @default 0
 * @type variable
 *
 * @help 文章の表示をする際にアクターのフェイスグラフィックを
 * 簡単に指定できるようになります。
 *
 * パラメータ「アクターID変数番号」で指定した変数に値が入っている場合
 * その値のIDのアクターのフェイスグラフィックがメッセージウィンドウに
 * 指定されます。
 *
 * 変数の値が0の場合は、通常通り「文章の表示」で指定したフェイスに
 * なります。
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
    var pluginName    = 'MessageActorFace';

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
    param.actorIdVariable = getParamNumber(['ActorIdVariable', 'アクターID変数番号'], 0);

    var _Game_Interpreter_command101 = Game_Interpreter.prototype.command101;
    Game_Interpreter.prototype.command101 = function() {
        var index = this._index;
        var result = _Game_Interpreter_command101.apply(this, arguments);
        if (index !== this._index) {
            this.setActorFaceImage();
        }
        return result;
    };

    Game_Interpreter.prototype.setActorFaceImage = function() {
        var actorId = $gameVariables.value(param.actorIdVariable);
        if (actorId) {
            var actor = $gameActors.actor(actorId);
            if (actor) {
                $gameMessage.setFaceImage(actor.faceName(), actor.faceIndex());
            }
        }
    };
})();

