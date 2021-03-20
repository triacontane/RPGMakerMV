//=============================================================================
// CharacterPopupDamage.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2021/03/20 コマンドの設定が空の状態でもポップアップされるよう修正
// 2.0.0 2021/03/19 MZ向けに全面的に修正
// 1.6.1 2019/04/20 ダメージが0だった場合の表記を「MISS」から「0」に変更
// 1.6.0 2018/11/11 プラグインの型指定機能に対応
//                  ポップアップ効果音を消音できるスイッチを追加
// 1.5.1 2017/11/10 コピペミスによる誤記を修正
// 1.5.0 2017/04/23 ポップアップ時にキャラクターをフラッシュさせる機能を追加
// 1.4.0 2017/03/03 ピクチャより前面にポップアップできる設定を追加
//                  回転がない場合でも拡大率を自由に変更できるよう修正
// 1.3.0 2017/01/23 スリップダメージのポップアップに対応
//                  対応するフォロワーのポップアップを表示する機能を追加
// 1.2.0 2016/12/31 ポップアップの色調設定機能を追加
//                  ポップアップの表示方法を詳細指定できる機能を追加
// 1.1.1 2016/09/15 最新の修正で自動ポップアップの設定が手動に影響していた問題を修正
// 1.1.0 2016/09/14 MPダメージ用に専用効果音を指定できる機能を追加
//                  HP、MP、TP、増加、減少の条件で個別に出力可否を設定できる機能を追加
// 1.0.3 2016/09/10 VE_BasicModule.jsとの競合を解消
// 1.0.2 2016/04/17 ポップアップ無効化のプラグインコマンドが機能していなかった問題を修正
// 1.0.1 2016/04/10 HPの増減との連動で増やすと減らすが逆に解釈されていたのを修正
// 1.0.0 2016/04/09 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc キャラクターのダメージポッププラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CharacterPopupDamage.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param PlaySe
 * @text 効果音演奏
 * @desc 状況に応じたシステム効果音を自動演奏します。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param SuppressSwitchId
 * @text 消音スイッチID
 * @desc 指定したIDのスイッチがONになっているとき、システム効果音が自動演奏されなくなります。
 * @default 0
 * @type switch
 *
 * @param OffsetX
 * @text X座標補正
 * @desc ポップアップ位置のX座標を補正します。
 * @default 0
 *
 * @param OffsetY
 * @text Y座標補正
 * @desc ポップアップ位置のY座標を補正します。
 * @default 0
 *
 * @param HpAutoPop
 * @text HP自動ポップアップ
 * @desc HPの増減を自動ポップアップの対象にします。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param MpAutoPop
 * @text MP自動ポップアップ
 * @desc MPの増減を自動ポップアップの対象にします。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param TpAutoPop
 * @text TP自動ポップアップ
 * @desc TPの増減を自動ポップアップの対象にします。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param IncreaseAutoPop
 * @text 増加自動ポップアップ
 * @desc パラメータの増加を自動ポップアップの対象にします。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param DecreaseAutoPop
 * @text 減少自動ポップアップ
 * @desc パラメータの減少を自動ポップアップの対象にします。(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param DisableAutoPop
 * @text 自動ポップ無効スイッチ
 * @desc 指定したIDのスイッチがONになっているとき、自動ポップアップが無効になります。
 * @default 0
 * @type switch
 *
 * @param MpDamageSe
 * @text MPダメージ音
 * @desc MPダメージ時の効果音ファイル名を別途指定(audio/se)します。何も指定しないとHPと同じになります。
 * @default
 * @type file
 * @dir audio/se
 *
 * @param Rotation
 * @text 回転
 * @desc 数字の回転運動を有効にします。
 * @default false
 * @type boolean
 *
 * @param RadiusX
 * @text X方向半径
 * @desc 数字を回転させる場合のX方向の半径です。
 * @default 40
 *
 * @param RadiusY
 * @text Y方向半径
 * @desc 数字を回転させる場合のY方向の半径です。
 * @default 40
 *
 * @param RotateSpeed
 * @text 回転速度
 * @desc 数字を回転させる場合の速度です。
 * @default 60
 *
 * @param Scale
 * @text 拡大率
 * @desc 初期状態の拡大率です。
 * @default 100
 *
 * @param ScaleDelta
 * @text 拡大率変化値
 * @desc 1フレームごとの拡大率の変化値です。
 * @default 0
 *
 * @param OnTop
 * @text 最前面表示
 * @desc ポップアップをピクチャより前面に表示します。
 * @default false
 * @type boolean
 *
 * @command POPUP_DAMAGE
 * @text ダメージポップアップ
 * @desc 指定キャラクターにダメージポップアップします。
 *
 * @arg character
 * @text 対象キャラクター
 * @desc ポップアップ対象キャラクターです。-1:プレイヤー、0:このイベント、1以上:指定したIDのイベント
 * @default 0
 * @type number
 * @min -1
 *
 * @arg value
 * @text ポップアップ値(直接指定)
 * @desc ポップアップする数値です。
 * @default 0
 * @type number
 * @min -999999999
 *
 * @arg valueVariable
 * @text ポップアップ値(変数指定)
 * @desc ポップアップする数値を変数から取得したい場合はこちらを指定します。
 * @default 0
 * @type variable
 *
 * @arg setting
 * @text ポップアップ設定
 * @desc ポップアップの詳細設定です。
 * @default {"reverse":"false","type":"HP","critical":"false"}
 * @type struct<Setting>
 *
 * @command POPUP_FLASH
 * @text ポップアップのフラッシュ設定
 * @desc ポップアップ時に対象キャラクターをフラッシュさせます。回復時、ミス時は無効です。
 *
 * @arg red
 * @text 赤
 * @desc 赤色の強さです。
 * @default 0
 * @max 255
 * @type number
 *
 * @arg green
 * @text 緑
 * @desc 緑色の強さです。
 * @default 0
 * @max 255
 * @type number
 *
 * @arg blue
 * @text 青
 * @desc 青色の強さです。
 * @default 0
 * @max 255
 * @type number
 *
 * @arg alpha
 * @text 強さ
 * @desc フラッシュの強さです。
 * @default 0
 * @max 255
 * @type number
 *
 * @command POPUP_TONE
 * @text ポップアップの色調設定
 * @desc ポップアップの色調を設定します。
 *
 * @arg red
 * @text 赤
 * @desc 赤色の強さです。
 * @default 0
 * @min -255
 * @max 255
 * @type number
 *
 * @arg green
 * @text 緑
 * @desc 緑色の強さです。
 * @default 0
 * @min -255
 * @max 255
 * @type number
 *
 * @arg blue
 * @text 青
 * @desc 青色の強さです。
 * @default 0
 * @min -255
 * @max 255
 * @type number
 *
 * @arg gray
 * @text グレー
 * @desc グレースケールの強さです。
 * @default 0
 * @max 255
 * @type number
 *
 * @help CharacterPopupDamage.js
 *
 * マップ画面でイベントやプレイヤーに数字をポップアップさせる機能を提供します。
 * マップ上でのダメージや回復の演出に利用できます。演出は戦闘時のものと同一です。
 * 指定する値をマイナスにすると回復扱いとなり色が変わります。
 * また、クリティカルにすると数字の色が一瞬、赤くなります。
 *
 * また「HPの増減」等のイベント実行時に自動で変化量をポップアップする機能や、
 * ダメージ床を通過した際に自動でポップアップする機能も用意されています。
 * パラメータにより、HPのみや増加のみといった条件指定もできます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~Setting:
 *
 * @param reverse
 * @text 反転
 * @desc ポップアップの回転方向が逆になります。
 * @default false
 * @type boolean
 *
 * @param type
 * @text 種別
 * @desc ポップアップのタイプです。タイプによって文字色が変わります。MISSを選択すると出力内容もMISSになります。
 * @default HP
 * @type select
 * @option HP
 * @option MP
 * @option MISS
 *
 * @param critical
 * @text クリティカル
 * @desc クリティカルフラグです。有効にするとポップアップが赤色にフラッシュします。
 * @default false
 * @type boolean
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'POPUP_DAMAGE', function(args) {
        const character = this.character(args.character);
        if (!character) {
            return;
        }
        const setting = args.setting;
        const value = args.valueVariable ? $gameVariables.value(args.valueVariable) : args.value;
        switch (setting.type) {
            case 'MP':
                character.popupMpDamage(value, setting.critical, setting.reverse);
                break;
            case 'MISS':
                character.popupMiss(setting.reverse);
                break;
            default :
                character.popupDamage(value, setting.critical, setting.reverse);
        }
    });

    PluginManagerEx.registerCommand(script, 'POPUP_FLASH', args => {
        $gameSystem.setPopupDamageFlash(args);
    });

    PluginManagerEx.registerCommand(script, 'POPUP_TONE', args => {
        $gameSystem.setPopupDamageTone(args);
    });

    const _Game_Interpreter_command311      = Game_Interpreter.prototype.command311;
    Game_Interpreter.prototype.command311 = function(params) {
        const value = -this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.popupDamage(value);
        });
        return _Game_Interpreter_command311.apply(this, arguments);
    };

    const _Game_Interpreter_command312      = Game_Interpreter.prototype.command312;
    Game_Interpreter.prototype.command312 = function(params) {
        const value = -this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.popupMpDamage(value);
        });
        return _Game_Interpreter_command312.apply(this, arguments);
    };

    const _Game_Interpreter_command326      = Game_Interpreter.prototype.command326;
    Game_Interpreter.prototype.command326 = function(params) {
        const value = -this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.popupTpDamage(value);
        });
        return _Game_Interpreter_command326.apply(this, arguments);
    };

    //=============================================================================
    // Game_Actor
    //  ダメージ床によるポップアップを処理します。
    //=============================================================================
    const _Game_Actor_executeFloorDamage      = Game_Actor.prototype.executeFloorDamage;
    Game_Actor.prototype.executeFloorDamage = function() {
        this.popupMapDamage(_Game_Actor_executeFloorDamage);
    };

    const _Game_Actor_turnEndOnMap      = Game_Actor.prototype.turnEndOnMap;
    Game_Actor.prototype.turnEndOnMap = function() {
        this.popupMapDamage(_Game_Actor_turnEndOnMap);
    };

    Game_Actor.prototype.popupMapDamage = function(callBackFunc) {
        const prevHp = this.hp;
        const prevMp = this.mp;
        const prevTp = this.tp;
        callBackFunc.apply(this);
        const character = this.getCharacterObject();
        if (!character) return;
        const hpDamage = prevHp - this.hp;
        if (hpDamage !== 0 && $gameSystem.isNeedAutoHpPopup(hpDamage)) character.popupDamage(hpDamage, false);
        const mpDamage = prevMp - this.mp;
        if (mpDamage !== 0 && $gameSystem.isNeedAutoMpPopup(mpDamage)) character.popupMpDamage(mpDamage, false);
        const tpDamage = prevTp - this.tp;
        if (tpDamage !== 0 && $gameSystem.isNeedAutoTpPopup(tpDamage)) character.popupDamage(tpDamage, false);
    };

    Game_Actor.prototype.popupDamage = function(value) {
        const character = this.getCharacterObject();
        if (!character) return;
        if (value !== 0 && $gameSystem.isNeedAutoHpPopup(value)) {
            character.popupDamage(value, false);
        }
    };

    Game_Actor.prototype.popupMpDamage = function(value) {
        const character = this.getCharacterObject();
        if (!character) return;
        if (value !== 0 && $gameSystem.isNeedAutoMpPopup(value)) {
            character.popupMpDamage(value, false);
        }
    };

    Game_Actor.prototype.popupTpDamage = function(value) {
        const character = this.getCharacterObject();
        if (!character) return;
        if (value !== 0 && $gameSystem.isNeedAutoTpPopup(value)) {
            character.popupDamage(value, false);
        }
    };

    Game_Actor.prototype.getCharacterObject = function() {
        const index = $gameParty.battleMembers().indexOf(this);
        switch (index) {
            case -1:
                return null;
            case 0:
                return $gamePlayer;
            default:
                const followers = $gamePlayer.followers();
                return followers.isVisible() ? followers.follower(index - 1) : null;
        }
    };

    //=============================================================================
    // Game_System
    //  オートポップアップの有効フラグを追加定義します。
    //=============================================================================
    const _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._popupDamageTone   = null;
        this._popupDamageFlash  = null;
    };

    Game_System.prototype.isNeedAutoHpPopup = function(value) {
        return param.HpAutoPop && this.isNeedAutoPopup(value);
    };

    Game_System.prototype.isNeedAutoMpPopup = function(value) {
        return param.MpAutoPop && this.isNeedAutoPopup(value);
    };

    Game_System.prototype.isNeedAutoTpPopup = function(value) {
        return param.TpAutoPop && this.isNeedAutoPopup(value);
    };

    Game_System.prototype.isNeedAutoPopup = function(value) {
        return !$gameSwitches.value(param.DisableAutoPop) &&
            ((param.IncreaseAutoPop && value < 0) || (param.DecreaseAutoPop && value > 0));
    };

    Game_System.prototype.getPopupDamageTone = function() {
        return this._popupDamageTone;
    };

    Game_System.prototype.setPopupDamageTone = function(value) {
        this._popupDamageTone = [value.red, value.green, value.blue, value.gray];
    };

    Game_System.prototype.getPopupDamageFlash = function() {
        return this._popupDamageFlash;
    };

    Game_System.prototype.setPopupDamageFlash = function(value) {
        this._popupDamageFlash = [value.red, value.green, value.blue, value.alpha];
    };

    //=============================================================================
    // Game_CharacterBase
    //  ダメージ情報を保持します。
    //=============================================================================
    Game_CharacterBase.prototype.popupDamage = function(value, critical, mirror) {
        this.startDamagePopup(value, critical, false, mirror);
    };

    Game_CharacterBase.prototype.popupMpDamage = function(value, critical, mirror) {
        this.startDamagePopup(value, critical, true, mirror);
    };

    Game_CharacterBase.prototype.popupMiss = function(mirror) {
        this.startDamagePopup(null, false, mirror);
    };

    Game_CharacterBase.prototype.isDamagePopupRequested = function() {
        return this._damagePopup;
    };

    Game_CharacterBase.prototype.clearDamagePopup = function() {
        if (!this._damageInfo || this._damageInfo.length === 0) {
            this._damagePopup = false;
        }
    };

    Game_CharacterBase.prototype.startDamagePopup = function(value, critical, mpFlg, mirror) {
        this._damagePopup = true;
        if (!this._damageInfo) this._damageInfo = [];
        const damageInfo = {value: value, critical: critical, mpFlg: mpFlg, mirror: mirror};
        if (this.isPlayPopupSe()) {
            this.playPopupSe(damageInfo);
        }
        this._damageInfo.push(damageInfo);
    };

    Game_CharacterBase.prototype.playPopupSe = function(damageInfo) {
        if (damageInfo.value === null) {
            SoundManager.playMiss();
        } else if (damageInfo.value < 0) {
            SoundManager.playRecovery();
        } else if (damageInfo.mpFlg && param.MpDamageSe) {
            const se = {
                name: param.MpDamageSe,
                volume: 90,
                pitch: 100,
                pan: 0
            }
            AudioManager.playStaticSe(se);
        } else if (this === $gamePlayer) {
            SoundManager.playActorDamage();
        } else {
            SoundManager.playEnemyDamage();
        }
    };

    Game_CharacterBase.prototype.shiftDamageInfo = function() {
        return this._damageInfo ? this._damageInfo.shift() : null;
    };

    Game_CharacterBase.prototype.isPlayPopupSe = function() {
        return param.PlaySe && !$gameSwitches.value(param.SuppressSwitchId)
    };

    //=============================================================================
    // Sprite_Character
    //  ダメージをポップアップします。
    //=============================================================================
    const _Sprite_Character_update      = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.apply(this, arguments);
        this.updateDamagePopup();
    };

    Sprite_Character.prototype.updateDamagePopup = function() {
        this.setupDamagePopup();
        if (this._damages && this._damages.length > 0) {
            for (let i = 0; i < this._damages.length; i++) {
                this._damages[i].update();
            }
            if (!this._damages[0].isPlaying()) {
                this.getPopupParent().removeChild(this._damages[0]);
                this._damages.shift().destroy();
            }
        }
        if (this._popupFlash) {
            this.updateDamagePopupFlash();
        }
    };

    Sprite_Character.prototype.updateDamagePopupFlash = function() {
        this.setBlendColor(this._popupFlash);
        this._popupFlash[3] -= this._popupFlashSpeed;
        if (this._popupFlash[3] <= 0) {
            this._popupFlash      = null;
            this._popupFlashSpeed = 0;
        }
    };

    Sprite_Character.prototype.setupDamagePopup = function() {
        if (!this._character.isDamagePopupRequested()) return;
        const sprite = new Sprite_CharacterDamage();
        sprite.x   = this.x + this.damageOffsetX();
        sprite.y   = this.y + this.damageOffsetY();
        if (!sprite.z) sprite.z = 9;
        sprite.setupCharacter(this._character);
        if (!this._damages) this._damages = [];
        this._damages.push(sprite);
        this.getPopupParent().addChild(sprite);
        this._character.clearDamagePopup();
        if (!sprite.isMiss() && !sprite.isRecover()) {
            this.setupDamagePopupFlash();
        }
    };

    Sprite_Character.prototype.setupDamagePopupFlash = function() {
        const flashColor = $gameSystem.getPopupDamageFlash();
        if (!flashColor) return;
        this._popupFlash      = flashColor.clone();
        this._popupFlashSpeed = Math.floor(this._popupFlash[3] / 30);
        this.updateDamagePopupFlash();
    };

    Sprite_Character.prototype.damageOffsetX = function() {
        return param.OffsetX;
    };

    Sprite_Character.prototype.damageOffsetY = function() {
        return param.OffsetY;
    };

    Sprite_Character.prototype.getPopupParent = function() {
        return param.OnTop ? this.parent.parent.parent : this.parent;
    };

    //=============================================================================
    // Sprite_CharacterDamage
    //  ダメージ情報を受け取ってセットアップします。
    //=============================================================================
    function Sprite_CharacterDamage() {
        this.initialize.apply(this, arguments);
    }

    Sprite_CharacterDamage.prototype             = Object.create(Sprite_Damage.prototype);
    Sprite_CharacterDamage.prototype.constructor = Sprite_CharacterDamage;

    Sprite_CharacterDamage.prototype.setupCharacter = function(character) {
        const damageInfo   = character.shiftDamageInfo();
        this._toneColor  = $gameSystem.getPopupDamageTone();
        this._mirror     = damageInfo.mirror;
        this._damageInfo = damageInfo;
        this._digit      = 0;
        this.setupColorType();
        if (this.isMiss()) {
            this.createMiss();
            this._degitWidth = this.fontSize() * 3;
        } else {
            this.createDigits(damageInfo.value);
            this._degitWidth = this.fontSize() * 0.75;
        }
        if (damageInfo.critical) {
            this.setupCriticalEffect();
        }
    };

    Sprite_CharacterDamage.prototype.setupColorType = function() {
        if (this.isMiss()) {
            this._colorType = 0;
        }
        const recover = this.isRecover();
        if (this._damageInfo.mpFlg) {
            this._colorType = recover ? 3 : 2;
        } else {
            this._colorType = recover ? 1 : 0;
        }
    };

    Sprite_CharacterDamage.prototype.isMiss = function() {
        return this._damageInfo.value === null;
    };

    Sprite_CharacterDamage.prototype.isRecover = function() {
        return this._damageInfo.value < 0;
    };

    Sprite_CharacterDamage.prototype.createChildSprite = function() {
        const sprite   = Sprite_Damage.prototype.createChildSprite.apply(this, arguments);
        sprite.frame = 0;
        sprite.digit = this._digit++;
        if (this._toneColor) sprite.setColorTone(this._toneColor);
        return sprite;
    };

    Sprite_CharacterDamage.prototype.updateChild = function(sprite) {
        if (param.Rotation) {
            this.updateChildRotation(sprite);
            sprite.setBlendColor(this._flashColor);
        } else {
            Sprite_Damage.prototype.updateChild.apply(this, arguments);
            sprite.x = 0;
        }
        if (param.Scale) {
            this.updateChildScale(sprite);
        }
        sprite.frame++;
    };

    Sprite_CharacterDamage.prototype.updateChildRotation = function(sprite) {
        const frame = sprite.frame;
        const speed = frame / 3600 * param.RotateSpeed;
        sprite.rx = param.RadiusX * (Math.cos(speed) - 1);
        sprite.ry = -param.RadiusY * Math.sin(speed);
        if (this._mirror) {
            sprite.rx *= -1;
        }
        sprite.x = Math.round(sprite.rx);
        sprite.y = Math.round(sprite.ry);
    };

    Sprite_CharacterDamage.prototype.updateChildScale = function(sprite) {
        const frame      = sprite.frame;
        const scale      = (param.Scale + frame * param.ScaleDelta / 10) / 100;
        sprite.scale.x = scale;
        sprite.scale.y = scale;
        sprite.x += (sprite.digit - (this._digit - 1) / 2) * (this._degitWidth * scale);
    };
})();

