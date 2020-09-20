//=============================================================================
// BackUpDatabase.js
// ----------------------------------------------------------------------------
// (C)2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2020/09/20 リファクタリング
// 2.0.0 2020/09/19 MZ版として非同期処理で全面的に再構築
// 1.1.1 2018/05/13 1.1.0でエラーになる問題を修正
// 1.1.0 2018/05/13 バックアップフォルダを時間単位で作成できる機能を追加
// 1.0.0 2018/04/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc BackUpDatabasePlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BackUpDatabase.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param backUpPathText
 * @desc The output path of the file. Relative and absolute paths are available.
 * @default /backup
 *
 * @param includeSave
 * @desc The folder that contains the saved data will also be backed up.
 * @default false
 * @type boolean
 *
 * @param timeUnit
 * @desc When enabled, creates a folder by time. If disabled, folders are created by date.
 * @default false
 * @type boolean
 *
 * @help BackUpDatabase.js
 *
 * Each time you start the game, you copy a set of data folders to a designated location.
 * The folders are stored by date and there is no limit.
 * This plugin only works during test play.
 * It won't do anything in normal play, combat testing, event testing, or browser play.
 * Please note that although the plugin has been thoroughly tested, the
 * This plugin does not guarantee that the project will always be restored in the event of a problem.
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc データバックアッププラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/BackUpDatabase.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param backUpPathText
 * @text バックアップパス
 * @desc ファイルの出力パスです。相対パス、絶対パスが利用できます。
 * @default /backup
 *
 * @param includeSave
 * @text セーブデータも含む
 * @desc セーブデータが含まれているフォルダもバックアップの対象にします。
 * @default false
 * @type boolean
 *
 * @param timeUnit
 * @text 時間単位でフォルダ作成
 * @desc 有効にすると時間単位でフォルダを作成します。無効にすると日付単位でフォルダを作成します。
 * @default false
 * @type boolean
 *
 * @help BackUpDatabase.js
 *
 * ゲームを起動するたびにデータフォルダ一式を所定の場所にコピーします。
 * フォルダは日付ごとに蓄積され、上限はありません。
 * このプラグインはテストプレー時のみ効果があります。
 * 通常プレー、戦闘テスト、イベントテスト、ブラウザプレーでは何もしません。
 * なお、プラグインの動作テストは十分に行っていますが、
 * 当プラグインは問題発生時のプロジェクト復元を常に保証するものではありません。
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

    if (!Utils.isNwjs()) {
        return;
    }
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    const _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize = function() {
        _SceneManager_initialize.apply(this, arguments);
        DataManager.backupAllData();
    };

    DataManager.backupAllData = function() {
        if (!Utils.isOptionValid('test') || this.isBattleTest() || this.isEventTest()) {
            return;
        }
        BackUpUtil.backup().then(() => {
            console.log(`Backup complete by ${PluginManagerEx.findPluginName(script)}`);
        });
    };

    /**
     * BackUpUtil
     *  バックアップファイルを作成するためのユーティリティです。
     */
    class BackUpUtil {

        static async backup() {
            this._date = new Date();
            await this._copy('data');
            await this._copy('', /\w+\.rmmzproject/);
            if (param.includeSave) {
                await this._copy('save');
            }
        }

        static async _copy(targetDirectory, regExp = null) {
            const src = this._getProjectPath(targetDirectory);
            const dist = this._getBackupPath(targetDirectory);
            const copyModel = new FileCopyModel(src, dist);
            await copyModel.copyAllFiles(regExp);
        }

        static _getProjectPath(directory) {
            const path = require('path');
            const base = path.dirname(process.mainModule.filename);
            return path.join(base, `${directory}/`);
        }

        static _getBackupPath(dirName) {
            const root = this._getBackupRoot();
            if (!dirName) {
                return root;
            }
            const year = this._date.getFullYear();
            const month = (this._date.getMonth() + 1).padZero(2);
            const day = this._date.getDate().padZero(2);
            return `${root}${dirName}_${year}-${month}-${day}${this._getTimeText()}/`;
        }

        static _getBackupRoot() {
            const filePath = param.backUpPathText;
            if (!filePath.match(/^[A-Z]:/)) {
                return this._getProjectPath(filePath);
            }
            return filePath.match(/\/$/) ? filePath : filePath + '/';
        };

        static _getTimeText() {
            if (!param.timeUnit) {
                return '';
            }
            const hour = this._date.getHours().padZero(2);
            const minute = this._date.getMinutes().padZero(2);
            const second = this._date.getSeconds().padZero(2);
            return `_${hour}${minute}${second}`;
        }
    }

    /**
     * FileCopyModel
     * 再帰的な非同期ファイルコピーを実装します。
     */
    class FileCopyModel {
        constructor(src, dist) {
            this._fs = require('fs').promises;
            this._src = src;
            this._dist = dist;
        }

        async copyAllFiles(fileReqExp = null) {
            await this._fs.mkdir(this._dist, {recursive: true});
            const dirents = await this._fs.readdir(this._src, {withFileTypes: true});
            for (const dirent of dirents) {
                const name = dirent.name;
                if (fileReqExp && !fileReqExp.test(name)) {
                    continue;
                }
                if (dirent.isDirectory()) {
                    await this._copyDirectory(name + '/');
                } else {
                    await this._copyFile(name);
                }
            }
        }

        async _copyDirectory(dirName) {
            const path = require('path');
            const src = path.join(this._src, dirName);
            const dist = path.join(this._dist, dirName);
            await this._fs.mkdir(dist, {recursive: true});
            const subCopyModel = new FileCopyModel(src, dist);
            await subCopyModel.copyAllFiles();
        }

        async _copyFile(fileName) {
            const src = this._src + fileName;
            const dist = this._dist + fileName;
            await this._fs.copyFile(src, dist);
        }
    }
})();
