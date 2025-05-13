//=============================================================================
// AttackChain.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.0.2 2025/05/13 チェインの対象ユニットが切り替わったとき、表示数値が同値だとスキンが切り替わらない問題を修正
// 3.0.1 2025/02/13 スキルによる追加倍率の計算が間違っていた問題を修正
// 3.0.0 2024/10/12 MZ対応版としてリファクタリングのうえ仕様刷新
// 2.3.0 2020/03/22 対象者が指定したメモ欄を保持している場合のみコンボ継続する設定を追加
// 2.2.0 2020/02/26 戦闘終了時、チェイン表示が残っている場合はフェードアウトするよう仕様変更
// 2.1.0 2019/05/08 ダメージ数値と単位表記の画像指定で敵専用の画像を指定できる機能を追加
// 2.0.0 2019/05/02 ダメージ数値と単位表記に任意の画像を使用できる機能を追加
// 1.5.0 2018/07/20 味方のみコンボ継続する設定を追加
// 1.4.2 2018/03/12 ダメージの桁数が多い場合に表示が見きれる場合がある問題を修正
// 1.4.1 2017/09/19 連携表示の単位の表示倍率を調整できる機能を追加
// 1.4.0 2017/09/18 一定連携以上でスキルが別のスキルに変化する機能を追加
// 1.3.2 2017/07/16 EST_BATTLE_ROYALE_EVO.jsとの競合を解消
// 1.3.1 2017/07/03 プラグインパラメータの型指定を追加
// 1.3.0 2017/07/03 最大連携数およびダメージのカウントを無効にするスイッチおよび初期化するスクリプトを追加
// 1.2.0 2017/06/14 連携ダメージ数を表示する機能と最大連携ダメージを取得できる機能を追加
//                  機械翻訳による英語化対応
// 1.1.1 2017/06/02 最大連携数が正しくカウントできていなかった問題を修正
// 1.1.0 2017/05/20 チェイン表示の時間設定と、指定数の連携に満たさずに使用すると必ず失敗するスキルを作る機能を追加
// 1.0.0 2017/05/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [X]      : https://x.com/triacontane
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 連携攻撃プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AttackChain.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param chainSkillList
 * @text スキル設定
 * @desc スキル、アイテムごとの設定情報です。
 * @type struct<Skill>[]
 * @default []
 *
 * @param chainSkin
 * @text 連携スキン
 * @desc 連携表示の表示スキン設定です。
 * @type struct<Skin>
 * @default {"unit":"Chain!!","unitFont":"{\"face\":\"\",\"size\":\"0\",\"italic\":\"true\",\"color\":\"15\",\"outlineColor\":\"0\",\"outlineWidth\":\"0\",\"image\":\"\"}","valueFont":"{\"face\":\"\",\"size\":\"0\",\"italic\":\"true\",\"color\":\"23\",\"outlineColor\":\"0\",\"outlineWidth\":\"0\",\"image\":\"\"}"}
 *
 * @param damageSkin
 * @text ダメージスキン
 * @desc ダメージ表示の表示スキン設定です。
 * @type struct<Skin>
 * @default {"unit":"Damage!!","unitFont":"{\"face\":\"\",\"size\":\"0\",\"italic\":\"true\",\"color\":\"15\",\"outlineColor\":\"0\",\"outlineWidth\":\"4\",\"image\":\"\"}","valueFont":"{\"face\":\"\",\"size\":\"0\",\"italic\":\"true\",\"color\":\"10\",\"outlineColor\":\"0\",\"outlineWidth\":\"4\",\"image\":\"\"}"}
 *
 * @param enemyChainSkin
 * @text 敵連携スキン
 * @desc 敵連携表示の表示スキン設定です。指定がなければ味方用の設定が適用されます。
 * @type struct<Skin>
 * @default
 *
 * @param enemyDamageSkin
 * @text 敵ダメージスキン
 * @desc 敵ダメージ表示の表示スキン設定です。指定がなければ味方用の設定が適用されます。
 * @type struct<Skin>
 * @default
 *
 * @param chainX
 * @text X座標
 * @desc チェイン表示のX座標です。
 * @default 8
 * @type number
 *
 * @param chainY
 * @text Y座標
 * @desc チェイン表示のY座標です。
 * @default 80
 * @type number
 *
 * @param duration
 * @text 表示時間
 * @desc チェインが表示される時間(フレーム数)です。この値を超過するとフェードアウトします。(0の場合ずっと表示)
 * @default 0
 * @type number
 *
 * @param damageRate
 * @text ダメージ倍率
 * @desc 1チェインごとに増加するダメージの増減値(%)です。
 * @default 10
 * @type number
 *
 * @param maxRate
 * @text 最大倍率
 * @desc チェインによって増加するダメージの最大倍率です。
 * @default 500
 * @type number
 *
 * @param cancelCondition
 * @text 解除条件
 * @desc チェインが解除される条件です。
 *
 * @param cancelChangeTarget
 * @text ターゲット変更で解除
 * @desc チェイン継続中のターゲット以外に攻撃すると解除されます。
 * @default true
 * @type boolean
 * @parent cancelCondition
 *
 * @param cancelMiss
 * @text ミスで解除
 * @desc 攻撃をミスすると解除されます。
 * @default true
 * @type boolean
 * @parent cancelCondition
 *
 * @param cancelNoAttack
 * @text 攻撃以外で解除
 * @desc ダメージを与える攻撃以外を行うと解除されます。
 * @default true
 * @type boolean
 * @parent cancelCondition
 *
 * @param cancelOpposite
 * @text 相手行動で解除
 * @desc 敵方が行動すると解除されます。
 * @default true
 * @type boolean
 * @parent cancelCondition
 *
 * @param cancelTraitLost
 * @text 特徴喪失で解除
 * @desc 攻撃した対象者が所定の特徴(メモ欄から指定)を保持している間のみチェインが継続します。
 * @default false
 * @type boolean
 * @parent cancelCondition
 *
 * @param invalidSwitchId
 * @text 無効スイッチ番号
 * @desc 指定したスイッチがONのとき最大連携数および最大ダメージのカウントが無効になります。
 * @default 0
 * @type switch
 *
 * @param partyOnly
 * @text 味方のみに適用
 * @desc プラグインの効果が敵グループには作用しなくなります。
 * @default false
 * @type boolean
 *
 * @help AttackChain.js
 *
 * 戦闘中、味方の攻撃が連続したときにダメージ倍率が上昇します。
 * チェイン数と同時に最大連携ダメージも表示されます。
 * チェインの継続中に相手側のチェインがスタートしたら解除されます。
 * さらにパラメータで追加の解除条件を指定できます。
 *
 * パラメータ「特徴喪失で解除」を有効にすると、対象者が
 * メモ欄を保持(※)している場合のみコンボが継続します。
 * <Combo>
 * ※アクター、職業、敵キャラ、ステート、装備のいずれかのメモ欄
 *
 * イベントコマンド「スクリプト」から以下が実行可能です。
 * $gameParty.getChainCount();     # 現在のパーティ連携数取得
 * $gameParty.getMaxChainCount();  # パーティの最大連携数を取得
 * $gameParty.getChainDamage();    # 現在のパーティ連携ダメージ取得
 * $gameParty.getMaxChainDamage(); # パーティの最大連携ダメージを取得
 * $gameParty.resetMaxChain();     # 最大連携数およびダメージをリセット
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Skin:
 * @param unit
 * @text 単位
 * @desc 表示単位です。数値の右側に「Chain!!」「Damage!!」などと表示されます。
 * @default
 *
 * @param unitFont
 * @text 単位フォント
 * @desc 単位のフォント設定です。
 * @type struct<Font>
 *
 * @param valueFont
 * @text 数値フォント
 * @desc 数値のフォント設定です。
 * @type struct<Font>
 */

