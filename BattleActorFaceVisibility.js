/*=============================================================================
 BattleActorFaceVisibility.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2024/02/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 戦闘中顔グラフィック表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleActorFaceVisibility.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param nameVisible
 * @text 名前表示
 * @desc フェイスウィンドウと一緒にアクター名も表示します。
 * @default true
 * @type boolean
 *
 * @param position
 * @text 表示位置
 * @desc フェイスウィンドウの表示位置です。
 * @default left
 * @type select
 * @option 左
 * @value left
 * @option 右
 * @value right
 *
 * @help BattleActorFaceVisibility.js
 *
 * 戦闘中、コマンド入力中のアクターの顔グラフィックを表示する
 * ウィンドウを追加表示します。
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

    const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.apply(this, arguments);
        this.createActorFaceWindow();
    };

    Scene_Battle.prototype.createActorFaceWindow = function() {
        const rect = this.actorFaceWindowRect();
        this._actorFaceWindow = new Window_BattleActorFace(rect);
        this.addWindow(this._actorFaceWindow);
    };

    Scene_Battle.prototype.actorFaceWindowRect = function() {
        const p = $gameSystem.windowPadding();
        const ww = ImageManager.faceWidth + p * 2
        const wh = ImageManager.faceHeight + p * 2 + (param.nameVisible ? this._actorWindow.lineHeight() : 0);
        const wx = param.position === 'left' ? 0 : Graphics.boxWidth - ww;
        const wy = this._actorWindow.y - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    class Window_BattleActorFace extends Window_StatusBase {
        constructor(rect) {
            super(rect);
            this._actor = null;
            this.openness = 0;
        }

        setActor(actor) {
            this._actor = actor;
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            if (this._actor) {
                this.drawActorFace(this._actor, 0, 0, ImageManager.faceWidth, ImageManager.faceHeight);
                if (param.nameVisible) {
                    this.drawText(this._actor.name(), 0, ImageManager.faceHeight, this.innerWidth, 'center');
                }
                this.open();
            } else {
                this.close();
            }
        }

        update() {
            super.update();
            const actor = BattleManager.actor();
            if (actor !== this._actor) {
                this.setActor(actor);
            }
        }
    }
    window.Window_BattleActorFace = Window_BattleActorFace;
})();
