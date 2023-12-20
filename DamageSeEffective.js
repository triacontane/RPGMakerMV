/*=============================================================================
 DamageSeEffective.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2023/12/21 スクリプトの条件を追加
 1.0.0 2023/12/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 弱点耐性ダメージSEプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DamageSeEffective.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param damageSeList
 * @text ダメージSEリスト
 * @desc ダメージSEのリストです。演奏条件とSEを指定します。条件を満たすSEが複数あるときはリストの上が優先されます。
 * @default []
 * @type struct<DamageSe>[]
 *
 * @help DamageSeEffective.js
 *
 * スキルのダメージ結果によってダメージ効果音を変更できます。
 * 例えば以下のような条件で専用の効果音を演奏できます。
 * ・弱点ダメージだった場合
 * ・耐性ダメージだった場合
 * ・ダメージが0だった場合
 * ・クリティカルヒットだった場合
 * ・スイッチがONだった場合
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~DamageSe:
 *
 * @param label
 * @text ラベル
 * @desc 効果音を識別するためのラベルです。特に使用されない管理用の値です。
 *
 * @param name
 * @text ファイル名
 * @desc 効果音のファイル名です。
 * @default
 * @dir audio/se/
 * @type file
 *
 * @param volume
 * @text 音量
 * @desc 効果音の音量です。
 * @default 90
 * @type number
 * @max 100
 * @min 0
 *
 * @param pitch
 * @text ピッチ
 * @desc 効果音のピッチです。
 * @default 100
 * @type number
 * @max 150
 * @min 50
 *
 * @param pan
 * @text 位相
 * @desc 効果音の位相(定位)です。
 * @default 0
 * @type number
 * @max 100
 * @min -100
 *
 * @param condition
 * @text 条件
 * @desc 効果音の演奏条件です。未入力の条件は無視されます。
 * @default {}
 * @type struct<Condition>
 *
 */

/*~struct~Condition:
 *
 * @param elementRateUpper
 * @text 属性倍率上限
 * @desc 属性によるダメージ倍率(百分率)が指定値以下だった場合に演奏されます。耐性SEを演奏する場合に指定します。
 * @default
 * @type number
 *
 * @param elementRateLower
 * @text 属性倍率下限
 * @desc 属性によるダメージ倍率(百分率)が指定値以上だった場合に演奏されます。弱点SEを演奏する場合に指定します。
 * @default
 * @type number
 *
 * @param elementId
 * @text 属性ID
 * @desc 指定した属性IDが含まれていた場合に演奏されます。属性ごとにSEを演奏する場合に指定します。
 * @default
 * @type number
 *
 * @param damageUpper
 * @text ダメージ上限
 * @desc ダメージが指定値以下だった場合に演奏されます。
 * @default
 * @type number
 *
 * @param damageLower
 * @text ダメージ下限
 * @desc ダメージが指定値以上だった場合に演奏されます。
 * @default
 * @type number
 *
 * @param critical
 * @text クリティカル
 * @desc クリティカルヒットだった場合に演奏されます。
 * @default
 * @type boolean
 *
 * @param switchId
 * @text スイッチID
 * @desc 指定したスイッチがONの場合に演奏されます。
 * @default
 * @type number
 *
 * @param script
 * @text スクリプト
 * @desc 指定したスクリプトがtrueを返した場合に演奏されます。
 * @default
 * @type multiline_string
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.damageSeList) {
        param.damageSeList = [];
    }

    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.elementRate = 0;
        this.elements = [];
    };

    const _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        const rate = _Game_Action_calcElementRate.apply(this, arguments);
        const result = target.result();
        result.elementRate = rate;
        const elementId = this.item().damage.elementId;
        result.elements = elementId < 0 ? this.subject().attackElements() : [elementId];
        return rate;
    };

    const _Window_BattleLog_displayHpDamage = Window_BattleLog.prototype.displayHpDamage;
    Window_BattleLog.prototype.displayHpDamage = function(target) {
        SoundManager.setDamageSeEffective(target.result());
        this.push('performDamageSeEffective');
        _Window_BattleLog_displayHpDamage.apply(this, arguments);
        this.push('clearDamageSeEffective');
    };

    Window_BattleLog.prototype.performDamageSeEffective = function() {
        SoundManager.playDamageSeEffective();
    };

    Window_BattleLog.prototype.clearDamageSeEffective = function() {
        SoundManager.clearDamageSeEffective();
    };

    SoundManager.setDamageSeEffective = function(result) {
        if (!result.hpAffected) {
            return;
        }
        this._damageSe = param.damageSeList.find(se => {
            const c = se.condition;
            const list = [];
            const elementRate = result.elementRate * 100;
            list.push(c.elementRateUpper === '' || elementRate <= c.elementRateUpper);
            list.push(c.elementRateLower === '' || elementRate >= c.elementRateLower);
            list.push(c.elementId === '' || result.elements.includes(c.elementId));
            list.push(c.damageUpper === '' || result.hpDamage <= c.damageUpper);
            list.push(c.damageLower === '' || result.hpDamage >= c.damageLower);
            list.push(c.critical === '' || result.critical === c.critical);
            list.push(c.switchId === '' || $gameSwitches.value(c.switchId));
            list.push(c.script === '' || eval(c.script));
            return list.every(c => c);
        });
    };

    SoundManager.playDamageSeEffective = function() {
        if (this._damageSe) {
            AudioManager.playSe(this._damageSe);
        }
    };

    SoundManager.clearDamageSeEffective = function() {
        this._damageSe = null;
    };

    const _SoundManager_playActorDamage = SoundManager.playActorDamage;
    SoundManager.playActorDamage = function() {
        if (!this._damageSe) {
            _SoundManager_playActorDamage.apply(this, arguments);
        }
    };

    const _SoundManager_playEnemyDamage = SoundManager.playEnemyDamage;
    SoundManager.playEnemyDamage = function() {
        if (!this._damageSe) {
            _SoundManager_playEnemyDamage.apply(this, arguments);
        }
    };
})();
