//=============================================================================
// DynamicBattlerParam.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.0.0 2024/04/13 MZ向けに全面的なリファクタリング
// 2.0.0 2018/07/11 計算式の対象が追加能力値もしくは特殊能力値、計算式で参照する能力値を装備品やバフを適用した能力値になるよう仕様変更しました
// 1.2.1 2017/10/31 1.2.0でデバッグ用のコードが混入していたので修正
// 1.2.0 2017/10/28 追加能力値および特殊能力値についても計算式を適用できる機能を追加
// 1.1.0 2017/08/14 計算式でパラメータを取得する際に装備品による変動分を含まないよう修正
// 1.0.0 2017/07/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc バトラーパラメータの動的設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DynamicBattlerParam.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param formulaList
 * @text 計算式リスト
 * @desc パラメータ計算式のリストです。
 * @default []
 * @type struct<Param>[]
 *
 * @help DynamicBattlerParameter.js
 *
 * バトラーのパラメータをJavaScript計算式に置き換えます。
 * パラメータを参照すると計算式を評価した結果が返ります。
 * バトラーが特定のメモタグを持つ場合のみ計算式を適用することも可能です。
 * メモタグ名のパラメータにaaaを指定するとタグ<aaa>を持つバトラーにのみ
 * 計算式が適用されます。(※1)
 *
 * ※1 アクター、職業、武器、防具、ステート、敵キャラのメモ欄を参照します。
 *
 * 本プラグインはプラグインの特性上、他のプラグインと組み合わせた場合
 * パフォーマンスが低下する可能性があります。
 *
 * 各パラメータの値は以下の仕様に従います。
 *
 * ・計算式の対象が通常能力値(最大HP～運)の場合
 * 装備品、バフによる変動を考慮しないバトラー本来のパラメータとなります。
 * これは装備品やバフの効果が二重に適用されてしまう現象を防ぐためです。
 *
 * ・計算式の対象が追加能力値もしくは特殊能力値(命中率～経験獲得率)の場合
 * 装備品、バフによる変動を考慮したパラメータとなります。
 *
 * ※いずれの場合も本プラグインによる変動は含まれません。
 * これは計算式の参照元にさらに計算式を適用しようとして処理が循環したり
 * 著しくパフォーマンスが低下するのを避けるためです。
 *
 * param # データベースで指定した元々の値
 * a.hp  # HP
 * a.mp  # MP
 * a.tp  # TP
 * a.mhp # 最大HP
 * a.mmp # 最大MP
 * a.atk # 攻撃力
 * a.def # 防御力
 * a.mat # 魔法力
 * a.mdf # 魔法防御
 * a.agi # 敏捷性
 * a.luk # 運
 * a.hpRate() # HPレート(0.0 - 1.0)
 * a.mpRate() # MPレート(0.0 - 1.0)
 * a.tpRate() # TPレート(0.0 - 1.0)
 * a.special('aaa') # メモ欄の[aaa]の値(※)
 * a.level        # レベル
 * a.actorId()    # アクターID
 * a._classId     # 職業ID
 * a.currentExp() # 経験値
 *
 * ※特徴を有するメモ欄から指定した内容に対応する数値を取得
 * <aaa:100> # a.special('aaa')で[100]を返す。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Param:
 * @param paramId
 * @text パラメータID
 * @desc 計算式を適用するパラメータIDです。
 * @default 0
 * @type select
 * @option 最大HP
 * @value 0
 * @option 最大MP
 * @value 1
 * @option 攻撃力
 * @value 2
 * @option 防御力
 * @value 3
 * @option 魔法力
 * @value 4
 * @option 魔法防御
 * @value 5
 * @option 敏捷性
 * @value 6
 * @option 運
 * @value 7
 * @option 命中率
 * @value 8
 * @option 回避率
 * @value 9
 * @option 会心率
 * @value 10
 * @option 会心回避
 * @value 11
 * @option 魔法回避
 * @value 12
 * @option 魔法反射
 * @value 13
 * @option 反撃
 * @value 14
 * @option HP再生
 * @value 15
 * @option MP再生
 * @value 16
 * @option TP再生
 * @value 17
 * @option 狙われ率
 * @value 18
 * @option 防御効果率
 * @value 19
 * @option 回復効果率
 * @value 20
 * @option 薬の知識
 * @value 21
 * @option MP消費率
 * @value 22
 * @option TPチャージ率
 * @value 23
 * @option 物理ダメージ率
 * @value 24
 * @option 魔法ダメージ率
 * @value 25
 * @option 床ダメージ率
 * @value 26
 * @option 経験獲得率
 * @value 27
 *
 * @param formula
 * @text 計算式
 * @desc パラメータを計算するJavaScript式です。
 * @default
 * @type multiline_string
 *
 * @param tagName
 * @text メモタグ名
 * @desc バトラーが指定したメモ欄を持っている場合のみ計算式を適用します。
 * @default
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.formulaList) {
        return;
    }

    Game_BattlerBase._paramNumber = 8;
    Game_BattlerBase._xParamNumber = 10;
    Game_BattlerBase._sParamNumber = 10;

    Game_BattlerBase.prototype.getParamFormula = function(paramId) {
        return param.formulaList.find(item => {
            if (item.paramId !== paramId) {
                return false;
            } else if (item.tagName) {
                return this.traitObjects().some(obj => obj.meta[item.tagName]);
            } else {
                return true;
            }
        })?.formula;
    };

    Game_BattlerBase.prototype.getDynamicParam = function(paramId, param, baseFlag) {
        if (this._calcParameter) {
            return param;
        }
        this._calcParameter = true;
        this._baseFlag = baseFlag;
        const formula = this.getParamFormula(paramId);
        const a = this;
        const dynamicParam = formula ? this.roundParamIfNeed(paramId, eval(formula)) : param;
        this._calcParameter = false;
        this._baseFlag = false;
        if (isNaN(dynamicParam)) {
            PluginManagerEx.throwError(`Invalid value ${dynamicParam} paramId:${paramId} formula:${formula}`, script);
        }
        return dynamicParam;
    };

    Game_BattlerBase.prototype.roundParamIfNeed = function(paramId, formulaResult) {
        return paramId < Game_BattlerBase._paramNumber ? Math.round(formulaResult) : formulaResult;
    };

    Game_BattlerBase.prototype.special = function(tagName) {
        let value = 0;
        this.traitObjects().forEach(obj => {
            value += obj.meta[tagName] ? parseInt(obj.meta[tagName]) : 0;
        });
        return Math.round(value);
    };

    const _Game_BattlerBase_param = Game_BattlerBase.prototype.param;
    Game_BattlerBase.prototype.param = function(paramId) {
        if (this._calcParameter) {
            return this._baseFlag ? this.paramBase(paramId) : _Game_BattlerBase_param.apply(this, arguments);
        } else {
            return _Game_BattlerBase_param.apply(this, arguments);
        }
    };

    const _Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
    Game_BattlerBase.prototype.xparam = function(xparamId) {
        if (this._calcParameter) {
            return _Game_BattlerBase_xparam.apply(this, arguments);
        } else {
            const paramId = xparamId + Game_BattlerBase._paramNumber;
            return this.getDynamicParam(paramId, _Game_BattlerBase_xparam.apply(this, arguments), false);
        }
    };

    const _Game_BattlerBase_sparam = Game_BattlerBase.prototype.sparam;
    Game_BattlerBase.prototype.sparam = function(sparamId) {
        if (this._calcParameter) {
            return _Game_BattlerBase_sparam.apply(this, arguments);
        } else {
            const paramId = sparamId + Game_BattlerBase._paramNumber + Game_BattlerBase._xParamNumber;
            return this.getDynamicParam(paramId, _Game_BattlerBase_sparam.apply(this, arguments), false);
        }
    };

    const _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(paramId) {
        return this.getDynamicParam(paramId, _Game_Actor_paramBase.apply(this, arguments), true);
    };

    const _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function(paramId) {
        return this.getDynamicParam(paramId, _Game_Enemy_paramBase.apply(this, arguments), true);
    };
})();
