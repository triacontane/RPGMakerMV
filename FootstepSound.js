//=============================================================================
// FootstepSound.js
// ----------------------------------------------------------------------------
// (C) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.0.0 2020/08/09 足音データをプラグインパラメータで設定する仕様に変更しリファクタリング
//                  足音の間隔を歩行、ダッシュで別々に設定できる機能を追加
// 2.1.0 2019/02/02 イベントごとの足音を固有に設定できる機能を追加
// 2.0.0 2018/09/05 プレイヤーの足音を無効化するスイッチを指定できる機能を追加
//                  パラメータの型指定機能に対応
// 1.1.0 2017/06/23 立ち止まったときに足音演奏間隔をリセットする機能を追加
// 1.0.0 2016/02/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 足音プラグイン
 * @author トリアコンタン
 *
 * @param EventRunningInvalid
 * @text イベント実行中無効
 * @desc イベント実行中は足音を無効にする。（ON/OFF）
 * @default false
 * @type boolean
 *
 * @param ResetIfStop
 * @text 立ち止まるとリセット
 * @desc 演奏間隔が設定されている場合、立ち止まることでリセットされます。（ON/OFF）
 * @default false
 * @type boolean
 *
 * @param InvalidSwitchId
 * @text 無効スイッチID
 * @desc 指定したスイッチがONのときプレイヤーの足音が無効になります。指定しない場合は常に有効になります。
 * @default 0
 * @type switch
 *
 * @param airship
 * @text 飛行船の足音セット
 * @desc 飛行船乗船時の足音セットです。
 * @type struct<SoundSet>
 * @default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}
 *
 * @param ship
 * @text 大型船の足音セット
 * @desc 大型船乗船時の足音セットです。
 * @type struct<SoundSet>
 * @default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}
 *
 * @param boat
 * @text 小型船の足音セット
 * @desc 小型船乗船時の足音セットです。
 * @type struct<SoundSet>
 * @default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}
 *
 * @param regionList
 * @text リージョン属性の足音セット
 * @desc 指定リージョンのタイルを通過したときの足音セットです。
 * @type struct<SoundSet>[]
 * @default []
 *
 * @param damageFloor
 * @text ダメージ床属性の足音セット
 * @desc ダメージ床属性のタイルを通過したときの足音セットです。
 * @type struct<SoundSet>
 * @default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}
 *
 * @param bush
 * @text 茂み属性の足音セット
 * @desc 茂み属性のタイルを通過したときの足音セットです。
 * @type struct<SoundSet>
 * @default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}
 *
 * @param counter
 * @text カウンター属性の足音セット
 * @desc カウンター属性のタイルを通過したときの足音セットです。
 * @type struct<SoundSet>
 * @default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}
 *
 * @param ladder
 * @text 梯子属性の足音セット
 * @desc 梯子属性のタイルを通過したときの足音セットです。
 * @type struct<SoundSet>
 * @default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}
 *
 * @param terrainTagList
 * @text 地形タグの足音セット
 * @desc 指定地形タグのタイルを通過したときの足音セットです。
 * @type struct<SoundSet>[]
 * @default []
 *
 * @param always
 * @text 通常時の足音セット
 * @desc 他の条件を満たしていないときの足音セットです。
 * @type struct<SoundSet>
 * @default {"interval":"1","walk1":"","walk2":"","dash1":"","dash2":""}
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
 * 足音が演奏されるのはプレイヤーのみですが、
 * 「移動ルートの指定」の「スクリプト」から以下を実行すると
 * イベントにも足音が演奏されるようになります。
 *
 * 足音を演奏する　：this.setStepSoundFlg(true);
 * 足音を演奏しない：this.setStepSoundFlg(false);
 *
 * イベントごとに固有に足音を設定したい場合、以下の通り指定してください。
 * <FootStep:Absorb1> // 足音に「Absorb1」が設定されます。
 * <足音:Absorb1>     // 同上
 * このメモ欄を設定するとスクリプト「this.setStepSoundFlg(true);」
 * を実行しなくてもデフォルトで足音が有効になります。
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

