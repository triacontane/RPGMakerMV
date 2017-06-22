//=============================================================================
// FootstepSound.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/06/23 立ち止まったときに足音演奏間隔をリセットする機能を追加
// 1.0.0 2016/02/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 足音プラグイン
 * @author トリアコンタン
 *
 * @param イベント実行中無効
 * @desc イベント実行中は足音を無効にする。（ON/OFF）
 * @default OFF
 *
 * @param 立ち止まるとリセット
 * @desc 演奏間隔が設定されている場合、立ち止まることでリセットされます。（ON/OFF）
 * @default OFF
 *
 * @help 以下の状況下で指定した足音効果音を演奏します。
 * 数字の小さい方が優先度が高いです。
 * 1.  飛行船乗船時
 * 2.  大型船乗船時
 * 3.  小型船乗船時
 * 4.  指定リージョン通過時
 * 5.  ダメージ床属性通過時
 * 6.  茂み属性通過時
 * 7.  カウンター属性通過時
 * 8.  梯子属性通過時
 * 9.  指定地形タグ通過時
 * 10. 常に
 *
 * 効果音を指定する場合、当ファイル「FootstepSound.js」を
 * テキストエディタで開き「ユーザ書き換え領域」と書かれている
 * 部分を注釈に従って修正してください。
 *
 * 要注意！　指定した効果音は、デプロイメント時に
 * 未使用ファイルとして除外される可能性があります。
 * その場合、削除されたファイルを入れ直す等の対応が必要です。
 *
 * 足音が演奏されるのはプレイヤーのみですが、
 * 「移動ルートの指定」の「スクリプト」から以下を実行すると
 * イベントにも足音が演奏されるようになります。
 *
 * 足音を演奏する　：this.setStepSoundFlg(true);
 * 足音を演奏しない：this.setStepSoundFlg(false);
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （引数の間は半角スペースで区切る）
 *
 * 足音無効化 or FS_INVALID_SOUND
 *   一時的に全ての足音を無効にします。
 * 例：足音無効化
 *
 * 足音有効化 or FS_VALID_SOUND
 *   全ての足音を有効に戻します。
 * 例：足音有効化
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function() {
    //=============================================================================
    // ユーザ書き換え領域 - 開始 -
    //  name   : 効果音名称(拡張子不要)
    //  volume : 音量(0...100)
    //  pitch  : ピッチ(50...150)
    //  pan    : 位相(-100...100)
    // ※コピー＆ペーストしやすくするために最後の項目にもカンマを付与しています。
    //=============================================================================
    var footStepJson = {
        // walk1:歩行時の効果音1
        // walk2:歩行時の効果音2
        // dash1:ダッシュ時の効果音1
        // dash2:ダッシュ時の効果音2
        // interval:効果音を演奏する間隔（1の場合は1歩ごと）

        // 常に演奏される足音
        always     : {
            interval: 1,
            walk1   : {name: '', volume: 90, pitch: 100, pan: 0},
            walk2   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash1   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash2   : {name: '', volume: 90, pitch: 100, pan: 0},
        },
        // 梯子属性通過時の足音
        ladder     : {
            interval: 1,
            walk1   : {name: '', volume: 90, pitch: 100, pan: 0},
            walk2   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash1   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash2   : {name: '', volume: 90, pitch: 100, pan: 0},
        },
        // カウンター属性通過時の足音
        counter    : {
            interval: 1,
            walk1   : {name: '', volume: 90, pitch: 100, pan: 0},
            walk2   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash1   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash2   : {name: '', volume: 90, pitch: 100, pan: 0},
        },
        // 茂み属性通過時の足音
        bush       : {
            interval: 1,
            walk1   : {name: '', volume: 90, pitch: 100, pan: 0},
            walk2   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash1   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash2   : {name: '', volume: 90, pitch: 100, pan: 0},
        },
        // ダメージ床属性通過時の足音
        damageFloor: {
            interval: 1,
            walk1   : {name: '', volume: 90, pitch: 100, pan: 0},
            walk2   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash1   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash2   : {name: '', volume: 90, pitch: 100, pan: 0},
        },
        // 小型船乗船時の足音
        boat       : {
            interval: 4,
            walk1   : {name: '', volume: 90, pitch: 100, pan: 0},
            walk2   : {name: '', volume: 90, pitch: 100, pan: 0},
        },
        // 大型船乗船時の足音
        ship       : {
            interval: 4,
            walk1   : {name: '', volume: 90, pitch: 100, pan: 0},
            walk2   : {name: '', volume: 90, pitch: 100, pan: 0},
        },
        // 飛行船船乗船時の足音
        airship    : {
            interval: 4,
            walk1   : {name: '', volume: 90, pitch: 100, pan: 0},
            walk2   : {name: '', volume: 90, pitch: 100, pan: 0},
        },
        // 地形タグ 1 通過時の足音（2以降はコピーするか以下の通り値を変更してください）
        // terrainTag1 → terrainTag2
        terrainTag1: {
            interval: 1,
            walk1   : {name: '', volume: 90, pitch: 100, pan: 0},
            walk2   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash1   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash2   : {name: '', volume: 90, pitch: 100, pan: 0},
        },
        // リージョン 1 通過時の足音（2以降はコピーするか以下の通り値を変更してください）
        // region1 → region2
        region1    : {
            interval: 1,
            walk1   : {name: '', volume: 90, pitch: 100, pan: 0},
            walk2   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash1   : {name: '', volume: 90, pitch: 100, pan: 0},
            dash2   : {name: '', volume: 90, pitch: 100, pan: 0},
        },
    };
    //=============================================================================
    // ユーザ書き換え領域 - 終了 -
    //=============================================================================
    var pluginName = 'FootstepSound';

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther            = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
    var paramEventRunningInvalid = getParamBoolean(['イベント実行中無効', 'EventRunningInvalid']);
    var paramResetIfStop         = getParamBoolean(['立ち止まるとリセット', 'ResetIfStop']);

    var getCommandName = function(command) {
        return (command || '').toUpperCase();
    };

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        try {
            this.pluginCommandFootstep(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };

    Game_Interpreter.prototype.pluginCommandFootstep = function(command, args) {
        switch (getCommandName(command)) {
            case 'FS_INVALID_SOUND' :
            case '足音無効化':
                $gameSystem.footstepDisable = true;
                break;
            case 'FS_VALID_SOUND':
            case '足音有効化':
                $gameSystem.footstepDisable = false;
                break;
        }
    };

    //=============================================================================
    // Game_CharacterBase
    //  足音効果音の演奏処理を追加します。
    //=============================================================================
    var _Game_CharacterBase_initMembers      = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.apply(this, arguments);
        this.setStepSoundFlg(false);
        this._stepToggle = null;
        this.resetStepCountForSound();
    };

    Game_CharacterBase.prototype.resetStepCountForSound = function() {
        this._stepCountForSound = null;
    };

    var _Game_CharacterBase_increaseSteps      = Game_CharacterBase.prototype.increaseSteps;
    Game_CharacterBase.prototype.increaseSteps = function() {
        _Game_CharacterBase_increaseSteps.apply(this, arguments);
        if (!this.isPlayStepSound() || $gameSystem.footstepDisable ||
            ($gameMap.isEventRunning() && paramEventRunningInvalid)) return;
        var soundsHash = [
            {key: 'airship', condition: this.isInAirship.bind(this)},
            {key: 'ship', condition: this.isInShip.bind(this)},
            {key: 'boat', condition: this.isInBoat.bind(this)},
            {key: 'region' + this.regionId(), condition: this.noCondition.bind(this)},
            {key: 'damageFloor', condition: this.isOnDamageFloor.bind(this)},
            {key: 'bush', condition: this.isOnBush.bind(this)},
            {key: 'counter', condition: this.isOnCounter.bind(this)},
            {key: 'ladder', condition: this.isOnLadder.bind(this)},
            {key: 'terrainTag' + this.terrainTag(), condition: this.noCondition.bind(this)},
            {key: 'always', condition: this.noCondition.bind(this)}
        ];
        soundsHash.some(function(data) {
            return this.playStepSound(data.key, data.condition);
        }.bind(this));
    };

    Game_CharacterBase.prototype.playStepSound = function(typeKey, condition) {
        if (condition() && footStepJson.hasOwnProperty(typeKey)) {
            var soundHash = footStepJson[typeKey];
            if (this._stepCountForSound++ % soundHash.interval === 0) {
                var soundKey = this.isDashing() ? 'dash' : 'walk';
                soundKey += this._stepToggle ? '2' : '1';
                if (soundHash.hasOwnProperty(soundKey)) AudioManager.playSe(soundHash[soundKey]);
                this._stepToggle = !this._stepToggle;
            }
            return true;
        }
        return false;
    };

    Game_CharacterBase.prototype.noCondition = function() {
        return true
    };

    Game_CharacterBase.prototype.isOnDamageFloor = function() {
        return $gameMap.isDamageFloor(this.x, this.y);
    };

    Game_CharacterBase.prototype.isOnCounter = function() {
        return $gameMap.isCounter(this.x, this.y);
    };

    Game_CharacterBase.prototype.isInBoat = function() {
        return false;
    };

    Game_CharacterBase.prototype.isInShip = function() {
        return false;
    };

    Game_CharacterBase.prototype.isInAirship = function() {
        return false;
    };

    Game_CharacterBase.prototype.isPlayStepSound = function() {
        return this._stepSoundFlg;
    };

    Game_CharacterBase.prototype.setStepSoundFlg = function(value) {
        this._stepSoundFlg = !!value;
    };

    //=============================================================================
    // Game_Player
    //  キャラクターごとの足音演奏フラグ（プレイヤーは常にON）
    //=============================================================================
    Game_Player.prototype.isPlayStepSound = function() {
        return true;
    };

    var _Game_Player_updateNonmoving      = Game_Player.prototype.updateNonmoving;
    Game_Player.prototype.updateNonmoving = function(wasMoving) {
        _Game_Player_updateNonmoving.apply(this, arguments);
        if (!wasMoving && paramResetIfStop) {
            this.resetStepCountForSound();
        }
    };

    //=============================================================================
    // Game_System
    //  足音効果音の有効無効設定を追加定義します。
    //=============================================================================
    var _Game_System_initialize      = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.apply(this, arguments);
        this.footstepDisable = null;
    };
})();