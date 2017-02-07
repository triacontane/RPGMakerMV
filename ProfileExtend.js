//=============================================================================
// ProfileExtend.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2017/02/07 端末依存の記述を削除
// 1.1.0 2017/01/13 プロフィールを途中で変更できるプラグインコマンドを追加
// 1.0.0 2016/05/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc プロフィール拡張プラグイン
 * @author トリアコンタン
 *
 * @param 拡張行数
 * @desc プロフィール入力欄を拡張する行数です。
 * @default 0
 *
 * @help ステータス画面のプロフィール入力欄を拡張します。
 * 通常だとステータスと装備品表示欄と被ってしまうので注意してください。
 *
 * また、データベースのプロフィール入力欄には2行までしか入力できないので
 * アクターのメモ欄に以下の通り入力してください。
 *
 * <PE拡張:テスト> //「テスト」が3行目に表示されます。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * ・ID[1]のアクターの拡張プロフィールをゲーム途中で変更します。
 * PE_拡張プロフィール設定 1 プロフィール内容
 * PE_SET_EXTEND_PROFILE 1 プロフィール内容
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'ProfileExtend';
    var metaTagPrefix = 'PE';

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

    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var getMetaValue = function(object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var convertEscapeCharacters = function(text) {
        if (text == null) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var convertAllArguments = function(args) {
        for (var i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramExtendLine = getParamNumber(['ExtendLine', '拡張行数'], 0);

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    var pluginCommandMap = new Map();
    setPluginCommand('_拡張プロフィール設定', 'setExtendProfile');
    setPluginCommand('_SET_EXTEND_PROFILE', 'setExtendProfile');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand    = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertAllArguments(args));
        }
    };

    Game_Interpreter.prototype.setExtendProfile = function(args) {
        var actor = $gameActors.actor(getArgNumber(args[0], 1));
        if (actor) actor.setExtendProfile(args[1]);
    };
    
    //=============================================================================
    // Game_Actor
    //  プロフィールの内容を拡張します。
    //=============================================================================
    var _Game_Actor_profile = Game_Actor.prototype.profile;
    Game_Actor.prototype.profile = function() {
        var profile = _Game_Actor_profile.apply(this, arguments);
        var extend = this.getExtendProfile();
        return profile + (extend ? '\n' + extend : '');
    };
    
    Game_Actor.prototype.getExtendProfile = function() {
        if (!this._extendProfile) {
            this._extendProfile = getMetaValue(this.actor(), '拡張');
        }
        return this._extendProfile;
    };

    Game_Actor.prototype.setExtendProfile = function(value) {
        this._extendProfile = value;
    };

    //=============================================================================
    // Window_Status
    //  プロフィールの入力欄を拡張します。
    //=============================================================================
    var _Window_Status_drawHorzLine = Window_Status.prototype.drawHorzLine;
    Window_Status.prototype.drawHorzLine = function(y) {
        if (this.lineHeight() * 13 === y) {
            arguments[0] -= this.lineHeight() * paramExtendLine;
        }
        _Window_Status_drawHorzLine.apply(this, arguments);
    };

    var _Window_Status_drawBlock4 = Window_Status.prototype.drawBlock4;
    Window_Status.prototype.drawBlock4 = function(y) {
        arguments[0] -= this.lineHeight() * paramExtendLine;
        _Window_Status_drawBlock4.apply(this, arguments);
    };
})();

