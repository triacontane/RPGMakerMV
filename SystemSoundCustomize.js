//=============================================================================
// SystemSoundCustomize.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/05/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc SystemSoundCustomizePlugin
 * @author triacontane
 *
 * @help システム効果音をゲーム中に動的に変更します。
 * 変更したシステム効果音はセーブデータごとに有効になります。
 *
 * 変更はプラグインコマンドから行います。最初の引数にシステム効果音ごとの
 * タイプインデックス（後述）を指定してください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SSC_CHANGE_SYSTEM_SE 0 seName 90 100 0   # カーソルSEをseNameに変更
 * SSC_システム効果音変更 0 seName 90 100 0 # 同上
 * SSC_RESET_SYSTEM_SE 1                    # 決定SEをデフォルトに戻す
 * SSC_システム効果音削除 1                 # 同上
 * ※音量、ピッチ、位相を省略した場合は通常のデフォルト値が適用されます。
 *
 * タイプインデックス一覧
 *  0:カーソル
 *  1:決定
 *  2:キャンセル
 *  3:ブザー
 *  4:装備
 *  5:セーブ
 *  6:ロード
 *  7:戦闘開始
 *  8:逃走
 *  9:敵攻撃
 * 10:敵ダメージ
 * 11:敵消滅
 * 12:ボス消滅1
 * 13:ボス消滅2
 * 14:味方ダメージ
 * 15:味方戦闘不能
 * 16:回復
 * 17:ミス
 * 18:回避
 * 19:魔法回避
 * 20:魔法反射
 * 21:ショップ
 * 22:アイテム使用
 * 23:スキル使用
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc システム効果音変更プラグイン
 * @author トリアコンタン
 *
 * @help システム効果音をゲーム中に動的に変更します。
 * 変更したシステム効果音はセーブデータごとに有効になります。
 *
 * 変更はプラグインコマンドから行います。最初の引数にシステム効果音ごとの
 * タイプインデックス（後述）を指定してください。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （パラメータの間は半角スペースで区切る）
 *
 * SSC_CHANGE_SYSTEM_SE 0 seName 90 100 0   # カーソルSEをseNameに変更
 * SSC_システム効果音変更 0 seName 90 100 0 # 同上
 * SSC_RESET_SYSTEM_SE 1                    # 決定SEをデフォルトに戻す
 * SSC_システム効果音削除 1                 # 同上
 * ※音量、ピッチ、位相を省略した場合は通常のデフォルト値が適用されます。
 *
 * タイプインデックス一覧
 *  0:カーソル
 *  1:決定
 *  2:キャンセル
 *  3:ブザー
 *  4:装備
 *  5:セーブ
 *  6:ロード
 *  7:戦闘開始
 *  8:逃走
 *  9:敵攻撃
 * 10:敵ダメージ
 * 11:敵消滅
 * 12:ボス消滅1
 * 13:ボス消滅2
 * 14:味方ダメージ
 * 15:味方戦闘不能
 * 16:回復
 * 17:ミス
 * 18:回避
 * 19:魔法回避
 * 20:魔法反射
 * 21:ショップ
 * 22:アイテム使用
 * 23:スキル使用
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    'use strict';
    var metaTagPrefix = 'SSC_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getArgNumber = function(arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function(text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function(args) {
        return String(args) !== args;
    };

    var convertAllArguments = function(args) {
        for (var i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    var setPluginCommand = function(commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var pluginCommandMap = new Map();
    setPluginCommand('CHANGE_SYSTEM_SE', 'execChangeSystemSe');
    setPluginCommand('システム効果音変更', 'execChangeSystemSe');
    setPluginCommand('RESET_SYSTEM_SE', 'execResetSystemSe');
    setPluginCommand('システム効果音削除', 'execResetSystemSe');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertAllArguments(args));
        }
    };

    Game_Interpreter.prototype.execChangeSystemSe = function(args) {
        var typeIndex = getArgNumber(args.shift());
        $gameSystem.setSystemSound(typeIndex, args);
    };

    Game_Interpreter.prototype.execResetSystemSe = function(args) {
        $gameSystem.resetSystemSound(getArgNumber(args[0]));
    };

    //=============================================================================
    // Game_System
    //  カスタムシステム効果音を保持します。
    //=============================================================================
    var _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.apply(this, arguments);
        this.initSystemSound(false);
        this._systemSounds.forEach(function(sound) {
            if (sound) AudioManager.loadStaticSe(sound);
        })
    };

    Game_System.prototype.initSystemSound = function() {
        if (!this._systemSounds) {
            this._systemSounds = [];
        }
    };

    Game_System.prototype.setSystemSound = function(typeIndex, systemSoundArgs) {
        this.initSystemSound();
        var systemSound = {
            name  : systemSoundArgs[0] || '',
            volume: getArgNumber(systemSoundArgs[1] || 90, 0, 100),
            pitch : getArgNumber(systemSoundArgs[2] || 100, 50, 150),
            pan   : getArgNumber(systemSoundArgs[3] || 0, -100, 100)
        };
        this._systemSounds[typeIndex] = systemSound;
        AudioManager.loadStaticSe(systemSound);
    };

    Game_System.prototype.resetSystemSound = function(typeIndex) {
        this.initSystemSound();
        this._systemSounds[typeIndex] = undefined;
    };

    Game_System.prototype.getSystemSound = function(typeIndex) {
        return this._systemSounds && this._systemSounds[typeIndex] ? this._systemSounds[typeIndex] : null;
    };

    //=============================================================================
    // SoundManager
    //  カスタムシステム効果音を演奏します。
    //=============================================================================
    var _SoundManager_playSystemSound = SoundManager.playSystemSound;
    SoundManager.playSystemSound = function(n) {
        var customSound = $gameSystem.getSystemSound(n);
        if (customSound) {
            AudioManager.playStaticSe(customSound);
        } else {
            _SoundManager_playSystemSound.apply(this, arguments);
        }
    };
})();