/*~struct~Font:
 * @param face
 * @text フォント名
 * @desc フォント名です。指定する場合、別途フォントロードプラグインが必要です。
 * @default
 *
 * @param size
 * @text フォントサイズ
 * @desc フォントサイズです。指定しない場合、システムのデフォルトサイズになります。
 * @default 0
 *
 * @param italic
 * @text イタリック
 * @desc イタリック体にします。
 * @default true
 * @type boolean
 *
 * @param color
 * @text フォントカラー
 * @desc フォントカラーです。テキストカラーからの選択となります。
 * @type color
 * @default 0
 *
 * @param outlineColor
 * @text アウトラインカラー
 * @desc アウトラインカラーです。テキストカラーからの選択となります。
 * @type color
 * @default 0
 *
 * @param outlineWidth
 * @text アウトライン幅
 * @desc アウトライン幅です。
 * @type number
 * @default 4
 *
 * @param image
 * @text 画像ファイル
 * @desc フォントの代わりに画像を使用します。指定した場合、こちらが優先されます。
 * 数値画像は0-9までの数値を等間隔に横に並べた画像を用意してください。
 * @default
 * @type file
 * @dir img/system/
 *
 */

/*~struct~Skill:
 * @param skillId
 * @text スキルID
 * @desc 連携設定を行うスキルのIDです。
 * @default 0
 * @type skill
 *
 * @param itemId
 * @text アイテムID
 * @desc 連携設定を行うアイテムのIDです。
 * @default 0
 * @type item
 *
 * @param rate
 * @text ダメージ倍率
 * @desc スキル固有のチェインダメージ倍率を設定します。
 * @default 100
 * @type number
 *
 * @param finish
 * @text 連携終了
 * @desc このスキルを使用した場合、連携を強制終了します。
 * @default false
 * @type boolean
 *
 * @param countCondition
 * @text 連携数条件
 * @desc 連携数が指定値以上の場合のみスキルが成功します。
 * @default 0
 * @type number
 */

