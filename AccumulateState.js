//=============================================================================
// AccumulateState.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.4.1 2022/05/25 2.4.0の修正で不要なゲージが表示される場合がある問題を修正
// 2.4.0 2022/03/18 マップ画面とステータス画面に蓄積ゲージを表示できるよう修正
// 2.3.0 2021/07/23 敵キャラに対しても蓄積ゲージを表示できる機能を追加
// 2.2.1 2021/07/16 蓄積型ステートが有効になるごとに耐性が上昇する機能を追加
// 2.2.0 2021/07/15 MZで動作するよう全面的に修正
// 2.1.0 2021/07/15 蓄積ゲージ表示の有無をスイッチで切り替えられる機能を追加
// 2.0.0 2017/05/29 蓄積率計算式を独自に指定できるよう仕様変更。運補正と必中補正の有無を設定できる機能を追加
// 1.1.1 2017/05/28 減算の結果が負の値になったときに蓄積率が減算されていた問題を修正
// 1.1.0 2017/05/28 耐性計算式を除算と減算の二つを用意しました。
// 1.0.1 2016/05/31 戦闘テスト以外で戦闘に入るとエラーになる場合がある問題を修正
// 1.0.0 2016/05/28 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 蓄積型ステートプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AccumulateState.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param GaugeImage
 * @text ゲージ画像ファイル
 * @desc ゲージ表示に使用する画像ファイル(img/pictures)です。空のゲージと満タンのゲージを縦に並べて一つの画像にしてください。
 * @default
 * @dir img/pictures/
 * @type file
 *
 * @param GaugeSwitchId
 * @text ゲージ表示スイッチ
 * @desc 有効にすると指定したスイッチがONのときだけゲージ表示されます。
 * @default 0
 * @type switch
 *
 * @param AccumulateFormula
 * @text 蓄積率計算式
 * @desc 蓄積率を算出する計算式を効果の「ステート付加」および対象の「ステート有効度」から独自作成します。
 * @default
 *
 * @param LuckAdjust
 * @text 運補正
 * @desc ONにすると蓄積率に対して運による補正を掛けます。（デフォルト仕様準拠）
 * @default true
 * @type boolean
 *
 * @param CertainHit
 * @text 必中時有効度無視
 * @desc ONにすると必中スキルに関しては「ステート付加」の値がそのまま蓄積率に反映されます。
 * @default true
 * @type boolean
 *
 * @param ImmunityRate
 * @text 免疫率
 * @desc ステートが有効になるごとに加算される耐性値です。100になると一切、上昇しなくなります。
 * @default 0
 * @type number
 *
 * @command ACCUMULATE
 * @text 蓄積
 * @desc 指定したアクターのステート蓄積量を増減します。
 *
 * @arg actorId
 * @text アクターID
 * @desc 対象のアクターIDです。敵キャラを対象にする場合は0のままでOKです。
 * @default 0
 * @type actor
 *
 * @arg enemyIndex
 * @text 敵キャラインデックス
 * @desc 対象の敵キャラインデックスです。アクターを対象にする場合は-1のままでOKです。
 * @default -1
 * @type number
 * @min -1
 *
 * @arg stateId
 * @text ステートID
 * @desc 対象のステートIDです。蓄積型のステートを指定してください。
 * @default 1
 * @type state
 *
 * @arg rate
 * @text 蓄積率
 * @desc 蓄積率(-100% ～ 100%)です。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @help 特定のステートを蓄積型に変更します。
 * 蓄積型のステートにしたい場合、メモ欄に以下の通り設定してください。
 * <蓄積型>
 * <Accumulate>
 *
 * 蓄積型ステートは使用効果「ステート付加」によって値が蓄積していき、
 * 蓄積率が100%(=1.0)を超えると対象のステートが有効になります。
 * 計算式は以下の通りです。
 *
 * 効果「ステート付加」の設定値 * 対象の「ステートの有効度」 = 蓄積率
 * 例：効果の「ステート付加」が80%(0.8)で、対象のステート有効度が50%(0.5)の場合
 * 0.8 * 0.5 = 0.4         # 蓄積率は40%(0.4)
 *
 * さらに上級者向け機能として蓄積率計算式を別途指定できます。
 * 計算式では以下の変数が使用できます。
 *
 * a : 効果の「ステート付加」の設定値
 * b : 対象の「ステート有効度」の設定値
 *
 * 蓄積率計算式の指定例
 * a - (1.0 - b)
 *
 * 例：効果の「ステート付加」が80%(0.8)で、対象のステート有効度が50%(0.5)の場合
 * 0.8 - (1.0 - 0.5) = 0.3  # 蓄積率は30%(0.3)
 *
 * 蓄積率が負の値になった場合は「0」として計算されます。実行時にブザーが鳴る場合、
 * スクリプトの記述に問題があります。
 * F8を押下してデベロッパツールを開き、内容を確認してください。
 *
 * また、「ステート解除」によって蓄積率がリセットされます。
 *
 * ステートをひとつだけ指定して戦闘画面にゲージとして表示することができます。
 * この機能を使う場合は、アクターのメモ欄に以下の通り設定してください。
 * <蓄積ゲージステート:3> // 蓄積型のステートID「3」をゲージとして表示します。
 * <蓄積ゲージX:600>      // ゲージのX座標です。
 * <蓄積ゲージY:400>      // ゲージのY座標です。
 *
 * マップ画面、ステータス画面にゲージを表示したい場合は座標を指定してください。
 * <蓄積マップゲージX:600> // マップ画面のゲージのX座標です。
 * <蓄積マップゲージY:400> // マップ画面のゲージのY座標です。
 * <蓄積ステータスゲージX:600> // ステータス画面のゲージのX座標です。
 * <蓄積ステータスゲージY:400> // ステータス画面のゲージのY座標です。
 *
 * ゲージ画像はパラメータで指定したものを使用します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=>{
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'ACCUMULATE', args => {
        const actor = $gameActors.actor(args.actorId);
        if (actor) {
            actor.accumulateState(args.stateId, args.rate / 100);
        }
        const enemy = $gameTroop.members()[args.enemyIndex];
        if (enemy) {
            enemy.accumulateState(args.stateId, args.rate / 100);
        }
    });

    //=============================================================================
    // Game_BattlerBase
    //  ステート蓄積量を管理します。
    //=============================================================================
    Game_BattlerBase.prototype.clearStateAccumulationsIfNeed = function () {
        if (!this._stateAccumulations) {
            this._stateAccumulations = {};
        }
        if (!this._stateImmunity) {
            this._stateImmunity = {};
        }
    };

    const _Game_BattlerBase_clearStates = Game_BattlerBase.prototype.clearStates;
    Game_BattlerBase.prototype.clearStates = function () {
        _Game_BattlerBase_clearStates.apply(this, arguments);
        this.clearStateAccumulationsIfNeed();
    };

    const _Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
    Game_BattlerBase.prototype.eraseState = function (stateId) {
        _Game_BattlerBase_eraseState.apply(this, arguments);
        this.clearStateAccumulationsIfNeed();
        delete this._stateAccumulations[stateId];
    };

    const _Game_Battler_removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function (stateId) {
        _Game_Battler_removeState.apply(this, arguments);
        this.clearStateAccumulationsIfNeed();
        delete this._stateAccumulations[stateId];
    };

    const _Game_BattlerBase_attackStates = Game_BattlerBase.prototype.attackStates;
    Game_BattlerBase.prototype.attackStates = function (accumulateFlg) {
        if (arguments.length === 0) accumulateFlg = false;
        const states = _Game_BattlerBase_attackStates.apply(this, arguments);
        return states.filter(function (stateId) {
            return BattleManager.isStateAccumulate(stateId) === accumulateFlg;
        }.bind(this));
    };

    Game_Battler.prototype.accumulateState = function (stateId, value) {
        this.clearStateAccumulationsIfNeed();
        if (BattleManager.isStateAccumulate(stateId)) {
            this._stateAccumulations[stateId] = (this._stateAccumulations[stateId] || 0) + value;
            if (!this.isStateAffected(stateId) && this._stateAccumulations[stateId] >= 1.0) {
                this.addState(stateId);
                this._stateImmunity[stateId] = (this._stateImmunity[stateId] || 0) + 1;
                return true;
            }
        }
        return false;
    };

    Game_BattlerBase.prototype.getStateImmunity = function (stateId) {
        return (this._stateImmunity[stateId] * param.ImmunityRate / 100) || 0;
    };

    Game_BattlerBase.prototype.getStateAccumulation = function (stateId) {
        return this._stateAccumulations[stateId] || 0;
    };

    Game_BattlerBase.prototype.getGaugeStateAccumulation = function () {
        return this.getStateAccumulation(this.getGaugeStateId());
    };

    Game_BattlerBase.prototype.getGaugeX = function () {
        return this.getGaugeInfo(SceneManager.findAccumulateGaugeTagX());
    };

    Game_BattlerBase.prototype.getGaugeY = function () {
        return this.getGaugeInfo(SceneManager.findAccumulateGaugeTagY());
    };

    Game_BattlerBase.prototype.getGaugeStateId = function () {
        return this.getGaugeInfo(['蓄積ゲージステート', 'AccumulateGaugeState']);
    };

    Game_BattlerBase.prototype.getGaugeInfo = function (names) {
        return PluginManagerEx.findMetaValue(this.getData(), names);
    };

    Game_BattlerBase.prototype.getData = function () {
        return null;
    };

    Game_Actor.prototype.getData = function () {
        return this.actor();
    };

    Game_Enemy.prototype.getData = function () {
        return this.enemy();
    };

    SceneManager.findAccumulateGaugeTagX = function() {
        if (this._scene instanceof Scene_Map) {
            return ['蓄積マップゲージX', 'AccumulateMapGaugeX'];
        }
        if (this._scene instanceof Scene_Status) {
            return ['蓄積ステータスゲージX', 'AccumulateStatusGaugeX'];
        }
        return ['蓄積ゲージX', 'AccumulateGaugeX'];
    };

    SceneManager.findAccumulateGaugeTagY = function() {
        if (this._scene instanceof Scene_Map) {
            return ['蓄積マップゲージY', 'AccumulateMapGaugeY'];
        }
        if (this._scene instanceof Scene_Status) {
            return ['蓄積ステータスゲージY', 'AccumulateStatusGaugeY'];
        }
        return ['蓄積ゲージY', 'AccumulateGaugeY'];
    };

    //=============================================================================
    // Game_Action
    //  行動によってステート蓄積量を増やします。
    //=============================================================================
    const _Game_Action_itemEffectAddAttackState = Game_Action.prototype.itemEffectAddAttackState;
    Game_Action.prototype.itemEffectAddAttackState = function (target, effect) {
        _Game_Action_itemEffectAddAttackState.apply(this, arguments);
        this.subject().attackStates(true).forEach(stateId => {
            let accumulation = effect.value1 * this.subject().attackStatesRate(stateId);
            accumulation = this.applyResistanceForAccumulateState(accumulation, target, stateId);
            const result = target.accumulateState(stateId, accumulation);
            if (result) this.makeSuccess(target);
        });
    };

    const _Game_Action_itemEffectAddNormalState = Game_Action.prototype.itemEffectAddNormalState;
    Game_Action.prototype.itemEffectAddNormalState = function (target, effect) {
        if (BattleManager.isStateAccumulate(effect.dataId)) {
            let accumulation = effect.value1;
            if (!this.isCertainHit() || !param.CertainHit) {
                accumulation = this.applyResistanceForAccumulateState(accumulation, target, effect.dataId);
            }
            const result = target.accumulateState(effect.dataId, accumulation);
            if (result) this.makeSuccess(target);
        } else {
            _Game_Action_itemEffectAddNormalState.apply(this, arguments);
        }
    };

    Game_Action.prototype.applyResistanceForAccumulateState = function (effectValue, target, stateId) {
        if (param.AccumulateFormula) {
            const a = effectValue;
            const b = target.stateRate(stateId);
            try {
                effectValue = eval(param.AccumulateFormula);
            } catch (e) {
                SoundManager.playBuzzer();
                console.warn('Script Error : ' + param.AccumulateFormula);
                console.warn(e.stack);
            }
        } else {
            effectValue *= target.stateRate(stateId);
        }
        if (param.LuckAdjust) {
            effectValue *= this.lukEffectRate(target);
        }
        effectValue *= (1.0 - target.getStateImmunity(stateId));
        return effectValue.clamp(0.0, 1.0);
    };

    //=============================================================================
    // BattleManager
    //  蓄積型のステートかどうかを判定します。
    //=============================================================================
    BattleManager.isStateAccumulate = function (stateId) {
        return stateId > 0 && !!PluginManagerEx.findMetaValue($dataStates[stateId], ['蓄積型', 'Accumulate']);
    };

    //=============================================================================
    // Scene_Base
    //  ステートゲージを作成します。
    //=============================================================================
    Scene_Battle.prototype.createAccumulateState = function (detailMenu) {
        Scene_Base.prototype.createAccumulateState.call(this, detailMenu);
        for (let i = 0, n = $gameTroop.members().length; i < n; i++) {
            const sprite = new Sprite_AccumulateState(i, $gameTroop, false);
            this.addChild(sprite);
        }
    };

    Scene_Base.prototype.createAccumulateState = function (detailMenu) {
        for (let i = 0, n = $gameParty.members().length; i < n; i++) {
            const sprite = new Sprite_AccumulateState(i, $gameParty, detailMenu);
            this.addChild(sprite);
        }
    };

    const _Scene_Battle_createSpriteset = Scene_Battle.prototype.createSpriteset;
    Scene_Battle.prototype.createSpriteset = function () {
        _Scene_Battle_createSpriteset.apply(this, arguments);
        this.createAccumulateState(false);
    };

    const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function () {
        _Scene_Map_createSpriteset.apply(this, arguments);
        this.createAccumulateState(false);
    };

    const _Scene_Status_create = Scene_Status.prototype.create;
    Scene_Status.prototype.create = function() {
        _Scene_Status_create.apply(this, arguments);
        this.createAccumulateState(true);
    };

    //=============================================================================
    // Sprite_AccumulateState
    //  ステート蓄積表示用スプライトです。
    //=============================================================================
    function Sprite_AccumulateState() {
        this.initialize.apply(this, arguments);
    }

    Sprite_AccumulateState.prototype = Object.create(Sprite.prototype);
    Sprite_AccumulateState.prototype.constructor = Sprite_AccumulateState;

    Sprite_AccumulateState.prototype.initialize = function (index, unit, detailMenu) {
        this._index = index;
        this._battler = null;
        this._unit = unit;
        this._rate = null;
        this._detailMenu = detailMenu;
        Sprite.prototype.initialize.call(this);
        this.create();
    };

    Sprite_AccumulateState.prototype.getBattler = function () {
        return this._unit.members()[this._index];
    };

    Sprite_AccumulateState.prototype.create = function () {
        this.bitmap = ImageManager.loadPicture(param.GaugeImage);
        this.createGaugeSprite();
        this.bitmap.addLoadListener(this.onLoadBitmap.bind(this));
        this.visible = false;
    };

    Sprite_AccumulateState.prototype.createGaugeSprite = function () {
        this._gaugeSprite = new Sprite();
        this._gaugeSprite.bitmap = this.bitmap;
        this.addChild(this._gaugeSprite);
    };

    Sprite_AccumulateState.prototype.onLoadBitmap = function () {
        const height = this.bitmap.height / 2;
        this.setFrame(0, height, this.bitmap.width, height);
        this._gaugeSprite.setFrame(0, 0, this.bitmap.width, height);
    };

    Sprite_AccumulateState.prototype.update = function () {
        const battler = this.getBattler();
        if (!battler) return;
        if (this._battler !== battler) {
            this._battler = battler;
        }
        this.updateVisibility();
        if (this.visible) {
            this.updatePosition();
            this.updateRate();
        }
    };

    Sprite_AccumulateState.prototype.updateVisibility = function () {
        this.visible = true;
        const stateId = this._battler.getGaugeStateId();
        if (!stateId) {
            this.visible = false;
        }
        if (param.GaugeSwitchId && !$gameSwitches.value(param.GaugeSwitchId)) {
            this.visible = false;
        }
        if (this._detailMenu && $gameParty.menuActor() !== this._battler) {
            this.visible = false;
        }
    };

    Sprite_AccumulateState.prototype.updateRate = function () {
        const rate = Math.min(this._battler.getGaugeStateAccumulation(), 1.0);
        if (rate !== this._rate) {
            this._rate = rate;
            this.bitmap.addLoadListener(function () {
                this._gaugeSprite.setFrame(0, 0, this.bitmap.width * rate, this.bitmap.height / 2);
            }.bind(this));
        }
    };

    Sprite_AccumulateState.prototype.updatePosition = function () {
        this.x = this._battler.getGaugeX();
        this.y = this._battler.getGaugeY();
    };
})();

