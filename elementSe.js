// elementSe
/*:
@plugindesc 属性ダメージで弱点を突いたとき、SEを鳴らすプラグイン
@author 俺
@param PlaySe
@desc クリティカル時に鳴らすSEを設定する
@default {name: "Bell3", volume: 90, pitch: 100, pan: 0}
@help

*/

(function() {
    var parameters = PluginManager.parameters('elementSe');

    var PlaySE = null;
    // パラメータから取得します。
    eval('PlaySE = ' + String(parameters['PlaySe']));
    // 取得できなかった場合、デフォルト値を設定します。
    if (!PlaySE) PlaySE = {name: "Bell3", volume: 90, pitch: 100, pan: 0};

    var _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        // 既存の「calcElementRate」を呼んで結果を「elementRate」に格納します。
        var elementRate = _Game_Action_calcElementRate.apply(this, arguments);
        // 「elementRate」が「1」より大きいと弱点扱いになります。
        if (elementRate > 1) {
            AudioManager.playSe(PlaySE);
        }
        // 呼び出し元に「elementRate」を返します。
        return elementRate;
    };
})();
