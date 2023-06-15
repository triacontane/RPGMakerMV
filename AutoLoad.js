//=============================================================================
// AutoLoad.js
// ----------------------------------------------------------------------------
// (C)2021 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2023/06/15 最新データの判定処理にオートセーブのデータが含まれていなかった問題を修正
// 1.1.0 2023/03/07 ロード成功時、マップが更新されていてもリロードされない問題を修正
// 1.0.1 2021/04/17 ロードタイミングを項目追加にしたときは追加した項目が初期選択されるよう修正
// 1.0.0 2021/04/11 MZ版初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 自動ロードプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/AutoLoad.js
 * @author トリアコンタン
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 *
 * @param loadTiming
 * @text ロードタイミング
 * @desc セーブファイルが存在する場合の自動ロードが行われるタイミングです。
 * @default continue
 * @type select
 * @option デフォルト項目『コンティニュー』を選択したとき
 * @value continue
 * @option ゲームを起動したとき(タイトル画面は完全に省略)
 * @value gameStart
 * @option 追加した項目を選択したとき
 * @value additional
 *
 * @param commandName
 * @text 追加コマンド名
 * @desc ロードタイミングを『追加した項目を選択したとき』にした場合の追加項目名です。
 * @default 最新データをロード
 *
 * @param commandIndex
 * @text 追加コマンドインデックス
 * @desc ロードタイミングを『追加した項目を選択したとき』にした場合の追加項目の表示インデックスです。
 * @default 0
 * @type number
 *
 * @command SAVE_TO_LOAD_DATA
 * @text ロードしたデータにセーブ
 * @desc ロードしたデータにセーブします。ニューゲームから開始した場合は新規でデータ作成します。
 *
 * @help AutoLoad.js
 *
 * ひとつ以上のセーブファイルが存在するとき、
 * 最新のセーブデータを自動で選択してロードする機能を提供します。
 * 自動ロードのタイミングはパラメータから選択可能です。
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

    PluginManagerEx.registerCommand(script, 'SAVE_TO_LOAD_DATA', function() {
        this._index++;
        DataManager.saveGameCurrent();
        this._index--;
        SoundManager.playSave();
    });

    DataManager.saveGameCurrent = function() {
        $gameSystem.onBeforeSave();
        this.saveGame($gameSystem.savefileId());
    };

    DataManager.loadGameLatest = function() {
        if (this.isAnySavefileExists()) {
            return this.loadGame(this.latestSavefileIdIncludeAuto());
        } else {
            return null;
        }
    };

    DataManager.latestSavefileIdIncludeAuto = function() {
        const globalInfo = this._globalInfo;
        const validInfo = globalInfo.filter(x => x);
        const latest = Math.max(...validInfo.map(x => x.timestamp));
        const index = globalInfo.findIndex(x => x && x.timestamp === latest);
        return index > 0 ? index : 0;
    };

    const _Scene_Title_create = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_create.apply(this, arguments);
        if (isGameStartLoad()) {
            this.commandAutoLoad();
        }
    };

    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.apply(this, arguments);
        if (isAdditionalLoad()) {
            this._commandWindow.setHandler("additionalContinue", this.commandAutoLoad.bind(this));
        }
    };

    const _Scene_Title_commandWindowRect = Scene_Title.prototype.commandWindowRect;
    Scene_Title.prototype.commandWindowRect = function() {
        const rect = _Scene_Title_commandWindowRect.apply(this, arguments);
        if (isAdditionalLoad()) {
            rect.height += this.calcWindowHeight(1, true) - $gameSystem.windowPadding() * 2;
        }
        return rect;
    };

    const _Scene_Title_updateColorFilter = Scene_Title.prototype.updateColorFilter;
    Scene_Title.prototype.updateColorFilter = function() {
        if (isGameStartLoad()) {
            this._fadeOpacity = 255;
        }
        _Scene_Title_updateColorFilter.apply(this, arguments);
    };

    const _Scene_Title_playTitleMusic = Scene_Title.prototype.playTitleMusic;
    Scene_Title.prototype.playTitleMusic = function() {
        if (isGameStartLoad()) {
            return;
        }
        _Scene_Title_playTitleMusic.apply(this, arguments);
    };

    const _Scene_Title_commandContinue = Scene_Title.prototype.commandContinue;
    Scene_Title.prototype.commandContinue = function() {
        if (isContinueLoad()) {
            this.commandAutoLoad();
        } else {
            _Scene_Title_commandContinue.apply(this, arguments);
        }
    };

    Scene_Title.prototype.commandAutoLoad = function() {
        const promise = DataManager.loadGameLatest();
        if (!promise) {
            this.commandNewGame();
            return;
        }
        promise.then(() => {
            this._commandWindow.close();
            this.fadeOutAll();
            this.reloadMapIfUpdated();
            this._loadSuccess = true;
            SceneManager.goto(Scene_Map);
        });
    };

    Scene_Title.prototype.reloadMapIfUpdated = function() {
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            const mapId = $gameMap.mapId();
            const x = $gamePlayer.x;
            const y = $gamePlayer.y;
            const d = $gamePlayer.direction();
            $gamePlayer.reserveTransfer(mapId, x, y, d, 0);
            $gamePlayer.requestMapReload();
        }
    };

    const _Scene_Title_terminate = Scene_Title.prototype.terminate;
    Scene_Title.prototype.terminate = function() {
        _Scene_Title_terminate.apply(this, arguments);
        if (this._loadSuccess) {
            $gameSystem.onAfterLoad();
        }
    };

    const _Window_TitleCommand_selectLast = Window_TitleCommand.prototype.selectLast;
    Window_TitleCommand.prototype.selectLast = function() {
        if (!Window_TitleCommand._lastCommandSymbol && this.isContinueEnabled() && isAdditionalLoad()) {
            this.selectSymbol("additionalContinue");
        } else {
            _Window_TitleCommand_selectLast.apply(this, arguments);
        }
    };

    const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _Window_TitleCommand_makeCommandList.apply(this, arguments);
        if (isAdditionalLoad()) {
            this.addCommand(param.commandName, 'additionalContinue', this.isContinueEnabled());
            if (param.commandIndex) {
                const command = this._list.pop();
                this._list.splice(param.commandIndex, 0, command);
            }
        }
    };

    function isGameStartLoad() {
        return param.loadTiming === 'gameStart';
    }

    function isContinueLoad() {
        return param.loadTiming === 'continue';
    }

    function isAdditionalLoad() {
        return param.loadTiming === 'additional';
    }
})();
