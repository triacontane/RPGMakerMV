/*=============================================================================
 EscapeCharacterSe.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/09/20 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @plugindesc EscapeCharacterSePlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EscapeCharacterSe.js
 * @base MaterialBase
 * @author triacontane
 *
 * @param volume
 * @desc volume
 * @default 90
 * @type number
 * @max 100
 *
 * @param pitch
 * @desc pitch
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @desc pan
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @help EscapeCharacterSe.js
 *
 * Play a sound effect when the control characters are analyzed.
 * This is useful for messages and battle log displays.
 *
 * \se[id] // Play the sound effect of the identifier id.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc 制御文字の効果音演奏プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EscapeCharacterSe.js
 * @base MaterialBase
 * @author トリアコンタン
 *
 * @param volume
 * @text 音量
 * @desc 効果音の音量(制御文字\v[n]を使う場合はテキストタブから入力)
 * @default 90
 * @type number
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc 効果音のピッチ(制御文字\v[n]を使う場合はテキストタブから入力)
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 位相
 * @desc 効果音の位相(制御文字\v[n]を使う場合はテキストタブから入力)
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @help EscapeCharacterSe.js
 *
 * 制御文字を解析したタイミングで効果音を演奏します。
 * メッセージやバトルログ表示などで有効です。
 * 公式プラグイン『MaterialBase.js』で素材登録しておいて
 * 制御文字から素材の識別子を指定します。
 * 『MaterialBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 * \se[id] // 識別子 id の効果音を演奏します。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        _Window_Base_processEscapeCharacter.apply(this, arguments);
        if (code === 'SE') {
            const seId = this.obtainEscapeParamString(textState);
            if (seId) {
                this.playEscapeAudio(seId);
            }
        }
    };

    Window_Base.prototype.obtainEscapeParamString = function(textState) {
        const arr = /^\[.+?]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[0].substring(1, arr[0].length - 1);
        } else {
            return '';
        }
    };

    Window_Base.prototype.playEscapeAudio = function(seId) {
        AudioManager.playMaterialAudio(seId);
    };

    /**
     * Window_BattleLog
     * バトルログは実装の都合上、同一効果音が複数回演奏されるので
     * clearが呼ばれない限りは同一効果音は一度しか演奏されないようにする。
     */
    const _Window_BattleLog_clear = Window_BattleLog.prototype.clear;
    Window_BattleLog.prototype.clear = function() {
        _Window_BattleLog_clear.apply(this, arguments);
        this._escapeSeList = [];
    };

    const _Window_BattleLog_playEscapeAudio = Window_BattleLog.prototype.playEscapeAudio;
    Window_BattleLog.prototype.playEscapeAudio = function(seId) {
        if (!this._escapeSeList) {
            this._escapeSeList = [];
        }
        if (this._escapeSeList.includes(seId)) {
            return;
        }
        this._escapeSeList.push(seId);
        _Window_BattleLog_playEscapeAudio.apply(this, arguments);
    };

    AudioManager.playMaterialAudio = function(seId) {
        let fileName = $gameSystem.getMaterialAudio(seId);
        if (!fileName) {
            fileName = seId;
        }
        const audio = {
            name: fileName,
            volume: param.volume || 90,
            pitch: param.pitch || 100,
            pan: param.pan || 0
        }
        this.playSe(audio);
    };
})();
