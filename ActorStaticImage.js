/*=============================================================================
 ActorStaticImage.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/08/01 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc アクター画像の一枚絵プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ActorStaticImage.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param invalidSwitch
 * @text 無効スイッチ
 * @desc 指定したスイッチがONのときプラグインの機能が無効になります。0を指定した場合、常に有効です。
 * @default 0
 * @type switch
 *
 * @param disableMove
 * @text 移動禁止
 * @desc アクター画像の移動モーションをすべて無効化します。
 * @default true
 * @type boolean
 *
 * @help ActorStaticImage.js
 *
 * アクター画像を静止画の一枚絵に変更します。
 * img\sv_actors に一枚絵の画像を配置したら通常通りエディタから
 * 選択してください。
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

    function isInvalid() {
        return $gameSwitches.value(param.invalidSwitch);
    }

    const _Sprite_Battler_startMove = Sprite_Battler.prototype.startMove;
    Sprite_Battler.prototype.startMove = function(x, y, duration) {
        if (!param.disableMove || isInvalid()) {
            _Sprite_Battler_startMove.apply(this, arguments);
        }
    };

    const _Sprite_Actor_updateFrame = Sprite_Actor.prototype.updateFrame;
    Sprite_Actor.prototype.updateFrame = function() {
        _Sprite_Actor_updateFrame.apply(this, arguments);
        if (isInvalid()) {
            return;
        }
        const bitmap = this._mainSprite.bitmap;
        if (bitmap) {
            this._mainSprite.setFrame(0, 0, bitmap.width, bitmap.height);
            this.setFrame(0, 0, bitmap.width, bitmap.height);
        }
    };

    const _Sprite_Weapon_update = Sprite_Weapon.prototype.update;
    Sprite_Weapon.prototype.update = function() {
        _Sprite_Weapon_update.apply(this, arguments);
        this.visible = isInvalid();
    };
})();
