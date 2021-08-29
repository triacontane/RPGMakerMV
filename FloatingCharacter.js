//=============================================================================
// FloatingCharacter.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.6.0 2021/08/29 ツクールMZで動作するよう全面的に修正
// 1.5.1 2020/03/24 競合等の理由でメモ欄が取得できない場合に発生するエラーを回避
// 1.5.0 2020/03/13 浮遊速度を変更できる機能を追加
// 1.4.1 2019/06/18 メモ欄の設定を適切に読み込めるように修正(ツミオ）
// 1.4.0 2018/10/08 浮遊イベントの影を非表示にできる機能を追加
// 1.3.0 2018/01/24 イベントを初期状態で浮遊させる機能を追加
// 1.2.0 2018/01/07 プレイヤーの浮遊とフォロワーと連動させるかどうかを選択できる機能を追加
// 1.1.2 2016/07/31 パラメータ名の変換ミス修正(敷居値→閾値)
//                  隊列歩行時のフォロワーの高度がデフォルト値で固定になっていた問題の修正
// 1.1.1 2016/04/06 本プラグインを適用していないセーブデータをロードしたときも、正しく動作するよう修正
// 1.1.0 2016/04/03 一定以上の高度の場合のみ通行可能になる地形タグとリージョンを指定できる機能を追加
//                  着地可能な場合のみ着地する機能を追加、指定されたキャラクターが浮遊中かどうかの判定を追加
// 1.0.2 2016/03/31 隊列歩行でない場合のフォロワーや画像が指定されていないイベントでも影が表示される不具合を修正
// 1.0.1 2016/03/31 浮遊中に強制的に待機アニメが設定される仕様を撤廃
// 1.0.0 2016/03/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc キャラクターの浮遊プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/FloatingCharacter.js
 * @author トリアコンタン
 *
 * @param TerrainTags
 * @text 通行可能地形タグ
 * @desc 浮遊時に通行可能になる地形タグです。
 * @default []
 * @type number[]
 *
 * @param RegionId
 * @text 通行可能リージョン
 * @desc 浮遊時に通行可能になるリージョンです。
 * @default []
 * @type number[]
 *
 * @param HighestTerrainTags
 * @text 高度通行地形タグ
 * @desc 一定高度以上を浮遊時に通行可能になる地形タグです。
 * @default []
 * @type number[]
 *
 * @param HighestRegionId
 * @text 高度通行リージョン
 * @desc 一定高度以上を浮遊時に通行可能になるリージョンです。
 * @default []
 * @type number[]
 *
 * @param HighestThreshold
 * @text 高度閾値
 * @desc 一定高度以上の条件となる閾値です。
 * @default 48
 * @type number
 *
 * @param FloatFollower
 * @text フォロワー連動
 * @desc 浮遊時に自動的にフォロワーも浮遊します。
 * @default true
 * @type boolean
 *
 * @command FLOAT
 * @text 浮遊/着地
 * @desc 指定したキャラクターを浮遊あるいは着地させます。
 *
 * @arg id
 * @text キャラクターID
 * @desc 対象のキャラクターIDです。-1を指定するとプレイヤー、0を指定すると実行中のイベントが対象になります。
 * @default -1
 * @type number
 * @min -1
 *
 * @arg type
 * @text 処理種別
 * @desc 浮遊、着地もしくは浮遊と着地の切り替えの中から種別を選択します。
 * @default float
 * @type select
 * @option 浮遊
 * @value float
 * @option 着地
 * @value landing
 * @option 着地(着地可能な場合のみ)
 * @value landingIfOk
 * @option 切替
 * @value changeFloat
 *
 * @arg wait
 * @text ウェイトフラグ
 * @desc 浮遊、着地完了までイベントの進行を待機します。
 * @default false
 * @type boolean
 *
 * @command SETTING
 * @text 設定
 * @desc 指定したキャラクターの浮遊高度、速度を設定します。
 *
 * @arg id
 * @text キャラクターID
 * @desc 対象のキャラクターIDです。-1を指定するとプレイヤー、0を指定すると実行中のイベントが対象になります。
 * @default -1
 * @type number
 * @min -1
 *
 * @arg speed
 * @text 速度
 * @desc 浮遊するときの速度です。通常は[1]で大きな数字を指定すると速くなります。
 * @default 1
 * @type number
 *
 * @arg height
 * @text 高度
 * @desc 浮遊するときの高度です。
 * @default 24
 * @type number
 *
 * @help キャラクターを浮遊させます。
 * 浮遊中は以下の効果があります。
 *
 * 指定した地形タグ(複数)を通行可能にします。
 * 指定したリージョン(複数)を通行可能にします。
 * タイルの梯子属性、茂み属性、ダメージ床属性を無効にします。
 *
 * スクリプト
 * 「移動ルートの指定」の「スクリプト」から以下を実行します。
 *
 * this.float([ウェイトフラグ], [高度(省略時はタイルサイズの半分)]);
 *  キャラクターを[高度]のピクセル分、浮遊させます。
 *  [ウェイトフラグ]に[true]を設定すると、浮遊完了まで次の命令に移行しません。
 *  例：this.float(true, 48);
 *
 * this.landing([ウェイトフラグ]);
 *  キャラクターを着地させます。
 *  [ウェイトフラグ]に[true]を設定すると、着地完了まで次の命令に移行しません。
 *  例：this.landing(true);
 *
 * this.landingIfOk([ウェイトフラグ]);
 *  着地可能な地形の場合、キャラクターを着地させます。
 *  着地可能かどうかは、飛行船が着地可能かどうかの条件と同一です。
 *  [ウェイトフラグ]に[true]を設定すると、着地完了まで次の命令に移行しません。
 *  例：this.landingIfOk(true);
 *
 * this.setFloatSpeed([スピード]);
 *  浮遊する速度を設定します。通常は[1]で大きな数字を指定すると速くなります。
 *
 * スクリプト
 * 「条件分岐」の「スクリプト」から以下を実行します。
 *
 * this.isFloating([キャラクターID]);
 *  指定したキャラクターが浮遊中の場合に、分岐を実行します。
 *  キャラクターIDは以下の通り指定してください。
 *
 *  -1   : プレイヤー
 *  0    : 実行中のイベント
 *  1... : 指定したIDのイベント
 *
 * イベントのメモ欄に以下の通り記述すると、イベントが初期状態で浮遊します。
 * <Altitude:24> # 高さ[24]で浮遊します。
 * <高度:24>     # 同上
 *
 * イベントのメモ欄に以下の通り記述すると、浮遊時に影が表示されなくなります。
 * <影なし>
 * <NoShadow>
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

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'FLOAT', function (args) {
        const character = this.character(args.id);
        if (!character) {
            return;
        }
        character[args.type](args.wait);
        if (args.wait) {
            this.wait(character._waitCount);
        }
    });

    PluginManagerEx.registerCommand(script, 'SETTING', function (args) {
        const character = this.character(args.id);
        if (!character) {
            return;
        }
        if (args.speed) {
            character.setFloatSpeed(args.speed);
        }
        if (args.height) {
            character.setFloatHeight(args.height);
        }
    });

    //=============================================================================
    // Game_Interpreter
    //  キャラクターの浮遊判定を追加定義します。
    //=============================================================================
    Game_Interpreter.prototype.isFloating = function(characterId) {
        const character = this.character(characterId);
        if (character !== null) {
            return character.isFloating();
        } else {
            return false;
        }
    };

    /**
     * Game_Map
     */
    Game_Map.prototype.isFloatPassable = function(x, y) {
        if (param.RegionId.some(id => id === $gameMap.regionId(x, y))) {
            return true;
        } else if (param.TerrainTags.some(id => id === $gameMap.terrainTag(x, y))) {
            return true;
        }
        return false;
    };

    Game_Map.prototype.isHighestFloatPassable = function(x, y) {
        if (param.HighestRegionId.some(id => id === $gameMap.regionId(x, y))) {
            return true;
        } else if (param.HighestTerrainTags.some(id => id === $gameMap.terrainTag(x, y))) {
            return true;
        }
        return false;
    };

    const _Game_Map_isPassable = Game_Map.prototype.isPassable;
    Game_Map.prototype.isPassable = function(x, y, d) {
        const result = _Game_Map_isPassable.apply(this, arguments);
        if (this._altitudeLevel >= 1 && this.isFloatPassable(x, y)) {
            return true;
        } else if (this._altitudeLevel >= 2 && this.isHighestFloatPassable(x, y)) {
            return true;
        } else {
            return result;
        }
    };

    Game_Map.prototype.setAltitudeLevel = function(level) {
        this._altitudeLevel = level;
    };

    //=============================================================================
    // Game_CharacterBase
    //  キャラクターの浮遊関連情報を追加定義します。
    //=============================================================================
    const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.apply(this, arguments);
        this.initFloatingInfo();
    };
    Game_CharacterBase.prototype.isLowest      = Game_Vehicle.prototype.isLowest;
    Game_CharacterBase.prototype.isHighest     = Game_Vehicle.prototype.isHighest;
    Game_CharacterBase.prototype.shadowOpacity = Game_Vehicle.prototype.shadowOpacity;

    Game_CharacterBase.prototype.initFloatingInfo = function() {
        this._altitude           = 0;
        this._altitudeAnimeCount = 0;
        this._maxAltitude        = 0;
        this._needFloat          = false;
        this._floatSpped         = 1;
        this._floatHeight        = 24;
    };

    const _Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable;
    Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
        if (this.isNeedFloat()) {
            if (this._altitude >= param.HighestThreshold) {
                $gameMap.setAltitudeLevel(2);
            } else {
                $gameMap.setAltitudeLevel(1);
            }
        }
        const result = _Game_CharacterBase_isMapPassable.apply(this, arguments);
        $gameMap.setAltitudeLevel(0);
        return result;
    };

    const _Game_CharacterBase_screenY = Game_CharacterBase.prototype.screenY;
    Game_CharacterBase.prototype.screenY = function() {
        return _Game_CharacterBase_screenY.apply(this, arguments) +
            (this.isFloating() ? Math.floor(Math.sin(this._altitudeAnimeCount / 16) * 3) - this._altitude : 0);
    };

    const _Game_CharacterBase_screenZ = Game_CharacterBase.prototype.screenZ;
    Game_CharacterBase.prototype.screenZ = function() {
        return _Game_CharacterBase_screenZ.apply(this, arguments) +
            (this._altitude >= $gameMap.tileHeight() ? 1 : 0);
    };

    Game_CharacterBase.prototype.screenShadowY = function() {
        return _Game_CharacterBase_screenY.apply(this, arguments) - this.screenY();
    };

    const _Game_CharacterBase_isOnLadder = Game_CharacterBase.prototype.isOnLadder;
    Game_CharacterBase.prototype.isOnLadder = function() {
        return this.isFloating() ? false : _Game_CharacterBase_isOnLadder.apply(this, arguments);
    };

    const _Game_CharacterBase_isOnBush = Game_CharacterBase.prototype.isOnBush;
    Game_CharacterBase.prototype.isOnBush = function() {
        return this.isFloating() ? false : _Game_CharacterBase_isOnBush.apply(this, arguments);
    };

    Game_CharacterBase.prototype.maxAltitude = function() {
        return this._maxAltitude;
    };

    Game_CharacterBase.prototype.isFloating = function() {
        return this._altitude > 0;
    };

    Game_CharacterBase.prototype.isShadowVisible = function() {
        return this.isFloating() && (this._characterName || this._tileId) && this.isNeedShadow();
    };

    Game_CharacterBase.prototype.isNeedFloat = function() {
        return this._needFloat;
    };

    Game_CharacterBase.prototype.changeFloat = function(waitFlg, max = this._floatHeight) {
        if (this.isFloating()) {
            this.landing(waitFlg);
        } else {
            this.float(waitFlg, max);
        }
    };

    Game_CharacterBase.prototype.float = function(waitFlg, max = this._floatHeight) {
        if (!this.hasOwnProperty('_altitude') || isNaN(this._altitude)) {
            this.initFloatingInfo();
        }
        this._needFloat   = true;
        this._maxAltitude = max;
        if (waitFlg) {
            this._waitCount = this.getFloatingWaitCount(this.maxAltitude() - this._altitude);
        }
    };

    Game_CharacterBase.prototype.landing = function(waitFlg) {
        this._needFloat = false;
        if (waitFlg) {
            this._waitCount = this.getFloatingWaitCount(this.maxAltitude());
        }
    };

    Game_CharacterBase.prototype.getFloatingWaitCount = function(altitudeDiff) {
        return Math.floor(Math.max(altitudeDiff, 0) / this.getFloatSpeed());
    };

    Game_CharacterBase.prototype.landingIfOk = function(waitFlg) {
        if ($gameMap.isAirshipLandOk(this.x, this.y)) this.landing(waitFlg);
    };

    const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        _Game_CharacterBase_update.apply(this, arguments);
        this.updateFloating();
    };

    Game_CharacterBase.prototype.isNeedShadow = function() {
        return true;
    };

    Game_CharacterBase.prototype.getFloatSpeed = function() {
        return this._floatSpped || 1;
    };

    Game_CharacterBase.prototype.setFloatSpeed = function(value) {
        this._floatSpped = value;
    };

    Game_CharacterBase.prototype.setFloatHeight = function(value) {
        this._floatHeight = value;
    };

    Game_CharacterBase.prototype.updateFloating = function() {
        this._floatingPrev = this.isFloating();
        if (this.isNeedFloat()) {
            if (this.isHighest()) {
                this._altitudeAnimeCount++;
            }
            this._altitude = Math.min(this._altitude + this.getFloatSpeed(), this.maxAltitude());
        } else {
            if (this.isHighest()) {
                this._altitudeAnimeCount = 0;
            }
            this._altitude = Math.max(this._altitude - this.getFloatSpeed(), 0);
        }
        if (this._floatingPrev !== this.isFloating()) {
            this.refreshBushDepth();
        }
    };

    Game_Player.prototype.float = function(waitFlg, max) {
        Game_CharacterBase.prototype.float.apply(this, arguments);
        if (!param.FloatFollower) {
            return;
        }
        this.followers().data().forEach(follower => {
            follower.float(waitFlg, max);
            follower._altitude = -follower._memberIndex * 4;
        });
    };

    const _Game_Player_isOnDamageFloor = Game_Player.prototype.isOnDamageFloor;
    Game_Player.prototype.isOnDamageFloor = function() {
        return this.isFloating() ? false : _Game_Player_isOnDamageFloor.apply(this, arguments);
    };

    Game_Player.prototype.landing = function() {
        Game_CharacterBase.prototype.landing.apply(this, arguments);
        if (!param.FloatFollower) {
            return;
        }
        this.followers().data().forEach(follower => follower.landing());
    };

    Game_Player.prototype.setFloatSpeed = function(value) {
        Game_CharacterBase.prototype.setFloatSpeed.apply(this, arguments);
        if (!param.FloatFollower) {
            return;
        }
        this.followers().data().forEach(follower => follower.setFloatSpeed(value));
    };

    Game_Player.prototype.setFloatHeight = function(value) {
        Game_CharacterBase.prototype.setFloatHeight.apply(this, arguments);
        if (!param.FloatFollower) {
            return;
        }
        this.followers().data().forEach(follower => follower.setFloatHeight(value));
    };

    Game_Vehicle.prototype.updateFloating = function() {};
    Game_Vehicle.prototype.isFloating = function() {
        return false;
    };

    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.apply(this, arguments);
        const altitude = PluginManagerEx.findMetaValue(this.event(), ['高度', 'Altitude']);
        this._noShadow = !!PluginManagerEx.findMetaValue(this.event(), ['影なし', 'NoShadow']);
        if (altitude !== undefined) {
            this.setInitAltitude(parseInt(altitude) || 24);
        }
    };

    Game_Event.prototype.setInitAltitude = function(altitude) {
        this.float(false, altitude);
        this._altitude = this._maxAltitude;
        this.refreshBushDepth();
    };

    Game_Event.prototype.isNeedShadow = function() {
        return !this._noShadow;
    };

    //=============================================================================
    // Sprite_Character
    //  キャラクターの浮遊関連情報を追加定義します。
    //=============================================================================
    const _Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
    Sprite_Character.prototype.initMembers = function() {
        _Sprite_Character_initMembers.apply(this, arguments);
        this._shadowSprite = null;
    };

    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.apply(this, arguments);
        this.updateFloating();
    };

    Sprite_Character.prototype.updateFloating = function() {
        if (this._character.isShadowVisible()) {
            if (!this._shadowSprite) this.createShadow();
            this._shadowSprite.y = this._character.screenShadowY();
            this._shadowSprite.opacity = this._character.shadowOpacity();
        } else if (this._shadowSprite) {
            this.disposeShadow();
        }
    };

    Sprite_Character.prototype.createShadow = function() {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow1');
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 1;
        this.addChild(this._shadowSprite);
    };

    Sprite_Character.prototype.disposeShadow = function() {
        this.removeChild(this._shadowSprite);
        this._shadowSprite = null;
    };
})();

