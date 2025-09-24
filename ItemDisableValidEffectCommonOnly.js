/*=============================================================================
 ItemDisableValidEffectCommonOnly.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/09/24 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 有効効果がコモンのみのアイテムはアクターに使用不可プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ItemDisableValidEffectCommonOnly.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help ItemDisableValidEffectCommonOnly.js
 *
 * アクターに使用可能かつ有効効果がコモンイベントのみのアイテムやスキルを
 * 使用不可にしてコモンイベントが実行されないようにします。
 *
 * デフォルト仕様においてHP回復アイテムは対象アクターのHPが満タンなどの理由で
 * 有効な効果がひとつもない場合、メニュー画面では使用できません。
 * しかし効果にコモンイベントが含まれていると無条件で使用可能になります。
 *
 * 当プラグインはこの仕様を変更し、コモンイベント以外に有効な効果がない場合は
 * アイテムやスキルを使用不可としコモンイベントも実行できなくなります。
 * この仕様変更はメニュー画面でのみ有効です。
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

    const _Game_Action_testApply = Game_Action.prototype.testApply;
    Game_Action.prototype.testApply = function(target) {
        if (SceneManager._scene instanceof Scene_MenuBase) {
            this._testEffectsWithoutCommon = true;
        }
        const result = _Game_Action_testApply.apply(this, arguments);
        this._testEffectsWithoutCommon = false;
        return result;
    };

    const _Game_Action_testItemEffect =  Game_Action.prototype.testItemEffect;
    Game_Action.prototype.testItemEffect = function(target, effect) {
        const result = _Game_Action_testItemEffect.apply(this, arguments);
        if (result && this._testEffectsWithoutCommon && effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            return false;
        } else {
            return result;
        }
    };
})();
