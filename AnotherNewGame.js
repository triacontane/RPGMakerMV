//=============================================================================
// AnotherNewGame.js
// ----------------------------------------------------------------------------
// (C) 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.0.0 2020/03/08 アナザーニューゲームコマンドを複数登録できるよう修正。以前のバージョンと互換性がありません。
// 2.0.0 2019/03/19 アナザーロード時に場所移動せず、セーブ位置から開始できる機能を追加
//                  アナザーニューゲーム時に自動でONになるスイッチを追加
//                  パラメータの型指定機能に対応
// 1.4.0 2017/06/18 アナザーニューゲームの追加位置を指定できる機能を追加
// 1.3.0 2017/05/27 ニューゲームを非表示にできる機能を追加
// 1.2.4 2017/05/23 プラグインコマンドのヘルプを修正
// 1.2.3 2017/01/25 同一サーバで同プラグインを適用した複数のゲームを公開する際に、設定が重複するのを避けるために管理番号を追加
// 1.2.2 2016/12/10 アナザーニューゲームをロードした際に、ロード元でイベントが実行中だった場合に続きが実行されてしまう現象を修正
// 1.2.1 2016/11/23 遠景タイトルプラグイン（ParallaxTitle.js）と連携する設定を追加
// 1.2.0 2016/11/22 アナザーニューゲームを選択した際に、フェードアウトしなくなる設定を追加
// 1.1.0 2016/03/29 fftfanttさんからご提供いただいたコードを反映させ、アナザーニューゲーム選択時に
//                  既存のセーブファイルをロードする機能を追加
// 1.0.1 2015/11/10 プラグイン適用中にセーブできなくなる不具合を修正
// 1.0.0 2015/11/07 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc アナザーニューゲーム追加プラグイン
 * @author トリアコンタン
 *
 * @param anotherDataList
 * @text アナザーニューゲームリスト
 * @desc アナザーニューゲームのコマンド一覧です。
 * @default []
 * @type struct<COMMAND>[]
 *
 * @param manageNumber
 * @text 管理番号
 * @desc 同一サーバ内に複数のゲームを配布する場合のみ、ゲームごとに異なる値を設定してください。(RPGアツマールは対象外)
 * @default
 *
 * @help バージョン3.0.0は以前のバージョンと互換性がありません。
 *
 * タイトル画面のウィンドウの一番下に、もう一つのニューゲームを追加します。
 * 選択すると、ニューゲームとは別に指定したマップに遷移します。
 * クリア後のおまけやCG回想モード、スタッフクレジット、ミニゲーム、隠し要素など
 * 使い手次第で様々な用途に使えます。
 *
 * 選択肢は、あらかじめ非表示あるいは選択禁止にしておくことができます。
 * これらはプラグインコマンドから解除でき、解除状態はセーブファイルを
 * 超えてゲーム全体で共有されます。解除した状態を再度、禁止にすることもできます。
 *
 * 設定はファイル「AnotherNewGameMk2.rpgsave」に保存されます。
 *
 * プラグインコマンド詳細
 *   イベントコマンド「プラグインコマンド」から実行。
 *
 *  ANG_VISIBLE 1  # [1]番目のアナザーニューゲームを表示にする。
 *  ANG_ENABLE 1   # [1]番目のアナザーニューゲームを選択可能にする。
 *  ANG_HIDDEN 1   # [1]番目のアナザーニューゲームを非表示にする。
 *  ANG_DISABLE 1  # [1]番目のアナザーニューゲームを選択禁止にする。
 *
 * 使用例（1番目に登録したアナザーニューゲームを「表示」にする場合）
 * ANG_VISIBLE 1
 *
 *  ANG_NEWGAME_HIDDEN  # ニューゲームを非表示にする。
 *  ANG_NEWGAME_VISIBLE # ニューゲームを表示にする。
 *
 * ニューゲームを非表示にする機能は、ゲームが開始できなくなる場合が
 * あるので注意して使用してください。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~COMMAND:
 * @param name
 * @text コマンド名称
 * @desc タイトル画面に表示されるコマンド名です。
 * @default Another New Game
 *
 * @param mapId
 * @text マップID
 * @desc 移動先のマップIDです。0を指定した場合、場所移動しません。
 * @default 1
 * @type number
 *
 * @param mapX
 * @text X座標
 * @desc 移動先のX座標です。
 * @default 1
 * @type number
 *
 * @param mapY
 * @text Y座標
 * @desc 移動先のY座標です。（自然数）
 * @default 1
 * @type number
 *
 * @param hidden
 * @text デフォルト非表示
 * @desc デフォルトで選択肢を非表示にします。プラグインコマンドで有効化できます。
 * @default false
 * @type boolean
 *
 * @param disable
 * @text デフォルト使用禁止
 * @desc デフォルトで選択肢を選択禁止にします。プラグインコマンドで有効化できます。
 * @default false
 * @type boolean
 *
 * @param addPosition
 * @text 追加位置
 * @desc アナザーニューゲームのコマンド追加位置です。(1:ニューゲームの上、2:コンティニューの上、3:オプションの上)
 * @default 0
 * @type select
 * @option オプションの下
 * @value 0
 * @option ニューゲームの上
 * @value 1
 * @option コンティニューの上
 * @value 2
 * @option オプションの上
 * @value 3
 *
 * @param switchId
 * @text 連動スイッチ番号
 * @desc アナザーニューゲーム開始時に自動でONになるスイッチを指定できます。
 * @default 0
 * @type switch
 *
 * @param fileLoad
 * @text ファイルロード
 * @desc アナザーニューゲーム選択時に、ロード画面に遷移して既存セーブデータをロードします。
 * @default false
 * @type boolean
 *
 * @param noFadeout
 * @text フェードアウト無効
 * @desc アナザーニューゲーム選択時に、オーディオや画面がフェードアウトしなくなります。
 * @default false
 * @type boolean
 */

