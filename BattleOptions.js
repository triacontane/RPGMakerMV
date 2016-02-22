//=============================================================================
// BattleOptions.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2016/02/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc バトル画面オプション追加プラグイン
 * @author トリアコンタン
 *
 * @param コマンド名称
 * @desc 追加するコマンドの名称です。
 * @default オプション
 *
 * @help 戦闘画面のパーティコマンドにオプションを追加します。
 * 各種音量の変更やコマンドの記憶等が設定できます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'BattleOptions';

    var getParamString = function(paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var commandName = getParamString(['コマンド名称', 'CommandName']);

    //=============================================================================
    // Scene_Battle
    //  パーティコマンドに選択肢を追加し、オプション画面との相互遷移を考慮します。
    //=============================================================================
    var _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
    Scene_Battle.prototype.createPartyCommandWindow = function() {
        _Scene_Battle_createPartyCommandWindow.call(this);
        this._partyCommandWindow.setHandler('options', function () {
            SceneManager.push(Scene_Options);
        }.bind(this));
        if (SceneManager.isPreviousScene(Scene_Options)) {
            this._partyCommandWindow.openness = 255;
        }
    };

    var _Scene_Battle_createStatusWindow = Scene_Battle.prototype.createStatusWindow;
    Scene_Battle.prototype.createStatusWindow = function() {
        _Scene_Battle_createStatusWindow.apply(this, arguments);
        if (SceneManager.isPreviousScene(Scene_Options)) {
            this._statusWindow.openness = 255;
        }
    };

    var _Scene_Battle_start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function() {
        if (SceneManager.isPreviousScene(Scene_Options)) {
            Scene_Base.prototype.start.call(this);
        } else {
            _Scene_Battle_start.apply(this);
        }
    };

    var _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        if (SceneManager.isNextScene(Scene_Options)) {
            Scene_Base.prototype.terminate.call(this);
        } else {
            _Scene_Battle_terminate.apply(this, arguments);
        }
    };

    var _Scene_Battle_stop = Scene_Battle.prototype.stop;
    Scene_Battle.prototype.stop = function() {
        if (SceneManager.isNextScene(Scene_Options)) {
            Scene_Base.prototype.stop.call(this);
        } else {
            _Scene_Battle_stop.apply(this, arguments);
        }
    };

    //=============================================================================
    // Scene_Options
    //  戦闘画面のスプライトセットを追加定義します。
    //=============================================================================
    var _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.apply(this, arguments);
        if (SceneManager.isPreviousScene(Scene_Battle)) this.createDisplayObjects();
    };

    Scene_Options.prototype.createDisplayObjects = function() {
        this.createSpriteset();
    };

    Scene_Options.prototype.createSpriteset = function() {
        this._spriteset = new Spriteset_Battle();
        this.addChildAt(this._spriteset, 1);
    };

    //=============================================================================
    // Window_PartyCommand
    //  パーティコマンドに選択肢を追加します。
    //=============================================================================
    var _Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
    Window_PartyCommand.prototype.makeCommandList = function() {
        _Window_PartyCommand_makeCommandList.apply(this, arguments);
        this.addCommand(commandName, 'options');
    };
})();

