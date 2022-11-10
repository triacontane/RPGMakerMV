//=============================================================================
// ZeroDamageSound.js
// ----------------------------------------------------------------------------
// (C)2022 COBURA, Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2022/11/07 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ノーダメージ効果音プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/ZeroDamageSound.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author COBURA, トリアコンタン
 *
 *
 * @param name
 * @text SE
 * @desc 変更する効果音のファイル名です。
 * @default
 * @type file
 * @dir audio/se
 *
 * @param volume
 * @text 音量
 * @desc 変更する効果音の音量です。
 * @default 90
 * @type number
 * @max 100
 * 
 * @param pitch
 * @text ピッチ
 * @desc 変更する効果音のピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 * 
 * @param pan
 * @text 位相
 * @desc 変更する効果音の位相（定位）です。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 *
 * @help ZeroDamageSound.js
 *
 * ダメージが0の時効果音を鳴らします。
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

	const _Game_Action_executeDamage = Game_Action.prototype.executeDamage;
	Game_Action.prototype.executeDamage = function(target, value) {
		_Game_Action_executeDamage.apply(this, arguments);
		
		if (value === 0) {
			AudioManager.playSe({"name":param.name, "volume":param.volume, "pitch":param.pitch, "pan":param.pan});
		}
	};
})();