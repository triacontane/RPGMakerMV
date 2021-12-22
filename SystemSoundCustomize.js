//=============================================================================
// SystemSoundCustomize.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2021/12/22 MZで動作するよう修正
// 1.0.0 2017/05/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc システム効果音変更プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/SystemSoundCustomize.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @command CHANGE_SYSTEM_SE
 * @text システム効果音変更
 * @desc システム効果音を指定したファイルに変更します。
 *
 * @arg type
 * @text 効果音タイプ
 * @desc 変更する効果音のタイプです。
 * @default 0
 * @type select
 * @option  0:カーソル
 * @value 0
 * @option  1:決定
 * @value 1
 * @option  2:キャンセル
 * @value 2
 * @option  3:ブザー
 * @value 3
 * @option  4:装備
 * @value 4
 * @option  5:セーブ
 * @value 5
 * @option  6:ロード
 * @value 6
 * @option  7:戦闘開始
 * @value 7
 * @option  8:逃走
 * @value 8
 * @option  9:敵攻撃
 * @value 9
 * @option 10:敵ダメージ
 * @value 10
 * @option 11:敵消滅
 * @value 11
 * @option 12:ボス消滅1
 * @value 12
 * @option 13:ボス消滅2
 * @value 13
 * @option 14:味方ダメージ
 * @value 14
 * @option 15:味方戦闘不能
 * @value 15
 * @option 16:回復
 * @value 16
 * @option 17:ミス
 * @value 17
 * @option 18:回避
 * @value 18
 * @option 19:魔法回避
 * @value 19
 * @option 20:魔法反射
 * @value 20
 * @option 21:ショップ
 * @value 21
 * @option 22:アイテム使用
 * @value 22
 * @option 23:スキル使用
 * @value 23
 *
 * @arg name
 * @text ファイル
 * @desc 変更する効果音のファイル名です。空を指定するとデフォルトSEに戻ります。
 * @default
 * @type file
 * @dir audio/se
 * 
 * @arg volume
 * @text 音量
 * @desc 変更する効果音の音量です。
 * @default 90
 * @type number
 * @max 100
 * 
 * @arg pitch
 * @text ピッチ
 * @desc 変更する効果音のピッチです。
 * @default 100
 * @type number
 * @min 50
 * @max 150
 * 
 * @arg pan
 * @text 位相
 * @desc 変更する効果音の位相（定位）です。
 * @default 0
 * @type number
 * @min -100
 * @max 100
 *
 * @help SystemSoundCustomize.js
 *
 * システム効果音をゲーム中に変更できます。
 * プラグインコマンドからタイプと効果音情報を指定します。
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

    PluginManagerEx.registerCommand(script, 'CHANGE_SYSTEM_SE', args => {
        if (args.name) {
            $gameSystem.setSystemSound(args.type, args);
        } else {
            $gameSystem.resetSystemSound(args.type);
        }
    });

    //=============================================================================
    // Game_System
    //  カスタムシステム効果音を保持します。
    //=============================================================================
    const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        this.initSystemSound(false);
        this._systemSounds.filter(sound => !!sound)
            .forEach(sound => AudioManager.loadStaticSe(sound));
    };

    Game_System.prototype.initSystemSound = function() {
        if (!this._systemSounds) {
            this._systemSounds = [];
        }
    };

    Game_System.prototype.setSystemSound = function(typeIndex, systemSound) {
        this.initSystemSound();
        this._systemSounds[typeIndex] = systemSound;
        AudioManager.loadStaticSe(systemSound);
    };

    Game_System.prototype.resetSystemSound = function(typeIndex) {
        this.initSystemSound();
        delete this._systemSounds[typeIndex];
    };

    Game_System.prototype.getSystemSound = function(typeIndex) {
        return this._systemSounds && this._systemSounds[typeIndex] ? this._systemSounds[typeIndex] : null;
    };

    //=============================================================================
    // SoundManager
    //  カスタムシステム効果音を演奏します。
    //=============================================================================
    const _SoundManager_playSystemSound = SoundManager.playSystemSound;
    SoundManager.playSystemSound = function(n) {
        const customSound = $gameSystem.getSystemSound(n);
        if (customSound) {
            AudioManager.playStaticSe(customSound);
        } else {
            _SoundManager_playSystemSound.apply(this, arguments);
        }
    };
})();

