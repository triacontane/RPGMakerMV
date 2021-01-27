/*=============================================================================
 BalloonPosition.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.2 2021/01/28 MZで動作するよう修正
 1.0.1 2021/01/28 英語ヘルプを記述
 1.0.0 2021/01/27 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc BalloonPositionPlugin
 * @author triacontane
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BalloonPosition.js
 * @target MZ
 * @base PluginCommonBase
 *
 * @param BalloonXNoImage
 * @desc Uniformly adjusts the x of balloon for events where no image is specified.
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param BalloonYNoImage
 * @desc Uniformly adjusts the y of balloon for events where no image is specified.
 * @default 0
 * @min -2000
 * @max 2000
 *
 * @help BalloonPosition.js
 *
 * Adjusts the display coordinates of balloon
 * <BalloonX:5>
 * <BalloonY:-5>
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc フキダシ位置調整プラグイン
 * @author トリアコンタン
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BalloonPosition.js
 * @target MZ
 * @base PluginCommonBase
 *
 * @param BalloonXNoImage
 * @text 画像なしX座標
 * @desc 画像が指定されていないイベントのフキダシX座標を一律で調整します。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param BalloonYNoImage
 * @text 画像なしY座標
 * @desc 画像が指定されていないイベントのフキダシY座標を一律で調整します。
 * @default 0
 * @min -2000
 * @max 2000
 *
 * @help BalloonPosition.js
 *
 * フキダシの表示座標を調整します。
 * イベントのメモ欄に以下の通り入力してください。
 * <BalloonX:5>  # フキダシのX座標を右に[5]ずらします。
 * <BalloonY:-5> # フキダシのY座標を上に[5]ずらします。
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
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    /**
     * Game_CharacterBase
     * フキダシの座標を取得可能にします。
     */
    Game_CharacterBase.prototype.isNoImage = function() {
        return !this._tileId && !this._characterName;
    };

    Game_CharacterBase.prototype.findBalloonX = function() {
        return 0;
    };

    Game_CharacterBase.prototype.findBalloonY = function() {
        return 0;
    };

    /**
     * Game_Event
     * フキダシの座標をメモ欄から取得します。
     */
    Game_Event.prototype.findBalloonX = function() {
        const x = PluginManagerEx.findMetaValue(this.event(),'BalloonX');
        if (x) {
            return x;
        } else if (this.isNoImage()) {
            return param.BalloonXNoImage;
        } else {
            return 0;
        }
    };

    Game_Event.prototype.findBalloonY = function() {
        const y = PluginManagerEx.findMetaValue(this.event(),'BalloonY');
        if (y) {
            return y;
        } else if (this.isNoImage()) {
            return param.BalloonYNoImage;
        } else {
            return 0;
        }
    };

    /**
     * Sprite_Balloon
     * フキダシの表示位置を調整します。
     */
    const _Sprite_Balloon_updatePosition = Sprite_Balloon.prototype.updatePosition;
    Sprite_Balloon.prototype.updatePosition = function() {
        _Sprite_Balloon_updatePosition.apply(this, arguments);
        if (this.targetObject && this.targetObject instanceof Game_CharacterBase) {
            this.x += this.targetObject.findBalloonX();
            this.y += this.targetObject.findBalloonY();
        }
    };
})();
