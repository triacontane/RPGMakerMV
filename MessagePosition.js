//=============================================================================
// MessagePosition.js
// ----------------------------------------------------------------------------
// (C)2017 COBURA, Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2022/11/09 MV向けに作成
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
 * @author COBURA, トリアコンタン
 *
 * @param x
 * @text X座標
 * @desc X座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param yTop
 * @text 上のY座標
 * @desc 上のY座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param yMiddle
 * @text 中のY座標
 * @desc 中のY座標です。
 * @default 0
 * @type number
 * @min -2000
 *
 * @param yBottom
 * @text 下のY座標
 * @desc 下のY座標です。
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
 * @help MessagePosition.js
 *
 * ウィンドウの位置を調節できます。
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
	var createPluginParameter = function(pluginName) {
		var paramReplacer = function(key, value) {
			if (value === 'null') {
				return value;
			}
			if (value[0] === '"' && value[value.length - 1] === '"') {
				return value;
			}
			try {
				return JSON.parse(value);
			} catch (e) {
				return value;
			}
		};
		var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
		PluginManager.setParameters(pluginName, parameter);
		return parameter;
	};

	var param = createPluginParameter('MessagePosition');

	const _Window_Message_initialize = Window_Message.prototype.initialize;
	Window_Message.prototype.initialize = function(rect) {
		_Window_Message_initialize.apply(this, arguments);
		this._originalWidth = this.windowWidth();
		this._originalHeight = this.windowHeight();
		this._originalX = (Graphics.boxWidth - this._originalWidth) / 2;
		// メッセージ系プラグインとの競合回避のためコンテンツサイズは最大サイズで作成
		this.contents = new Bitmap(Graphics.width, Graphics.height);
		this.contentsBack = new Bitmap(Graphics.width, Graphics.height);
	};

	const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
	Window_Message.prototype.updatePlacement = function() {
		if (this.isPopup && this.isPopup()) {
			_Window_Message_updatePlacement.apply(this, arguments);
			return;
		}
		if (param.x) {
			this.x = (param.relative ? this._originalX : 0) + param.x;
		}
		if (param.width) {
			this.width = (param.relative ? this._originalWidth : 0) + param.width;
		}
		if (param.height) {
			this.height = (param.relative ? this._originalHeight : 0) + param.height;
		}
		_Window_Message_updatePlacement.apply(this, arguments);
		const posit = [param.yTop, param.yMiddle, param.yBottom];
		this.y = (param.relative ? this.y : 0) + posit[this._positionType];
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
	};
})();
