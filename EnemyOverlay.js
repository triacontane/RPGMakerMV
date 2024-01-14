/*=============================================================================
 EnemyOverlay.js
----------------------------------------------------------------------------
 (C)2023 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/01/14 ダメージを受けたときを条件に重ね合わせや画像差し替えできる機能を追加
 1.0.0 2023/09/02 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc 敵キャラの画像重ね合わせプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EnemyOverlay.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param overlayList
 * @text 重ね合わせリスト
 * @desc 重ね合わせる敵キャラのリストです。複数指定可能です。
 * @default []
 * @type struct<Overlay>[]
 *
 * @help EnemyOverlay.js
 *
 * 敵キャラの画像に、別の画像を重ね合わせて表示できます。
 * ステートやスイッチ、HP割合などを条件に指定できます。
 * 別途公開しているAPNGピクチャプラグインと併用することで、
 * APNG形式の画像を重ね合わせることもできます。
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

/*~struct~Overlay:
 *
 * @param enemyId
 * @text 敵キャラID
 * @desc 重ね合わせる敵キャラのIDです。
 * @default 1
 * @type enemy
 *
 * @param image
 * @text 画像ファイル
 * @desc 重ね合わせる敵キャラの画像ファイルです。ピクチャフォルダから選択します。
 * @default　
 * @dir img/pictures/
 * @type file
 *
 * @param offsetX
 * @text X座標オフセット
 * @desc 重ね合わせる敵キャラのX座標オフセットです。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param offsetY
 * @text Y座標オフセット
 * @desc 重ね合わせる敵キャラのY座標オフセットです。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param opacity
 * @text 不透明度
 * @desc 重ね合わせる敵キャラの不透明度です。
 * @default 255
 * @type number
 * @min 0
 * @max 255
 *
 * @param priority
 * @text 優先度
 * @desc 重ね合わせる敵キャラの優先度です。数値が大きいほど手前に表示されます。
 * @default 0
 * @type select
 * @option 敵キャラ画像の下
 * @value 0
 * @option 敵キャラ画像の上
 * @value 1
 *
 * @param blendMode
 * @text 合成方法
 * @desc 重ね合わせる敵キャラの合成方法です。
 * @default 0
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 乗算
 * @value 2
 * @option スクリーン
 * @value 3
 * @option 減算
 * @value 28
 *
 * @param scale
 * @text 拡大率
 * @desc 重ね合わせる敵キャラの拡大率です。
 * @default 100
 * @type number
 * @min 1
 * @max 9999
 *
 * @param mainHidden
 * @text メイン画像非表示
 * @desc 元々の敵キャラ画像を非表示にします。
 * @default false
 * @type boolean
 *
 * @param fadeFrame
 * @text フェードフレーム
 * @desc 重ね合わせ画像のフェードイン、アウトのフレーム数です。0の場合はフェードしません。
 * @default 0
 * @type number
 *
 * @param condition
 * @text 表示条件
 * @desc 重ね合わせる敵キャラの表示条件です。
 * @default
 * @type struct<Condition>
 *
 */

