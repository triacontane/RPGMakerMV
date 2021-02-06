//=============================================================================
// BattleEffectPopup.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.1.4 2021/02/06 2.1.3の修正で特定のポップアップが重なったときにエラーになる問題を修正
// 2.1.3 2021/01/31 戦闘開始時にパーティのポップアップが残っていた場合、消去するよう修正
// 2.1.2 2021/01/24 静止画像を指定してポップアップしたとき、ポップアップ削除時にdestroyしてしまう問題を修正
// 2.1.1 2021/01/24 ベースプラグインの記述を追加
// 2.1.0 2021/01/24 ポップアップカラーの凡例を追加。メッセージの表示タイミングを微調整
// 2.0.0 2021/01/21 MZ版としてほぼ全面的に再作成
// 1.9.2 2020/04/15 MOG_BattleHud.jsと併用したとき、フロントビューで味方にポップアップメッセージが表示されるよう変更
// 1.9.1 2020/03/15 YEP_X_ActSeqPack1.jsでステート付与に成功してもステート付与メッセージがでない不具合を代わりに修正
// 1.9.0 2020/02/11 ポップアップメッセージが重なったときに次のポップアップまでのウェイトが指定できる機能を追加
// 1.8.1 2019/02/26 KMS_SomStyleDamage.jsとの競合を解消。こちらのポップアップもKMS_SomStyleDamage.jsと同じ動きをします。
// 1.8.0 2018/10/13 パラメータの型指定機能に対応
//                  コモンイベントが呼び出された場合は無効ポップアップを出さないよう仕様変更
// 1.7.2 2018/10/07 プラグインコマンド「対象者ポップアップ」にて競合等の理由で対象が見付からない場合にエラーを回避するよう修正
// 1.7.1 2017/08/03 YEP_BattleEngineCore.jsと併用したときに、メッセージの種類によってポップアップ位置が変化する問題を修正
// 1.7.0 2017/06/13 行動がガード（耐性によって完全に防がれた）された場合のポップアップを追加
// 1.6.0 2017/06/10 行動が無効だった場合のポップアップを追加
// 1.5.1 2017/06/10 自動戦闘が有効なアクターがいる場合に一部機能が正常に動作しない問題を修正
// 1.5.0 2017/05/30 弱点と耐性のポップアップで弱点や耐性と見なすための閾値を設定できる機能を追加
// 1.4.0 2017/05/20 CounterExtend.jsとの併用でスキルによる反撃が表示されない問題を修正。
//                  ポップアップのイタリック体および縁取り表示を行う機能を追加。
// 1.3.1 2016/12/18 VE_BasicModule.jsとの競合を解消
// 1.3.0 2016/07/14 アクターと敵キャラの通常ダメージにも専用のフラッシュ色を指定できるようになりました。
// 1.2.3 2016/07/13 1.2.2の修正が不完全だったのを対応
// 1.2.2 2016/07/13 YEP_BattleEngineCore.jsと併用したときに、Missが重複して表示される現象を修正
// 1.2.1 2016/07/12 Z座標を指定しているプラグインとの競合を解消するかもしれない
// 1.2.0 2016/07/10 行動失敗時(Miss!)も任意の文字または画像に置き換えられるようになりました。
// 1.1.0 2016/07/09 ポップアップに任意の画像を指定できるようになりました。
//                  フラッシュするフレーム数を指定できるようになりました。
// 1.0.0 2016/07/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 戦闘行動結果ポップアッププラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BattleEffectPopup.js
 * @base PluginCommonBase
 * @author トリアコンタン
 * 
 * @param Critical
 * @text クリティカルポップアップ
 * @desc クリティカル発生時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Critical","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param Avoid
 * @text 回避ポップアップ
 * @desc 回避発生時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Avoid","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param Miss
 * @text ミスポップアップ
 * @desc ミス発生時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Miss","fileName":"","stateId":"","color":"","flash":"","se":""}
 * 
 * @param Invalid
 * @text 無効ポップアップ
 * @desc 行動が無効（行動は成功したが有効な効果がなかった）だった時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Invalid","fileName":"","stateId":"","color":"","flash":"","se":""}
 * 
 * @param Guard
 * @text ガードポップアップ
 * @desc 行動がガード（行動は成功したが相手の耐性によって完全に防がれた）された時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Guard","fileName":"","stateId":"","color":"","flash":"","se":""}
 * 
 * @param Reflection
 * @text 魔法反射ポップアップ
 * @desc 魔法反射時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Reflection","fileName":"","stateId":"","color":"","flash":"","se":""}
 * 
 * @param Counter
 * @text 反撃ポップアップ
 * @desc 反撃時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Counter","fileName":"","stateId":"","color":"","flash":"","se":""}
 * 
 * @param Weakness
 * @text 弱点ポップアップ
 * @desc 弱点時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Weakness","fileName":"","stateId":"","color":"","flash":"","se":""}
 * 
 * @param Resistance
 * @text 耐性ポップアップ
 * @desc 耐性時のポップアップ情報です。
 * @type struct<Popup>
 * @default {"text":"Resist","fileName":"","stateId":"","color":"","flash":"","se":""}
 *
 * @param StateList
 * @text ステートポップアップリスト
 * @desc ステートが発生したときのポップアップ情報リストです。必ず「ステートID」を指定して下さい。
 * @type struct<Popup>[]
 * @default []
 *
 * @param MaxWidth
 * @text メッセージ最大幅
 * @desc ポップアップメッセージの最大幅です。
 * @default 240
 * @type number
 *
 * @param OffsetX
 * @text X座標補正
 * @desc ポップアップのX座標補正値です。
 * @default 0
 * @type number
 * @min -999
 * @max 999
 *
 * @param OffsetY
 * @text Y座標補正
 * @desc ポップアップのY座標の補正値です。
 * @default 0
 * @type number
 * @min -999
 * @max 999
 *
 * @param MessageWait
 * @text メッセージウェイト
 * @desc ポップアップメッセージが重なったときに次のメッセージが表示されるまでのウェイトフレーム数です。
 * @default 16
 * @type number
 *
 * @command USER_POPUP
 * @text 使用者ポップアップ
 * @desc スキルの使用者にポップアップ表示します。
 *
 * @arg value
 * @text ポップアップ情報
 * @desc ポップアップ表示する情報です。
 * @default 
 * @type struct<Popup>
 *
 * @command TARGET_POPUP
 * @text 対象者ポップアップ
 * @desc スキルの対象者にポップアップ表示します。
 *
 * @arg value
 * @text ポップアップ情報
 * @desc ポップアップ表示する情報です。
 * @default 
 * @type struct<Popup>
 *
 * @help 戦闘中に行動の結果のメッセージをポップアップします。
 * ポップアップするのは動的に作成した文字列もしくは用意したピクチャです。
 * 表示条件は以下の通りです。
 * ポップアップのフォントはデータベースで指定した数字フォントが使われます。
 *
 * ・失敗（通常のMissは表示されなくなります）
 * ・回避（通常のMissは表示されなくなります）
 * ・無効（行動は成功したが有効な効果がなかった）
 * ・ガード（行動は成功したが相手の耐性によって完全に防がれた）
 * ・クリティカル
 * ・反撃
 * ・魔法反射
 * ・弱点（ダメージ倍率が1.1を上回った場合）
 * ・耐性（ダメージ倍率が0.9を下回った場合）
 * ・ステート付与（ステートごとに設定できます）
 * ・コモンイベント（プラグインコマンドから実行します）
 *
 * ※ガードが表示されるのは、ステート有効度もしくは属性有効度が0%の効果が
 * 存在し、かつ他に有効な効果がない場合です。
 * なお、「ステート無効化」で防がれた場合は表示されません。
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

