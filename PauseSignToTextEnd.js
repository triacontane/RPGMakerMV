//=============================================================================
// PauseSignToTextEnd.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.4.0 2022/01/31 MZで動作するよう修正
// 1.3.1 2019/06/11 競合する可能性のある記述を修正
// 1.3.0 2019/05/26 MessageWindowPopup.jsと完全に組み合わせて使用できるよう修正
// 1.2.1 2018/06/03 MessageWindowPopup.jsとの併用時、プラグインの定義順次第でポーズサインの表示が正常に行われない場合がある問題を修正
// 1.2.0 2017/06/24 有効、無効を切り替えるスイッチを追加
// 1.1.0 2017/04/23 ポーズサインを非表示にできるスイッチを追加
// 1.0.0 2017/01/16 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ポーズサインの末尾表示プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/PauseSignToTextEnd.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param validateSwitchId
 * @text 有効スイッチ番号
 * @type switch
 * @desc 指定したスイッチがONのときポーズサインが末尾に表示されます。0の場合は常に末尾に表示されます。
 * @default 0
 *
 * @param invisibleSwitchId
 * @text 非表示スイッチ番号
 * @type switch
 * @desc 指定したスイッチがONのときポーズサインが表示されなくなります。
 * @default 0
 *
 * @help メッセージウィンドウのポーズサインが
 * テキストの末尾に表示されるようになります。
 *
 * ただし、フキダシウィンドウプラグインが有効になっている場合は
 * そちらを優先します。
 *
 * このプラグインにはプラグインコマンドはありません。
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
    // Window_Message
    //  ポーズサインの位置を変更します。
    //=============================================================================
    const _Window_Message_startPause = Window_Message.prototype.startPause;
    Window_Message.prototype.startPause = function() {
        _Window_Message_startPause.apply(this, arguments);
        if (this.isValidPauseSignTextEnd()) {
            this.setPauseSignToTextEnd();
        } else {
            this._refreshPauseSign();
        }
    };

    Window_Message.prototype.isValidPauseSignTextEnd = function() {
        return !param.validateSwitchId || $gameSwitches.value(param.validateSwitchId);
    };

    Window_Message.prototype.isVisiblePauseSign = function() {
        return !$gameSwitches.value(param.invisibleSwitchId);
    };

    Window_Message.prototype.setPauseSignToTextEnd = function() {
        const textState = this._textState;
        let x = this.padding + textState.x;
        let y = this.padding + textState.y + textState.height;
        this._pauseSignSprite.anchor.x = 0;
        this._pauseSignSprite.anchor.y = 1;
        // 絶対座標に小数点以下の端数が出ると表示がおかしくなるので調整
        x -= this.x - Math.floor(this.x);
        this._pauseSignSprite.move(x, y);
    };

    const _Window_Message__updatePauseSign = Window_Message.prototype.hasOwnProperty('_updatePauseSign') ?
        Window_Message.prototype._updatePauseSign : null;
    Window_Message.prototype._updatePauseSign = function() {
        if (_Window_Message__updatePauseSign) {
            _Window_Message__updatePauseSign.apply(this, arguments);
        } else {
            Window_Base.prototype._updatePauseSign.apply(this, arguments);
        }
        // for WindowMessagePopup.js
        if (!this.isPopup || !this.isPopup()) {
            this._pauseSignSprite.visible = this.isVisiblePauseSign();
        }
    };
})();
