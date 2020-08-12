/*=============================================================================
 YEP_PartySystem_nonRemovePatch.js.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2019/12/07 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc YEP_PartySystem_nonRemovePatchPlugin
 * @target MZ @author triacontane
 *
 * @help YEP_PartySystem_nonRemovePatch.js.js
 *
 * YEP_PartySystem.js使用時、離脱コマンドを空にすることで
 * パーティリストに離脱コマンドが出現しないよう変更します。
 * このパッチをYEP_PartySystem.jsより下に配置してください。
 *
 * ご利用の際は元プラグインのライセンスも併せてご確認ください。
 *
 * YEP_PartySystem.js
 * http://www.yanfly.moe/wiki/Party_System_(YEP)
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc YEP_PartySystem離脱除去プラグイン
 * @target MZ @author トリアコンタン
 *
 * @help YEP_PartySystem_nonRemovePatch.js
 *
 * YEP_PartySystem.js使用時、離脱コマンドを空にすることで
 * パーティリストに離脱コマンドが出現しないよう変更します。
 * このパッチをYEP_PartySystem.jsより下に配置してください。
 *
 * ご利用の際は元プラグインのライセンスも併せてご確認ください。
 *
 * YEP_PartySystem.js
 * http://www.yanfly.moe/wiki/Party_System_(YEP)
 *　
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';

    if (typeof Imported === 'undefined' || !Imported.YEP_PartySystem) {
        throw new Error('YEP_PartySystem.js is not found. This is patch of YEP_PartySystem.js')
    }

    if (Yanfly.Param.PartyCommand2) {
        return;
    }

    var _Window_PartyList_initialize = Window_PartyList.prototype.initialize;
    Window_PartyList.prototype.initialize = function(partyWindow) {
        _Window_PartyList_initialize.apply(this, arguments);
        this.select(0);
    };

    var _Window_PartyList_makeItemList = Window_PartyList.prototype.makeItemList;
    Window_PartyList.prototype.makeItemList = function() {
        _Window_PartyList_makeItemList.apply(this, arguments);
        this._data = this._data.filter(function(index) {
            return index !== 0;
        });
    };
})();
