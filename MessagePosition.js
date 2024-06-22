//=============================================================================
// MessagePosition.js
// ----------------------------------------------------------------------------
// (C)2017 COBURA, Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2024/06/20 メッセージの表示位置ごとにX座標とY座標を調整する機能を追加
// 1.2.1 2023/11/30 MessageWindowPopup.jsと併用したとき、特定条件下で表示したメッセージが一瞬で消えてしまう問題を修正
// 1.2.0 2023/02/13 名前欄の相対的なXY座標を指定可能に
// 1.1.1 2022/11/20 1.1.0の修正でメッセージの自動ページ送りが機能しなくなっていた問題を修正
// 1.1.0 2022/11/06 MessageWindowPopup.jsと併用できるよう調整
//                  相対座標のデフォルト値をfalseに変更
// 1.0.1 2022/10/02 幅と高さを変えたときにコンテンツが再作成されない問題を修正
//                  ネームウィンドウが見切れることがある問題を修正
// 1.0.0 2022/10/01 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc メッセージの位置調整プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/blob/mz_master/MessagePosition.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderBefore MessageWindowPopup
 * @author COBURA, トリアコンタン
 *
 * @param xTop
 * @text 上のX座標
 * @desc ウィンドウの位置で「上」を選択したときのX座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param yTop
 * @text 上のY座標
 * @desc ウィンドウの位置で「上」を選択したときのY座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param xMiddle
 * @text 中のX座標
 * @desc ウィンドウの位置で「中」を選択したときのX座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param yMiddle
 * @text 中のY座標
 * @desc ウィンドウの位置で「中」を選択したときのY座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param xBottom
 * @text 下のX座標
 * @desc ウィンドウの位置で「下」を選択したときのX座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param yBottom
 * @text 下のY座標
 * @desc ウィンドウの位置で「下」を選択したときのY座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param width
 * @text 横幅
 * @desc 横幅です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param height
 * @text 高さ
 * @desc 高さです。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param relative
 * @text 相対座標
 * @desc 各設定値をデフォルト座標からの相対値とします。
 * @default false
 * @type boolean
 *
 * @param nameX
 * @text 名前欄のx座標
 * @desc 名前欄の相対的なY座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param nameY
 * @text 名前欄のy座標
 * @desc 名前欄の相対的なY座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @help MessagePosition.js
 *
 * ウィンドウの位置を調節できます。
 * 各パラメータには制御文字\v[n]が利用できます。
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
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

	const _Window_Message_initialize = Window_Message.prototype.initialize;
	Window_Message.prototype.initialize = function(rect) {
		_Window_Message_initialize.apply(this, arguments);
		this._originalX = rect.x;
		this._originalWidth = rect.width;
		this._originalHeight = rect.height;
	};

	const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
	Window_Message.prototype.updatePlacement = function() {
		if (this.isPopup && this.isPopup()) {
			_Window_Message_updatePlacement.apply(this, arguments);
			return;
		}
		const width = this.width;
		const height = this.height;
		if (param.width) {
			this.width = (param.relative ? this._originalWidth : 0) + param.width;
		}
		if (param.height) {
			this.height = (param.relative ? this._originalHeight : 0) + param.height;
		}
		if (this.width !== width || this.height !== height) {
			// for MessageWindowPopup.js
			if (this._defaultRect) {
				this._defaultRect.width = this.width;
				this._defaultRect.height = this.height;
			}
			this.createContents();
		}
		_Window_Message_updatePlacement.apply(this, arguments);
		const posXList = [param.xTop, param.xMiddle, param.xBottom];
		const x = posXList[this._positionType];
		if (x !== undefined) {
			this.x = (param.relative ? this._originalX : 0) + x;
		}
		const posYList = [param.yTop, param.yMiddle, param.yBottom];
		const y = posYList[this._positionType];
		if (y !== undefined) {
			this.y = (param.relative ? this.y : 0) + y;
		}
	};

	const _Window_NameBox_updatePlacement = Window_NameBox.prototype.updatePlacement;
	Window_NameBox.prototype.updatePlacement = function() {
		_Window_NameBox_updatePlacement.apply(this, arguments);
		if (this.isPopup && this.isPopup()) {
			return;
		}
		if (this._messageWindow.y < this.height) {
			this.y = this._messageWindow.y + this._messageWindow.height;
		}
		if (param.nameY) {
			this.y += param.nameY;
		}
		if (param.nameX) {
			this.x += param.nameX;
		}
	};
})();
