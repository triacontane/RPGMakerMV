//=============================================================================
// AdjustPictureGraphical.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.3 2015/12/20 ピクチャのボタン化プラグインとの競合を解消
// 1.0.2 2015/11/23 競合防止のため、タッチ関連の処理をSprite_Pictureに定義
// 1.0.1 2015/11/21 ピクチャ番号を出力するよう機能修正
//                  コンソールにログを出す機能を追加
// 1.0.0 2015/11/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Plugin that adjust picture to graphical
 * @author triacontane
 *
 * @help Plugin that adjust picture to graphical.
 * Drag and drop on test screen.
 * this is support plugin. No impact for game.
 * Start for Event Test(Ctrl+R)
 *
 * Caution!
 * When you set status 'on' this plugin at Plugin Manager,
 * you have to save project(Ctrl+S) before test
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ピクチャのグラフィカルな位置調整プラグイン
 * @author トリアコンタン
 * 
 * @help イベントコマンドのテスト時に、ピクチャの表示位置を
 * ドラッグ＆ドロップで微調整できます。
 * 左上のタイトルバーに選択したピクチャの座標が表示されるので
 * テスト画面を表示させつつ、ピクチャの座標を調整してください。
 * なお、イベントコマンドのテスト以外では機能しません。
 * イベントコマンドのテストは、イベントエディタからイベントコマンドを
 * 選択して右クリック→テスト（Ctrl+R）で実行できます。
 *
 * 注意！
 * プラグインマネージャーから当プラグインを有効にしたら、
 * テストを行う前に「プロジェクトの保存」（Ctrl+S）を行ってください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(function () {
    // イベントテストでなければ一切の機能を無効
    if (!DataManager.isEventTest())return;

    //=============================================================================
    // Game_Picture
    //  ピクチャを掴んだ場合に移動を中断します。
    //=============================================================================
    Game_Picture.prototype.resetMove = function(x, y) {
        this._x = x;
        this._y = y;
        this._duration = 0;
    };

    //=============================================================================
    // Scene_Map
    //  テストイベント時の特別な処理
    //=============================================================================
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        if (DataManager.isEventTest() && !$gameMap.isEventRunning()) this._spriteset.checkDragPictures();
        _Scene_Map_update.call(this);
    };

    var _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function() {
        return !DataManager.isEventTest() && _Scene_Map_isMapTouchOk.call(this);
    };

    //=============================================================================
    // Spriteset_Base
    //  配下のピクチャから掴んでいるものを探します。
    //=============================================================================
    Spriteset_Base.prototype.checkDragPictures = function() {
        this._pictureContainer.children.reverse().some(function(picture) {
            return picture.checkDrag();
        }, this);
        this._pictureContainer.children.reverse();
    };

    //=============================================================================
    // Sprite_Picture
    //  テストイベント時にピクチャを掴みます。
    //=============================================================================
    var _Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        _Sprite_Picture_initialize.call(this, pictureId);
        this._holding = false;
        this._dx      = 0;
        this._dy      = 0;
    };

    Sprite_Picture.prototype.checkDrag = function() {
        var picture = this.picture();
        if (DataManager.isEventTest() && picture != null) {
            if (this.updateDragMove()) {
                var result = 'PictureNum:[' + this._pictureId + '] X:[' + this.x + '] Y:[' + this.y + ']';
                document.title = result;
                if (!this._holding) console.log(result);
                picture.resetMove(this.x, this.y);
                return true;
            }
        }
        return false;
    };

    Sprite_Picture.prototype.updateDragMove = function() {
        if (this.isTriggered() || (this._holding && TouchInput.isPressed())) {
            if (!this._holding) this.hold();
            this.move(TouchInput.x - this._dx, TouchInput.y - this._dy);
            return true;
        } else if (this._holding) {
            this.release();
            return true;
        }
        return false;
    };

    Sprite_Picture.prototype.hold = function() {
        this._holding = true;
        this._dx      = TouchInput.x - this.x;
        this._dy      = TouchInput.y - this.y;
        this.setBlendColor([255,255,255,192]);
    };

    Sprite_Picture.prototype.release = function() {
        this._holding = false;
        this.setBlendColor([0,0,0,0]);
    };

    //=============================================================================
    // Sprite_Picture
    //  タッチ操作を可能にする共通部分
    //=============================================================================
    Sprite_Picture.prototype.screenWidth = function() {
        return (this.width || 0) * this.scale.x;
    };

    Sprite_Picture.prototype.screenHeight = function() {
        return (this.height || 0) * this.scale.y;
    };

    Sprite_Picture.prototype.screenX = function() {
        return (this.x || 0) - this.anchor.x * this.screenWidth();
    };

    Sprite_Picture.prototype.screenY = function() {
        return (this.y || 0) - this.anchor.y * this.screenHeight();
    };

    Sprite_Picture.prototype.minX = function() {
        var width = this.screenWidth();
        return Math.min(this.screenX(), this.screenX() + width);
    };

    Sprite_Picture.prototype.minY = function() {
        var height = this.screenHeight();
        return Math.min(this.screenY(), this.screenY() + height);
    };

    Sprite_Picture.prototype.maxX = function() {
        var width = this.screenWidth();
        return Math.max(this.screenX(), this.screenX() + width);
    };

    Sprite_Picture.prototype.maxY = function() {
        var height = this.screenHeight();
        return Math.max(this.screenY(), this.screenY() + height);
    };

    Sprite_Picture.prototype.isTouchPosInRect = function () {
        var tx = TouchInput.x;
        var ty = TouchInput.y;
        return (tx >= this.minX() && tx <= this.maxX() &&
        ty >= this.minY() && ty <= this.maxY());
    };

    Sprite_Picture.prototype.isTouchable = function() {
        return this.bitmap != null && this.visible && this.scale.x !== 0 && this.scale.y !== 0;
    };

    Sprite_Picture.prototype.isTriggered = function() {
        return this.isTouchEvent(TouchInput.isTriggered);
    };

    Sprite_Picture.prototype.isTouchEvent = function(triggerFunc) {
        return this.isTouchable() && triggerFunc.call(TouchInput) && this.isTouchPosInRect();
    };
})();