/*~struct~Condition:
 *
 * @param switchId
 * @text スイッチID
 * @desc 重ね合わせる敵キャラの表示条件となるスイッチIDです。0を指定した場合、無条件で表示されます。
 * @default 0
 * @type switch
 *
 * @param hpRate
 * @text HP割合
 * @desc 重ね合わせる敵キャラの表示条件となるHP割合です。指定値以下のときに表示されます。
 * @default 100
 * @type number
 * @min 0
 * @max 100
 *
 * @param mpRate
 * @text MP割合
 * @desc 重ね合わせる敵キャラの表示条件となるMP割合です。指定値以下のときに表示されます。
 * @default 100
 * @type number
 * @min 0
 * @max 100
 *
 * @param tpRate
 * @text TP割合
 * @desc 重ね合わせる敵キャラの表示条件となるTP割合です。指定値以下のときに表示されます。
 * @default 100
 * @type number
 * @min 0
 * @max 100
 *
 * @param stateId
 * @text ステートID
 * @desc 重ね合わせる敵キャラの表示条件となるステートIDです。指定ステートが有効なときに表示されます。
 * @default 0
 * @type state
 *
 * @param damage
 * @text ダメージ中
 * @desc ダメージを受けたときに重ね合わせが表示されます。
 * @default false
 * @type boolean
 *
 * @param script
 * @text スクリプト
 * @desc 重ね合わせる敵キャラの表示条件となるスクリプトです。指定スクリプトがtrueを返したときに表示されます。
 * @default
 * @type string
 *
 * @param reverse
 * @text 逆転
 * @desc 重ね合わせる敵キャラの表示条件を逆転させます。指定条件を満たさないときに表示されます。
 * @default false
 * @type boolean
 *
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.overlayList) {
        param.overlayList = [];
    }

    const _Spriteset_Battle_createEnemies = Spriteset_Battle.prototype.createEnemies;
    Spriteset_Battle.prototype.createEnemies = function() {
        _Spriteset_Battle_createEnemies.apply(this, arguments);
        this._enemySprites.forEach(sprite => sprite.createOverlaySprites());
    };

    Game_Enemy.prototype.findOverlayList = function() {
        return param.overlayList.filter(overlay => this.enemyId() === overlay.enemyId);
    };

    Game_Enemy.prototype.isValidOverlay = function(overlay) {
        const data = overlay.condition;
        if (!data) {
            return true;
        }
        const conditions = [];
        conditions.push(data.switchId === 0 || $gameSwitches.value(data.switchId));
        conditions.push(data.hpRate === 0 || this.hpRate() <= data.hpRate / 100);
        conditions.push(data.mpRate === 0 || this.mpRate() <= data.mpRate / 100);
        conditions.push(data.tpRate === 0 || this.tpRate() <= data.tpRate / 100);
        conditions.push(data.stateId === 0 || this.isStateAffected(data.stateId));
        conditions.push(data.damage === false || this._performDamage);
        conditions.push(!data.script || eval(data.script));
        const result = conditions.every(condition => condition);
        return data.reverse ? !result : result;
    };

    const _Game_Enemy_performDamage = Game_Enemy.prototype.performDamage;
    Game_Enemy.prototype.performDamage = function() {
        _Game_Enemy_performDamage.apply(this, arguments);
        this._performDamage = true;
        setTimeout(() => this._performDamage = false, 500);
    };

    const _Sprite_Enemy_initialize = Sprite_Enemy.prototype.initialize;
    Sprite_Enemy.prototype.initialize = function(battler) {
        this._overlaySprites = [];
        _Sprite_Enemy_initialize.apply(this, arguments);
    };

    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.apply(this, arguments);
        if (this.parent) {
            this.createOverlaySprites();
        }
    };

    Sprite_Enemy.prototype.createOverlaySprites = function() {
        const parent = this.parent;
        this._overlaySprites.forEach(sprite => parent.removeChild(sprite));
        this._overlaySprites = [];
        this._enemy.findOverlayList().forEach(overlay => {
            const sprite = new Sprite_EnemyOverlay(overlay, this._enemy, this);
            this._overlaySprites.push(sprite);
            const index = parent.getChildIndex(this);
            if (overlay.priority === 0) {
                parent.addChildAt(sprite, index);
            } else {
                parent.addChild(sprite);
            }
        });
    };

    const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function() {
        _Sprite_Enemy_update.apply(this, arguments);
        if (this._enemy && this.isMainHidden()) {
            this.visible = false;
        }
    };

    Sprite_Enemy.prototype.isMainHidden = function() {
        return this._overlaySprites.some(sprite => sprite.isMainHidden());
    };

    class Sprite_EnemyOverlay extends Sprite {
        constructor(overlay, enemy, enemySprite) {
            super();
            this._overlay = overlay;
            this._enemy = enemy;
            this._enemySprite = enemySprite;
            this._openness = 0;
            this.setupBitmap();
        }

        setupBitmap() {
            if (SceneManager.tryLoadApngPicture) {
                const sprite = SceneManager.tryLoadApngPicture(this._overlay.image);
                if (sprite) {
                    this.addChild(sprite);
                    this._sprite = sprite;
                    return;
                }
            }
            this.bitmap = ImageManager.loadPicture(this._overlay.image);
        }

        update() {
            super.update();
            this.updatePosition();
            this.updateVisibility();
            this.updateOther();
        }

        getSprite() {
            return this._sprite || this;
        }

        updatePosition() {
            const main = this._enemySprite;
            this.x = main.x + this._overlay.offsetX;
            this.y = main.y + this._overlay.offsetY;
            this.scale.x = main.scale.x * this._overlay.scale / 100;
            this.scale.y = main.scale.y * this._overlay.scale / 100;
            const sprite = this.getSprite();
            sprite.anchor.x = main.anchor.x;
            sprite.anchor.y = main.anchor.y;
        }

        updateOther() {
            const main = this._enemySprite;
            this.opacity = (main.opacity / 255) * this._overlay.opacity * this._openness;
            const sprite = this.getSprite();
            sprite.blendMode = this._overlay.blendMode;
        }

        updateVisibility() {
            const showing = this._enemy.isValidOverlay(this._overlay);
            const fadeDelta = 1 / (this._overlay.fadeFrame || 1);
            const openness = this._openness + (showing ? fadeDelta : -fadeDelta);
            this._openness = openness.clamp(0, 1);
        }

        isMainHidden() {
            return this._openness === 1 && this._overlay.mainHidden;
        }
    }
})();
