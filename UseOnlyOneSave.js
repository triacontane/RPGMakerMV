//=============================================================================
// UseOnlyOneSave.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2023/06/25 MZで動作するよう修正
// 1.1.4 2018/01/06 1.1.3の修正でセーブ画面に遷移するとゲームが停止する不具合を修正
// 1.1.3 2018/01/05 マップ画面からスクリプトでロード実行されたときに、エラーが発生する場合がある問題を修正
// 1.1.2 2017/12/02 MenuCommonEvent.jsとの競合を解消
// 1.1.1 2017/11/19 イベントからセーブした場合、ロード直後に再セーブされてしまう問題を修正
// 1.1.0 2017/11/18 メニュー画面でセーブしたときに通知する機能を追加
// 1.0.2 2017/11/12 オンラインストレージ使用時にセーブするとたまにエラーになる現象を修正
// 1.0.1 2017/11/11 ロード成功時にBGMが再生されないことがある問題を修正
// 1.0.0 2017/11/10 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 単一セーブデータプラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/UseOnlyOneSave.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 *
 * @param saveMessage
 * @text セーブメッセージ
 * @desc メニュー画面でのセーブ実行時に表示するメッセージです。指定しない場合は表示されません。
 * @default プレイデータをセーブしました。
 *
 * @help UseOnlyOneSave.js
 *
 * ロードもしくはセーブ時に各画面を経由せず、ファイル1のみを
 * 常に使用するように変更します。
 * オートセーブを有効にしている場合は、ロード時に最新データが
 * ロード対象となります。
 *
 * このプラグインにはプラグインコマンドはありません。
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

    //=============================================================================
    // SceneManager
    //  セーブ画面もしくはロード画面への遷移を中止します。
    //=============================================================================
    const _SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function(sceneClass) {
        const result = this.cutSaveScene(sceneClass);
        if (!result) {
            _SceneManager_goto.apply(this, arguments);
        }
    };

    const _SceneManager_push = SceneManager.push;
    SceneManager.push = function(sceneClass) {
        const result = this.cutSaveScene(sceneClass);
        if (!result) {
            _SceneManager_push.apply(this, arguments);
        }
    };

    SceneManager.cutSaveScene = function(sceneClass) {
        if (sceneClass === Scene_Save || sceneClass === Scene_Load) {
            const sceneFile = new sceneClass();
            sceneFile.onSavefileOk();
            if (sceneClass === Scene_Load && this._scene instanceof Scene_Map) {
                $dataMap.loadFromMap = true;
                $gameSystem.onAfterLoad();
            }
            return true;
        }
        return false;
    };

    const _Scene_File_isSavefileEnabled = Scene_File.prototype.isSavefileEnabled;
    Scene_File.prototype.isSavefileEnabled = function(savefileId) {
        if (!this._listWindow) {
            return true;
        }
        return _Scene_File_isSavefileEnabled.apply(this, arguments);
    };

    //=============================================================================
    // Scene_Menu
    //  セーブ通知を実装します。
    //=============================================================================
    Scene_Menu.prototype.isExistHelpNotice = function() {
        return !!param.saveMessage;
    };

    const _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.apply(this, arguments);
        if (this.isExistHelpNotice()) {
            this.createSaveNoticeWindow();
        }
    };

    Scene_Menu.prototype.createSaveNoticeWindow = function() {
        this.createHelpWindow();
        this._helpWindow.y = Graphics.boxHeight - this._helpWindow.height;
        this._helpWindow.openness = 0;
        this._helpWindow.setText(param.saveMessage);
    };

    const _Scene_Menu_helpAreaHeight = Scene_Menu.prototype.helpAreaHeight;
    Scene_Menu.prototype.helpAreaHeight = function() {
        if (this.isExistHelpNotice()) {
            return Scene_MenuBase.prototype.helpAreaHeight.call(this);
        } else {
            return _Scene_Menu_helpAreaHeight.apply(this, arguments);
        }
    };

    const _Scene_Menu_mainAreaHeight = Scene_Menu.prototype.mainAreaHeight;
    Scene_Menu.prototype.mainAreaHeight = function() {
        const result = _Scene_Menu_mainAreaHeight.apply(this, arguments);
        if (this.isExistHelpNotice()) {
            return result + this.helpAreaHeight();
        } else {
            return result;
        }
    };

    const _Scene_Menu_commandSave = Scene_Menu.prototype.commandSave;
    Scene_Menu.prototype.commandSave = function() {
        _Scene_Menu_commandSave.apply(this, arguments);
        if (this.isExistHelpNotice()) {
            this.setupHelpNotice();
        }
        this._commandWindow.activate();
    };

    Scene_Menu.prototype.setupHelpNotice = function() {
        this._savePopDuration = 120;
        this._helpWindow.open();
    };

    // Resolve conflict for plugin to override Scene_MenuBase or Scene_Base
    const _Scene_Menu_update = Scene_Menu.prototype.hasOwnProperty('update') ? Scene_Menu.prototype.update : null;
    Scene_Menu.prototype.update = function() {
        if (_Scene_Menu_update) {
            _Scene_Menu_update.apply(this, arguments);
        } else {
            Scene_MenuBase.prototype.update.apply(this, arguments);
        }
        if (this._savePopDuration > 0) {
            this.updateHelpNotice();
        }
    };

    Scene_Menu.prototype.updateHelpNotice = function() {
        this._savePopDuration--;
        if (this._savePopDuration === 0) {
            this._helpWindow.close();
        }
    };

    //=============================================================================
    // Scene_File
    //  セーブファイルIDを1に限定します。
    //=============================================================================
    Scene_File.prototype.savefileId = function() {
        return 1;
    };

    Scene_File.prototype.popScene = function() {
        // do nothing
    };

    Scene_Load.prototype.savefileId = function() {
        if (this.isAutosaveEnabled()) {
            return DataManager.latestSavefileIdIncludeAuto();
        } else {
            return Scene_File.prototype.savefileId.apply(this, arguments);
        }
    };

    //=============================================================================
    // Scene_Title
    //  ロード成功時にBGMを再生します。
    //=============================================================================
    const _Scene_Title_commandContinue = Scene_Title.prototype.commandContinue;
    Scene_Title.prototype.commandContinue = function() {
        this.fadeOutAll();
        _Scene_Title_commandContinue.apply(this, arguments);
        this._loadSuccess = true;
    };

    const _Scene_Title_terminate = Scene_Title.prototype.terminate;
    Scene_Title.prototype.terminate = function() {
        _Scene_Title_terminate.apply(this, arguments);
        if (this._loadSuccess) {
            $gameSystem.onAfterLoad();
        }
    };

    //=============================================================================
    // Scene_Map
    //  マップ画面からロードが実行された場合に、マップデータがロードされるまで処理を中断します
    //=============================================================================
    const _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function() {
        if ($dataMap.loadFromMap) {
            return;
        }
        _Scene_Map_updateMain.apply(this, arguments);
    };

    //=============================================================================
    // Game_Interpreter
    //  イベントからセーブ時にインデックスを進めます。
    //=============================================================================
    const _Game_Interpreter_command352 = Game_Interpreter.prototype.command352;
    Game_Interpreter.prototype.command352 = function() {
        // Resolves of being saved again when loading.
        if (!$gameParty.inBattle()) {
            this._index++;
        }
        _Game_Interpreter_command352.apply(this, arguments);
    };

    DataManager.latestSavefileIdIncludeAuto = function() {
        const globalInfo = this._globalInfo;
        const validInfo = globalInfo.filter(x => x);
        const latest = Math.max(...validInfo.map(x => x.timestamp));
        const index = globalInfo.findIndex(x => x && x.timestamp === latest);
        return index > 0 ? index : 0;
    };
})();