/*~struct~SoundSet:
 * @param interval
 * @text 間隔
 * @desc 足音SEの演奏間隔(秒数)です。0を指定した場合、間隔による判定をしなくなります。
 * @type number
 * @default 1
 * @min 0
 *
 * @param id
 * @text リージョン、地形タグ
 * @desc リージョンもしくは地形タグの番号です。リージョンや地形タグ以外の設定では無視されます。
 * @type number
 * @default 0
 *
 * @param walk1
 * @text 歩行時の足音1
 * @desc 歩行時の足音1です。足音2と交互に演奏されます。
 * @type struct<Sound>
 * @default
 *
 * @param walk2
 * @text 歩行時の足音2
 * @desc 歩行時の足音2です。指定がない場合は足音1だけが演奏されます。
 * @type struct<Sound>
 * @default
 *
 * @param dash1
 * @text ダッシュ時の足音1
 * @desc ダッシュ時の足音1です。足音2と交互に演奏されます。ダッシュがない乗り物等ではこの設定は無視されます。
 * @type struct<Sound>
 * @default
 *
 * @param dash2
 * @text ダッシュ時の足音2
 * @desc ダッシュ時の足音2です。指定がない場合は足音1だけが演奏されます。
 * @type struct<Sound>
 * @default
 */

/*~struct~Sound:
 * @param name
 * @text ファイル名
 * @desc 足音SEのファイル名です。
 * @default
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume
 * @text 音量
 * @desc 足音SEの音量です。
 * @type number
 * @default 90
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @desc 足音SEのピッチです。
 * @type number
 * @default 100
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 位相
 * @desc 足音SEの位相です。
 * @type number
 * @default 100
 * @min -100
 * @max 100
 *
 * @param interval
 * @text 間隔
 * @desc 足音SEの演奏間隔(秒数)です。足音の種別ごとに間隔を指定したい場合に使用します。
 * @type number
 * @default 0
 * @min 0
 */

