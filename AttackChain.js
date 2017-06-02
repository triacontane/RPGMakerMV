//=============================================================================
// AttackChain.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2017/06/02 最大連携数が正しくカウントできていなかった問題を修正
// 1.1.0 2017/05/20 チェイン表示の時間設定と、指定数の連携に満たさずに使用すると必ず失敗するスキルを作る機能を追加
// 1.0.0 2017/05/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc AttackChainPlugin
 * @author triacontane
 *
 * @param Unit
 * @desc チェイン数の単位です。
 * @default Chain!!
 *
 * @param FontSize
 * @desc チェイン表示のフォントサイズです。
 * @default 48
 *
 * @param ChainX
 * @desc チェイン表示のX座標です。
 * @default 8
 *
 * @param ChainY
 * @desc チェイン表示のY座標です。
 * @default 80
 *
 * @param Duration
 * @desc チェインが表示される時間(フレーム数)です。この値を超過するとフェードアウトします。(0の場合ずっと表示)
 * @default 0
 *
 * @param DamageRate
 * @desc 1チェインごとに増加するダメージの増減値(%)です。
 * @default 10
 *
 * @param MaxRate
 * @desc チェインによって増加するダメージの最大倍率です。
 * @default 500
 *
 * @param CancelChangeTarget
 * @desc チェイン継続中のターゲット以外に攻撃すると解除されます。
 * @default ON
 *
 * @param CancelMiss
 * @desc 攻撃をミスすると解除されます。
 * @default ON
 *
 * @param CancelNoAttack
 * @desc ダメージを与える攻撃以外を行うと解除されます。
 * @default ON
 *
 * @param CancelOpposite
 * @desc 敵方が行動すると解除されます。
 * @default ON
 *
 * @help 戦闘中、味方の攻撃が連続したときにダメージ倍率が上昇します。
 * チェインの継続中に相手側のチェインがスタートしたら解除されます。
 * さらにパラメータで追加の解除条件を指定できます。
 *
 * スキルのメモ欄で以下の機能を追加できます。
 * 数値には制御文字\v[n]が使用できます。
 * <AC_倍率:200> # チェインダメージ倍率をさらに200%にします。
 * <AC_Rate:200> # 同上
 * <AC_終了>     # そのスキルで連携を強制終了します。
 * <AC_End>      # 同上
 * <AC_条件:5>   # 5連携に満たない状態で使用すると必ず失敗します。
 * <AC_Cond:5>   # 同上
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * イベントコマンド「スクリプト」から以下が実行可能です。
 * $gameParty.getChainCount();    # 現在のパーティ連携数取得
 * $gameParty.getMaxChainCount(); # パーティの最大連携数を取得
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 連携攻撃プラグイン
 * @author トリアコンタン
 *
 * @param 単位
 * @desc チェイン数の単位です。
 * @default Chain!!
 *
 * @param フォントサイズ
 * @desc チェイン表示のフォントサイズです。
 * @default 48
 *
 * @param X座標
 * @desc チェイン表示のX座標です。
 * @default 8
 *
 * @param Y座標
 * @desc チェイン表示のY座標です。
 * @default 80
 *
 * @param 表示時間
 * @desc チェインが表示される時間(フレーム数)です。この値を超過するとフェードアウトします。(0の場合ずっと表示)
 * @default 0
 *
 * @param ダメージ倍率
 * @desc 1チェインごとに増加するダメージの増減値(%)です。
 * @default 10
 *
 * @param 最大倍率
 * @desc チェインによって増加するダメージの最大倍率です。
 * @default 500
 *
 * @param ターゲット変更で解除
 * @desc チェイン継続中のターゲット以外に攻撃すると解除されます。
 * @default ON
 *
 * @param ミスで解除
 * @desc 攻撃をミスすると解除されます。
 * @default ON
 *
 * @param 攻撃以外で解除
 * @desc ダメージを与える攻撃以外を行うと解除されます。
 * @default ON
 *
 * @param 相手行動で解除
 * @desc 敵方が行動すると解除されます。
 * @default ON
 *
 * @help 戦闘中、味方の攻撃が連続したときにダメージ倍率が上昇します。
 * チェインの継続中に相手側のチェインがスタートしたら解除されます。
 * さらにパラメータで追加の解除条件を指定できます。
 *
 * スキルのメモ欄で以下の機能を追加できます。
 * 数値には制御文字\v[n]が使用できます。
 * <AC_倍率:200> # チェインダメージ倍率をさらに200%にします。
 * <AC_Rate:200> # 同上
 * <AC_終了>     # そのスキルで連携を強制終了します。
 * <AC_End>      # 同上
 * <AC_条件:5>   # 5連携に満たない状態で使用すると必ず失敗します。
 * <AC_Cond:5>   # 同上
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * イベントコマンド「スクリプト」から以下が実行可能です。
 * $gameParty.getChainCount();    # 現在のパーティ連携数取得
 * $gameParty.getMaxChainCount(); # パーティの最大連携数を取得
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'AttackChain';
    var metaTagPrefix = 'AC_';

    //=============================================================================
    // ユーザ設定領域
    //=============================================================================
    var userSettings = {
        /* チェイン画像の色設定 */
        chainColor: {
            party: 'rgba(0, 128, 255, 1.0)',
            troop: 'red'
        }
    };

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON';
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function(object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                = {};
    param.unit               = getParamString(['Unit', '単位']);
    param.fontSize           = getParamNumber(['FontSize', 'フォントサイズ']) || 48;
    param.maxRate            = getParamNumber(['MaxRate', '最大倍率']) || 100;
    param.damageRate         = getParamNumber(['DamageRate', 'ダメージ倍率']);
    param.chainX             = getParamNumber(['ChainX', 'X座標']) || 0;
    param.chainY             = getParamNumber(['ChainY', 'Y座標']) || 0;
    param.duration           = getParamNumber(['Duration', '表示時間']) || 0;
    param.cancelChangeTarget = getParamBoolean(['CancelChangeTarget', 'ターゲット変更で解除']);
    param.cancelMiss         = getParamBoolean(['CancelMiss', 'ミスで解除']);
    param.cancelNoAttack     = getParamBoolean(['CancelNoAttack', '攻撃以外で解除']);
    param.cancelOpposite     = getParamBoolean(['CancelOpposite', '相手行動で解除']);

    //=============================================================================
    // Game_Unit
    //  チェイン回数を保持します。
    //=============================================================================
    Game_Unit.prototype.getChainCount = function() {
        return this._chainCount || 0;
    };

    Game_Unit.prototype.getMaxChainCount = function() {
        return this._maxChain || 0;
    };

    Game_Unit.prototype.addChainCount = function() {
        this._chainCount = this.getChainCount() + 1;
        this.members()[0].opponentsUnit().resetChainCount();
        if (this._chainCount > this._maxChain || !this._maxChain) {
            this._maxChain = this._chainCount;
        }
    };

    Game_Unit.prototype.resetChainCount = function() {
        this._chainCount = 0;
    };

    Game_Unit.prototype.getChainRate = function(addRate) {
        return (100 + this.getChainCount() * param.damageRate * addRate).clamp(0, param.maxRate || Infinity) / 100;
    };

    //=============================================================================
    // Game_Action
    //  チェインをダメージに反映させます。
    //=============================================================================
    var _Game_Action_apply      = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        this._hitForChain    = false;
        this._damageForChain = false;
        _Game_Action_apply.apply(this, arguments);
        this.updateChain(target);
    };

    var _Game_Action_applyItemUserEffect      = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        this._hitForChain = true;
        _Game_Action_applyItemUserEffect.apply(this, arguments);
    };

    var _Game_Action_executeDamage      = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function(target, value) {
        if (value > 0 && this.isHpEffect()) {
            this._damageForChain = true;
            if (param.cancelChangeTarget && BattleManager.isChangeTarget(target)) {
                this.friendsUnit().resetChainCount();
            }
        }
        _Game_Action_executeDamage.apply(this, arguments);
    };

    var _Game_Action_makeDamageValue      = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        var damageValue = _Game_Action_makeDamageValue.apply(this, arguments);
        if (this.isHpEffect()) {
            damageValue *= this.friendsUnit().getChainRate(this.getAdditionalChainRate());
        }
        return Math.floor(damageValue);
    };

    Game_Action.prototype.getMetaTextForAttackChain = function(names) {
        return getMetaValues(this.item(), names);
    };

    Game_Action.prototype.getMetaNumberForAttackChain = function(names) {
        return getArgNumber(this.getMetaTextForAttackChain(names));
    };

    Game_Action.prototype.getAdditionalChainRate = function() {
        return (this.getMetaNumberForAttackChain(['倍率', 'Rate']) || 100) / 100;
    };

    Game_Action.prototype.isForceEndChain = function() {
        return this.getMetaTextForAttackChain(['終了', 'End']) !== undefined;
    };

    Game_Action.prototype.isChainConditionOk = function() {
        return this.getMetaNumberForAttackChain(['条件', 'Cond']) <= this.friendsUnit().getChainCount();
    };

    Game_Action.prototype.updateChain = function(target) {
        if (this.isChainCancel()) {
            this.friendsUnit().resetChainCount();
        }
        if (this._damageForChain) {
            this.friendsUnit().addChainCount();
            BattleManager.setChainTarget(target);
        }
        if (param.cancelOpposite) {
            this.opponentsUnit().resetChainCount();
        }
    };

    Game_Action.prototype.isChainCancel = function() {
        if (this.isForceEndChain()) {
            return true;
        } else if (param.cancelMiss && !this._hitForChain) {
            return true;
        } else if (param.cancelNoAttack && !this._damageForChain) {
            return true;
        }
        return false;
    };

    var _Game_Action_itemHit      = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function(target) {
        return this.isChainConditionOk() ? _Game_Action_itemHit.apply(this, arguments) : 0.0;
    };

    //=============================================================================
    // BattleManager
    //  チェイン状態を画面表示するために取得します。
    //=============================================================================
    var _BattleManager_setup = BattleManager.setup;
    BattleManager.setup      = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        $gameParty.resetChainCount();
        $gameTroop.resetChainCount();
    };

    BattleManager.getChainCount = function() {
        if (this.isPartyChain()) {
            return $gameParty.getChainCount();
        } else {
            return -$gameTroop.getChainCount();
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

    //=============================================================================
    // Scene_Battle
    //  ヒット数を追加します。
    //=============================================================================
    var _Scene_Battle_createSpriteset      = Scene_Battle.prototype.createSpriteset;
    Scene_Battle.prototype.createSpriteset = function() {
        _Scene_Battle_createSpriteset.apply(this, arguments);
        this._chainCountSprite = new Sprite_ChainCount();
        this.addChild(this._chainCountSprite);
    };

    //=============================================================================
    // Sprite_ChainCount
    //  ヒット数を表示します。
    //=============================================================================
    function Sprite_ChainCount() {
        this.initialize.apply(this, arguments);
    }

    Sprite_ChainCount.prototype             = Object.create(Sprite.prototype);
    Sprite_ChainCount.prototype.constructor = Sprite_ChainCount;

    Sprite_ChainCount.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._chainCount = 0;
        this._duration = 0;
        this.createBitmap();
        this.update();
        this.initPosition();
    };

    Sprite_ChainCount.prototype.initPosition = function() {
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.x        = param.chainX + this.width / 2;
        this.y        = param.chainY + this.height / 2;
    };

    Sprite_ChainCount.prototype.createBitmap = function() {
        this.bitmap              = new Bitmap((param.fontSize / 2) * 12, param.fontSize + 8);
        this.bitmap.fontSize     = param.fontSize;
        this.bitmap.fontItalic   = true;
        this.bitmap.outlineWidth = 8;
        this.bitmap.outlineColor = 'white';
    };

    Sprite_ChainCount.prototype.update = function() {
        var chainCount = BattleManager.getChainCount();
        if (chainCount !== this._chainCount) {
            this._chainCount = chainCount;
            this.refresh();
        }
        if (this._duration > 0) {
            this._duration--;
            this.updateScale();
        } else {
            this.updateFade();
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

    Sprite_ChainCount.prototype.refresh = function() {
        this.bitmap.clear();
        var chainValue = Math.abs(this._chainCount);
        if (chainValue > 1) {
            this.refreshText(`${chainValue} ${param.unit}`);
            this.refreshScale();
            this._duration = param.duration || Infinity;
        }
    };

    Sprite_ChainCount.prototype.refreshText = function(text) {
        this.bitmap.textColor = userSettings.chainColor[(this.isPartyChain() ? 'party' : 'troop')];
        this.bitmap.drawText(text, 0, 0, this.bitmap.width, this.bitmap.height, 'left');
    };

    Sprite_ChainCount.prototype.refreshScale = function() {
        this.scale.x = 2.0;
        this.scale.y = 2.0;
        this.opacity = 128;
    };

    Sprite_ChainCount.prototype.isPartyChain = function() {
        return this._chainCount > 0;
    };
})();
