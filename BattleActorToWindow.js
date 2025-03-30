/*=============================================================================
 BattleActorToWindow.js
----------------------------------------------------------------------------
 (C)2025 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2025/03/20 ステータスウィンドウが敵キャラ画像より前面に表示されるよう修正
 1.0.0 2025/01/20 初版
----------------------------------------------------------------------------
 [X]      : https://x.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アクター画像のウィンドウ表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleActorToWindow.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param actorHidden
 * @text アクター非表示
 * @desc アクター画像を非表示にします。
 * @default true
 * @type boolean
 *
 * @param adjustX
 * @text X座標調整
 * @desc アクター画像の表示X座標を調整します。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param adjustY
 * @text Y座標調整
 * @desc アクター画像の表示Y座標を調整します。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @help BattleActorToWindow.js
 *
 * 戦闘画面においてアクター画像を非表示にしたうえでウィンドウ付近に表示します。
 * 擬似的にフロントビューに見せたうえでアクター向けのアニメーションや
 * ステート重ね合わせアニメーションを表示できます。
 *
 * システム上の設定は「サイドビュー」にしてください。
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

    Sprite_Actor.prototype.syncStatusWindow = function(index, statusWindow) {
        const width = statusWindow.itemWidth();
        this.x = statusWindow.x + index * width + width / 2 + param.adjustX;
        this.y = statusWindow.y + this._mainSprite.height + param.adjustY;
        this._homeX = this.x;
        this._homeY = this.y;
        if (param.actorHidden) {
            this._mainSprite.visible = false;
            this._shadowSprite.visible = false;
            this._weaponSprite.visible = false;
        }
    };

    const _Spriteset_Battle_updateActors = Spriteset_Battle.prototype.updateActors;
    Spriteset_Battle.prototype.updateActors = function() {
        _Spriteset_Battle_updateActors.apply(this, arguments);
        this._actorSprites.forEach((sprite, index) => {
            sprite.syncStatusWindow(index, this._statusWindow);
        });
    };

    Spriteset_Battle.prototype.setStatusWindow = function(statusWindow) {
        this._statusWindow = statusWindow;
        statusWindow.y -= this._battleField.y;
        const actorSpriteIndex = this._battleField.children.findIndex(sprite => sprite instanceof Sprite_Actor);
        this._battleField.addChildAt(this._statusWindow, actorSpriteIndex);
    };

    const _Scene_Battle_createStatusWindow = Scene_Battle.prototype.createStatusWindow;
    Scene_Battle.prototype.createStatusWindow = function() {
        _Scene_Battle_createStatusWindow.apply(this, arguments);
        this._spriteset.setStatusWindow(this._statusWindow);
    };
})();