/**
 * 連携数を表示するスプライトです。
 * @constructor
 */
function Sprite_ChainCount() {
    this.initialize.apply(this, arguments);
}

/**
 * 連携ダメージを表示するスプライトです。
 * @constructor
 */
function Sprite_ChainDamage() {
    this.initialize.apply(this, arguments);
}

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Game_Unit
    //  チェイン回数を保持します。
    //=============================================================================
    const _Game_Unit_initialize      = Game_Unit.prototype.initialize;
    Game_Unit.prototype.initialize = function() {
        _Game_Unit_initialize.apply(this, arguments);
        this.resetMaxChain();
    };

    Game_Unit.prototype.getChainCount = function() {
        return this._chainCount || 0;
    };

    Game_Unit.prototype.getChainDamage = function() {
        return this._chainDamage || 0;
    };

    Game_Unit.prototype.getMaxChainCount = function() {
        return this._maxChain || 0;
    };

    Game_Unit.prototype.getMaxChainDamage = function() {
        return this._maxChainDamage || 0;
    };

    Game_Unit.prototype.addChainDamage = function(damageValue) {
        this._chainDamage = this.getChainDamage() + damageValue;
        if (this.isCountMaxChain() && (this._chainDamage > this._maxChainDamage || !this._maxChainDamage)) {
            this._maxChainDamage = this._chainDamage;
        }
    };

    Game_Unit.prototype.addChainCount = function(damage) {
        if (!this.isUseChain()) {
            return;
        }
        this._chainCount = this.getChainCount() + 1;
        this.opponentsUnit().resetChainCount();
        if (this.isCountMaxChain() && (this._chainCount > this._maxChain || !this._maxChain)) {
            this._maxChain = this._chainCount;
        }
        this.addChainDamage(damage);
    };

    Game_Unit.prototype.isUseChain = function() {
        return true;
    };

    Game_Unit.prototype.resetChainCount = function() {
        this._chainCount = 0;
        this.resetChainDamage();
    };

    Game_Unit.prototype.resetChainDamage = function() {
        this._chainDamage = 0;
    };

    Game_Unit.prototype.getChainRate = function(addRate) {
        return (100 + this.getChainCount() * param.damageRate * addRate).clamp(0, param.maxRate || Infinity) / 100;
    };

    Game_Unit.prototype.resetMaxChain = function() {
        this._maxChain       = 0;
        this._maxChainDamage = 0;
    };

    Game_Unit.prototype.isCountMaxChain = function() {
        return !$gameSwitches.value(param.invalidSwitchId);
    };

    Game_Unit.prototype.opponentsUnit = function() {
        return null;
    };

    Game_Party.prototype.opponentsUnit = function() {
        return $gameTroop;
    };

    Game_Troop.prototype.opponentsUnit = function() {
        return $gameParty;
    };

    Game_Troop.prototype.isUseChain = function() {
        return !param.partyOnly;
    };

    //=============================================================================
    // Game_Action
    //  チェインをダメージに反映させます。
    //=============================================================================
    const _Game_Action_apply      = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        this._hitForChain    = false;
        this._damageForChain = false;
        _Game_Action_apply.apply(this, arguments);
        this.updateChain(target);
    };

    const _Game_Action_applyItemUserEffect      = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        this._hitForChain = true;
        _Game_Action_applyItemUserEffect.apply(this, arguments);
    };

    const _Game_Action_executeDamage      = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        if (value > 0 && this.isHpEffect()) {
            this._damageForChain = true;
            if (param.cancelChangeTarget && BattleManager.isChangeTarget(target)) {
                this.friendsUnit().resetChainCount();
            }
        }
        _Game_Action_executeDamage.apply(this, arguments);
    };

    const _Game_Action_makeDamageValue      = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        let damageValue = _Game_Action_makeDamageValue.apply(this, arguments);
        if (this.isHpEffect()) {
            const addRate = this.getAdditionalChainRate()
            damageValue *= this.friendsUnit().getChainRate(addRate);
        }
        return Math.floor(damageValue);
    };

    Game_Action.prototype.findAttackChainData = function() {
        const skillId = this.isSkill() ?  this.item().id : null;
        const itemId = this.isItem() ?  this.item().id : null;
        return param.chainSkillList.find(data => data.skillId === skillId || data.itemId === itemId);
    };

    Game_Action.prototype.getAdditionalChainRate = function() {
        const data = this.findAttackChainData();
        return (data ? data.rate : 100) / 100;
    };

    Game_Action.prototype.isForceEndChain = function() {
        const data = this.findAttackChainData();
        return data ? data.finish : false;
    };

    Game_Action.prototype.isChainConditionOk = function() {
        const data = this.findAttackChainData();
        return data ? this.friendsUnit().getChainCount() >= data.countCondition : true;
    };

    Game_Action.prototype.updateChain = function(target) {
        if (this.isChainCancel(target)) {
            this.friendsUnit().resetChainCount();
        }
        if (this._damageForChain) {
            this.friendsUnit().addChainCount(target.result().hpDamage);
            BattleManager.setChainTarget(target);
        }
        if (param.cancelOpposite) {
            this.opponentsUnit().resetChainCount();
        }
    };

    Game_Action.prototype.isChainCancel = function(target) {
        if (!target.canContinueChain()) {
            return false;
        } else if (this.isForceEndChain()) {
            return true;
        } else if (param.cancelMiss && !this._hitForChain) {
            return true;
        } else if (param.cancelNoAttack && !this._damageForChain) {
            return true;
        }
        return false;
    };

    const _Game_Action_itemHit      = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function(target) {
        return this.isChainConditionOk() ? _Game_Action_itemHit.apply(this, arguments) : 0.0;
    };

    Game_BattlerBase.prototype.canContinueChain = function() {
        if (!param.cancelTraitLost) {
            return true;
        }
        return this.traitObjects().some(trait => trait.meta.Combo);
    };

    //=============================================================================
    // BattleManager
    //  チェイン状態を画面表示するために取得します。
    //=============================================================================
    const _BattleManager_setup = BattleManager.setup;
    BattleManager.setup      = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        $gameParty.resetChainCount();
        $gameTroop.resetChainCount();
    };

    BattleManager.getChainParty = function() {
        if (this.isPartyChain()) {
            return $gameParty;
        } else {
            return $gameTroop;
        }
    };

    BattleManager.isPartyChain = function() {
        return $gameParty.getChainCount() > 0;
    };

    BattleManager.setChainTarget = function(target) {
        this._chainTarget = target;
    };

    BattleManager.isChangeTarget = function(target) {
        return this._chainTarget !== target;
    };

    BattleManager.updateChainContinue = function() {
        if (this._chainTarget && !this._chainTarget.canContinueChain()) {
            this._chainTarget.opponentsUnit().resetChainCount();
            this._chainTarget = null;
        }
    };

    const _BattleManager_update = BattleManager.update;
    BattleManager.update      = function() {
        _BattleManager_update.apply(this, arguments);
        this.updateChainContinue();
    };

    //=============================================================================
    // Scene_Battle
    //  ヒット数を追加します。
    //=============================================================================
    const _Scene_Battle_createSpriteset      = Scene_Battle.prototype.createSpriteset;
    Scene_Battle.prototype.createSpriteset = function() {
        _Scene_Battle_createSpriteset.apply(this, arguments);
        this.createChainCountSprite();
    };

    Scene_Battle.prototype.createChainCountSprite = function() {
        this._chainCountSprite = new Sprite_ChainCount();
        this.addChild(this._chainCountSprite);
        this._chainDamageSprite = new Sprite_ChainDamage();
        this.addChild(this._chainDamageSprite);
    };

    //=============================================================================
    // Sprite_ChainCount
    //=============================================================================
    Sprite_ChainCount.prototype             = Object.create(Sprite.prototype);
    Sprite_ChainCount.prototype.constructor = Sprite_ChainCount;

    Sprite_ChainCount.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._chainValue = 0;
        this._partyChain = null;
        this._duration   = 0;
        this.loadStaticBitmap();
        this.update();
    };

    Sprite_ChainCount.prototype.createBitmap = function() {
        const fontSize           = this.getFontSize('value');
        this.bitmap              = new Bitmap(Graphics.boxWidth, fontSize + 12);
        this.updatePlacement();
    };

    Sprite_ChainCount.prototype.loadStaticBitmap = function() {
        const party = this.findPartySkin();
        if (party.unitFont.image) {
            this._unitBitmap = ImageManager.loadSystem(party.unitFont.image);
        }
        if (party.valueFont.image) {
            this._countBitmap = ImageManager.loadSystem(party.valueFont.image);
        }
        const enemy = this.findEnemySkin();
        if (enemy.unitFont.image) {
            this._unitEnemyBitmap = ImageManager.loadSystem(enemy.unitFont.image);
        }
        if (enemy.valueFont.image) {
            this._countEnemyBitmap = ImageManager.loadSystem(enemy.valueFont.image);
        }
    };

    Sprite_ChainCount.prototype.findPartySkin = function() {
        return param.chainSkin;
    };

    Sprite_ChainCount.prototype.findEnemySkin = function() {
        return param.enemyChainSkin || param.chainSkin;
    };

    Sprite_ChainCount.prototype.findCurrentSkin = function() {
        return this.isPartyChain() ? this.findPartySkin() : this.findEnemySkin();
    };

    Sprite_ChainCount.prototype.findCurrentFont = function(type) {
        return type === 'unit' ? this.findCurrentSkin().unitFont : this.findCurrentSkin().valueFont;
    };

    Sprite_ChainCount.prototype.findCurrentImage = function(type) {
        if (type === 'unit') {
            return this.isPartyChain() ? this._unitBitmap : this._unitEnemyBitmap;
        } else {
            return this.isPartyChain() ? this._countBitmap : this._countEnemyBitmap;
        }
    };

    Sprite_ChainCount.prototype.updatePlacement = function() {
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.x        = this.getInitX() + this.width / 2;
        this.y        = this.getInitY() + this.height / 2;
    };

    Sprite_ChainCount.prototype.update = function() {
        if (BattleManager.isBattleEnd()) {
            this.startFade();
        }
        this.updateChainValue();
        if (this._duration > 0) {
            this._duration--;
            this.updateScale();
        } else {
            this.updateFade();
        }
        this.updateVisibly();
    };

    Sprite_ChainCount.prototype.startFade = function() {
        this._duration = 0;
    };

    Sprite_ChainCount.prototype.updateChainValue = function() {
        const chainValue = this.getChainValue();
        const partyChain = this.isPartyChain();
        if (chainValue !== this._chainValue || this._partyChain !== partyChain) {
            this._chainValue = chainValue;
            this._partyChain = partyChain;
            this.refresh();
        }
    };

    Sprite_ChainCount.prototype.updateScale = function() {
        if (this.scale.x > 1.0) {
            this.scale.x -= 0.1;
            if (this.scale.x < 1.0) this.scale.x = 1.0;
        }
        if (this.scale.y > 1.0) {
            this.scale.y -= 0.1;
            if (this.scale.y < 1.0) this.scale.y = 1.0;
        }
        if (this.opacity < 255) {
            this.opacity += 32;
        }
    };

    Sprite_ChainCount.prototype.updateFade = function() {
        if (this.opacity > 0) {
            this.opacity -= 8;
        }
    };

    Sprite_ChainCount.prototype.updateVisibly = function() {
        this.visible = this.getChainParty().getChainCount() > 0;
    };

    Sprite_ChainCount.prototype.getChainParty = function() {
        return BattleManager.getChainParty();
    };

    Sprite_ChainCount.prototype.getItalicWidth = function(type) {
        return this.isFontItalic(type) ? 4 : 0;
    };

    Sprite_ChainCount.prototype.getValueLength = function() {
        return this._chainValue.toString().length;
    };

    Sprite_ChainCount.prototype.getCharNumber = function() {
        return this.getValueLength() + this.getChainUnit().length * 2;
    };

    Sprite_ChainCount.prototype.getInitX = function() {
        return param.chainX;
    };

    Sprite_ChainCount.prototype.getInitY = function() {
        return param.chainY;
    };

    Sprite_ChainCount.prototype.getChainValue = function() {
        return this.getChainParty().getChainCount();
    };

    Sprite_ChainCount.prototype.getFontFace = function(type) {
        const font = this.findCurrentFont(type);
        return font.face || (type === 'value' ? $gameSystem.numberFontFace() : $gameSystem.mainFontFace());
    };

    Sprite_ChainCount.prototype.getFontSize = function(type) {
        const font = this.findCurrentFont(type);
        return font.size || this.getDefaultFontSize(type);
    };

    Sprite_ChainCount.prototype.getDefaultFontSize = function(type) {
        return type === 'value' ? 40 : 32;
    };

    Sprite_ChainCount.prototype.isFontItalic = function(type) {
        const font = this.findCurrentFont(type);
        return !!font.italic;
    };

    Sprite_ChainCount.prototype.getChainUnit = function() {
        return this.findCurrentSkin().unit;
    };

    Sprite_ChainCount.prototype.getOutlineWidth = function(type) {
        const font = this.findCurrentFont(type);
        return font.outlineWidth || 4;
    };

    Sprite_ChainCount.prototype.getOutlineColor = function(type) {
        const font = this.findCurrentFont(type);
        return font.outlineColor || 'white';
    };

    Sprite_ChainCount.prototype.getTextColor = function(type) {
        const font = this.findCurrentFont(type);
        if (isNaN(font.color)) {
            return font.color || 'white';
        } else {
            return ColorManager.textColor(font.color);
        }
    };

    Sprite_ChainCount.prototype.refresh = function() {
        this.createBitmap();
        this.refreshText(this._chainValue, this.getChainUnit());
        this.refreshScale();
        this._duration = param.duration || Infinity;
    };

    Sprite_ChainCount.prototype.refreshText = function(number, unit) {
        let x = 0;
        const valueBitmap = this.findCurrentImage('value');
        if (valueBitmap) {
            x = this.drawCountImage(number, valueBitmap);
        } else {
            x = this.drawCount(number);
        }
        const unitBitmap = this.findCurrentImage('unit');
        if (unitBitmap) {
            this.drawUnitImage(x, unitBitmap);
        } else {
            this.drawUnit(x, unit);
        }
    };

    Sprite_ChainCount.prototype.drawCountImage = function(number, bitmap) {
        const width  = bitmap.width / 10;
        const height = bitmap.height;
        number.toString().split('').forEach(function(digit, index) {
            this.bitmap.blt(bitmap, width * digit, 0, width, height, index * width, 0, width, height);
        }, this);
        return number.toString().length * width;
    };

    Sprite_ChainCount.prototype.drawCount = function(number) {
        this.updateFont('value');
        const numberText = number.toString();
        this.bitmap.drawText(numberText, 2, 0, this.bitmap.width, this.bitmap.height, 'left');
        return this.bitmap.measureTextWidth(numberText) + 8;
    };

    Sprite_ChainCount.prototype.drawUnitImage = function(x, unitBitmap) {
        const w = unitBitmap.width;
        const h = unitBitmap.height;
        this.bitmap.blt(unitBitmap, 0, 0, w, h, x, 0, w, h);
    };

    Sprite_ChainCount.prototype.drawUnit = function(x, unit) {
        this.updateFont('unit');
        this.bitmap.drawText(unit, x, 0, this.bitmap.width - x, this.bitmap.height, 'left');
    };

    Sprite_ChainCount.prototype.updateFont = function(type) {
        this.bitmap.textColor = this.getTextColor(type);
        this.bitmap.fontSize  = this.getFontSize(type);
        this.bitmap.fontItalic = this.isFontItalic(type);
        this.bitmap.fontFace   = this.getFontFace(type);
        this.bitmap.outlineWidth = this.getOutlineWidth(type);
        this.bitmap.outlineColor = this.getOutlineColor(type);
    };

    Sprite_ChainCount.prototype.refreshScale = function() {
        this.scale.x = 2.0;
        this.scale.y = 2.0;
        this.opacity = 128;
    };

    Sprite_ChainCount.prototype.isPartyChain = function() {
        return BattleManager.isPartyChain();
    };

    //=============================================================================
    // Sprite_ChainDamage
    //=============================================================================
    Sprite_ChainDamage.prototype             = Object.create(Sprite_ChainCount.prototype);
    Sprite_ChainDamage.prototype.constructor = Sprite_ChainDamage;

    Sprite_ChainDamage.prototype.getChainValue = function() {
        return this.getChainParty().getChainDamage();
    };

    Sprite_ChainDamage.prototype.findPartySkin = function() {
        return param.damageSkin;
    };

    Sprite_ChainDamage.prototype.findEnemySkin = function() {
        return param.enemyDamageSkin || param.damageSkin;
    };

    Sprite_ChainDamage.prototype.getInitY = function() {
        return param.chainY + this.getFontSize('value') + 8;
    };

    Sprite_ChainDamage.prototype.getDefaultFontSize = function(type) {
        return Sprite_ChainCount.prototype.getDefaultFontSize.call(this, type) - 4;
    };
})();