/*~struct~Popup:
 * 
 * @param text
 * @text ポップアップテキスト
 * @desc ポップアップテキストです。
 * 
 * @param fileName
 * @text ポップアップファイル
 * @desc ポップアップする画像ファイルです。指定した場合、テキスト表示より優先されます。
 * @type file
 * @dir img/pictures
 *
 * @param stateId
 * @text ステートID
 * @desc ポップアップ表示対象のステートIDです。ステートリスト以外では指定不要です。
 * @type state
 *
 * @param color
 * @text ポップアップカラー
 * @desc ポップアップカラーです。CSSの色指定文字列を指定します。
 * @default
 * @type combo
 * @option rgba(255, 255, 255, 1.0);
 * @option hsla(100%, 100%, 100%, 0.5);
 * @option #99FF66
 * @option black
 * @option silver
 * @option gray
 * @option white
 * @option maroon
 * @option red
 * @option purple
 * @option fuchsia
 * @option green
 * @option lime
 * @option olive
 * @option yellow
 * @option navy
 * @option blue
 * @option teal
 * @option aqua
 * 
 * @param flash
 * @text フラッシュ
 * @desc ポップアップ時のフラッシュカラーです。
 * @type struct<Color>
 * @default
 *
 * @param se
 * @text 効果音
 * @desc ポップアップ時の効果音です。
 * @type struct<SE>
 * @default
 *
 */

