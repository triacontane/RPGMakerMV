/*=============================================================================
 DifficultyOption.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2023/10/13 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 難易度設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DifficultyOption.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param difficultyList
 * @text 難易度リスト
 * @desc 難易度の設定リストです。より下に高い難度のデータを指定してください。
 * @default []
 * @type struct<Difficulty>[]
 *
 * @param difficultyVariableId
 * @text 難易度変数ID
 * @desc 現在の難易度を指定する変数IDです。この変数に格納された値が難易度リストのインデックスになります。
 * @default 1
 * @type variable
 *
 * @help DifficultyOption.js
 *
 * 難易度を設定できるようになります。
 * 設定した難易度は敵キャラのパラメータ倍率に影響します。
 * 指定した難度以上のときだけONになるスイッチも作成できます。
 * ただし、パフォーマンス上の理由から、このスイッチのON/OFFは
 * マップ画面でしか更新されません。
 *
 * 難易度の変更はパラメータ「難易度変数ID」の値を変更することで実現します。
 * オプション画面などで変更させたい場合は、別途公開している
 * 「オプション任意項目作成プラグイン」などと連携してください。
 *
 * さらに、以下のプラグインと組み合わせれば、難易度に応じて様々な
 * 仕様を変更できます。
 * ・初期ステートプラグイン
 * ・敵キャラ報酬レート設定プラグイン
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

/*~struct~Difficulty:
 *
 * @param name
 * @text 難易度名称
 * @desc 難易度の名称です。識別用の項目なので特に意味はありません。
 * @default Normal
 *
 * @param switchId
 * @text 難易度スイッチID
 * @desc この難易度もしくはより上位の難易度が有効になったときに自動でONになるスイッチです。条件を満たさないときはOFFになります。
 * @default 0
 * @type switch
 *
 * @param hpRate
 * @text HP倍率
 * @desc この難易度が有効なときのHPの倍率です。100を指定すると通常の倍率になります。
 * @default 100
 * @type number
 * @min 1
 *
 * @param mpRate
 * @text MP倍率
 * @desc この難易度が有効なときのMPの倍率です。100を指定すると通常の倍率になります。
 * @default 100
 * @type number
 * @min 1
 *
 * @param atkRate
 * @text 攻撃力倍率
 * @desc この難易度が有効なときの攻撃力の倍率です。100を指定すると通常の倍率になります。
 * @default 100
 * @type number
 * @min 1
 *
 * @param defRate
 * @text 防御力倍率
 * @desc この難易度が有効なときの防御力の倍率です。100を指定すると通常の倍率になります。
 * @default 100
 * @type number
 * @min 1
 *
 * @param matRate
 * @text 魔法力倍率
 * @desc この難易度が有効なときの魔法力の倍率です。100を指定すると通常の倍率になります。
 * @default 100
 * @type number
 * @min 1
 *
 * @param mdfRate
 * @text 魔法防御倍率
 * @desc この難易度が有効なときの魔法防御の倍率です。100を指定すると通常の倍率になります。
 * @default 100
 * @type number
 * @min 1
 *
 * @param agiRate
 * @text 敏捷性倍率
 * @desc この難易度が有効なときの敏捷性の倍率です。100を指定すると通常の倍率になります。
 * @default 100
 * @type number
 * @min 1
 *
 * @param lukRate
 * @text 運倍率
 * @desc この難易度が有効なときの運の倍率です。100を指定すると通常の倍率になります。
 * @default 100
 * @type number
 * @min 1
 *
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.difficultyList) {
        param.difficultyList = [];
    }

    Game_System._paramNames = ['hpRate', 'mpRate', 'atkRate', 'defRate', 'matRate', 'mdfRate', 'agiRate', 'lukRate'];
    Game_System.prototype.getDifficultyIndex = function() {
        return $gameVariables.value(param.difficultyVariableId);
    };

    Game_System.prototype.getDifficulty = function() {
        const index = this.getDifficultyIndex();
        return param.difficultyList[index];
    };

    Game_System.prototype.getDifficultyParamRate = function(paramId) {
        const difficulty = this.getDifficulty();
        return difficulty ? difficulty[Game_System._paramNames[paramId]] : 100;
    };

    Game_System.prototype.updateDifficultySwitch = function() {
        const index = this.getDifficultyIndex();
        if (index === this._defficultySwitchIndex) {
            return;
        }
        this._defficultySwitchIndex = index;
        param.difficultyList.forEach((difficulty, i) => {
            $gameSwitches.setValue(difficulty.switchId, i <= index);
        });
    };

    const _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function(paramId) {
        const rate = $gameSystem.getDifficultyParamRate(paramId);
        return Math.round(_Game_Enemy_paramBase.apply(this, arguments) * rate / 100);
    };

    const _Scene_Map_update = Scene_Map.prototype.update
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.apply(this, arguments);
        $gameSystem.updateDifficultySwitch();
    };

    const _Scene_Options_terminate = Scene_Options.prototype.terminate;
    Scene_Options.prototype.terminate = function() {
        _Scene_Options_terminate.apply(this, arguments);
        $gameSystem.updateDifficultySwitch();
    };
})();
