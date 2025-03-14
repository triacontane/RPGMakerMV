//=============================================================================
// AnotherNewGame.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 4.3.1 2025/03/15 ニューゲームの移動先座標を0に指定すると1に移動してしまう問題を修正
// 4.3.0 2025/02/25 本体v1.9.0のロケーションのダイアログ指定機能に対応
// 4.2.1 2024/11/24 タイトルヘルププラグインに合わせた調整
// 4.2.0 2023/06/11 タイトルコマンドのカーソル初期位置を設定、変更できる機能を追加
// 4.1.0 2023/05/28 タイトル画面で無操作状態が続くと自動で専用ニューゲームを開始できる機能を追加
// 4.0.2 2021/04/08 orderAfterアノテーションを追加
// 4.0.1 2020/11/29 ブラウザからの実行でエラーになる問題を修正
// 4.0.0 2020/11/11 MZ向けに全面的にリファクタリング
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
// [X]      : https://x.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc アナザーニューゲーム追加プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AnotherNewGame.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @author トリアコンタン
 *
 * @param anotherDataList
 * @text アナザーニューゲームリスト
 * @desc アナザーニューゲームのコマンド一覧です。
 * @default []
 * @type struct<COMMAND>[]
 *
 * @param defaultCursorIndex
 * @text カーソル初期位置
 * @desc セーブデータがないときのタイトルコマンドのカーソル初期位置です。0を指定するとデフォルト仕様に準拠します。
 * @default 0
 * @type number
 *
 * @command SETTING
 * @text コマンド制御
 * @desc アナザーニューゲームコマンドの表示と利用可否を制御します。
 *
 * @arg type
 * @text 操作種別
 * @desc 操作種別を選択します。
 * @default VISIBLE
 * @type select
 * @option コマンド表示
 * @value VISIBLE
 * @option コマンド非表示
 * @value HIDDEN
 * @option コマンド利用許可
 * @value ENABLE
 * @option コマンド利用禁止
 * @value DISABLE
 *
 * @arg index
 * @text コマンドインデックス
 * @desc 操作対象のコマンドインデックスです。(開始位置は0)
 * @type number
 * @default 0
 *
 * @command NEW_GAME_SETTING
 * @text ニューゲーム制御
 * @desc ニューゲームコマンドの表示を制御します。設定次第でゲームが開始できなくなるので注意してください。
 *
 * @arg type
 * @text 操作種別
 * @desc 操作種別を選択します。
 * @default VISIBLE
 * @type select
 * @option コマンド表示
 * @value VISIBLE
 * @option コマンド非表示
 * @value HIDDEN
 *
 * @command SET_DEFAULT_CURSOR
 * @text カーソル初期位置設定
 * @desc セーブデータがないときのタイトルコマンドのカーソル初期位置を設定します。
 *
 * @arg index
 * @text カーソル初期位置
 * @desc カーソル初期位置です。(先頭は0)
 * @type number
 * @default 0
 *
 * @help AnotherNewGame.js
 *
 * タイトル画面にもう一つのニューゲームコマンドを追加します。
 * 選択するとニューゲームとは別の指定したマップに移動してゲーム開始します。
 * クリア後のおまけやCG回想モード、スタッフクレジット、ミニゲーム、
 * 隠し要素など使い手次第で様々な用途に使えます。
 *
 * 選択肢は、あらかじめ非表示あるいは選択禁止にできます。
 * これらはプラグインコマンドから解除できます。
 * 解除状態はファイル「anotherNewGame.rmmzsave」に保存されます。
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
 * @param location
 * @text マップ座標
 * @desc 移動先のマップ座標です。指定がない場合、場所移動しません。指定には本体v1.9.0以上が必要です。
 * @default {}
 * @type location
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
 * @param demoWaitFrame
 * @text デモ待機フレーム数
 * @desc 指定したフレーム数ぶん無操作状態が続いたときに開始します。指定するとコマンドには出現しなくなります。
 * @default 0
 * @type number
 *
 * @param switchId
 * @text 開始時有効スイッチ
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
    let localExtraStageIndex = -1;

    const script     = document.currentScript;
    const parameters = PluginManagerEx.createParameter(script);

    PluginManagerEx.registerCommand(script, 'SETTING', args => {
        const index = args.index;
        switch (args.type) {
            case 'VISIBLE':
                ANGSettingManager.setVisible(index, true);
                break;
            case 'ENABLE':
                ANGSettingManager.setEnable(index, true);
                break;
            case 'HIDDEN':
                ANGSettingManager.setVisible(index, false);
                break;
            case 'DISABLE':
                ANGSettingManager.setEnable(index, false);
                break;
            default:
                return;
        }
        ANGSettingManager.save();
    });

    PluginManagerEx.registerCommand(script, 'NEW_GAME_SETTING', args => {
        ANGSettingManager.newGameHidden = args.type === 'HIDDEN';
        ANGSettingManager.save();
    });

    PluginManagerEx.registerCommand(script, 'SET_DEFAULT_CURSOR', args => {
        ANGSettingManager.setDefaultCursorIndex(args.index);
        ANGSettingManager.save();
    });

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
    // Scene_Boot
    //  アナザーニューゲームデータを読み込みます。
    //=============================================================================
    const _Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded;
    Scene_Boot.prototype.onDatabaseLoaded = function() {
        _Scene_Boot_onDatabaseLoaded.apply(this, arguments);
        ANGSettingManager.loadData();
    };

    const _Scene_Boot_isReady    = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        return _Scene_Boot_isReady.apply(this, arguments) && ANGSettingManager.isLoaded();
    };

    //=============================================================================
    // Scene_Title
    //  アナザーニューゲームの選択時の処理を追加定義します。
    //=============================================================================
    const _Scene_Title_commandContinue    = Scene_Title.prototype.commandContinue;
    Scene_Title.prototype.commandContinue = function() {
        _Scene_Title_commandContinue.call(this);
        localExtraStageIndex = -1;
    };

    const _Scene_Title_selectLast    = Window_TitleCommand.prototype.selectLast;
    Window_TitleCommand.prototype.selectLast = function() {
        const index = ANGSettingManager._defaultCursorIndex;
        if (index > 0) {
            this.select(index);
        }
        _Scene_Title_selectLast.apply(this, arguments);
    };

    const _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.apply(this, arguments);
        if (!this.isBusy() && !this._callAnotherNewGame) {
            this.updateWait();
        }
    };

    Scene_Title.prototype.updateWait = function() {
        if (this._commandWindowIndex !== this._commandWindow.index()) {
            this._commandWindowIndex = this._commandWindow.index();
            this._waitFrame = 0;
        } else {
            this._waitFrame++;
        }
        ANGSettingManager.findList(true).forEach(command => {
            if (this._waitFrame >= command.demoWaitFrame) {
                this.callAnotherNewGame(command);
            }
        });
        if (this._callAnotherNewGame) {
            this._commandWindow.open();
            this._commandWindow.deactivate();
        }
    };

    const _Scene_Title_commandNewGameSecond    = Scene_Title.prototype.commandNewGameSecond;
    Scene_Title.prototype.commandNewGameSecond = function(index) {
        if (_Scene_Title_commandNewGameSecond) {
            _Scene_Title_commandNewGameSecond.apply(this, arguments);
        }
        const command = ANGSettingManager.findList(false)[index];
        this.callAnotherNewGame(command);
    };

    Scene_Title.prototype.callAnotherNewGame = function(command) {
        if (command.noFadeout) {
            this._noFadeout = true;
        }
        if (!command.fileLoad) {
            const preMapId  = $dataSystem.startMapId;
            const preStartX = $dataSystem.startX;
            const preStartY = $dataSystem.startY;
            const location  = command.location;
            if (location) {
                $dataSystem.startMapId = location.mapId;
                $dataSystem.startX     = location.x || 0;
                $dataSystem.startY     = location.y || 0;
            }
            this.commandNewGame();
            $dataSystem.startMapId = preMapId;
            $dataSystem.startX     = preStartX;
            $dataSystem.startY     = preStartY;
            const switchId         = command.switchId;
            if (switchId > 0) {
                $gameSwitches.setValue(switchId, true);
            }
        } else {
            this.commandContinue();
            localExtraStageIndex = index;
        }
        this._callAnotherNewGame = true;
    };

    const _Scene_Title_createCommandWindow    = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);
        ANGSettingManager.findList(false).forEach((command, index) => {
            this._commandWindow.setHandler('nameGame2_' + index,
                this.commandNewGameSecond.bind(this, index));
        });
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
    const _Scene_Load_onLoadSuccess    = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function() {
        _Scene_Load_onLoadSuccess.call(this);
        if (localExtraStageIndex >= 0) {
            const command = parameters.anotherDataList[localExtraStageIndex];
            const mapId   = command.mapId;
            if (mapId > 0) {
                const x = command.mapX || 1;
                const y = command.mapY || 1;
                $gamePlayer.reserveTransfer(mapId, x, y);
            }
            $gameMap.abortInterpreter();
            DataManager.selectSavefileForNewGame();
            const switchId = command.switchId;
            if (switchId > 0) {
                $gameSwitches.setValue(switchId, true);
            }
        }
    };

    //=============================================================================
    // Window_TitleCommand
    //  アナザーニューゲームの選択肢を追加定義します。
    //=============================================================================
    const _Window_TitleCommand_makeCommandList    = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.call(this);
        ANGSettingManager.findList(false).forEach(command => {
            const index = parameters.anotherDataList.indexOf(command);
            this.makeAnotherNewGameCommand(command, index);
        });
        if (ANGSettingManager.newGameHidden) {
            this.eraseCommandNewGame();
        }
        this.height = this.fittingHeight(this._list.length);
        this.createContents();
        this.updatePlacement();
    };

    Window_TitleCommand.prototype.makeAnotherNewGameCommand = function(command, index) {
        this.addCommand(command.name, 'nameGame2_' + index, ANGSettingManager.isEnable(index));
        const addPosition = command.addPosition;
        if (addPosition > 0) {
            const anotherCommand = this._list.pop();
            this._list.splice(addPosition - 1, 0, anotherCommand);
        }
    };

    Window_TitleCommand.prototype.eraseCommandNewGame = function() {
        this._list = this._list.filter(function(command) {
            return command.symbol !== 'newGame';
        });
    };

    Window_TitleCommand.prototype.updatePlacement = function() {
        const addSize = this._list.length - 3;
        if (addSize > 0) {
            this.y -= addSize * this.itemHeight() / 2;
        }
    };

    //=============================================================================
    // ANGManager
    //  アナザーニューゲームの設定ファイルのセーブとロードを定義します。
    //=============================================================================
    function ANGSettingManager() {
        throw new Error('This is a static class');
    }

    ANGSettingManager._fileName = 'anotherNewGame';

    ANGSettingManager._visibleList  = [];
    ANGSettingManager._enableList   = [];
    ANGSettingManager.newGameHidden = false;
    ANGSettingManager._defaultCursorIndex = parameters.defaultCursorIndex;

    ANGSettingManager.make = function() {
        const info         = {};
        info.visibleList   = this._visibleList;
        info.enableList    = this._enableList;
        info.newGameHidden = this.newGameHidden;
        info.cursorIndex   = this._defaultCursorIndex;
        return info;
    };

    ANGSettingManager.isVisible = function(index) {
        if (this._visibleList[index] !== undefined && this._visibleList[index] !== null) {
            return this._visibleList[index];
        } else {
            return !parameters.anotherDataList[index].hidden;
        }
    };

    ANGSettingManager.setVisible = function(index, value) {
        this._visibleList[index] = value;
    };

    ANGSettingManager.isEnable = function(index) {
        if (this._enableList[index] !== undefined && this._enableList[index] !== null) {
            return this._enableList[index];
        } else {
            return !parameters.anotherDataList[index].disable;
        }
    };

    ANGSettingManager.findList = function (waitFlag) {
        return parameters.anotherDataList.filter((command, index) => {
            return this.isVisible(index) && command.demoWaitFrame > 0 === waitFlag;
        });
    }

    ANGSettingManager.setEnable = function(index, value) {
        this._enableList[index] = value;
    };

    ANGSettingManager.setDefaultCursorIndex = function(index) {
        this._defaultCursorIndex = index;
    }

    ANGSettingManager.loadData = function() {
        StorageManager.loadObject(this._fileName).then(info => {
            this._visibleList  = info.visibleList || [];
            this._enableList   = info.enableList || [];
            this.newGameHidden = !!info.newGameHidden;
            this._defaultCursorIndex = info.cursorIndex || parameters.defaultCursorIndex;
            this._loaded       = true;
        }).catch(() => {
            this._loaded = true;
        });
    };

    ANGSettingManager.isLoaded = function() {
        return this._loaded;
    };

    ANGSettingManager.save = function() {
        StorageManager.saveObject(this._fileName, ANGSettingManager.make());
    };
})();
