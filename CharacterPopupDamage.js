//=============================================================================
// CharacterPopupDamage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
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
 * @help マップ画面でイベントやプレイヤーに数字をポップアップさせる機能を提供します。
 * マップ上でのダメージや回復の演出に利用できます。演出は戦闘時のものと同一です。
 * 指定する値をマイナスにすると回復扱いとなり色が変わります。
 * また、クリティカルにすると数字の色が一瞬、赤くなります。
 *
 * また「HPの増減」等のイベントコマンド実行時に自動で変化量をポップアップする機能や、
 * ダメージ床を通過した際に自動でポップアップする機能も用意されています。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * ・CPD_DAMAGE or ポップアップダメージ [キャラクターID] [ダメージ値]
 * キャラクターを指定してダメージをポップアップします。
 * キャラクターの指定は以下の通りです。
 * -1   : プレイヤー
 *  0   : 実行中のイベント
 *  1.. : 指定したIDのイベント
 *
 * CPD_DAMAGE 5 -300
 * ポップアップダメージ 0 \v[1]
 *
 * ・CPD_CRITICAL or ポップアップクリティカル
 * キャラクターを指定してダメージをクリティカル扱いでポップアップします。
 *
 * CPD_CRITICAL -1 100
 * ポップアップクリティカル 3 \v[1]
 *
 * ・CPD_MP_DAMAGE or ポップアップMPダメージ
 * キャラクターを指定してMPダメージをポップアップします。
 *
 * CPD_MP_DAMAGE 5 -300
 * ポップアップMPダメージ 0 \v[1]
 *
 * ・CPD_MP_CRITICAL or ポップアップMPクリティカル
 * キャラクターを指定してMPダメージをクリティカル扱いでポップアップします。
 *
 * CPD_MP_CRITICAL -1 100
 * ポップアップMPクリティカル 3 \v[1]
 *
 * ・CPD_MISS or ポップアップミス
 * キャラクターを指定してmissをポップアップします。
 *
 * CPD_MISS -1
 * ポップアップミス 3
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
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'CharacterPopupDamage';

    var getCommandName = function (command) {
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

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
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
    var paramPlaySe  = getParamBoolean(['PlaySe', '効果音演奏']);
    var paramOffsetX = getParamNumber(['OffsetX', 'X座標補正']);
    var paramOffsetY = getParamNumber(['OffsetY', 'Y座標補正']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
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

    Game_Interpreter.prototype.pluginCommandCharacterPopupDamage = function (command, args) {
        switch (getCommandName(command)) {
            case 'CPD_DAMAGE' :
            case 'ポップアップダメージ':
                this.callCharacterPopup(args, Game_CharacterBase.prototype.popupDamage, [getArgNumber(args[1]), false]);
                break;
            case 'CPD_CRITICAL' :
            case 'ポップアップクリティカル':
                this.callCharacterPopup(args, Game_CharacterBase.prototype.popupDamage, [getArgNumber(args[1]), true]);
                break;
            case 'CPD_MP_DAMAGE' :
            case 'ポップアップMPダメージ':
                this.callCharacterPopup(args, Game_CharacterBase.prototype.popupMpDamage, [getArgNumber(args[1]), false]);
                break;
            case 'CPD_MP_CRITICAL' :
            case 'ポップアップMPクリティカル':
                this.callCharacterPopup(args, Game_CharacterBase.prototype.popupMpDamage, [getArgNumber(args[1]), true]);
                break;
            case 'CPD_MISS' :
            case 'ポップアップミス':
                this.callCharacterPopup(args, Game_CharacterBase.prototype.popupMiss, []);
                break;
            case 'CPD_VALID' :
            case 'ポップアップ有効化':
                $gameSystem.setSuppressAutoPopup(false);
                break;
            case 'CPD_INVALID' :
            case 'ポップアップ無効化':
                $gameSystem.setSuppressAutoPopup(true);
                break;
        }
    };

    var _Game_Interpreter_command311 = Game_Interpreter.prototype.command311;
    Game_Interpreter.prototype.command311 = function() {
        if (!$gameSystem.isSuppressAutoPopup()) {
            var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
            $gamePlayer.startDamagePopup(-value, false, false);
        }
        return _Game_Interpreter_command311.apply(this, arguments);
    };

    var _Game_Interpreter_command312 = Game_Interpreter.prototype.command312;
    Game_Interpreter.prototype.command312 = function() {
        if (!$gameSystem.isSuppressAutoPopup()) {
            var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
            $gamePlayer.startDamagePopup(-value, false, true);
        }
        return _Game_Interpreter_command312.apply(this, arguments);
    };

    var _Game_Interpreter_command326 = Game_Interpreter.prototype.command326;
    Game_Interpreter.prototype.command326 = function() {
        if (!$gameSystem.isSuppressAutoPopup()) {
            var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
            $gamePlayer.startDamagePopup(-value, false, false);
        }
        return _Game_Interpreter_command326.apply(this, arguments);
    };

    Game_Interpreter.prototype.callCharacterPopup = function (args, callBackFunc, extend) {
        var character = this.character(getArgNumber(args[0], -1));
        if (character) callBackFunc.apply(character, extend);
    };

    //=============================================================================
    // Game_Actor
    //  ダメージ床によるポップアップを処理します。
    //=============================================================================
    var _Game_Actor_executeFloorDamage = Game_Actor.prototype.executeFloorDamage;
    Game_Actor.prototype.executeFloorDamage = function() {
        var prevHp = this.hp;
        var prevMp = this.mp;
        var prevTp = this.tp;
        _Game_Actor_executeFloorDamage.apply(this, arguments);
        if (!$gameSystem.isSuppressAutoPopup() && this === $gameParty.members()[0]) {
            var hpDamage = prevHp - this.hp;
            if (hpDamage !== 0) $gamePlayer.popupDamage(hpDamage, false);
            var mpDamage = prevMp - this.mp;
            if (mpDamage !== 0) $gamePlayer.popupMpDamage(mpDamage, false);
            var tpDamage = prevTp - this.tp;
            if (tpDamage !== 0) $gamePlayer.popupDamage(tpDamage, false);
        }
    };

    //=============================================================================
    // Game_System
    //  オートポップアップの有効フラグを追加定義します。
    //=============================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this._suppressAutoPopup = false;
    };

    Game_System.prototype.setSuppressAutoPopup = function(value) {
        this._suppressAutoPopup = !!value;
    };

    Game_System.prototype.isSuppressAutoPopup = function() {
        return this._suppressAutoPopup;
    };

    //=============================================================================
    // Game_CharacterBase
    //  ダメージ情報を保持します。
    //=============================================================================
    Game_CharacterBase.prototype.popupDamage = function(value, critical) {
        this.startDamagePopup(value, critical, false);
    };

    Game_CharacterBase.prototype.popupMpDamage = function(value, critical) {
        this.startDamagePopup(value, critical, true);
    };

    Game_CharacterBase.prototype.popupMiss = function() {
        this.startDamagePopup(null, false);
    };

    Game_CharacterBase.prototype.isDamagePopupRequested = function() {
        return this._damagePopup;
    };

    Game_CharacterBase.prototype.clearDamagePopup = function() {
        if (!this._damageInfo || this._damageInfo.length === 0) {
            this._damagePopup = false;
        }
    };

    Game_CharacterBase.prototype.startDamagePopup = function(value, critical, mpFlg) {
        this._damagePopup = true;
        if (!this._damageInfo) this._damageInfo = [];
        var damageInfo = {value:value, critical:critical, mpFlg:mpFlg};
        if (paramPlaySe) this.playPopupSe(damageInfo);
        this._damageInfo.push(damageInfo);
    };

    Game_CharacterBase.prototype.playPopupSe = function(damageInfo) {
        if (damageInfo.value === null) {
            SoundManager.playMiss();
        } else if (damageInfo.value < 0) {
            SoundManager.playRecovery();
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
    var _Sprite_Character_update = Sprite_Character.prototype.update;
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
                this.parent.removeChild(this._damages[0]);
                this._damages.shift();
            }
        }
    };

    Sprite_Character.prototype.setupDamagePopup = function() {
        if (this._character.isDamagePopupRequested()) {
            var sprite = new Sprite_Damage();
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
            sprite.z = 9;
            sprite.setupCharacter(this._character);
            if (!this._damages) this._damages = [];
            this._damages.push(sprite);
            this.parent.addChild(sprite);
            this._character.clearDamagePopup();
        }
    };

    Sprite_Character.prototype.damageOffsetX = function() {
        return paramOffsetX;
    };

    Sprite_Character.prototype.damageOffsetY = function() {
        return paramOffsetY;
    };

    //=============================================================================
    // Sprite_Damage
    //  ダメージ情報を受け取ってセットアップします。
    //=============================================================================
    Sprite_Damage.prototype.setupCharacter = function(character) {
        var damageInfo = character.shiftDamageInfo();
        if (damageInfo.value === null) {
            this.createMissForCharacter();
        } else {
            this.createDigits(damageInfo.mpFlg ? 2 : 0, damageInfo.value);
        }
        if (damageInfo.critical) {
            this.setupCriticalEffect();
        }
    };

    Sprite_Damage.prototype.createMissForCharacter = function() {
        var w = this.digitWidth();
        var h = this.digitHeight();
        var sprite = this.createChildSprite();
        sprite.setFrame(0, 4 * h, 4 * w, h);
        sprite.dy = 0;
        sprite.x = w / 2;
    };
})();

