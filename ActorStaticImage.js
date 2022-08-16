/*=============================================================================
 ActorStaticImage.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2022/08/06 パーティごとの表示座標を設定できる機能を追加
                  戦闘不能および復帰時のエフェクトを追加
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
 * @desc アクター画像の移動モーションもすべて無効化します。
 * @default true
 * @type boolean
 *
 * @param positionList
 * @text 表示座標リスト
 * @desc パーティごとの表示座標リストです。指定がない場合はデフォルト位置になります。
 * @default []
 * @type struct<POS>[]
 *
 * @help ActorStaticImage.js
 *
 * アクター画像を静止画の一枚絵に変更します。
 * img\sv_actors に一枚絵の画像を配置したら通常通りエディタから
 * 選択してください。
 *
 * スイッチによって本プラグインの機能を一時的に無効化できます。
 * また、パーティの並び順によって表示座標を自由に設定したい場合は
 * プラグインパラメータから設定してください。
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

/*~struct~POS:
 *
 * @param x
 * @text X座標
 * @desc バトラーの表示X座標です。
 * @default 0
 * @type number
 *
 * @param y
 * @text Y座標
 * @desc バトラーの表示Y座標です。
 * @default 0
 * @type number
 *
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

    const _Sprite_Actor_update = Sprite_Actor.prototype.update;
    Sprite_Actor.prototype.update = function() {
        _Sprite_Actor_update.apply(this, arguments);
        if (this._actor) {
            this.updateEffect();
        }
    };

    const _Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function(index) {
        _Sprite_Actor_setActorHome.apply(this, arguments);
        const pos = param.positionList[index];
        if (!isInvalid() && pos) {
            this.setHome(pos.x, pos.y);
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

    Sprite_Actor.prototype.updateEffect = function() {
        this.setupEffect();
        if (this._effectDuration > 0) {
            this._effectDuration--;
            switch (this._effectType) {
                case "appear":
                    this.updateAppear();
                    break;
                case "disappear":
                    this.updateDisappear();
                    break;
                case "collapse":
                    this.updateCollapse();
                    break;
            }
            if (this._effectDuration === 0) {
                this._effectType = null;
            }
        }
    };

    Sprite_Actor.prototype.updateAppear = function() {
        this.opacity = (16 - this._effectDuration) * 16;
    };

    Sprite_Actor.prototype.updateDisappear = function() {
        this.opacity = 256 - (32 - this._effectDuration) * 10;
    };

    Sprite_Actor.prototype.updateCollapse = function() {
        this.blendMode = 1;
        this.setBlendColor([255, 128, 128, 128]);
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
    };

    Sprite_Actor.prototype.setupEffect = function() {
        if (this._appeared && this._actor.isEffectRequested()) {
            this.startEffect(this._actor.effectType());
            this._actor.clearEffect();
        }
        if (!this._appeared && this._actor.isAlive()) {
            this.startEffect("appear");
        } else if (this._appeared && this._actor.isHidden()) {
            this.startEffect("disappear");
        }
    };

    Sprite_Actor.prototype.startEffect = function(effectType) {
        this._effectType = effectType;
        switch (this._effectType) {
            case "appear":
                this.startAppear();
                break;
            case "disappear":
                this.startDisappear();
                break;
            case "collapse":
                this.startCollapse();
                break;
        }
        this.revertToNormal();
    };

    Sprite_Actor.prototype.startAppear = function() {
        this._effectDuration = 16;
        this._appeared = true;
    };

    Sprite_Actor.prototype.startDisappear = function() {
        this._effectDuration = 32;
        this._appeared = false;
    };

    Sprite_Actor.prototype.startCollapse = function() {
        this._effectDuration = 32;
        this._appeared = false;
    };

    Sprite_Actor.prototype.revertToNormal = function() {
        this.blendMode = 0;
        this.opacity = 255;
        this.setBlendColor([0, 0, 0, 0]);
    };

    const _Game_Actor_performCollapse = Game_Actor.prototype.performCollapse;
    Game_Actor.prototype.performCollapse = function() {
        _Game_Actor_performCollapse.apply(this, arguments);
        if (!isInvalid() && $gameParty.inBattle()) {
            this.requestEffect("collapse");
        }
    };
})();
