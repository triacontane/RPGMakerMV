//=============================================================================
// ChangeWindowTouchPolicy.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2016/06/03 モバイルデバイスでウィンドウのカーソルを1回で決定できる機能を追加
// 1.0.0 2015/12/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Change Window Touch Policy
 * @author triacontane
 *
 * @param ActionOutsideFrame
 * @desc ウィンドウの枠外をタッチした場合の動作を選択します。(ok or cancel or off)
 * @default cancel
 *
 * @help ウィンドウをタッチもしくはクリックした場合の挙動を変更します。
 * 1. マウスオーバーで項目にフォーカス
 * 2. フォーカス状態で1回クリックすると項目決定
 * 3. ウィンドウの枠外をクリックした場合の動作(カスタマイズ可能)を追加
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
/*:ja
 * @plugindesc ウィンドウタッチ仕様変更プラグイン
 * @author トリアコンタン
 *
 * @param 枠外タッチ動作
 * @desc ウィンドウの枠外をタッチした場合の動作を選択します。(決定 or キャンセル or なし)
 * @default キャンセル
 *
 * @help ウィンドウをタッチもしくはクリックした場合の挙動を変更します。
 * 1. マウスオーバーで項目にフォーカス
 * 2. フォーカス状態で1回クリックすると項目決定
 * 3. ウィンドウの枠外をクリックした場合の動作(カスタマイズ可能)を追加
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
    var pluginName = 'ChangeWindowTouchPolicy';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
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

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramActionOutsideFrame = getParamString(['ActionOutsideFrame', '枠外タッチ動作']).toLowerCase();

    //=============================================================================
    // Window_Selectable
    //  タッチ周りの仕様を書き換えのため元の処理を上書き
    //=============================================================================
    Window_Selectable.prototype.processTouch = function() {
        if (this.isOpenAndActive()) {
            if ((TouchInput.isMoved() || TouchInput.isTriggered()) && this.isTouchedInsideFrame()) {
                this.onTouch(TouchInput.isTriggered());
            } else if (TouchInput.isCancelled()) {
                if (this.isCancelEnabled()) this.processCancel();
            } else if (TouchInput.isTriggered()) {
                switch (paramActionOutsideFrame) {
                    case '決定':
                    case 'ok':
                        if (this.isOkEnabled()) this.processOk();
                        break;
                    case 'キャンセル':
                    case 'cancel':
                        if (this.isCancelEnabled()) this.processCancel();
                        break;
                    case 'なし':
                    case 'off':
                        break;
                }
            }
        }
    };

    var _Window_Selectable_onTouch      = Window_Selectable.prototype.onTouch;
    Window_Selectable.prototype.onTouch = function(triggered) {
        if (Utils.isMobileDevice() && this.isCursorMovable()) {
            var x        = this.canvasToLocalX(TouchInput.x);
            var y        = this.canvasToLocalY(TouchInput.y);
            var hitIndex = this.hitTest(x, y);
            this.select(hitIndex);
        }
        _Window_Selectable_onTouch.apply(this, arguments);
    };

    //=============================================================================
    // TouchInput
    //  ポインタ移動時にマウス位置の記録を常に行うように元の処理を上書き
    //=============================================================================
    TouchInput._onMouseMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    };
})();

