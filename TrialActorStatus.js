/*=============================================================================
 TrialActorStatus.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2023/11/28 戦闘中でも呼び出せるよう修正
 1.0.0 2023/11/28 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アクターステータスのお試し表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TrialActorStatus.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command SHOW_STATUS
 * @text ステータス表示
 * @desc アクターIDを指定してステータスを表示します。
 *
 * @arg actorId
 * @text アクターID
 * @desc ステータスを表示するアクターIDです。
 * @default 1
 * @type actor
 *
 * @arg screen
 * @text 画面
 * @desc ステータスを表示する画面です。
 * @default Scene_Status
 * @type select
 * @option ステータス画面
 * @value Scene_Status
 * @option スキル画面
 * @value Scene_Skill
 * @option 装備画面
 * @value Scene_Equip
 *
 * @help TrialActorStatus.js
 *
 * アクターIDを指定してステータス画面や装備画面を表示します。
 * パーティにいないメンバを指定することができます。
 * 装備画面やスキル画面では、装備変更やスキル使用ができるので
 * ご注意ください。
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

    PluginManagerEx.registerCommand(script, 'SHOW_STATUS', args => {
        const actorId = args.actorId;
        const screen = args.screen;
        const actor = $gameActors.actor(actorId);
        if (actor) {
            ImageManager.loadFace(actor.faceName());
            $gameParty.setCustomMenuActor(actorId);
            SceneManager.push(eval(screen));
        }
    });

    const _Game_Party_menuActor = Game_Party.prototype.menuActor;
    Game_Party.prototype.menuActor = function() {
        if (this._customMenuActorId !== undefined) {
            return $gameActors.actor(this._customMenuActorId);
        }
        return _Game_Party_menuActor.apply(this, arguments);
    };

    Game_Party.prototype.setCustomMenuActor = function(actorId) {
        this._customMenuActorId = actorId;
    };

    Game_Party.prototype.clearCustomMenuActor = function() {
        this._customMenuActorId = undefined;
    };

    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        _Scene_Base_terminate.apply(this, arguments);
        if (!(this instanceof Scene_Map) && !(this instanceof Scene_Battle)) {
            $gameParty.clearCustomMenuActor();
        }
    };
})();
