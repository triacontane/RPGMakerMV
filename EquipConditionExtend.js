//=============================================================================
// EquipConditionExtend.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.6.0 2023/06/28 指定した装備条件を反転させ、条件を満たすと装備できなくなる機能を追加
// 1.5.0 2022/03/08 特定の装備品を装備しているかどうかを装備条件に追加
// 1.4.0 2021/10/24 各種パラメータが指定値を超えているかどうかを装備条件に追加
// 1.3.0 2021/06/18 タグで複数の条件を指定したとき、すべての条件を満たした場合にのみ装備できるよう変更する機能を追加
//                  ステートの条件が機能していなかった問題を修正
// 1.2.0 2021/06/17 MZ版を作成
// 1.1.0 2020/05/05 計算式で制御文字が使えるよう修正
// 1.0.1 2017/02/07 端末依存の記述を削除
// 1.0.0 2017/01/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 装備条件拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EquipConditionExtend.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param MultiConditionAnd
 * @text 複数条件を『かつ』に変更
 * @desc メモ欄のタグで対象を複数指定したとき、すべての条件を満たしたときに装備できるよう変更します。(アクターは除く)
 * @default false
 * @type boolean
 *
 * @help 装備条件を拡張します。
 * 武器または防具のメモ欄に以下の通り記述してください。
 *
 * <装備条件スキル:5>     # ID[5]のスキルを習得している。
 * <装備条件ステート:7>   # ID[7]のステートが有効になっている。
 * <装備条件アクター:4>   # ID[4]のアクターである。
 * <装備条件スイッチ:1,3> # ID[1]もしくはID[3]のスイッチがONになっている。
 * <装備条件武器:6>       # ID[6]の武器を装備している。
 * <装備条件防具:7>       # ID[7]の防具を装備している。
 * <装備条件計算式:f>     # JS計算式[f]がtrueを返す
 * <装備条件HP:100>      # 装備品や特徴を含まない基礎HPが100以上
 * <装備条件MP:100>      # 装備品や特徴を含まない基礎MPが100以上
 * <装備条件攻撃:100>    # 装備品や特徴を含まない基礎攻撃力が100以上
 * <装備条件防御:100>    # 装備品や特徴を含まない基礎防御力が100以上
 * <装備条件魔法:100>    # 装備品や特徴を含まない基礎魔法力が100以上
 * <装備条件魔防:100>    # 装備品や特徴を含まない基礎魔法防御が100以上
 * <装備条件敏捷:100>    # 装備品や特徴を含まない基礎敏捷性が100以上
 * <装備条件運:100>      # 装備品や特徴を含まない基礎運が100以上
 * <装備条件反転>        # タグで指定した装備条件を反転させ、
 *                       条件を満たさない場合に装備可能にする。
 *
 * 数値をカンマ区切りで複数記入すると、指定した数値のいずれかが該当すれば
 * 装備可能になります。
 *
 * スキルとステートについては、負の値を設定すると指定したIDのスキル、ステートが
 * 無効な場合のみ装備できるようになります。
 *
 * 装備後に条件を満たさなくなった場合でも装備は外れません。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_BattlerBase_canEquipWeapon = Game_BattlerBase.prototype.canEquipWeapon;
    Game_BattlerBase.prototype.canEquipWeapon = function(item) {
        return _Game_BattlerBase_canEquipWeapon.apply(this, arguments) && this.canEquipExtend(item);
    };

    const _Game_BattlerBase_canEquipArmor = Game_BattlerBase.prototype.canEquipArmor;
    Game_BattlerBase.prototype.canEquipArmor = function(item) {
        return _Game_BattlerBase_canEquipArmor.apply(this, arguments) && this.canEquipExtend(item);
    };

    Game_BattlerBase.prototype.canEquipExtend = function(item) {
        if (!item) {
            return false;
        }
        const reverse = item.meta['装備条件反転'];
        if (reverse) {
            return !this.canEquipExtendSub(item);
        }　else {
            return this.canEquipExtendSub(item);
        }
    };

    Game_BattlerBase.prototype.canEquipExtendSub = function(item) {
        if (!this.canEquipExtendSkill(item)) {
            return false;
        }
        if (!this.canEquipExtendState(item)) {
            return false;
        }
        if (!this.canEquipExtendActor(item)) {
            return false;
        }
        if (!this.canEquipExtendSwitch(item)) {
            return false;
        }
        if (!this.canEquipExtendFormula(item)) {
            return false;
        }
        if (!this.canEquipExtendWeapon(item)) {
            return false;
        }
        if (!this.canEquipExtendArmor(item)) {
            return false;
        }
        for (let i = 0; i <= 7; i++) {
            if (!this.canEquipExtendParam(item, i)) {
                return false;
            }
        }
        return true;
    };

    Game_BattlerBase.prototype.canEquipExtendSkill = function(item) {
        const metaValue = this.findEquipExtendValue(item, ['装備条件スキル', 'EquipCondSkill']);
        if (!metaValue) return true;
        return metaValue[this.findEquipExtendConditionMethod()](skillId => {
            const hasSkill = this.skills().contains($dataSkills[Math.abs(skillId)]);
            return skillId < 0 ? !hasSkill : hasSkill;
        });
    };

    Game_BattlerBase.prototype.canEquipExtendState = function(item) {
        const metaValue = this.findEquipExtendValue(item, ['装備条件ステート', 'EquipCondState']);
        if (!metaValue) return true;
        return metaValue[this.findEquipExtendConditionMethod()](stateId => {
            const isState = this.isStateAffected(stateId);
            return stateId < 0 ? !isState : isState;
        });
    };

    Game_BattlerBase.prototype.canEquipExtendActor = function(item) {
        const metaValue = this.findEquipExtendValue(item, ['装備条件アクター', 'EquipCondActor']);
        if (!metaValue) return true;
        return this.isActor() ? metaValue.contains(this.actorId()) : false;
    };

    Game_BattlerBase.prototype.canEquipExtendSwitch = function(item) {
        const metaValue = this.findEquipExtendValue(item, ['装備条件スイッチ', 'EquipCondSwitch']);
        if (!metaValue) return true;
        return metaValue[this.findEquipExtendConditionMethod()](switchId => {
            return $gameSwitches.value(switchId);
        });
    };

    Game_BattlerBase.prototype.canEquipExtendWeapon = function(item) {
        const metaValue = this.findEquipExtendValue(item, ['装備条件武器', 'EquipCondWeapon']);
        if (!metaValue) return true;
        return this.isActor() ? metaValue.some(id => this.hasWeapon($dataWeapons[id])) : false;
    };

    Game_BattlerBase.prototype.canEquipExtendArmor = function(item) {
        const metaValue = this.findEquipExtendValue(item, ['装備条件防具', 'EquipCondArmor']);
        if (!metaValue) return true;
        return this.isActor() ? metaValue.some(id => this.hasArmor($dataArmors[id])) : false;
    };

    Game_BattlerBase.prototype.canEquipExtendParam = function(item, paramId) {
        const tags = [
            ['装備条件HP', 'EquipCondHp'],
            ['装備条件MP', 'EquipCondMp'],
            ['装備条件攻撃', 'EquipCondAtk'],
            ['装備条件防御', 'EquipCondDef'],
            ['装備条件魔法', 'EquipCondMat'],
            ['装備条件魔防', 'EquipCondMdf'],
            ['装備条件敏捷', 'EquipCondAgi'],
            ['装備条件運', 'EquipCondLuk']
        ];
        const value = this.findEquipExtendValue(item, tags[paramId]);
        return value ? (this.paramBase(paramId) + this._paramPlus[paramId]) >= value : true;
    };


    Game_BattlerBase.prototype.findEquipExtendValue = function(item, tags) {
        const metaValue = PluginManagerEx.findMetaValue(item, tags);
        if (metaValue === undefined) {
            return undefined;
        } else if (metaValue === String(metaValue)) {
            return metaValue.split(',').map(value => parseInt(value));
        } else {
            return [metaValue];
        }
    };

    Game_BattlerBase.prototype.findEquipExtendConditionMethod = function() {
        return param.MultiConditionAnd ? 'every' : 'some';
    };

    Game_BattlerBase.prototype.canEquipExtendFormula = function(item) {
        const metaValue = PluginManagerEx.findMetaValue(item, ['装備条件計算式', 'EquipCondFormula']);
        if (!metaValue) return true;
        try {
            return eval(metaValue);
        } catch (e) {
            console.error(e.stack);
            return false;
        }
    };
})();


