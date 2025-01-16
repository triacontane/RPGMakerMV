//=============================================================================
// MessagePosition.js
// ----------------------------------------------------------------------------
// (C)2017 COBURA, Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.4 2025/01/16 フキダシウィンドウと併用したときフキダシを無効にして文章を表示した直後に選択肢の表示を行うと文章が消えてしまう問題を修正
// 1.1.3 2023/02/06 MZから移植した際に不要なコードが混じっていたので削除
// 1.1.2 2022/11/20 1.1.1の修正でメッセージの自動ページ送りが機能しなくなっていた問題を修正
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

	var _Window_Message_initialize = Window_Message.prototype.initialize;
	Window_Message.prototype.initialize = function() {
		_Window_Message_initialize.apply(this, arguments);
		this._originalWidth = this.windowWidth();
		this._originalHeight = this.windowHeight();
		this._originalX = (Graphics.boxWidth - this._originalWidth) / 2;
	};

	var _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
	Window_Message.prototype.updatePlacement = function() {
		if (this.isPopup && this.isPopup()) {
			_Window_Message_updatePlacement.apply(this, arguments);
			return;
		}
		if (param.x) {
			this.x = (param.relative ? this._originalX : 0) + param.x;
		}
		const width = this.width;
		const height = this.height;
		if (param.width) {
			this.width =　this.windowWidth();
		}
		if (param.height) {
			this.height = this.windowHeight();
		}
		if (this.width !== width || this.height !== height) {
			this.createContents();
		}
		_Window_Message_updatePlacement.apply(this, arguments);
		const posit = [param.yTop, param.yMiddle, param.yBottom];
		if (posit[this._positionType]) {
			this.y = (param.relative ? this.y : 0) + posit[this._positionType];
		}
	};

	var _Window_Message_windowWidth = Window_Message.prototype.windowWidth;
	Window_Message.prototype.windowWidth = function() {
		if (this._originalWidth) {
			return (param.relative ? this._originalWidth : 0) + param.width;
		} else {
			return _Window_Message_windowWidth.apply(this, arguments);
		}
	};

	var _Window_Message_windowHeight = Window_Message.prototype.windowHeight;
	Window_Message.prototype.windowHeight = function() {
		if (this._originalHeight) {
			return (param.relative ? this._originalHeight : 0) + param.height;
		} else {
			return _Window_Message_windowHeight.apply(this, arguments);
		}
	};
})();