(function() {
    var localExtraStageIndex = -1;

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
    var parameters = createPluginParameter('AnotherNewGame');
    parameters.anotherDataList = parameters.anotherDataList || [];

    /**
     * Convert escape characters.(require any window object)
     * @param text Target text
     * @returns {String} Converted text
     */
    var convertEscapeCharacters = function(text) {
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
    };

    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        var index = args[0] ? parseInt(convertEscapeCharacters(args[0])) - 1 : 0;
        switch (command.toUpperCase()) {
            case 'ANG_VISIBLE' :
                ANGSettingManager.setVisible(index, true);
                ANGSettingManager.save();
                break;
            case 'ANG_ENABLE' :
                ANGSettingManager.setEnable(index, true);
                ANGSettingManager.save();
                break;
            case 'ANG_HIDDEN' :
                ANGSettingManager.setVisible(index, false);
                ANGSettingManager.save();
                break;
            case 'ANG_DISABLE' :
                ANGSettingManager.setEnable(index, false);
                ANGSettingManager.save();
                break;
            case 'ANG_NEWGAME_HIDDEN' :
                ANGSettingManager.newGameHidden = true;
                ANGSettingManager.save();
                break;
            case 'ANG_NEWGAME_VISIBLE' :
                ANGSettingManager.newGameHidden = false;
                ANGSettingManager.save();
                break;
        }
    };

    //=============================================================================
    // Game_Map
    //  アナザーニューゲームのロード時に実行していたイベントを中断します。
    //=============================================================================
    Game_Map.prototype.abortInterpreter = function() {
        if (this.isEventRunning()) {
            this._interpreter.command115();
        }
    };

    //=============================================================================
    // Scene_Title
    //  アナザーニューゲームの選択時の処理を追加定義します。
    //=============================================================================
    var _Scene_Title_create      = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        ANGSettingManager.loadData();
        _Scene_Title_create.call(this);
    };

    var _Scene_Title_commandContinue      = Scene_Title.prototype.commandContinue;
    Scene_Title.prototype.commandContinue = function() {
        _Scene_Title_commandContinue.call(this);
        localExtraStageIndex = -1;
    };

    var _Scene_Title_commandNewGameSecond      = Scene_Title.prototype.commandNewGameSecond;
    Scene_Title.prototype.commandNewGameSecond = function(index) {
        if (_Scene_Title_commandNewGameSecond) {
            _Scene_Title_commandNewGameSecond.apply(this, arguments);
        }
        var command = parameters.anotherDataList[index];
        if (command.noFadeout) {
            this._noFadeout = true;
        }
        if (!command.fileLoad) {
            var preMapId  = $dataSystem.startMapId;
            var preStartX = $dataSystem.startX;
            var preStartY = $dataSystem.startY;
            var newMapId  = command.mapId;
            if (newMapId > 0) {
                $dataSystem.startMapId = newMapId;
                $dataSystem.startX     = command.mapX || 1;
                $dataSystem.startY     = command.mapY || 1;
            }
            this.commandNewGame();
            $dataSystem.startMapId = preMapId;
            $dataSystem.startX     = preStartX;
            $dataSystem.startY     = preStartY;
            var switchId = command.switchId;
            if (switchId > 0) {
                $gameSwitches.setValue(switchId, true);
            }
        } else {
            this.commandContinue();
            localExtraStageIndex = index;
        }
    };

    var _Scene_Title_createCommandWindow      = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);
        parameters.anotherDataList.forEach(function(command, index) {
            if (ANGSettingManager.isVisible(index)) {
                this._commandWindow.setHandler('nameGame2_' + index, this.commandNewGameSecond.bind(this, index));
            }
        }, this);
    };

    Scene_Title.prototype.fadeOutAll = function() {
        if (!this._noFadeout) {
            Scene_Base.prototype.fadeOutAll.apply(this, arguments);
        }
    };

    //=============================================================================
    // Scene_Load
    //  ロード成功時にアナザーポイントに移動します。
    //=============================================================================
    var _Scene_Load_onLoadSuccess      = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function() {
        _Scene_Load_onLoadSuccess.call(this);
        if (localExtraStageIndex >= 0) {
            var command = parameters.anotherDataList[localExtraStageIndex];
            var mapId = command.mapId;
            if (mapId > 0) {
                var x = command.mapX || 1;
                var y = command.mapY || 1;
                $gamePlayer.reserveTransfer(mapId, x, y);
            }
            $gameMap.abortInterpreter();
            DataManager.selectSavefileForNewGame();
            var switchId = command.switchId;
            if (switchId > 0) {
                $gameSwitches.setValue(switchId, true);
            }
        }
    };

    //=============================================================================
    // Window_TitleCommand
    //  アナザーニューゲームの選択肢を追加定義します。
    //=============================================================================
    var _Window_TitleCommand_makeCommandList      = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.call(this);
        parameters.anotherDataList.forEach(function(command, index) {
            if (ANGSettingManager.isVisible(index)) {
                this.makeAnotherNewGameCommand(command, index);
            }
        }, this);
        if (ANGSettingManager.newGameHidden) {
            this.eraseCommandNewGame();
        }
    };

    Window_TitleCommand.prototype.makeAnotherNewGameCommand = function(command, index) {
        this.addCommand(command.name, 'nameGame2_' + index, ANGSettingManager.isEnable(index));
        var addPosition = command.addPosition;
        if (addPosition > 0) {
            var anotherCommand = this._list.pop();
            this._list.splice(addPosition - 1, 0, anotherCommand);
        }
    };

    Window_TitleCommand.prototype.eraseCommandNewGame = function() {
        this._list = this._list.filter(function(command) {
            return command.symbol !== 'newGame';
        });
    };

    var _Window_TitleCommand_updatePlacement      = Window_TitleCommand.prototype.updatePlacement;
    Window_TitleCommand.prototype.updatePlacement = function() {
        _Window_TitleCommand_updatePlacement.call(this);
        var addSize = this._list.length - 3;
        if (addSize > 0) {
            this.y += addSize * this.itemHeight() / 2;
        }
    };

    //=============================================================================
    // ANGManager
    //  アナザーニューゲームの設定ファイルのセーブとロードを定義します。
    //=============================================================================
    function ANGSettingManager() {
        throw new Error('This is a static class');
    }

    ANGSettingManager._fileId = -1001;

    ANGSettingManager._visible       = [];
    ANGSettingManager._enable        = [];
    ANGSettingManager.newGameHidden = false;

    ANGSettingManager.make = function() {
        var info           = {};
        info.visible       = this._visible;
        info.enable        = this._enable;
        info.newGameHidden = this.newGameHidden;
        return info;
    };

    ANGSettingManager.isVisible = function(index) {
        if (this._visible[index] !== undefined) {
            return this._visible[index];
        } else {
            return !parameters.anotherDataList[index].hidden;
        }
    };

    ANGSettingManager.setVisible = function(index, value) {
        this._visible[index] = value;
    };

    ANGSettingManager.isEnable = function(index) {
        if (this._enable[index] !== undefined) {
            return this._enable[index];
        } else {
            return !parameters.anotherDataList[index].disable;
        }
    };

    ANGSettingManager.setEnable = function(index, value) {
        this._enable[index] = value;
    };

    ANGSettingManager.loadData = function() {
        var info           = this.load();
        this._visible      = info.visible || [];
        this._enable       = info.enable || [];
        this.newGameHidden = !!info.newGameHidden;
    };

    ANGSettingManager.load = function() {
        var json;
        try {
            json = StorageManager.load(this._fileId);
        } catch (e) {
            console.error(e);
            return [];
        }
        if (json) {
            return JSON.parse(json);
        } else {
            return [];
        }
    };

    ANGSettingManager.save = function() {
        var info = ANGSettingManager.make();
        StorageManager.save(this._fileId, JSON.stringify(info));
    };

    //=============================================================================
    // StorageManager
    //  アナザーニューゲームの設定ファイルのパス取得処理を追加定義します。
    //=============================================================================
    var _StorageManager_localFilePath = StorageManager.localFilePath;
    StorageManager.localFilePath      = function(savefileId) {
        if (savefileId === ANGSettingManager._fileId) {
            return this.localFileDirectoryPath() + 'AnotherNewGameMk2.rpgsave';
        } else {
            return _StorageManager_localFilePath.call(this, savefileId);
        }
    };

    var _StorageManager_webStorageKey = StorageManager.webStorageKey;
    StorageManager.webStorageKey      = function(savefileId) {
        if (savefileId === ANGSettingManager._fileId) {
            return 'RPG AnotherNewGame Mk2' + parameters.manageNumber;
        } else {
            return _StorageManager_webStorageKey.call(this, savefileId);
        }
    };
})();
