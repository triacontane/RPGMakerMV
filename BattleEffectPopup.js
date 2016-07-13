//=============================================================================
// BattleEffectPopup.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2016/07/14 アクターと敵キャラの通常ダメージにも専用のフラッシュ色を指定できるようになりました。
// 1.2.3 2016/07/13 1.2.2の修正が不完全だったのを対応
// 1.2.2 2016/07/13 YEP_BattleEngineCore.jsと併用したときに、Missが重複して表示される現象を修正
// 1.2.1 2016/07/12 Z座標を指定しているプラグインとの競合を解消するかもしれない
// 1.2.0 2016/07/10 行動失敗時(Miss!)も任意の文字または画像に置き換えられるようになりました。
// 1.1.0 2016/07/09 ポップアップに任意の画像を指定できるようになりました。
//                  フラッシュするフレーム数を指定できるようになりました。
// 1.0.0 2016/07/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 戦闘行動結果ポップアッププラグイン
 * @author トリアコンタン
 *
 * @param クリティカル
 * @desc クリティカル発生時のポップアップメッセージまたはファイル名です。(img/pictures/)拡張子不要
 * @default CRITICAL!
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param クリティカルカラー
 * @desc クリティカル発生時の文字のフラッシュ色です。R(赤),G(緑),B(青),A(強さ)の順番でカンマ(,)区切りで指定。
 * @default 255,0,0,255
 *
 * @param 回避
 * @desc 回避発生時のポップアップメッセージまたはファイル名です。
 * @default Avoid!
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 回避カラー
 * @desc 回避発生時の文字のフラッシュ色です。
 * @default 0,128,255,255
 *
 * @param ミス
 * @desc ミス発生時のポップアップメッセージまたはファイル名です。通常のMissは表示されなくなります。
 * @default Miss!
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param ミスカラー
 * @desc ミス発生時の文字のフラッシュ色です。
 * @default 0,0,0,0
 *
 * @param 魔法反射
 * @desc 魔法反射時のポップアップメッセージまたはファイル名です。
 * @default Reflection!
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 魔法反射カラー
 * @desc 魔法反射発生時の文字のフラッシュ色です。
 * @default 0,128,255,255
 * 
 * @param 反撃
 * @desc 反撃時のポップアップメッセージまたはファイル名です。
 * @default Counter!
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 反撃カラー
 * @desc 反撃発生時の文字のフラッシュ色です。
 * @default 0,128,255,255
 * 
 * @param 弱点
 * @desc 弱点時のポップアップメッセージまたはファイル名です。
 * @default Weakness!
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 弱点カラー
 * @desc 弱点発生時の文字のフラッシュ色です。
 * @default 0,255,128,255
 * 
 * @param 耐性
 * @desc 弱点時のポップアップメッセージまたはファイル名です。
 * @default Resistance!
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 * @param 耐性カラー
 * @desc 耐性発生時の文字のフラッシュ色です。
 * @default 0,0,128,255
 *
 * @param 味方ダメージカラー
 * @desc アクターダメージのフラッシュ色です。
 * @default 0,0,0,0
 *
 * @param 敵ダメージカラー
 * @desc 敵キャラダメージのフラッシュ色です。
 * @default 0,0,0,0
 *
 * @param フォントサイズ
 * @desc ポップアップのフォントサイズです。
 * @default 42
 *
 * @param メッセージ最大幅
 * @desc ポップアップメッセージの最大幅です。
 * @default 240
 *
 * @param フラッシュ時間
 * @desc フラッシュカラーがフェードアウトするまでのフレーム数です。
 * @default 60
 *
 * @param X座標補正
 * @desc X座標の補正値です。
 * @default 0
 *
 * @param Y座標補正
 * @desc Y座標の補正値です。
 * @default -40
 *
 * @param 画像使用
 * @desc 各種ポップアップに任意のピクチャ(img/pictures)を使用します。メッセージの代わりにファイル名を入力してください。
 * @default OFF
 *
 * @noteParam BEPメッセージ
 * @noteRequire 1
 * @noteDir img/pictures/
 * @noteType file
 * @noteData items
 *
 * @help 戦闘中に行動の結果のメッセージをポップアップします。
 * ポップアップするのは動的に作成した文字列もしくは用意したピクチャです。
 * 表示条件は以下の通りです。
 *
 * ・失敗（通常のMissは表示されなくなります）
 * ・回避（通常のMissは表示されなくなります）
 * ・クリティカル
 * ・反撃
 * ・魔法反射
 * ・弱点（ダメージ倍率が1.0を上回った場合）
 * ・耐性（ダメージ倍率が1.0を下回った場合）
 * ・ステート付与（ステートごとに設定できます）
 * ・コモンイベント（プラグインコマンドから実行します）
 *
 * また、ポップアップ時にフラッシュカラーを指定することができます。
 * フラッシュカラーの指定は「赤」「緑」「青」「強さ」の順番で
 * カンマ区切りで指定してください。
 *
 * ステート付与時にメッセージをポップアップをしたい場合
 * ステートのメモ欄に以下の通り指定してください。
 * <BEPメッセージ:state>       # 付加時にメッセージ「state」が表示されます。
 *                             # 画像使用が有効な場合はファイル名を指定します。
 * <BEPカラー:255,255,255,255> # 付加時のフラッシュカラーを指定します。
 *
 * さらに、プラグインコマンドから任意の文字列を自由にポップアップできます。
 * このコマンドはバトルイベントのみ使用可能です。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * BEP対象者ポップアップ message 255,0,0,255 # 行動の対象者にmessageがポップ。
 * BEP_TARGET_POPUP message 255,0,0,255      # 上と同じ
 *
 * BEP使用者ポップアップ message 255,0,0,255 # 行動の使用者にmessageがポップ。
 * BEP_USER_POPUP message 255,0,0,255        # 上と同じ
 *
 * ※画像使用が有効な場合はファイル名を指定します。
 *
 * 競合に関する情報
 * 当プラグインは以下のプラグインより下に配置してください。
 *
 * YEP_BattleEngineCore.js
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'BattleEffectPopup';
    var metaTagPrefix = 'BEP';

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
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

    var getParamArrayString = function(paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getParamArrayNumber = function(paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) {
            if (!isNaN(parseInt(values[i], 10))) {
                values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
            } else {
                values.splice(i--, 1);
            }
        }
        return values;
    };

    var getArgString = function(arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getArgArrayNumber = function(args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var getArgArrayString = function(args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function(object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramCritical         = getParamString(['Critical', 'クリティカル']);
    var paramCriticalColor    = getParamArrayNumber(['CriticalColor', 'クリティカルカラー'], 0, 256);
    var paramAvoid            = getParamString(['Avoid', '回避']);
    var paramAvoidColor       = getParamArrayNumber(['AvoidColor', '回避カラー'], 0, 256);
    var paramMiss             = getParamString(['Miss', 'ミス']);
    var paramMissColor        = getParamArrayNumber(['MissColor', 'ミスカラー'], 0, 256);
    var paramReflection       = getParamString(['Reflection', '魔法反射']);
    var paramReflectionColor  = getParamArrayNumber(['ReflectionColor', '魔法反射カラー'], 0, 256);
    var paramCounter          = getParamString(['Counter', '反撃']);
    var paramCounterColor     = getParamArrayNumber(['CounterColor', '反撃カラー'], 0, 256);
    var paramWeakness         = getParamString(['Weakness', '弱点']);
    var paramWeaknessColor    = getParamArrayNumber(['WeaknessColor', '弱点カラー'], 0, 256);
    var paramResistance       = getParamString(['Resistance', '耐性']);
    var paramResistanceColor  = getParamArrayNumber(['ResistanceColor', '耐性カラー'], 0, 256);
    var paramActorDamageColor = getParamArrayNumber(['ActorDamageColor', '味方ダメージカラー'], 0, 256);
    var paramEnemyDamageColor = getParamArrayNumber(['EnemyDamageColor', '敵ダメージカラー'], 0, 256);
    var paramFontSize         = getParamNumber(['FontSize', 'フォントサイズ'], 16, 128);
    var paramMaxWidth         = getParamNumber(['MaxWidth', 'メッセージ最大幅'], 1);
    var paramFlashDuration    = getParamNumber(['FlashDuration', 'フラッシュ時間'], 1);
    var paramOffsetX          = getParamNumber(['OffsetX', 'X座標補正']);
    var paramOffsetY          = getParamNumber(['OffsetY', 'Y座標補正']);
    var paramUsingPicture     = getParamBoolean(['UsingPicture', '画像使用']);

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (!command.match(new RegExp('^' + metaTagPrefix))) return;
        try {
            this.pluginCommandBattleEffectPopup(command.replace(metaTagPrefix, ''), args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(window.screenX + window.outerWidth, window.screenY + window.outerHeight);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.stack || e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandBattleEffectPopup = function(command, args) {
        switch (getCommandName(command)) {
            case '使用者ポップアップ' :
            case '_USER_POPUP':
                BattleManager._subject.startMessagePopup(getArgString(args[0]), getArgArrayNumber(args[1], 0, 256));
                break;
            case '対象者ポップアップ' :
            case '_TARGET_POPUP':
                var action = BattleManager._action;
                var unit   = action.isForOpponent() ? action.opponentsUnit() : action.friendsUnit();
                var index  = BattleManager._subject._lastTargetIndex;
                var target = unit.members()[index];
                target.startMessagePopup(getArgString(args[0]), getArgArrayNumber(args[1], 0, 256));
                break;
        }
    };

    //=============================================================================
    // Game_Action
    //  弱点によってポップアップを設定します。
    //=============================================================================
    var _Game_Action_calcElementRate      = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function(target) {
        var result = _Game_Action_calcElementRate.apply(this, arguments);
        if (result > 1.0) {
            target.appointMessagePopup(paramWeakness, paramWeaknessColor);
        } else if (result < 1.0) {
            target.appointMessagePopup(paramResistance, paramResistanceColor);
        }
        return result;
    };

    //=============================================================================
    // Game_Battler
    //  ポップアップメッセージのリクエストに応答します。
    //=============================================================================
    Game_Battler.prototype.clearMessagePopup = function() {
        this._messagePopup = false;
    };

    Game_Battler.prototype.isMessagePopupRequested = function() {
        return this._messagePopup;
    };

    Game_Battler.prototype.startMessagePopup = function(message, flashColor) {
        if (message) {
            this._messagePopup = true;
            this._message      = message;
            this._flashColor   = flashColor;
        }
    };

    Game_Battler.prototype.startAppointMessagePopup = function() {
        this.startMessagePopup(this._appointMessage, this._appointFlashColor);
        this._appointMessage    = '';
        this._appointFlashColor = null;
    };

    Game_Battler.prototype.appointMessagePopup = function(message, flashColor) {
        this._appointMessage    = message;
        this._appointFlashColor = flashColor;
    };

    Game_Battler.prototype.getMessagePopupText = function() {
        return this._message;
    };

    Game_Battler.prototype.getMessagePopupFlashColor = function() {
        return this._flashColor;
    };

    //=============================================================================
    // Window_BattleLog
    //  ポップアップメッセージをリクエストします。
    //=============================================================================
    Window_BattleLog.prototype.popupMessage = function(target, message, flashColor) {
        target.startMessagePopup(message, flashColor);
    };

    var _Window_BattleLog_displayDamage      = Window_BattleLog.prototype.displayDamage;
    Window_BattleLog.prototype.displayDamage = function(target) {
        _Window_BattleLog_displayDamage.apply(this, arguments);
        target.startAppointMessagePopup();
    };

    var _Window_BattleLog_displayCritical      = Window_BattleLog.prototype.displayCritical;
    Window_BattleLog.prototype.displayCritical = function(target) {
        _Window_BattleLog_displayCritical.apply(this, arguments);
        if (target.result().critical) {
            this.pushPopupMessage(target, paramCritical, paramCriticalColor);
        }
    };

    var _Window_BattleLog_displayMiss      = Window_BattleLog.prototype.displayMiss;
    Window_BattleLog.prototype.displayMiss = function(target) {
        _Window_BattleLog_displayMiss.apply(this, arguments);
        this.pushPopupMessage(target, paramMiss, paramMissColor);
    };

    var _Window_BattleLog_displayEvasion      = Window_BattleLog.prototype.displayEvasion;
    Window_BattleLog.prototype.displayEvasion = function(target) {
        _Window_BattleLog_displayEvasion.apply(this, arguments);
        this.pushPopupMessage(target, paramAvoid, paramAvoidColor);
    };

    var _Window_BattleLog_displayCounter      = Window_BattleLog.prototype.displayCounter;
    Window_BattleLog.prototype.displayCounter = function(target) {
        _Window_BattleLog_displayCounter.apply(this, arguments);
        this.pushPopupMessage(target, paramCounter, paramCounterColor);
    };

    var _Window_BattleLog_displayReflection      = Window_BattleLog.prototype.displayReflection;
    Window_BattleLog.prototype.displayReflection = function(target) {
        _Window_BattleLog_displayReflection.apply(this, arguments);
        this.pushPopupMessage(target, paramReflection, paramReflectionColor);
    };

    var _Window_BattleLog_displayAddedStates      = Window_BattleLog.prototype.displayAddedStates;
    Window_BattleLog.prototype.displayAddedStates = function(target) {
        _Window_BattleLog_displayAddedStates.apply(this, arguments);
        target.result().addedStateObjects().forEach(function(state) {
            var message = getMetaValues(state, ['Message', 'メッセージ']);
            if (message) {
                var flash = getMetaValues(state, ['FlashColor', 'カラー']);
                if (flash) flash = getArgArrayNumber(flash, 0, 256);
                this.pushPopupMessage(target, getArgString(message), flash);
            }
        }, this);
    };

    Window_BattleLog.prototype.pushPopupMessage = function(target, message, flashColor) {
        this.push('popupMessage', target, message, flashColor);
    };

    //=============================================================================
    // Sprite_Battler
    //  ポップアップメッセージを作成します。
    //=============================================================================
    var _Sprite_Battler_updateDamagePopup      = Sprite_Battler.prototype.updateDamagePopup;
    Sprite_Battler.prototype.updateDamagePopup = function() {
        this.setupMessagePopup();
        _Sprite_Battler_updateDamagePopup.apply(this, arguments);
    };

    Sprite_Battler.prototype.setupMessagePopup = function() {
        if (this._battler.isMessagePopupRequested()) {
            if (this._battler.isSpriteVisible()) {
                var sprite = new Sprite_PopupMessage();
                sprite.x   = this.x + this.messageOffsetX();
                sprite.y   = this.y + this.messageOffsetY();
                sprite.setup(this._battler);
                if (this.z > 0) sprite.z = this.z + 10;
                if (this._mainSprite && this._mainSprite.z > 0) sprite.z = this._mainSprite.z + 10;
                this._damages.push(sprite);
                this.parent.addChild(sprite);
            }
            this._battler.clearMessagePopup();
        }
    };

    Sprite_Battler.prototype.messageOffsetX = function() {
        return paramOffsetX;
    };

    Sprite_Battler.prototype.messageOffsetY = function() {
        return paramOffsetY;
    };

    //=============================================================================
    // Sprite_Damage
    //  回避メッセージが有効な場合のミス表示を抑制します。
    //=============================================================================
    var _Sprite_Damage_setup      = Sprite_Damage.prototype.setup;
    Sprite_Damage.prototype.setup = function(target) {
        var result = target.shiftDamagePopup ? target.shiftDamagePopup() : target.result();
        if ((!result.evaded || !paramAvoid) && (!result.missed || !paramMiss)) {
            if (target.shiftDamagePopup) {
                target._damagePopup.unshift(result);
            }
            _Sprite_Damage_setup.apply(this, arguments);
        }
        if (!result.missed && !result.evaded && result.hpAffected) {
            var color = target instanceof Game_Actor ? paramActorDamageColor : paramEnemyDamageColor;
            if (color && color.length > 0) this.setupFlashEffect(color);
        }
    };

    Sprite_Damage.prototype.setupFlashEffect = function(flashColor, duration) {
        this._flashColor    = flashColor.clone();
        this._flashDuration = duration || paramFlashDuration;
    };

    //=============================================================================
    // Sprite_PopupMessage
    //  ポップアップメッセージを表示するスプライトです。
    //=============================================================================
    function Sprite_PopupMessage() {
        this.initialize.apply(this, arguments);
    }

    Sprite_PopupMessage.prototype             = Object.create(Sprite_Damage.prototype);
    Sprite_PopupMessage.prototype.constructor = Sprite_PopupMessage;

    Sprite_PopupMessage.prototype.setup = function(target) {
        var text       = target.getMessagePopupText();
        var bitmap     = paramUsingPicture ? this.setupStaticText(text) : this.setupDynamicText(text);
        var sprite     = this.createChildSprite();
        sprite.bitmap  = bitmap;
        sprite.dy      = 0;
        var flashColor = target.getMessagePopupFlashColor();
        if (flashColor) {
            this.setupFlashEffect(flashColor);
        }
    };

    Sprite_PopupMessage.prototype.setupDynamicText = function(text) {
        var bitmap      = new Bitmap(paramMaxWidth, paramFontSize + 8);
        bitmap.fontSize = paramFontSize;
        bitmap.drawText(text, 0, 0, bitmap.width, bitmap.height, 'center');
        return bitmap;
    };

    Sprite_PopupMessage.prototype.setupStaticText = function(textPicture) {
        return ImageManager.loadPicture(textPicture, 0);
    };
})();

