/*=============================================================================
 ChargeTimeControl.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.2.2 2021/05/28 チャージタイム増減以外の効果がないときに「効かなかった」と表示されないよう修正
 1.2.1 2021/05/28 チャージタイムの増加によってゲージが満タンになったとき行動選択時にエラーになる場合がある問題を修正
 1.2.0 2021/03/02 チャージタイムの有効率を増加、減少それぞれで指定できる機能を追加
 1.1.0 2021/02/06 チャージタイムの増減に計算式を指定できる機能を追加
 1.0.0 2020/08/21 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc ProgressControlEffectPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChargeTimeControl.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @command ChangeChargeTime
 * @desc Changes the charge time for the specified actors.
 *
 * @arg actorId
 * @desc This is the ID of the actor whose charge time is to be changed.
 * @default 0
 * @type actor
 *
 * @arg operand
 * @desc The amount of charge time effect to be changed.
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @command ChangeEnemyChargeTime
 * @desc Changes the charge time of the specified enemy character.
 *
 * @arg enemyIndex
 * @desc The index of the enemy character to change the charge time. If you set it to -1, it becomes all of them.
 * @default 0
 * @type number
 * @min -1
 *
 * @arg operand
 * @desc The amount of charge time effect to be changed.
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @help ChargeTimeControl.js
 *
 * In time-progress battle, the effects of skills and items
 * can be added to the target
 * Gives the effect of increasing or decreasing the charge time.
 * You can add the following in the item or skill memo field.
 * <ChargeTime:50>  // Increases the charge time by 50 (the maximum is 100).
 * <ChargeTime:-50> // Decreases the charge time by 50.
 * <ChargeTimeJs:f> // charge time by formula result.
 *
 * It also provides a command to change the charge time of the specified butler.
 *
 * It does not affect the cast time.
 * It is also disabled if the turn has already been turned in active time.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc チャージタイム制御プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ChargeTimeControl.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @command ChangeChargeTime
 * @text チャージタイム変更
 * @desc 指定したアクターのチャージタイムを変更します。
 *
 * @arg actorId
 * @text 対象アクターID
 * @desc チャージタイムを変更するアクターのIDです。0を選択すると全員になります。制御文字\v[n]はテキストタブから入力してください。
 * @default 0
 * @type actor
 *
 * @arg operand
 * @text 効果量
 * @desc 変更するチャージタイムの効果量です。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @command ChangeEnemyChargeTime
 * @text 敵キャラのチャージタイム変更
 * @desc 指定した敵キャラのチャージタイムを変更します。
 *
 * @arg enemyIndex
 * @text 対象敵キャラインデックス
 * @desc チャージタイムを変更する敵キャラのインデックスです。-1を指定すると全員になります。制御文字\v[n]はテキストタブから入力してください。
 * @default 0
 * @type number
 * @min -1
 *
 * @arg operand
 * @text 効果量
 * @desc 変更するチャージタイムの効果量です。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @help ChargeTimeControl.js
 *
 * タイムプログレス戦闘において、スキルやアイテムの効果に対象の
 * チャージタイムを増減させる効果を付与します。
 * アイテムもしくはスキルのメモ欄に以下の通り記述してください。
 * <ChargeTime:50>  // チャージタイムを50増加させます(最大値は100)。
 * <ChargeTime:-50> // チャージタイムを50減少させます。
 * <ChargeTimeJs:f> // チャージタイムを計算式[f]の評価結果だけ増加させます。
 * スキルのダメージ計算式と同じ要領で指定しますが記号「>」は使用できません。
 * 公式プラグイン「TextScriptBase」があれば制御文字\tx[aaa]が使えます。
 *
 * また、指定したバトラーのチャージタイムを変更するコマンドを提供します。
 *
 * キャストタイムには影響しません。
 * また、アクティブタイムで既にターンが回っている場合は無効です。
 *
 * チャージタイムの増加および減少の有効率を別途設定できます。
 * 0に指定することで無効化でき、200を設定すると2倍の効力になります。
 * 特徴を有するメモ欄(アクター、職業、武器、防具、ステート、敵キャラ)に
 * 以下の通り指定してください。
 * <ChargeTimePlusRate:150> // チャージタイムの増加率が1.5倍
 * <ChargeTimeMinusRate:50> // チャージタイムの減少率が0.5倍
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    const script = document.currentScript;

    PluginManagerEx.registerCommand(script, 'ChangeChargeTime', function(args) {
        this.iterateActorId(args.actorId, actor => {
            actor.changeTpbChargeTime(args.operand);
        })
    });

    PluginManagerEx.registerCommand(script, 'ChangeEnemyChargeTime', function(args) {
        this.iterateEnemyIndex(args.enemyIndex, enemy => {
            enemy.changeTpbChargeTime(args.operand);
        })
    });

    const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        _Game_Action_applyItemUserEffect.apply(this, arguments);
        this.applyChangeChargeTime(target);
    };

    Game_Action.prototype.applyChangeChargeTime = function(target) {
        const chargeTime = PluginManagerEx.findMetaValue(this.item(), 'ChargeTime');
        if (chargeTime) {
            target.changeTpbChargeTime(chargeTime);
            this.makeSuccess(target);
        }
        this.applyChangeChargeTimeJs(target);
    };

    Game_Action.prototype.applyChangeChargeTimeJs = function(target) {
        const chargeTimeJs = PluginManagerEx.findMetaValue(this.item(), 'ChargeTimeJs');
        if (chargeTimeJs) {
            try {
                const a = this.subject();
                const b = target;
                const value = eval(chargeTimeJs);
                target.changeTpbChargeTime(value);
                this.makeSuccess(target);
            } catch (e) {
                PluginManagerEx.throwError( `<ChargeTimeJs:${chargeTimeJs}> ${e.message}`, script);
            }
        }
    };

    Game_Battler.prototype.changeTpbChargeTime = function(value) {
        if (this._tpbState !== "charging") {
            return;
        }
        this._tpbChargeTime += value / 100 * this.findChargeTimeRate(value);
        this._tpbChargeTime = this._tpbChargeTime.clamp(0, 1);
    };

    Game_Battler.prototype.findChargeTimeRate = function(value) {
        const name = value > 0 ? 'ChargeTimePlusRate' : 'ChargeTimeMinusRate';
        for (const obj of this.traitObjects()) {
            const rate = PluginManagerEx.findMetaValue(obj, name);
            if (rate !== undefined) {
                return rate / 100;
            }
        }
        return 1.0;
    };
})();
