//=============================================================================
// ParamTransfer.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.5.0 2022/05/08 プラグインによる変換適用前のパラメータを取得できるメソッドを追加
// 1.4.1 2022/02/13 パラメータ変換がHPのみ機能していなかった問題を修正
// 1.4.0 2022/02/13 MZで動作するよう修正
// 1.3.1 2017/02/07 端末依存の記述を削除
// 1.3.0 2016/12/09 各種パラメータを固定値で増減できる機能を追加
// 1.2.0 2016/08/08 変換レート計算式にバトラー情報を設定できるよう修正
// 1.1.1 2016/07/29 ヘルプと実装の記述が食い違っていたので修正
// 1.1.0 2016/07/28 変換後の倍率を自由に設定できる機能を追加
// 1.0.0 2016/07/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc パラメータ変換プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ParamTransfer.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help ParamTransfer.js
 * 
 * 以下の主要8パラメータを指定したルールに従って動的に変換します。
 * 別のパラメータの値を参照したり、値を乗算、加算したりできます。
 * ・最大HP(0)
 * ・最大MP(1)
 * ・攻撃力(2)
 * ・防御力(3)
 * ・魔法力(4)
 * ・魔法防御(5)
 * ・敏捷性(6)
 * ・運(7)
 *
 * 特徴を有するデータベースのメモ欄を各機能ごとに従って記述してください。
 *
 * 1. パラメータを別のパラメータに変換します。
 * 最大HPと最大MPが一時的に入れ替わる装備や
 * 魔法力の値が攻撃力に変換されるステートが作成できます。
 *
 * <PT0:1> # 最大HPの値が最大MPで上書きされます。
 * <PT1:0> # 最大MPの値が最大HPで上書きされます。
 * ※数字は上の記述を参照してください。（以後も同様）
 *
 * 2. パラメータを任意の値で乗算します。
 * 倍率には制御文字\v[n]およびJavaScript計算式が利用できます。
 * <PTRate0:\v[1]+50> # 最大HPの値が「変数[1]の値 + 50%」の倍率になります。
 *
 * さらに計算式中で「battler」と入力すると対象のバトラー情報を参照できます。
 * <PTRate2:100 + battler.tp> # 攻撃力の値が現在のTPにより変動します。
 *                              (TP100で攻撃力2倍)
 *
 * 3. パラメータに任意の値を加算します。
 * <PTAdd4:50> # 魔法力の値が 50 加算されます。
 * 加算値には制御文字\v[n]およびJavaScript計算式が利用できます。
 *
 * 変換されるのはベースパラメータで、装備品やバフによる加算は
 * 含まれません。
 *
 * アクターの変換前のパラメータを取得するスクリプトです。
 * $gameActors.actor(n).paramRealBase(m);
 * n : アクターID
 * m : パラメータID
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

    //=============================================================================
    // Game_BattlerBase
    //  変換後のパラメータを取得します。
    //=============================================================================
    Game_BattlerBase.prototype.getTransParam = function(originalParamId, ballBack) {
        let realParamId   = originalParamId;
        let realParamRate = 1.0;
        let realParamAdd  = 0;
        this.traitObjects().forEach(function(data) {
            const metaValueTransfer = PluginManagerEx.findMetaValue(data, `PT${originalParamId}`);
            if (metaValueTransfer !== undefined) {
                realParamId = parseInt(metaValueTransfer).clamp(0, 7);
            }
            const metaValueRate = PluginManagerEx.findMetaValue(data, `PTRate${originalParamId}`);
            if (metaValueRate !== undefined) {
                realParamRate = realParamRate * this.executeParamFormula(metaValueRate) / 100;
            }
            const metaValueAdd = PluginManagerEx.findMetaValue(data, `PTAdd${originalParamId}`);
            if (metaValueAdd !== undefined) {
                realParamAdd += this.executeParamFormula(metaValueAdd);
            }
        }, this);
        return Math.floor(ballBack(realParamId) * realParamRate) + realParamAdd;
    };

    Game_BattlerBase.prototype.executeParamFormula = function(formula) {
        try {
            if (formula === parseInt(formula)) {
                return formula;
            }
            const battler = this;
            return eval(PluginManagerEx.convertEscapeCharacters(formula));
        } catch (e) {
            console.error(e.stack);
        }
        return 0;
    };

    //=============================================================================
    // Game_Enemy
    //  ベースパラメータを変換します。
    //=============================================================================
    const _Game_Actor_paramBase      = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(paramId) {
        return this.getTransParam(paramId, _Game_Actor_paramBase.bind(this));
    };

    Game_Actor.prototype.paramRealBase = function(paramId) {
        return _Game_Actor_paramBase.apply(this, arguments);
    };

    //=============================================================================
    // Game_Enemy
    //  ベースパラメータを変換します。
    //=============================================================================
    const _Game_Enemy_paramBase      = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function(paramId) {
        return this.getTransParam(paramId, _Game_Enemy_paramBase.bind(this));
    };

    Game_Enemy.prototype.paramRealBase = function(paramId) {
        return _Game_Enemy_paramBase.apply(this, arguments);
    };
})();