(function () {
    'use strict'

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function (pluginName) {
        var paramReplacer = function (key, value) {
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
        var parameter = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };
    var param = createPluginParameter('FootstepSound');

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    /**
     * Get database meta information.
     * @param object Database item
     * @param name Meta name
     * @returns {String} meta value
     */
    var getMetaValue = function (object, name) {
        return object.meta.hasOwnProperty(name) ? convertEscapeCharacters(object.meta[name]) : null;
    };

    /**
     * Get database meta information.(for multi language)
     * @param object Database item
     * @param names Meta name array (for multi language)
     * @returns {String} meta value
     */
    var getMetaValues = function (object, names) {
        var metaValue;
        names.some(function (name) {
            metaValue = getMetaValue(object, name);
            return metaValue !== null;
        });
        return metaValue;
    };

    /**
     * Convert escape characters.(require any window object)
     * @param text Target text
     * @returns {String} Converted text
     */
    var convertEscapeCharacters = function (text) {
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
    };

    var findListItem = function (id, targetList) {
        if (!Array.isArray(targetList)) {
            return null;
        }
        return targetList.filter(listItem => listItem.id === id)[0];
    }

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        this.pluginCommandFootstep(command, args);
    };

    Game_Interpreter.prototype.pluginCommandFootstep = function (command, args) {
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
    var _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function () {
        _Game_CharacterBase_initMembers.apply(this, arguments);
        this.setStepSoundFlg(false);
        this._stepToggle = null;
        this.resetStepCountForSound();
    };

    Game_CharacterBase.prototype.resetStepCountForSound = function () {
        this._stepCountForSound = null;
    };

    var _Game_CharacterBase_increaseSteps = Game_CharacterBase.prototype.increaseSteps;
    Game_CharacterBase.prototype.increaseSteps = function () {
        _Game_CharacterBase_increaseSteps.apply(this, arguments);
        if (this.isInvalidFootStepSound()) {
            return;
        }
        var soundsHash = [
            {key: 'airship', condition: this.isInAirship.bind(this)},
            {key: 'ship', condition: this.isInShip.bind(this)},
            {key: 'boat', condition: this.isInBoat.bind(this)},
            {key: 'regionList', condition: findListItem.bind(this, this.regionId())},
            {key: 'damageFloor', condition: this.isOnDamageFloor.bind(this)},
            {key: 'bush', condition: this.isOnBush.bind(this)},
            {key: 'counter', condition: this.isOnCounter.bind(this)},
            {key: 'ladder', condition: this.isOnLadder.bind(this)},
            {key: 'terrainTagList', condition: findListItem.bind(this, this.terrainTag())},
            {key: 'always', condition: this.noCondition.bind(this)}
        ];
        soundsHash.some(function (data) {
            return this.updateStepSound(data.key, data.condition);
        }.bind(this));
    };

    Game_CharacterBase.prototype.isInvalidFootStepSound = function () {
        return (!this.isPlayStepSound() || $gameSystem.footstepDisable ||
            ($gameMap.isEventRunning() && param.EventRunningInvalid));
    };

    Game_CharacterBase.prototype.updateStepSound = function (typeKey, condition) {
        var soundParam = this.findSoundParam(typeKey, condition);
        if (!soundParam) {
            return false;
        }
        this._stepCountForSound++
        if (this.checkInterval(soundParam)) {
            var se = this.findStepSound(soundParam);
            if (se && se.hasOwnProperty('name') && this.checkInterval(se)) {
                this.playStepSound(se);
                return true;
            }
        }
        return false;
    };

    Game_CharacterBase.prototype.playStepSound = function (se) {
        AudioManager.playSe(se);
        this._stepToggle = !this._stepToggle;
    };

    Game_CharacterBase.prototype.checkInterval = function (targetObject) {
        var interval = targetObject.interval
        if (!interval) {
            return true;
        }
        return this._stepCountForSound % interval === 0
    };

    Game_CharacterBase.prototype.findSoundParam = function (typeKey, condition) {
        var data = param[typeKey];
        if (!data) {
            return null;
        }
        var result = condition(data);
        if (!result) {
            return null;
        }
        return Array.isArray(data) ? result : data;
    };

    Game_CharacterBase.prototype.findStepSound = function (soundHash) {
        var soundBaseKey = this.isDashing() ? 'dash' : 'walk';
        var soundKey = soundBaseKey + (this._stepToggle ? '2' : '1');
        return soundHash[soundKey] || soundHash[soundBaseKey + '1'] || null;
    };

    Game_CharacterBase.prototype.noCondition = function () {
        return true;
    };

    Game_CharacterBase.prototype.isOnDamageFloor = function () {
        return $gameMap.isDamageFloor(this.x, this.y);
    };

    Game_CharacterBase.prototype.isOnCounter = function () {
        return $gameMap.isCounter(this.x, this.y);
    };

    Game_CharacterBase.prototype.isInBoat = function () {
        return false;
    };

    Game_CharacterBase.prototype.isInShip = function () {
        return false;
    };

    Game_CharacterBase.prototype.isInAirship = function () {
        return false;
    };

    Game_CharacterBase.prototype.isPlayStepSound = function () {
        return this._stepSoundFlg;
    };

    Game_CharacterBase.prototype.setStepSoundFlg = function (value) {
        this._stepSoundFlg = !!value;
    };

    //=============================================================================
    // Game_Player
    //  キャラクターごとの足音演奏取得
    //=============================================================================
    Game_Player.prototype.isPlayStepSound = function () {
        return !$gameSwitches.value(param.InvalidSwitchId);
    };

    var _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
    Game_Player.prototype.updateNonmoving = function (wasMoving) {
        _Game_Player_updateNonmoving.apply(this, arguments);
        if (!wasMoving && param.ResetIfStop) {
            this.resetStepCountForSound();
        }
    };

    var _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function () {
        _Game_Event_initialize.apply(this, arguments);
        this._footStepSeName = getMetaValues(this.event(), ['FootStep', '足音']) || null;
        if (this._footStepSeName) {
            this.setStepSoundFlg(true);
            name
        }
    };

    var _Game_Event_findStepSound = Game_Event.prototype.findStepSound;
    Game_Event.prototype.findStepSound = function (soundHash) {
        var se = _Game_Event_findStepSound.apply(this, arguments);
        if (se && this._footStepSeName) {
            return {
                name: this._footStepSeName,
                volume: se.volume,
                pitch: se.pitch,
                pan: se.pan
            };
        } else {
            return se;
        }
    };

    //=============================================================================
    // Game_System
    //  足音効果音の有効無効設定を追加定義します。
    //=============================================================================
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_initialize.apply(this, arguments);
        this.footstepDisable = null;
    };
})();
