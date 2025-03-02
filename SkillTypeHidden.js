/*=============================================================================
 SkillTypeHidden.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2025/03/02 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc スキルタイプ非表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SkillTypeHidden.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param hidden
 * @text 非表示
 * @desc 封印されたスキルタイプを非表示にします。(無効にした場合は選択不可)
 * @default false
 * @type boolean
 *
 * @help SkillTypeHidden.js
 *
 * 封印されたスキルタイプをアクターコマンドから非表示もしくは選択不可にします。
 * （現行仕様では、アクターコマンドでは選択可能でスキル選択画面で選択不可）
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

    const _Game_Actor_skillTypes = Game_Actor.prototype.skillTypes;
    Game_Actor.prototype.skillTypes = function() {
        const types = _Game_Actor_skillTypes.apply(this, arguments);
        if (this._sealSkillTypeFilter) {
            this._sealSkillTypeFilter = false;
            return types.filter(type => !this.isSkillTypeSealed(type));
        } else {
            return types;
        }
    };

    Game_Actor.prototype.setSealSkillTypeFilter = function(value) {
        this._sealSkillTypeFilter = value;
    };

    const _Window_ActorCommand_addSkillCommands = Window_ActorCommand.prototype.addSkillCommands;
    Window_ActorCommand.prototype.addSkillCommands = function() {
        if (param.hidden) {
            this._actor.setSealSkillTypeFilter(true);
        }
        _Window_ActorCommand_addSkillCommands.apply(this, arguments);
        if (!param.hidden) {
            this._list
                .filter(command => command.symbol === 'skill' && this._actor.isSkillTypeSealed(command.ext))
                .forEach(command => command.enabled = false);
        }
    };
})();
