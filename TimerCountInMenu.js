//=============================================================================
// TimerCountInMenu.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2024/07/14 MZで動作するようリファクタリング
// 1.0.1 2017/08/04 画面キャプチャにタイマー画像が含まれないよう修正
// 1.0.0 2017/08/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc メニュー画面でのタイマーカウントプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/TimerCountInMenu.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param behaviorInMenu
 * @text メニュー画面で動作
 * @desc メニュー画面およびその先の画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @param behaviorInNameInput
 * @text 名前入力画面で動作
 * @desc 名前入力画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @param behaviorInShop
 * @text ショップ画面で動作
 * @desc ショップ画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @param behaviorInSave
 * @text セーブ画面で動作
 * @desc セーブ画面でタイマーを動作させます。
 * @default true
 * @type boolean
 *
 * @param expireToMap
 * @text 時間切れでマップ移動
 * @desc 時間切れになった場合、強制的にマップ画面に移動します。
 * @default true
 * @type boolean
 *
 * @help TimerCountInMenu.js
 *
 * メニュー画面やショップ画面でタイマーのカウントが進むようになります。
 * パラメータで画面ごとに動作有無を指定できます。
 * 時間切れでマップ画面に移動することもできます。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(()=> {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

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
    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        this._spriteset.setTimerOpacity(0);
        _Scene_Map_terminate.apply(this, arguments);
        this._spriteset.setTimerOpacity(255);
    };

    //=============================================================================
    // Scene_MenuBase
    //  タイマーをカウントするシーンの場合はタイマーを作成してカウントを進めます。
    //=============================================================================
    const _Scene_MenuBase_create = Scene_MenuBase.prototype.create;
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

    const _Scene_MenuBase_update = Scene_MenuBase.prototype.update;
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
    const _Scene_Title_start = Scene_Title.prototype.start;
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
    const _Game_Timer_onExpire = Game_Timer.prototype.onExpire;
    Game_Timer.prototype.onExpire = function() {
        _Game_Timer_onExpire.apply(this, arguments);
        if (SceneManager.isCountTimerScene() && !$gameParty.inBattle() && param.expireToMap) {
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

