//=============================================================================
// TimerCountInMenu.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/08/04 画面キャプチャにタイマー画像が含まれないよう修正
// 1.0.0 2017/08/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc TimerCountInMenuPlugin
 * @author triacontane
 *
 * @param BehaviorInMenu
 * @desc メニュー画面およびその先の画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @param BehaviorInNameInput
 * @desc 名前入力画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @param BehaviorInShop
 * @desc ショップ画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @param BehaviorInSave
 * @desc セーブ画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @help メニュー画面などでもタイマーのカウントが進むようになります。
 * パラメータで画面ごとに動作有無を指定できます。
 * カウントが0になると強制的にマップ画面に戻されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メニュー画面でのタイマーカウントプラグイン
 * @author トリアコンタン
 *
 * @param メニュー画面で動作
 * @desc メニュー画面およびその先の画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @param 名前入力画面で動作
 * @desc 名前入力画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @param ショップ画面で動作
 * @desc ショップ画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @param セーブ画面で動作
 * @desc セーブ画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @help メニュー画面などでもタイマーのカウントが進むようになります。
 * パラメータで画面ごとに動作有無を指定できます。
 * カウントが0になると強制的にマップ画面に戻されます。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var pluginName    = 'TimerCountInMenu';

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

    var getParamBoolean = function(paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'TRUE';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param                 = {};
    param.behaviorInMenu      = getParamBoolean(['BehaviorInMenu', 'メニュー画面で動作']);
    param.behaviorInNameInput = getParamBoolean(['BehaviorInNameInput', '名前入力画面で動作']);
    param.behaviorInShop      = getParamBoolean(['BehaviorInShop', 'ショップ画面で動作']);
    param.behaviorInSave      = getParamBoolean(['BehaviorInSave', 'セーブ画面で動作']);

    //=============================================================================
    // Scene_Base
    //  タイマーをカウントするシーンかどうかを判定します。
    //=============================================================================
    Scene_Base.prototype.isCountTimer = function() {
        return false;
    };

    Scene_MenuBase.prototype.isCountTimer = function() {
        return param.behaviorInMenu;
    };

    Scene_Name.prototype.isCountTimer = function() {
        return param.behaviorInNameInput;
    };

    Scene_Shop.prototype.isCountTimer = function() {
        return param.behaviorInShop;
    };

    Scene_File.prototype.isCountTimer = function() {
        return param.behaviorInSave;
    };

    //=============================================================================
    // Scene_Map
    //  キャプチャ作成時にタイマーを描画対象から外します。
    //=============================================================================
    var _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        this._spriteset.setTimerOpacity(0);
        _Scene_Map_terminate.apply(this, arguments);
        this._spriteset.setTimerOpacity(255);
    };

    //=============================================================================
    // Scene_MenuBase
    //  タイマーをカウントするシーンの場合はタイマーを作成してカウントを進めます。
    //=============================================================================
    var _Scene_MenuBase_create = Scene_MenuBase.prototype.create;
    Scene_MenuBase.prototype.create = function() {
        _Scene_MenuBase_create.apply(this, arguments);
        if (this.isCountTimer()) {
            this.createTimer();
        }
    };

    Scene_MenuBase.prototype.createTimer = function() {
        this._timerSprite = new Sprite_Timer();
        this.addChild(this._timerSprite);
    };

    var _Scene_MenuBase_update = Scene_MenuBase.prototype.update;
    Scene_MenuBase.prototype.update = function() {
        _Scene_MenuBase_update.apply(this, arguments);
        this.updateTimer();
    };

    Scene_MenuBase.prototype.updateTimer = function() {
        if (this.isCountTimer() && $gameTimer) {
            $gameTimer.update(this.isActive());
        }
    };

    //=============================================================================
    // Scene_Title
    //  タイトル画面を表示するときにタイマーを初期化します。
    //=============================================================================
    var _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.apply(this, arguments);
        if ($gameTimer) {
            $gameTimer.initialize();
        }
    };

    //=============================================================================
    // Spriteset_Base
    //  タイマースプライトの可視状態を設定します。
    //=============================================================================
    Spriteset_Base.prototype.setTimerOpacity = function(opacity) {
        this._timerSprite.opacity = opacity;
    };

    //=============================================================================
    // Game_Timer
    //  タイマーが0になったときに強制的にマップ画面に移動します。
    //=============================================================================
    var _Game_Timer_onExpire = Game_Timer.prototype.onExpire;
    Game_Timer.prototype.onExpire = function() {
        _Game_Timer_onExpire.apply(this, arguments);
        if (SceneManager.isCountTimerScene() && !$gameParty.inBattle()) {
            SoundManager.playCancel();
            SceneManager.goto(Scene_Map);
        }
    };

    //=============================================================================
    // SceneManager
    //  タイマーをカウントするシーンかどうかを判定します。
    //=============================================================================
    SceneManager.isCountTimerScene = function() {
        return this._scene.isCountTimer();
    };
})();