/*~struct~Color:
 *
 * @param red
 * @text 赤色
 * @desc フラッシュの赤色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param green
 * @text 緑色
 * @desc フラッシュの緑色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param blue
 * @text 青色
 * @desc フラッシュの青色の度合いです。
 * @default 255
 * @type number
 * @max 255
 *
 * @param alpha
 * @text 強さ
 * @desc フラッシュの強さです。
 * @default 0
 * @type number
 * @max 255
 */

/*~struct~SE:
 *
 * @param name
 * @text ファイル名
 * @desc ファイル名です。
 * @require 1
 * @dir audio/se/
 * @type file
 * @default
 *
 * @param volume
 * @text ボリューム
 * @desc ボリュームです。
 * @type number
 * @default 90
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc ピッチです。
 * @type number
 * @default 100
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 定位
 * @desc 定位(左右バランス)です。
 * @type number
 * @default 0
 * @min -100
 * @max 100
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'USER_POPUP', args => {
        BattleManager.getActionTarget().subject.startMessagePopup(args.value);
    });

    PluginManagerEx.registerCommand(script, 'TARGET_POPUP', args => {
        BattleManager.getActionTarget().targets.forEach(target => target.startMessagePopup(args.value));
    });

    const _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        $gameParty.members().forEach(actor => actor.initMessagePopup());
    };

    const _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        _BattleManager_startAction.apply(this, arguments);
        this._actionTarget = {
            subject: this._subject,
            targets: this._targets.clone()
        };
    };

    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        this._actionTarget = null;
        _BattleManager_endBattle.apply(this, arguments);
    };

    BattleManager.getActionTarget = function() {
        return this._actionTarget;
    };

    //=============================================================================
    // Game_Action
    //  弱点によってポップアップを設定します。
    //=============================================================================
    const _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        const result = _Game_Action_calcElementRate.apply(this, arguments);
        if (BattleManager.isInputting()) return result;
        if (result === 0) {
            target.appointMessagePopup(param.Guard);
        } else if (result >= 1.1) {
            target.appointMessagePopup(param.Weakness);
        } else if (result <= 0.9) {
            target.appointMessagePopup(param.Resistance);
        }
        return result;
    };

    //=============================================================================
    // Game_Battler
    //  ポップアップメッセージのリクエストに応答します。
    //=============================================================================
    Game_Battler.prototype.clearMessagePopup = function() {
        this._messagePopup = null;
    };

    Game_Battler.prototype.initMessagePopup = function() {
        this._messagePopup = null;
        this._appointPopup = null;
    };

    Game_Battler.prototype.isMessagePopupRequested = function() {
        return !!this._messagePopup;
    };

    Game_Battler.prototype.startMessagePopup = function(popUp) {
        if (popUp.text || popUp.fileName) {
            this._messagePopup = popUp;
        } else {
            console.error(popUp)
            PluginManagerEx.throwError('Popup text or file not found.', script);
        }
    };

    Game_Battler.prototype.startAppointMessagePopup = function() {
        this.startMessagePopup(this._appointPopup);
        this._appointPopup = null;
    };

    Game_Battler.prototype.appointMessagePopup = function(popUp) {
        this._appointPopup = popUp;
    };

    Game_Battler.prototype.getMessagePopup = function() {
        return this._messagePopup;
    };

    const _Game_Battler_stateRate = Game_Battler.prototype.stateRate;
    Game_Battler.prototype.stateRate = function(stateId) {
        const rate = _Game_Battler_stateRate.apply(this, arguments);
        if (rate === 0) {
            this.result().guarded = true;
        }
        return rate;
    };

    Game_Battler.prototype.hasAppointPopup = function() {
        return !!this._appointPopup;
    };

    //=============================================================================
    // Game_ActionResult
    //  行動が無効だったかどうかを返します。
    //=============================================================================
    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.apply(this, arguments);
        this.guarded = false;
    };

    Game_ActionResult.prototype.isInvalid = function() {
        return !this.success && !this.missed && !this.evaded && !$gameTemp.isCommonEventReserved();
    };

    Game_ActionResult.prototype.isGuarded = function() {
        return this.guarded && this.isInvalid();
    };

    Game_ActionResult.prototype.findResultPopup = function() {
        if (this.critical) {
            return param.Critical;
        } else if (this.isGuarded()) {
            return param.Guard;
        } else if (this.isInvalid()) {
            return param.Invalid;
        } else if (this.missed) {
            return param.Miss;
        } else if (this.evaded) {
            return param.Avoid;
        } else {
            return null;
        }
    };

    //=============================================================================
    // Window_BattleLog
    //  ポップアップメッセージをリクエストします。
    //=============================================================================
    Window_BattleLog.prototype.popupMessage = function(target, popUp) {
        target.startMessagePopup(popUp);
    };

    Window_BattleLog.prototype.popupAppointMessage = function(target) {
        target.startAppointMessagePopup();
    };

    const _Window_BattleLog_displayCritical = Window_BattleLog.prototype.displayCritical;
    Window_BattleLog.prototype.displayCritical = function(target) {
        _Window_BattleLog_displayCritical.apply(this, arguments);
        this.displayResultPopup(target);
    };

    Window_BattleLog.prototype.displayResultPopup = function(target) {
        const popup = target.result().findResultPopup();
        if (popup) {
            this.pushPopupMessage(target, popup);
        }
        if (target.hasAppointPopup()) {
            this.pushPopupAppointMessage(target);
        }
    };

    const _Window_BattleLog_displayCounter = Window_BattleLog.prototype.displayCounter;
    Window_BattleLog.prototype.displayCounter = function(target) {
        _Window_BattleLog_displayCounter.apply(this, arguments);
        this.pushPopupMessage(target, param.Counter);
    };

    const _Window_BattleLog_displayReflection = Window_BattleLog.prototype.displayReflection;
    Window_BattleLog.prototype.displayReflection = function(target) {
        _Window_BattleLog_displayReflection.apply(this, arguments);
        this.pushPopupMessage(target, param.Reflection);
    };

    const _Window_BattleLog_displayAddedStates = Window_BattleLog.prototype.displayAddedStates;
    Window_BattleLog.prototype.displayAddedStates = function(target) {
        _Window_BattleLog_displayAddedStates.apply(this, arguments);
        if (!param.StateList) {
            return;
        }
        target.result().addedStateObjects().forEach(state => {
            const popUp = param.StateList.filter(item => item.stateId === state.id)[0];
            if (popUp) {
                this.pushPopupMessage(target, popUp);
            }
        });
    };

    Window_BattleLog.prototype.pushPopupMessage = function(target, popUp) {
        if (this.hasPopupMessage()) {
            this.push('waitForPopup');
        }
        this.push('popupMessage', target, popUp);
    };

    Window_BattleLog.prototype.pushPopupAppointMessage = function(target) {
        if (this.hasPopupMessage()) {
            this.push('waitForPopup');
        }
        this.push('popupAppointMessage', target);
    };

    Window_BattleLog.prototype.hasPopupMessage = function() {
        return this._methods.some(function(method) {
            return method.name === 'popupMessage' || method.name === 'popupAppointMessage';
        });
    };

    Window_BattleLog.prototype.waitForPopup = function() {
        this._waitCount = param.MessageWait || 0;
    };

    //=============================================================================
    // Sprite_Battler
    //  ポップアップメッセージを作成します。
    //=============================================================================
    const _Sprite_Battler_updateDamagePopup = Sprite_Battler.prototype.updateDamagePopup;
    Sprite_Battler.prototype.updateDamagePopup = function() {
        this.setupMessagePopup();
        _Sprite_Battler_updateDamagePopup.apply(this, arguments);
    };

    const _Sprite_Battler_createDamageSprite = Sprite_Battler.prototype.createDamageSprite;
    Sprite_Battler.prototype.createDamageSprite = function() {
        if (this._battler.result().missed && param.Miss) {
            return;
        } else if (this._battler.result().evaded && param.Avoid) {
            return;
        }
        _Sprite_Battler_createDamageSprite.apply(this, arguments);
    };

    Sprite_Battler.prototype.setupMessagePopup = function() {
        if (this._battler.isMessagePopupRequested()) {
            if (this._battler.isSpriteVisible()) {
                this.createMessagePopup();
            }
            this._battler.clearMessagePopup();
        }
    };

    Sprite_Battler.prototype.createMessagePopup = function() {
        const last = this._damages[this._damages.length - 1];
        const sprite = new Sprite_PopupMessage();
        if (last) {
            sprite.x = last.x + 8;
            sprite.y = last.y - 16;
        } else {
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
        }
        if (param.OffsetX) {
            sprite.x += param.OffsetX;
        }
        if (param.OffsetY) {
            sprite.y += param.OffsetY;
        }
        sprite.setup(this._battler);
        this._damages.push(sprite);
        this.parent.addChild(sprite);
    };

    //=============================================================================
    // Sprite_PopupMessage
    //  ポップアップメッセージを表示するスプライトです。
    //=============================================================================
    function Sprite_PopupMessage() {
        this.initialize.apply(this, arguments);
    }

    Sprite_PopupMessage.prototype = Object.create(Sprite_Damage.prototype);
    Sprite_PopupMessage.prototype.constructor = Sprite_PopupMessage;

    Sprite_PopupMessage.prototype.setup = function(target) {
        this._popup = target.getMessagePopup();
        const sprite = this.createChildSprite(param.MaxWidth || 240, this.fontSize());
        sprite.dy = 0;
        const flash = this._popup.flash
        if (flash && flash.alpha > 0) {
            this._flashColor = [flash.red, flash.green, flash.blue, flash.alpha];
            this._flashDuration = param.FlashDuration || 60;
        }
        const se = this._popup.se;
        if (se) {
            AudioManager.playSe(se);
        }
    };

    const _Sprite_Damage_damageColor = Sprite_Damage.prototype.damageColor;
    Sprite_PopupMessage.prototype.damageColor = function() {
        if (this._popup && this._popup.color) {
            return this._popup.color;
        } else {
            return _Sprite_Damage_damageColor.apply(this, arguments);
        }
    };

    const _Sprite_Damage_createBitmap = Sprite_Damage.prototype.createBitmap;
    Sprite_PopupMessage.prototype.createBitmap = function(width, height) {
        if (this._popup.fileName) {
            return ImageManager.loadPicture(this._popup.fileName, 0);
        } else {
            const bitmap = _Sprite_Damage_createBitmap.apply(this, arguments);
            bitmap.drawText(this._popup.text, 0, 0, width, height, 'center');
            return bitmap;
        }
    };

    const _Sprite_PopupMessage_destroy = Sprite_PopupMessage.prototype.destroy;
    Sprite_PopupMessage.prototype.destroy = function(options) {
        for (const child of this.children) {
            if (child.bitmap && child.bitmap.url) {
                child.bitmap = null;
            }
        }
        _Sprite_PopupMessage_destroy.apply(this, arguments);
    };
})();
