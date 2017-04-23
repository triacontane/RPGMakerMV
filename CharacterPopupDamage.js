//=============================================================================
// CharacterPopupDamage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc キャラクターのダメージポッププラグイン
 * @author トリアコンタン
 *
 * @param 効果音演奏
 * @desc 状況に応じたシステム効果音を自動演奏します。(ON/OFF)
 * @default ON
 *
 * @param X座標補正
 * @desc ポップアップ位置のX座標を補正します。
 * @default 0
 *
 * @param Y座標補正
 * @desc ポップアップ位置のY座標を補正します。
 * @default 0
 *
 * @param HP自動ポップアップ
 * @desc HPの増減を自動ポップアップの対象にします。(ON/OFF)
 * @default ON
 *
 * @param MP自動ポップアップ
 * @desc MPの増減を自動ポップアップの対象にします。(ON/OFF)
 * @default ON
 *
 * @param TP自動ポップアップ
 * @desc TPの増減を自動ポップアップの対象にします。(ON/OFF)
 * @default ON
 *
 * @param 増加自動ポップアップ
 * @desc パラメータの増加を自動ポップアップの対象にします。(ON/OFF)
 * @default ON
 *
 * @param 減少自動ポップアップ
 * @desc パラメータの減少を自動ポップアップの対象にします。(ON/OFF)
 * @default ON
 *
 * @param MPダメージ音
 * @desc MPダメージ時の効果音ファイル名を別途指定(audio/se)します。何も指定しないとHPと同じになります。
 * @default
 *
 * @param 回転
 * @desc 数字の回転運動を有効にします。
 * @default ON
 *
 * @param X方向半径
 * @desc 数字を回転させる場合のX方向の半径です。
 * @default 40
 *
 * @param Y方向半径
 * @desc 数字を回転させる場合のY方向の半径です。
 * @default 40
 *
 * @param 回転速度
 * @desc 数字を回転させる場合の速度です。
 * @default 60
 *
 * @param 拡大率
 * @desc 初期状態の拡大率です。
 * @default 100
 *
 * @param 拡大率変化値
 * @desc 1フレームごとの拡大率の変化値です。
 * @default -10
 *
 * @param 最前面表示
 * @desc ポップアップをピクチャより前面に表示します。
 * @default OFF
 *
 * @help マップ画面でイベントやプレイヤーに数字をポップアップさせる機能を提供します。
 * マップ上でのダメージや回復の演出に利用できます。演出は戦闘時のものと同一です。
 * 指定する値をマイナスにすると回復扱いとなり色が変わります。
 * また、クリティカルにすると数字の色が一瞬、赤くなります。
 *
 * また「HPの増減」等のイベント実行時に自動で変化量をポップアップする機能や、
 * ダメージ床を通過した際に自動でポップアップする機能も用意されています。
 * パラメータにより、HPのみや増加のみといった条件指定もできます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * ・CPD_DAMAGE or ポップアップダメージ [キャラクターID] [ダメージ値] [反転]
 * キャラクターを指定してダメージをポップアップします。
 * キャラクターの指定は以下の通りです。
 * -1   : プレイヤー
 *  0   : 実行中のイベント
 *  1.. : 指定したIDのイベント
 *
 * 反転を有効にすると、ポップアップの回転方向が逆になります。
 * （パラメータの「回転」を有効にしている場合）
 *
 * CPD_DAMAGE 5 -300 ON
 * ポップアップダメージ 0 \v[1] OFF
 *
 * ・CPD_CRITICAL or ポップアップクリティカル
 * キャラクターを指定してダメージをクリティカル扱いでポップアップします。
 *
 * CPD_CRITICAL -1 100 ON
 * ポップアップクリティカル 3 \v[1] OFF
 *
 * ・CPD_MP_DAMAGE or ポップアップMPダメージ
 * キャラクターを指定してMPダメージをポップアップします。
 *
 * CPD_MP_DAMAGE 5 -300 ON
 * ポップアップMPダメージ 0 \v[1] OFF
 *
 * ・CPD_MP_CRITICAL or ポップアップMPクリティカル
 * キャラクターを指定してMPダメージをクリティカル扱いでポップアップします。
 *
 * CPD_MP_CRITICAL -1 100 ON
 * ポップアップMPクリティカル 3 \v[1] OFF
 *
 * ・CPD_MISS or ポップアップミス
 * キャラクターを指定してmissをポップアップします。
 *
 * CPD_MISS -1 ON
 * ポップアップミス 3 OFF
 *
 * ・CPD_INVALID or ポップアップ無効化
 * 自動ポップアップを無効にします。
 * 有効になっているとイベントコマンド「HPの増減」「MPの増減」「TPの増減」
 * およびダメージ床によるダメージが自動でポップアップします。
 * 初期状態では有効です。
 *
 * ・CPD_VALID or ポップアップ有効化
 * 自動ポップアップを再度有効にします。
 *
 * ・CPD_SETTING_TONE or ポップアップ設定_色調 [赤] [緑] [青] [グレー]
 * ポップアップ画像の色調を変更できます。色調の設定値を順番に指定してください。
 *
 * CPD_SETTING_TONE 255 0 0 255
 * ポップアップ設定_色調 -255 -255 -255 0
 *
 * ・CPD_SETTING_FLASH or ポップアップ設定_フラッシュ [赤] [緑] [青] [強さ]
 * ポップアップ時にキャラクターをフラッシュします。
 * フラッシュするのはダメージを受けた場合のみです。
 *
 * CPD_SETTING_FLASH 255 0 0 255
 * ポップアップ設定_フラッシュ 255 0 0 255
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName = 'CharacterPopupDamage';
    var settings   = {
        /* MPダメージ専用効果音(ファイル名はパラメータで指定) */
        mpDamageSe: {
            volume: 90,
            pitch : 100,
            pan   : 0
        }
    };

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    var getArgBoolean = function(arg) {
        return (arg || '').toUpperCase() === 'ON';
    };

    var convertEscapeCharactersAndEval = function(text, evalFlg) {
        if (text === null || text === undefined) text = '';
        var window = SceneManager._scene._windowLayer.children[0];
        if (window) {
            var result = window.convertEscapeCharacters(text);
            return evalFlg ? eval(result) : result;
        } else {
            return text;
        }
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramPlaySe          = getParamBoolean(['PlaySe', '効果音演奏']);
    var paramOffsetX         = getParamNumber(['OffsetX', 'X座標補正']);
    var paramOffsetY         = getParamNumber(['OffsetY', 'Y座標補正']);
    var paramTpAutoPop       = getParamBoolean(['TPAutoPop', 'TP自動ポップアップ']);
    var paramMpAutoPop       = getParamBoolean(['MPAutoPop', 'MP自動ポップアップ']);
    var paramHpAutoPop       = getParamBoolean(['HPAutoPop', 'HP自動ポップアップ']);
    var paramIncreaseAutoPop = getParamBoolean(['IncreaseAutoPop', '増加自動ポップアップ']);
    var paramDecreaseAutoPop = getParamBoolean(['DecreaseAutoPop', '減少自動ポップアップ']);
    var paramMpDamageSe      = getParamString(['MPDamageSe', 'MPダメージ音']);
    var paramRotation        = getParamBoolean(['Rotation', '回転']);
    var paramRadiusX         = getParamNumber(['RadiusX', 'X方向半径']);
    var paramRadiusY         = getParamNumber(['RadiusY', 'Y方向半径']);
    var paramRotateSpeed     = getParamNumber(['RotateSpeed', '回転速度']);
    var paramScale           = getParamNumber(['Scale', '拡大率']);
    var paramScaleDelta      = getParamNumber(['ScaleDelta', '拡大率変化値']);
    var paramOnTop           = getParamBoolean(['OnTop', '最前面表示']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandCharacterPopupDamage(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandCharacterPopupDamage = function(command, args) {
        var popupArgs = [];
        switch (getCommandName(command)) {
            case 'CPD_DAMAGE' :
            case 'ポップアップダメージ':
                popupArgs = [getArgNumber(args[1]), false, getArgBoolean(args[2])];
                this.callCharacterPopup(args, 'popupDamage', popupArgs);
                break;
            case 'CPD_CRITICAL' :
            case 'ポップアップクリティカル':
                popupArgs = [getArgNumber(args[1]), true, getArgBoolean(args[2])];
                this.callCharacterPopup(args, 'popupDamage', popupArgs);
                break;
            case 'CPD_MP_DAMAGE' :
            case 'ポップアップMPダメージ':
                popupArgs = [getArgNumber(args[1]), false, getArgBoolean(args[2])];
                this.callCharacterPopup(args, 'popupMpDamage', popupArgs);
                break;
            case 'CPD_MP_CRITICAL' :
            case 'ポップアップMPクリティカル':
                popupArgs = [getArgNumber(args[1]), true, getArgBoolean(args[2])];
                this.callCharacterPopup(args, 'popupMpDamage', popupArgs);
                break;
            case 'CPD_MISS' :
            case 'ポップアップミス':
                popupArgs = [getArgBoolean(args[1])];
                this.callCharacterPopup(args, 'popupMiss', popupArgs);
                break;
            case 'CPD_VALID' :
            case 'ポップアップ有効化':
                $gameSystem.setSuppressAutoPopup(false);
                break;
            case 'CPD_INVALID' :
            case 'ポップアップ無効化':
                $gameSystem.setSuppressAutoPopup(true);
                break;
            case 'CPD_SETTING_TONE' :
            case 'ポップアップ設定_色調':
                var red   = getArgNumber(args[0]);
                var green = getArgNumber(args[1]);
                var blue  = getArgNumber(args[2]);
                var gray  = getArgNumber(args[3]);
                $gameSystem.setPopupDamageTone([red, green, blue, gray]);
                break;
            case 'CPD_SETTING_FLASH' :
            case 'ポップアップ設定_フラッシュ':
                var flashRed   = getArgNumber(args[0], 0);
                var flashGreen = getArgNumber(args[1], 0);
                var flashBlue  = getArgNumber(args[2], 0);
                var alpha      = getArgNumber(args[3], 0) || 255;
                $gameSystem.setPopupDamageFlash([flashRed, flashGreen, flashBlue, alpha]);
                break;
        }
    };

    var _Game_Interpreter_command311      = Game_Interpreter.prototype.command311;
    Game_Interpreter.prototype.command311 = function() {
        var value = -this.operateValue(this._params[2], this._params[3], this._params[4]);
        this.iterateActorEx(this._params[0], this._params[1], function(actor) {
            actor.popupDamage(value);
        }.bind(this));
        return _Game_Interpreter_command311.apply(this, arguments);
    };

    var _Game_Interpreter_command312      = Game_Interpreter.prototype.command312;
    Game_Interpreter.prototype.command312 = function() {
        var value = -this.operateValue(this._params[2], this._params[3], this._params[4]);
        this.iterateActorEx(this._params[0], this._params[1], function(actor) {
            actor.popupMpDamage(value);
        }.bind(this));
        return _Game_Interpreter_command312.apply(this, arguments);
    };

    var _Game_Interpreter_command326      = Game_Interpreter.prototype.command326;
    Game_Interpreter.prototype.command326 = function() {
        var value = -this.operateValue(this._params[2], this._params[3], this._params[4]);
        this.iterateActorEx(this._params[0], this._params[1], function(actor) {
            actor.popupTpDamage(value);
        }.bind(this));
        return _Game_Interpreter_command326.apply(this, arguments);
    };

    Game_Interpreter.prototype.callCharacterPopup = function(args, methodName, extend) {
        var character = this.character(getArgNumber(args[0], -1));
        if (character) character[methodName].apply(character, extend);
    };

    //=============================================================================
    // Game_Actor
    //  ダメージ床によるポップアップを処理します。
    //=============================================================================
    var _Game_Actor_executeFloorDamage      = Game_Actor.prototype.executeFloorDamage;
    Game_Actor.prototype.executeFloorDamage = function() {
        this.popupMapDamage(_Game_Actor_executeFloorDamage);
    };

    var _Game_Actor_turnEndOnMap      = Game_Actor.prototype.turnEndOnMap;
    Game_Actor.prototype.turnEndOnMap = function() {
        this.popupMapDamage(_Game_Actor_turnEndOnMap);
    };

    Game_Actor.prototype.popupMapDamage = function(callBackFunc) {
        var prevHp = this.hp;
        var prevMp = this.mp;
        var prevTp = this.tp;
        callBackFunc.apply(this);
        var character = this.getCharacterObject();
        if (!character) return;
        var hpDamage = prevHp - this.hp;
        if (hpDamage !== 0 && $gameSystem.isNeedAutoHpPopup(hpDamage)) character.popupDamage(hpDamage, false);
        var mpDamage = prevMp - this.mp;
        if (mpDamage !== 0 && $gameSystem.isNeedAutoMpPopup(mpDamage)) character.popupMpDamage(mpDamage, false);
        var tpDamage = prevTp - this.tp;
        if (tpDamage !== 0 && $gameSystem.isNeedAutoTpPopup(tpDamage)) character.popupDamage(tpDamage, false);
    };

    Game_Actor.prototype.popupDamage = function(value) {
        var character = this.getCharacterObject();
        if (!character) return;
        if (value !== 0 && $gameSystem.isNeedAutoHpPopup(value)) {
            character.popupDamage(value, false);
        }
    };

    Game_Actor.prototype.popupMpDamage = function(value) {
        var character = this.getCharacterObject();
        if (!character) return;
        if (value !== 0 && $gameSystem.isNeedAutoMpPopup(value)) {
            character.popupMpDamage(value, false);
        }
    };

    Game_Actor.prototype.popupTpDamage = function(value) {
        var character = this.getCharacterObject();
        if (!character) return;
        if (value !== 0 && $gameSystem.isNeedAutoTpPopup(value)) {
            character.popupDamage(value, false);
        }
    };

    Game_Actor.prototype.getCharacterObject = function() {
        var index = $gameParty.battleMembers().indexOf(this);
        var result;
        switch (index) {
            case -1:
                result = null;
                break;
            case 0:
                result = $gamePlayer;
                break;
            default:
                var followers = $gamePlayer.followers();
                result        = followers.isVisible() ? followers.follower(index - 1) : null;
        }
        return result;
    };

    //=============================================================================
    // Game_System
    //  オートポップアップの有効フラグを追加定義します。
    //=============================================================================
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._suppressAutoPopup = false;
        this._popupDamageTone   = null;
        this._popupDamageFlash  = null;
    };

    Game_System.prototype.setSuppressAutoPopup = function(value) {
        this._suppressAutoPopup = !!value;
    };

    Game_System.prototype.isSuppressAutoPopup = function() {
        return this._suppressAutoPopup;
    };

    Game_System.prototype.isNeedAutoHpPopup = function(value) {
        return paramHpAutoPop && this.isNeedAutoPopup(value);
    };

    Game_System.prototype.isNeedAutoMpPopup = function(value) {
        return paramMpAutoPop && this.isNeedAutoPopup(value);
    };

    Game_System.prototype.isNeedAutoTpPopup = function(value) {
        return paramTpAutoPop && this.isNeedAutoPopup(value);
    };

    Game_System.prototype.isNeedAutoPopup = function(value) {
        return !$gameSystem.isSuppressAutoPopup() &&
            ((paramIncreaseAutoPop && value < 0) || (paramDecreaseAutoPop && value > 0));
    };

    Game_System.prototype.getPopupDamageTone = function() {
        return this._popupDamageTone;
    };

    Game_System.prototype.setPopupDamageTone = function(value) {
        this._popupDamageTone = value;
    };

    Game_System.prototype.getPopupDamageFlash = function() {
        return this._popupDamageFlash;
    };

    Game_System.prototype.setPopupDamageFlash = function(value) {
        this._popupDamageFlash = value;
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
        var damageInfo = {value: value, critical: critical, mpFlg: mpFlg, mirror: mirror};
        if (paramPlaySe) this.playPopupSe(damageInfo);
        this._damageInfo.push(damageInfo);
    };

    Game_CharacterBase.prototype.playPopupSe = function(damageInfo) {
        if (damageInfo.value === null) {
            SoundManager.playMiss();
        } else if (damageInfo.value < 0) {
            SoundManager.playRecovery();
        } else if (damageInfo.mpFlg && paramMpDamageSe) {
            settings.mpDamageSe.name = paramMpDamageSe;
            AudioManager.playStaticSe(settings.mpDamageSe);
        } else if (this === $gamePlayer) {
            SoundManager.playActorDamage();
        } else {
            SoundManager.playEnemyDamage();
        }
    };

    Game_CharacterBase.prototype.shiftDamageInfo = function() {
        return this._damageInfo ? this._damageInfo.shift() : null;
    };

    //=============================================================================
    // Sprite_Character
    //  ダメージをポップアップします。
    //=============================================================================
    var _Sprite_Character_update      = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.apply(this, arguments);
        this.updateDamagePopup();
    };

    Sprite_Character.prototype.updateDamagePopup = function() {
        this.setupDamagePopup();
        if (this._damages && this._damages.length > 0) {
            for (var i = 0; i < this._damages.length; i++) {
                this._damages[i].update();
            }
            if (!this._damages[0].isPlaying()) {
                this.getPopupParent().removeChild(this._damages[0]);
                this._damages.shift();
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
        var sprite = new Sprite_CharacterDamage();
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
        var flashColor = $gameSystem.getPopupDamageFlash();
        if (!flashColor) return;
        this._popupFlash      = flashColor.clone();
        this._popupFlashSpeed = Math.floor(this._popupFlash[3] / 30);
        this.updateDamagePopupFlash();
    };

    Sprite_Character.prototype.damageOffsetX = function() {
        return paramOffsetX;
    };

    Sprite_Character.prototype.damageOffsetY = function() {
        return paramOffsetY;
    };

    Sprite_Character.prototype.getPopupParent = function() {
        return paramOnTop ? this.parent.parent.parent : this.parent;
    };

    //=============================================================================
    // Sprite_CharacterDamage
    //  ダメージ情報を受け取ってセットアップします。
    //=============================================================================
    function Sprite_CharacterDamage() {
        this.initialize.apply(this, arguments);
    }

    Sprite_CharacterDamage.prototype           = Object.create(Sprite_Damage.prototype);
    Sprite_CharacterDamage.prototype.varructor = Sprite_CharacterDamage;

    Sprite_CharacterDamage.prototype.setupCharacter = function(character) {
        var damageInfo  = character.shiftDamageInfo();
        this._toneColor = $gameSystem.getPopupDamageTone();
        this._mirror    = damageInfo.mirror;
        this._damageInfo = damageInfo;
        this._digit     = 0;
        if (this.isMiss()) {
            this.createMissForCharacter();
        } else {
            this.createDigits(damageInfo.mpFlg ? 2 : 0, damageInfo.value);
        }
        if (damageInfo.critical) {
            this.setupCriticalEffect();
        }
    };

    Sprite_CharacterDamage.prototype.isMiss = function() {
        return this._damageInfo.value === null || this._damageInfo.value === 0;
    };

    Sprite_CharacterDamage.prototype.isRecover = function() {
        return this._damageInfo.value < 0;
    };

    Sprite_CharacterDamage.prototype.createMissForCharacter = function() {
        var w      = this.digitWidth();
        var h      = this.digitHeight();
        var sprite = this.createChildSprite();
        sprite.setFrame(0, 4 * h, 4 * w, h);
        sprite.dy = 0;
        sprite.x  = w / 2;
        sprite.digit++;
        this._digit++;
    };

    Sprite_CharacterDamage.prototype.createChildSprite = function() {
        var sprite   = Sprite_Damage.prototype.createChildSprite.apply(this, arguments);
        sprite.frame = 0;
        sprite.digit = this._digit++;
        if (this._toneColor) sprite.setColorTone(this._toneColor);
        return sprite;
    };

    Sprite_CharacterDamage.prototype.updateChild = function(sprite) {
        if (paramRotation) {
            this.updateChildRotation(sprite);
            sprite.setBlendColor(this._flashColor);
        } else {
            Sprite_Damage.prototype.updateChild.apply(this, arguments);
            sprite.x = 0;
        }
        if (paramScale) {
            this.updateChildScale(sprite);
        }
        sprite.frame++;
    };

    Sprite_CharacterDamage.prototype.updateChildRotation = function(sprite) {
        var frame = sprite.frame;
        var speed = frame / 3600 * paramRotateSpeed;
        sprite.rx = paramRadiusX * (Math.cos(speed) - 1);
        sprite.ry = -paramRadiusY * Math.sin(speed);
        if (this._mirror) {
            sprite.rx *= -1;
        }
        sprite.x = Math.round(sprite.rx);
        sprite.y = Math.round(sprite.ry);
    };

    Sprite_CharacterDamage.prototype.updateChildScale = function(sprite) {
        var frame      = sprite.frame;
        var scale      = (paramScale + frame * paramScaleDelta / 10) / 100;
        sprite.scale.x = scale;
        sprite.scale.y = scale;
        sprite.x += (sprite.digit - (this._digit - 1) / 2) * (this.digitWidth() * scale);
    };
})();

