/*=============================================================================
 BattlerNameEscape.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/12/26 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc バトラー名に制御文字使用プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattlerNameEscape.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @help BattlerNameEscape.js
 *
 * アクター名、敵キャラ名に制御文字が使えるようになります。
 * ただし、\i[n]や\c[n]などテキストの外観を変える制御文字には対応できません。
 *
 * \v[n], \p[n]や公式プラグイン「TextScriptBase」との連携は可能です。
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

    const _Game_Actor_name = Game_Actor.prototype.name;
    Game_Actor.prototype.name = function() {
        return this.convertEscapeText(_Game_Actor_name.apply(this, arguments));
    };

    const _Game_Enemy_name = Game_Enemy.prototype.name;
    Game_Enemy.prototype.name = function() {
        return this.convertEscapeText(_Game_Enemy_name.apply(this, arguments));
    };

    Game_Battler.prototype.convertEscapeText = function(text) {
        return PluginManagerEx.convertEscapeCharacters(text, null);
    };
})();
