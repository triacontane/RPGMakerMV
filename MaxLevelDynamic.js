/*=============================================================================
 MaxLevelDynamic.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/09/03 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 最大レベル動的設定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/MaxLevelDynamic.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param expCap
 * @text 経験値キャップ
 * @desc 最大レベルに達したとき、それ以上の経験値は取得できなくなります。
 * @default true
 * @type boolean
 *
 * @help MaxLevelDynamic.js
 *
 * アクターの最大レベルを動的に設定します。
 * アクターのメモ欄から以下の通り設定してください。
 *
 * <MaxLevelVariable:3> # 変数[3]の値が最大レベルになります。
 *
 * メモ欄の指定がない場合、あるいは値が0の場合、
 * データベースでもともと設定していた最大レベルが適用されます。
 *
 * 経験値キャップを無効にした状態で最大レベルを上げた場合、
 * そのままでは反映されないので、イベントコマンド「経験値の増減」などで
 * レベルアップを反映させてください。
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

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Game_Actor_maxLevel = Game_Actor.prototype.maxLevel;
    Game_Actor.prototype.maxLevel = function() {
        const defaultMaxLevel = _Game_Actor_maxLevel.apply(this, arguments);
        const variableId = PluginManagerEx.findMetaValue(this.actor(), 'MaxLevelVariable');
        if ($gameVariables.value(variableId) > 0) {
            return $gameVariables.value(variableId);
        } else {
            return defaultMaxLevel;
        }
    };

    const _Game_Actor_changeExp = Game_Actor.prototype.changeExp;
    Game_Actor.prototype.changeExp = function(exp, show) {
        if (param.expCap) {
            arguments[0] = Math.min(this.expForLevel(this.maxLevel()), exp);
        }
        _Game_Actor_changeExp.apply(this, arguments);
    };
})();
